import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('_TCADictionary_WEB')
export class TCADictionarysWeb {
    @PrimaryGeneratedColumn()
    IdSeq: number; 

    @Column({ type: 'int', nullable: false })
    LanguageSeq: number;

    @Column({ type: 'int', nullable: false })
    WordSeq: number;

    @Column({
        type: 'nvarchar',
        length: 400,
        nullable: true, 
        collation: 'Korean_Wansung_CI_AS'
    })
    Word: string;

    @Column({
        type: 'nvarchar',
        length: 400,
        nullable: true,
        collation: 'Korean_Wansung_CI_AS'
    })
    WordSite: string;

    @Column({
        type: 'nvarchar',
        length: 4000,
        nullable: true,
        collation: 'Korean_Wansung_CI_AS'
    })
    Description: string;

    @Column({ type: 'int', nullable: false })
    LastUserSeq: number;

    @CreateDateColumn({ type: 'datetime', nullable: false })
    LastDateTime: Date;

    @Column({ type: 'int', nullable: true })
    CompanySeq: number;

    @Column({ type: 'int', nullable: true })
    PgmSeq: number;


    @Column({ nullable: true })
    IdxNo: number;
}
