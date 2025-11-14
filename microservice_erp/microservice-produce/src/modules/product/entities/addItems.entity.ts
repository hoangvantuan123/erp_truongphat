import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('_ERPAddItems')
export class ERPAddItems {
  @PrimaryGeneratedColumn()
  IdSeq: number;

  @Column({ nullable: true })
  Area: string;

  @Column({ nullable: true })
  EquipmentModel: string;

  @Column({ nullable: true })
  ReplacementCycle: string;

  @Column({ nullable: true })
  PurposeOfUse: string;

  @Column({ nullable: true })
  RackOfLocation: string;

  @Column({ nullable: true })
  RecyclcTime: string;

  @Column({ nullable: true })
  P_N: string;

  @Column({ nullable: true })
  RefDES: string;

  @Column({ nullable: true })
  Maker: string;

  @Column({ nullable: true })
  MfrPartNumber: string;

  @Column({ nullable: true })
  Description: string;

  @Column({ nullable: true })
  BulkID: string;

  @Column({ nullable: true })
  StationGroup: string;

  @Column({ nullable: true })
  ToolKind: string;

  @Column({ nullable: true })
  ToolCategory: string;

  @Column({ nullable: true })
  MPNPI: string;

  @Column({ nullable: true })
  PartNoType: string;

  @Column({ nullable: true })
  IQCCheck: boolean;

  @Column({ nullable: true })
  MGMTReplaceTarget: boolean;

  @Column({ nullable: true })
  ExchangeCycleType: string;

  @Column({ nullable: true })
  MESCountStandard: string;

  @Column({ nullable: true })
  ExchangePeriod: number;

  @Column({ nullable: true })
  AlarmPeriod: number;

  @Column({ nullable: true })
  Col01: string;

  @Column({ nullable: true })
  Col02: string;

  @Column({ nullable: true })
  Col03: string;

  @Column({ nullable: true })
  Col04: string;

  @Column({ nullable: true })
  Col05: string;

  @Column({ nullable: true })
  Col06: string;

  @Column({ nullable: true })
  ItemNoSeq: number;

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