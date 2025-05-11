import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteContentService } from './note-content.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NotesService, NoteContentService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
