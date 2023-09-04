import { ChatCodeStruct } from '../ChatCodeStruct'

export function decodeObjectiveLink(struct: ChatCodeStruct) {
  const id = struct.read3Bytes()
  struct.read1Byte() // Skip the next byte (always 0x00)
  const map = struct.read3Bytes()

  return { type: 'objective' as const, id: `${map}-${id}` }
}
