import { Injectable, PipeTransform, Optional, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isUUID } from '@nestjs/common/utils/is-uuid';

export interface CustomParseUUIDPipeOptions {
  message?: string;
}

@Injectable()
export class CustomParseUUIDPipe implements PipeTransform<string> {
  private message: string;
  constructor(@Optional() options?: CustomParseUUIDPipeOptions) {
    options = options || {};
    this.message = options.message;
  }
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (!isUUID(value)) {
      throw new BadRequestException(this.message || `${metadata.data} is not valid`);
    }
    return value;
  }
}
