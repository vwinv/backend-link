import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  buildPublicUrl(filename: string): string {
    const baseUrl = (
      this.configService.get<string>('wallet.appPublicUrl') ??
      'http://localhost:3000'
    ).replace(/\/$/, '');

    return `${baseUrl}/uploads/${filename}`;
  }
}
