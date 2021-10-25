import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Order, WhereOptions } from 'sequelize';

import { getNextSortOrder, GET_RECORDS_QUERY_STATUSES, LANGUAGE_CODES, redorderRecords } from '@common';
import { SbBasicService } from '@shared/providers';

import { CreateEntertainmentDto } from './dto/create-entertainment.dto';
import { UpdateEntertainmentDto } from './dto/update-entertainment.dto';
import { EntertainmentModel } from './model/entertainment.model';
import { GetEntertainmentQueryDto } from './dto/get-entertainment-query.dto';
import { ReorderEntertainmentsBodyDto } from './dto/reorder-entertainments-body.dto';

/**
 * To serve request from EntertainmentController
 * @export
 * @class EntertainmentsService
 */
@Injectable()
export class EntertainmentsService {
  /**
   * Creates an instance of EntertainmentsService.
   * @param {typeof EntertainmentModel} entertainmentModel sequelize entertainment model
   * @param {SbBasicService} sbBasicService to call sb betting APIs
   */
  constructor(
    @InjectModel(EntertainmentModel)
    private readonly entertainmentModel: typeof EntertainmentModel,
    private readonly sbBasicService: SbBasicService,
  ) {}

  /**
   * To create entertainment
   * @param {CreateEntertainmentDto} createEntertainmentDto entertainment details
   * @param {string} userId current user id
   * @return created entertainment
   */
  async create(createEntertainmentDto: CreateEntertainmentDto, userId: string) {
    const entertainment = this.entertainmentModel.build();
    let maxSortOrder: number = null;

    // fetch all event and their games
    const eventData = await this.sbBasicService.getEventByEventId(
      { eventId: createEntertainmentDto.eventId },
      { 'request-language': LANGUAGE_CODES.PL },
    );

    // find event game
    const eventGame = eventData?.eventGames.find((eventGame) => eventGame.gameType === createEntertainmentDto.eventGameType);
    if (!eventGame) {
      throw new BadRequestException('Can not found event game with give event id and game type');
    }

    // add sort order only if entertainment marked as active
    if (createEntertainmentDto.isActive) {
      maxSortOrder = await getNextSortOrder(this.entertainmentModel);
    }

    entertainment.set({
      ...createEntertainmentDto,
      createdBy: userId,
      updatedBy: userId,
      sortOrder: maxSortOrder,
      eventGameId: String(eventGame.gameId),
      dateTill: createEntertainmentDto.dateTill < new Date(eventData.eventStart) ? createEntertainmentDto.dateTill : new Date(eventData.eventStart),
    });

    await entertainment.save();

    return entertainment.get({ plain: true });
  }

  /**
   * To get multiple entertainments based on query filter options
   * @param {GetEntertainmentQueryDto} queryParams query filter options
   * @return entertainments list
   */
  async findAll(queryParams: GetEntertainmentQueryDto) {
    let limit: number;
    let offset: number;
    const currentTime = new Date();

    // create filter query
    const order: Order = [];
    order.push('sortOrder');

    const filterQuery: WhereOptions<EntertainmentModel> = {};

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
    // get entertainments and total entertainments count
    const { rows: entertainments, count: totalEntertainments } = await this.entertainmentModel.findAndCountAll({
      where: filterQuery,
      order,
      limit,
      offset,
    });

    return { entertainments, totalEntertainments };
  }

  /**
   * To get statistics of entertainments
   * @return entertainments statistics
   */
  async findStatistics() {
    const currentTime = new Date();

    // find active, expired and in-active counts
    const [active, expired, inActive] = await Promise.all([
      this.entertainmentModel.count({ where: { isActive: true, dateTill: { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] } } }),
      this.entertainmentModel.count({ where: { isActive: true, dateTill: { [Op.lte]: currentTime } } }),
      this.entertainmentModel.count({ where: { isActive: false } }),
    ]);

    return {
      [GET_RECORDS_QUERY_STATUSES.ACTIVE]: active,
      [GET_RECORDS_QUERY_STATUSES.EXPIRED]: expired,
      [GET_RECORDS_QUERY_STATUSES.INACTIVE]: inActive,
    };
  }

  /**
   * To find one entertainment
   * @param {string} entertainmentId entertainment to find
   * @return entertainment details
   */
  async findOne(entertainmentId: string) {
    const entertainment = await this.entertainmentModel.findOne({ where: { entertainmentId } });
    if (!entertainment) {
      throw new UnprocessableEntityException('Entertainment not found with given entertainment id');
    }
    return entertainment.toJSON();
  }

  /**
   * To update specific entertainment
   * @param {string} entertainmentId entertainment id
   * @param {UpdateEntertainmentDto} updateEntertainmentDto update entertainment request
   * @param {string} userId current user id
   */
  async update(entertainmentId: string, updateEntertainmentDto: UpdateEntertainmentDto, userId: string) {
    const entertainment = await this.entertainmentModel.findOne({ where: { entertainmentId } });
    if (!entertainment) {
      throw new UnprocessableEntityException('Entertainment not found with given entertainment id');
    }

    // change sort order with other details
    await this.entertainmentModel.sequelize.transaction(async (transaction) => {
      let sortOrder = entertainment.sortOrder;

      // find event game id of give event and game type
      if (
        (updateEntertainmentDto.eventId && updateEntertainmentDto.eventId !== entertainment.eventId) ||
        (updateEntertainmentDto.eventGameType && updateEntertainmentDto.eventGameType !== entertainment.eventGameType)
      ) {
        // fetch all event and their games
        const eventData = await this.sbBasicService.getEventByEventId(
          { eventId: updateEntertainmentDto.eventId || entertainment.eventId },
          { 'request-language': LANGUAGE_CODES.PL },
        );

        // find event game
        const eventGame = eventData?.eventGames.find(
          (eventGame) => eventGame.gameType === (updateEntertainmentDto.eventGameType || entertainment.eventGameType),
        );
        if (!eventGame) {
          throw new BadRequestException('Can not found event game with give event id and game type');
        }
        entertainment.set({ eventGameId: String(eventGame.gameId) });
        updateEntertainmentDto.dateTill = new Date(eventData.eventStart);
      }

      // if marked as inactive from active then remove sort order
      if (entertainment.isActive && !updateEntertainmentDto.isActive) {
        await redorderRecords(entertainment.sortOrder, null, this.entertainmentModel as any, transaction);
        sortOrder = null;
      }
      // if marked as active from inactive then assigned fresh latest sort order
      if (!entertainment.isActive && updateEntertainmentDto.isActive) {
        sortOrder = await getNextSortOrder(this.entertainmentModel);
      }
      entertainment.set({ ...updateEntertainmentDto, sortOrder, updatedBy: userId });
      await entertainment.save({ transaction });
    });
    return entertainment.get({ plain: true });
  }

  /**
   * To delete entertainment
   * @param {string} entertainmentId entertainment id
   */
  async remove(entertainmentId: string) {
    const entertainment = await this.entertainmentModel.findByPk(entertainmentId);
    if (!entertainment) {
      throw new UnprocessableEntityException('Entertainment not found with given entertainment id');
    }
    await this.entertainmentModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(entertainment.sortOrder, null, this.entertainmentModel as any, transaction);
      await entertainment.destroy({ transaction });
    });
  }

  /**
   * To reorder active entertainments
   * @param {ReorderEntertainmentsBodyDto} body request body
   * @returns list of active entertainments id and their new order
   */
  async reorderEntertainments(body: ReorderEntertainmentsBodyDto) {
    await this.entertainmentModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(body.sortOrder, body.newOrder, this.entertainmentModel as any, transaction);
      await this.entertainmentModel.update({ sortOrder: body.newOrder }, { where: { entertainmentId: body.entertainmentId }, transaction });
    });
    const entertainments = await this.entertainmentModel.findAll({
      where: { isActive: true },
      order: ['sortOrder'],
      attributes: ['entertainmentId', 'sortOrder'],
    });

    const entertainmentsRecords = entertainments.reduce<Record<string, number>>((entertainmentsRecords, entertainment) => {
      entertainmentsRecords[entertainment.entertainmentId] = entertainment.sortOrder;
      return entertainmentsRecords;
    }, {});

    return { entertainments: entertainmentsRecords };
  }
}
