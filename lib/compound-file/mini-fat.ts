import type { Header } from "./header";
import { sectorToOffset } from "./util";

/**
 * The mini FAT is used to allocate space in the mini stream. The mini stream is divided into smaller,
 * equal-length sectors, and the sector size that is used for the mini stream is specified from the
 * Compound File Header (64 bytes).
 */
export function getMiniFat(buffer: Buffer, header: Header, fat: number[]): number[] {   
  const entrySize = header.miniSectorSize / 4;

  const miniFat = [];
    
  let sector = header.firstMiniFatSectorLocation;
  while (sector < 0xFFFFFFFE) {
    let offset = sectorToOffset(sector, header.sectorSize);
    for (let i = 0; i < entrySize; i++) {
      miniFat.push(buffer.readUInt32LE(offset));
      offset += 4;
    }

    sector = fat[sector];
  }

  return miniFat;
}