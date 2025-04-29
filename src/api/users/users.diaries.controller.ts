import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../auth/create-user.dto';
import { AuthService } from 'src/api/auth/auth.service';
import {
  JwtAuthGuard,
  UseAuthQuard,
  UseSilentAuthQuard,
} from 'src/api/auth/jwt-auth.guard';
import {
  AuthenticatedRequest,
  SilentAuthRequest,
} from 'src/api/auth/jwt.strategy';
import { UpdateUserDTO } from './update-user.dto';
import { AuthUserDTO } from 'src/api/auth/auth-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { AuthTokenDTO } from 'src/api/auth/auth-token.dto';
import { User } from 'src/database/entities/user.entity';
import {
  SocialLinksService,
  UpdateSocialLinkDTO,
} from './social-links.service';
import { SocialLink } from 'src/database/entities/social-link.entity';
import { DiariesService, UpdateDiaryDTO } from '../diaries/diaries.service';
import { Diary } from 'src/database/entities/diary.entity';
import { UserByIdPipe } from './user-by-id.pipe';

@Controller('api/users')
export class UsersDiariesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly diariesService: DiariesService,
  ) {}

  @UseSilentAuthQuard()
  @Get(':id/diaries')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Diary, isArray: true })
  async getDiaries(
    @Param('id', UserByIdPipe) user: User,
    @Req() req: SilentAuthRequest,
  ) {
    let onlyPublic = true;
    if (req.user) {
      if (req.user.id == user.id) onlyPublic = false;
    }
    const diaries = this.diariesService.getOfUser(user.id, onlyPublic);
    return diaries;
  }

  @UseAuthQuard()
  @ApiOkResponse({ type: Diary })
  @ApiParam({ name: 'id', type: Number })
  @Post(':id/diaries')
  async addDiary(
    @Param('id', UserByIdPipe) user: User,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != user.id) throw new UnauthorizedException('no access');
    const newDiary = await this.diariesService.createNew(user);
    return newDiary;
  }

  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id/diaries/:diaryId')
  async updateDiary(
    @Param('id', UserByIdPipe) user: User,
    @Param('diaryId') diaryId: number,
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateDiaryDTO,
  ) {
    if (req.user.id != user.id) throw new UnauthorizedException('no access');
    await this.diariesService.updateDiary(diaryId, body);
    return true;
  }
  @UseAuthQuard()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id/diaries/:diaryId')
  async udeleteDiary(
    @Param('id', UserByIdPipe) user: User,
    @Param('diaryId') diaryId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != user.id) throw new UnauthorizedException('no access');
    await this.diariesService.deleteDiary(diaryId);
    return true;
  }
}
