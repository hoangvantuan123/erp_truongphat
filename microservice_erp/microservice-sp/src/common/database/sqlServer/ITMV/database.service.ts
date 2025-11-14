import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, QueryRunner } from 'typeorm';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/constants';
import { Observable } from 'rxjs';

@Injectable()
export class DatabaseService {
  private queryRunner: QueryRunner;
  private activeQueries = 0; // Số truy vấn đang chạy
  private logger = new Logger(DatabaseService.name);
  constructor(@InjectConnection('ITMV') private readonly ITMV: Connection) {
    this.queryRunner = this.ITMV.createQueryRunner();
    this.checkConnection();
  }
  /**
   * Thực thi truy vấn SQL với logging
   * @param query - Câu lệnh SQL
   * @param useTransaction - Có dùng transaction không?
   * @param priority - Độ ưu tiên của truy vấn (1 thấp - 10 cao)
   * @returns Kết quả truy vấn
   */
  executeQuery(query: string, useTransaction = false, priority = 200): Promise<any> {
    const queryRunner = this.ITMV.createQueryRunner(); // Tạo QueryRunner riêng biệt
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
  executeQueryVer02(query: string, useTransaction = false, priority = 200): Observable<any> {
    return new Observable(subscriber => {
      const queryRunner = this.ITMV.createQueryRunner(); // Tạo QueryRunner riêng biệt
      const queryId = Math.random().toString(36).substr(2, 5); // Sinh ID ngẫu nhiên cho query
      const startTime = Date.now();

      this.activeQueries++; // Tăng số truy vấn đang chạy
      this.logger.log(`🔵 [START] Query ${queryId} - Priority: ${priority} - Active Queries: ${this.activeQueries}`);

      queryRunner.connect()
        .then(() => useTransaction ? queryRunner.startTransaction() : null)
        .then(() => queryRunner.query(query))
        .then(result => {
          if (useTransaction) {
            return queryRunner.commitTransaction().then(() => result);
          }
          return result;
        })
        .then(result => {
          const endTime = Date.now();
          this.logger.log(`✅ [DONE] Query ${queryId} - Time: ${endTime - startTime}ms - Active Queries: ${this.activeQueries - 1}`);

          subscriber.next(result);
          subscriber.complete();
        })
        .catch(error => {
          if (useTransaction) {
            queryRunner.rollbackTransaction().finally(() => {
              this.logger.error(`❌ [FAILED] Query ${queryId} - Error: ${error.message}`);
              subscriber.error({ success: false, message: 'Query execution failed.', error });
            });
          } else {
            this.logger.error(`❌ [FAILED] Query ${queryId} - Error: ${error.message}`);
            subscriber.error({ success: false, message: 'Query execution failed.', error });
          }
        })
        .finally(() => {
          this.activeQueries--;
          queryRunner.release();
        });
    });
  }


  /**
   * Hàm delay để ưu tiên truy vấn ngắn trước (giả lập queue xử lý)
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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


  async executeQueryParams(query: string, params: any[]): Promise<any> {
    try {
      const result = await this.queryRunner.query(query, params);
      return result;
    } catch (error) {
      throw error;
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
      throw error;
    }
  }


  async findAuthByEmpID(UserId: string): Promise<any> {
    const query = `SELECT * FROM "_TCAUser_WEB" WHERE "UserId" = '${UserId}'`;

    try {
      const result = await this.queryRunner.query(query);

      if (!result || result.length === 0) {
        throw new NotFoundException(`UserId ${UserId} not found in the system`);
      }

      return result[0];
    } catch (error) {
      throw error;
    }
  }
  async findLanguageSeq(languageSeq: string): Promise<any> {
    const query = `SELECT IdSeq  , WordSeq , Word FROM _TCADictionary_WEB where LanguageSeq ='${languageSeq}'`;
    try {
      const result = await this.queryRunner.query(query);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async checkAuthUserSeq(UserSeq: number): Promise<any> {
    const query = `SELECT * FROM "_TCAUser_WEB" WHERE "UserSeq" = '${UserSeq}'`;

    try {
      const result = await this.queryRunner.query(query);

      if (!result || result.length === 0) {
        throw new NotFoundException(`UserSeq ${UserSeq} not found in the system`);
      }

      return result[0];
    } catch (error) {
      throw error;
    }
  }


}
