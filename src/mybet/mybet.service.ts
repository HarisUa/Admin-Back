import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Op, Order, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { PromotionModel } from '@src/promotions/model/promotion.model';
import { GET_RECORDS_QUERY_STATUSES } from '@common';

import { CreateMybetDto } from './dto/create-mybet.dto';
import { GetMybetQueryDto } from './dto/get-mybet-query.dto';
import { UpdateMybetDto } from './dto/update-mybet.dto';
import { MybetModel } from './models/mybet.model';

/**
 * To serve requests from mybets controller
 * @export
 * @class MybetService
 */
@Injectable()
export class MybetService {
  /**
   * Creates an instance of MybetService.
   * @param {typeof MybetModel} mybetModel sequelize mybet model
   * @param {typeof PromotionModel} promotionModel sequelize promotion model
   */
  constructor(
    @InjectModel(MybetModel)
    private readonly mybetModel: typeof MybetModel,

    // @InjectModel(PromotionModel)
    // private readonly promotionModel: typeof PromotionModel,
  ) {}

  /**
   * To create 
   * @param {CreateMybetDto} createMybetDto
   * @param {string} userId
   */
  async create(createMybetDto: CreateMybetDto, userId: string) {
    // if active then date till must be required
    if (createMybetDto.mybetStatus && !createMybetDto.deletedAt) {
      throw new BadRequestException('Active message must have till date');
    }
    // validate send to all functionality
    // if (!createMybetDto.sendToAll && !createMybetDto.includedExcludedUsers?.length) {
    //   throw new BadRequestException('If send to all is false then provide users to include');
    // }
    // validate promotion is exist or not
    // if (createMybetDto.promotionId && !(await this.promotionModel.count({ where: { promotionId: createMybetDto.promotionId } }))) {
    //   throw new BadRequestException('Promotion with given promotion id is not exist');
    // }

    const mybetMessage = this.mybetModel.build();

    if (createMybetDto.mybetStatus && !createMybetDto.createdAt) {
      createMybetDto.createdAt = new Date();
    }

    mybetMessage.set({
      ...createMybetDto,
      // createdBy: userId,
      modifiedBy: userId,
    });

    await mybetMessage.save();

    return mybetMessage.get({ plain: true });
  }

  /**
   * To get list of messages by pagination
   * @param {GetMybetQueryDto} queryParams
   * @returns list of messages
   */
  async findAll(queryParams: GetMybetQueryDto) {
    const currentTime = new Date();

    // get limit, offset, order and sortBy
    const { limit, offset, order, sortBy } = queryParams.getPaginationInfo();

    const filterQuery: WhereOptions<MybetModel> = {};

    // based on status define query
    if (queryParams.status === GET_RECORDS_QUERY_STATUSES.ACTIVE) {
      filterQuery.mybetStatus = true;
      // filterQuery.createdAt = { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] };
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.INACTIVE) {
      filterQuery.mybetStatus = false;
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.EXPIRED) {
      // filterQuery.mybetStatus = true;
      filterQuery.updatedAt = { [Op.lte]: currentTime };
    }
    // get messages and total messages count
    const { rows: mybets, count: totalMybets } = await this.mybetModel.findAndCountAll({
      where: filterQuery,
      order: [[sortBy || 'createdAt', order]],
      limit,
      offset,
    });

    return { mybets, totalMybets };
  }

  /**
   * To get statistics of mybet
   * @return mybet statistics
   */
  async findStatistics() {
    const currentTime = new Date();

    // find active, expired and in-active counts
    const [active, expired, inActive] = await Promise.all([
      this.mybetModel.count({ where: { mybetStatus: true } }),
      this.mybetModel.count({ where: { mybetStatus: true, deletedAt: { [Op.lte]: currentTime } } }),
      this.mybetModel.count({ where: { mybetStatus: false } }),
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
  // async getMybetDropdown() {
  //   // get promotions
  //   const promotions = await this.promotionModel.findAll({ where: { isActive: true }, attributes: ['promotionId', 'promotionName'], raw: true });

  //   // convert promotions to dropdown options
  //   const promotionsDropdown = promotions.map((promotion) => ({ key: promotion.promotionName, value: promotion.promotionId }));

  //   return { promotions: promotionsDropdown };
  // }

  /**
   * To get one message details
   * @param {string} mybetId to fetch message details
   * @returns message details
   */
  async findOne(mybetId: string) {
    const mybetMessage = await this.mybetModel.findOne({ where: { mybetId } });
    if (!mybetMessage) {
      throw new UnprocessableEntityException('Message not found with given message id');
    }
    return mybetMessage.get({ plain: true });
  }

  /**
   * To update one mybet
   * @param {string} mybetId id of mybet to update
   * @param {UpdateMybetDto} updateMybetDto updated mybet details
   * @param {string} userId current user id
   * @returns updated mybet details
   */
  async update(mybetId: string, updateMybetDto: UpdateMybetDto, userId: string) {
    // fetch message details
    const mybetMessage = await this.mybetModel.findOne({ where: { mybetId } });
    if (!mybetMessage) {
      throw new UnprocessableEntityException('Message not found with given message id');
    }
    // if active then date till must be required
    if (!updateMybetDto.mybetStatus && !updateMybetDto.deletedAt) {
      throw new BadRequestException('Active message must have till date');
    }
    // validate send to all functionality
    // if (!updateMybetDto.sendToAll && !updateMybetDto.includedExcludedUsers?.length) {
    //   throw new BadRequestException('If send to all is false then provide users to include');
    // }
    // to set date from current date when date from is not provided and set message to active from in-active
    // if (updateMessageDto.isActive && updateMessageDto.isActive !== message.mybetStatus && !updateMessageDto.dateFrom) {
    //   updateMessageDto.dateFrom = new Date();
    // }

    // validate new promotion id if it changed
    // if (updateMessageDto.promotionId && message.promotionId !== updateMessageDto.promotionId) {
    //   if (!(await this.promotionModel.count({ where: { promotionId: updateMessageDto.promotionId } }))) {
    //     throw new BadRequestException('Promotion with given promotion id is not exist');
    //   }
    // }
    mybetMessage.set({ ...updateMybetDto, modifiedBy: userId });
    await mybetMessage.save();
    return mybetMessage.get({ plain: true });
  }

  /**
   * To remove message
   * @param {string} mybetId id of message
   */
  async remove(mybetId: string, userId: string) {
    const mybetMessage = await this.mybetModel.findByPk(mybetId);
    if (!mybetMessage) {
      throw new UnprocessableEntityException('Message not found with given message id');
    }
    mybetMessage.modifiedBy = userId;
    await mybetMessage.destroy();
  }
}
