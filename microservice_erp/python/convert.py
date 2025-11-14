import sys
import os
import comtypes.client

def convert_to_pdf(docx_path, pdf_dir, word=None):
    pdf_path = os.path.join(pdf_dir, os.path.splitext(os.path.basename(docx_path))[0] + ".pdf")
    
    close_word = False
    if word is None:
        word = comtypes.client.CreateObject("Word.Application")
        word.Visible = False
        word.DisplayAlerts = False
        word.ScreenUpdating = False
        word.DisplayRecentFiles = False
        close_word = True  # chỉ đóng Word nếu tự tạo

    try:
        doc = word.Documents.Open(docx_path, ReadOnly=True, AddToRecentFiles=False)
        doc.SaveAs(pdf_path, FileFormat=17)  # 17 = PDF
        doc.Close(False)
        print(f"Converted: {pdf_path}")
    except Exception as e:
        print(f"Error converting {docx_path}: {e}")
    finally:
        if close_word:
            word.Quit()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)
    
    docx_path = sys.argv[1]
    pdf_dir = sys.argv[2]
    
    os.makedirs(pdf_dir, exist_ok=True)

    # Tạo Word một lần và dùng để convert
    word_app = comtypes.client.CreateObject("Word.Application")
    word_app.Visible = False
    word_app.DisplayAlerts = False
    word_app.ScreenUpdating = False
    word_app.DisplayRecentFiles = False

    try:
        convert_to_pdf(docx_path, pdf_dir, word_app)
    finally:
        word_app.Quit()
