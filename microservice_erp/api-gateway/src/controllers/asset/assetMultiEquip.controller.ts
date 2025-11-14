import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcPdMultiEquiptService } from '../grpc/service/grpc.asset.pd_multi_equipt.service';
@Controller('v18/multi-equip')
export class AssetMultiEquipController {
  constructor(private readonly grpcPdEquip: GrpcPdMultiEquiptService) {}

  @Post('/search-multi-equip')
  searchMultiEquipt(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.searchMultiEquipt(
        requestData.result,
        requestData.metadata,
      ),
    )
      .then((resu) => {
        return resu;
      })
      .catch((error) => {
        return { success: false, message: 'Internal Server Error' };
      });
  }

  @Post('/cud-pd-multi')
  createOrUpdatePdMultiEquip(
    @Body() body: { dataPdEquip: any[]; dataAssyTool: any[]; dataMng: any[] },
    @Req() req: Request,
  ) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      dataPdEquip: body.dataPdEquip,
      dataAssyTool: body.dataAssyTool,
      dataMng: body.dataMng,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPdEquip.createOrUpdatePdMultiEquip(
        requestData.dataPdEquip,
        requestData.dataAssyTool,
        requestData.dataMng,
        requestData.metadata,
      ),
    )
      .then((resu) => {
        return resu;
      })
      .catch((error) => {
        return { success: false, message: 'Internal Server Error' };
      });
  }

  @Post('/delete-eqp-multi')
   deletePdMultiEquip(
    @Body() body: { dataPdEquip: any[]; dataAssyTool: any[]; dataMng: any[] },
    @Req() req: Request,
  ) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      dataPdEquip: body.dataPdEquip,
      dataAssyTool: body.dataAssyTool,
      dataMng: body.dataMng,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPdEquip.deletePdMultiEquip(
        requestData.dataPdEquip,
        requestData.dataAssyTool,
        requestData.dataMng,
        requestData.metadata,
      ),
    )
      .then((resu) => {
        return resu;
      })
      .catch((error) => {
        return { success: false, message: 'Internal Server Error' };
      });
  }
}
