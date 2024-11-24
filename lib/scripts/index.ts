import { messageHTML } from "../components/message";
import { errorHTML } from "../components/error";
import { parse } from "@molotochok/msg-viewer";

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
  const $msg = document.getElementById("msg")!;
  let html = "";

  try {
    const message = parse(new DataView(arrayBuffer));
    html = messageHTML(message);
  } catch (e) {
    html = errorHTML(`An error occured during the parsing of the .msg file. Error: ${e}`);
  }

  $msg.innerHTML = html;
}
