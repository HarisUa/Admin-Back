import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Order, WhereOptions } from 'sequelize';

import { getNextSortOrder, GET_RECORDS_QUERY_STATUSES, redorderRecords } from '@common';

import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionModel } from './model/promotion.model';
import { GetPromotionQueryDto } from './dto/get-promotion-query.dto';
import { ReorderPromotionsBodyDto } from './dto/reorder-promotions-body.dto';

/**
 * To serve request from PromotionsController
 * @export
 * @class PromotionsService
 */
@Injectable()
export class PromotionsService {
  /**
   * Creates an instance of PromotionsService.
   * @param {typeof PromotionModel} promotionModel sequelize promotion model
   */
  constructor(
    @InjectModel(PromotionModel)
    private readonly promotionModel: typeof PromotionModel,
  ) {}

  /**
   * To create promotion
   * @param {CreatePromotionDto} createPromotionDto promotion details
   * @param {string} userId current user id
   * @return created promotion
   */
  async create(createPromotionDto: CreatePromotionDto, userId: string) {
    const promotion = this.promotionModel.build();
    let maxSortOrder: number = null;

    // add sort order only if promotion marked as active
    if (createPromotionDto.isActive) {
      maxSortOrder = await getNextSortOrder(this.promotionModel);
    }

    promotion.set({
      ...createPromotionDto,
      createdBy: userId,
      updatedBy: userId,
      sortOrder: maxSortOrder,
    });

    await promotion.save();

    return promotion.get({ plain: true });
  }

  /**
   * To get multiple promotions based on query filter options
   * @param {GetPromotionQueryDto} queryParams query filter options
   * @return promotions list
   */
  async findAll(queryParams: GetPromotionQueryDto) {
    let limit: number;
    let offset: number;
    const currentTime = new Date();

    // create filter query
    const order: Order = [];
    order.push('sortOrder');

    const filterQuery: WhereOptions<PromotionModel> = {};

    // based on status define query
    if (queryParams.status === GET_RECORDS_QUERY_STATUSES.ACTIVE) {
      filterQuery.isActive = true;
      filterQuery.dateTill = { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] };
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.INACTIVE) {
      ({ limit, offset } = queryParams.getPaginationInfo());
      filterQuery.isActive = false;
      order.push(['updatedAt', 'DESC']);
    } else if (queryParams.status === GET_RECORDS_QUERY_STATUSES.EXPIRED) {
      ({ limit, offset } = queryParams.getPaginationInfo());
      filterQuery.isActive = true;
      filterQuery.dateTill = { [Op.lte]: currentTime };
    }
    // get promotions and total promotions count
    const { rows: promotions, count: totalPromotions } = await this.promotionModel.findAndCountAll({
      where: filterQuery,
      order,
      limit,
      offset,
    });

    return { promotions, totalPromotions };
  }

  /**
   * To get statistics of promotions
   * @return promotions statistics
   */
  async findStatistics() {
    const currentTime = new Date();

    // find active, expired and in-active counts
    const [active, expired, inActive] = await Promise.all([
      this.promotionModel.count({ where: { isActive: true, dateTill: { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] } } }),
      this.promotionModel.count({ where: { isActive: true, dateTill: { [Op.lte]: currentTime } } }),
      this.promotionModel.count({ where: { isActive: false } }),
    ]);

    return {
      [GET_RECORDS_QUERY_STATUSES.ACTIVE]: active,
      [GET_RECORDS_QUERY_STATUSES.EXPIRED]: expired,
      [GET_RECORDS_QUERY_STATUSES.INACTIVE]: inActive,
    };
  }

  /**
   * To find one promotion
   * @param {string} promotionId promotion to find
   * @return promotion details
   */
  async findOne(promotionId: string) {
    const promotion = await this.promotionModel.findOne({ where: { promotionId } });
    if (!promotion) {
      throw new UnprocessableEntityException('Promotion not found with given promotion id');
    }
    return promotion.toJSON();
  }

  /**
   * To update specific promotion
   * @param {string} promotionId promotion id
   * @param {UpdatePromotionDto} updatePromotionDto update promotion request
   * @param {string} userId current user id
   */
  async update(promotionId: string, updatePromotionDto: UpdatePromotionDto, userId: string) {
    const promotion = await this.promotionModel.findOne({ where: { promotionId } });
    if (!promotion) {
      throw new UnprocessableEntityException('Promotion not found with given promotion id');
    }

    // change sort order with other details
    await this.promotionModel.sequelize.transaction(async (transaction) => {
      let sortOrder = promotion.sortOrder;

      // if marked as inactive from active then remove sort order
      if (promotion.isActive && !updatePromotionDto.isActive) {
        await redorderRecords(promotion.sortOrder, null, this.promotionModel as any, transaction);
        sortOrder = null;
      }
      // if marked as active from inactive then assigned fresh latest sort order
      if (!promotion.isActive && updatePromotionDto.isActive) {
        sortOrder = await getNextSortOrder(this.promotionModel);
      }
      promotion.set({ ...updatePromotionDto, sortOrder, updatedBy: userId });
      await promotion.save({ transaction });
    });
    return promotion.get({ plain: true });
  }

  /**
   * To delete promotion
   * @param {string} promotionId promotion id
   */
  async remove(promotionId: string) {
    const promotion = await this.promotionModel.findByPk(promotionId);
    if (!promotion) {
      throw new UnprocessableEntityException('Promotion not found with given promotion id');
    }
    await this.promotionModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(promotion.sortOrder, null, this.promotionModel as any, transaction);
      await promotion.destroy({ transaction });
    });
  }

  /**
   * To reorder active promotions
   * @param {ReorderPromotionsBodyDto} body request body
   * @returns list of active promotions id and their new order
   */
  async reorderPromotions(body: ReorderPromotionsBodyDto) {
    await this.promotionModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(body.sortOrder, body.newOrder, this.promotionModel as any, transaction);
      await this.promotionModel.update({ sortOrder: body.newOrder }, { where: { promotionId: body.promotionId }, transaction });
    });
    const promotions = await this.promotionModel.findAll({
      where: { isActive: true },
      order: ['sortOrder'],
      attributes: ['promotionId', 'sortOrder'],
    });

    const promotionsRecords = promotions.reduce<Record<string, number>>((promotionsRecords, promotion) => {
      promotionsRecords[promotion.promotionId] = promotion.sortOrder;
      return promotionsRecords;
    }, {});

    return { promotions: promotionsRecords };
  }
}
