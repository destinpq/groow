import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadService {
  private uploadPath: string;

  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
    private configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get('UPLOAD_PATH') || './uploads';
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    const subdirs = ['products', 'vendors', 'categories', 'documents'];
    subdirs.forEach(dir => {
      const dirPath = path.join(this.uploadPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    entityType?: string,
    entityId?: string,
  ): Promise<Upload> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname.replace(/\s+/g, '-')}`;
    const subdir = entityType || 'documents';
    const filePath = path.join(this.uploadPath, subdir, filename);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    const baseUrl = this.configService.get('BASE_URL') || 'https://nz-api.destinpq.com';
    const fileUrl = `${baseUrl}/uploads/${subdir}/${filename}`;

    const upload = this.uploadRepository.create({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
      url: fileUrl,
      uploadedBy: userId,
      entityType,
      entityId,
    });

    return this.uploadRepository.save(upload);
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    userId: string,
    entityType?: string,
    entityId?: string,
  ): Promise<Upload[]> {
    const uploads = await Promise.all(
      files.map(file => this.uploadFile(file, userId, entityType, entityId)),
    );
    return uploads;
  }

  async getUploadsByEntity(entityType: string, entityId: string): Promise<Upload[]> {
    return this.uploadRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteUpload(id: string): Promise<void> {
    const upload = await this.uploadRepository.findOne({ where: { id } });

    if (!upload) {
      throw new BadRequestException('Upload not found');
    }

    // Delete file from disk
    if (fs.existsSync(upload.path)) {
      fs.unlinkSync(upload.path);
    }

    await this.uploadRepository.remove(upload);
  }

  async getUserUploads(userId: string): Promise<Upload[]> {
    return this.uploadRepository.find({
      where: { uploadedBy: userId },
      order: { createdAt: 'DESC' },
    });
  }
}
