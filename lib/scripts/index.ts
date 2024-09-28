import { parse } from "./msg/msg-parser";
import { messageHTML } from "../components/message";

const $file = document.getElementById("file")!;

$file.addEventListener("change", async (event) => {
  const target = event.target as HTMLInputElement;
  if (target?.files?.length === 0) return;
  updateMessage(target.files!);
});


const target = document.documentElement;
target.addEventListener("dragover", (event) => event.preventDefault());
target.addEventListener("drop", (event) => {
  event.preventDefault();
  
  const files = event.dataTransfer!.files;
  if (files.length == 0) return;
  if (!files[0].name.endsWith(".msg")) return;
  
  const $file = document.getElementById("file")! as HTMLInputElement;
  $file.files = files;
  updateMessage(files);
});

async function updateMessage(files: FileList) {
  const arrayBuffer = await files[0].arrayBuffer();
  const message = parse(new DataView(arrayBuffer));

  const $msg = document.getElementById("msg")!;
  $msg.innerHTML = messageHTML(message);
}
