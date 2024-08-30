import type { CompoundFile } from "../../../compound-file/compound-file";
import { readGUID } from "../../../compound-file/util";

const GUID_SIZE = 16;

export function getGUIDs(file: CompoundFile): string[] {
  const nameIdEntry = file.directory.get("__nameid_version1.0", file.directory.entries[0].childId);
  const entry = file.directory.get("__substg1.0_00020102", nameIdEntry!.childId)!;

  const guids: string[] = [];

  file.readStream(entry, (sectorSize, offset) => {
    const count = sectorSize / GUID_SIZE;
    for (let i = 0; i < count; i++) {
      guids.push(readGUID(file.buffer, offset));
      offset += GUID_SIZE;
    }
  });

  return guids;
}