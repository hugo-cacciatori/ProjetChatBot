import { Tag } from '../../tag/entities/tag.entity';
import { GeneratedRequest } from '../../generated-request/entities/generated-request.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['name'])
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ length: 300 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => GeneratedRequest, (request) => request.products, {
    cascade: true,
  })
  request: GeneratedRequest;

  @ManyToMany(() => Tag, (tag) => tag.products, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
