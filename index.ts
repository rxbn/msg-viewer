import { CompoundFile } from './lib/compound-file/compound-file'

const file = Bun.file(`resources/inputs/${Bun.argv[2]}.msg`);

file.arrayBuffer().then((arrayBuffer) => {
  const buffer = Buffer.from(arrayBuffer);
  const compoundFile = CompoundFile.create(buffer);
  Bun.write("resources/outputs/out.json", compoundFile.toString());
});
