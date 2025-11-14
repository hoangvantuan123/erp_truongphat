export interface EmailRequest {
    IdSeq: number;
    IdxNo: number;
    Host: string;
    Port: string;
    UserName: string;
    Password: string;
    CodeMail: string;
}
export interface EmailDetailRequest {
    IdSeq: number;
    IdxNo: number;
    MailSettingsSeq: number;
    LanguageSeq: number;
    Subject: string;
    PlainText: string;
    FromMail: string;
    HtmlContent: string;
}