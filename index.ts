import { parse } from './lib/msg/msg-parser';

const filePath = (folder: string, type: string) => `resources/${folder}/${Bun.argv[2]}.${type}`;
const file = Bun.file(filePath("inputs", "msg"));

file.arrayBuffer().then((arrayBuffer) => {
  const startTime = performance.now();
  const message = parse(Buffer.from(arrayBuffer));
  console.log(`Took: ${( performance.now() - startTime)} ms`);
  console.log(message);
});