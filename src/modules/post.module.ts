import { Module } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { PostController } from '../controllers/post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Post, Comment, User])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
