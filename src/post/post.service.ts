import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CommentPostDto } from './dto/comment-post';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentId } from './post.controller';



@Injectable()
export class PostService {
  constructor(@InjectRepository(PostEntity) private PostRepo: Repository<PostEntity>,
  @InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>){}
  
  async create(createPostDto: CreatePostDto, thisUser: any) {
    const newPost = await this.PostRepo.create(createPostDto)
    const user = await this.UserRepo.findOneBy(thisUser.id)
    delete user.password
    newPost.user = user
    await this.PostRepo.save(newPost)
    return newPost
  }

  async findAll() {
    return await this.PostRepo.find()
  }

  async findOne(id: string) {
    const post = await this.PostRepo.findOneBy({id})
    if(!post) throw new NotFoundException('Not found post!')
    return post
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.PostRepo.findOne({where: {id}, relations: ['user'], select: {user: {id: true, email: true, username: true}}})
    if(!post) throw new NotFoundException('Not found post!')
    if(updatePostDto.caption) post.caption = updatePostDto.caption
    if(updatePostDto.geoLocationOfPost) post.geoLocationOfPost = updatePostDto.geoLocationOfPost
    return await this.PostRepo.save(post)
  }

  async remove(id: string) {
    const post = await this.PostRepo.findOne({where: {id}, relations: ['user'], select: {user: {id: true, email: true, username: true}}})
    if(!post) throw new NotFoundException('Not found post!')
    await this.PostRepo.delete(id)
    return {message: `Post with id: (${post.id}) successfuly deleted!`}
  }

  async comment(id: string, commentPostDto: CommentPostDto, thisUser: any) {
    const user = await this.UserRepo.findOneBy(thisUser.id)
    const post = await this.PostRepo.findOne({where: {id}, relations: ['user'], select: {user: {id: true, email: true, username: true}}})
    if(!post) throw new NotFoundException('Post not found!')
    commentPostDto.id = Date.now().toString()
    commentPostDto.email = user.email

    post.comments.push(commentPostDto)
    return await this.PostRepo.save(post)
  }
  

  async delComment(id: string, thisUser: any, commentId: CommentId) {
    const user = await this.UserRepo.findOneBy(thisUser.id)
    const post = await this.PostRepo.findOne({where: {id}, relations: ['user'], select: {user: {id: true, email: true, username: true}}})
    if(!post) throw new NotFoundException('Post not found!')
    //post.comments.includes(commentId)
    //post.comments.includes(user.email)
    //user.email in post.comments
    const findE = post.comments.some(com => com.id === commentId.id)
    if(findE) {
        post.comments = post.comments.filter(id => id.id !== commentId.id)
        return await this.PostRepo.save(post) 
    }else{
      throw new BadRequestException('You already deleted comment from this post!')
    }
    
  }

  async like(id: string, thisUser: any) {
    const user = await this.UserRepo.findOneBy(thisUser.id)
    const post = await this.PostRepo.findOne({where: {id}, relations: ['user'], select: {user: {id: true, email: true, username: true}}})
    if(!post) throw new NotFoundException('Post not found!')
    if(post.likes.includes(user.email)) {
      throw new BadRequestException('You already liked this post!')
    }else {
      post.likes.push(user.email)
      return await this.PostRepo.save(post)
    }
  }

  async delLike(id: string, thisUser: any) {
    const user = await this.UserRepo.findOneBy(thisUser.id)
    const post = await this.PostRepo.findOne({where: {id}, relations: ['user'], select: {user: {id: true, email: true, username: true}}})
    if(!post) throw new NotFoundException('Post not found!')
    if(post.likes.includes(user.email)) {
      post.likes = post.likes.filter(userId => userId !== user.email) 
      return await this.PostRepo.save(post)
    }else{
      throw new BadRequestException('You already deleted like from this post!')
    }
  }

  async getComment(id: string) {
    const post = await this.PostRepo.findOneBy({id})
    if(!post) throw new NotFoundException('Post Comments not found!')
    return post.comments
  }

  async getLikes(id: string) {
    const post = await this.PostRepo.findOneBy({id})
    if(!post) throw new NotFoundException('Post Likes not found!')
    return post.likes
  }
}
