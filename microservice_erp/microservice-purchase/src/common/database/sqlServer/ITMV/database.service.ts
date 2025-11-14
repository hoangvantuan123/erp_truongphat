import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, QueryRunner } from 'typeorm';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/constants';

@Injectable()
export class DatabaseService {
  private queryRunner: QueryRunner;

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

  async executeQuery(query: string): Promise<any> {
    const queryRunner = this.ITMV.createQueryRunner();
    await queryRunner.connect();

    try {
      return await queryRunner.query(query);
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while executing the query.',
      };
    } finally {
      await queryRunner.release();
    }
  }

  async executeMultipleQueries(queries: string[]): Promise<any[]> {
    try {
      return await Promise.all(
        queries.map((query) => this.executeQuery(query)),
      );
    } catch (error) {
      console.error('❌ Multiple Query Error:', error.message);
      return [
        {
          success: false,
          message: 'An error occurred while executing multiple queries.',
          error: error.message,
        },
      ];
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
      return {
        success: false,
        message: 'An error occurred while executing the query.',
      };
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
      return {
        success: false,
        message: 'An error occurred while executing the query.',
      };
    }
  }

  async findAuthCheckUser(
    UserId: any,
    EmpSeq: any,
    UserSeq: any,
  ): Promise<any[]> {
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

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectConnection } from '@nestjs/typeorm';
// import { Connection, QueryRunner } from 'typeorm';
// import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/constants';

// @Injectable()
// export class DatabaseService {
//   private queryRunner: QueryRunner;

//   constructor(@InjectConnection('ITMV') private readonly ITMV: Connection) {
//     this.queryRunner = this.ITMV.createQueryRunner();
//     this.checkConnection();
//   }

//   private async checkConnection() {
//     try {
//       if (this.ITMV.isConnected) {
//         console.log(SUCCESS_MESSAGES.SUCCESS_ITMV);
//       } else {
//         console.error(ERROR_MESSAGES.ERROR_ITMV);
//       }
//     } catch (error) {
//       console.error(ERROR_MESSAGES.DATABASE_ERROR, error);
//     }
//   }

//   async executeQuery(query: string): Promise<any> {
//     const queryRunner = this.ITMV.createQueryRunner();
//     await queryRunner.connect();

//     try {
//       // Lấy bộ nhớ trước khi chạy query
//       const memoryBefore = process.memoryUsage().heapUsed / 1024 / 1024;

//       const result = await queryRunner.query(query);

//       // Lấy bộ nhớ sau khi chạy query
//       const memoryAfter = process.memoryUsage().heapUsed / 1024 / 1024;
//       console.log(`🔹 Memory Used Before: ${memoryBefore.toFixed(2)} MB`);
//       console.log(`🔹 Memory Used After: ${memoryAfter.toFixed(2)} MB`);

//       // Nếu bộ nhớ vượt quá 500MB, kill session
//       if (memoryAfter > 500) {
//         console.warn(`⚠️ Cảnh báo: Bộ nhớ vượt ngưỡng 500MB! Đang kiểm tra query để kill...`);

//         const checkQuery = `
//                 SELECT session_id
//                 FROM sys.dm_exec_requests
//                 WHERE start_time < DATEADD(SECOND, -10, GETDATE()); -- Query chạy > 10s
//             `;
//         const checkResult = await queryRunner.query(checkQuery);

//         if (checkResult.length > 0) {
//           for (const row of checkResult) {
//             const killQuery = `KILL ${row.session_id};`;
//             await queryRunner.query(killQuery);
//             console.warn(`❌ Đã KILL session: ${row.session_id} do sử dụng quá nhiều bộ nhớ!`);
//           }
//         }
//       }

//       return { success: true, data: result, message: 'Query executed successfully' };
//     } catch (error) {
//       return { success: false, data: [], message: 'An error occurred while executing the query.' };
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async executeMultipleQueries(queries: string[]): Promise<any[]> {
//     try {
//       return await Promise.all(queries.map(query => this.executeQuery(query)));
//     } catch (error) {
//       console.error('❌ Multiple Query Error:', error.message);
//       return [{ success: false, message: 'An error occurred while executing multiple queries.', error: error.message }];
//     }
//   }

//   async executeQueryTest(query: string): Promise<any> {
//     try {
//       const result = await this.queryRunner.query(query);

//       if (Array.isArray(result)) {
//         return result;
//       }

//       return { message: 'Query executed successfully', result: result };
//     } catch (error) {
//       return { success: false, message: 'An error occurred while executing the query.' };
//     }
//   }

//   async findAuthByEmpID(UserId: string): Promise<any> {
//     const query = `SELECT * FROM _TCAUser_WEB WHERE UserId = '${UserId}'`;

//     try {
//       const result = await this.queryRunner.query(query);

//       if (!result || result.length === 0) {
//         throw new NotFoundException(`User with UserId ${UserId} not found`);
//       }

//       return result[0];
//     } catch (error) {
//       console.error(`Error executing query for UserId ${UserId}:`, error);
//       return { success: false, message: 'An error occurred while executing the query.' };
//     }
//   }

//   async findAuthCheckUser(UserId: any, EmpSeq: any, UserSeq: any): Promise<any[]> {
//     const query = `
//         SELECT  UserId , EmpSeq, UserSeq
//         FROM _TCAUser_WEB
//         WHERE UserId = '${UserId}'
//           AND EmpSeq = '${EmpSeq}'
//           AND UserSeq = '${UserSeq}'
//     `;

//     try {
//       const result = await this.queryRunner.query(query);
//       return result || [];
//     } catch (error) {
//       return [];
//     }
//   }

// }
