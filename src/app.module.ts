import { Global, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.NODE_ENV == 'production'
            ? process.env.MONGO_DB_PRODUCTION_URL
            : process.env.MONGO_DB_TESTING_URL,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }),
    }),
    UsersModule,
    MongooseModule.forFeature([]),
  ],
  controllers: [AppController],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class AppModule {}
