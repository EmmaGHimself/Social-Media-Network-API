import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePostDto, EditPostDto } from '../dto/post.dto';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(Comment) private commentModel: typeof Comment,
    @InjectModel(User) private userModel: typeof User,
  ) { }

  async getAllPosts() {
    const posts = await this.postModel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });

    const commentCountPromises = posts.map(async (post) => {
      const count = await this.commentModel.count({ where: { postId: post.id } });
      return { postId: post.id, commentCount: count };
    });

    const commentCounts = await Promise.all(commentCountPromises);

    const postsWithCommentAndLikeCount = posts.map((post) => {
      const likeCount = post.likedBy.length; // Get the like count from the length of the likedBy array
      const commentCount = commentCounts.find((count) => count.postId === post.id)?.commentCount || 0;
      const { likedBy, ...postWithoutLikedBy } = post.toJSON(); // Remove the likedBy property from the post
      return { ...postWithoutLikedBy, likeCount, commentCount };
    });

    return postsWithCommentAndLikeCount;
  }


  async getPostById(id: string) {
    const post = await this.postModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'username'],
            },
          ],
        },
      ],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const commentCount = await this.commentModel.count({ where: { postId: post.id } });
    const likeCount = post.likedBy.length; // Get the like count from the length of the likedBy array

    // Get the user names of those who liked the post
    const likedByUserNames = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: post.likedBy },
    });

    const comments = await Promise.all(
      post.comments.map(async (comment) => {
        const commentLikeCount = comment.likedBy.length; // Get the like count from the length of the likedBy array

        // Get the user names of those who liked the comment
        const likedCommentUserNames = await this.userModel.findAll({
          attributes: ['id', 'username'],
          where: { id: comment.likedBy },
        });

        const { likedBy, ...commentWithoutLikedBy } = comment.toJSON(); // Remove the likedBy property from the comment
        return { ...commentWithoutLikedBy, commentLikeCount, likedCommentUserNames };
      })
    );

    const { likedBy, ...postWithoutLikedBy } = post.toJSON(); // Remove the likedBy property from the post
    return { ...postWithoutLikedBy, likeCount, commentCount, likedByUserNames, comments };


  }



  async createPost(createPostDto: CreatePostDto, user: User) {
    const post = new Post();
    post.content = createPostDto.content;
    post.userId = user.id;
    await post.save();
    const commentCount = await this.commentModel.count({ where: { postId: post.id } });
    const likeCount = post.likedBy.length; // Get the like count from the length of the likedBy array

    // Get the user names of those who liked the post
    const likedByUserNames = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: post.likedBy },
    });

    const { likedBy, ...postWithoutLikedBy } = post.toJSON(); // Remove the likedBy property from the post
    return { ...postWithoutLikedBy, likeCount, commentCount, likedByUserNames };
  }

  async editPost(id: string, editPostDto: EditPostDto, user: User) {
    const post = await this.postModel.findOne({ where: { id, userId: user.id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.content = editPostDto.content;
    await post.save();
    const commentCount = await this.commentModel.count({ where: { postId: post.id } });
    const likeCount = post.likedBy.length; // Get the like count from the length of the likedBy array

    // Get the user names of those who liked the post
    const likedByUserNames = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: post.likedBy },
    });

    const { likedBy, ...postWithoutLikedBy } = post.toJSON(); // Remove the likedBy property from the post
    return { ...postWithoutLikedBy, likeCount, commentCount, likedByUserNames };
  }

  async deletePost(id: string, user: User) {
    const post = await this.postModel.findOne({ where: { id, userId: user.id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await post.destroy();
    return { deleted: true };
  }

  async likePost(id: string, user: User) {
    const post = await this.postModel.findByPk(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likedByUser = post.likedBy?.includes(user.id);
    if (likedByUser) {
      throw new BadRequestException('You have already liked this post');
    }

    post.likedBy = [...post.likedBy, user.id];

    await post.save();

    const commentCount = await this.commentModel.count({ where: { postId: post.id } });
    const likeCount = post.likedBy.length; // Get the like count from the length of the likedBy array

    // Get the user names of those who liked the post
    const likedByUserNames = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: post.likedBy },
    });

    const { likedBy, ...postWithoutLikedBy } = post.toJSON(); // Remove the likedBy property from the post
    return { ...postWithoutLikedBy, likeCount, commentCount, likedByUserNames };

  }


  async unlikePost(id: string, user: User) {
    const post = await this.postModel.findByPk(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likedByUser = post.likedBy?.includes(user.id);
    if (!likedByUser) {
      throw new BadRequestException('You have not liked this post');
    }

    post.likedBy = post.likedBy.filter((id) => id !== user.id);
    await post.save();

    const commentCount = await this.commentModel.count({ where: { postId: post.id } });
    const likeCount = post.likedBy.length; // Get the like count from the length of the likedBy array

    // Get the user names of those who liked the post
    const likedByUserNames = await this.userModel.findAll({
      attributes: ['id', 'username'],
      where: { id: post.likedBy },
    });

    const { likedBy, ...postWithoutLikedBy } = post.toJSON(); // Remove the likedBy property from the post
    return { ...postWithoutLikedBy, likeCount, commentCount, likedByUserNames };
  }
}
