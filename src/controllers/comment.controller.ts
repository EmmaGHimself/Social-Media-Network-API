import { Controller, Post, UsePipes, HttpCode, ValidationPipe, Put, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto, EditCommentDto } from '../dto/comment.dto';
import { JwtAuthGuard } from '../global/jwt-auth-guard';
import { CurrentUser } from '../global/decorators/current-user.decorator';
import { User } from '../models/user.model';

@ApiTags('Comments')
@ApiBearerAuth('access-token')
@Controller('posts')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post(':id/comments')
    @ApiOperation({ summary: 'Create a new comment on a post' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: CreateCommentDto })
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    createComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @CurrentUser() user: User) {
        return this.commentService.createComment(id, createCommentDto, user);
    }

    @Put('comments/:id')
    @ApiOperation({ summary: 'Edit a comment' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: EditCommentDto })
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    editComment(@Param('id') id: string, @Body() editCommentDto: EditCommentDto, @CurrentUser() user: User) {
        return this.commentService.editComment(id, editCommentDto, user);
    }

    @Delete('comments/:id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(JwtAuthGuard)
    deleteComment(@Param('id') id: string, @CurrentUser() user: User) {
        return this.commentService.deleteComment(id, user);
    }

    @Post('comments/:id/like')
    @HttpCode(200)
    @ApiOperation({ summary: 'Like a comment' })
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(JwtAuthGuard)
    likeComment(@Param('id') id: string, @CurrentUser() user: User) {
        return this.commentService.likeComment(id, user);
    }

    @Post('comments/:id/unlike')
    @HttpCode(200)
    @ApiOperation({ summary: 'Unlike a comment' })
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(JwtAuthGuard)
    unlikeComment(@Param('id') id: string, @CurrentUser() user: User) {
        return this.commentService.unlikeComment(id, user);
    }
}
