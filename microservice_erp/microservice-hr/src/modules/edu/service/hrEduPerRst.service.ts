import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/sqlServer/ITMV/database.service';
import { ERROR_MESSAGES } from 'src/common/utils/constants';
import { GenerateXmlService } from '../generate-xml/generate-xml.service';
import { Observable, from, of, forkJoin, throwError } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { SimpleQueryResult } from '../interface/request';
@Injectable()
export class HrEduPerRstService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly generateXmlService: GenerateXmlService,
  ) {}

  searchEduPerRst(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const xmlDoc1 = this.generateXmlService.generateXMLSearchEduPerRst(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduPersRstQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([dataPersRst]) => {
        const saveXmlDocRstItem =
          this.generateXmlService.generateXMLEduRstItemQuery(dataPersRst);
        const saveQueryRstItem = generateQuery(
          saveXmlDocRstItem,
          '_SHREduPersRstItemQuery',
          serviceSeq,
          pgmSeq,
        );

        const saveXmlDocRstCost =
          this.generateXmlService.generateXMLEduRstCostQuery(dataPersRst);
        const saveQueryRstCost = generateQuery(
          saveXmlDocRstCost,
          '_SHREduPersRstCostQuery',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryRstItem)),
          from(this.databaseService.executeQuery(saveQueryRstCost)),
        ]).pipe(
          map(([dataItem, dataCost]) => {
            for (const data of [dataItem]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) =>
                    !item.IDX_NO || !item.EduTypeName || !item.Result,
                );

                if (isInvalidFormat) {
                  return {
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  };
                }

                return {
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.EduCourseName,
                    result: item.Result,
                  })),
                };
              }
            }
            return {
              success: true,
              data: {
                dataPersRst: dataPersRst,
                dataItem: dataItem,
                dataCost: dataCost,
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

  auEduPerRst(
    info: any,
    dataRstCost: any[],
    dataRstItem: any[],
    dataEduPerObj: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const xmlDoc1 = this.generateXmlService.generateXMLEduPerRst(info);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduPersRstCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([data1]) => {
        const results = [data1];

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

        const saveXmlDocEduPerRst =
          this.generateXmlService.generateXMLEduPerRst(data1);
        const saveQueryEduPerRst = generateQuery(
          saveXmlDocEduPerRst,
          '_SHREduPersRstSave',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryEduPerRst)),
        ]).pipe(
          switchMap(([saveDataPerRst]) => {
            for (const data of [saveDataPerRst]) {
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

            const XmlCostCheck = this.generateXmlService.generateXMLEduCostRst(
              dataRstCost,
              saveDataPerRst[0].RstSeq,
            );
            const checkQueryCost = generateQuery(
              XmlCostCheck,
              '_SHREduPersRstCostCheck',
              serviceSeq,
              pgmSeq,
            );

            return forkJoin([
              from(this.databaseService.executeQuery(checkQueryCost)),
            ]).pipe(
              switchMap(([checkDataCost]) => {
                for (const data of [checkDataCost]) {
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

                const saveXmlCost =
                  this.generateXmlService.generateXMLEduCostRst(
                    checkDataCost,
                    checkDataCost[0].RstSeq,
                  );
                const saveQueryCost = generateQuery(
                  saveXmlCost,
                  '_SHREduPersRstCostSave',
                  serviceSeq,
                  pgmSeq,
                );

                return forkJoin([
                  from(this.databaseService.executeQuery(saveQueryCost)),
                ]).pipe(
                  switchMap(([dataCost]) => {
                    for (const data of [dataCost]) {
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
                      this.generateXmlService.generateXMLEduItemRst(
                        dataRstItem,
                      );
                    const checkQueryItem = generateQuery(
                      checkXmlItem,
                      '_SHREduPersRstItemCheck',
                      serviceSeq,
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
                                !item.IDX_NO ||
                                !item.EduItemName ||
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
                                Name: item.UMCostItemName,
                                result: item.Result,
                              })),
                            });
                          }
                        }

                        const saveXmlItem =
                          this.generateXmlService.generateXMLEduItemRst(
                            checkDataItem,
                          );
                        const saveQueryItem = generateQuery(
                          saveXmlItem,
                          '_SHREduPersRstItemSave',
                          serviceSeq,
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
                                    !item.EduItemName ||
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
                                    Name: item.EduItemName,
                                    result: item.Result,
                                  })),
                                });
                              }
                            }

                            const checkXmlPerObj =
                              this.generateXmlService.generateXMLEduPerObj(
                                dataEduPerObj,
                              );
                            const checkQueryPerObj = generateQuery(
                              checkXmlPerObj,
                              '_SHREduPersRstObjCheck',
                              serviceSeq,
                              pgmSeq,
                            );

                            return forkJoin([
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryPerObj,
                                ),
                              ),
                            ]).pipe(
                              switchMap(([checkDataPerObj]) => {
                                for (const data of [checkDataPerObj]) {
                                  const invalidItems =
                                    data?.filter(
                                      (item: any) => item.Status !== 0,
                                    ) || [];

                                  if (invalidItems.length) {
                                    const isInvalidFormat = invalidItems.some(
                                      (item: any) =>
                                        !item.IDX_NO ||
                                        !item.EmpName ||
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
                                        Name: item.EmpName,
                                        result: item.Result,
                                      })),
                                    });
                                  }
                                }

                                const saveXmlPerObj =
                                  this.generateXmlService.generateXMLEduPerObj(
                                    checkDataPerObj,
                                  );
                                const saveQueryPerObj = generateQuery(
                                  saveXmlPerObj,
                                  '_SHREduPersRstObjSave',
                                  serviceSeq,
                                  pgmSeq,
                                );

                                return forkJoin([
                                  from(
                                    this.databaseService.executeQuery(
                                      saveQueryPerObj,
                                    ),
                                  ),
                                ]).pipe(
                                  map(([dataPerObj]) => {
                                    for (const data of [dataPerObj]) {
                                      const invalidItems =
                                        data?.filter(
                                          (item: any) => item.Status !== 0,
                                        ) || [];

                                      if (invalidItems.length) {
                                        const isInvalidFormat =
                                          invalidItems.some(
                                            (item: any) =>
                                              !item.IDX_NO ||
                                              !item.EmpName ||
                                              !item.Result,
                                          );

                                        if (isInvalidFormat) {
                                          return {
                                            success: false,
                                            errors: [
                                              {
                                                IDX_NO: 1,
                                                Name: 'Lỗi',
                                                result:
                                                  'Không thể lấy dữ liệu chi tiết lỗi.',
                                              },
                                            ],
                                          };
                                        }
                                        return {
                                          success: false,
                                          errors: invalidItems.map(
                                            (item: any) => ({
                                              IDX_NO: item.IDX_NO,
                                              Name: item.EmpName,
                                              result: item.Result,
                                            }),
                                          ),
                                        };
                                      }
                                    }

                                    return {
                                      success: true,
                                      data: {
                                        logs1: saveDataPerRst,
                                        logs2: dataCost,
                                        logs3: dataItem,
                                        logs4: dataPerObj,
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
        );
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  deleteEduPerRst(
    info: any,
    dataRstCost: any[],
    dataRstItem: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const xmlDoc1 = this.generateXmlService.generateXMLEduPerRst(info);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduPersRstCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([data1]) => {
        const results = [data1];

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

        const saveXmlDocEduPerRst =
          this.generateXmlService.generateXMLEduPerRst(data1);
        const saveQueryEduPerRst = generateQuery(
          saveXmlDocEduPerRst,
          '_SHREduPersRstSave',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryEduPerRst)),
        ]).pipe(
          switchMap(([saveDataPerRst]) => {
            for (const data of [saveDataPerRst]) {
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

            const XmlCostCheck = this.generateXmlService.generateXMLEduCostRst(
              dataRstCost,
              saveDataPerRst[0].RstSeq,
            );
            const checkQueryCost = generateQuery(
              XmlCostCheck,
              '_SHREduPersRstCostCheck',
              serviceSeq,
              pgmSeq,
            );

            return forkJoin([
              from(this.databaseService.executeQuery(checkQueryCost)),
            ]).pipe(
              switchMap(([checkDataCost]) => {
                for (const data of [checkDataCost]) {
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

                const saveXmlCost =
                  this.generateXmlService.generateXMLEduCostRst(
                    checkDataCost,
                    checkDataCost[0].RstSeq,
                  );
                const saveQueryCost = generateQuery(
                  saveXmlCost,
                  '_SHREduPersRstCostSave',
                  serviceSeq,
                  pgmSeq,
                );

                return forkJoin([
                  from(this.databaseService.executeQuery(saveQueryCost)),
                ]).pipe(
                  switchMap(([dataCost]) => {
                    for (const data of [dataCost]) {
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
                      this.generateXmlService.generateXMLEduItemRst(
                        dataRstItem,
                      );
                    const checkQueryItem = generateQuery(
                      checkXmlItem,
                      '_SHREduPersRstItemCheck',
                      serviceSeq,
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
                                !item.IDX_NO ||
                                !item.EduItemName ||
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
                                Name: item.UMCostItemName,
                                result: item.Result,
                              })),
                            });
                          }
                        }

                        const saveXmlItem =
                          this.generateXmlService.generateXMLEduItemRst(
                            checkDataItem,
                          );
                        const saveQueryItem = generateQuery(
                          saveXmlItem,
                          '_SHREduPersRstItemSave',
                          serviceSeq,
                          pgmSeq,
                        );

                        return forkJoin([
                          from(
                            this.databaseService.executeQuery(saveQueryItem),
                          ),
                        ]).pipe(
                          map(([dataItem]) => {
                            for (const data of [dataItem]) {
                              const invalidItems =
                                data?.filter(
                                  (item: any) => item.Status !== 0,
                                ) || [];

                              if (invalidItems.length) {
                                const isInvalidFormat = invalidItems.some(
                                  (item: any) =>
                                    !item.IDX_NO ||
                                    !item.EduItemName ||
                                    !item.Result,
                                );

                                if (isInvalidFormat) {
                                  return {
                                    success: false,
                                    errors: [
                                      {
                                        IDX_NO: 1,
                                        Name: 'Lỗi',
                                        result:
                                          'Không thể lấy dữ liệu chi tiết lỗi.',
                                      },
                                    ],
                                  };
                                }
                                return {
                                  success: false,
                                  errors: invalidItems.map((item: any) => ({
                                    IDX_NO: item.IDX_NO,
                                    Name: item.EduItemName,
                                    result: item.Result,
                                  })),
                                };
                              }
                            }

                            return {
                              success: true,
                              data: {
                                logs1: saveDataPerRst,
                                logs2: dataCost,
                                logs3: dataItem,
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
      catchError((err) => {
        return of(err);
      }),
    );
  }

  deleteEduRstCost(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const XmlCostCheck = this.generateXmlService.generateXMLEduCostRst(
      result,
      null,
    );
    const checkQueryCost = generateQuery(
      XmlCostCheck,
      '_SHREduPersRstCostCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([
      from(this.databaseService.executeQuery(checkQueryCost)),
    ]).pipe(
      switchMap(([dataCheckCost]) => {
        const results = [dataCheckCost];

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

        const saveXmlCost = this.generateXmlService.generateXMLEduCostRst(
          dataCheckCost,
          dataCheckCost[0].RstSeq,
        );
        const saveQueryCost = generateQuery(
          saveXmlCost,
          '_SHREduPersRstCostSave',
          serviceSeq,
          pgmSeq,
        );
        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryCost)),
        ]).pipe(
          map(([dataCost]) => {
            for (const data of [dataCost]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) =>
                    !item.IDX_NO || !item.EduItemName || !item.Result,
                );

                if (isInvalidFormat) {
                  return {
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  };
                }
                return {
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.EduItemName,
                    result: item.Result,
                  })),
                };
              }
            }

            return {
              success: true,
              data: {
                logs1: dataCost,
              },
            };
          }),
        );
      }),
    );
  }

  deleteEduRstItem(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const checkXmlItem = this.generateXmlService.generateXMLEduItemRst(result);
    const checkQueryItem = generateQuery(
      checkXmlItem,
      '_SHREduPersRstItemCheck',
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
                  Name: item.RstNo,
                  result: item.Result,
                })),
            });
          }
        }

        const saveXmlItem =
          this.generateXmlService.generateXMLEduItemRst(dataCheckItem);
        const saveQueryItem = generateQuery(
          saveXmlItem,
          '_SHREduPersRstItemSave',
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

  searchEduCostRst(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const xmlDoc1 = this.generateXmlService.generateXMLSearchEduCostRst(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduPersRstCostQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      map(([dataCost]) => {
        return {
          success: true,
          data: dataCost,
        };
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  searchEduItemRst(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const xmlDoc1 = this.generateXmlService.generateXMLSearchEduItemRst(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduPersRstItemQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      map(([dataItem]) => {
        return {
          success: true,
          data: dataItem,
        };
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  searchEduPerRstQuery(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1872;
    const serviceSeq = 3375;
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
    const xmlDoc1 =
      this.generateXmlService.generateXMLSearchEduPerRstQuery(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduPersRstSearchQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      map(([dataItem]) => {
        return {
          success: true,
          data: {
            logs1: dataItem,
          },
        };
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  searchEduRst(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument = this.generateXmlService.generateXMLSearchEduRst(result);
    const query = `
            EXEC _SHREduRstQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3407,
            @WorkingTag = N't',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 3945;
        `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  searchEduRstEnd(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<SimpleQueryResult> {
    const xmlDocument =
      this.generateXmlService.generateXMLSearchEduRstEnd(result);
    const query = `
            EXEC _SHREduRstEndQuery_WEB
            @xmlDocument = N'${xmlDocument}',
            @xmlFlags = 2,
            @ServiceSeq = 3407,
            @WorkingTag = N't',
            @CompanySeq = ${companySeq},
            @LanguageSeq = 6,
            @UserSeq = ${userSeq},
            @PgmSeq = 1874;
        `;

    return this.databaseService.executeQueryVer02(query).pipe(
      map((resultQuery) => ({ success: true, data: resultQuery })),
      catchError((error) =>
        of({
          success: false,
          message: error.message || ERROR_MESSAGES.DATABASE_ERROR,
        }),
      ),
    );
  }

  searchEduRstBatch(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 7526;
    const serviceSeq = 6300;
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
    const xmlDoc1 = this.generateXmlService.generateXMLSearchEduPerRst(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduRstBatchQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([dataPersRst]) => {
        const saveXmlDocRstItem =
          this.generateXmlService.generateXMLEduRstItemQuery(dataPersRst);
        const saveQueryRstItem = generateQuery(
          saveXmlDocRstItem,
          '_SHREduRstBatchItemQuery',
          serviceSeq,
          pgmSeq,
        );

        const saveXmlDocRstCost =
          this.generateXmlService.generateXMLEduRstCostQuery(dataPersRst);
        const saveQueryRstCost = generateQuery(
          saveXmlDocRstCost,
          '_SHREduRstBatchCostQuery',
          serviceSeq,
          pgmSeq,
        );

        const saveXmlDocRstObj =
          this.generateXmlService.generateXMLEduRstObjBatch(dataPersRst);
        const saveQueryRstObj = generateQuery(
          saveXmlDocRstObj,
          '_SHREduRstBatchObjQuery',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryRstItem)),
          from(this.databaseService.executeQuery(saveQueryRstCost)),
          from(this.databaseService.executeQuery(saveQueryRstObj)),
        ]).pipe(
          map(([dataItem, dataCost, dataObj]) => {
            for (const data of [dataItem]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) =>
                    !item.IDX_NO || !item.EduTypeName || !item.Result,
                );

                if (isInvalidFormat) {
                  return {
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  };
                }

                return {
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.EduCourseName,
                    result: item.Result,
                  })),
                };
              }
            }
            return {
              success: true,
              data: {
                dataPersRst: dataPersRst,
                dataItem: dataItem,
                dataCost: dataCost,
                dataObj: dataObj,
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

  auEduRstEnd(
    result: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 1874;
    const serviceSeq = 3407;
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
    const xmlDoc1 = this.generateXmlService.generateXMLEduPerRstEnd(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduPersRstEndCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([data1]) => {
        const results = [data1];

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

        const saveXmlDocEduPerRst =
          this.generateXmlService.generateXMLEduPerRstEnd(data1);
        const saveQueryEduPerRst = generateQuery(
          saveXmlDocEduPerRst,
          '_SHREduPersRstEndSave',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryEduPerRst)),
        ]).pipe(
          switchMap(([saveDataPerRst]) => {
            for (const data of [saveDataPerRst]) {
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

            const XmlConfirm = this.generateXmlService.generateXMLComConfirm(
              saveDataPerRst,
              saveDataPerRst[0].RstSeq,
            );
            const queryConfirm = generateQuery(
              XmlConfirm,
              '_SCOMConfirmEduRstEnd',
              2609,
              1874,
            );

            return forkJoin([
              from(this.databaseService.executeQuery(queryConfirm)),
            ]).pipe(
              switchMap(([confirmData]) => {
                for (const data of [confirmData]) {
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

                const saveXmlCost = `
                    <ROOT></ROOT>
                `;
                const saveQueryCost = generateQuery(
                  saveXmlCost,
                  '_SHREduPersRstConfirmSave',
                  serviceSeq,
                  pgmSeq,
                );

                return forkJoin([
                  from(this.databaseService.executeQuery(saveQueryCost)),
                ]).pipe(
                  map(([dataConfirmRst]) => {
                    return {
                      success: true,
                      data: {
                        logs1: saveDataPerRst,
                        logs2: confirmData,
                        log3: dataConfirmRst,
                      },
                    };
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

  auEduRstBatch(
    info: any,
    dataRstCost: any[],
    dataRstItem: any[],
    dataEduPerObj: any[],
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 7526;
    const serviceSeq = 6300;
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
    const xmlDoc1 = this.generateXmlService.generateXMLEduRstBatch(info);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduRstBatchCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      switchMap(([data1]) => {
        const results = [data1];

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

        const saveXmlDocEduPerRst =
          this.generateXmlService.generateXMLEduRstBatch(data1);
        const saveQueryEduPerRst = generateQuery(
          saveXmlDocEduPerRst,
          '_SHREduRstBatchSave',
          serviceSeq,
          pgmSeq,
        );

        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryEduPerRst)),
        ]).pipe(
          switchMap(([saveDataPerRst]) => {
            for (const data of [saveDataPerRst]) {
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

            const XmlCostCheck =
              this.generateXmlService.generateXMLEduCostRstBatch(
                dataRstCost,
                saveDataPerRst[0].RstSeq,
              );
            const checkQueryCost = generateQuery(
              XmlCostCheck,
              '_SHREduRstBatchCostCheck',
              serviceSeq,
              pgmSeq,
            );

            return forkJoin([
              from(this.databaseService.executeQuery(checkQueryCost)),
            ]).pipe(
              switchMap(([checkDataCost]) => {
                if (!checkDataCost || checkDataCost.length > 0) {
                  for (const data of [checkDataCost]) {
                    const invalidItems =
                      data?.filter((item: any) => item.Status !== 0) || [];

                    if (invalidItems.length) {
                      const isInvalidFormat = invalidItems.some(
                        (item: any) =>
                          !item?.IDX_NO ||
                          !item?.UMCostItemName ||
                          !item?.Result,
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
                }

                const saveXmlCost =
                  this.generateXmlService.generateXMLEduCostRstBatch(
                    checkDataCost,
                    checkDataCost[0]?.RstSeq,
                  );
                const saveQueryCost = generateQuery(
                  saveXmlCost,
                  '_SHREduRstBatchCostSave',
                  serviceSeq,
                  pgmSeq,
                );

                return forkJoin([
                  from(this.databaseService.executeQuery(saveQueryCost)),
                ]).pipe(
                  switchMap(([dataCost]) => {
                    for (const data of [dataCost]) {
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
                      this.generateXmlService.generateXMLEduItemRst(
                        dataRstItem,
                      );
                    const checkQueryItem = generateQuery(
                      checkXmlItem,
                      '_SHREduRstBatchItemCheck',
                      serviceSeq,
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
                                !item.IDX_NO ||
                                !item.EduItemName ||
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
                                Name: item.UMCostItemName,
                                result: item.Result,
                              })),
                            });
                          }
                        }

                        const saveXmlItem =
                          this.generateXmlService.generateXMLEduItemRst(
                            checkDataItem,
                          );
                        const saveQueryItem = generateQuery(
                          saveXmlItem,
                          '_SHREduRstBatchItemSave',
                          serviceSeq,
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
                                    !item.EduItemName ||
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
                                    Name: item.EduItemName,
                                    result: item.Result,
                                  })),
                                });
                              }
                            }

                            const checkXmlPerObj =
                              this.generateXmlService.generateXMLEduPerObjBatch(
                                dataEduPerObj,
                                saveDataPerRst[0].RstSeq,
                              );
                            const checkQueryPerObj = generateQuery(
                              checkXmlPerObj,
                              '_SHREduRstBatchObjCheck',
                              serviceSeq,
                              pgmSeq,
                            );

                            return forkJoin([
                              from(
                                this.databaseService.executeQuery(
                                  checkQueryPerObj,
                                ),
                              ),
                            ]).pipe(
                              switchMap(([checkDataPerObj]) => {
                                for (const data of [checkDataPerObj]) {
                                  const invalidItems =
                                    data?.filter(
                                      (item: any) => item.Status !== 0,
                                    ) || [];

                                  if (invalidItems.length) {
                                    const isInvalidFormat = invalidItems.some(
                                      (item: any) =>
                                        !item.IDX_NO ||
                                        !item.EmpName ||
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
                                        Name: item.EmpName,
                                        result: item.Result,
                                      })),
                                    });
                                  }
                                }

                                const saveXmlPerObj =
                                  this.generateXmlService.generateXMLEduPerObjBatch(
                                    checkDataPerObj,
                                    saveDataPerRst[0].RstSeq,
                                  );
                                const saveQueryPerObj = generateQuery(
                                  saveXmlPerObj,
                                  '_SHREduRstBatchObjSave',
                                  serviceSeq,
                                  pgmSeq,
                                );

                                return forkJoin([
                                  from(
                                    this.databaseService.executeQuery(
                                      saveQueryPerObj,
                                    ),
                                  ),
                                ]).pipe(
                                  map(([dataPerObj]) => {
                                    for (const data of [dataPerObj]) {
                                      const invalidItems =
                                        data?.filter(
                                          (item: any) => item.Status !== 0,
                                        ) || [];

                                      if (invalidItems.length) {
                                        const isInvalidFormat =
                                          invalidItems.some(
                                            (item: any) =>
                                              !item.IDX_NO ||
                                              !item.EmpName ||
                                              !item.Result,
                                          );

                                        if (isInvalidFormat) {
                                          return {
                                            success: false,
                                            errors: [
                                              {
                                                IDX_NO: 1,
                                                Name: 'Lỗi',
                                                result:
                                                  'Không thể lấy dữ liệu chi tiết lỗi.',
                                              },
                                            ],
                                          };
                                        }
                                        return {
                                          success: false,
                                          errors: invalidItems.map(
                                            (item: any) => ({
                                              IDX_NO: item.IDX_NO,
                                              Name: item.EmpName,
                                              result: item.Result,
                                            }),
                                          ),
                                        };
                                      }
                                    }

                                    return {
                                      success: true,
                                      data: {
                                        logs1: saveDataPerRst,
                                        logs2: dataCost,
                                        logs3: dataItem,
                                        logs4: dataPerObj,
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
        );
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  searchEduCostRstBatch(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 3945;
    const serviceSeq = 6300;
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
    const xmlDoc1 = this.generateXmlService.generateXMLSearchEduCostRst(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduRstBatchCostQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      map(([dataCost]) => {
        return {
          success: true,
          data: dataCost,
        };
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  searchEduItemRstBatch(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 3945;
    const serviceSeq = 6300;
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
    const xmlDoc1 = this.generateXmlService.generateXMLSearchEduItemRst(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduRstBatchItemQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      map(([dataItem]) => {
        return {
          success: true,
          data: dataItem,
        };
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }

  deleteEduRstCostBatch(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 7526;
    const serviceSeq = 6300;
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
    const XmlCostCheck = this.generateXmlService.generateXMLEduCostRst(
      result,
      null,
    );
    const checkQueryCost = generateQuery(
      XmlCostCheck,
      '_SHREduRstBatchCostCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([
      from(this.databaseService.executeQuery(checkQueryCost)),
    ]).pipe(
      switchMap(([dataCheckCost]) => {
        const results = [dataCheckCost];

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

        const saveXmlCost = this.generateXmlService.generateXMLEduCostRstBatch(
          dataCheckCost,
          dataCheckCost[0].RstSeq,
        );
        const saveQueryCost = generateQuery(
          saveXmlCost,
          '_SHREduRstBatchCostSave',
          serviceSeq,
          pgmSeq,
        );
        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryCost)),
        ]).pipe(
          map(([dataCost]) => {
            for (const data of [dataCost]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) =>
                    !item.IDX_NO || !item.EduItemName || !item.Result,
                );

                if (isInvalidFormat) {
                  return {
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  };
                }
                return {
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.EduItemName,
                    result: item.Result,
                  })),
                };
              }
            }

            return {
              success: true,
              data: {
                logs1: dataCost,
              },
            };
          }),
        );
      }),
    );
  }

  deleteEduRstItemBatch(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 7526;
    const serviceSeq = 6300;
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
    const checkXmlItem = this.generateXmlService.generateXMLEduItemRst(result);
    const checkQueryItem = generateQuery(
      checkXmlItem,
      '_SHREduRstBatchItemCheck',
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
                  Name: item.RstNo,
                  result: item.Result,
                })),
            });
          }
        }

        const saveXmlItem =
          this.generateXmlService.generateXMLEduItemRst(dataCheckItem);
        const saveQueryItem = generateQuery(
          saveXmlItem,
          '_SHREduRstBatchItemSave',
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

  deleteEduRstObjBatch(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 7526;
    const serviceSeq = 6300;
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
    const XmlCostCheck = this.generateXmlService.generateXMLEduPerObjBatch(
      result,
      null,
    );
    const checkQueryCost = generateQuery(
      XmlCostCheck,
      '_SHREduRstBatchObjCheck',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([
      from(this.databaseService.executeQuery(checkQueryCost)),
    ]).pipe(
      switchMap(([dataCheckCost]) => {
        const results = [dataCheckCost];

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

        const saveXmlCost = this.generateXmlService.generateXMLEduPerObjBatch(
          dataCheckCost,
          dataCheckCost[0].RstSeq,
        );
        const saveQueryCost = generateQuery(
          saveXmlCost,
          '_SHREduRstBatchObjSave',
          serviceSeq,
          pgmSeq,
        );
        return forkJoin([
          from(this.databaseService.executeQuery(saveQueryCost)),
        ]).pipe(
          map(([dataCost]) => {
            for (const data of [dataCost]) {
              const invalidItems =
                data?.filter((item: any) => item.Status !== 0) || [];

              if (invalidItems.length) {
                const isInvalidFormat = invalidItems.some(
                  (item: any) => !item.IDX_NO || !item.EmpName || !item.Result,
                );

                if (isInvalidFormat) {
                  return {
                    success: false,
                    errors: [
                      {
                        IDX_NO: 1,
                        Name: 'Lỗi',
                        result: 'Không thể lấy dữ liệu chi tiết lỗi.',
                      },
                    ],
                  };
                }
                return {
                  success: false,
                  errors: invalidItems.map((item: any) => ({
                    IDX_NO: item.IDX_NO,
                    Name: item.EduItemName,
                    result: item.Result,
                  })),
                };
              }
            }

            return {
              success: true,
              data: {
                logs1: dataCost,
              },
            };
          }),
        );
      }),
    );
  }

  searchEduRstObjBatch(
    result: any,
    companySeq: number,
    userSeq: number,
  ): Observable<any> {
    const xmlFlags = 2;
    const languageSeq = 6;
    const pgmSeq = 7526;
    const serviceSeq = 6300;
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
    const xmlDoc1 = this.generateXmlService.generateXMLEduRstObjBatch(result);
    const query1 = generateQuery(
      xmlDoc1,
      '_SHREduRstBatchObjSearchQuery',
      serviceSeq,
      pgmSeq,
    );

    return forkJoin([from(this.databaseService.executeQuery(query1))]).pipe(
      map(([dataObj]) => {
        return {
          success: true,
          data: dataObj,
        };
      }),
      catchError((err) => {
        return of(err);
      }),
    );
  }
}
