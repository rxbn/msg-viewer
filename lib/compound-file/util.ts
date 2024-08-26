import type { Header } from "./header";

export function sectorToOffset(sector: number, sectorSize: number): number {
  return (sector + 1) * sectorSize;
}

export function sectorToMiniStreamOffset(sector: number): number {
  return sector * 64;
}

export function fatSectorSize(header: Header) {
  // If Header Major Version is 3, there MUST be 128 fields specified to fill a 512-byte sector.
  // If Header Major Version is 4, there MUST be 1,024 fields specified to fill a 4,096-byte sector.
  return header.majorVersion == 3 ? 128 : 1024;
}
