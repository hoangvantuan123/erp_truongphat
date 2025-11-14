import sys
import json
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
import qrcode
from io import BytesIO

def create_labels(data, config, output_path):
    # Lấy kích thước tem từ config
    label_width_mm = config.get("label_width_mm", 40)
    label_height_mm = config.get("label_height_mm", 11)
    page_width = label_width_mm * mm
    page_height = label_height_mm * mm

    # Các tham số từ config
    qr_size = config.get("qr_size_mm", 7) * mm
    font_name = config["font"]["name"]
    font_size_name = config["font"]["size_name"]  # font size cho Name
    font_size_code = config["font"]["size_code"]  # font size cho LotNo
    padding = config.get("padding_mm", 1) * mm
    border_thickness = config.get("border_thickness", 0.3)

    c = canvas.Canvas(output_path, pagesize=(page_width, page_height))

    for item in data:
        # Vẽ viền của vùng nội dung
        inner_x = padding
        inner_y = padding
        inner_width = page_width - 2 * padding
        inner_height = page_height - 2 * padding

        c.setLineWidth(border_thickness)
        c.rect(inner_x, inner_y, inner_width, inner_height)

        # Tạo QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=0
        )
        qr.add_data(item["CodeQR"])
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")

        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        # Vị trí QR trong vùng nội dung
        qr_x = inner_x + padding
        qr_y = inner_y + (inner_height - qr_size) / 2
        c.drawImage(ImageReader(buffer), qr_x, qr_y, qr_size, qr_size)

        # Đường phân cách dọc
        line_x = qr_x + qr_size + padding
        c.line(line_x, inner_y, line_x, inner_y + inner_height)

        # Đường phân cách ngang (ở giữa vùng còn lại)
        text_area_left = line_x
        text_area_right = inner_x + inner_width
        text_area_width = text_area_right - text_area_left

        line_y = inner_y + inner_height / 2
        c.line(text_area_left, line_y, text_area_right, line_y)

        # Vẽ text với 2 font size khác nhau
        # Name ở phần trên
        name_y = inner_y + inner_height * 0.75 - font_size_name / 2
        c.setFont(font_name, font_size_name)
        c.drawCentredString(text_area_left + text_area_width / 2, name_y, item["ItemName"])

        # LotNo ở phần dưới
        code_y = inner_y + inner_height * 0.25 - font_size_code / 2
        c.setFont(font_name, font_size_code)
        c.drawCentredString(text_area_left + text_area_width / 2, code_y, item["LotNo"])

        c.showPage()

    c.save()
    print(output_path)

def main():
    if len(sys.argv) < 3:
        print("Usage: python script.py <config.json> <output.pdf>")
        sys.exit(1)

    config_path = sys.argv[1]
    output_path = sys.argv[2]

    # Đọc config
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    # Đọc data từ stdin
    raw_data = sys.stdin.read()
    data = json.loads(raw_data)

    create_labels(data, config, output_path)

if __name__ == "__main__":
    main()
