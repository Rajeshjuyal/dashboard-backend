import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDTO, CredentialsDTO } from './users.model';
import { CommonResponseModel } from '../utils/app-service-data';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../utils/auth.service';
import * as uuid from 'uuid/v1';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<any>,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  // get's user information
  public async getUserInformation(id: string): Promise<CommonResponseModel> {
    // console.log("id",id);
    const userInfo = await this.userModel.findById(id, '-password -salt');
    const userCount: number = await this.userModel.countDocuments();
    if (userInfo) {
      return {
        response_code: HttpStatus.OK,
        response_data: {
          userInfo,
          userCount,
        },
      };
    } else {
      return {
        response_code: HttpStatus.UNAUTHORIZED,
        response_data: 'User not found',
      };
    }
  }
  // registers a new user
  public async registerNewUser(
    userData: UsersDTO,
  ): Promise<CommonResponseModel> {
    userData.email = userData.email.toLowerCase();
    const check = await this.userModel.findOne({ email: userData.email });
    if (check) {
      console.log('User exists');
      return {
        response_code: HttpStatus.UNAUTHORIZED,
        response_data: `User with email ${
          userData.email
        } is already registered`,
      };
    }
    const { salt, hashedPassword } = await this.authService.hashPassword(
      userData.password,
    );
    console.log('Getting created');
    userData.salt = salt;
    userData.password = hashedPassword;
    userData.registrationDate = Date.now();
    userData.emailVerified = false;
    const verificationId = uuid();
    userData.verificationId = verificationId;
    const response = await this.userModel.create(userData);
    return {
      response_code: HttpStatus.CREATED,
      response_data: { message: 'Account created successfully' },
    };
  }

  // validates user's credential and sends token and id as response
  public async validateUserCredentials(
    credentials: CredentialsDTO,
  ): Promise<CommonResponseModel> {
    credentials.email = credentials.email.toLowerCase();
    const userData: UsersDTO = await this.userModel.findOne({
      email: credentials.email,
    });
    if (!userData) {
      return {
        response_code: HttpStatus.UNAUTHORIZED,
        response_data: `User with email ${credentials.email} is not registered`,
      };
    }
    const passwordMatch = await this.authService.verifyPassword(
      credentials.password,
      userData.password,
    );
    const body = {
      token: null,
      _id: null,
    };
    if (passwordMatch) {
      if (passwordMatch) {
        body._id = userData._id;
        body.token = await this.authService.generateAccessToken(userData._id);
        const userInfo = await this.userModel.findOne({
          email: credentials.email,
        });
        return { response_code: HttpStatus.OK, response_data: body };
      } else {
        return {
          response_code: HttpStatus.UNAUTHORIZED,
          response_data: 'Enter a valid password',
        };
      }
    }
  }

  // checks whether the token is valid or not
  public async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  //Get all users List
  public async getAlluserList(): Promise<CommonResponseModel> {
    const resdata = await this.userModel.find();
    return {
      response_code: HttpStatus.OK,
      response_data: resdata,
    };
  }
}
