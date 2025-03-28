import { PartialType } from "@nestjs/mapped-types";
import { RegisterAccountRequestDto } from "src/auth/dto/register-account-request.dto";



export class UpdateUsersDto extends PartialType(RegisterAccountRequestDto) {}