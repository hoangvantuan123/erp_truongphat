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
