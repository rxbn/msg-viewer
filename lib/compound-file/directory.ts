import { ColorFlag } from "./directory/enums/color-flag";
import type { DirectoryEntry } from "./directory/types/directory-entry";
import { ObjectType } from "./directory/enums/object-type";
import type { Header } from "./header";
import { sectorToOffset } from "./util";

export function getDirectory(buffer: Buffer, header: Header, fat: number[]): Map<string, DirectoryEntry> {
  const entrySize = 128;
  const entriesCount = header.sectorSize / entrySize;

  const entries: Map<string, DirectoryEntry> = new Map();

  let sector = header.firstDirSectorLocation;
  while (sector < 0xFFFFFFFE) {
    let offset = sectorToOffset(sector, header.sectorSize);

    for (let i = 0; i < entriesCount; i++) {
      const entry = directoryEntry(buffer, offset);
      console.log(entry.entryName);
      entries.set(entry.entryName, entry);
      
      offset += entrySize;
      sector = fat[sector];
    }
  }

  return entries;
}

function directoryEntry(buffer: Buffer, offset: number): DirectoryEntry {
  const entryNameLength = buffer.readUInt16LE(offset + 64);
  const entryName = buffer.toString('utf16le', offset, offset + entryNameLength - 1);
  offset += 66;

  const objectType = buffer.readUInt8(offset) as ObjectType;
  offset += 1;

  const colorFlag = buffer.readUInt8(offset) as ColorFlag;
  offset += 1;

  const leftSiblingId = buffer.readUInt32LE(offset);
  offset += 4;

  const rightSiblingId = buffer.readUInt32LE(offset);
  offset += 4;

  const childId = buffer.readUInt32LE(offset);
  offset += 4;
  
  const clsid = [buffer.readUInt32LE(offset), buffer.readUInt16LE(offset + 4), buffer.readUInt16LE(offset + 6), buffer.readBigUInt64LE(offset + 8)];
  offset += 16;

  const stateBits = buffer.readUInt32LE(offset);
  offset += 4;

  const creationTime = buffer.readBigUInt64LE(offset);
  offset += 8;

  const modifiedTime = buffer.readBigUInt64LE(offset);
  offset += 8;

  const startingSectorLocation = buffer.readUInt32LE(offset);
  offset += 4;

  const streamSize = buffer.readBigUInt64LE(offset);
  offset += 8;

  return {
    entryName,
    entryNameLength,
    objectType,
    colorFlag,
    leftSiblingId,
    rightSiblingId,
    childId,
    clsid,
    stateBits,
    creationTime,
    modifiedTime,
    startingSectorLocation,
    streamSize
  }
}