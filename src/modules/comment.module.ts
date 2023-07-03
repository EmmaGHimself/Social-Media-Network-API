import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentController } from '../controllers/comment.controller';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment, Post, User]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
