import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserEntity } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ PostEntity, UserEntity ]), UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
