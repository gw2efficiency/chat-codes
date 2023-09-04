import { TYPE_HEADERS } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

export type ObjectiveLinkMeta = { id: string }

export function encodeObjectiveLink(meta: ObjectiveLinkMeta) {
  // Parse the objective ID and make sure the IDs are valid
  const objectiveIdSplit = ('' + meta.id).split('-')

  const map = parseInt(objectiveIdSplit[0])
  const id = parseInt(objectiveIdSplit[1])

  if (isNaN(map) || map < 0) return false
  if (isNaN(id) || id < 0) return false

  const struct = new ChatCodeStruct()

  // Add the header describing the type of the chat code
  struct.write1Byte(TYPE_HEADERS.objective)

  // Encode the objective identifier
  struct.write3Bytes(id)
  struct.write1Byte(0x00)

  // Encode the wvw map identifier
  struct.write3Bytes(map)
  struct.write1Byte(0x00)

  return struct.encodeToChatCode()
}
