import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Op, Order, WhereOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
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
    const mybet = this.mybetModel.build();

    mybet.set({
      ...createMybetDto,
      updatedBy: userId,
    });
    await mybet.save();
    return mybet.get({ plain: true });
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
      filterQuery.isActive = true;
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.INACTIVE) {
      filterQuery.isActive = false;
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.ALL) {
      filterQuery.createdAt = { [Op.lte]: currentTime };
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

    // find active, in-active and all counts
    const [active, inActive, all ] = await Promise.all([
      this.mybetModel.count({ where: { isActive: true } }), //deletedAt: { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] } ,
      this.mybetModel.count({ where: { isActive: false} }),
      this.mybetModel.count({ where: { createdAt : { [Op.lte]: currentTime}} }), 
    ]);

    return {
      [GET_RECORDS_QUERY_STATUSES.ACTIVE]: active,
      [GET_RECORDS_QUERY_STATUSES.INACTIVE]: inActive,
      [GET_RECORDS_QUERY_STATUSES.ALL]: all,
    };
  }

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
    const mybet = await this.mybetModel.findOne({ where: { mybetId } });
    if (!mybet) {
      throw new UnprocessableEntityException('Mybet not found with given regulation id');
    }
    mybet.set({ ...updateMybetDto });
    mybet.set('updatedBy', userId);
    await mybet.save();
    return mybet.get({ plain: true });
  }

  /**
   * To remove mybet
   * @param {string} mybetId id of mybet
   */
   async remove(mybetId: string) {
    const mybetDeleted = await this.mybetModel.destroy({ where: { mybetId } });
    if (!mybetDeleted) {
      throw new UnprocessableEntityException('Regulation not found with given mybet id');
    }
  }
}
