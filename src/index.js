const base64 = require('base64-js')

const codeTypes = {
  item: 0x02,
  map: 0x04,
  skill: 0x06,
  trait: 0x07,
  recipe: 0x09,
  skin: 0x0A,
  outfit: 0x0B
}

function encode (type, id) {
  // Grab the right type id
  type = codeTypeByName(type)
  id = parseInt(id, 10)

  // Make sure the type and id are valid
  if (!type || isNaN(id) || id < 0) {
    return false
  }

  // Encode the ID as a 4-byte little endian integer, then a null byte as terminator
  let data = []
  while (id > 0) {
    data.push(id & 255)
    id = id >> 8
  }

  while (data.length < 4 || data.length % 2 !== 0) {
    data.push(0)
  }

  // The quantity of items is encoded as a single byte before the id bytes
  if (type === 2) {
    data.unshift(1)
  }

  // Add the type header byte at the start of the data
  data.unshift(type)

  // Convert to binary
  let base = base64.fromByteArray(data)

  // Return a chat code
  return '[&' + base + ']'
}

function decode (chatcode) {
  // Check if the chat code matches the basic structure
  if (!chatcode.match(/\[&([a-z\d+\/]+=*)\]/i)) {
    return false
  }

  // Get the encoded data without the chat code stuff
  let base = chatcode.slice(2, chatcode.length - 1)
  let data = base64.toByteArray(base)

  // Get the type key
  let type = codeTypeById(data[0])

  // Invalid type
  if (type === undefined) {
    return false
  }

  // Set the byte offset, which is the header for most types
  // and the header + quantity for item types
  let offset = type === 'item' ? 2 : 1

  // Get the id out of the non-header bytes
  let id = data[offset] | data[offset + 1] << 8 | data[offset + 2] << 16

  // Return the decoded chat code
  return {type: type, id: id}
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

module.exports = {encode, decode}
