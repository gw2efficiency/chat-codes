import { ITEM_FLAGS, TYPE_HEADERS } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

export type ItemLinkMeta = {
  id?: string | number
  quantity?: number
  skin?: string | number
  upgrades?: Array<string | number>
}

// TODO (Review)
export function encodeItemLink(meta: ItemLinkMeta): string | false {
  const id = parseInt(meta.id as string, 10)

  // Make sure the type and id are valid
  if (isNaN(id) || id < 0) {
    return false
  }

  const struct = new ChatCodeStruct()

  // Add the header describing the type of the link
  struct.write1Byte(TYPE_HEADERS.item)

  // The quantity of items is encoded as a single byte before the ID
  struct.write1Byte(meta.quantity || 1)

  // Encode the ID as a 3-byte little endian integer
  struct.write3Bytes(id)

  // Encode item details
  let flags = 0

  // Get the skin and upgrades as integer
  const skin = parseInt(meta.skin as string, 10)
  const upgrade1 = meta.upgrades && parseInt(meta.upgrades[0] as string, 10)
  const upgrade2 = meta.upgrades && parseInt(meta.upgrades[1] as string, 10)

  // Check which flags should be set
  const hasSkin = !isNaN(skin)
  const hasUpgrade1 = upgrade1 && !isNaN(upgrade1)
  const hasUpgrade2 = upgrade2 && !isNaN(upgrade2)

  // Add the flags
  if (hasSkin) {
    flags |= ITEM_FLAGS.skin
  }

  if (hasUpgrade1) {
    flags |= ITEM_FLAGS.upgrade1
  }

  if (hasUpgrade2) {
    flags |= ITEM_FLAGS.upgrade2
  }

  // Encode the flags
  struct.write1Byte(flags)

  // Encode the skin id
  if (hasSkin) {
    struct.write3Bytes(skin)
    struct.write1Byte(0x00)
  }

  // Encode the first upgrade slot
  if (hasUpgrade1) {
    struct.write3Bytes(upgrade1 as number) // TODO: Function with is number id check
    struct.write1Byte(0x00)
  }

  // Encode the second upgrade slot
  if (hasUpgrade2) {
    struct.write3Bytes(upgrade2 as number) // TODO: Function with is number id check
    struct.write1Byte(0x00)
  }

  return struct.encodeToChatCode()
}
