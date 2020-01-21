import { CodeType, ITEM_FLAGS } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'
import { ItemLinkMeta } from '../encode/encodeItemLink'

// TODO (Review)
export function decodeItemLink(struct: ChatCodeStruct) {
  let decoded: any = { type: 'item' as CodeType } // TODO (Cleanup)

  decoded.quantity = struct.read1Byte()

  // Get the id out of the non-header bytes
  decoded.id = struct.read3Bytes()

  // Read more item details
  const flags = struct.read1Byte()

  // Skin
  if ((flags & ITEM_FLAGS.skin) === ITEM_FLAGS.skin) {
    decoded.skin = struct.read3Bytes()

    // Skip the next byte (always 0x00)
    struct.read1Byte()
  }

  // Upgrade slot 1
  if ((flags & ITEM_FLAGS.upgrade1) === ITEM_FLAGS.upgrade1) {
    decoded.upgrades = [struct.read3Bytes()]

    // Skip the next byte (always 0x00)
    struct.read1Byte()
  }

  // Upgrade slot 2
  if ((flags & ITEM_FLAGS.upgrade2) === ITEM_FLAGS.upgrade2) {
    decoded.upgrades[1] = struct.read3Bytes()
  }

  // TODO Get the types right?
  return {
    // type: 'item',
    // id,
    // skin,
    // upgrades: [upgrade1, upgrade2].filter(Boolean)
  }
}
