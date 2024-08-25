import type { Header } from "./header";

export interface Difat {
  // FAT Sector Location (variable): This field specifies the FAT sector number in a DIFAT.
  // - If Header Major Version is 3, there MUST be 127 fields specified to fill a 512-byte sector minus the "Next DIFAT Sector Location" field.
  // - If Header Major Version is 4, there MUST be 1,023 fields specified to fill a 4,096-byte sector minus the "Next DIFAT Sector Location" field.
  fatSectorLocation: number[];

  // Next DIFAT Sector Location (4 bytes): This field specifies the next sector number in the DIFAT chain of sectors. The first DIFAT sector is specified in the Header. The last DIFAT sector MUST set this field to ENDOFCHAIN (0xFFFFFFFE).
  nextDifatSectorLocation: number;
}

export function getDifats(header: Header, buffer: Buffer): Difat[] {
  const fatNumber = header.majorVersion == 3 ? 127 : 1023;

  const difatSectors: Difat[] = [];

  let nextDifatSectorLocation = header.firstDifatSectorLocation;
  while (nextDifatSectorLocation != 0xFFFFFFFE) {
    let offset = (nextDifatSectorLocation + 1) * header.sectorSize;
    
    const fatSectorLocation: number[] = [];
    for (let i = 0; i < fatNumber; i++) {
      if (buffer.readUInt32LE(offset) == 0xFFFFFFFF) {
        offset += (fatNumber - i) * 4;
        break;
      }

      fatSectorLocation.push(buffer.readUInt32LE(offset));
      offset += 4;
    }

    nextDifatSectorLocation = buffer.readUInt32LE(offset);
    difatSectors.push({ fatSectorLocation, nextDifatSectorLocation });
  }

  return difatSectors;
}