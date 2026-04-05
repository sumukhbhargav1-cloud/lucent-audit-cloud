export const AUDIT_PHOTO_FIELDS = [
  { key: "acRemote", label: "AC Remote" },
  { key: "tvRemote", label: "TV Remote" },
  { key: "setTopBox", label: "Set-top Box" },
  { key: "towelPhoto", label: "Towel Photo" },
  { key: "bathroomPhotos", label: "Bathroom Photos" },
  { key: "kettleTray", label: "Kettle & Tray" },
  { key: "menuCards", label: "Menu Cards" },
] as const;

export type AuditPhotoFieldKey = (typeof AUDIT_PHOTO_FIELDS)[number]["key"];
