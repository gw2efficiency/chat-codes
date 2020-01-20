import base64 from 'base64-js'

type TODO = any // TODO (Cleanup) Replace with real types

const codeTypes: { [key: string]: number } = {
  item: 0x02,
  map: 0x04,
  skill: 0x06,
  trait: 0x07,
  recipe: 0x09,
  skin: 0x0a,
  outfit: 0x0b,
  objective: 0x0c,
  build: 0x0d
}

const itemFlags: { [key: string]: number } = {
  skin: 0x80,
  upgrade1: 0x40,
  upgrade2: 0x20
}

export default { encode, decode }

export function encode(type: TODO, info: TODO) {
  // Grab the right type id
  type = codeTypeByName(type)

  // Normalize the info object if only the id was passed
  if ((!info || !info.id) && type !== codeTypes.build) {
    info = { id: info }
  }

  if (type === codeTypes.objective) {
    const objectiveIdMatch = ('' + info.id).match(/^(\d+)-(\d+)$/)

    if (!objectiveIdMatch) {
      return false
    }

    info.id = objectiveIdMatch[2]
    info.map = parseInt(objectiveIdMatch[1], 10)
  }

  const id = parseInt(info.id, 10)

  // Make sure the type and id are valid
  if (!type || ((isNaN(id) || id < 0) && type !== codeTypes.build)) {
    return false
  }

  // Add the type header byte at the start of the data
  const data = [type]

  // The quantity of items is encoded as a single byte before the id bytes
  if (type === codeTypes.item) {
    data.push(info.quantity || 1)
  }

  // Encode the ID as a 3-byte little endian integer
  if (type !== codeTypes.build) {
    write3Bytes(data, id)
  }

  // Encode item details
  if (type === codeTypes.item) {
    let flags = 0

    // Get the skin and upgrades as integer
    const skin = parseInt(info.skin, 10)
    const upgrade1 = info.upgrades && parseInt(info.upgrades[0], 10)
    const upgrade2 = info.upgrades && parseInt(info.upgrades[1], 10)

    // Check which flags should be set
    const hasSkin = !isNaN(skin)
    const hasUpgrade1 = !isNaN(upgrade1)
    const hasUpgrade2 = !isNaN(upgrade2)

    // Add the flags
    if (hasSkin) {
      flags |= itemFlags.skin
    }

    if (hasUpgrade1) {
      flags |= itemFlags.upgrade1
    }

    if (hasUpgrade2) {
      flags |= itemFlags.upgrade2
    }

    // Encode the flags
    data.push(flags)

    // Encode the skin id
    if (hasSkin) {
      write3Bytes(data, skin)
      data.push(0x00)
    }

    // Encode the first upgrade slot
    if (hasUpgrade1) {
      write3Bytes(data, upgrade1)
      data.push(0x00)
    }

    // Encode the second upgrade slot
    if (hasUpgrade2) {
      write3Bytes(data, upgrade2)
      data.push(0x00)
    }
  } else if (type === codeTypes.objective) {
    data.push(0x00)
    write3Bytes(data, info.map)
    data.push(0x00)
  } else if (type === codeTypes.build) {
    data.push(info.profession)

    data.push(info.specializationId1)
    writeTraitSelection(data, info.traitChoices1)
    data.push(info.specializationId2)
    writeTraitSelection(data, info.traitChoices2)
    data.push(info.specializationId3)
    writeTraitSelection(data, info.traitChoices3)

    write2Bytes(data, info.terrestrialHealSkill)
    write2Bytes(data, info.aquaticHealSkill)
    write2Bytes(data, info.terrestrialUtilitySkill1)
    write2Bytes(data, info.aquaticUtilitySkill1)
    write2Bytes(data, info.terrestrialUtilitySkill2)
    write2Bytes(data, info.aquaticUtilitySkill2)
    write2Bytes(data, info.terrestrialUtilitySkill3)
    write2Bytes(data, info.aquaticUtilitySkill3)
    write2Bytes(data, info.terrestrialEliteSkill)
    write2Bytes(data, info.aquaticEliteSkill)

    if (info.profession === 0x04) {
      // Ranger
      data.push(info.terrestrialPet1)
      data.push(info.terrestrialPet2)
      data.push(info.aquaticPet1)
      data.push(info.aquaticPet2)

      // 0 bytes used for revenant
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
    } else if (info.profession === 0x09) {
      // Revenant
      data.push(info.terrestrialLegend1)
      data.push(info.terrestrialLegend2)
      data.push(info.aquaticLegend1)
      data.push(info.aquaticLegend2)

      // TODO (Feature) We could also encode the inactive legends but not in the API
      //  so we just default to the default sort order by 0-ing them.
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
    } else {
      // 0 bytes used for ranger / revenant
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)

      // 0 bytes used for revenant
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
      write2Bytes(data, 0x00)
    }
  } else {
    // Add null byte as terminator
    data.push(0x00)
  }

  // Convert to binary
  let base = base64.fromByteArray(Uint8Array.from(data))

  // Return a chat code
  return '[&' + base + ']'
}

export function decode(chatcode: string) {
  // Check if the chat code matches the basic structure
  if (!chatcode.match(/\[&([a-z\d+/]+=*)]/i)) {
    return false
  }

  // Get the encoded data without the chat code stuff
  let base = chatcode.slice(2, chatcode.length - 1)
  let data = base64.toByteArray(base)

  // Pointer to the current byte we are reading
  let offset = 0

  // Get the type
  const type = data[offset++]

  // Object with decoded data
  const decoded: TODO = {
    type: codeTypeById(type)
  }

  // Invalid type
  if (decoded.type === undefined) {
    return false
  }

  // Read the quantity for items
  if (type === codeTypes.item) {
    decoded.quantity = data[offset++]
  }

  // Get the id out of the non-header bytes
  if (type !== codeTypes.build) {
    decoded.id = data[offset++] | (data[offset++] << 8) | (data[offset++] << 16)
  }

  // Read more item details
  if (type === codeTypes.item) {
    const flags = data[offset++]

    // Skin
    if ((flags & itemFlags.skin) === itemFlags.skin) {
      decoded.skin =
        data[offset++] | (data[offset++] << 8) | (data[offset++] << 16)

      // skip next byte (always 0x00)
      offset++
    }

    // Upgrade slot 1
    if ((flags & itemFlags.upgrade1) === itemFlags.upgrade1) {
      decoded.upgrades = [
        data[offset++] | (data[offset++] << 8) | (data[offset++] << 16)
      ]

      // skip next byte (always 0x00)
      offset++
    }

    // Upgrade slot 2
    if ((flags & itemFlags.upgrade2) === itemFlags.upgrade2) {
      decoded.upgrades[1] =
        data[offset++] | (data[offset++] << 8) | (data[offset++] << 16)
    }
  } else if (type === codeTypes.objective) {
    offset++

    decoded.id =
      (data[offset++] | (data[offset++] << 8) | (data[offset++] << 16)) +
      '-' +
      decoded.id
  } else if (type === codeTypes.build) {
    decoded.profession = data[offset++]

    decoded.specializationId1 = data[offset++]
    decoded.traitChoices1 = [
      data[offset] & 3,
      (data[offset] >> 2) & 3,
      (data[offset++] >> 4) & 3
    ]
    decoded.specializationId2 = data[offset++]
    decoded.traitChoices2 = [
      data[offset] & 3,
      (data[offset] >> 2) & 3,
      (data[offset++] >> 4) & 3
    ]
    decoded.specializationId3 = data[offset++]
    decoded.traitChoices3 = [
      data[offset] & 3,
      (data[offset] >> 2) & 3,
      (data[offset++] >> 4) & 3
    ]

    decoded.terrestrialHealSkill = data[offset++] | (data[offset++] << 8)
    decoded.aquaticHealSkill = data[offset++] | (data[offset++] << 8)
    decoded.terrestrialUtilitySkill1 = data[offset++] | (data[offset++] << 8)
    decoded.aquaticUtilitySkill1 = data[offset++] | (data[offset++] << 8)
    decoded.terrestrialUtilitySkill2 = data[offset++] | (data[offset++] << 8)
    decoded.aquaticUtilitySkill2 = data[offset++] | (data[offset++] << 8)
    decoded.terrestrialUtilitySkill3 = data[offset++] | (data[offset++] << 8)
    decoded.aquaticUtilitySkill3 = data[offset++] | (data[offset++] << 8)
    decoded.terrestrialEliteSkill = data[offset++] | (data[offset++] << 8)
    decoded.aquaticEliteSkill = data[offset++] | (data[offset++] << 8)

    if (decoded.profession === 0x04) {
      // Ranger
      decoded.terrestrialPet1 = data[offset++]
      decoded.terrestrialPet2 = data[offset++]
      decoded.aquaticPet1 = data[offset++]
      decoded.aquaticPet2 = data[offset++]
    } else if (decoded.profession === 0x09) {
      // Revenant
      decoded.terrestrialLegend1 = data[offset++]
      decoded.terrestrialLegend2 = data[offset++]
      decoded.aquaticLegend1 = data[offset++]
      decoded.aquaticLegend2 = data[offset++]
    }
  }

  // Return the decoded chat code
  return decoded
}

function write2Bytes(data: Array<number>, value: number) {
  data.push((value >> 0x00) & 0xff)
  data.push((value >> 0x08) & 0xff)
}

function write3Bytes(data: Array<number>, value: number) {
  data.push((value >> 0x00) & 0xff)
  data.push((value >> 0x08) & 0xff)
  data.push((value >> 0x10) & 0xff)
}

function writeTraitSelection(
  data: Array<number>,
  [trait1, trait2, trait3]: [number, number, number]
) {
  const value = ((trait3 & 3) << 4) | ((trait2 & 3) << 2) | ((trait1 & 3) << 0)
  data.push(value)
}

function codeTypeByName(name: string) {
  return codeTypes[name.trim().toLowerCase()]
}

function codeTypeById(id: number) {
  for (let key in codeTypes) {
    if (codeTypes[key] === id) {
      return key
    }
  }

  return undefined
}
