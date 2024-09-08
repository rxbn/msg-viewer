import { ColorFlag } from "./enums/color-flag";
import type { DirectoryEntry } from "./types/directory-entry";
import { ObjectType } from "./enums/object-type";
import type { Header } from "../header";
import { readGUID, sectorOffset } from "../util";

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
      let offset = sectorOffset(sector, header.sectorSize);
  
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
  get(name: string, root: number, deep: boolean): DirectoryEntry | null {
    if (root < 0 || root >= this.entries.length) return null;

    const entry = this.entries[root];
    if (!entry) return null;

    const diff = this.compareName(name, entry.entryName);

    if (diff < 0) {
      const left = this.get(name, entry.leftSiblingId, deep);
      if (left) return left;
    }else if (diff > 0) {
      const right = this.get(name, entry.rightSiblingId, deep);
      if (right) return right;
    } else {
      return entry;
    }

    return deep ? this.get(name, entry.childId, deep) : null;
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
    
    const clsid = readGUID(buffer, offset);
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
    this.traverse((entry, depth) => console.log("\t".repeat(depth), entry.entryName));
  }

  traverse(action: (entry: DirectoryEntry, depth: number) => void) {
    this.traverseFromRoot(0, 0, action);
  }

  private traverseFromRoot(root: number, depth: number, action: (entry: DirectoryEntry, depth: number) => void) {
    if (root < 0 || root >= this.entries.length) return;

    const entry = this.entries[root];
    if (!entry) return;

    this.traverseFromRoot(entry.leftSiblingId, depth, action);
    this.traverseFromRoot(entry.rightSiblingId, depth, action);
    
    action(entry, depth);
    this.traverseFromRoot(entry.childId, depth + 1, action);
  }

  private compareName(name1: string, name2: string) {
    if (name1.length < name2.length) return -1;
    if (name1.length > name2.length) return 1;
    return name1.toUpperCase().localeCompare(name2.toUpperCase());
  }
}