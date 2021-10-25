import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { CommonResponse, INTERNAL_SERVER_ERROR } from '@common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * Controller for v1/auth related routes
 * @export
 * @class AuthController
 */
@Controller('v1/auth')
@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * @param {AuthService} authService auth service to server request
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * to do login
   * @param {LoginDto} loginDto login request
   * @return access token and user details
   */
  @Post('login')
  @ApiOkResponse({ description: 'user details and access token' })
  @ApiUnauthorizedResponse({ description: 'if credentials are invalid' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<CommonResponse> {
    const authenticateUser = await this.authService.loginUser(loginDto);
    return { data: authenticateUser };
  }
}
