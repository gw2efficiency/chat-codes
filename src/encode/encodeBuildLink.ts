import { PROFESSION_FLAGS, TYPE_HEADERS } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

export type BuildLinkMeta = {
  profession: number

  specialization1: number
  traitChoices1: [number, number, number]
  specialization2: number
  traitChoices2: [number, number, number]
  specialization3: number
  traitChoices3: [number, number, number]

  terrestrialHealSkill: number
  terrestrialUtilitySkill1: number
  terrestrialUtilitySkill2: number
  terrestrialUtilitySkill3: number
  terrestrialEliteSkill: number

  aquaticHealSkill: number
  aquaticUtilitySkill1: number
  aquaticUtilitySkill2: number
  aquaticUtilitySkill3: number
  aquaticEliteSkill: number

  terrestrialPet1?: number
  terrestrialPet2?: number
  aquaticPet1?: number
  aquaticPet2?: number

  terrestrialLegend1?: number
  terrestrialLegend2?: number
  aquaticLegend1?: number
  aquaticLegend2?: number

  selectedWeapons?: number[]
  selectedSkillVariants?: number[]
}

export function encodeBuildLink(meta: BuildLinkMeta): string | false {
  const struct = new ChatCodeStruct()

  // Add the header describing the type of the chat code
  struct.write1Byte(TYPE_HEADERS.build)

  struct.write1Byte(meta.profession)

  struct.write1Byte(meta.specialization1)
  struct.writeTraitSelection(meta.traitChoices1)
  struct.write1Byte(meta.specialization2)
  struct.writeTraitSelection(meta.traitChoices2)
  struct.write1Byte(meta.specialization3)
  struct.writeTraitSelection(meta.traitChoices3)

  struct.write2Bytes(meta.terrestrialHealSkill)
  struct.write2Bytes(meta.aquaticHealSkill)
  struct.write2Bytes(meta.terrestrialUtilitySkill1)
  struct.write2Bytes(meta.aquaticUtilitySkill1)
  struct.write2Bytes(meta.terrestrialUtilitySkill2)
  struct.write2Bytes(meta.aquaticUtilitySkill2)
  struct.write2Bytes(meta.terrestrialUtilitySkill3)
  struct.write2Bytes(meta.aquaticUtilitySkill3)
  struct.write2Bytes(meta.terrestrialEliteSkill)
  struct.write2Bytes(meta.aquaticEliteSkill)

  if (meta.profession === PROFESSION_FLAGS.ranger) {
    // Ranger
    struct.write1Byte(meta.terrestrialPet1 ?? 0)
    struct.write1Byte(meta.terrestrialPet2 ?? 0)
    struct.write1Byte(meta.aquaticPet1 ?? 0)
    struct.write1Byte(meta.aquaticPet2 ?? 0)

    // Zero out the bytes used for Revenant
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
  } else if (meta.profession === PROFESSION_FLAGS.revenant) {
    // Revenant
    struct.write1Byte(meta.terrestrialLegend1 ?? 0)
    struct.write1Byte(meta.terrestrialLegend2 ?? 0)
    struct.write1Byte(meta.aquaticLegend1 ?? 0)
    struct.write1Byte(meta.aquaticLegend2 ?? 0)

    // TODO (Feature) We could also encode the inactive legends but not in the API
    //  so we just default to the default sort order by 0-ing them.
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
  } else {
    // Zero out the bytes used for Ranger / Revenant
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)

    // Zero out the bytes used for Revenant
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
  }

  struct.writeDynamicArray(meta.selectedWeapons ?? [], 2)
  struct.writeDynamicArray(meta.selectedSkillVariants ?? [], 4)

  return struct.encodeToChatCode()
}
