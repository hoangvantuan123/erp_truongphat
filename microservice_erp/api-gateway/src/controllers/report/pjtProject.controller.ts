import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcPjtProjectService } from '../grpc/service/grpc.report.pjt.pjt_project.service';
@Controller('v15/pjt-project')
export class PjtProjectController {
  constructor(private readonly grpcPjtService: GrpcPjtProjectService) {}

  @Post('search-pjt-project')
  searchPjtProject(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPjtService.searchPjtProject(
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
  @Post('search-pjt-project-detail')
  searchPjtProjectDetail(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPjtService.searchPjtProjectDetail(
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

  @Post('au-pjt-project')
  auPjtProject(
    @Body() body: { masterData: any; dataItem: any[]; dataDelv: any[] },
    @Req() req: Request,
  ) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      masterData: body.masterData,
      dataItem: body.dataItem,
      dataDelv: body.dataDelv,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPjtService.auPjtProject(
        requestData.masterData,
        requestData.dataItem,
        requestData.dataDelv,
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

  @Post('delete-pjt-item')
  deletePjtItem(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPjtService.deletePjtItem(
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

  @Post('delete-pjt-delv')
  deletePjtDelv(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPjtService.deletePjtDelv(
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

  @Post('delete-pjt-project')
  deletePjtProject(
    @Body() body: { masterData: any; dataItem: any[]; dataDelv: any[] },
    @Req() req: Request,
  ) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = {
      masterData: body.masterData,
      dataItem: body.dataItem,
      dataDelv: body.dataDelv,
      metadata: { authorization },
    };

    return lastValueFrom(
      this.grpcPjtService.deletePjtProject(
        requestData.masterData,
        requestData.dataItem,
        requestData.dataDelv,
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

  @Post('confirm-pjt-project')
  confirmPjtProject(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcPjtService.confirmPjtProject(
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
}
