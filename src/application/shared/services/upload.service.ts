import * as path from 'path';
import * as shortid from 'shortid';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}
  async upload(file): Promise<string> {
    const bucketS3 = this.configService.get('aws.s3Bucket');
    const linkFile = await this.uploadS3(file, bucketS3);
    return linkFile;
  }

  async uploadS3(file, bucket): Promise<string> {
    const s3BaseUrl = process.env.AWS_S3_BASE_URL;
    const fileName =
      Date.now() + shortid.generate() + path.parse(file.originalname).ext;
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };
    const s3Res = await s3.putObject(params).promise();
    const linkFile = s3Res && s3Res.ETag ? s3BaseUrl + '/' + fileName : null;
    return linkFile;
  }

  getS3(): S3 {
    return new S3({
      accessKeyId: this.configService.get('aws.s3accessKeyId'),
      secretAccessKey: this.configService.get('aws.s3SecretAccessKey'),
    });
  }
}
