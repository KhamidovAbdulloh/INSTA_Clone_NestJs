import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

import { config } from 'dotenv';

config()

@Module({
  imports: [TypeOrmModule.forFeature([ UserEntity ]),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
  })],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
