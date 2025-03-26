import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class Users{

    constructor(firstName: string, lastName: string, username: string, password: string){
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.lastConnection_At = null;
    }

    @PrimaryGeneratedColumn()
    uniqueId: number;

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

    @Column({ type: 'int', nullable: true, default: null })
    request: number | null;

}