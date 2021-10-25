import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, WhereOptions, Op } from 'sequelize';

import { getNextSortOrder, GET_RECORDS_QUERY_STATUSES, redorderRecords } from '@common';

import { CreateSubBannerDto } from './dto/create-sub-banner.dto';
import { UpdateSubBannerDto } from './dto/update-sub-banner.dto';
import { SubBannerModel } from './models/sub-banner.model';
import { GetSubBannerQueryDto } from './dto/get-sub-banner-query.dto';
import { ReorderSubBannersBodyDto } from './dto/reorder-sub-banners-body.dto';

/**
 * To serve request from SubBannersController
 * @export
 * @class SubBannersService
 */
@Injectable()
export class SubBannersService {
  /**
   * Creates an instance of SubBannersService.
   * @param {typeof SubBannerModel} subBannerModel sequelize SubBanner model
   */
  constructor(
    @InjectModel(SubBannerModel)
    private readonly subBannerModel: typeof SubBannerModel,
  ) {}

  /**
   * To create sub banner
   * @param {CreateSubBannerDto} createSubBannerDto create sub banner request
   * @param {string} userId
   * @return create sub banner
   */
  async create(createSubBannerDto: CreateSubBannerDto, userId: string) {
    const subBanner = this.subBannerModel.build();
    let maxSortOrder: number = null;

    // add sort order only if sub banner marked as active
    if (createSubBannerDto.isActive) {
      maxSortOrder = await getNextSortOrder(this.subBannerModel);
    }

    subBanner.set({ ...createSubBannerDto, createdBy: userId, updatedBy: userId, sortOrder: maxSortOrder });

    await subBanner.save();

    return subBanner.get({ plain: true });
  }

  /**
   * To get multiple banners
   * @return banners list
   */
  async findAll(queryParams: GetSubBannerQueryDto) {
    let limit: number;
    let offset: number;
    const currentTime = new Date();

    // create filter query
    const order: Order = [];
    order.push('sortOrder');

    const filterQuery: WhereOptions<SubBannerModel> = {};

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
    // get subBanners and total subBanners count
    const { rows: subBanners, count: totalSubBanners } = await this.subBannerModel.findAndCountAll({
      where: filterQuery,
      order,
      limit,
      offset,
    });

    return { subBanners, totalSubBanners };
  }

  /**
   * To get statistics of sub-banners
   * @return sub-banners statistics
   */
  async findStatistics() {
    const currentTime = new Date();

    // find active, expired and in-active counts
    const [active, expired, inActive] = await Promise.all([
      this.subBannerModel.count({ where: { isActive: true, dateTill: { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] } } }),
      this.subBannerModel.count({ where: { isActive: true, dateTill: { [Op.lte]: currentTime } } }),
      this.subBannerModel.count({ where: { isActive: false } }),
    ]);

    return {
      [GET_RECORDS_QUERY_STATUSES.ACTIVE]: active,
      [GET_RECORDS_QUERY_STATUSES.EXPIRED]: expired,
      [GET_RECORDS_QUERY_STATUSES.INACTIVE]: inActive,
    };
  }

  /**
   * TO find one sub banner
   * @param {string} subBannerId sub banner id
   * @return sub banner details
   */
  async findOne(subBannerId: string) {
    const subBanner = await this.subBannerModel.findOne({ where: { subBannerId } });
    if (!subBanner) {
      throw new UnprocessableEntityException('sub banner not found with given sub banner id');
    }
    return subBanner.toJSON();
  }

  /**
   * To update specific sub banner
   * @param {string} subBannerId sub banner id
   * @param {UpdateSubBannerDto} updateSubBannerDto update sub banner request
   * @param {string} userId current user id
   * @return update sub banner details
   */
  async update(subBannerId: string, updateSubBannerDto: UpdateSubBannerDto, userId: string) {
    const subBanner = await this.subBannerModel.findOne({ where: { subBannerId } });
    if (!subBanner) {
      throw new UnprocessableEntityException('sub banner not found with given sub banner id');
    }
    // change sort order with other details
    await this.subBannerModel.sequelize.transaction(async (transaction) => {
      let sortOrder = subBanner.sortOrder;

      // if marked as inactive from active then remove sort order
      if (subBanner.isActive && !updateSubBannerDto.isActive) {
        await redorderRecords(subBanner.sortOrder, null, this.subBannerModel as any, transaction);
        sortOrder = null;
      }
      // if marked as active from inactive then assigned fresh latest sort order
      if (!subBanner.isActive && updateSubBannerDto.isActive) {
        sortOrder = await getNextSortOrder(this.subBannerModel);
      }
      subBanner.set({ ...updateSubBannerDto, sortOrder, updatedBy: userId });
      await subBanner.save({ transaction });
    });
    return subBanner.get({ plain: true });
  }

  /**
   * To delete sub banner
   * @param {string} subBannerId sub banner id
   */
  async remove(subBannerId: string) {
    const subBanner = await this.subBannerModel.findByPk(subBannerId);
    if (!subBanner) {
      throw new UnprocessableEntityException('sub banner not found with given sub banner id');
    }
    await this.subBannerModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(subBanner.sortOrder, null, this.subBannerModel as any, transaction);
      await subBanner.destroy({ transaction });
    });
  }

  /**
   * To reorder active sub banners model
   * @param {ReorderSubBannersBodyDto} body request body
   * @returns list of active subbanners id and their new order
   */
  async reorderSubBanners(body: ReorderSubBannersBodyDto) {
    await this.subBannerModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(body.sortOrder, body.newOrder, this.subBannerModel as any, transaction);
      await this.subBannerModel.update({ sortOrder: body.newOrder }, { where: { subBannerId: body.subBannerId }, transaction });
    });
    const subBanners = await this.subBannerModel.findAll({
      where: { isActive: true },
      order: ['sortOrder'],
      attributes: ['subBannerId', 'sortOrder'],
    });

    const subBannersRecords = subBanners.reduce<Record<string, number>>((subBannersRecords, subBanner) => {
      subBannersRecords[subBanner.subBannerId] = subBanner.sortOrder;
      return subBannersRecords;
    }, {});

    return { subBanners: subBannersRecords };
  }
}
