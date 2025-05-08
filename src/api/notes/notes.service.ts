import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { User } from 'src/database/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Diary } from 'src/database/entities/diary.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateNoteDTO {
  @ApiProperty({ example: 'Untitled', description: 'name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({ example: 'true', description: 'is public', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async assertNoteWriteAccess(user: User, noteId: number) {
    const note = await this.getByIdForUser(noteId, user);

    if (!note || user.id != note.diary.user.id)
      throw new UnauthorizedException('no access');
  }
  async assertNoteReadAccess(user: User | undefined, note: Note) {
    if (note.isPublic) return;
    if (user) {
      if (user.id == note.diary.user.id) return;
    }
    throw new UnauthorizedException('no access');
  }

  async selectQuery({
    noteId,
    user,
    diaryId,
    selectUser,
  }: {
    noteId?: number;
    user?: User;
    diaryId?: number;
    selectUser?: boolean;
  }) {
    let query = this.notesRepository.createQueryBuilder('note');
    if (diaryId !== undefined) {
      query = query.innerJoin('note.diary', 'diary');
    } else {
      query = query.innerJoinAndSelect('note.diary', 'diary');
    }
    if (selectUser) {
      query = query.innerJoinAndSelect('diary.user', 'user');
    } else {
      query = query.innerJoin('diary.user', 'user');
    }
    if (user !== undefined) {
      query = query.where(
        new Brackets((qb) => {
          qb.where('note.isPublic = true AND diary.isPublic = true').orWhere(
            'user.id = :userId',
            { userId: user.id },
          );
        }),
      );
    } else {
      query = query.where(
        new Brackets((qb) => {
          qb.where('note.isPublic = true').andWhere('diary.isPublic = true');
        }),
      );
    }
    if (noteId !== undefined) {
      query = query.andWhere('note.id = :noteId', { noteId });
    }
    if (diaryId !== undefined) {
      query = query.andWhere('diary.id = :diaryId', { diaryId });
    }
    return query;
  }

  async getByIdForUser(noteId: number, user: User | undefined) {
    return (
      await this.selectQuery({ noteId, user, selectUser: true })
    ).getOne();
  }

  async fetch(params: Parameters<typeof this.selectQuery>[0]) {
    return (await this.selectQuery(params)).getMany();
  }

  async addNote(diary: Diary) {
    const newNote = this.notesRepository.create({ diary });
    const savedNote = await this.notesRepository.save(newNote);
    return savedNote;
  }

  async updateDiary(id: number, updateDto: UpdateNoteDTO) {
    await this.notesRepository.update(id, updateDto);
  }

  async deleteDiary(id: number) {
    await this.notesRepository.delete(id);
  }
}
