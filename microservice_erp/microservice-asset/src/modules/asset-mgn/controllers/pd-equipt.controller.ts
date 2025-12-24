import { Controller } from '@nestjs/common';
import { jwtConstants } from 'src/config/security.config';
import * as jwt from 'jsonwebtoken';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { MetadataResponse } from '../interface/response';
import { Observable, from, catchError, map, of } from 'rxjs';
import { PdEquiptService } from '../services/pd-equipt.service';
@Controller()
export class PdEquiptController {
  constructor(private readonly pdEquipService: PdEquiptService) {}

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

  private handleGrpcRequestDelete(
    request: any,
    serviceMethod: (
      dataMold: any,
      companySeq: number,
      userSeq: number,
    ) => Observable<any>,
  ): Observable<MetadataResponse> {
    try {
      const decodedToken = this.validateToken(request.metadata);

      return from(
        serviceMethod(
          request.dataMold,
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

  

  @GrpcMethod('PdEquiptService', 'searchAssetEquipt')
  searchDaDept(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pdEquipService.searchAssetEquipt.bind(this.pdEquipService),
    );
  }

  @GrpcMethod('PdEquiptService', 'getToolQuery')
  getToolQuery(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pdEquipService.getToolQuery.bind(this.pdEquipService),
    );
  }

  @GrpcMethod('PdEquiptService', 'getToolAssyQuery')
  getToolAssyQuery(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pdEquipService.getToolAssyQuery.bind(this.pdEquipService),
    );
  }

  @GrpcMethod('PdEquiptService', 'getToolRepairQuery')
  getToolRepairQuery(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pdEquipService.getToolRepairQuery.bind(this.pdEquipService),
    );
  }

  @GrpcMethod('PdEquiptService', 'getUserDefineQuery')
  getUserDefineQuery(request: any[]): Observable<MetadataResponse> {
    return this.handleGrpcRequest(
      request,
      this.pdEquipService.getUserDefineQuery.bind(this.pdEquipService),
    );
  }

  @GrpcMethod('PdEquiptService', 'createOrUpdatePdEquip')
  createOrUpdatePdEquip(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.pdEquipService.createOrUpdatePdEquip.bind(this.pdEquipService),
    );
  }

  @GrpcMethod('PdEquiptService', 'deleteMold')
  deleteMold(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestDelete(
      request,
      this.pdEquipService.deleteMold.bind(this.pdEquipService),
    );
  }

  @GrpcMethod('PdEquiptService', 'deletePdEquip')
  deletePdEquip(request: any): Observable<MetadataResponse> {
    return this.handleGrpcRequestSave(
      request,
      this.pdEquipService.deletePdEquip.bind(this.pdEquipService),
    );
  }

  
}
