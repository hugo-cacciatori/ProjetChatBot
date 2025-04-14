import { GeneratedRequestStatus } from '../../utils/enum/generatedRequestStatus.enum';

export class CreateGeneratedRequestDto {
  usedKeywords?: string[];
  status?: GeneratedRequestStatus;
}
