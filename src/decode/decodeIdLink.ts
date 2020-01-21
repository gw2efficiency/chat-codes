import { CodeType } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

// TODO (Review)
export function decodeIdLink(
  type: CodeType,
  struct: ChatCodeStruct
): { type: CodeType; id: number } {
  const id = struct.read3Bytes()

  return { type, id }
}
