import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [UsersModule, AuthModule, FilesModule, NotesModule],
})
export class ApiModule {}
