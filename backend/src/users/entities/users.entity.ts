import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GeneratedRequest } from 'src/generated-request/entities/generated-request.entity';

@Entity()
export class Users{



    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username : string

    @Column()
    password : string

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @CreateDateColumn()
    created_At: Date;

    @UpdateDateColumn()
    updated_At: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastConnection_At: Date;

    @OneToMany(() => GeneratedRequest, (generatedRequest) => generatedRequest.id, { cascade: true, nullable: true })
    request: GeneratedRequest | null;

    @Column({ type: 'boolean', default: false })
    isPremium : boolean
}