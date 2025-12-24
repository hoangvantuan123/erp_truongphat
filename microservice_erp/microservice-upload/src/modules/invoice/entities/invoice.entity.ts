import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPFileInvocie')
export class ERPFileInvocie {
  @PrimaryGeneratedColumn()
  IdSeq: number;

  @Column({ nullable: true })
  FormCode: string;

  @Column({ nullable: true })
  Destination: string;

  @Column({ nullable: true })
  Path: string;

  @Column({ nullable: true })
  IdxNo: number;
  @Column({ nullable: true })
  CreatedBy: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @Column({ nullable: true })
  UpdatedBy: number;

  @UpdateDateColumn()
  UpdatedAt: Date;

}
