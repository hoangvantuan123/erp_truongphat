import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PdmpsProdPlanListQueryService } from '../services/pdmpsProdPlanListQuery.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/config/security.config';

interface MetadataRequest {
    result: {
        FactUnit: string;
        ProdPlanNo: string;
        SrtDate: string;
        EndDate: string;
        FrProdPlanDate: string;
        ToProdPlanDate: string;
        AssetSeq: string;
        ItemName: string;
        ItemNo: string;
        Spec: string;
        DeptSeq: string;
        ProcRevName: string;
        CfmEmpName: string;
    };
    metadata: { [key: string]: string };
}

interface MetadataResponse {
    status: boolean;
    message: string;
    data: string;
}

@Controller()
export class PdmpsProdPlanListQueryController {
    constructor(private readonly pdmpsProdPlanListQueryService: PdmpsProdPlanListQueryService) { }

    @GrpcMethod('MetadataService', 'sendMetadata')
    async handleProdPlanListQuery(request: MetadataRequest): Promise<MetadataResponse> {
        try {
            if (!request || !request.metadata || !request.metadata["authorization"]) {
                throw new RpcException({
                    code: 16, // UNAUTHENTICATED
                    message: 'Missing authorization token',
                });
            }

            const { result, metadata } = request;

            const token = metadata["authorization"].split(' ')[1];

            if (!token) {
                throw new RpcException({
                    code: 16, // UNAUTHENTICATED
                    message: 'Invalid or expired token',
                });
            }

            // Xác thực JWT
            let decodedToken: { UserId: number; EmpSeq: number; UserSeq: number; CompanySeq: number };
            try {
                decodedToken = jwt.verify(token, jwtConstants.secret) as any;
            } catch (error) {
                throw new RpcException({
                    code: 16, // UNAUTHENTICATED
                    message: 'Invalid or expired token',
                });
            }

            // Gọi service để xử lý truy vấn
            const queryResult = await this.pdmpsProdPlanListQueryService._SPDMPSDailyProdPlanListQuery(
                result,
                decodedToken.CompanySeq,
                decodedToken.UserSeq
            );

            return {
                status: true,
                message: "Query successful",
                data: JSON.stringify(queryResult.data),
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Internal server error',
                data: '',
            };
        }
    }
}
