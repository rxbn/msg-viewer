export function sectorToOffset(sector: number, sectorSize: number): number {
  return (sector + 1) * sectorSize;
}

export function sectorToMiniStreamOffset(sector: number): number {
  return sector * 64;
}
