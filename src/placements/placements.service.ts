import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Order, WhereOptions } from 'sequelize';

import { getNextSortOrder, GET_RECORDS_QUERY_STATUSES, redorderRecords } from '@common';

import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';
import { PlacementModel } from './models/placement.model';
import { GetPlacementQueryDto } from './dto/get-placement-query.dto';
import { ReorderPlacementsBodyDto } from './dto/reorder-placements-body.dto';

/**
 * To serve request from PlacementController
 * @export
 * @class PlacementsService
 */
@Injectable()
export class PlacementsService {
  /**
   * Creates an instance of PlacementsService.
   * @param {typeof PlacementModel} placementModel sequelize placement model
   */
  constructor(
    @InjectModel(PlacementModel)
    private readonly placementModel: typeof PlacementModel,
  ) {}

  /**
   * To create placement
   * @param {CreatePlacementDto} createPlacementDto create placement request
   * @param {string} userId current user id
   * @return created placement details
   */
  async create(createPlacementDto: CreatePlacementDto, userId: string) {
    const placement = this.placementModel.build();
    let maxSortOrder: number = null;

    // add sort order only if placement marked as active
    if (createPlacementDto.isActive) {
      maxSortOrder = await getNextSortOrder(this.placementModel);
    }

    placement.set({
      ...createPlacementDto,
      createdBy: userId,
      updatedBy: userId,
      sortOrder: maxSortOrder,
    });

    await placement.save();

    return placement.get({ plain: true });
  }

  /**
   * To get multiple placements based on query filter options
   * @param {GetPlacementQueryDto} queryParams query filter options
   * @return placements list
   */
  async findAll(queryParams: GetPlacementQueryDto) {
    let limit: number;
    let offset: number;
    const currentTime = new Date();

    // create filter query
    const order: Order = [];
    order.push('sortOrder');

    const filterQuery: WhereOptions<PlacementModel> = {};

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
    // get placements and total placements count
    const { rows: placements, count: totalPlacements } = await this.placementModel.findAndCountAll({
      where: filterQuery,
      order,
      limit,
      offset,
    });

    return { placements, totalPlacements };
  }

  /**
   * To get statistics of placements
   * @return placements statistics
   */
  async findStatistics() {
    const currentTime = new Date();

    // find active, expired and in-active counts
    const [active, expired, inActive] = await Promise.all([
      this.placementModel.count({ where: { isActive: true, dateTill: { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] } } }),
      this.placementModel.count({ where: { isActive: true, dateTill: { [Op.lte]: currentTime } } }),
      this.placementModel.count({ where: { isActive: false } }),
    ]);

    return {
      [GET_RECORDS_QUERY_STATUSES.ACTIVE]: active,
      [GET_RECORDS_QUERY_STATUSES.EXPIRED]: expired,
      [GET_RECORDS_QUERY_STATUSES.INACTIVE]: inActive,
    };
  }

  /**
   * To find one placement
   * @param {string} placementId placement to find
   * @return placement details
   */
  async findOne(placementId: string) {
    const placement = await this.placementModel.findOne({ where: { placementId } });
    if (!placement) {
      throw new UnprocessableEntityException('Placement not found with given placement id');
    }
    return placement.toJSON();
  }

  /**
   * To update specific placement
   * @param {string} placementId placement id
   * @param {UpdatePlacementDto} updatePlacementDto update placement request
   * @param {string} userId current user id
   * @returns updated placement details
   */
  async update(placementId: string, updatePlacementDto: UpdatePlacementDto, userId: string) {
    const placement = await this.placementModel.findOne({ where: { placementId } });
    if (!placement) {
      throw new UnprocessableEntityException('Placement not found with given placement id');
    }
    // change sort order with other details
    await this.placementModel.sequelize.transaction(async (transaction) => {
      let sortOrder = placement.sortOrder;

      // if marked as inactive from active then remove sort order
      if (placement.isActive && !updatePlacementDto.isActive) {
        await redorderRecords(placement.sortOrder, null, this.placementModel as any, transaction);
        sortOrder = null;
      }
      // if marked as active from inactive then assigned fresh latest sort order
      if (!placement.isActive && updatePlacementDto.isActive) {
        sortOrder = await getNextSortOrder(this.placementModel);
      }
      placement.set({ ...updatePlacementDto, sortOrder, updatedBy: userId });
      await placement.save({ transaction });
    });
    return placement.get({ plain: true });
  }

  /**
   * To delete placement
   * @param {string} placementId placement id
   */
  async remove(placementId: string) {
    const placement = await this.placementModel.findByPk(placementId);
    if (!placement) {
      throw new UnprocessableEntityException('Placement not found with given placement id');
    }
    await this.placementModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(placement.sortOrder, null, this.placementModel as any, transaction);
      await placement.destroy({ transaction });
    });
  }

  /**
   * To reorder active placements
   * @param {ReorderPlacementsBodyDto} body request body
   * @returns list of active placements id and their new order
   */
  async reorderPlacements(body: ReorderPlacementsBodyDto) {
    await this.placementModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(body.sortOrder, body.newOrder, this.placementModel as any, transaction);
      await this.placementModel.update({ sortOrder: body.newOrder }, { where: { placementId: body.placementId }, transaction });
    });
    const placements = await this.placementModel.findAll({
      where: { isActive: true },
      order: ['sortOrder'],
      attributes: ['placementId', 'sortOrder'],
    });

    const placementsRecords = placements.reduce<Record<string, number>>((placementsRecords, placement) => {
      placementsRecords[placement.placementId] = placement.sortOrder;
      return placementsRecords;
    }, {});

    return { placements: placementsRecords };
  }
}
