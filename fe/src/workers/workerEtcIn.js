function checkBarcode(barcode, tableData, tableScanHistory) {
  if (!barcode || !Array.isArray(tableData)) {
    return {
      success: false,
      message: `Barcode "${barcode}" không hợp lệ hoặc barcode bị thiếu`,
    }
  }

  const parts = barcode.split('/')

  if (parts.length !== 5 && parts.length !== 2) {
    return {
        success: false,
        message: `Barcode "${barcode}" không đúng định dạng.\nCó 2 loại định dạng barcode hợp lệ:\n1. Sản phẩm quản lý theo lô hàng: ItemCode/LotNo/Qty/DateCode/ReelNo\n2. Sản phẩm không quản lý theo lô: ItemCode/Qty.`,
    };
}
const code = parts[0];

const filteredItems = tableData.filter((item) => item?.ItemNo === code && item?.NotProgressQty > 0);
const item = filteredItems.length > 0 
  ? filteredItems.reduce((minItem, currentItem) => (currentItem?.ReqSerl < minItem?.ReqSerl ? currentItem : minItem))
  : null;

  if (!item) {
    return {
      success: false,
      message: `Barcode "${barcode}" Không tìm thấy mã ${code} trong đơn yêu cầu hoặc số lượng còn lại bằng 0.`,
    }
  }

  const filteredIsLotMng = tableData.filter((item) => item?.ItemNo === code && item?.IsLotMng === 1);
  if (filteredIsLotMng.length > 0 && parts.length !== 5) {
    return {
      success: false,
      message: `Barcode scan: "${barcode}". Mã hàng ${code} là sản phẩm có quản lý theo lô hàng, yêu cầu định dạng barcode là ItemCode/LotNo/Qty/DateCode/ReelNo.`,
    }
  }

//console.log('item', item)
if (parts.length === 5) { // Xử lý barcode có 5 phần
  
  const lot = parts[1] + "/" + parts[3] + "/" + parts[4]; 
  const qty = parseFloat(parts[2]);
  const dc = parts[3];
  const reel = parts[4];
  
  if (lot.length>30) {
    return {
        success: false,
        message: `Độ dài Lot No "${lot}" không được lớn hơn 30 ký tự!`,
    };
}
  if (isNaN(qty)) {
      return {
          success: false,
          message: `Barcode "${barcode}".Số lượng (phần thứ 3 của barcode) không phải là số.`,
      };
  }

  const existingBarcode = tableScanHistory.find(
      (item) => item?.LotNo === lot && item?.ItemNo === code,
  );

  if (existingBarcode) {
      return {
          success: false,
          message: `Lot No "${lot}" của mã hàng "${code}" đã được quét trước đó`,
      };
  }

  if (qty> item.NotProgressQty ) {
    return {
      success: false,
      message: `Số lượng quét (${qty}) vượt quá số lượng còn lại (${item.NotProgressQty}) của mã hàng ${item.ItemNo}.`,
    }
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
          ItemSeq: item?.ItemSeq,
          UnitSeq: item?.UnitSeq,
          UnitName: item?.UnitName,
          ReqSeq: item?.ReqSeq,
          ReqSerl: item?.ReqSerl,
          InOutDetailKind: item?.InOutReqDetailKind,
          InOutDetailKindName: item?.InOutReqDetailKindName,
          Price: item?.Price,
          Amt: qty * item?.Price,
          InOutReqType: item?.InOutReqType,
          ReqQty: item?.Qty,
      },
  };
} else if (parts.length === 2) { 
  const qty = parseFloat(parts[1]);

  if (isNaN(qty)) {
    return {
        success: false,
        message: `Barcode "${barcode}". Số lượng (phần thứ 2 của barcode) không phải là số.`,
    };
}

if ( qty > item.NotProgressQty ) {
  return {
    success: false,
    message: `Số lượng quét (${qty}) vượt quá số lượng còn lại (${item.NotProgressQty}) của mã hàng ${item.ItemNo}.`,
  }
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
          ReqSeq: item?.ReqSeq,
          ReqSerl: item?.ReqSerl,
          InOutDetailKind: item?.InOutReqDetailKind,
          InOutDetailKindName: item?.InOutReqDetailKindName,
          Price: item?.Price,
          Amt: qty * item?.Price,
          InOutReqType: item?.InOutReqType,
          ReqQty: item?.Qty,
      },
  };
}
}

self.onmessage = function (event) {
  const { type, barcode, tableData, tableScanHistory } = event.data
  let result

  switch (type) {
    case 'CHECK_BARCODE':
      result = checkBarcode(barcode, tableData, tableScanHistory)
      break
    default:
      result = {
        success: false,
        message: `Loại xử lý "${type}" không được hỗ trợ.`,
      }
  }

  self.postMessage(result)
}
