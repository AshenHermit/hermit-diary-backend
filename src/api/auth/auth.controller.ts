import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './google/auth-google.guard';
import { Response } from 'express';
import { GoogleAuthenticatedRequest } from './google/auth-google.strategy';
import { AppConfig } from 'src/config/config.interface';
import { AppConfigService } from 'src/config/config.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async google() {}

  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleCallback(
    @Req() req: GoogleAuthenticatedRequest,
    @Res() res: Response,
  ) {
    const user = req?.user;
    const token = await this.authService.forceLogin(user.email, user.name, '');
    res.cookie('access_token', token.access_token, {
      domain: this.config.site.commonDomain,
    });

    return res.redirect(this.config.site.host);
  }
}
