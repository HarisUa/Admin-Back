import { Injectable, UnauthorizedException } from '@nestjs/common';
import pick from 'lodash/pick';
import md5 from 'md5';
import { sign } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/sequelize';

import { UserModel } from '@shared/models';
import { APP_CONFIG } from '@shared/config';
import { TokenPayloadInterface } from '@common';

import { LoginDto } from './dto/login.dto';

/**
 * To server request from AuthController
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {typeof UserModel} userModel sequelize user model
   */
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  /**
   * To do login of user
   * @param {LoginDto} loginDto login request body
   * @return access token and user details
   */
  async loginUser(loginDto: LoginDto) {
    // fetch user from database
    const foundUser = await this.userModel.findOne({ where: { email: loginDto.email } });
    const unauthorizedError = new UnauthorizedException('Invalid email or password');

    // user not found
    if (!foundUser || !foundUser.isActive) {
      throw unauthorizedError;
    }
    // check for password match
    const userPassword = md5(loginDto.password);
    if (userPassword !== foundUser.password) {
      throw unauthorizedError;
    }
    // create JWT token
    const userDetailsToSend: TokenPayloadInterface = pick(foundUser, ['userId', 'email']);
    const accessToken = sign(userDetailsToSend, APP_CONFIG.jwtSecretKey);

    return { user: userDetailsToSend, accessToken };
  }
}
