import { getDifat } from "./difat";
import { Directory } from "./directory/directory";
import type { DirectoryEntry } from "./directory/types/directory-entry";
import { getFat } from "./fat";
import { getHeader, type Header } from "./header";
import { getMiniFat } from "./mini-fat";
import { streamSectorOffset } from "./util";

export class CompoundFile {
  constructor(
    public readonly buffer: Buffer, 
    public readonly header: Header,
    public readonly difat: number[],
    public readonly fat: number[],
    public readonly miniFat: number[],
    public readonly directory: Directory,
  ) {}
  
  static create(buffer: Buffer) {
    const header = getHeader(buffer);
    const difat = getDifat(buffer, header);
    const fat = getFat(buffer, header, difat);
    const miniFat = getMiniFat(buffer, header, fat);
    const directory = Directory.getDirectory(buffer, header, fat);
    return new CompoundFile(buffer, header, difat, fat, miniFat, directory);
  }

  readStream<THeader, TDataEntry>(
    entry: DirectoryEntry, 
    getDataAction: (offset: number) => [TDataEntry, number], 
    getHeaderAction?: (offset: number) => [THeader, number]
  ): [THeader | undefined, TDataEntry[]] {
    let sectorSize = this.header.sectorSize;
    let fat = this.fat;
    
    if (entry.streamSize < this.header.miniStreamCutOffSize) {
      sectorSize = this.header.miniSectorSize;
      fat = this.miniFat;
    }

    let sector = entry.startingSectorLocation;
    if (sector >= 0xFFFFFFFE) return [undefined, []];
  
    let offset = streamSectorOffset(sector, this.header, entry.streamSize, this.directory.miniStreamLocations);
    let initialOffset = offset;

    const [header, headerSize] = getHeaderAction ? getHeaderAction(offset) : [undefined, 0];
    offset += headerSize;

    const entriesCount = (entry.streamSize - BigInt(headerSize)) / BigInt(sectorSize);

    const data: TDataEntry[] = [];
    for (let i = 0; i < entriesCount; i++) {
      if (offset - initialOffset >= sectorSize) {
        sector = fat[sector];
        if (sector >= 0xFFFFFFFE) break;
  
        offset = streamSectorOffset(sector, this.header, entry.streamSize, this.directory.miniStreamLocations);
        initialOffset = offset;
      }
  
      const [dataEntry, size] = getDataAction(offset);
      data.push(dataEntry);
      offset += size;
    }

    return [header, data];
  }

  toString(): string {
    const obj = { 
      header: this.header, 
      difat: this.difat, 
      fat: this.fat, 
      miniFat: 
      this.miniFat, 
      directory: 
      this.directory 
    };
    
    return JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, "\t");
  }
}