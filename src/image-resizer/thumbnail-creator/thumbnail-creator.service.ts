import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

import * as imageMagick from './imagemagick';
import { S3Service } from './s3.service';

@Injectable()
export class ThumbnailCreatorService {
  constructor(private readonly s3Service: S3Service) {}

  public async createThumbnail(s3Key: string, bucket: string) {
    if (!this.shouldResize(s3Key)) {
      return;
    }
    const s3Object = await this.s3Service.getObject(s3Key, bucket);
    if (s3Object && s3Object.Body) {
      const resizedImagePath = await imageMagick.resizeImage(s3Object.Body as string, { width: 120, height: 120 });
      if (resizedImagePath) {
        const newKey = this.composeThumbnailKey(s3Key);
        await this.s3Service.uploadObject(newKey, bucket, readFileSync(resizedImagePath));
        return newKey;
      }
    }
    return null;
  }
  private async updateThumbnailUrl() {
    
  }
  private shouldResize(s3Key: string) {
    const { prefix, type, name, rest } = this.extractImagePropsFromKey(s3Key);
    if (
      prefix === 'public' &&
      (type === 'athlete' || type === 'contest') &&
      !name.includes('thumbnail') &&
      rest.length === 0
    ) {
      return true;
    }
    return false;
  }

  private extractImagePropsFromKey(s3Key: string) {
    const [prefix, type, name, ...rest] = s3Key.split('/');
    return { prefix, type, name, rest };
  }

  private composeThumbnailKey(s3Key: string) {
    const { prefix, type, name, rest } = this.extractImagePropsFromKey(s3Key);
    const n = name.split('.')[0];
    const suffix = name.split('.')[1] || '';
    const thumbnailName = `${n}_thumbnail.${suffix}`;
    return `${prefix}/${type}/${thumbnailName}`;
  }
}
