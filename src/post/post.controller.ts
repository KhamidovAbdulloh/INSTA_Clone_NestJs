import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CommentPostDto } from './dto/comment-post';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';

export class CommentId{
  @ApiProperty()
  @IsNotEmpty()
  id: string
}

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('newPost')
  async create(@Body() createPostDto: CreatePostDto, @Req() thisUser: any) {
    return await this.postService.create(createPostDto, thisUser);
  }

  @Get('all')
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('findPostById/:id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('updatePost/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('delPost/:id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('CommentPost/:id')
  addComment(@Param('id') id: string, @Body() commentPostDto: CommentPostDto, @Req() thisUser: any) {
    return this.postService.comment(id, commentPostDto, thisUser);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('DelComment/:id')
  delComment(@Param('id') id: string, @Req() thisUser: UserEntity, @Body() commentId: CommentId) {
    return this.postService.delComment(id, thisUser, commentId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('LikePost/:id')
  addLike(@Param('id') id: string, @Req() thisUser: any) {
    return this.postService.like(id, thisUser);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('DelLike/:id')
  delLike(@Param('id') id: string, @Req() thisUser: any) {
    return this.postService.delLike(id, thisUser);
  }

  @Get('getComments/:id')
  getComments(@Param('id') id: string) {
    return this.postService.getComment(id);
  }

  @Get('getLikes/:id')
  getLikes(@Param('id') id: string) {
    return this.postService.getLikes(id);
  }
}
