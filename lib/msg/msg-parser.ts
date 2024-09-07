import { CompoundFile } from "../compound-file/compound-file";
import { ROOT_PROPERTIES } from "./streams/property/properties";
import { getPropertyStreamEntry } from "./streams/property/property-stream";
import type { Message, MessageContent } from "./types/message";

export function parse(buffer: Buffer): Message {
  const file = CompoundFile.create(buffer);
  const rootProperties = getPropertyStreamEntry(file, file.directory.entries[0]);

  const content = rootProperties!.data.reduce((acc, data) => {
    const propertyName = ROOT_PROPERTIES[data.propertyId];
    if (!propertyName) return acc;

    const streamName = "__substg1.0_" + data.propertyId.toString(16).padStart(4, "0") + data.propertyType.id.toString(16).padStart(4, "0");
    const entry = file.directory.get(streamName, file.directory.entries[0].childId);
    if (!entry) return acc;

    let propertyValue = "";
    file.readStream(entry, (offset, bytes) => {
      propertyValue += file.buffer.toString("utf16le", offset, offset + bytes);
    });

    acc[propertyName as keyof MessageContent] = propertyValue;

    return acc;
  }, {} as MessageContent);

  return { content: content, attachments: [], recipients: [] };
}