import { ChatCodeStruct } from '../ChatCodeStruct'
import { CodeType, TYPE_HEADERS } from '../static'
import { decodeIdLink } from './decodeIdLink'
import { decodeObjectiveLink } from './decodeObjectiveLink'
import { decodeItemLink } from './decodeItemLink'
import { decodeBuildLink } from './decodeBuildLink'

export function decode(chatCode: string) {
  // Check if the chat code matches the basic structure it should have
  if (!chatCode.match(/\[&([a-z\d+/]+=*)]/i)) {
    return false
  }

  // Decode the chat code into a struct
  const struct = new ChatCodeStruct()
  struct.decodeFromChatCode(chatCode)

  // The header describing the type of the chat code is encoded as the first byte
  const typeHeader = struct.read1Byte()
  const codeType = Object.keys(TYPE_HEADERS).find(
    (key) => TYPE_HEADERS[key as CodeType] === typeHeader,
  )

  switch (codeType) {
    case 'map':
    case 'skill':
    case 'trait':
    case 'recipe':
    case 'skin':
    case 'outfit':
      return decodeIdLink(codeType, struct)
    case 'item':
      return decodeItemLink(struct)
    case 'objective':
      return decodeObjectiveLink(struct)
    case 'build':
      return decodeBuildLink(struct)
    default:
      return false
  }
}
