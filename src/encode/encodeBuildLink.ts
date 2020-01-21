import { PROFESSION_FLAGS, TYPE_HEADERS } from '../static'
import { ChatCodeStruct, TraitSelection } from '../ChatCodeStruct'

export type BuildLinkMeta = {
  profession: number

  specializationId1: number
  traitChoices1: TraitSelection
  specializationId2: number
  traitChoices2: TraitSelection
  specializationId3: number
  traitChoices3: TraitSelection
  terrestrialHealSkill: number
  aquaticHealSkill: number
  terrestrialUtilitySkill1: number
  aquaticUtilitySkill1: number
  terrestrialUtilitySkill2: number
  aquaticUtilitySkill2: number
  terrestrialUtilitySkill3: number
  aquaticUtilitySkill3: number
  terrestrialEliteSkill: number
  aquaticEliteSkill: number

  terrestrialPet1?: number
  terrestrialPet2?: number
  aquaticPet1?: number
  aquaticPet2?: number

  terrestrialLegend1?: number
  terrestrialLegend2?: number
  aquaticLegend1?: number
  aquaticLegend2?: number
}

// TODO (Review)
export function encodeBuildLink(meta: BuildLinkMeta): string | false {
  const struct = new ChatCodeStruct()

  // Add the header describing the type of the link
  struct.write1Byte(TYPE_HEADERS.build)

  struct.write1Byte(meta.profession)

  struct.write1Byte(meta.specializationId1)
  struct.writeTraitSelection(meta.traitChoices1)
  struct.write1Byte(meta.specializationId2)
  struct.writeTraitSelection(meta.traitChoices2)
  struct.write1Byte(meta.specializationId3)
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
    struct.write1Byte(meta.terrestrialPet1 as number)
    struct.write1Byte(meta.terrestrialPet2 as number)
    struct.write1Byte(meta.aquaticPet1 as number)
    struct.write1Byte(meta.aquaticPet2 as number)

    // Zero out the bytes used for Revenant
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
    struct.write2Bytes(0x00)
  } else if (meta.profession === PROFESSION_FLAGS.revenant) {
    // Revenant
    struct.write1Byte(meta.terrestrialLegend1 as number)
    struct.write1Byte(meta.terrestrialLegend2 as number)
    struct.write1Byte(meta.aquaticLegend1 as number)
    struct.write1Byte(meta.aquaticLegend2 as number)

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

  return struct.encodeToChatCode()
}
