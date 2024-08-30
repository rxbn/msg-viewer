import { ColorFlag } from "./enums/color-flag";
import type { DirectoryEntry } from "./types/directory-entry";
import { ObjectType } from "./enums/object-type";
import type { Header } from "../header";
import { sectorToOffset } from "../util";

export class Directory {
  constructor(
    public readonly entries: DirectoryEntry[], 
    public readonly miniStreamLocations: number[]
  ) {}

  static getDirectory(buffer: Buffer, header: Header, fat: number[]): Directory {
    const entrySize = 128;
    const entriesCount = header.sectorSize / entrySize;
  
    const entries: DirectoryEntry[] = [];
  
    let sector = header.firstDirSectorLocation;
    while (sector < 0xFFFFFFFE) {
      let offset = sectorToOffset(sector, header.sectorSize);
  
      for (let i = 0; i < entriesCount; i++) {
        entries.push(this.directoryEntry(buffer, offset));
        
        offset += entrySize;
      }
  
      sector = fat[sector];
    }
  
    return new Directory(
      entries,
      this.getMiniStreamLocations(entries[0].startingSectorLocation, fat),
    );
  }

  /** 
   * Traverses a Red-Black Tree to find the entry with the given name. 
   */
  getSibling(name: string, root: number): DirectoryEntry | null {
    if (root < 0 || root >= this.entries.length) return null;

    const entry = this.entries[root];
    if (!entry) return null;

    const diff = this.compareName(name, entry.entryName);

    if (diff < 0) return this.getSibling(name, entry.leftSiblingId);
    if (diff > 0) return this.getSibling(name, entry.rightSiblingId);
    return entry;
  }

  private static getMiniStreamLocations(sector: number, fat: number[]): number[] {
    const locations: number[] = [];
  
    while(sector < 0xFFFFFFFE) {
      locations.push(sector);
      sector = fat[sector];
    }
  
    return locations;
  }
  
  private static directoryEntry(buffer: Buffer, offset: number): DirectoryEntry {
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
  
  print() {
    this.traverse(0, 0, (entry, depth) => console.log("\t".repeat(depth), entry.entryName));
  }

  traverse(root: number, depth: number, action: (entry: DirectoryEntry, depth: number) => void) {
    if (root < 0 || root >= this.entries.length) return;

    const entry = this.entries[root];
    if (!entry) return;

    action(entry, depth);

    this.traverse(entry.leftSiblingId, depth, action);
    this.traverse(entry.rightSiblingId, depth, action);
    this.traverse(entry.childId, depth + 1, action);
  }

  private compareName(name1: string, name2: string) {
    if (name1.length < name2.length) return -1;
    if (name1.length > name2.length) return 1;
    return name1.localeCompare(name2);
  }
}