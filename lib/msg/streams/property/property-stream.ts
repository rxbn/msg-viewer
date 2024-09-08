import type { CompoundFile } from "../../../compound-file/compound-file";
import type { DirectoryEntry } from "../../../compound-file/directory/types/directory-entry";
import { PROPERTY_TYPES } from "./property-types";
import type { PropertyHeader } from "./types/property-header";
import type { PropertyData } from "./types/property-data";
import type { PropertyStreamEntry } from "./types/property-stream-entry";

const STREAM_NAME = "__properties_version1.0";
const DATA_SIZE = 16;

export function getPropertyStreamEntry(file: CompoundFile, folder: DirectoryEntry): PropertyStreamEntry | null {
  const entry = file.directory.get(STREAM_NAME, folder.childId, false);
  if (!entry) return null;

  let header;
  const data: PropertyData[] = [];
  file.readStream(entry,
    (offset) => data.push(getProperty(file.buffer, offset)),
    DATA_SIZE,
    (offset) => {
      header = getHeader(file.buffer, offset, folder.entryName);
      return header.size;
    }
  );

  return { header: header!, data };
}

function getProperty(buffer: Buffer, offset: number): PropertyData {
  const propertyType = PROPERTY_TYPES[buffer.readUInt16LE(offset)];
  offset += 2;

  const propertyId = buffer.readUInt16LE(offset);
  offset += 2;
  
  const flags = buffer.readUInt32LE(offset);
  offset += 4;

  const valueOrSize = (!propertyType?.size || propertyType?.multi)
    ? buffer.readUInt32LE(offset)
    : buffer.toString("hex", offset, offset + propertyType.size);  
  
  return {
    propertyType,
    propertyId,
    flags,  
    valueOrSize
  };
}

function getHeader(buffer: Buffer, offset: number, folderName: string): PropertyHeader {
  if (["__attach", "__recip"].some(v => folderName.startsWith(v))) return { size: 8 };

  const initialOffset = offset;

  // Reserved (8 bytes): This field MUST be set to zero when writing a .msg file and MUST be ignored when reading a .msg file.
  offset += 8;

  const nextRecipientId = buffer.readUInt32LE(offset);
  offset += 4;

  const nextAttachmentId = buffer.readUInt32LE(offset)
  offset += 4;

  const recipientCount = buffer.readUInt32LE(offset);
  offset += 4;

  const attachmentCount = buffer.readUInt32LE(offset)
  offset += 4;
  
  if (folderName.startsWith("Root")) {
    // Reserved (8 bytes): This field MUST be set to 0 when writing a .msg file and MUST be ignored when reading a .msg file.
    offset += 8;
  }
  

  return { size: offset - initialOffset, nextRecipientId, nextAttachmentId, recipientCount, attachmentCount };
}

