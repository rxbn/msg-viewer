import { parse } from './lib/msg/msg-parser';

const filePath = (folder: string, type: string) => `resources/${folder}/${Bun.argv[2]}.${type}`;
const file = Bun.file(filePath("inputs", "msg"));

file.arrayBuffer().then((arrayBuffer) => {
  const startTime = performance.now();
  const message = parse(Buffer.from(arrayBuffer));
  Bun.write(filePath("outputs", "json"), JSON.stringify(message, null, "  "));
  console.log(`Took: ${( performance.now() - startTime)} ms`);
});
