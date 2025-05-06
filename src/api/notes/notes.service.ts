import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/database/entities/note.entity';
import { User } from 'src/database/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Diary } from 'src/database/entities/diary.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  async assertNoteWriteAccess(user: User, note: Note) {
    if (user.id != note.diary.user.id)
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
  }: {
    noteId?: number;
    user?: User;
    diaryId?: number;
  }) {
    let query = this.notesRepository.createQueryBuilder('note');
    if (diaryId !== undefined) {
      query = query.innerJoin('note.diary', 'diary');
    } else {
      query = query.innerJoinAndSelect('note.diary', 'diary');
    }
    query = query.innerJoin('diary.user', 'user');
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
    return (await this.selectQuery({ noteId, user })).getOne();
  }

  async fetch(params: Parameters<typeof this.selectQuery>[0]) {
    return (await this.selectQuery(params)).getMany();
  }

  async addNote(diary: Diary) {
    const newNote = this.notesRepository.create({ diary });
    const savedNote = await this.notesRepository.save(newNote);
    return savedNote;
  }
}
