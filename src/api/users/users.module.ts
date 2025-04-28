import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/database/entities/user.entity';
import { SocialLink } from 'src/database/entities/social-link.entity';
import { SocialLinksService } from './social-links.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SocialLink]),
  ],
  providers: [UsersService, SocialLinksService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
