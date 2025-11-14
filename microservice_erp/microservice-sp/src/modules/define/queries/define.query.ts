export const GET_ALL_DEFINE = `
  SELECT IdSeq, DefineName, DefineKey
FROM _ERPDefine
WHERE IsActive = 1
ORDER BY IdSeq ASC;

`;

export const GET_ALL_DEFINE_ITEM = `
   SELECT 
  dfi."IdSeq",
  dfi."DefineSeq",
  dfi."DefineItemName",
  dfi."IdxNo",
  dfi."IsActive",
  df."DefineName", 
  df."DefineKey", 
FROM "_ERPDefineItem" dfi
LEFT JOIN "_ERPDefine" df ON dfi."DefineSeq" = df."IdSeq"
WHERE dfi."IsActive" IS 1
ORDER BY dfi."IdSeq" ASC;

`;



export const GET_ALL_DEFINE_ITEM_SEQ = `
  SELECT
    dfi.IdSeq,
    dfi.DefineSeq,
    dfi.DefineKey,
    dfi.DefineItemName,
    dfi.IdxNo,
    dfi.IsActive,
    df.DefineName
  FROM _ERPDefineItem dfi
  LEFT JOIN _ERPDefine df ON dfi.DefineSeq = df.IdSeq
  WHERE dfi.DefineKey = @DefineKey
    AND dfi.IsActive = 1
  ORDER BY dfi.IdSeq ASC;
`;
export const GET_ALL_ITEM_SEQ = `
SELECT
    dfi.ItemSeq,
    dfi.ItemName,
    dfi.ItemNo,
    dfi.Spec,
    dfi.UnitSeq,
    u.UnitName
FROM _TDAItem dfi
LEFT JOIN _TDAUnit u ON dfi.UnitSeq = u.UnitSeq
ORDER BY dfi.ItemSeq DESC;

`;
export const GET_ALL_CUST_SEQ = `
SELECT
    dfi.CustSeq,
    dfi.CustName,
    dfi.CustNo,
    dfi.BizNo
FROM _TDACust dfi
ORDER BY dfi.CustSeq DESC;

`;
