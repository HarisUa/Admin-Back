import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, User } from '@common';
import { UserModel } from '@shared/models';
import { AWS_CONFIG } from '@shared/config';

import { ProfileService } from './profile.service';

/**
 * Controller for v1/profile related routes
 * @export
 * @class ProfileController
 */
@Controller('v1/profile')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Profile')
export class ProfileController {
  /**
   * Creates an instance of ProfileController.
   * @param {ProfileService} profileService profile service to server request
   */
  constructor(private readonly profileService: ProfileService) {}

  /**
   * To get logged in user profile
   * @param {UserModel} loggedInUser
   * @return user profile
   */
  @Get()
  @ApiOkResponse({ description: 'user profile' })
  @Auth()
  async findAll(@User() loggedInUser: UserModel): Promise<CommonResponse> {
    const userProfile = await this.profileService.getProfile(loggedInUser);

    return { data: { user: userProfile } };
  }

  /**
   * To fetch aws temp credentials of user
   * @param {string} userId user id to use
   * @return temp credentials
   */
  @Get('aws-temp-credentials')
  @ApiOkResponse({ description: 'aws credentials' })
  @Auth()
  async getAwsTempCredentials(@User('userId') userId: string) {
    const credentials = await this.profileService.getAwsTempCredentials(userId);
    return { data: { ...credentials, S3BucketName: AWS_CONFIG.s3.bucketName, Region: AWS_CONFIG.region } };
  }
}
