function checkBarcode(barcode, tableData, tableScanHistory) {
  // Kiểm tra giá trị đầu vào
  if (!barcode || !Array.isArray(tableData)) {
    return {
      success: false,
      message: `Barcode "${barcode}" không hợp lệ hoặc barcode bị thiếu.`,
    };
  }

  // Phân tách barcode theo dấu '/'
  const parts = barcode.split('/');

  // Barcode phải có 2 hoặc 5 , 4phần, nếu không trả về lỗi
  if (parts.length !== 5 && parts.length !== 2  && parts.length !== 4) {
    return {
      success: false,
      message: `Barcode "${barcode}" không đúng định dạng.\nCó 2 loại định dạng barcode hợp lệ:\n1. Sản phẩm quản lý theo lô hàng: ItemCode/LotNo/Qty/DateCode/ReelNo\n2. Sản phẩm không quản lý theo lô: ItemCode/Qty.`,
    };
  }

  const groupedData = tableScanHistory.reduce((acc, item) => {
    const key = `${item.ItemNo}-${item.LotNo}`;
    if (!acc.has(key)) {
      acc.set(key, { ...item, Qty: 0 });
    }
    acc.get(key).Qty += item.Qty;
    return acc;
  }, new Map());

  const scanQty = Array.from(groupedData.values());

  const code = parts[0];


  const filteredItems = tableData.filter(
    (item) => item?.ItemNo === code && item?.NotProgressQty > 0
  );

  // Nếu không tìm thấy item nào thì trả về lỗi
  if (filteredItems.length === 0) {
    return {
      success: false,
      message: `Barcode "${barcode}" không tìm thấy mã ${code} trong đơn yêu cầu hoặc số lượng còn lại bằng 0.`,
    };
  }

  const item = filteredItems.reduce((minItem, currentItem) =>
    currentItem?.ReqSerl <= minItem?.ReqSerl ? currentItem : minItem
  );

  const filteredIsLotMng = tableData.filter(
    (item) => item?.ItemNo === code && item?.IsLotMng === 1
  );
  if (filteredIsLotMng.length > 0 && parts.length !== 5 && parts.length !== 4) {
    return {
      success: false,
      message: `Barcode scan: "${barcode}". Mã hàng ${code} là sản phẩm có quản lý theo lô hàng, yêu cầu định dạng barcode là ItemCode/LotNo/Qty/DateCode/ReelNo.`,
    };
  }

  if (parts.length === 5) {
    const lot = `${parts[1]}/${parts[3]}/${parts[4]}`;
    const qty = parseFloat(parts[2]);
    const itemlot = parts[1];
    const dc = parts[3];
    const reel = parts[4];

    const filteredGroupedData = scanQty.filter(
      (itm) => itm.ItemNo === code && itm.LotNo === lot
    );

    if (lot.length > 30) {
      return {
        success: false,
        message: `Độ dài Lot No "${lot}" không được lớn hơn 30 ký tự!`,
      };
    }

    if (isNaN(qty)) {
      return {
        success: false,
        message: `Barcode "${barcode}". Số lượng (phần thứ 3 của barcode) không phải là số.`,
      };
    }

    if (qty > item.NotProgressQty) {
      return {
        success: false,
        message: `Số lượng quét (${qty}) vượt quá số lượng còn lại (${item.NotProgressQty}) của mã hàng ${item.ItemNo}.`,
      };
    }

    return {
      success: true,
      message: `Barcode "${barcode}" khớp với mã hàng: ${item?.ItemNo}, Số lượng quét: ${qty}.`,
      data: {
        itemNo: item?.ItemNo,
        qty,
        lot,
        dc,
        reel,
        barcode,
        ItemLotNo: itemlot,
        ItemSeq: item?.ItemSeq,
        UnitSeq: item?.UnitSeq,
        UnitName: item?.UnitName,
        ReqSeq: item?.OutReqSeq,
        ReqSerl: item?.OutReqItemSerl,
        InOutDetailKind: item?.InOutReqDetailKind,
        InOutDetailKindName: item?.InOutReqDetailKindName,
        Price: item?.Price,
        BizUnit: item?.BizUnit,
        Amt: qty * item?.Price,
        InOutReqType: item?.InOutReqType,
        ReqQty: item?.Qty,
        InWHSeq: item?.InWHSeq,
        OutWHSeq: item?.OutWHSeq,
        ScanQty: filteredGroupedData.length > 0 ? filteredGroupedData[0].Qty : 0,
      },
    };
  }
if (parts.length === 4) {
    const lot = `${parts[1]}`;
    const qty = parseFloat(parts[2]);
    const itemlot = parts[1];
    const dc = parts[3];
    const reel = '';

    const filteredGroupedData = scanQty.filter(
      (itm) => itm.ItemNo === code && itm.LotNo === lot
    );

    if (lot.length > 30) {
      return {
        success: false,
        message: `Độ dài Lot No "${lot}" không được lớn hơn 30 ký tự!`,
      };
    }

    if (isNaN(qty)) {
      return {
        success: false,
        message: `Barcode "${barcode}". Số lượng (phần thứ 3 của barcode) không phải là số.`,
      };
    }

    if (qty > item.NotProgressQty) {
      return {
        success: false,
        message: `Số lượng quét (${qty}) vượt quá số lượng còn lại (${item.NotProgressQty}) của mã hàng ${item.ItemNo}.`,
      };
    }

    return {
      success: true,
      message: `Barcode "${barcode}" khớp với mã hàng: ${item?.ItemNo}, Số lượng quét: ${qty}.`,
      data: {
        itemNo: item?.ItemNo,
        qty,
        lot,
        dc,
        reel,
        barcode,
        ItemLotNo: itemlot,
        ItemSeq: item?.ItemSeq,
        UnitSeq: item?.UnitSeq,
        UnitName: item?.UnitName,
        ReqSeq: item?.OutReqSeq,
        ReqSerl: item?.OutReqItemSerl,
        InOutDetailKind: item?.InOutReqDetailKind,
        InOutDetailKindName: item?.InOutReqDetailKindName,
        Price: item?.Price,
        BizUnit: item?.BizUnit,
        Amt: qty * item?.Price,
        InOutReqType: item?.InOutReqType,
        ReqQty: item?.Qty,
        InWHSeq: item?.InWHSeq,
        OutWHSeq: item?.OutWHSeq,
        ScanQty: filteredGroupedData.length > 0 ? filteredGroupedData[0].Qty : 0,
      },
    };
  }


  else if (parts.length === 2) {
    const qty = parseFloat(parts[1]);
    const filteredGroupedData = scanQty.filter((itm) => itm.ItemNo === code);

    if (isNaN(qty)) {
      return {
        success: false,
        message: `Barcode "${barcode}". Số lượng (phần thứ 2 của barcode) không phải là số.`,
      };
    }

    if (qty > item.NotProgressQty) {
      return {
        success: false,
        message: `Số lượng quét (${qty}) vượt quá số lượng còn lại (${item.NotProgressQty}) của mã hàng ${item.ItemNo}.`,
      };
    }

    return {
      success: true,
      message: `Barcode "${barcode}" khớp với mã hàng: ${item?.ItemNo}, Giá trị: ${qty}.`,
      data: {
        itemNo: item?.ItemNo,
        qty,
        barcode,
        ItemSeq: item?.ItemSeq,
        UnitSeq: item?.UnitSeq,
        UnitName: item?.UnitName,
        ReqSeq: item?.OutReqSeq,
        ReqSerl: item?.OutReqItemSerl,
        InOutDetailKind: item?.InOutReqDetailKind,
        InOutDetailKindName: item?.InOutReqDetailKindName,
        Price: item?.Price,
        BizUnit: item?.BizUnit,
        Amt: qty * item?.Price,
        InOutReqType: item?.InOutReqType,
        ReqQty: item?.Qty,
        InWHSeq: item?.InWHSeq,
        OutWHSeq: item?.OutWHSeq,
        ScanQty: filteredGroupedData.length > 0 ? filteredGroupedData[0].Qty : 0,
      },
    };
  }
}

// Đoạn xử lý postMessage với worker
self.onmessage = function (event) {
  const { type, barcode, tableData, tableScanHistory } = event.data;
  let result;

  switch (type) {
    case 'CHECK_BARCODE_OUT_REQ':
      result = checkBarcode(barcode, tableData, tableScanHistory);
      break;
    default:
      result = {
        success: false,
        message: `Loại xử lý "${type}" không được hỗ trợ.`,
      };
  }

  self.postMessage(result);
};
