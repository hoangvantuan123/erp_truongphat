import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPTempFile')
export class ERPTempFile {
  @PrimaryColumn('uuid')
  IdSeq: string;


  @Column({ nullable: true})
  SupplyContSeq: string;
  @Column({ nullable: true})
  GroupsTempCode: string;


  @Column({ nullable: true })
  FormCode: string;

  @Column({ nullable: true })
  FieldName: string;

  @Column({ nullable: true })
  OriginalName?: string;

  @Column({ nullable: true })
  Encoding?: string;

  @Column({ nullable: true })
  MimeType?: string;


  @Column({ nullable: true })
  Destination: string;
  @Column({ nullable: true })
  Filename: string;

  @Column({ nullable: true })
  Path: string;
  @Column({ nullable: true })
  PathRoot: string;
  @Column({ nullable: true })
  Size: number;

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
