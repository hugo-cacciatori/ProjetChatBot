import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GeneratedRequestStatus } from '../../utils/enum/generatedRequestStatus.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class GeneratedRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GeneratedRequestStatus })
  status: GeneratedRequestStatus;

  @OneToMany(() => User, (User) => User.id)
  users: User[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
}
