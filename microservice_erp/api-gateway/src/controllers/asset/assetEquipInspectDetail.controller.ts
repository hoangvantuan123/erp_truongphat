import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcPdEquiptInspectDetailService } from '../grpc/service/grpc.asset.pd_equipt_inspect_detail.service';
@Controller('v18/equip-inspect-detail')
export class AssetEquipInspectDetailController {
  constructor(private readonly grpcPdEquip: GrpcPdEquiptInspectDetailService) {}

  @Post('/search-detail')
  searchEquiptInspectDetail(
    @Body() body: { result: any },
    @Req() req: Request,
  ) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.searchEquiptInspectDetail(
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

  @Post('/get-by-term-serl')
  getToolDetailMatByTermSerl(
    @Body() body: { result: any },
    @Req() req: Request,
  ) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPdEquip.getToolDetailMatByTermSerl(
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

  @Post('/cud-detail')
  createOrUpdateInspectDetail(
    @Body() body: { dataDetailMat: any[]; dataInspectDetail: any[] },
    @Req() req: Request,
  ) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      dataDetailMat: body.dataDetailMat,
      dataInspectDetail: body.dataInspectDetail,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPdEquip.createOrUpdateInspectDetail(
        requestData.dataInspectDetail,
        requestData.dataDetailMat,
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

  @Post('/delete-inspect')
  deleteInspect(@Body() body: { dataInspect: any[] }, @Req() req: Request) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      dataInspect: body.dataInspect,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPdEquip.deleteInspect(
        requestData.dataInspect,
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

  @Post('/delete-inspect-mat')
  deleteInspectMat(@Body() body: { dataMat: any[] }, @Req() req: Request) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      dataMat: body.dataMat,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPdEquip.deleteInspectMat(
        requestData.dataMat,
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

  @Post('/delete-detail')
  deleteDetail(@Body() body: { dataDetail: any[] }, @Req() req: Request) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      dataDetail: body.dataDetail,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPdEquip.deleteDetail(
        requestData.dataDetail,
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
