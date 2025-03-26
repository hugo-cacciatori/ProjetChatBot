import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LlmService {
  constructor() {}

  request(row: any) {
    try {
      //TODO : See doc to request to LLM
      //TODO : Create product and tags
      //TODO : return product and tags
      return row;
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while created request',
        error,
      );
    }
  }
}
