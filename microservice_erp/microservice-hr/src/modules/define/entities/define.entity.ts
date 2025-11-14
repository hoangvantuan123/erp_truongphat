import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPDefine')
export class ERPDefine {
  @PrimaryGeneratedColumn()
  IdSeq: number;

  @Column({ nullable: true })
  DefineName: string;

  @Column({ nullable: true, unique: true })
  DefineKey: number;

  @Column({ nullable: true })
  Description: string;

  @Column({ nullable: true })
  IsActive: boolean;

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
