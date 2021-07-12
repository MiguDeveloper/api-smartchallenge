import { BadRequestException, Logger } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';

export class ValidacaoParametrosPipe implements PipeTransform {
  logger = new Logger();
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `${metadata.type} ${metadata.data} debe ser enviado`,
      );
    }
    this.logger.log(
      `LOGGER [pipe custom validate] value ${value}, metadata: ${metadata.type}`,
    );
    return value;
  }
}
