import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';

@Injectable()
export class PjtProjectService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchPjtProject(
    result: any,
    userSeq: number,
    companySeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.generateXMLSearchPjtProject(result);

    const query = `
            EXEC _SPJTProjectListQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 1764,
            @WorkingTag = N'${result[0].WorkingTag || ''}',
            @CompanySeq = ${companySeq},
            @LanguageSeq = N'${result[0].LanguageSeq || 6}',
            @UserSeq = ${userSeq},
            @PgmSeq = 2006;
        `;

    return from(this.dataSource.query(query)).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  searchPjtProjectDetail(
    result: any,
    userSeq: number,
    companySeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1958;
    const serviceSeq = 1547;
    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
    ) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const xmlDoc1 = this.generateXmlService.generateXMLSearchMasterPJT(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SPJTProjectQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([
      from(this.databaseService.executeQueryVer02(query1)),
    ]).pipe(
      switchMap(([dataMaster]) => {
        const saveXmlDocItem =
          this.generateXmlService.generateXMLPJTItemQuery(dataMaster);
        const saveQueryItem = generateQuery(
          saveXmlDocItem,
          '_SPJTProjectItemQuery',
          serviceSeq,
          pgmSeq,
        );

        const saveXmlDocDelv =
          this.generateXmlService.generateXMLPJTDelv(dataMaster);
        const saveQueryDelv = generateQuery(
          saveXmlDocDelv,
          '_SPJTProjectDeliveryQuery',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQueryVer02(saveQueryItem)),
          from(this.databaseService.executeQueryVer02(saveQueryDelv)),
        ]).pipe(
          map(([dataItem, dataDelv]) => {
            return {
              success: true,
              data: {
                dataMaster: dataMaster,
                dataItem: dataItem,
                dataDelv: dataDelv,
              },
            };
          }),
        );
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  auPjtProject(
    masterData: any,
    dataItem: any[],
    dataDelv: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1958;
    const serviceSeq = 2673;
    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
    ) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const xmlDocPjtCheck =
      this.generateXmlService.generateXMLPjtProject(masterData);
    const query1 = generateQuery(
      xmlDocPjtCheck,
      '_SPJTProjectCheck',
      1547,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([dataPjtCheck]) => {
        const results = [dataPjtCheck];

        for (const data of results) {
          if (!data?.length) {
            return of({
              success: false,
              errors: ['Không có dữ liệu trả về từ kiểm tra'],
            });
          }

          const hasInvalid = data.some((item: any) => item.Status !== 0);
          if (hasInvalid) {
            return of({
              success: false,
              errors: data
                .filter((item: any) => item.Status !== 0)
                .map((item: any) => ({
                  IDX_NO: item.IDX_NO,
                  Name: item.RstNo,
                  result: item.Result,
                })),
            });
          }
        }

        const XmlDocCheckCCtr =
          this.generateXmlService.generateXMLCCtr(dataPjtCheck);
        const ccTrCheck = generateQuery(
          XmlDocCheckCCtr,
          '_SDACCtrCheck',
          1813,
          pgmSeq,
        );

        const XmlDocConfirmDelete =
          this.generateXmlService.generateXMLConfirmDelete(dataPjtCheck);
        const comfirmDelete = generateQuery(
          XmlDocConfirmDelete,
          '_SCOMConfirmDelete',
          2609,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(ccTrCheck)),
          from(this.databaseService.executeQueryVer02(comfirmDelete)),
        ]).pipe(
          switchMap(([cctrCheckData, confirmDelete]) => {
            for (const data of [cctrCheckData]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) => !item.IDX_NO || !item.RstNo || !item.Result,
                );

                if (isInvalidFormat) {
                  return of({
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  });
                }
                return of({
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.RstNo,
                    result: item.Result,
                  })),
                });
              }
            }

            const XmlCcTrSave =
              this.generateXmlService.generateXMLCCtrSave(cctrCheckData);
            const saveQueryCCtr = generateQuery(
              XmlCcTrSave,
              '_SDACCtrSave',
              1813,
              pgmSeq,
            );

            return forkJoin([
              from(this.databaseService.executeQuery(saveQueryCCtr)),
            ]).pipe(
              switchMap(([dataSaveCCtr]) => {
                for (const data of [dataSaveCCtr]) {
                  const invalidItems =
                    data?.filter((item: any) => item.Status !== 0) || [];

                  if (invalidItems.length) {
                    const isInvalidFormat = invalidItems.some(
                      (item: any) =>
                        !item?.IDX_NO || !item?.UMCostItemName || !item?.Result,
                    );

                    if (isInvalidFormat) {
                      return of({
                        success: false,
                        errors: [
                          {
                            IDX_NO: 1,
                            Name: 'Lỗi',
                            result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                          },
                        ],
                      });
                    }
                    return of({
                      success: false,
                      errors: invalidItems.map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item?.UMCostItemName,
                        result: item?.Result,
                      })),
                    });
                  }
                }

                const saveXmlPjt =
                  this.generateXmlService.generateXMLPjtProject(dataPjtCheck);
                const saveQueryPjt = generateQuery(
                  saveXmlPjt,
                  '_SPJTProjectSave',
                  1547,
                  pgmSeq,
                );

                const saveXmlPjtDelivery =
                  this.generateXmlService.generateXMLPjtDelv(dataDelv, dataPjtCheck[0].PJTSeq);
                const saveQueryPjtDelv = generateQuery(
                  saveXmlPjtDelivery,
                  '_SPJTProjectDeliverySave',
                  2117,
                  pgmSeq,
                );

                return forkJoin([
                  from(this.databaseService.executeQuery(saveQueryPjt)),
                  from(this.databaseService.executeQuery(saveQueryPjtDelv)),
                ]).pipe(
                  switchMap(([dataSavePjt, dataSaveDelv]) => {
                    for (const data of [dataSavePjt]) {
                      const invalidItems =
                        data?.filter((item: any) => item.Status !== 0) || [];

                      if (invalidItems.length) {
                        const isInvalidFormat = invalidItems.some(
                          (item: any) =>
                            !item.IDX_NO ||
                            !item.UMCostItemName ||
                            !item.Result,
                        );

                        if (isInvalidFormat) {
                          return of({
                            success: false,
                            errors: [
                              {
                                IDX_NO: 1,
                                Name: 'Lỗi',
                                result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                              },
                            ],
                          });
                        }
                        return of({
                          success: false,
                          errors: invalidItems.map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.UMCostItemName,
                            result: item.Result,
                          })),
                        });
                      }
                    }

                    for (const data of [dataSaveDelv]) {
                      const invalidItems =
                        data?.filter((item: any) => item.Status !== 0) || [];

                      if (invalidItems.length) {
                        const isInvalidFormat = invalidItems.some(
                          (item: any) =>
                            !item.IDX_NO ||
                            !item.PJTName ||
                            !item.Result,
                        );

                        if (isInvalidFormat) {
                          return of({
                            success: false,
                            errors: [
                              {
                                IDX_NO: 1,
                                Name: 'Lỗi',
                                result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                              },
                            ],
                          });
                        }
                        return of({
                          success: false,
                          errors: invalidItems.map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.PJTName,
                            result: item.Result,
                          })),
                        });
                      }
                    }

                    const checkXmlItem =
                      this.generateXmlService.generateXMLPjtItem(dataItem, dataSavePjt[0].PJTSeq);
                    const checkQueryItem = generateQuery(
                      checkXmlItem,
                      '_SPJTProjectItemCheck',
                      2673,
                      pgmSeq,
                    );

                    return forkJoin([
                      from(this.databaseService.executeQuery(checkQueryItem)),
                    ]).pipe(
                      switchMap(([checkDataItem]) => {
                        for (const data of [checkDataItem]) {
                          const invalidItems =
                            data?.filter((item: any) => item.Status !== 0) ||
                            [];

                          if (invalidItems.length) {
                            const isInvalidFormat = invalidItems.some(
                              (item: any) =>
                                !item.IDX_NO || !item.ItemName || !item.Result,
                            );

                            if (isInvalidFormat) {
                              return of({
                                success: false,
                                errors: [
                                  {
                                    IDX_NO: 1,
                                    Name: 'Lỗi',
                                    result:
                                      'Không thể lấy dữ liệu chi tiết lỗi.',
                                  },
                                ],
                              });
                            }
                            return of({
                              success: false,
                              errors: invalidItems.map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                              })),
                            });
                          }
                        }

                        const saveXmlItem =
                          this.generateXmlService.generateXMLPjtItem(
                            checkDataItem,
                            dataSavePjt[0].PJTSeq,
                          );
                        const saveQueryItem = generateQuery(
                          saveXmlItem,
                          '_SPJTProjectItemSave',
                          2673,
                          pgmSeq,
                        );

                        return forkJoin([
                          from(
                            this.databaseService.executeQuery(saveQueryItem),
                          ),
                        ]).pipe(
                          switchMap(([dataItem]) => {
                            for (const data of [dataItem]) {
                              const invalidItems =
                                data?.filter(
                                  (item: any) => item.Status !== 0,
                                ) || [];

                              if (invalidItems.length) {
                                const isInvalidFormat = invalidItems.some(
                                  (item: any) =>
                                    !item.IDX_NO ||
                                    !item.ItemName ||
                                    !item.Result,
                                );

                                if (isInvalidFormat) {
                                  return of({
                                    success: false,
                                    errors: [
                                      {
                                        IDX_NO: 1,
                                        Name: 'Lỗi',
                                        result:
                                          'Không thể lấy dữ liệu chi tiết lỗi.',
                                      },
                                    ],
                                  });
                                }
                                return of({
                                  success: false,
                                  errors: invalidItems.map((item: any) => ({
                                    IDX_NO: item.IDX_NO,
                                    Name: item.ItemName,
                                    result: item.Result,
                                  })),
                                });
                              }
                            }

                            const XmlItemBillCondSave =
                              this.generateXmlService.generateXMLCommon(
                                checkDataItem,
                              );
                            const queryitemBillCond = generateQuery(
                              XmlItemBillCondSave,
                              '_SPJTProjectItemBillCondSave',
                              3394,
                              pgmSeq,
                            );

                            const XmlRemark =
                              this.generateXmlService.generateXMLCommon(
                                checkDataItem,
                              );
                            const checkQueryRemark = generateQuery(
                              XmlRemark,
                              '_SPJTProjectRemarkSave',
                              1548,
                              pgmSeq,
                            );

                            const XmlMgnItem =
                              this.generateXmlService.generateXMLCommon(
                                checkDataItem,
                              );
                            const checkQueryMgnItem = generateQuery(
                              XmlMgnItem,
                              '_SPJTProjectMngItemCheck',
                              1549,
                              pgmSeq,
                            );

                            const saveQueryMgnItem = generateQuery(
                              XmlMgnItem,
                              '_SPJTProjectMngItemSave',
                              1549,
                              pgmSeq,
                            );

                            const XmlConfirmCreate =
                              this.generateXmlService.generateXMLConfirmDelete(
                                checkDataItem,
                              );
                            const checkQueryConfirmCreate = generateQuery(
                              XmlConfirmCreate,
                              '_SCOMConfirmCreate',
                              2609,
                              pgmSeq,
                            );

                            return forkJoin([
                              from(
                                this.databaseService.executeQuery(
                                  queryitemBillCond,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryRemark,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryMgnItem,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  saveQueryMgnItem,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryConfirmCreate,
                                ),
                              ),
                            ]).pipe(
                              map(([checkDataPerObj]) => {
                                return {
                                  success: true,
                                  data: {
                                    logs1: dataSavePjt,
                                    logs2: dataItem,
                                    logs3: dataDelv,
                                  },
                                };
                              }),
                            );
                          }),
                        );
                      }),
                    );
                  }),
                );
              }),
            );
          }),
        );
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  deletePjtProjectItem(
    result: any,
    userSeq: number,
    companySeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1958;
    const serviceSeq = 2673;
    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
    ) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const checkXmlItem =
      this.generateXmlService.generateXMLPjtItemDelete(result);
    const checkQueryItem = generateQuery(
      checkXmlItem,
      '_SPJTProjectItemCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([
      from(this.databaseService.executeQuery(checkQueryItem)),
    ]).pipe(
      switchMap(([dataCheckItem]) => {
        const results = [dataCheckItem];

        for (const data of results) {
          if (!data?.length) {
            return of({
              success: false,
              errors: ['Không có dữ liệu trả về từ kiểm tra'],
            });
          }

          const hasInvalid = data.some((item: any) => item.Status !== 0);
          if (hasInvalid) {
            return of({
              success: false,
              errors: data
                .filter((item: any) => item.Status !== 0)
                .map((item: any) => ({
                  IDX_NO: item.IDX_NO,
                  Name: item.ItemName,
                  result: item.Result,
                })),
            });
          }
        }

        const saveXmlItem =
          this.generateXmlService.generateXMLPjtItemDelete(dataCheckItem);
        const saveQueryItem = generateQuery(
          saveXmlItem,
          '_SPJTProjectItemSave',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryItem)),
        ]).pipe(
          map(([dataItem]) => {
            for (const data of [dataItem]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) => !item.IDX_NO || !item.ItemName || !item.Result,
                );

                if (isInvalidFormat) {
                  return of({
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  });
                }
                return of({
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.ItemName,
                    result: item.Result,
                  })),
                });
              }
            }

            return {
              success: true,
              data: {
                logs1: dataItem,
              },
            };
          }),
        );
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  deletePjtDelv(
    result: any,
    userSeq: number,
    companySeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1958;
    const serviceSeq = 2117;
    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
    ) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const checkXmlItem = this.generateXmlService.generateXMLPjtDelv(result, null);
    const checkQueryDelv = generateQuery(
      checkXmlItem,
      '_SPJTProjectDeliverySave',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([
      from(this.databaseService.executeQuery(checkQueryDelv)),
    ]).pipe(
      map(([dataCheckDelv]) => {
        const results = [dataCheckDelv];

        return {
          success: true,
          data: {
            logs1: results,
          },
        };
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  deletePjtProject(
    masterData: any,
    dataItem: any[],
    dataDelv: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1958;
    const serviceSeq = 2673;
    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
    ) => `
            EXEC ${procedure}_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'D',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const xmlDocPjtCheck =
      this.generateXmlService.generateXMLPjtProject(masterData);
    const query1 = generateQuery(
      xmlDocPjtCheck,
      '_SPJTProjectCheck',
      1547,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([dataPjtCheck]) => {
        const results = [dataPjtCheck];

        for (const data of results) {
          if (!data?.length) {
            return of({
              success: false,
              errors: ['Không có dữ liệu trả về từ kiểm tra'],
            });
          }

          const hasInvalid = data.some((item: any) => item.Status !== 0);
          if (hasInvalid) {
            return of({
              success: false,
              errors: data
                .filter((item: any) => item.Status !== 0)
                .map((item: any) => ({
                  IDX_NO: item.IDX_NO,
                  Name: item.RstNo,
                  result: item.Result,
                })),
            });
          }
        }

        const XmlDocCheckCCtr =
          this.generateXmlService.generateXMLCCtr(dataPjtCheck);
        const ccTrCheck = generateQuery(
          XmlDocCheckCCtr,
          '_SDACCtrCheck',
          1813,
          pgmSeq,
        );

        const XmlDocConfirmDelete =
          this.generateXmlService.generateXMLConfirmDelete(dataPjtCheck);
        const comfirmDelete = generateQuery(
          XmlDocConfirmDelete,
          '_SCOMConfirmDelete',
          2609,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(ccTrCheck)),
          from(this.databaseService.executeQueryVer02(comfirmDelete)),
        ]).pipe(
          switchMap(([cctrCheckData, confirmDelete]) => {
            for (const data of [cctrCheckData]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) => !item.IDX_NO || !item.RstNo || !item.Result,
                );

                if (isInvalidFormat) {
                  return of({
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  });
                }
                return of({
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.RstNo,
                    result: item.Result,
                  })),
                });
              }
            }

            const XmlCcTrSave =
              this.generateXmlService.generateXMLCCtrSave(cctrCheckData);
            const saveQueryCCtr = generateQuery(
              XmlCcTrSave,
              '_SDACCtrSave',
              1813,
              pgmSeq,
            );

            return forkJoin([
              from(this.databaseService.executeQuery(saveQueryCCtr)),
            ]).pipe(
              switchMap(([dataSaveCCtr]) => {
                for (const data of [dataSaveCCtr]) {
                  const invalidItems =
                    data?.filter((item: any) => item.Status !== 0) || [];

                  if (invalidItems.length) {
                    const isInvalidFormat = invalidItems.some(
                      (item: any) =>
                        !item?.IDX_NO || !item?.UMCostItemName || !item?.Result,
                    );

                    if (isInvalidFormat) {
                      return of({
                        success: false,
                        errors: [
                          {
                            IDX_NO: 1,
                            Name: 'Lỗi',
                            result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                          },
                        ],
                      });
                    }
                    return of({
                      success: false,
                      errors: invalidItems.map((item: any) => ({
                        IDX_NO: item.IDX_NO,
                        Name: item?.UMCostItemName,
                        result: item?.Result,
                      })),
                    });
                  }
                }

                const saveXmlPjt =
                  this.generateXmlService.generateXMLPjtProject(dataPjtCheck);
                const saveQueryPjt = generateQuery(
                  saveXmlPjt,
                  '_SPJTProjectSave',
                  1547,
                  pgmSeq,
                );

                const saveXmlPjtDelivery =
                  this.generateXmlService.generateXMLPjtDelv(dataDelv, null);
                const saveQueryPjtDelv = generateQuery(
                  saveXmlPjtDelivery,
                  '_SPJTProjectDeliverySave',
                  2117,
                  pgmSeq,
                );

                return forkJoin([
                  from(this.databaseService.executeQuery(saveQueryPjt)),
                  from(this.databaseService.executeQuery(saveQueryPjtDelv)),
                ]).pipe(
                  switchMap(([dataSavePjt, dataSaveDelv]) => {
                    for (const data of [dataSavePjt]) {
                      const invalidItems =
                        data?.filter((item: any) => item.Status !== 0) || [];

                      if (invalidItems.length) {
                        const isInvalidFormat = invalidItems.some(
                          (item: any) =>
                            !item.IDX_NO ||
                            !item.UMCostItemName ||
                            !item.Result,
                        );

                        if (isInvalidFormat) {
                          return of({
                            success: false,
                            errors: [
                              {
                                IDX_NO: 1,
                                Name: 'Lỗi',
                                result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                              },
                            ],
                          });
                        }
                        return of({
                          success: false,
                          errors: invalidItems.map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.UMCostItemName,
                            result: item.Result,
                          })),
                        });
                      }
                    }

                    for (const data of [dataSaveDelv]) {
                      const invalidItems =
                        data?.filter((item: any) => item.Status !== 0) || [];

                      if (invalidItems.length) {
                        const isInvalidFormat = invalidItems.some(
                          (item: any) =>
                            !item.IDX_NO ||
                            !item.UMCostItemName ||
                            !item.Result,
                        );

                        if (isInvalidFormat) {
                          return of({
                            success: false,
                            errors: [
                              {
                                IDX_NO: 1,
                                Name: 'Lỗi',
                                result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                              },
                            ],
                          });
                        }
                        return of({
                          success: false,
                          errors: invalidItems.map((item: any) => ({
                            IDX_NO: item.IDX_NO,
                            Name: item.UMCostItemName,
                            result: item.Result,
                          })),
                        });
                      }
                    }

                    const checkXmlItem =
                      this.generateXmlService.generateXMLPjtItem(dataItem, null);
                    const checkQueryItem = generateQuery(
                      checkXmlItem,
                      '_SPJTProjectItemCheck',
                      2673,
                      pgmSeq,
                    );

                    return forkJoin([
                      from(this.databaseService.executeQuery(checkQueryItem)),
                    ]).pipe(
                      switchMap(([checkDataItem]) => {
                        for (const data of [checkDataItem]) {
                          const invalidItems =
                            data?.filter((item: any) => item.Status !== 0) ||
                            [];

                          if (invalidItems.length) {
                            const isInvalidFormat = invalidItems.some(
                              (item: any) =>
                                !item.IDX_NO || !item.ItemName || !item.Result,
                            );

                            if (isInvalidFormat) {
                              return of({
                                success: false,
                                errors: [
                                  {
                                    IDX_NO: 1,
                                    Name: 'Lỗi',
                                    result:
                                      'Không thể lấy dữ liệu chi tiết lỗi.',
                                  },
                                ],
                              });
                            }
                            return of({
                              success: false,
                              errors: invalidItems.map((item: any) => ({
                                IDX_NO: item.IDX_NO,
                                Name: item.ItemName,
                                result: item.Result,
                              })),
                            });
                          }
                        }

                        const saveXmlItem =
                          this.generateXmlService.generateXMLPjtItem(
                            checkDataItem,
                            null,
                          );
                        const saveQueryItem = generateQuery(
                          saveXmlItem,
                          '_SPJTProjectItemSave',
                          2673,
                          pgmSeq,
                        );

                        return forkJoin([
                          from(
                            this.databaseService.executeQuery(saveQueryItem),
                          ),
                        ]).pipe(
                          switchMap(([dataItem]) => {
                            for (const data of [dataItem]) {
                              const invalidItems =
                                data?.filter(
                                  (item: any) => item.Status !== 0,
                                ) || [];

                              if (invalidItems.length) {
                                const isInvalidFormat = invalidItems.some(
                                  (item: any) =>
                                    !item.IDX_NO ||
                                    !item.ItemName ||
                                    !item.Result,
                                );

                                if (isInvalidFormat) {
                                  return of({
                                    success: false,
                                    errors: [
                                      {
                                        IDX_NO: 1,
                                        Name: 'Lỗi',
                                        result:
                                          'Không thể lấy dữ liệu chi tiết lỗi.',
                                      },
                                    ],
                                  });
                                }
                                return of({
                                  success: false,
                                  errors: invalidItems.map((item: any) => ({
                                    IDX_NO: item.IDX_NO,
                                    Name: item.ItemName,
                                    result: item.Result,
                                  })),
                                });
                              }
                            }

                            const XmlItemBillCondSave =
                              this.generateXmlService.generateXMLCommon(
                                checkDataItem,
                              );
                            const queryitemBillCond = generateQuery(
                              XmlItemBillCondSave,
                              '_SPJTProjectItemBillCondSave',
                              3394,
                              pgmSeq,
                            );

                            const XmlRemark =
                              this.generateXmlService.generateXMLCommon(
                                checkDataItem,
                              );
                            const checkQueryRemark = generateQuery(
                              XmlRemark,
                              '_SPJTProjectRemarkSave',
                              1548,
                              pgmSeq,
                            );

                            const XmlMgnItem =
                              this.generateXmlService.generateXMLCommon(
                                checkDataItem,
                              );
                            const checkQueryMgnItem = generateQuery(
                              XmlMgnItem,
                              '_SPJTProjectMngItemCheck',
                              1549,
                              pgmSeq,
                            );

                            const saveQueryMgnItem = generateQuery(
                              XmlMgnItem,
                              '_SPJTProjectMngItemSave',
                              1549,
                              pgmSeq,
                            );

                            const XmlConfirmCreate =
                              this.generateXmlService.generateXMLConfirmDelete(
                                checkDataItem,
                              );
                            const checkQueryConfirmCreate = generateQuery(
                              XmlConfirmCreate,
                              '_SCOMConfirmCreate',
                              2609,
                              pgmSeq,
                            );

                            return forkJoin([
                              from(
                                this.databaseService.executeQuery(
                                  queryitemBillCond,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryRemark,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryMgnItem,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  saveQueryMgnItem,
                                ),
                              ),
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryConfirmCreate,
                                ),
                              ),
                            ]).pipe(
                              map(([checkDataPerObj]) => {
                                return {
                                  success: true,
                                  data: {
                                    logs1: dataSavePjt,
                                    logs2: dataItem,
                                    logs3: dataDelv,
                                  },
                                };
                              }),
                            );
                          }),
                        );
                      }),
                    );
                  }),
                );
              }),
            );
          }),
        );
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  confirmPjtProject(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1958;
    const serviceSeq = 2011;
    const generateQuery = (
      xmlDocument: string,
      procedure: string,
      serviceSeq: number,
      pgmSeq: number,
    ) => `
            EXEC ${procedure}
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = ${xmlFlags},
            @ServiceSeq = ${serviceSeq},
            @WorkingTag = N'',
            @CompanySeq = ${companySeq},
            @LanguageSeq = ${languageSeq},
            @UserSeq = ${userSeq},
            @PgmSeq = ${pgmSeq};
        `;
    const checkXmlItem =
      this.generateXmlService.generateXMLConditonCheckPjt(result);
    const checkQueryItem = generateQuery(
      checkXmlItem,
      '_SPJTConditionExecCheck_Web',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([
      from(this.databaseService.executeQuery(checkQueryItem)),
    ]).pipe(
      switchMap(([dataCheck]) => {
        const results = [dataCheck];

        for (const data of results) {
          if (!data?.length) {
            return of({
              success: false,
              errors: ['Không có dữ liệu trả về từ kiểm tra'],
            });
          }

          const hasInvalid = data.some((item: any) => item.Status !== 0);
          if (hasInvalid) {
            return of({
              success: false,
              errors: data
                .filter((item: any) => item.Status !== 0)
                .map((item: any) => ({
                  IDX_NO: item.IDX_NO,
                  Name: item.ItemName,
                  result: item.Result,
                })),
            });
          }
        }

        const saveXmlItem =
          this.generateXmlService.generateXMLSCOMConfirm(dataCheck);
        const saveQueryItem = generateQuery(
          saveXmlItem,
          '_SCOMConfirm',
          2609,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryItem)),
        ]).pipe(
          map(([dataItem]) => {
            for (const data of [dataItem]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) => !item.IDX_NO || !item.Status || !item.Result,
                );

                if (isInvalidFormat) {
                  return of({
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  });
                }
                return of({
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.Status,
                    result: item.Result,
                  })),
                });
              }
            }

            return {
              success: true,
              data: {
                logs1: dataItem,
              },
            };
          }),
        );
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }
}
