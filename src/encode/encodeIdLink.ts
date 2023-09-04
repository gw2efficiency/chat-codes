import { ChatCodeStruct } from '../ChatCodeStruct'

export type IdLinkMeta = { id: number }

export function encodeIdLink(typeHeader: number, meta: IdLinkMeta) {
  // Make sure the ID is valid
  const id = parseInt('' + meta.id, 10)
  if (isNaN(id) || id < 0) return false

  const struct = new ChatCodeStruct()

  // Add the header describing the type of the chat code
  struct.write1Byte(typeHeader)

  // Encode the ID as a 3-byte little endian integer
  struct.write3Bytes(id)

  // Add null byte as terminator
  struct.write1Byte(0x00)

  return struct.encodeToChatCode()
}
