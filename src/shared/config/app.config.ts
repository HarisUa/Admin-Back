/**
 * Types of environments
 */
type Environments = 'debug' | 'development' | 'staging' | 'production';

export const APP_CONFIG = {
  // app port
  port: parseInt(process.env.PORT, 10) || 3000,

  // app env
  env: (process.env.NODE_ENV || 'development') as Environments,

  // decide whether to send error response stack or not
  sendResponseErrorStack: process.env.SEND_RESPONSE_ERROR_STACK === 'true',

  // jwt secret key
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
