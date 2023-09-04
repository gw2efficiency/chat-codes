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

  write4Bytes(value: number) {
    this.bytes.push((value >> 0x00) & 0xff)
    this.bytes.push((value >> 0x08) & 0xff)
    this.bytes.push((value >> 0x10) & 0xff)
    this.bytes.push((value >> 0x18) & 0xff)
  }

  writeTraitSelection([trait1, trait2, trait3]: [number, number, number]) {
    const value = ((trait3 & 3) << 4) | ((trait2 & 3) << 2) | ((trait1 & 3) << 0)
    this.write1Byte(value)
  }

  writeDynamicArray(values: number[], bytesPerValue: 2 | 4) {
    this.write1Byte(values.length)
    for (const value of values) {
      bytesPerValue === 2 ? this.write2Bytes(value) : this.write4Bytes(value)
    }
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

  read4Bytes() {
    return (
      this.bytes[this.offset++] |
      (this.bytes[this.offset++] << 8) |
      (this.bytes[this.offset++] << 16) |
      (this.bytes[this.offset++] << 24)
    )
  }

  readTraitSelection(): [number, number, number] {
    return [
      this.bytes[this.offset] & 3,
      (this.bytes[this.offset] >> 2) & 3,
      (this.bytes[this.offset++] >> 4) & 3,
    ]
  }

  readDynamicArray(bytesPerValue: 2 | 4): undefined | number[] {
    const length = this.read1Byte()

    if (length === 0) {
      return undefined
    }

    const values: number[] = []

    for (let i = 0; i < length; i++) {
      values.push(bytesPerValue === 2 ? this.read2Bytes() : this.read4Bytes())
    }

    return values
  }

  atEnd(): boolean {
    return this.offset >= this.bytes.length
  }
}
