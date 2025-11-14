import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('_ERPMails')
export class ERPMails {

    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: true })
    Host: string;

    @Column({ nullable: true })
    Port: string;

    @Column({ nullable: true })
    UserName: string;

    @Column({ nullable: true })
    Password: string;

    @Column({ nullable: true })
    CodeMail: string;

    @Column({ nullable: true })
    IdxNo: number;

}