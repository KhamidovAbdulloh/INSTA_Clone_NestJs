import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { PostModule } from './post/post.module';

config()

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    database: process.env.DB_Name,
    host: process.env.DB_Host,
    username: process.env.DB_Username,
    password: process.env.DB_Password,
    port: Number(process.env.DB_Port),
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  }) , UserModule, PostModule ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
