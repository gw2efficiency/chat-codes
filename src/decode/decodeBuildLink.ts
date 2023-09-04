import { PROFESSION_FLAGS } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'

export function decodeBuildLink(struct: ChatCodeStruct) {
  const profession = struct.read1Byte()

  const specialization1 = struct.read1Byte()
  const traitChoices1 = struct.readTraitSelection()
  const specialization2 = struct.read1Byte()
  const traitChoices2 = struct.readTraitSelection()
  const specialization3 = struct.read1Byte()
  const traitChoices3 = struct.readTraitSelection()

  const terrestrialHealSkill = struct.read2Bytes()
  const aquaticHealSkill = struct.read2Bytes()
  const terrestrialUtilitySkill1 = struct.read2Bytes()
  const aquaticUtilitySkill1 = struct.read2Bytes()
  const terrestrialUtilitySkill2 = struct.read2Bytes()
  const aquaticUtilitySkill2 = struct.read2Bytes()
  const terrestrialUtilitySkill3 = struct.read2Bytes()
  const aquaticUtilitySkill3 = struct.read2Bytes()
  const terrestrialEliteSkill = struct.read2Bytes()
  const aquaticEliteSkill = struct.read2Bytes()

  // Ranger
  let terrestrialPet1
  let terrestrialPet2
  let aquaticPet1
  let aquaticPet2
  if (profession === PROFESSION_FLAGS.ranger) {
    terrestrialPet1 = struct.read1Byte()
    terrestrialPet2 = struct.read1Byte()
    aquaticPet1 = struct.read1Byte()
    aquaticPet2 = struct.read1Byte()
  }

  // Revenant
  let terrestrialLegend1
  let terrestrialLegend2
  let aquaticLegend1
  let aquaticLegend2
  if (profession === PROFESSION_FLAGS.revenant) {
    terrestrialLegend1 = struct.read1Byte()
    terrestrialLegend2 = struct.read1Byte()
    aquaticLegend1 = struct.read1Byte()
    aquaticLegend2 = struct.read1Byte()
  }

  // skip inactive legends
  struct.read2Bytes()
  struct.read2Bytes()
  struct.read2Bytes()
  struct.read2Bytes()
  struct.read2Bytes()
  struct.read2Bytes()

  // check if we are at the end of the build code already,
  // selectedWeapons and selectedSkillVariants were added with SotO,
  // and old chat codes generated before SotO don't contain these yet.
  const legacyChatCode = struct.atEnd()

  const selectedWeapons = legacyChatCode ? undefined : struct.readDynamicArray(2)
  const selectedSkillVariants = legacyChatCode ? undefined : struct.readDynamicArray(4)

  return {
    type: 'build' as const,

    profession,

    specialization1,
    traitChoices1,
    specialization2,
    traitChoices2,
    specialization3,
    traitChoices3,

    terrestrialHealSkill,
    terrestrialUtilitySkill1,
    terrestrialUtilitySkill2,
    terrestrialUtilitySkill3,
    terrestrialEliteSkill,

    aquaticHealSkill,
    aquaticUtilitySkill1,
    aquaticUtilitySkill2,
    aquaticUtilitySkill3,
    aquaticEliteSkill,

    terrestrialPet1,
    terrestrialPet2,
    aquaticPet1,
    aquaticPet2,

    terrestrialLegend1,
    terrestrialLegend2,
    aquaticLegend1,
    aquaticLegend2,

    selectedWeapons,
    selectedSkillVariants,
  }
}
