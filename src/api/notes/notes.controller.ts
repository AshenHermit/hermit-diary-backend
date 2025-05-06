import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { UseAuthQuard, UseSilentAuthQuard } from '../auth/jwt-auth.guard';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Note } from 'src/database/entities/note.entity';
import { SilentAuthRequest } from '../auth/jwt.strategy';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseSilentAuthQuard()
  @ApiOkResponse({ type: Note, isArray: true })
  @ApiQuery({ name: 'diaryId', required: false })
  @Get()
  async selectNotes(
    @Req() req: SilentAuthRequest,
    @Query('diaryId', new ParseIntPipe({ optional: true })) diaryId?: number,
  ) {
    return await this.notesService.fetch({ diaryId: diaryId, user: req.user });
  }

  @UseSilentAuthQuard()
  @ApiOkResponse({ type: Note })
  @ApiParam({ name: 'noteId', type: Number })
  @Get(':noteId')
  async getNote(
    @Param('noteId', new ParseIntPipe()) noteId: number,
    @Req() req: SilentAuthRequest,
  ) {
    return await this.notesService.getByIdForUser(noteId, req.user);
  }
}
