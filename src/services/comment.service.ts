import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCommentDto, EditCommentDto } from '../dto/comment.dto';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentModel: typeof Comment,
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(User) private userModel: typeof User,
  ) {}
  async createComment(id: string, createCommentDto: CreateCommentDto, user: User) {
    const post = await this.postModel.findByPk(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.postId = post.id;
    comment.userId = user.id;
    await comment.save();
    const likeCount = comment.likedBy.length; // Get the updated like count from the length of the likedBy array
    const likedByUserIds = comment.likedBy; // Get the user IDs of users who liked the comment
    const likedByUsers = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: likedByUserIds },
    });
    return { ...comment.toJSON(), likeCount, likedBy: likedByUsers };
  }

  async editComment(id: string, editCommentDto: EditCommentDto, user: User) {
    const comment = await this.commentModel.findOne({ where: { id, userId: user.id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    comment.content = editCommentDto.content;
    await comment.save();
    const likeCount = comment.likedBy.length; // Get the updated like count from the length of the likedBy array
    const likedByUserIds = comment.likedBy; // Get the user IDs of users who liked the comment
    const likedByUsers = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: likedByUserIds },
    });
    return { ...comment.toJSON(), likeCount, likedBy: likedByUsers };
  }

  async deleteComment(id: string, user: User) {
    const comment = await this.commentModel.findOne({ where: { id, userId: user.id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await comment.destroy();
    return { deleted: true };
  }


  async likeComment(id: string, user: User) {
    const comment = await this.commentModel.findByPk(id);
  
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
  
    const likedByUser = comment.likedBy?.includes(user.id);
    if (likedByUser) {
      throw new BadRequestException('You have already liked this comment');
    }
  
    comment.likedBy = [...comment.likedBy, user.id];
    await comment.save();
  
    const likeCount = comment.likedBy.length; // Get the updated like count from the length of the likedBy array
    const likedByUserIds = comment.likedBy; // Get the user IDs of users who liked the comment
    const likedByUsers = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: likedByUserIds },
    });
  
    return { ...comment.toJSON(), likeCount, likedBy: likedByUsers };
  }
  async unlikeComment(id: string, user: User) {
    const comment = await this.commentModel.findByPk(id);
  
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
  
    const likedByUser = comment.likedBy?.includes(user.id);
    if (!likedByUser) {
      throw new BadRequestException('You have not liked this comment');
    }
  
    comment.likedBy = comment.likedBy.filter((userId) => userId !== user.id);
    await comment.save();
  
    const likeCount = comment.likedBy.length; // Get the updated like count from the length of the likedBy array
    const likedByUserIds = comment.likedBy; // Get the user IDs of users who liked the comment
    const likedByUsers = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: likedByUserIds },
    });
    return { ...comment.toJSON(), likeCount, likedBy: likedByUsers };
  }
  
  
}
