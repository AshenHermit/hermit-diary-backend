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
import { JwtAuthGuard } from 'src/api/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/api/auth/jwt.strategy';
import { UpdateUserDTO } from './update-user.dto';
import { AuthUserDTO } from 'src/api/auth/auth-user.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { AuthTokenDTO } from 'src/api/auth/auth-token.dto';
import { User } from 'src/database/entities/user.entity';
import {
  SocialLinksService,
  UpdateSocialLinkDTO,
} from './social-links.service';
import { SocialLink } from 'src/database/entities/social-link.entity';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly linksService: SocialLinksService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  @Patch('profile')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    const user = req.user;
    await this.usersService.update(user.id, updateUserDto);
    return this.usersService.findOneByEmail(user.email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Delete('profile')
  async deleteProfile(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    await this.usersService.remove(user.id);
    return true;
  }

  @ApiOkResponse({ type: SocialLink })
  @Get(':id/sociallinks')
  async getSocialLinks(@Param('id') id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new BadRequestException('user not found');
    return (await this.linksService.getByUser(user)) ?? [];
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SocialLink })
  @Post(':id/sociallinks')
  async addSocialLink(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != id) throw new UnauthorizedException('no access');

    const user = await this.usersService.findOneById(id);
    if (!user) throw new BadRequestException('user not found');

    const newLink = this.linksService.addNew(user);
    return newLink;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Patch(':id/sociallinks/:socialLinkId')
  async updateSocialLink(
    @Param('id') id: number,
    @Param('socialLinkId') socialLinkId: number,
    @Body() data: UpdateSocialLinkDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != id) throw new UnauthorizedException('no access');

    const user = await this.usersService.findOneById(id);
    if (!user) throw new BadRequestException('user not found');

    await this.linksService.update(socialLinkId, data);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  @Delete(':id/sociallinks/:socialLinkId')
  async deleteSocialLink(
    @Param('id') id: number,
    @Param('socialLinkId') socialLinkId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.id != id) throw new UnauthorizedException('no access');

    const user = await this.usersService.findOneById(id);
    if (!user) throw new BadRequestException('user not found');

    await this.linksService.delete(socialLinkId);
    return true;
  }
}
