import json
import sys
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth

sys.stdout.reconfigure(encoding='utf-8')
sys.stdin.reconfigure(encoding='utf-8')

# THÊM ĐOẠN NÀY - sử dụng font có sẵn
try:
    # Thử dùng font Arial (có trên hầu hết Windows)
    pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
    pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))
    NORMAL_FONT = "Arial"
    BOLD_FONT = "Arial-Bold"
except:
    pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
    pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))
    NORMAL_FONT = "Arial"
    BOLD_FONT = "Arial-Bold"


def wrap_text(text, font, font_size, max_width):
    """Tự động xuống dòng cho text dài"""
    words = text.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        test_width = stringWidth(test_line, font, font_size)
        
        if test_width <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    
    if current_line:
        lines.append(' '.join(current_line))
    
    return lines


def draw_wrapped_text(c, text, x, y, max_width, font, font_size, max_lines=2, line_height=3*mm):
    """Vẽ text với tự động xuống dòng"""
    lines = wrap_text(text, font, font_size, max_width)
    
    for i, line in enumerate(lines):
        if i >= max_lines:
            if len(lines) > max_lines:
                # Cắt và thêm "..." cho dòng cuối
                prev_line = lines[max_lines-1]
                # Tìm vị trí có thể cắt để thêm "..."
                ellipsis_width = stringWidth("...", font, font_size)
                available_width = max_width - ellipsis_width
                
                truncated_line = prev_line
                while stringWidth(truncated_line, font, font_size) > available_width and len(truncated_line) > 3:
                    truncated_line = truncated_line[:-1]
                
                line = truncated_line + "..."
                text_width = stringWidth(line, font, font_size)
                text_x = x + (max_width - text_width) / 2
                c.drawString(text_x, y - (max_lines-1) * line_height, line)
            break
            
        text_width = stringWidth(line, font, font_size)
        text_x = x + (max_width - text_width) / 2
        c.drawString(text_x, y - i * line_height, line)


def draw_label(c, item, config, x_offset, y_offset):
    # Kích thước tem
    label_width = config.get("label_width_mm", 100) * mm
    label_height = config.get("label_height_mm", 80) * mm
    padding = config.get("padding_mm", 2) * mm

    # Vị trí bắt đầu vẽ tem
    x_start = x_offset
    y_start = y_offset

    # Vẽ khung ngoài có padding
    c.setLineWidth(1)
    c.rect(x_start + padding, y_start + padding, 
           label_width - 2*padding, label_height - 2*padding)

    # TIÊU ĐỀ
    title_height = 8 * mm
    c.setFont(BOLD_FONT, 10)
    c.drawCentredString(x_start + label_width/2, 
                       y_start + label_height - padding - title_height/2 - 2, 
                       "TEM NGUYÊN VẬT LIỆU")
    
    # Đường kẻ dưới tiêu đề
    c.line(x_start + padding, 
           y_start + label_height - padding - title_height, 
           x_start + label_width - padding, 
           y_start + label_height - padding - title_height)

    # Bảng dữ liệu
    table_start_y = y_start + label_height - padding - title_height
    
    available_height = table_start_y - (y_start + padding)
    # TĂNG SỐ HÀNG LÊN 7 (thêm hàng Tên NVL)
    row_heights = [available_height/7] * 7
    
    data_cols_width = 80 * mm
    qr_col_width = 20 * mm
    data_col_width = data_cols_width / 4

    # Đường kẻ dọc phân cách dữ liệu và QR code
    c.line(x_start + padding + data_cols_width, 
           table_start_y, 
           x_start + padding + data_cols_width, 
           y_start + padding)

    # Đường kẻ ngang
    current_y = table_start_y
    for i, height in enumerate(row_heights):
        current_y -= height
        if i < len(row_heights) - 1:
            c.line(x_start + padding, current_y, 
                   x_start + padding + data_cols_width, current_y)

    # Đường dọc cố định
    c.line(x_start + padding + data_col_width, 
           table_start_y, 
           x_start + padding + data_col_width, 
           y_start + padding)

    # HÀNG 1: TÊN NVL - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - row_heights[0]/2 - 2, "TÊN NVL")
    c.setFont(NORMAL_FONT, 8)
    
    ten_nvl_text = item.get("TenNVL", "")
    max_text_width = 3 * data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - row_heights[0]/2 - 2
    
    draw_wrapped_text(c, ten_nvl_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)

    # HÀNG 2: MÃ NVL - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - sum(row_heights[:1]) - row_heights[1]/2 - 2, "MÃ NVL")
    c.setFont(NORMAL_FONT, 8)
    
    ma_nvl_text = item.get("MaNVL", "")
    max_text_width = 3 * data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - sum(row_heights[:1]) - row_heights[1]/2 - 2
    
    draw_wrapped_text(c, ma_nvl_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)

    # HÀNG 3: GRADE + COLOR - XỬ LÝ XUỐNG DÒNG (2 dòng)
    """ c.line(x_start + padding + 2*data_col_width, table_start_y - sum(row_heights[:2]), 
           x_start + padding + 2*data_col_width, table_start_y - sum(row_heights[:3]))
    c.line(x_start + padding + 3*data_col_width, table_start_y - sum(row_heights[:2]), 
           x_start + padding + 3*data_col_width, table_start_y - sum(row_heights[:3])) """

    # GRADE - XỬ LÝ XUỐNG DÒNG (2 dòng)
    """ c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2, "GRADE")
    c.setFont(NORMAL_FONT, 8)
    grade_text = item.get("Grade", "")
    max_text_width = data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2
    
    draw_wrapped_text(c, grade_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2) """

    # COLOR - XỬ LÝ XUỐNG DÒNG (2 dòng)
    """    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2*data_col_width + 2, 
                 table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2, "COLOR")
    c.setFont(NORMAL_FONT, 8)
    color_text = item.get("Color", "")
    max_text_width = data_col_width - 4
    text_x = x_start + padding + 3*data_col_width
    text_y = table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2
    
    draw_wrapped_text(c, color_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2) """

    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2, "QR Code")
    c.setFont(NORMAL_FONT, 8)
    qr_code_text = item.get("CodeQR", "")
    max_text_width = 3 * data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - sum(row_heights[:2]) - row_heights[2]/2 - 2
    
    draw_wrapped_text(c, qr_code_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)


    # HÀNG 4: NCC - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - sum(row_heights[:3]) - row_heights[3]/2 - 2, "NCC")
    c.setFont(NORMAL_FONT, 8)
    ncc_text = item.get("NCC", "")
    max_text_width = 3 * data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - sum(row_heights[:3]) - row_heights[3]/2 - 2
    
    draw_wrapped_text(c, ncc_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)




    # HÀNG 5: QTY/BOX - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - sum(row_heights[:4]) - row_heights[4]/2 - 2, "QTY/BOX")
    c.setFont(NORMAL_FONT, 8)
    qty_text = item.get("QtyBox", "")
    unit_name = item.get("UnitName", "") 
    
    full_text = f"{qty_text} {unit_name}".strip()

    max_text_width = 3 * data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - sum(row_heights[:4]) - row_heights[4]/2 - 2
    
    draw_wrapped_text(c, full_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)

    # HÀNG 6: LOT NO - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - sum(row_heights[:5]) - row_heights[5]/2 - 2, "LOT NO")
    c.setFont(NORMAL_FONT, 8)
    lot_no_text = item.get("LotNo", "")
    max_text_width = 3 * data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - sum(row_heights[:5]) - row_heights[5]/2 - 2
    
    draw_wrapped_text(c, lot_no_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)

    # HÀNG 7: BAG/BOX NO + NGÀY NHẬP - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.line(x_start + padding + 2*data_col_width, table_start_y - sum(row_heights[:6]), 
           x_start + padding + 2*data_col_width, y_start + padding)
    c.line(x_start + padding + 3*data_col_width, table_start_y - sum(row_heights[:6]), 
           x_start + padding + 3*data_col_width, y_start + padding)

    # BAG/BOX NO - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2, 
                 table_start_y - sum(row_heights[:6]) - row_heights[6]/2 - 2, "BAG/BOX NO")
    c.setFont(NORMAL_FONT, 8)
    bag_text = item.get("BagBoxNo", "")
    max_text_width = data_col_width - 4
    text_x = x_start + padding + data_col_width
    text_y = table_start_y - sum(row_heights[:6]) - row_heights[6]/2 - 2
    
    draw_wrapped_text(c, bag_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)

    # NGÀY NHẬP - XỬ LÝ XUỐNG DÒNG (2 dòng)
    c.setFont(BOLD_FONT, 8)
    c.drawString(x_start + padding + 2*data_col_width + 2, 
                 table_start_y - sum(row_heights[:6]) - row_heights[6]/2 - 2, "NGÀY NHẬP")
    c.setFont(NORMAL_FONT, 8)
    ngay_nhap_text = item.get("NgayNhap", "")
    max_text_width = data_col_width - 4
    text_x = x_start + padding + 3*data_col_width
    text_y = table_start_y - sum(row_heights[:6]) - row_heights[6]/2 - 2
    
    draw_wrapped_text(c, ngay_nhap_text, text_x, text_y, max_text_width, NORMAL_FONT, 8, max_lines=2)

    # QR CODE
    qr_size = min(qr_col_width - 8*mm, sum(row_heights) - 8*mm)
    qr_x = x_start + padding + data_cols_width + padding + (qr_col_width - 4*padding - qr_size) / 2
    table_bottom = y_start + padding
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


def draw_cutting_lines(c, page_width, page_height, label_width, label_height, labels_per_row, labels_per_col, margin):
    """Vẽ các đường line cắt ở khoảng trống giữa các tem"""
    
    # Độ dài của đường line (có thể điều chỉnh)
    line_length = 8 * mm
    
    # Màu và độ dày của đường line
    c.setStrokeColorRGB(0.5, 0.5, 0.5)  # Màu xám
    c.setLineWidth(0.8)
    
    # Vẽ đường line dọc giữa các cột tem
    for col in range(1, labels_per_row):
        x = margin + col * label_width
        
        # Vẽ đường line dọc xuyên suốt từ trên xuống dưới (trong vùng an toàn)
        c.line(x, page_height - margin, x, margin)
        
        # Thêm các đường line ngắn vuông góc để dễ căn chỉnh cắt
        for row in range(labels_per_col + 1):
            y = page_height - margin - row * label_height
            # Line ngắn bên trái
            c.line(x - line_length/2, y, x + line_length/2, y)
    
    # Vẽ đường line ngang giữa các hàng tem
    for row in range(1, labels_per_col):
        y = page_height - margin - row * label_height
        
        # Vẽ đường line ngang xuyên suốt từ trái sang phải (trong vùng an toàn)
        c.line(margin, y, page_width - margin, y)
        
        # Thêm các đường line ngắn vuông góc để dễ căn chỉnh cắt
        for col in range(labels_per_row + 1):
            x = margin + col * label_width
            # Line ngắn bên trên/dưới
            c.line(x, y - line_length/2, x, y + line_length/2)
    
    # Reset về màu đen cho các đường vẽ tiếp theo
    c.setStrokeColorRGB(0, 0, 0)
    c.setLineWidth(1)


def create_labels(data, config, output_path):
    # Sử dụng khổ giấy A4
    page_width, page_height = A4
    
    # THÊM MARGIN AN TOÀN 5mm mỗi bên (4mm + 1mm)
    margin = 5 * mm
    
    # Kích thước mỗi tem
    label_width = config.get("label_width_mm", 100) * mm
    label_height = config.get("label_height_mm", 80) * mm
    
    # Tính toán số tem trên mỗi hàng và mỗi cột (trong vùng an toàn)
    available_width = page_width - 2 * margin
    available_height = page_height - 2 * margin
    
    labels_per_row = int(available_width / label_width)
    labels_per_col = int(available_height / label_height)
    labels_per_page = labels_per_row * labels_per_col
    
    c = canvas.Canvas(output_path, pagesize=A4)
    
    # VẼ ĐƯỜNG CẮT TRƯỚC KHI VẼ TEM (với margin)
    draw_cutting_lines(c, page_width, page_height, label_width, label_height, 
                     labels_per_row, labels_per_col, margin)
    
    for index, item in enumerate(data):
        # Tính vị trí của tem trên trang (có tính margin)
        page_position = index % labels_per_page
        row = page_position // labels_per_row
        col = page_position % labels_per_row
        
        # Tính toán offset với margin
        x_offset = margin + col * label_width
        y_offset = page_height - margin - (row + 1) * label_height  # Tính từ trên xuống
        
        # Vẽ tem tại vị trí tính toán
        draw_label(c, item, config, x_offset, y_offset)
        
        # Nếu đã vẽ đủ tem cho trang này hoặc là tem cuối cùng, tạo trang mới
        if (index + 1) % labels_per_page == 0 and (index + 1) < len(data):
            c.showPage()
            # Vẽ đường cắt cho trang mới (với margin)
            draw_cutting_lines(c, page_width, page_height, label_width, label_height, 
                             labels_per_row, labels_per_col, margin)
    
    c.save()
    print(f"File PDF đã được tạo: {output_path}")
    print(f"Mỗi trang A4 chứa được {labels_per_page} tem ({labels_per_row}×{labels_per_col})")
    print(f"Đã thêm margin an toàn {margin/mm}mm xung quanh tờ A4")
    print("Đã thêm đường line cắt giữa các tem để dễ dàng cắt rời")


def main():
    if len(sys.argv) < 2:
        print("Usage: python item_print_label.py <output_path>")
        sys.exit(1)

    output_path = sys.argv[1]

    config = {
        "label_width_mm": 100,
        "label_height_mm": 80,
        "padding_mm": 2,
    }

    # Đọc data từ stdin
    raw_data = sys.stdin.read()
    data = json.loads(raw_data)

    create_labels(data, config, output_path)


if __name__ == "__main__":
    main()