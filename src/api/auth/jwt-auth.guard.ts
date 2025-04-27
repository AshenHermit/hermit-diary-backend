import { applyDecorators, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export function UseAuthQuard() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
