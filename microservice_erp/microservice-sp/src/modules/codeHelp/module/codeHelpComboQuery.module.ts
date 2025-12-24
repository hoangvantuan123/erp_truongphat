import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { CodeHelpComboQueryService } from '../service/codeHelpComboQuery.service';
import { CodeHelpQueryController } from '../controller/codeHelpQuery.controller';
import { CodeHelpComboQueryController } from '../controller/codeHelpComboQuery.controller';
import { CodeHelpQueryService } from '../service/codeHelpQuery.service';
import { DatabaseService230427 } from 'src/common/database/sqlServer/ITMV230427/database.service';
@Module({
  imports: [],
  providers: [
    DatabaseService,
    DatabaseService230427,
    CodeHelpComboQueryService,
    CodeHelpQueryService
  ],
  controllers: [CodeHelpComboQueryController, CodeHelpQueryController],
  exports: [],
})
export class CodeHelpComboQueryModule { }
