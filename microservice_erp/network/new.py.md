import json
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode
from io import BytesIO

# THÊM ĐOẠN NÀY - sử dụng font có sẵn
try:
    # Thử dùng font Arial (có trên hầu hết Windows)
    pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
    pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))
    NORMAL_FONT = "Arial"
    BOLD_FONT = "Arial-Bold"
except:
    # Fallback về Helvetica
    NORMAL_FONT = "Helvetica"
    BOLD_FONT = "Helvetica-Bold"

def generate_sample_data(n=1):
    """Sinh dữ liệu giả"""
    return [{
        "CodeQR": f"https://example.com/item{i}",
        "MaNVL": f"M0797-PP-{i:04d}",
        "Grade": "2300NC", 
        "Color": "WHITE",
        "NCC": "80002",
        "QtyBox": "500.0",
        "PONo": "199990",
        "BagBoxNo": "1",
        "LotNo": "15/05/2025"
    } for i in range(1, n+1)]

def draw_label(c, item, config):
    # Kích thước tem
    page_width = config.get("label_width_mm", 100) * mm
    page_height = config.get("label_height_mm", 80) * mm
    padding = config.get("padding_mm", 2) * mm

    # Vẽ khung ngoài có padding
    c.setLineWidth(1)
    c.rect(padding, padding, page_width - 2*padding, page_height - 2*padding)

    # TIÊU ĐỀ - SỬA FONT Ở ĐÂY
    title_height = 8 * mm
    c.setFont(BOLD_FONT, 10)  # ← DÒNG QUAN TRỌNG
    c.drawCentredString(page_width/2, page_height - padding - title_height/2 - 2, "TEM NGUYÊN VẬT LIỆU")
    
    # Đường kẻ dưới tiêu đề
    c.line(padding, page_height - padding - title_height, page_width - padding, page_height - padding - title_height)

    # Bảng dữ liệu - SỬA CÁC FONT KHÁC
    table_start_y = page_height - padding - title_height
    
    available_height = table_start_y - padding
    row_heights = [available_height/6] * 6
    
    data_cols_width = 80 * mm
    qr_col_width = 20 * mm
    data_col_width = data_cols_width / 4

    # Đường kẻ dọc phân cách dữ liệu và QR code
    c.line(padding + data_cols_width, table_start_y, padding + data_cols_width, padding)

    # Đường kẻ ngang
    current_y = table_start_y
    for i, height in enumerate(row_heights):
        current_y -= height
        if i < len(row_heights) - 1:
            c.line(padding, current_y, padding + data_cols_width, current_y)

    # Đường dọc cố định
    c.line(padding + data_col_width, table_start_y, padding + data_col_width, padding)

    # HÀNG 1: MÃ NVL - SỬA FONT
    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2, table_start_y - row_heights[0]/2 - 2, "MÃ NVL")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    ma_nvl_text = item.get("MaNVL", "")
    text_width = c.stringWidth(ma_nvl_text, NORMAL_FONT, 8)
    text_x = padding + data_col_width + (3*data_col_width - text_width)/2
    c.drawString(text_x, table_start_y - row_heights[0]/2 - 2, ma_nvl_text)

    # HÀNG 2: GRADE + COLOR - SỬA FONT
    c.line(padding + 2*data_col_width, table_start_y - sum(row_heights[:1]), 
           padding + 2*data_col_width, table_start_y - sum(row_heights[:2]))
    c.line(padding + 3*data_col_width, table_start_y - sum(row_heights[:1]), 
           padding + 3*data_col_width, table_start_y - sum(row_heights[:2]))

    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2, table_start_y - sum(row_heights[:1]) - row_heights[1]/2 - 2, "GRADE")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    grade_text = item.get("Grade", "")
    text_width = c.stringWidth(grade_text, NORMAL_FONT, 8)
    text_x = padding + data_col_width + (data_col_width - text_width) / 2
    c.drawString(text_x, table_start_y - sum(row_heights[:1]) - row_heights[1]/2 - 2, grade_text)

    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2*data_col_width + 2, table_start_y - sum(row_heights[:1]) - row_heights[1]/2 - 2, "COLOR")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    color_text = item.get("Color", "")
    text_width = c.stringWidth(color_text, NORMAL_FONT, 8)
    text_x = padding + 3*data_col_width + (data_col_width - text_width) / 2
    c.drawString(text_x, table_start_y - sum(row_heights[:1]) - row_heights[1]/2 - 2, color_text)

    # HÀNG 3: NCC - SỬA FONT
    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2, table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2, "NCC")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    ncc_text = item.get("NCC", "")
    text_width = c.stringWidth(ncc_text, NORMAL_FONT, 8)
    text_x = padding + data_col_width + (3*data_col_width - text_width)/2
    c.drawString(text_x, table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2, ncc_text)

    # HÀNG 4: QTY/BOX - SỬA FONT
    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2, table_start_y - sum(row_heights[:3]) - row_heights[3]/2 - 2, "QTY/BOX")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    qty_text = item.get("QtyBox", "")
    text_width = c.stringWidth(qty_text, NORMAL_FONT, 8)
    text_x = padding + data_col_width + (3*data_col_width - text_width)/2
    c.drawString(text_x, table_start_y - sum(row_heights[:3]) - row_heights[3]/2 - 2, qty_text)

    # HÀNG 5: P/O NO - SỬA FONT
    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2, table_start_y - sum(row_heights[:4]) - row_heights[4]/2 - 2, "P/O NO")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    po_text = item.get("PONo", "")
    text_width = c.stringWidth(po_text, NORMAL_FONT, 8)
    text_x = padding + data_col_width + (3*data_col_width - text_width)/2
    c.drawString(text_x, table_start_y - sum(row_heights[:4]) - row_heights[4]/2 - 2, po_text)

    # HÀNG 6: BAG/BOX NO + LOT NHẬP - SỬA FONT
    c.line(padding + 2*data_col_width, table_start_y - sum(row_heights[:5]), 
           padding + 2*data_col_width, padding)
    c.line(padding + 3*data_col_width, table_start_y - sum(row_heights[:5]), 
           padding + 3*data_col_width, padding)

    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2, table_start_y - sum(row_heights[:5]) - row_heights[5]/2 - 2, "BAG/BOX NO")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    bag_text = item.get("BagBoxNo", "")
    text_width = c.stringWidth(bag_text, NORMAL_FONT, 8)
    text_x = padding + data_col_width + (data_col_width - text_width) / 2
    c.drawString(text_x, table_start_y - sum(row_heights[:5]) - row_heights[5]/2 - 2, bag_text)

    c.setFont(BOLD_FONT, 8)  # ← ĐỔI THÀNH BOLD_FONT
    c.drawString(padding + 2*data_col_width + 2, table_start_y - sum(row_heights[:5]) - row_heights[5]/2 - 2, "LOT NHẬP")
    c.setFont(NORMAL_FONT, 8)  # ← ĐỔI THÀNH NORMAL_FONT
    lot_text = item.get("LotNo", "")
    text_width = c.stringWidth(lot_text, NORMAL_FONT, 8)
    text_x = padding + 3*data_col_width + (data_col_width - text_width) / 2
    c.drawString(text_x, table_start_y - sum(row_heights[:5]) - row_heights[5]/2 - 2, lot_text)

    # QR CODE (giữ nguyên)
    qr_size = min(qr_col_width - 8*mm, sum(row_heights) - 8*mm)
    qr_x = padding + data_cols_width + padding + (qr_col_width - 4*padding - qr_size) / 2
    table_bottom = padding
    table_top = table_start_y
    qr_y = table_bottom + (table_top - table_bottom - qr_size) / 2
    
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M,
                       box_size=10, border=0)
    qr.add_data(item.get("CodeQR", ""))
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    c.drawImage(ImageReader(buffer), qr_x, qr_y, qr_size, qr_size)

def create_labels(data, config, output_path):
    page_width = config.get("label_width_mm", 100) * mm
    page_height = config.get("label_height_mm", 80) * mm
    c = canvas.Canvas(output_path, pagesize=(page_width, page_height))
    for item in data:
        draw_label(c, item, config)
        c.showPage()
    c.save()
    print(f"File PDF đã được tạo: {output_path}")

def main():
    config = {
        "label_width_mm": 100,
        "label_height_mm": 80,
        "padding_mm": 2,
    }
    data = generate_sample_data(3)
    create_labels(data, config, "labels_table_with_qr.pdf")

if __name__ == "__main__":
    main()