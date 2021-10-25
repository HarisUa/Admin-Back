let stsWebIdentityTokenDuration = +(process.env.AWS_STS_TOKEN_DURATION || 900);
if (stsWebIdentityTokenDuration < 900) {
  stsWebIdentityTokenDuration = 900;
}

/**
 * Provide configurations for AWS
 */
export const AWS_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,

  // cognito config
  cognito: {
    identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
    developerProviderName: process.env.AWS_COGNITO_DEVELOPER_PROVIDER_NAME,
    region: process.env.AWS_COGNITO_REGION,
  },
  // sts config
  sts: {
    sessionRoleName: process.env.AWS_STS_SESSION_ROLE_NAME,
    assumeRoleArn: process.env.AWS_STS_ASSUME_ROLE_ARN,
    tokenDuration: stsWebIdentityTokenDuration,
  },
  // s3 config
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
  },
};
