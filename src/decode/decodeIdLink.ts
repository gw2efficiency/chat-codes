import { CodeType } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

export function decodeIdLink(
  type: Exclude<CodeType, 'item' | 'objective' | 'build'>,
  struct: ChatCodeStruct,
) {
  const id = struct.read3Bytes()
  return { type, id }
}
