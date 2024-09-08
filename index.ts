import { parse } from "./lib/msg/msg-parser";

const $file = document.querySelector("#file");

$file!.addEventListener("change", async (event) => {
  const target = event.target as HTMLInputElement;
  if (target?.files?.length === 0) return;

  const arrayBuffer = await target.files![0].arrayBuffer();
  const message = parse(new DataView(arrayBuffer));
  console.log(message);
});

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