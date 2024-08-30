/**** Fixed length ****/
const PtypInteger16: Property = { id: 0x0002, name: "PtypInteger16", size: 2, multi: false }
const PtypInteger32: Property = { id: 0x0003, name: "PtypInteger32", size: 4, multi: false }
const PtypFloating32: Property = { id: 0x0004, name: "PtypFloating32", size: 4, multi: false }
const PtypFloating64: Property = { id: 0x0005, name: "PtypFloating64", size: 8, multi: false }
const PtypBoolean: Property = { id: 0x000B, name: "PtypBoolean", size: 1, multi: false }
const PtypCurrency: Property = { id: 0x0006, name: "PtypCurrency", size: 8, multi: false }
const PtypFloatingTime: Property = { id: 0x0007, name: "PtypFloatingTime", size: 8, multi: false }
const PtypTime: Property = { id: 0x0040, name: "PtypTime", size: 8, multi: false }
const PtypInteger64: Property = { id: 0x0014, name: "PtypInteger64", size: 8, multi: false }
const PtypErrorCode: Property = { id: 0x000A, name: "PtypErrorCode", size: 4, multi: false }

/**** Variable length ****/
// Variable size; a string of Unicode characters in UTF-16LE format encoding with terminating null character (0x0000).
const PtypString: Property = { id: 0x001F, name: "PtypString", multi: false }
// Variable size; a string of multibyte characters in externally specified encoding with terminating null character (single 0 byte).
const PtypString8: Property = { id: 0x001E, name: "PtypString8", multi: false }
// Variable size; a COUNT field followed by that many bytes.
const PtypBinary: Property = { id: 0x0102, name: "PtypBinary", multi: false }
// 16 bytes; a GUID with Data1, Data2, and Data3 fields in little-endian format.
const PtypGuid: Property = { id: 0x0048, name: "PtypGuid", size: 16, multi: false }
// The property value is a Component Object Model (COM) object
const PtypObject: Property = { id: 0x000D, name: "PtypObject", multi: false }

/**** Fixed length Multiple-Valued Properties ****/
const PtypMultipleInteger16: Property = { id: 0x1002, name: "PtypMultipleInteger16", size: 2, multi: true }
const PtypMultipleInteger32: Property = { id: 0x1003, name: "PtypMultipleInteger32", size: 4, multi: true }
const PtypMultipleFloating32: Property = { id: 0x1004, name: "PtypMultipleFloating32", size: 4, multi: true }
const PtypMultipleFloating64: Property = { id: 0x1005, name: "PtypMultipleFloating64", size: 8, multi: true }
const PtypMultipleCurrency: Property = { id: 0x1006, name: "PtypMultipleCurrency", size: 8, multi: true }
const PtypMultipleFloatingTime: Property = { id: 0x1007, name: "PtypMultipleFloatingTime", size: 8, multi: true }
const PtypMultipleTime: Property = { id: 0x1040, name: "PtypMultipleTime", size: 8, multi: true }
const PtypMultipleGuid: Property = { id: 0x1048, name: "PtypMultipleGuid", size: 16, multi: true }
const PtypMultipleInteger64: Property = { id: 0x1014, name: "PtypMultipleInteger64", size: 8, multi: true }

/// Variable Length Multiple-Valued Properties
const PtypMultipleBinary: Property = { id: 0x1102, name: "PtypMultipleBinary", multi: true }
const PtypMultipleString8: Property = { id: 0x101E, name: "PtypMultipleString8", multi: true }
const PtypMultipleString: Property = { id: 0x101F, name: "PtypMultipleString", multi: true }

export const PROPERTY_TYPES = {
  // Fixed length
  [PtypInteger16.id]: PtypInteger16,
  [PtypInteger32.id]: PtypInteger32,
  [PtypFloating32.id]: PtypFloating32,
  [PtypFloating64.id]: PtypFloating64,
  [PtypBoolean.id]: PtypBoolean,
  [PtypCurrency.id]: PtypCurrency,
  [PtypFloatingTime.id]: PtypFloatingTime,
  [PtypTime.id]: PtypTime,
  [PtypInteger64.id]: PtypInteger64,
  [PtypErrorCode.id]: PtypErrorCode,
  
  // Variable length
  [PtypString.id]: PtypString,
  [PtypString8.id]: PtypString8,
  [PtypBinary.id]: PtypBinary,
  [PtypGuid.id]: PtypGuid,
  [PtypObject.id]: PtypObject,

  // Fixed length multivalue
  [PtypMultipleInteger16.id]: PtypMultipleInteger16,
  [PtypMultipleInteger32.id]: PtypMultipleInteger32,
  [PtypMultipleFloating32.id]: PtypMultipleFloating32,
  [PtypMultipleFloating64.id]: PtypMultipleFloating64,
  [PtypMultipleCurrency.id]: PtypMultipleCurrency,
  [PtypMultipleFloatingTime.id]: PtypMultipleFloatingTime,
  [PtypMultipleTime.id]: PtypMultipleTime,
  [PtypMultipleGuid.id]: PtypMultipleGuid,
  [PtypMultipleInteger64.id]: PtypMultipleInteger64,

  // Variable Length Multivalue
  [PtypMultipleBinary.id]: PtypMultipleBinary,
  [PtypMultipleString8.id]: PtypMultipleString8,
  [PtypMultipleString.id]: PtypMultipleString,
};

export interface Property {
  id: number,
  name: string,
  size?: number // in bytes,
  multi: boolean,
}