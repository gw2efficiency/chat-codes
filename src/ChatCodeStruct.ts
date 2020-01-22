import base64 from 'base64-js'

export class ChatCodeStruct {
  private bytes: Array<number> = []
  private offset: number = 0

  // -- ENCODING --

  encodeToChatCode() {
    // Convert to a base64 encoded string
    const base64String = base64.fromByteArray(Uint8Array.from(this.bytes))

    // Return in the chat code enclosure
    return '[&' + base64String + ']'
  }

  write1Byte(value: number) {
    this.bytes.push(value)
  }

  write2Bytes(value: number) {
    this.bytes.push((value >> 0x00) & 0xff)
    this.bytes.push((value >> 0x08) & 0xff)
  }

  write3Bytes(value: number) {
    this.bytes.push((value >> 0x00) & 0xff)
    this.bytes.push((value >> 0x08) & 0xff)
    this.bytes.push((value >> 0x10) & 0xff)
  }

  writeTraitSelection([trait1, trait2, trait3]: Array<number>) {
    const value = ((trait3 & 3) << 4) | ((trait2 & 3) << 2) | ((trait1 & 3) << 0)
    this.write1Byte(value)
  }

  // -- DECODING --

  decodeFromChatCode(chatCode: string) {
    // Remove the chat code enclosure
    const base64String = chatCode.slice(2, chatCode.length - 1)

    // Convert into a byte array
    this.bytes = Array.from(base64.toByteArray(base64String))
  }

  read1Byte() {
    return this.bytes[this.offset++]
  }

  read2Bytes() {
    return this.bytes[this.offset++] | (this.bytes[this.offset++] << 8)
  }

  read3Bytes() {
    return (
      this.bytes[this.offset++] |
      (this.bytes[this.offset++] << 8) |
      (this.bytes[this.offset++] << 16)
    )
  }

  readTraitSelection(): Array<number> {
    return [
      this.bytes[this.offset] & 3,
      (this.bytes[this.offset] >> 2) & 3,
      (this.bytes[this.offset++] >> 4) & 3
    ]
  }
}
