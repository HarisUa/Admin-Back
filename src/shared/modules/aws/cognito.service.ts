import AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';

import { AWS_CONFIG } from '@shared/config';

/**
 * This class talks with Aws cognito service
 * to provide temporary upload credentials to users
 * @export
 * @class CognitoService
 */
@Injectable()
export class CognitoService {
  /**
   * To serve STS service
   * @private
   * @type {AWS.STS}
   */
  private sts: AWS.STS;

  /**
   * To server cognito identity service
   * @private
   * @type {AWS.CognitoIdentity}
   */
  private cognitoidentity: AWS.CognitoIdentity;

  /**
   * Creates an instance of CognitoService.
   * Instantiate required services
   */
  constructor() {
    this.sts = new AWS.STS();
    this.cognitoidentity = new AWS.CognitoIdentity({ region: AWS_CONFIG.cognito.region });
  }

  /**
   * To get temporary credentials of betfan-cms-admin account
   * @param {string} userId user to authenticate
   * @return temporary credentials
   */
  async getTempCredentials(userId: string) {
    const openIdPayload: AWS.CognitoIdentity.GetOpenIdTokenForDeveloperIdentityInput = {
      IdentityPoolId: AWS_CONFIG.cognito.identityPoolId,
      Logins: { [AWS_CONFIG.cognito.developerProviderName]: userId },
      TokenDuration: 60,
    };
    // get open id token
    const opendIdTokenRes = await this.cognitoidentity.getOpenIdTokenForDeveloperIdentity(openIdPayload).promise();

    // get temporary credentials
    const params: AWS.STS.AssumeRoleWithWebIdentityRequest = {
      DurationSeconds: +AWS_CONFIG.sts.tokenDuration,
      RoleArn: AWS_CONFIG.sts.assumeRoleArn,
      RoleSessionName: AWS_CONFIG.sts.sessionRoleName,
      WebIdentityToken: opendIdTokenRes.Token,
    };
    return this.sts.assumeRoleWithWebIdentity(params).promise();
  }

  /**
   * Retrive pre signed Url
   * @param objectId
   * @param url
   */
  public async retrivePreSignedUrl(objectId: string, url: string) {
    const fileName = url.split(/[\\\/]/).pop();
    const s3 = new AWS.S3();
    const preSignedUrl = s3.getSignedUrl('getObject', {
      Bucket: 'request-documents',
      Key: `${objectId}/${fileName}`,
      Expires: 300,
    });
    return preSignedUrl;
  }
}
