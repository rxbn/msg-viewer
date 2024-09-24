export interface Message {
  content: MessageContent,
  attachments: Attachment[],
  recipients: Recipient[],
}

export interface MessageContent {
  date: Date,
  subject: string,
  senderName: string,
  senderEmail: string,
  body: string,
  bodyHTML: string,
  bodyRTF: Buffer,
  headers: string,
  toRecipients: string,
  ccRecipients: string
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