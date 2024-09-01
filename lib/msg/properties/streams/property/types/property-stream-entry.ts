import type { PropertyHeader } from "./property-header";
import type { PropertyData } from "./property-data";

export interface PropertyStreamEntry {
  header: PropertyHeader,
  data: PropertyData[]
}