import { CompoundFile } from './lib/compound-file/compound-file'

const filePath = (folder: string) => `resources/${folder}/${Bun.argv[2]}.msg`;
const file = Bun.file(filePath("inputs"));

file.arrayBuffer().then((arrayBuffer) => {
  const buffer = Buffer.from(arrayBuffer);
  const compoundFile = CompoundFile.create(buffer);
  Bun.write(filePath("outputs"), compoundFile.toString());
});
