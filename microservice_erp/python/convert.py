import sys
import os
import comtypes.client

def convert_to_pdf(docx_path, pdf_dir):
    pdf_path = os.path.join(pdf_dir, os.path.splitext(os.path.basename(docx_path))[0] + ".pdf")
    
    word = comtypes.client.CreateObject("Word.Application")
    word.Visible = False  # 
    
    try:
        doc = word.Documents.Open(docx_path)
        doc.SaveAs(pdf_path, FileFormat=17)  
        doc.Close()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        word.Quit()

    print(pdf_path)  

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert.py <docx_path> <pdf_dir>")
        sys.exit(1)
    convert_to_pdf(sys.argv[1], sys.argv[2])
