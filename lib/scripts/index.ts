import { parse } from "./msg/msg-parser";

import emailHTML from "../components/message/index.html" with { type: "text" };

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
  ccRecipients: string
}


async function handleFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const arrayBuffer = await files[i].arrayBuffer();
    const message = parse(new DataView(arrayBuffer));

    let name = message.content.senderName ?? "";
    if (message.content.senderEmail) {
      name += ` &lt;${message.content.senderEmail}&gt;`;
    }

    const model: MessageViewModel = {
      title: message.content.subject,
      name: name,
      date: "04/03/2024 09:23",
      rawContent: message.content.body,
      toRecipients: "<span> First Name Last Name </span>",
      ccRecipients: "<span> First Name Last Name </span>"
    }

    const html = (emailHTML as string).replace(/{{(.*?)}}/g, (_m: string, key: string) => {
      return model[key.trim() as keyof typeof model];
    });

    const $msg = document.getElementById("msg")!;

    // TODO: Add some animation here
    $msg.innerHTML = html;
  }
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