import { PartialType } from '@nestjs/mapped-types';
import { RegisterAccountRequestDto } from '../../auth/dto/register-account-request.dto';

export class UpdateUsersDto extends PartialType(RegisterAccountRequestDto) {}
