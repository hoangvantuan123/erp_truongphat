import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { createWinstonLoggerOptions } from './logger.config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(
      createWinstonLoggerOptions('microservice-hr'),
    ),
  });
  const logger = new Logger('Bootstrap');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.HOST_RGPC_HR ?? 'localhost:5005',
      package: [
        'hr.info.hr_emp_pln',
        'hr.info.hr_emp_one',
        'hr.info.hr_base_family',
        'hr.info.hr_bas_academic',
        'hr.info.hr_bas_address',
        'hr.info.hr_bas_linguistic',
        'hr.info.hr_bas_prz_pnl',
        'hr.info.hr_bas_travel',
        'hr.info.hr_bas_union',
        'hr.info.hr_bas_org_pos',
        'hr.info.hr_bas_org_job',
        'hr.info.hr_bas_career',
        'hr.info.hr_bas_pjt_career',
        'hr.org.org_dept',
        'hr.org.org_dept_tree',
        'hr.org.emp_org_dept',
        'hr.info.hr_bas_military',
        'hr.info.hr_bas_license_check',
        'hr.info.hr_emp_user_define',
        'hr.info.hr_file',
        'hr.info.hr_emp_date',
        'hr.info.hr_search_statistic',
        'hr.edu.edu_type',
        'hr.edu.edu_course',
        'hr.edu.edu_class',
        'hr.edu.edu_lecturer',
        'hr.edu.edu_per_rst',


        /* TUYỂN DỤNG  */

        'hr.hr_recruit.hr_academy_recruit',
        'hr.hr_recruit.hr_career_item_recruit',
        'hr.hr_recruit.hr_career_recruit',
        'hr.hr_recruit.hr_emp_recruit',
        'hr.hr_recruit.hr_family_recruit',
        'hr.hr_recruit.hr_langs_recruit',
        'hr.hr_recruit.hr_office_skill_recruit',
        'hr.define.define_item',
        'hr.define.define',
        'hr.hr_general.adm_ord',
        'hr.hr_general.labor_contract',
        'hr.hr_general.labor_contract_print',


        /* LUONG */

        'hr.daily_att.sp_r_wk_item',
        'hr.daily_att.calendar_holiday',
        'hr.daily_att.wk_over_time_approve',
        'hr.daily_att.sprwk_abs_emp',
        'hr.daily_att.sp_rwk_mm_emp_day',
        'hr.daily_att.sp_wk_emp_dd'
      ],
      protoPath: [
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_emp_pln.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_emp_one.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_base_family.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_academic.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_address.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_linguistic.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_prz_pnl.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_travel.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_union.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_org_pos.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_org_job.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_career.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_pjt_career.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'org', 'org_dept.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'org', 'org_dept_tree.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'org', 'emp_org_dept.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_military.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_bas_license_check.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_emp_user_define.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_file.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_emp_date.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'info', 'hr_search_statistic.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_general', 'adm_ord.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_general', 'labor_contract.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_general', 'labor_contract_print.proto'),

        /* TUYỂN DỤNG  */


        join(__dirname, '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_academy_recruit.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_career_item_recruit.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_career_recruit.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_emp_recruit.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_family_recruit.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_langs_recruit.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'hr_recruit', 'hr_office_skill_recruit.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'define', 'define_item.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'define', 'define.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'edu', 'edu_type.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'edu', 'edu_course.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'edu', 'edu_class.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'edu', 'edu_lecturer.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'edu', 'edu_per_rst.proto'),



        /* LUONG */
        join(__dirname, '..', '..', 'proto', 'hr', 'daily_att', 'sp_r_wk_item.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'daily_att', 'calendar_holiday.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'daily_att', 'wk_over_time_approve.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'daily_att', 'sprwk_abs_emp.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'daily_att', 'sp_rwk_mm_emp_day.proto'),
        join(__dirname, '..', '..', 'proto', 'hr', 'daily_att', 'sp_wk_emp_dd.proto'),





      ],
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
      channelOptions: {
        'grpc.max_concurrent_streams': 100,
        'grpc.default_compression_algorithm': 2, // Gzip
        'grpc.max_receive_message_length': 1024 * 1024 * 1024, // ✅ 200MB nhận
        'grpc.max_send_message_length': 1024 * 1024 * 1024, // ✅ 200MB gửi
        'grpc.http2.lookahead_bytes': 0, // ⚡ Tăng tốc streaming
        'grpc.enable_http_proxy': 0, // 🔒 Tránh bị proxy chặn
      },
    },
  });

  await app.startAllMicroservices();
  logger.log(`🚀 REST API chạy trên ${process.env.HOST_PORT_HR}`);
  await app.listen(process.env.HOST_PORT_HR ?? 5005);
}

bootstrap();
