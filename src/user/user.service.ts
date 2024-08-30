import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private UserRepo: Repository<UserEntity>, 
  private jwtService: JwtService){
  }
  async create(createUserDto: CreateUserDto) {
    const existUserEmail = await this.UserRepo.findOne({where: {email: createUserDto.email}})
    if(existUserEmail) throw new BadRequestException(`User with email (${existUserEmail.email}) already exist!`)
    const existUserUsername = await this.UserRepo.findOne({where: {username: createUserDto.username}})
    if(existUserUsername) throw new BadRequestException(`User whith username (${existUserUsername.username}) already exist!`)
    //Hashing User password
    const saltOrRounds = 10
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds)
    createUserDto.password = hash
    const newUser = await this.UserRepo.create(createUserDto)
    return await this.UserRepo.save(newUser)
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.UserRepo.findOne({where: {email: loginUserDto.email}});
    if(!user) throw new NotFoundException('User not found!')
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) throw new BadRequestException('Wrong password!');
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll() {
    return await this.UserRepo.find()
  }

  async findUserById(id: string) {
    const findUserById = await this.UserRepo.findOneBy({id})
    if(!findUserById) throw new NotFoundException(`User with id: (${id}) not found!`)
    return findUserById
  }
  async findUserByUsername(username: string) {
    const findUserById = await this.UserRepo.findOne({where: {username}})
    
    if(!findUserById) throw new NotFoundException(`User with username: (${username}) not found!`)
    return findUserById
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userExist = await this.UserRepo.findOneBy({id})
    if(!userExist) throw new NotFoundException(`User with id: (${id}) not found!`)
    if(updateUserDto.name) userExist.name = updateUserDto.name
    if(updateUserDto.avatar) userExist.avatar = updateUserDto.avatar
    if(updateUserDto.bio) userExist.bio = updateUserDto.bio
    if(updateUserDto.password) userExist.password = updateUserDto.password
    return await this.UserRepo.save(userExist)
  }

  async getFollowers(id: string) {
    const user = await this.UserRepo.findOneBy({id})
    return user.followers
  }

  async getFollowing(id: string) {
    const user = await this.UserRepo.findOneBy({id})
    return user.following
  }

  async follow(id: string, thisUser: any) {
    const userById = await this.UserRepo.findOne({where: {id}})
    const user = await this.UserRepo.findOneBy(thisUser.id)
    if(!userById) throw new NotFoundException('User not found!')
    if(userById.followers.includes(user.email) || user.following.includes(userById.email)) {
      throw new BadRequestException('You already followed this User!')
    }else{
      userById.followers.push(user.email) && user.following.push(userById.email) 
      await this.UserRepo.save(user) && this.UserRepo.save(userById)
    }
    return user
  }

  async unfollow(id: string, thisUser: any) {
    const userById = await this.UserRepo.findOne({where: {id}})
    const user = await this.UserRepo.findOneBy(thisUser.id)
    if(!userById) throw new NotFoundException('User not found!')
    if(userById.followers.includes(user.email) || user.following.includes(userById.email)) {
      userById.followers = userById.followers.filter(email => email !== user.email)
      user.following = user.following.filter(email => email !== userById.email) 
      await this.UserRepo.save(user) && this.UserRepo.save(userById)
    }else{
      throw new BadRequestException('User not found or you already unfollowed!')
    }
    return user
  }

}
