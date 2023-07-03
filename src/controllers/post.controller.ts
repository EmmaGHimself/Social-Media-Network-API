import { Controller, Post, Get, UsePipes, HttpCode, ValidationPipe, Put, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from '../services/post.service';
import { CreatePostDto, EditPostDto } from '../dto/post.dto';
import { JwtAuthGuard } from '../global/jwt-auth-guard';
import { CurrentUser } from '../global/decorators/current-user.decorator';
import { User } from '../models/user.model';

@ApiTags('Posts')
@ApiBearerAuth('access-token')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postService.createPost(createPostDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit a post' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: EditPostDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  editPost(@Param('id') id: string, @Body() editPostDto: EditPostDto, @CurrentUser() user: User) {
    return this.postService.editPost(id, editPostDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a post' })
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postService.deletePost(id, user);
  }

  @Post(':id/like')
  @HttpCode(200)
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({ name: 'id', type: 'number' })
  @UseGuards(JwtAuthGuard)
  likePost(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postService.likePost(id, user);
  }

  @Post(':id/unlike')
  @HttpCode(200)
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiParam({ name: 'id', type: 'number' })
  @UseGuards(JwtAuthGuard)
  unlikePost(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postService.unlikePost(id, user);
  }
}
