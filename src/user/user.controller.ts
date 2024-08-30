import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './auth/auth.guard';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @Get('all')
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('@:username')
  async findUserByUsername(@Param('username') username: string) {
    return await this.userService.findUserByUsername(username);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('findUserById/:id')
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @Patch('updateUser/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('userFollowers/:id')
  async userFollowers(@Param('id') id: string) {
    return await this.userService.getFollowers(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('userFollowing/:id')
  async userFollowing(@Param('id') id: string) {
    return await this.userService.getFollowing(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('follow/:id')
  async followUser(@Param('id') id: string, @Req() thisUser: any){
    return await this.userService.follow(id, thisUser)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('unfollow/:id')
  async unfollowUser(@Param('id') id: string, @Req() thisUser: any){
    return await this.userService.unfollow(id, thisUser)
  }
}
