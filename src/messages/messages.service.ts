import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Op, Order, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { PromotionModel } from '@src/promotions/model/promotion.model';
import { GET_RECORDS_QUERY_STATUSES } from '@common';

import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessageQueryDto } from './dto/get-message-query.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageModel } from './models/message.model';

/**
 * To serve requests from messages controller
 * @export
 * @class MessagesService
 */
@Injectable()
export class MessagesService {
  /**
   * Creates an instance of MessagesService.
   * @param {typeof MessageModel} messageModel sequelize message model
   * @param {typeof PromotionModel} promotionModel sequelize promotion model
   */
  constructor(
    @InjectModel(MessageModel)
    private readonly messageModel: typeof MessageModel,

    @InjectModel(PromotionModel)
    private readonly promotionModel: typeof PromotionModel,
  ) {}

  /**
   * To create message
   * @param {CreateMessageDto} createMessageDto
   * @param {string} userId
   */
  async create(createMessageDto: CreateMessageDto, userId: string) {
    // if active then date till must be required
    if (createMessageDto.isActive && !createMessageDto.dateTill) {
      throw new BadRequestException('Active message must have till date');
    }
    // validate send to all functionality
    if (!createMessageDto.sendToAll && !createMessageDto.includedExcludedUsers?.length) {
      throw new BadRequestException('If send to all is false then provide users to include');
    }
    // validate promotion is exist or not
    if (createMessageDto.promotionId && !(await this.promotionModel.count({ where: { promotionId: createMessageDto.promotionId } }))) {
      throw new BadRequestException('Promotion with given promotion id is not exist');
    }

    const message = this.messageModel.build();

    if (createMessageDto.isActive && !createMessageDto.dateFrom) {
      createMessageDto.dateFrom = new Date();
    }

    message.set({
      ...createMessageDto,
      createdBy: userId,
      updatedBy: userId,
    });

    await message.save();

    return message.get({ plain: true });
  }

  /**
   * To get list of messages by pagination
   * @param {GetMessageQueryDto} queryParams
   * @returns list of messages
   */
  async findAll(queryParams: GetMessageQueryDto) {
    const currentTime = new Date();

    // get limit, offset, order and sortBy
    const { limit, offset, order, sortBy } = queryParams.getPaginationInfo();

    const filterQuery: WhereOptions<MessageModel> = {};

    // based on status define query
    if (queryParams.status === GET_RECORDS_QUERY_STATUSES.ACTIVE) {
      filterQuery.isActive = true;
      filterQuery.dateTill = { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] };
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.INACTIVE) {
      filterQuery.isActive = false;
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.EXPIRED) {
      filterQuery.isActive = true;
      filterQuery.dateTill = { [Op.lte]: currentTime };
    }
    // get messages and total messages count
    const { rows: messages, count: totalMessages } = await this.messageModel.findAndCountAll({
      where: filterQuery,
      order: [[sortBy || 'createdAt', order]],
      limit,
      offset,
    });

    return { messages, totalMessages };
  }

  /**
   * To get statistics of messages
   * @return messages statistics
   */
  async findStatistics() {
    const currentTime = new Date();

    // find active, expired and in-active counts
    const [active, expired, inActive] = await Promise.all([
      this.messageModel.count({ where: { isActive: true, dateTill: { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] } } }),
      this.messageModel.count({ where: { isActive: true, dateTill: { [Op.lte]: currentTime } } }),
      this.messageModel.count({ where: { isActive: false } }),
    ]);

    return {
      [GET_RECORDS_QUERY_STATUSES.ACTIVE]: active,
      [GET_RECORDS_QUERY_STATUSES.EXPIRED]: expired,
      [GET_RECORDS_QUERY_STATUSES.INACTIVE]: inActive,
    };
  }

  /**
   * To get dropdown list to use in messages
   * @returns dropdown list object
   */
  async getMessagesDropdown() {
    // get promotions
    const promotions = await this.promotionModel.findAll({ where: { isActive: true }, attributes: ['promotionId', 'promotionName'], raw: true });

    // convert promotions to dropdown options
    const promotionsDropdown = promotions.map((promotion) => ({ key: promotion.promotionName, value: promotion.promotionId }));

    return { promotions: promotionsDropdown };
  }

  /**
   * To get one message details
   * @param {string} messageId to fetch message details
   * @returns message details
   */
  async findOne(messageId: string) {
    const message = await this.messageModel.findOne({ where: { messageId } });
    if (!message) {
      throw new UnprocessableEntityException('Message not found with given message id');
    }
    return message.get({ plain: true });
  }

  /**
   * To update one message
   * @param {string} messageId id of message to update
   * @param {UpdateMessageDto} updateMessageDto updated message details
   * @param {string} userId current user id
   * @returns updated message details
   */
  async update(messageId: string, updateMessageDto: UpdateMessageDto, userId: string) {
    // fetch message details
    const message = await this.messageModel.findOne({ where: { messageId } });
    if (!message) {
      throw new UnprocessableEntityException('Message not found with given message id');
    }
    // if active then date till must be required
    if (!updateMessageDto.isActive && !updateMessageDto.dateTill) {
      throw new BadRequestException('Active message must have till date');
    }
    // validate send to all functionality
    if (!updateMessageDto.sendToAll && !updateMessageDto.includedExcludedUsers?.length) {
      throw new BadRequestException('If send to all is false then provide users to include');
    }
    // to set date from current date when date from is not provided and set message to active from in-active
    if (updateMessageDto.isActive && updateMessageDto.isActive !== message.isActive && !updateMessageDto.dateFrom) {
      updateMessageDto.dateFrom = new Date();
    }

    // validate new promotion id if it changed
    if (updateMessageDto.promotionId && message.promotionId !== updateMessageDto.promotionId) {
      if (!(await this.promotionModel.count({ where: { promotionId: updateMessageDto.promotionId } }))) {
        throw new BadRequestException('Promotion with given promotion id is not exist');
      }
    }
    message.set({ ...updateMessageDto, updatedBy: userId });
    await message.save();
    return message.get({ plain: true });
  }

  /**
   * To remove message
   * @param {string} messageId id of message
   */
  async remove(messageId: string, userId: string) {
    const message = await this.messageModel.findByPk(messageId);
    if (!message) {
      throw new UnprocessableEntityException('Message not found with given message id');
    }
    message.updatedBy = userId;
    await message.destroy();
  }
}
