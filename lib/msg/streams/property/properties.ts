export const ROOT_PROPERTIES: Record<number, string> = {
  0x0037: "subject",
  0x0c1a: "senderName",
  0x5d02: "senderEmail",
  0x1000: "body",
  0x1013: "bodyHTML",
  // 0x1009: "bodyRTF",
  0x007d: "headers",
};

export const ATTACH_PROPERTIES = {
  0x3703: "extension",
  0x3704: "fileNameShort",
  0x3707: "fileName",
  0x370e: "mimeType",
};

export const RECIP_PROPERTIES = {
  0x3001: "name",
  0x39fe: "email",
};
