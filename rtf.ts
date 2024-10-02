import * as fs from "fs/promises";
import { decompressRTF } from "./lib/scripts/msg/rtf/rtf-decompressor";

const buffer = await fs.readFile("./resources/rtf/deals.rtf");
const rtf = decompressRTF(new DataView(buffer.buffer));
console.log(rtf);