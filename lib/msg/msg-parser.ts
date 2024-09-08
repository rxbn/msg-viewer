import { CompoundFile } from "../compound-file/compound-file";
import type { DirectoryEntry } from "../compound-file/directory/types/directory-entry";
import { ATTACH_PROPERTIES, RECIP_PROPERTIES, ROOT_PROPERTIES, type Property } from "./streams/property/properties";
import { PtypBinary, PtypString, type PropertyType } from "./streams/property/property-types";
import type { Attachment, Message, MessageContent, Recipient } from "./types/message";

export function parse(buffer: Buffer): Message {
  const file = CompoundFile.create(buffer);
  return { 
    content: getContent(file), 
    attachments: getAttachments(file), 
    recipients: getRecipients(file),
  };
}

function getContent(file: CompoundFile): MessageContent {
  return getValue(file, ROOT_PROPERTIES, file.directory.entries[0]);
}

function getRecipients(file: CompoundFile): Recipient[] {
  return getValues(file, RECIP_PROPERTIES, "recip");
}

function getAttachments(file: CompoundFile): Attachment[] {
  return getValues(file, ATTACH_PROPERTIES, "attach");
}

function getValues<T>(file: CompoundFile, properties: Property[], prefix: string): T[] {
  const list: T[] = [];

  for (let i = 0; i < 2048; i++) {
    const directory = file.directory.get(`__${prefix}_version1.0_#${i.toString(16).padStart(8, "0")}`, file.directory.entries[0].childId, false);
    if (!directory) break;
    list.push(getValue(file, properties, directory));
  }

  return list;
}

function getValue<T>(file: CompoundFile, properties: Property[], dir: DirectoryEntry): T {
  return properties.reduce((acc, p) => {
    const streamName = `__substg1.0_${p.id.padStart(4, "0")}${p.type.id.toString(16).padStart(4, "0")}`;
    const entry = file.directory.get(streamName, dir.childId, false);
    if (!entry) return acc;

    acc[p.name as keyof T] = getValueForType(file, entry, p.type) as T[keyof T];

    return acc;
  }, {} as T);
}

function getValueForType(file: CompoundFile, entry: DirectoryEntry, type: PropertyType)  {
  switch (type) {
    case PtypString: {
      let value = "";
      file.readStream(entry, (offset, bytes) => value += file.buffer.toString("utf16le", offset, offset + bytes));
      return value;
    };
    case PtypBinary: {
      const chunks: Buffer[] = [];
      file.readStream(entry, (offset, bytes) => chunks.push(file.buffer.subarray(offset, offset + bytes)));
      return Buffer.concat(chunks);
    };
    default: return null;
  };
}
