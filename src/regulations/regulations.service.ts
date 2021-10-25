import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';

import { CreateRegulationDto } from './dto/create-regulation.dto';
import { UpdateRegulationDto } from './dto/update-regulation.dto';
import { RegulationModel } from './models/regulation.model';
import { GetRegulationQueryDto } from './dto/get-regulation-query.dto';

/**
 * To serve request from RegulationsController
 * @export
 * @class RegulationsService
 */
@Injectable()
export class RegulationsService {
  /**
   * Creates an instance of RegulationsService.
   * @param {typeof RegulationModel} regulationModel sequelize regulation model
   */
  constructor(
    @InjectModel(RegulationModel)
    private readonly regulationModel: typeof RegulationModel,
  ) {}

  /**
   * To create regulation
   * @param {CreateRegulationDto} createRegulationDto create regulation request
   * @param {string} userId current user id
   * @return created regulation details
   */
  async create(createRegulationDto: CreateRegulationDto, userId: string) {
    const regulation = this.regulationModel.build();

    regulation.set({
      ...createRegulationDto,
      createdBy: userId,
      updatedBy: userId,
    });

    await regulation.save();

    return regulation.get({ plain: true });
  }

  /**
   * To get multiple regulations based on query filter options
   * @param {GetRegulationQueryDto} queryParams query filter options
   * @return regulations list
   */
  async findAll(queryParams: GetRegulationQueryDto) {
    // define limit and offset
    const { limit, offset } = queryParams.getPaginationInfo(10);

    // create filter query
    let filterQuery: WhereOptions<RegulationModel> = {};
    if (queryParams.isActive) {
      filterQuery.isActive = queryParams.isActive === 'true';
    }

    // get regulations and total count
    const [regulations, totalRegulations] = await Promise.all([
      this.regulationModel.findAll({ where: { ...filterQuery }, offset, limit, order: [['updated_at', 'DESC']] }),
      this.regulationModel.count(),
    ]);

    return { regulations, totalRegulations };
  }

  /**
   * To find one regulation
   * @param {string} regulationId regulation to find
   * @return regulation details
   */
  async findOne(regulationId: string) {
    const regulation = await this.regulationModel.findOne({ where: { regulationId } });
    if (!regulation) {
      throw new UnprocessableEntityException('Regulation not found with given regulation id');
    }
    return regulation.toJSON();
  }

  /**
   * To update specific regulation
   * @param {string} regulationId regulation id
   * @param {UpdateRegulationDto} updateRegulationDto update regulation request
   * @param {string} userId current user id
   * @returns updated regulation details
   */
  async update(regulationId: string, updateRegulationDto: UpdateRegulationDto, userId: string) {
    const regulation = await this.regulationModel.findOne({ where: { regulationId } });
    if (!regulation) {
      throw new UnprocessableEntityException('Regulation not found with given regulation id');
    }
    regulation.set({ ...updateRegulationDto });
    regulation.set('updatedBy', userId);
    await regulation.save();
    return regulation.get({ plain: true });
  }

  /**
   * To delete regulation
   * @param {string} regulationId regulation id
   */
  async remove(regulationId: string) {
    const regulationDeleted = await this.regulationModel.destroy({ where: { regulationId } });
    if (!regulationDeleted) {
      throw new UnprocessableEntityException('Regulation not found with given regulation id');
    }
  }
}
