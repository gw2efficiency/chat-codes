import { CodeType, PROFESSION_FLAGS } from '../static'
import { ChatCodeStruct } from '../ChatCodeStruct'
import { BuildLinkMeta } from '../encode/encodeBuildLink'

// TODO (Review)
export function decodeBuildLink(struct: ChatCodeStruct) {
  let decoded: any = { type: 'build' as CodeType } // TODO (Cleanup)

  decoded.profession = struct.read1Byte()

  decoded.specializationId1 = struct.read1Byte()
  decoded.traitChoices1 = struct.readTraitSelection()
  decoded.specializationId2 = struct.read1Byte()
  decoded.traitChoices2 = struct.readTraitSelection()
  decoded.specializationId3 = struct.read1Byte()
  decoded.traitChoices3 = struct.readTraitSelection()

  decoded.terrestrialHealSkill = struct.read2Bytes()
  decoded.aquaticHealSkill = struct.read2Bytes()
  decoded.terrestrialUtilitySkill1 = struct.read2Bytes()
  decoded.aquaticUtilitySkill1 = struct.read2Bytes()
  decoded.terrestrialUtilitySkill2 = struct.read2Bytes()
  decoded.aquaticUtilitySkill2 = struct.read2Bytes()
  decoded.terrestrialUtilitySkill3 = struct.read2Bytes()
  decoded.aquaticUtilitySkill3 = struct.read2Bytes()
  decoded.terrestrialEliteSkill = struct.read2Bytes()
  decoded.aquaticEliteSkill = struct.read2Bytes()

  if (decoded.profession === PROFESSION_FLAGS.ranger) {
    // Ranger
    decoded.terrestrialPet1 = struct.read1Byte()
    decoded.terrestrialPet2 = struct.read1Byte()
    decoded.aquaticPet1 = struct.read1Byte()
    decoded.aquaticPet2 = struct.read1Byte()
  } else if (decoded.profession === PROFESSION_FLAGS.revenant) {
    // Revenant
    decoded.terrestrialLegend1 = struct.read1Byte()
    decoded.terrestrialLegend2 = struct.read1Byte()
    decoded.aquaticLegend1 = struct.read1Byte()
    decoded.aquaticLegend2 = struct.read1Byte()
  }

  return decoded as BuildLinkMeta
}
