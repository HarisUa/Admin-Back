import { Module } from '@nestjs/common';
import { AWS_CONFIG } from '@shared/config';
import AWS from 'aws-sdk';

import { CognitoService } from './cognito.service';

@Module({
  providers: [CognitoService],
  exports: [CognitoService],
})
export class AwsModule {
  constructor() {
    /**
     * Initialization Of Aws
     */
    AWS.config.update({
      region: AWS_CONFIG.region,
      credentials: { accessKeyId: AWS_CONFIG.accessKeyId, secretAccessKey: AWS_CONFIG.secretAccessKey },
    });
  }
}
