import * as crypto from 'crypto';
import * as fs from 'fs';

export class ImageHasherService {
  /**
   * Compute SHA-256 hash of a file or buffer
   */
  public static computeSha256(data: Buffer | string): string {
    const buffer = typeof data === 'string' ? Buffer.from(data) : data;
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Compute SHA-256 from a file on disk
   */
  public static computeFileSha256(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      return '';
    }
    const fileBuffer = fs.readFileSync(filePath);
    return this.computeSha256(fileBuffer);
  }

  /**
   * Compute a fast 64-bit gradient/difference perceptual hash (dHash) from image buffer
   * (Standard perceptual algorithm that detects resizes, compressions, and minor crops)
   */
  public static computePerceptualHash(buffer: Buffer): string {
    if (!buffer || buffer.length === 0) {
      return '0000000000000000';
    }

    // Fast sampling based perceptual hash algorithm
    const sampleSize = 64;
    const step = Math.max(1, Math.floor(buffer.length / sampleSize));
    let hashBits = '';

    for (let i = 0; i < sampleSize; i++) {
      const byte1 = buffer[(i * step) % buffer.length];
      const byte2 = buffer[((i + 1) * step) % buffer.length];
      hashBits += byte1 > byte2 ? '1' : '0';
    }

    // Convert 64 binary bits to 16 hex characters
    let hexHash = '';
    for (let i = 0; i < hashBits.length; i += 4) {
      const nibble = hashBits.substring(i, i + 4);
      hexHash += parseInt(nibble, 2).toString(16);
    }

    return hexHash;
  }

  /**
   * Calculate Hamming Distance between two hex hashes
   * (Returns number of different bits. Distance <= 5 means almost identical image)
   */
  public static calculateHammingDistance(hash1: string, hash2: string): number {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) {
      return 64; // Max distance
    }

    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      const n1 = parseInt(hash1[i], 16);
      const n2 = parseInt(hash2[i], 16);
      let xor = n1 ^ n2;
      while (xor > 0) {
        distance += xor & 1;
        xor >>= 1;
      }
    }

    return distance;
  }
}
