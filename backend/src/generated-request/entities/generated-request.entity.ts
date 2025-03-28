import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GeneratedRequestStatus } from '../../utils/enum/generatedRequestStatus.enum';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class GeneratedRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GeneratedRequestStatus })
  status: GeneratedRequestStatus;

  @OneToMany(() => Product, (product) => product.request)
  products: Product[];

  //TODO: link to user
}
