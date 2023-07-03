import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { PostModule } from './modules/post.module';
import { CommentModule } from './modules/comment.module';
import databaseConfig from './config/database.config';
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      ...databaseConfig[process.env.NODE_ENV || 'development'],
    }),
    AuthModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule { }
