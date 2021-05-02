import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './users.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../utils/jwt.strategy';
import { globalConfig } from '../utils/app-service-data';
import { AuthService } from '../utils/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: UsersSchema },
      
    ]),
    JwtModule.register({
      secret: globalConfig.secret,
      signOptions: {
        expiresIn: '3h',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, AuthService],
  exports: [PassportModule, JwtStrategy],
})
export class UsersModule {}
