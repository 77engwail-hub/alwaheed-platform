export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface FileStorageProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  delete(fileUrl: string): Promise<boolean>;
  getPublicUrl(fileName: string): string;
}
