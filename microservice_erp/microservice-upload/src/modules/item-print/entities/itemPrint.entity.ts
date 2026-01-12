import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
/* Nhóm hạng mục kiểm tra */
@Entity('ItemPrint')
export class ItemPrint {

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
    ItemSeq: number;
    @Column({ nullable: true })
    ItemNo: string;

    @Column({ nullable: true, unique: true })
    QrCode: string;
    @Column({ nullable: true, unique: true })
    QrCodeNew: string;
    @Column({ nullable: true, unique: true })
    QrCodeOld: string;

    @Column({ nullable: true })
    CustSeq: number;

    @Column({ nullable: true })
    BagType: string;

    @Column({ nullable: true })
    BagTypeName: string;

    @Column({ nullable: true })
    StatusItem: string;

    @Column({ nullable: true })
    Color: string;

    /*    @Column({ nullable: true })
       Qty: number;
   
       @Column({ nullable: true })
       QtyOld: number;
       @Column({ nullable: true })
       QtyNew: number; */

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    Qty: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    QtyOld: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    QtyNew: number;


    @Column({ nullable: true })
    LotNo: string;

    @Column({ nullable: true })
    LotNoFull: string;

    @Column({ nullable: true })
    StockInDate: string;/* Ngày nhập kho */
    @Column({ nullable: true })
    ProduDate: string; /* NGày sản xuất */

    @Column({ nullable: true })
    ProductType: number; /* loại sản xuất */


    @Column({ nullable: true })
    ReelNo: string;

    @Column({ nullable: true })
    UserSeq: number;

    @Column({ nullable: true })
    Location: string;

    @Column({ nullable: true })
    Remark: string;
    @Column({ nullable: true })
    Pallet: string;

    @Column({ nullable: true })
    Memo01: string;
    @Column({ nullable: true })
    Memo02: string;
    @Column({ nullable: true })
    Memo03: string;
    @Column({ nullable: true })
    Memo04: string;
    @Column({ nullable: true })
    Memo05: string;


}
