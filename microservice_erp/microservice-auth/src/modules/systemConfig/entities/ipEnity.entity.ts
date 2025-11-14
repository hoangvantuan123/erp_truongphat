import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('_ERPPublicIPs')
export class ERPPublicIPs {

    @PrimaryGeneratedColumn()
    IdSeq: number;
    @Column({ nullable: true })
    IdxNo: number;
    @Column({ nullable: true })
    IPAddress: string;
    @Column({ nullable: true })
    Description: string;
}