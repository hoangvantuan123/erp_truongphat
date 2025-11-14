import { Controller } from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MetadataResponse } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
import { PdMultiEquiptService } from '../services/pd-multi-equipt.service';
@Controller()
export class PdMultiEquiptController {
  constructor(private readonly pdMultiEquip: PdMultiEquiptService) {}

  private validateToken(metadata: any): {
    UserId: number;
    EmpSeq: number;
    UserSeq: number;
    CompanySeq: number;
  } {
    if (!metadata || !metadata['authorization']) {
      throw new RpcException({
        code: 16,
        message: 'Missing authorization token',
      });
    }

    const token = metadata['authorization'].split(' ')[1];
    if (!token) {
      throw new RpcException({ code: 16, message: 'Invalid or expired token' });
    }

    try {
      return jwt.verify(token, jwtConstants.secret) as any;
    } catch (error) {
      throw new RpcException({ code: 16, message: 'Invalid or expired token' });
    }
  }
  private handleGrpcRequest(
    request: any,
    serviceMethod: (
      result: any,
      companySeq: number,
      userSeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    try {
      const decodedToken = this.validateToken(request.metadata);

      return from(
        serviceMethod(
          request.result,
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
        ),
      ).pipe(
        map((queryResult) => {
          const isSuccess = queryResult?.success === true;
          return {
            status: isSuccess,
            message: 'Query successful',
            data: JSON.stringify(queryResult.data),
            errors: JSON.stringify(queryResult.errors),
          };
        }),
        catchError((error) => {
          return of({
            status: false,
            message: error.message || 'Internal server error',
            data: '',
            errors: JSON.stringify(error.errors),
          });
        }),
      );
    } catch (error) {
      return of({
        status: false,
        message: error.message || 'Internal server error',
        data: '',
        errors: JSON.stringify(error.errors),
      });
    }
  }

  private handleGrpcRequestSave(
    request: any,
    serviceMethod: (
      dataPdEquip: any,
      dataAssyTool: any,
      dataMng: any,
      companySeq: number,
      userSeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    try {
      const decodedToken = this.validateToken(request.metadata);
      return from(
        serviceMethod(
          request.dataPdEquip,
          request.dataAssyTool,
          request.dataMng,       
          decodedToken.CompanySeq,
          decodedToken.UserSeq,
        ),
      ).pipe(
        map((queryResult) => {
          const isSuccess = queryResult?.success === true;
          return {
            status: isSuccess,
            message: 'Query successful',
            data: JSON.stringify(queryResult.data),
            errors: JSON.stringify(queryResult.errors),
          };
        }),
        catchError((error) => {
          return of({
            status: false,
            message: error.message || 'Internal server error',
            data: '',
            errors: JSON.stringify(error.errors),
          });
        }),
      );
    } catch (error) {
      return of({
        status: false,
        message: error.message || 'Internal server error',
        data: '',
        errors: JSON.stringify(error.errors),
      });
    }
  }


  @GrpcMethod('PdMultiEquiptService', 'searchMultiEquipt')
  searchMultiEquipt(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pdMultiEquip.searchMultiEquipt.bind(this.pdMultiEquip),
    );
  }

  @GrpcMethod('PdMultiEquiptService', 'createOrUpdatePdMultiEquip')
  createOrUpdatePdMultiEquip(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.pdMultiEquip.createOrUpdatePdMultiEquip.bind(this.pdMultiEquip),
    );
  }

  @GrpcMethod('PdMultiEquiptService', 'deletePdMultiEquip')
  deletePdMultiEquip(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.pdMultiEquip.deletePdMultiEquip.bind(this.pdMultiEquip),
    );
  }

}
 