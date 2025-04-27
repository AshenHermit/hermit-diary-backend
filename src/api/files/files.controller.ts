import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService, FileUploadResultDTO } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseAuthQuard } from '../auth/jwt-auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { FileUploadDTO } from './file-upload.dto';

@Controller('api/files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload')
  @UseAuthQuard()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'file',
    type: FileUploadDTO,
  })
  @ApiOkResponse({
    type: FileUploadResultDTO,
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.handleFileUpload(file);
  }
}
