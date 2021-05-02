import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import * as path from 'path';
import {
  UsersDTO,
  CredentialsDTO,
  VerifyEmailDTO,
} from './users.model';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommonResponseModel } from '../utils/app-service-data';
import { GetUser } from '../utils/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  public getUserInformation(
    @GetUser() user: UsersDTO,
  ): Promise<CommonResponseModel> {
    return this.userService.getUserInformation(user._id);
  }

  // sends request to verify token
  @Get('/verify/token')
  public async verifyToken(@Headers() headers, @Res() res) {
    this.userService
      .verifyToken(headers.authorization)
      .then(data => {
        res.status(HttpStatus.OK).json({
          response_code: 200,
          response_data: { tokenVerify: true },
        });
      })
      .catch(error => {
        res.status(HttpStatus.UNAUTHORIZED).json({
          response_code: 200,
          response_data: { tokenVerify: false },
        });
      });
  }

  // sends request to register new user
  @Post('/register')
  public registerNewUser(
    @Body() userData: UsersDTO,
  ): Promise<CommonResponseModel> {
    return this.userService.registerNewUser(userData);
  }

  // sends request to validate user's credentials
  @Post('/login')
  public validateUser(
    @Body() credentials: CredentialsDTO,
  ): Promise<CommonResponseModel> {
    return this.userService.validateUserCredentials(credentials);
  }

  //get All users list
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('all/user/list')
  public getAllUserList(): Promise<CommonResponseModel> {
    return this.userService.getAlluserList();
  }
}
