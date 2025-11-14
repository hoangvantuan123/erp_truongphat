import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcPdEquiptInspectService } from '../grpc/service/grpc.asset.pd_equipt_inspect.service';
@Controller('v18/equip-inspect')
export class AssetEquipInspectController {
  constructor(private readonly grpcPdEquip: GrpcPdEquiptInspectService) {}

  @Post('/search-equip-inspect')
  searchAssetEquipt(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.searchEquiptInspect(
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

  @Post('/cud-pd-inspect')
    createOrUpdateDaDept(@Body() body: { dataInspect: any[] }, @Req() req: Request) {
        if (!body) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }


        const authorization = req.headers.authorization || '';
        const requestData = { dataInspect: body.dataInspect, metadata: { authorization } };

        return lastValueFrom(this.grpcPdEquip.createOrUpdatePdEquipInspect(
          requestData.dataInspect, 
          requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }


    @Post('/delete-eqp-inspect')
    deletePdEquipInspect(@Body() body: { dataInspect: any[] }, @Req() req: Request) {
        if (!body) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { dataInspect: body.dataInspect, metadata: { authorization } };

        return lastValueFrom(this.grpcPdEquip.deletePdEquipInspect(
          requestData.dataInspect, 
          requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }
  
}
