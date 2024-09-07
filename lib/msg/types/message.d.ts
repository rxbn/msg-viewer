export interface Message {
  content: MessageContent,
  attachments: Attachment[],
  recipients: Recipient[],
}

export interface MessageContent {
  subject: string,
  senderName: string,
  senderEmail: string,
  body: string,
  bodyHTML: string,
  // bodyRTF: string,
  headers: string,
}

export interface Attachment {
  extension: string,
  fileNameShort: string,
  fileName: string, 
  mimeType: string,
}

export interface Recipient {
  name: string,
  email: string,
}