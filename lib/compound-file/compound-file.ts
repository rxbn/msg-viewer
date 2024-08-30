import { getDifat } from "./difat";
import { Directory } from "./directory/directory";
import { getFat } from "./fat";
import { getHeader, type Header } from "./header";
import { getMiniFat } from "./mini-fat";

export class CompoundFile {
  constructor(
    public readonly buffer: Buffer, 
    public readonly header: Header,
    public readonly difat: number[],
    public readonly fat: number[],
    public readonly miniFat: number[],
    public readonly directory: Directory,
  ) {}
  
  static create(buffer: Buffer) {
    const header = getHeader(buffer);
    const difat = getDifat(buffer, header);
    const fat = getFat(buffer, header, difat);
    const miniFat = getMiniFat(buffer, header, fat);
    const directory = Directory.getDirectory(buffer, header, fat);
    return new CompoundFile(buffer, header, difat, fat, miniFat, directory);
  }

  toString(): string {
    const obj = { 
      header: this.header, 
      difat: this.difat, 
      fat: this.fat, 
      miniFat: 
      this.miniFat, 
      directory: 
      this.directory 
    };
    
    return JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, "\t");
  }
}