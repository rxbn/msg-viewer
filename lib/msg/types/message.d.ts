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
  bodyRTF: Buffer,
  headers: string,
}

export interface Attachment {
  extension: string,
  fileName: string, 
  mimeType: string,
  language: string,
  displayName: string,
  content: Buffer
}

export interface Recipient {
  name: string,
  email: string,
}