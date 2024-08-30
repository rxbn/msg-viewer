import { CompoundFile } from './lib/compound-file/compound-file'
import { getGUIDs } from './lib/msg/properties/streams/guid-stream';

const filePath = (folder: string) => `resources/${folder}/${Bun.argv[2]}.msg`;
const file = Bun.file(filePath("inputs"));

file.arrayBuffer().then((arrayBuffer) => {
  const buffer = Buffer.from(arrayBuffer);
  const compoundFile = CompoundFile.create(buffer);
  Bun.write(filePath("outputs"), compoundFile.toString());

  const guids = getGUIDs(compoundFile);
  console.log("guids", guids)
});
