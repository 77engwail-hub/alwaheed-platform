import * as fs from 'fs';
import * as path from 'path';
import type { FileStorageProvider, UploadResult } from './storage-provider.interface.js';

export class LocalStorageProvider implements FileStorageProvider {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), process.env.LOCAL_UPLOAD_PATH || './uploads');
    this.baseUrl = process.env.API_URL || 'http://localhost:4000/api/v1';

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, folder: string = 'general'): Promise<UploadResult> {
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const targetPath = path.join(targetFolder, safeName);

    await fs.promises.writeFile(targetPath, file.buffer);

    const relativePath = `/uploads/${folder}/${safeName}`;
    const fileUrl = `${this.baseUrl}${relativePath}`;

    return {
      fileName: safeName,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      const urlParts = fileUrl.split('/uploads/');
      if (urlParts.length < 2) return false;
      const relativePath = urlParts[1];
      const filePath = path.join(this.uploadDir, relativePath);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getPublicUrl(fileName: string): string {
    return `${this.baseUrl}/uploads/${fileName}`;
  }
}

export const defaultStorage = new LocalStorageProvider();
