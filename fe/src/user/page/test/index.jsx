import { DocumentEditor } from "@onlyoffice/document-editor-react";

const onDocumentReady = () => {
  console.log("📄 Document is loaded.");
};

const onLoadComponentError = (errorCode, errorDescription) => {
  console.error("❌ Error loading component:", errorCode, errorDescription);
};

export default function Test() {
  return (
    <div style={{ height: '100vh' }}>
      <DocumentEditor
        id="docxEditor"
        documentServerUrl="http://160.191.88.33:50005/"
        config={{
          document: {
            fileType: "docx",
            key: `id-${Date.now()}`,
            title: "Tài liệu mẫu",
            url: "https://static.onlyoffice.com/assets/docs/samples/demo.docx"
          },
          documentType: "word",
          editorConfig: {
            mode: "view",
            lang: "en",
            customization: {
              toolbarNoTabs: true,
              hideRightMenu: true,
              hideLeftMenu: true,
              toolbar: false,
              compactToolbar: true,
              about: false,
              feedback: false,
              help: false,
              comments: false,
              chat: false,
              forcesave: false,
              autosave: false,
              toolbarButtons: ["print"] // ✅ Chỉ nút in
            }
          }
          ,
          events: {
            onDocumentReady: onDocumentReady
          }
        }}
        onLoadComponentError={onLoadComponentError}
      />
    </div>
  );
}
