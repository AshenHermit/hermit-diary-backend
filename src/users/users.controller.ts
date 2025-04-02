import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/jwt.strategy';
import { UpdateUserDTO } from './update-user.dto';
import { AuthUserDTO } from 'src/auth/auth-user.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { User } from './user.entity';
import { AuthTokenDTO } from 'src/auth/auth-token.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOkResponse({ type: User })
  async register(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthTokenDTO })
  async login(@Body() body: AuthUserDTO) {
    return this.authService.login(body.email, body.password);
  }

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
}
