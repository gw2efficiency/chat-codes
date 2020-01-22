import { CodeType, ITEM_FLAGS } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

export function decodeItemLink(struct: ChatCodeStruct) {
  const type = 'item' as CodeType

  const quantity = struct.read1Byte()
  const id = struct.read3Bytes()
  const flags = struct.read1Byte()

  // Skin
  let skin
  if (hasFlag(flags, ITEM_FLAGS.skin)) {
    skin = struct.read3Bytes()
    struct.read1Byte() // Skip the next byte (always 0x00)
  }

  // Upgrade slot 1
  let upgrades
  if (hasFlag(flags, ITEM_FLAGS.upgrade1)) {
    upgrades = [struct.read3Bytes()]
    struct.read1Byte() // Skip the next byte (always 0x00)
  }

  // Upgrade slot 2
  if (hasFlag(flags, ITEM_FLAGS.upgrade2)) {
    ;(upgrades as Array<number>).push(struct.read3Bytes())
  }

  return { type, quantity, id, skin, upgrades }
}

function hasFlag(flags: number, flag: number) {
  return (flags & flag) === flag
}
