import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, QueryRunner } from 'typeorm';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/constants';

@Injectable()
export class DatabaseService {
  private queryRunner: QueryRunner;
  private activeQueries = 0;
  private logger = new Logger(DatabaseService.name);
  constructor(@InjectConnection('ITMV') private readonly ITMV: Connection) {
    this.queryRunner = this.ITMV.createQueryRunner();
    this.checkConnection();
  }

  private async checkConnection() {
    try {
      if (this.ITMV.isConnected) {
        console.log(SUCCESS_MESSAGES.SUCCESS_ITMV);
      } else {
        console.error(ERROR_MESSAGES.ERROR_ITMV);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.DATABASE_ERROR, error);
    }
  }

  executeQuery(query: string, useTransaction = false, priority = 200): Promise<any> {
    const queryRunner = this.ITMV.createQueryRunner();
    const queryId = Math.random().toString(36).substr(2, 5); // Sinh ID ngẫu nhiên cho query
    const startTime = Date.now();

    this.activeQueries++; // Tăng số truy vấn đang chạy
    this.logger.log(`🔵 [START] Query ${queryId} - Priority: ${priority} - Active Queries: ${this.activeQueries}`);

    return queryRunner.connect()
      .then(() => useTransaction ? queryRunner.startTransaction() : null)
      .then(() => queryRunner.query(query))
      .then(result => {
        return (useTransaction ? queryRunner.commitTransaction() : Promise.resolve())
          .then(() => {
            const endTime = Date.now();
            this.logger.log(`✅ [DONE] Query ${queryId} - Time: ${endTime - startTime}ms - Active Queries: ${this.activeQueries - 1}`);
            return result;
          });
      })
      .catch(error => {
        return (useTransaction ? queryRunner.rollbackTransaction() : Promise.resolve())
          .then(() => {
            this.logger.error(`❌ [FAILED] Query ${queryId} - Error: ${error.message}`);
            return { success: false, message: 'Query execution failed.', error };
          });
      })
      .finally(() => {
        this.activeQueries--; // Giảm số truy vấn đang chạy
        return queryRunner.release(); // Giải phóng kết nối ngay lập tức
      });
  }

  async executeMultipleQueries(queries: string[]): Promise<any[]> {
    try {
      return await Promise.all(queries.map(query => this.executeQuery(query)));
    } catch (error) {
      console.error('❌ Multiple Query Error:', error.message);
      return [{ success: false, message: 'An error occurred while executing multiple queries.', error: error.message }];
    }
  }




  async executeQueryTest(query: string): Promise<any> {
    try {
      const result = await this.queryRunner.query(query);

      if (Array.isArray(result)) {
        return result;
      }

      return { message: 'Query executed successfully', result: result };
    } catch (error) {
      return { success: false, message: 'An error occurred while executing the query.' };
    }
  }


  async findAuthByEmpID(UserId: string): Promise<any> {
    const query = `SELECT * FROM _TCAUser_WEB WHERE UserId = '${UserId}'`;

    try {
      const result = await this.queryRunner.query(query);

      if (!result || result.length === 0) {
        throw new NotFoundException(`User with UserId ${UserId} not found`);
      }

      return result[0];
    } catch (error) {
      console.error(`Error executing query for UserId ${UserId}:`, error);
      return { success: false, message: 'An error occurred while executing the query.' };
    }
  }


  async findAuthCheckUser(UserId: any, EmpSeq: any, UserSeq: any): Promise<any[]> {
    const query = `
        SELECT  UserId , EmpSeq, UserSeq
        FROM _TCAUser_WEB 
        WHERE UserId = '${UserId}' 
          AND EmpSeq = '${EmpSeq}' 
          AND UserSeq = '${UserSeq}'
    `;

    try {
      const result = await this.queryRunner.query(query);
      return result || [];
    } catch (error) {
      return [];
    }
  }


}
