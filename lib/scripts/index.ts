import { parse } from "./msg/msg-parser";

// @ts-ignore
import messageHTML from "../components/message/index.html" with { type: "text" };
// @ts-ignore
import recipientHTML from "../components/recipient/index.html" with { type: "text" };
// @ts-ignore
import attachmentHTML from "../components/attachment/index.html" with { type: "text" };

const $file = document.getElementById("file")!;

$file!.addEventListener("change", async (event) => {
  const target = event.target as HTMLInputElement;
  if (target?.files?.length === 0) return;
  handleFiles(target.files!);
});


const target = document.documentElement;

target.addEventListener("dragover", (event) => {
  event.preventDefault();
});

target.addEventListener("drop", (event) => {
  event.preventDefault();
  
  const files = event.dataTransfer!.files;

  if (files.length > 0) {
    // TODO: Add filter for .msg
    const $file = document.getElementById("file")! as HTMLInputElement;
    $file.files = files;

    handleFiles(files);
  }
});

export interface MessageViewModel {
  title: string,
  name: string,
  date: string,
  rawContent: string,
  toRecipients: string,
  ccRecipients: string,
  attachments: string
}

// TODO: Refactor this code
async function handleFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const arrayBuffer = await files[i].arrayBuffer();
    const message = parse(new DataView(arrayBuffer));

    let name = message.content.senderName ?? "";
    if (message.content.senderEmail) {
      name += ` &lt;${message.content.senderEmail}&gt;`;
    }
    
    const toRecipients = new Set(message.content.toRecipients.endsWith('\x00') ? message.content.toRecipients.slice(0, -1).split("; ") : message.content.toRecipients.split("; "));
    const ccRecipients = new Set(message.content.ccRecipients.endsWith('\x00') ? message.content.ccRecipients.slice(0, -1).split("; ") : message.content.ccRecipients.split("; "));

    const to = [];
    const cc = [];
    for (const recipient of message.recipients) {
      if (toRecipients.has(recipient.name)) {
        to.push(recipient);
      } else if (ccRecipients.has(recipient.name)) {
        cc.push(recipient);
      }
    }

    const toModel = to.map(recipient => {
      const r = { name: recipient.name, email: recipient.email ? `&lt;${recipient.email}&gt;` : "" };
      return (recipientHTML as string).replace(/{{(.*?)}}/g, (_m: string, key: string) => {
        return r[key.trim() as keyof typeof r];
      })
    });

    const ccModel = cc.map(recipient => {
      const r = { name: recipient.name, email: recipient.email ? `&lt;${recipient.email}&gt;` : "" };
      return (recipientHTML as string).replace(/{{(.*?)}}/g, (_m: string, key: string) => {
        return r[key.trim() as keyof typeof r];
      })
    });

    const attachments = message.attachments.map(attachment => {
      const a = { name: attachment.displayName, size: niceBytes(attachment.content.byteLength).toString() };
      return (attachmentHTML as string).replace(/{{(.*?)}}/g, (_m: string, key: string) => {
        return a[key.trim() as keyof typeof a];
      });
    });

    const model: MessageViewModel = {
      title: message.content.subject,
      name: name,
      date: message.content.date.toLocaleString('en-US', {
        weekday: "short",
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: "UTC",
        timeZoneName: "short"
      }),
      rawContent: message.content.body,
      toRecipients: toModel.join("; "),
      ccRecipients: ccModel.join("; "),
      attachments: attachments.join("")
    };

    const html = (messageHTML as string).replace(/{{(.*?)}}/g, (_m: string, key: string) => {
      return model[key.trim() as keyof typeof model];
    });

    const $msg = document.getElementById("msg")!;

    // TODO: Add some animation here
    $msg.innerHTML = html;
  }
}

const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
   
function niceBytes(n: number){
  let l = 0;
  while(n >= 1024){
    n = n / 1024;
    l++;
  }
  
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

// Download attachment example: 
/**
 * 
 * const blob = new Blob([message.attachments[0].content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = message.attachments[0].displayName;
  a.click();
 */