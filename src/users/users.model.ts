import * as mongoose from 'mongoose';
import {
  IsNotEmpty,
  IsEmail,
  IsEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export const UsersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
    },
    salt: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    mobileNumberverified: {
      type: Boolean,
    },
    emailVerified: {
      type: Boolean,
    },
    verificationId: {
      type: String,
    },
    registrationDate: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true },
);

export class UsersDTO {
  @IsEmpty()
  _id: string;

  @IsOptional()
  @ApiModelProperty()
  firstName: string;

  @IsOptional()
  @ApiModelProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiModelProperty()
  email: string;

  @IsNotEmpty()
  @Length(6, 12)
  @ApiModelProperty()
  password: string;

  @IsOptional()
  @Length(0, 15)
  @ApiModelProperty()
  mobileNumber: string;

  @IsEmpty()
  salt: string;

  @IsOptional()
  registrationDate: number;

  @IsOptional()
  emailVerified: boolean;

  @IsOptional()
  verificationId: string;

  status: boolean;
}

export class CredentialsDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty()
  email: string;

  @IsOptional()
  playerId: string;

  @IsNotEmpty()
  @ApiModelProperty()
  password: string;
}

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiModelProperty()
  email: string;
}
