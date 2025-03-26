import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Example {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ length: 300 })
  mail!: string;

  @Index({ unique: true })
  @Column({ length: 300 })
  name: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  resetToken: string;

  @Index()
  @Column({ length: 300 })
  password: string;

  @Index()
  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  createdAt!: Date;

  @Index()
  @Column({ type: 'boolean', default: false })
  _isAdmin: boolean;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  //This an exemple of link between tables
  // @OneToMany(() => LinkUserGroup, (linkUserGroup) => linkUserGroup.user, {
  //     cascade: true,
  //     onDelete: 'CASCADE',
  // })
  // linkUserGroups: LinkUserGroup[];
  //
  // @OneToMany(() => Impersonation, (impersonation) => impersonation.user)
  // impersonations: Impersonation[];

  //Example with enums
  // @Index()
  // @Column({ nullable: true, type: 'enum', enum: Language })
  // preferredLanguage: Language;

  @Index()
  @Column({ nullable: true })
  lastConnectedAt: Date;

  @Column({ nullable: true })
  termsValidatedAt: Date;

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
