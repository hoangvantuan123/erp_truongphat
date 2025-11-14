import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('_TCALanguage_WEB')
export class TCALanguageWeb {

    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: true })
    LanguageSeq: number;

    @Column({ nullable: true })
    LanguageName: string;

    @Column({ nullable: true })
    Remark: string;

    @Column({ nullable: true })
    SortOrder: number;

    @Column({ nullable: true })
    IsUse: string;

    @Column({ nullable: true })
    FileName: string;

    @Column({ nullable: true })
    LastUserSeq: number;

    @CreateDateColumn({ type: 'datetime', nullable: true })
    LastDateTime: Date;

    @Column({ nullable: true })
    LanguageCode: string;



    @Column({ nullable: true })
    IdxNo: number;
}