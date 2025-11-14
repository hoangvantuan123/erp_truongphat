import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("_ERPUserLoginLogs")
export class ERPUserLoginLogs {
    @PrimaryGeneratedColumn()
    IdSeq: number;

    @Column({ nullable: false })
    UserSeq: number;

    @Column({ type: "nvarchar", length: 255, nullable: false })
    Login: string;

    @Column({ type: "nvarchar", length: 50, nullable: true })
    IpAddress?: string;

    @Column({ type: "nvarchar", length: 500, nullable: true })
    UserAgent?: string;

    @Column({ type: "nvarchar", length: 100, nullable: true })
    Platform?: string;

    @Column({ type: "nvarchar", length: 50, nullable: true })
    Language?: string;

    @Column({ type: "nvarchar", length: 20, nullable: true })
    ScreenResolution?: string;

    @Column({ type: "nvarchar", length: 100, nullable: true })
    Timezone?: string;

    @Column({ type: "bit", nullable: true })
    IsMobile?: boolean;

    @Column({ type: "nvarchar", length: 100, nullable: true })
    DeviceName?: string;

    @Column({ type: "int", nullable: true })
    HardwareConcurrency?: number;

    @Column({ type: "int", nullable: true })
    Memory?: number;


    @Column({ type: "int", nullable: true })
    AudioDevices?: number;

    @Column({ type: "int", nullable: true })
    VideoDevices?: number;

    @Column({ type: "int", nullable: true })
    MaxTouchPoints?: number;

    @Column({ nullable: true })
    Latitude?: number;
    @Column({ nullable: true })
    DeviceId?: string;
    @Column({ nullable: true })
    StatusLogs?: boolean;

    @Column({ nullable: true })
    Longitude?: number;

    @CreateDateColumn({ type: "datetime" })
    LoginTime: Date;

    @Column({ nullable: true })
    IdxNo: number;
}
