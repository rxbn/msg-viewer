import type { Header } from "./header";
import { sectorToOffset } from "./util";

/**
 * The FAT is an array of sector numbers that represent the allocation of space within the file, grouped
 * into FAT sectors. Each stream is represented in the FAT by a sector chain, in much the same fashion 
 * as a FAT file system.
 */
export function getFat(buffer: Buffer, header: Header, difat: number[]): number[] {
  // If Header Major Version is 3, there MUST be 128 fields specified to fill a 512-byte sector.
  // If Header Major Version is 4, there MUST be 1,024 fields specified to fill a 4,096-byte sector.
  const fatSectorSize = header.majorVersion == 3 ? 128 : 1024;

  const fat: number[] = [];
  for (let i = 0; i < difat.length; i++) {
    let offset = sectorToOffset(difat[i], header.sectorSize);
    
    for (let j = 0; j < fatSectorSize; j++) {
      const nextSector = buffer.readUInt32LE(offset);
      fat.push(nextSector);
      offset += 4;
    }
  }

  return fat;
}