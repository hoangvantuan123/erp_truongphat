import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { GrpcEduPerRstService } from 'src/grpc/service/hr/edu/hrEduPerRst.service';

@Controller('v6/hr')
export class HrEduPerRstController {
  constructor(private readonly grpcEduPerRstService: GrpcEduPerRstService) {}

  @Post('edu-per-rst-search')
  searchEduPerRst(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduPerRst(
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

  @Post('au-edu-per-rst')
  auEduPerRst(@Body() body: { info: any, dataRstCost: any[], dataRstItem: any[], dataEduPerObj: any[] }, @Req() req: Request) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { info: body.info, dataRstCost: body.dataRstCost, dataRstItem: body.dataRstItem, dataEduPerObj: body.dataEduPerObj, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.auEduPerRst(
        requestData.info,
        requestData.dataRstCost,
        requestData.dataRstItem,
        requestData.dataEduPerObj,
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


  @Post('delete-edu-per-rst')
  deleteEduPerRst(@Body() body: { info: any, dataRstCost: any[], dataRstItem: any[] }, @Req() req: Request) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { info: body.info, dataRstCost: body.dataRstCost, dataRstItem: body.dataRstItem,  metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.deleteEduPerRst(
        requestData.info,
        requestData.dataRstCost,
        requestData.dataRstItem,
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

  @Post('delete-cost-rst')
  deleteEduRstCost(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.deleteEduRstCost(
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

  @Post('delete-item-rst')
  deleteEduRstItem(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.deleteEduRstItem(
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

  @Post('search-edu-cost-rst')
  searchEduCostRst(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduCostRst(
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

  @Post('search-edu-item-rst')
  searchEduItemRst(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduItemRst(
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

  @Post('edu-rst-search')
  searchEduRst(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduRst(
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

  @Post('edu-rst-end-search')
  searchEduRstEnd(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduRstEnd(
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

  @Post('edu-rst-batch')
  searchEduRstBatch(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduRstBatch(
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

  @Post('au-edu-rst-end')
  auEduRstEnd(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };
    return lastValueFrom(
      this.grpcEduPerRstService.auEduRstEnd(
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

  @Post('au-edu-per-rst-batch')
  auEduRstBatch(@Body() body: { info: any, dataRstCost: any[], dataRstItem: any[], dataEduPerObj: any[] }, @Req() req: Request) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { info: body.info, dataRstCost: body.dataRstCost, dataRstItem: body.dataRstItem, dataEduPerObj: body.dataEduPerObj, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.auEduRstBatch(
        requestData.info,
        requestData.dataRstCost,
        requestData.dataRstItem,
        requestData.dataEduPerObj,
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

  @Post('delete-edu-per-rst-batch')
  deleteEduRstBatch(@Body() body: { info: any, dataRstCost: any[], dataRstItem: any[], dataEduPerObj: any[] }, @Req() req: Request) {
    if (!body) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { info: body.info, dataRstCost: body.dataRstCost, dataRstItem: body.dataRstItem, dataEduPerObj: body.dataEduPerObj, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.auEduRstBatch(
        requestData.info,
        requestData.dataRstCost,
        requestData.dataRstItem,
        requestData.dataEduPerObj,
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


   @Post('search-edu-cost-rst-batch')
  searchEduCostRstBatch(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduCostRstBatch(
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

  @Post('search-edu-item-rst-batch')
  searchEduItemRstBatch(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduItemRstBatch(
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

  @Post('delete-cost-rst-batch')
  deleteEduRstCostBatch(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.deleteEduRstCostBatch(
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

  @Post('delete-item-rst-batch')
  deleteEduRstItemBatch(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.deleteEduRstItemBatch(
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

  @Post('delete-obj-batch')
  deleteEduRstObjBatch(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.deleteEduRstObjBatch(
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

  @Post('edu-rst-obj-batch')
  searchEduRstObjBatch(@Body() body: { result: any }, @Req() req: Request) {
    if (!body?.result) {
      return { success: false, message: 'Invalid request: Missing "result"' };
    }

    const authorization = req.headers.authorization || '';
    const requestData = { result: body.result, metadata: { authorization } };

    return lastValueFrom(
      this.grpcEduPerRstService.searchEduRstObjBatch(
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
