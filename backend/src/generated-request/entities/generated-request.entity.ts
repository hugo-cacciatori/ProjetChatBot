import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GeneratedRequestStatus } from '../../utils/enum/generatedRequestStatus.enum';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class GeneratedRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GeneratedRequestStatus })
  status: GeneratedRequestStatus;

  @OneToMany(() => Product, (product) => product.request)
  products: Product[];

  @OneToMany(() => User, (User) => User.id)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
}
