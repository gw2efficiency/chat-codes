import { CodeType } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

export function decodeIdLink(type: CodeType, struct: ChatCodeStruct) {
  const id = struct.read3Bytes()
  return { type, id }
}
