import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('PayCondition')
export class PayCondition {
    @PrimaryColumn('uuid')
    IdSeq: string;

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

    @Column({ nullable: true })
    UMPayCondSeq: number;


    @Column({ nullable: true })
    SupplyContSeq: number;
    // Tỷ lệ thanh toán (số thực)
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    PayRate: number;

    // Số tiền thanh toán
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    PayAmt: number;

    // Số tiền thanh toán (nguyên tệ)
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    DomPayAmt: number; 

    // Thanh toán VAT
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    PayVATAmt: number;

    // VAT (nguyên tệ)
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    DomPayVATAmt: number;

    // Tổng số tiền thanh toán
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    SumPayAmt: number;

    // Tổng số tiền thanh toán (nguyên tệ)
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    DomSumPayAmt: number;

    // Ngày thanh toán dự kiến
    @Column({ nullable: true })
    PayPlanDate: string;
    @Column({ nullable: true })
    PayRepeatDate: string;
    @Column({ nullable: true })
    Status: string;

    // VAT Amount
    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    VATAmt: number;

    // Ghi chú
    @Column({ type: 'nvarchar', length: 500, nullable: true })
    PayCondRemark: string;

    @Column({ nullable: true, })
    PayCondStatusSeq: number;
}