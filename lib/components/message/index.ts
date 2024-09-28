import type { Message, MessageContent } from "../../scripts/msg/types/message";
import { fillHTMLTemplate } from "../../scripts/utils/html-template-util";
import { attachmentsHTML } from "../attachment";
import { recipientsHTMLs } from "../recipient";
import template from "./index.html" with { type: "text" };

export function messageHTML(message: Message): string {
  const [toRecip, ccRecip] = recipientsHTMLs(message);

  const model: MessageViewModel = {
    title: message.content.subject,
    name: getName(message.content),
    date: getDate(message.content),
    rawContent: message.content.body,
    toRecipients: toRecip,
    ccRecipients: ccRecip,
    attachments: attachmentsHTML(message)
  };

  return fillHTMLTemplate(template, model);
}

function getName(content: MessageContent): string {
  let name = content.senderName ?? "";
  if (content.senderEmail) {
    name += ` &lt;${content.senderEmail}&gt;`;
  }
  return name;
}

function getDate(content: MessageContent): string {
  return content.date.toLocaleString('en-US', {
    weekday: "short",
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short"
  });
}

interface MessageViewModel {
  title: string,
  name: string,
  date: string,
  rawContent: string,
  toRecipients: string,
  ccRecipients: string,
  attachments: string
}
