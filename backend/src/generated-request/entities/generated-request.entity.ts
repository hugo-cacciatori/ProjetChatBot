import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GeneratedRequestStatus } from '../../utils/enum/generatedRequestStatus.enum';

@Entity()
export class GeneratedRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GeneratedRequestStatus })
  status: GeneratedRequestStatus;

  //TODO: link to product and user
}
