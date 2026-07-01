import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'node:path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { buildUploadFilename, isAcceptedImageUpload } from './upload.utils';
import { UploadsService } from './uploads.service';

const uploadsDir = join(process.cwd(), 'uploads');

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @ApiOperation({ summary: 'Uploader une image (logo équipe, avatar, etc.)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadsDir,
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          callback(null, buildUploadFilename(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (!isAcceptedImageUpload(file)) {
          callback(new Error('Seules les images sont acceptées'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: this.uploadsService.buildPublicUrl(file.filename),
      filename: file.filename,
    };
  }
}
