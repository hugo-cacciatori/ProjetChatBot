import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneratedRequestDto } from './create-generated-request.dto';

export class UpdateGeneratedRequestDto extends PartialType(
  CreateGeneratedRequestDto,
) {}
