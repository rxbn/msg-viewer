import type { Message } from "../../scripts/msg/types/message";
import { bytesWithUnits } from "../../scripts/utils/file-size-util";
import { fillHTMLTemplate } from "../../scripts/utils/html-template-util";
import template from "./index.html" with { type: "text" };

export function attachmentsHTML(message: Message): string {
  return message.attachments.map(attachment => {
    const blob = new Blob([attachment.content], { type: 'application/octet-stream' });
  
    const model: AttachmentViewModel = { 
      name: attachment.displayName, 
      size: bytesWithUnits(attachment.content.byteLength).toString(), 
      url: URL.createObjectURL(blob) 
    };

    return fillHTMLTemplate(template, model);
  }).join("");
}

interface AttachmentViewModel {
  name: string, 
  size: string, 
  url: string
}
