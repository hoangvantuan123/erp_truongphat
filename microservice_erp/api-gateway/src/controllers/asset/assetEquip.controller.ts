import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcPdEquiptService } from '../grpc/service/grpc.asset.pd_equipt.service';
@Controller('v18/asset-equip')
export class AssetEquipController {
  constructor(private readonly grpcPdEquip: GrpcPdEquiptService) {}

  @Post('/search-asset-equip')
  searchAssetEquipt(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.searchAssetEquipt(
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

  @Post('/get-pd-equip')
  getToolQuery(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.getToolQuery(requestData.result, requestData.metadata),
    )
      .then((resu) => {
        return resu;
      })
      .catch((error) => {
        return { success: false, message: 'Internal Server Error' };
      });
  }

  @Post('/get-pd-equip-mold')
  getToolAssyQuery(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.getToolAssyQuery(
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

  @Post('/get-pd-equip-repair')
  getToolRepairQuery(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.getToolRepairQuery(
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

  @Post('/get-tool-info-define')
  getUserDefineQuery(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.getUserDefineQuery(
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

      @Post('/cud-pd-equip')
    createOrUpdateDaDept(@Body() body: { dataPdEquip: any[], dataAssyTool: any[], dataMng: any[] }, @Req() req: Request) {
        if (!body) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }


        const authorization = req.headers.authorization || '';
        const requestData = { dataPdEquip: body.dataPdEquip, dataAssyTool: body.dataAssyTool, dataMng: body.dataMng, metadata: { authorization } };

        return lastValueFrom(this.grpcPdEquip.createOrUpdatePdEquip(
          requestData.dataPdEquip, 
          requestData.dataAssyTool,
          requestData.dataMng,
          requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('/delete-mold')
    deleteMold(@Body() body: { dataMold: any[] }, @Req() req: Request) {
        if (!body) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }

        const authorization = req.headers.authorization || '';
        const requestData = { dataMold: body.dataMold, metadata: { authorization } };

        return lastValueFrom(this.grpcPdEquip.deleteMold(
          requestData.dataMold, 
          
          requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

    @Post('/delete-pd-equip')
    deletePdEquip(@Body() body: { dataPdEquip: any[], dataAssyTool: any[], dataMng: any[] }, @Req() req: Request) {
        if (!body) {
            return { success: false, message: 'Invalid request: Missing "result"' };
        }


        const authorization = req.headers.authorization || '';
        const requestData = { dataPdEquip: body.dataPdEquip, dataAssyTool: body.dataAssyTool, dataMng: body.dataMng, metadata: { authorization } };

        return lastValueFrom(this.grpcPdEquip.deletePdEquip(
          requestData.dataPdEquip, 
          requestData.dataAssyTool,
          requestData.dataMng,
          requestData.metadata))
            .then((resu) => {
                return resu;
            })
            .catch((error) => {
                return { success: false, message: 'Internal Server Error' };
            });
    }

}
