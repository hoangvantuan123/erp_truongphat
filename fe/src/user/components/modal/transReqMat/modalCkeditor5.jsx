
import { message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { CKEditor } from 'ckeditor4-react';
import { UploadFile } from '../../../../features/transReqMat/getTransReqMatDetails';

const ModalWithSunEditor5 = ({
  modalOpen,
  setmodalOpen,
  onOk,
  handleChange,
  templatePrint,
}) => {
  const editorRef = useRef(null);
 
  const handleCancel = () => {
    setmodalOpen(false)
  }

  const handleSave = () => {
    const editorContent = editorRef.current.getData();
    console.log('Editor Content:', editorContent);
    saveEditorContent(editorContent);
  };

  const saveEditorContent = (content) => {
    fetch('/api/save-editor-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Saved successfully:', data);
        alert('Content saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving content:', error);
        alert('Failed to save content!');
      });
  };


 const handleDownloadSourceCode1 = () => {

    const editorContent = editorRef.current.getData();
    const blob = new Blob([editorContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'editor-source-code.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSourceCode = async () => {

    const editorContent = editorRef.current.getData();
    const blob = new Blob([editorContent], { type: 'text/html' });
    const file = new File([blob], 'Giay_yeu_cau_chuyen_kho.html', { type: 'text/html' });

    try {
      const response = await UploadFile([file]);
      // console.log("response", response)
  
      if (response.success) {
        message.success('File đã được lưu thành công trên server.');
      } else {
        message.error('Không thể lưu file trên server.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu file:', error);
      message.error('Đã xảy ra lỗi khi lưu file trên server.');
    }
    
  };


  return (
    <Modal
      centered
      open={modalOpen}
      onOk={handleDownloadSourceCode}
      onCancel={handleCancel}
      maskClosable={false}
      closable={false}
      width={900}

    >

      <CKEditor
        config={{
          extraPlugins: 'autogrow,clipboard,panelbutton,colorbutton,colordialog,font,justify,table,tabletools,tableresize,sourcearea',
          removePlugins: 'resize',
          autoGrow_onStartup: true,
          autoGrow_minHeight: 200,
          autoGrow_maxHeight: 600,
          toolbar: [
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo'] },
            { name: 'editing', items: ['Find', 'Replace', 'SelectAll'] },
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Indent', 'Outdent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize', 'TextColor', 'BGColor'] },
            { name: 'tools', items: ['Maximize', 'Source'] },
          ],
          height: 400,
          width: '100%',
          resize_enabled: true,
        }}
        initData={templatePrint}
        onInstanceReady={(event) => {
          console.log("event.editor", event)
          console.log("templatePrint", templatePrint)
          
          const editor = event.editor;
          editor.setData(templatePrint)
          editorRef.current = editor;

        }}
      />
    </Modal>
  );
};

export default ModalWithSunEditor5;


