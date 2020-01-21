import { CodeType } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'
import { ObjectiveLinkMeta } from '../encode/encodeObjectiveLink'

// TODO (Review)
export function decodeObjectiveLink(struct: ChatCodeStruct) {
  let x: any = { type: 'objective' as CodeType } // TODO (Cleanup)

  const id = struct.read3Bytes()

  // skip next byte (always 0x00)
  struct.read1Byte()

  const map = struct.read3Bytes()

  x.id = map + '-' + id

  return x as Required<ObjectiveLinkMeta>
}
