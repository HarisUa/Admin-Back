import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, WhereOptions } from 'sequelize';
import { Op } from 'sequelize';

import { UserModel } from '@shared/models';
import { getNextSortOrder, GET_RECORDS_QUERY_STATUSES, LANGUAGE_CODES, redorderRecords } from '@common';
import { SbBasicService } from '@shared/providers';

import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerModel } from './models/banner.model';
import { GetBannersQueryDto } from './dto/get-banners-query.dto';
import { ReorderBannersBodyDto } from './dto/reorder-banners-body.dto';

/**
 * To serve request from AuthController
 * @export
 * @class BannersService
 */
@Injectable()
export class BannersService {
  /**
   * Creates an instance of BannerService.
   * @param {typeof BannerModel} bannerModel sequelize banner model
   * @param {SbBasicService} sbBasicService to call sb betting basic APIs
   */
  constructor(
    @InjectModel(BannerModel)
    private readonly bannerModel: typeof BannerModel,
    private readonly sbBasicService: SbBasicService,
  ) {}

  /**
   * To create bannner
   * @param {CreateBannerDto} createBannerDto banner details
   * @param {UserModel} userModel user details
   * @return created banner
   */
  async create(createBannerDto: CreateBannerDto, userModel: UserModel) {
    // validate create banner request body
    if (!createBannerDto.eventId && (!createBannerDto.pl.imageUrl || !createBannerDto.pl.imageAltText || !createBannerDto.pl.link)) {
      throw new BadRequestException('If event id not provided then image, image alt text and link must be given');
    }
    const banner = this.bannerModel.build();
    let maxSortOrder: number = null;

    // find event game id of give event and game type
    if (createBannerDto.eventId && createBannerDto.eventGameType) {
      // fetch all event and their games
      const eventData = await this.sbBasicService.getEventByEventId({ eventId: createBannerDto.eventId }, { 'request-language': LANGUAGE_CODES.PL });

      // find event game
      const eventGame = eventData?.eventGames.find((eventGame) => eventGame.gameType === createBannerDto.eventGameType);
      if (!eventGame) {
        throw new BadRequestException('Can not found event game with give event id and game type');
      }
      banner.set({ eventGameId: String(eventGame.gameId) });
      createBannerDto.dateTill =
        createBannerDto.dateTill < new Date(eventData.eventStart) ? createBannerDto.dateTill : new Date(eventData.eventStart);
    }

    // add sort order only if banner marked as active
    if (createBannerDto.isActive) {
      maxSortOrder = await getNextSortOrder(this.bannerModel);
    }

    banner.set({
      ...createBannerDto,
      createdBy: userModel.userId,
      updatedBy: userModel.userId,
      sortOrder: maxSortOrder,
    });

    await banner.save();

    return banner.get({ plain: true });
  }

  /**
   * To get multiple banners
   * @return banners list
   */
  async findAll(queryParams: GetBannersQueryDto) {
    let limit: number;
    let offset: number;
    const currentTime = new Date();

    // create filter query
    const order: Order = [];
    order.push('sortOrder');

    const filterQuery: WhereOptions<BannerModel> = {};

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
    // get banners and total banners count
    const { rows: banners, count: totalBanners } = await this.bannerModel.findAndCountAll({
      where: filterQuery,
      order,
      limit,
      offset,
    });

    return { banners, totalBanners };
  }

  /**
   * To get statistics of banners
   * @return banners statistics
   */
  async findStatistics() {
    const currentTime = new Date();

    // find active, expired and in-active counts
    const [active, expired, inActive] = await Promise.all([
      this.bannerModel.count({ where: { isActive: true, dateTill: { [Op.or]: [{ [Op.gt]: currentTime }, { [Op.eq]: null }] } } }),
      this.bannerModel.count({ where: { isActive: true, dateTill: { [Op.lte]: currentTime } } }),
      this.bannerModel.count({ where: { isActive: false } }),
    ]);

    return {
      [GET_RECORDS_QUERY_STATUSES.ACTIVE]: active,
      [GET_RECORDS_QUERY_STATUSES.EXPIRED]: expired,
      [GET_RECORDS_QUERY_STATUSES.INACTIVE]: inActive,
    };
  }

  /**
   * To find one banner
   * @param {string} bannerId banner id to find
   * @return banner details
   */
  async findOne(bannerId: string) {
    const banner = await this.bannerModel.findOne({ where: { bannerId } });
    if (!banner) {
      throw new UnprocessableEntityException('banner not found with given banner id');
    }
    return banner.toJSON();
  }

  /**
   * To update banner details
   * @param {string} bannerId id of banner
   * @param {UpdateBannerDto} updateBannerDto update request
   * @param {string} userId current logged in user id
   * @return update banner details
   */
  async update(bannerId: string, updateBannerDto: UpdateBannerDto, userId: string) {
    const banner = await this.bannerModel.findOne({ where: { bannerId } });
    if (!banner) {
      throw new UnprocessableEntityException('banner not found with given banner id');
    }
    // change sort order with other details
    await this.bannerModel.sequelize.transaction(async (transaction) => {
      let sortOrder = banner.sortOrder;

      // find event game id of give event and game type
      if (
        (updateBannerDto.eventId && updateBannerDto.eventId !== banner.eventId) ||
        (updateBannerDto.eventGameType && updateBannerDto.eventGameType !== banner.eventGameType)
      ) {
        // fetch all event and their games
        const eventData = await this.sbBasicService.getEventByEventId(
          { eventId: updateBannerDto.eventId || banner.eventId },
          { 'request-language': LANGUAGE_CODES.PL },
        );

        // find event game
        const eventGame = eventData?.eventGames.find((eventGame) => eventGame.gameType === (updateBannerDto.eventGameType || banner.eventGameType));
        if (!eventGame) {
          throw new BadRequestException('Can not found event game with give event id and game type');
        }
        banner.set({ eventGameId: String(eventGame.gameId) });
        updateBannerDto.dateTill = new Date(eventData.eventStart);
      }

      // if marked as inactive from active then remove sort order
      if (banner.isActive && !updateBannerDto.isActive) {
        await redorderRecords(banner.sortOrder, null, this.bannerModel as any, transaction);
        sortOrder = null;
      }
      // if marked as active from inactive then assigned fresh latest sort order
      if (!banner.isActive && updateBannerDto.isActive) {
        sortOrder = await getNextSortOrder(this.bannerModel);
      }
      banner.set({ ...updateBannerDto, sortOrder, updatedBy: userId });
      await banner.save({ transaction });
    });
    return banner.get({ plain: true });
  }

  /**
   * To remove banner
   * @param {string} bannerId id of banner
   * @returns
   */
  async remove(bannerId: string): Promise<void> {
    const banner = await this.bannerModel.findByPk(bannerId);
    if (!banner) {
      throw new UnprocessableEntityException('banner not found with given banner id');
    }
    await this.bannerModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(banner.sortOrder, null, this.bannerModel as any, transaction);
      await banner.destroy({ transaction });
    });
  }

  /**
   * To reorder active banners
   * @param {ReorderBannersBodyDto} body request body
   * @returns list of active banners id and their new order
   */
  async reorderBanners(body: ReorderBannersBodyDto) {
    await this.bannerModel.sequelize.transaction(async (transaction) => {
      await redorderRecords(body.sortOrder, body.newOrder, this.bannerModel as any, transaction);
      await this.bannerModel.update({ sortOrder: body.newOrder }, { where: { bannerId: body.bannerId }, transaction });
    });
    const banners = await this.bannerModel.findAll({
      where: { isActive: true },
      order: ['sortOrder'],
      attributes: ['bannerId', 'sortOrder'],
    });

    const bannersRecords = banners.reduce<Record<string, number>>((bannersRecords, banner) => {
      bannersRecords[banner.bannerId] = banner.sortOrder;
      return bannersRecords;
    }, {});

    return { banners: bannersRecords };
  }
}
