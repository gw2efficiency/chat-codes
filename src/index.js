import base64 from 'base64-js'
const codeTypes = {
  item: 0x02,
  map: 0x04,
  skill: 0x06,
  trait: 0x07,
  recipe: 0x09,
  skin: 0x0A,
  outfit: 0x0B
}

const itemFlags = {
  skin: 0x80,
  upgrade1: 0x40,
  upgrade2: 0x20
}

export default {encode, decode}

export function encode (type, info) {
  // Get the type
  type = codeTypeByName(type)

  // Normalize the info object if only the id was passed
  if (!info || !info.id) {
    info = {id: info}
  }

  // Grab the right type id
  const id = parseInt(info.id, 10)

  // Make sure the type and id are valid
  if (!type || isNaN(id) || id < 0) {
    return false
  }

  // Add the type header byte at the start of the data
  const data = [type]

  // The quantity of items is encoded as a single byte before the id bytes
  if (type === codeTypes.item) {
    data.push(info.quantity || 1)
  }

  // Encode the ID as a 3-byte little endian integer
  write3Bytes(data, id)

  // Encode item details
  if (type === codeTypes.item) {
    let flags = 0

    // Get the skin and upgrades as integer
    const skin = parseInt(info.skin, 10)
    const upgrade1 = parseInt(info.upgrade1, 10)
    const upgrade2 = parseInt(info.upgrade2, 10)

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
  } else {
    // Add null byte as terminator
    data.push(0x00)
  }

  // Convert to binary
  let base = base64.fromByteArray(data)

  // Return a chat code
  return '[&' + base + ']'
}

export function decode (chatcode) {
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
  const decoded = {
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
  decoded.id = data[offset++] | data[offset++] << 8 | data[offset++] << 16

  // Read more item details
  if (type === codeTypes.item) {
    const flags = data[offset++]

    // Skin
    if ((flags & itemFlags.skin) === itemFlags.skin) {
      decoded.skin = data[offset++] | data[offset++] << 8 | data[offset++] << 16

      // skip next byte (always 0x00)
      offset++
    }

    // Upgrade slot 1
    if ((flags & itemFlags.upgrade1) === itemFlags.upgrade1) {
      decoded.upgrade1 = data[offset++] | data[offset++] << 8 | data[offset++] << 16

      // skip next byte (always 0x00)
      offset++
    }

    // Upgrade slot 2
    if ((flags & itemFlags.upgrade2) === itemFlags.upgrade2) {
      decoded.upgrade2 = data[offset++] | data[offset++] << 8 | data[offset++] << 16

      // skip next byte (always 0x00)
      offset++
    }
  }

  // Return the decoded chat code
  return decoded
}

function write3Bytes (data, value) {
  data.push((value >> 0x00) & 0xFF)
  data.push((value >> 0x08) & 0xFF)
  data.push((value >> 0x10) & 0xFF)
}

function codeTypeByName (name) {
  return codeTypes[name.trim().toLowerCase()]
}

function codeTypeById (id) {
  for (let key in codeTypes) {
    if (codeTypes[key] === id) {
      return key
    }
  }

  return undefined
}
