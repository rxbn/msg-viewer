import { PtypBinary, PtypString, type PropertyType } from "./property-types";

export const ROOT_PROPERTIES: Property[] = [
  { id: "0037", name:"subject", type: PtypString, },
  { id: "0c1a", name:"senderName", type: PtypString, },
  { id: "5d02", name:"senderEmail", type: PtypString, },
  { id: "1000", name:"body", type: PtypString, },
  { id: "1013", name:"bodyHTML", type: PtypString, },
  { id: "1009", name:"bodyRTF", type: PtypBinary, },
  { id: "007d", name:"headers", type: PtypString, },
];

export const ATTACH_PROPERTIES: Property[]= [
  { id: "3703", name:"extension", type: PtypString, },
  { id: "3707", name:"fileName", type: PtypString, },
  { id: "370e", name:"mimeType", type: PtypString, },
  { id: "3A0C", name:"language", type: PtypString, },
  { id: "3001", name:"displayName", type: PtypString, },
  { id: "3701", name:"content", type: PtypBinary, },
];

export const RECIP_PROPERTIES: Property[] = [
  { id: "3001", name:"name", type: PtypString, },
  { id: "39fe", name:"email", type: PtypString, },
];

export interface Property {
  id: string,
  name: string,
  type: PropertyType
}
