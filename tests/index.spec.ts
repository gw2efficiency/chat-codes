import chatCodes from '../src/index'
import { CodeType } from '../src/static'
import { ItemLinkMeta } from '../src/encode/encodeItemLink'
import { BuildLinkMeta } from '../src/encode/encodeBuildLink'

const testCases: Array<{ type: CodeType; code: string; id: number | string }> = [
  { type: 'map', id: 825, code: '[&BDkDAAA=]' },
  { type: 'skill', id: 5842, code: '[&BtIWAAA=]' },
  { type: 'trait', id: 1010, code: '[&B/IDAAA=]' },
  { type: 'recipe', id: 8, code: '[&CQgAAAA=]' },
  { type: 'skin', id: 2286, code: '[&Cu4IAAA=]' },
  { type: 'outfit', id: 28, code: '[&CxwAAAA=]' },
  { type: 'objective', id: '38-11', code: '[&DAsAAAAmAAAA]' },
]

const itemTestCases: Array<{ type: 'item'; code: string; meta: ItemLinkMeta }> = [
  { type: 'item', meta: { id: 46762 }, code: '[&AgGqtgAA]' },
  { type: 'item', meta: { id: 46762, quantity: 42 }, code: '[&AiqqtgAA]' },
  { type: 'item', meta: { id: 46762, upgrades: [24575] }, code: '[&AgGqtgBA/18AAA==]' },
  { type: 'item', meta: { id: 46762, upgrades: [24575, 24615] }, code: '[&AgGqtgBg/18AACdgAAA=]' },
  { type: 'item', meta: { id: 46762, skin: 3709 }, code: '[&AgGqtgCAfQ4AAA==]' },
  {
    type: 'item',
    meta: { id: 46762, skin: 3709, upgrades: [24575] },
    code: '[&AgGqtgDAfQ4AAP9fAAA=]',
  },
  {
    type: 'item',
    meta: { id: 46762, skin: 3709, upgrades: [24575, 24615] },
    code: '[&AgGqtgDgfQ4AAP9fAAAnYAAA]',
  },
  {
    type: 'item',
    meta: { id: 46762, quantity: 42, skin: 3709, upgrades: [24575, 24615] },
    code: '[&AiqqtgDgfQ4AAP9fAAAnYAAA]',
  },
]

const buildTestCases: Array<{
  type: 'build'
  code: string
  legacyCode?: string
  meta: BuildLinkMeta
}> = [
  {
    type: 'build',
    code: '[&DQYfLSkaOCcXAXQANRfLAL4BjwBOARwBlwCWAAAAAAAAAAAAAAAAAAAAAAAAAA==]',
    legacyCode: '[&DQYfLSkaOCcXAXQANRfLAL4BjwBOARwBlwCWAAAAAAAAAAAAAAAAAAAAAAA=]',
    meta: {
      profession: 6, // Elementalist

      specialization1: 31, // Fire
      traitChoices1: [1, 3, 2],
      specialization2: 41, // Air
      traitChoices2: [2, 2, 1],
      specialization3: 56, // Weaver
      traitChoices3: [3, 1, 2],

      terrestrialHealSkill: 279, // Glyph of Elemental Harmony
      terrestrialUtilitySkill1: 5941, // Primordial Stance
      terrestrialUtilitySkill2: 446, // Glyph of Storms
      terrestrialUtilitySkill3: 334, // Arcane Wave
      terrestrialEliteSkill: 151, // Conjure Fiery Greatsword

      aquaticHealSkill: 116, // Signet of Restoration
      aquaticUtilitySkill1: 203, // Signet of Fire
      aquaticUtilitySkill2: 143, // Signet of Water
      aquaticUtilitySkill3: 284, // Signet of Air
      aquaticEliteSkill: 150, // Tornado
    },
  },
  {
    type: 'build',
    code: '[&DQQhNx4XNy4uFyUPvgC9ALoAvADpFpYBLhaXAQEECxMAAAAAAAAAAAAAAAAAAA==]',
    legacyCode: '[&DQQhNx4XNy4uFyUPvgC9ALoAvADpFpYBLhaXAQEECxMAAAAAAAAAAAAAAAA=]',
    meta: {
      profession: 4, // Ranger

      specialization1: 33, // Wilderness Survival
      traitChoices1: [3, 1, 3],
      specialization2: 30, // Skirmishing
      traitChoices2: [3, 1, 1],
      specialization3: 55, // Soulbeast
      traitChoices3: [2, 3, 2],

      terrestrialHealSkill: 5934, // Bear Stance
      terrestrialUtilitySkill1: 190, // Flame Trap
      terrestrialUtilitySkill2: 186, // Viper's Nest
      terrestrialUtilitySkill3: 5865, // Vulture Stance
      terrestrialEliteSkill: 5678, // One Wolf pack

      aquaticHealSkill: 3877, // Aqua Surge
      aquaticUtilitySkill1: 189, // Solar Flare
      aquaticUtilitySkill2: 188, // Cold Snap
      aquaticUtilitySkill3: 406, // Quickening Zephyr
      aquaticEliteSkill: 407, // Nature's Renewal

      terrestrialPet1: 1, // Juvenile Jungle Stalker
      terrestrialPet2: 4, // Juvenile Krytan Drakehound
      aquaticPet1: 11, // Juvenile Jaguar
      aquaticPet2: 19, // Juvenile River Drake
    },
  },
  {
    type: 'build',
    code: '[&DQkPFQMqND/cEdwRKxIrEgYSBhLUEdQRyhHKEQ4NDxAAAAAAAAAAAAAAAAAAAA==]',
    legacyCode: '[&DQkPFQMqND/cEdwRKxIrEgYSBhLUEdQRyhHKEQ4NDxAAAAAAAAAAAAAAAAA=]',
    meta: {
      profession: 9, // Revenant

      specialization1: 15, // Devastation
      traitChoices1: [1, 1, 1],
      specialization2: 3, // Invocation
      traitChoices2: [2, 2, 2],
      specialization3: 52, // Herald
      traitChoices3: [3, 3, 3],

      terrestrialHealSkill: 4572, // Enchanted Daggers
      terrestrialUtilitySkill1: 4651, // Phase Traversal
      terrestrialUtilitySkill2: 4614, // Riposting Shadows
      terrestrialUtilitySkill3: 4564, // Impossible Odds
      terrestrialEliteSkill: 4554, // Jade Winds

      aquaticHealSkill: 4572, // Soothing Stone
      aquaticUtilitySkill1: 4651, // Forced Engagement
      aquaticUtilitySkill2: 4614, // Inspiring Reinforcement
      aquaticUtilitySkill3: 4564, // Vengeful Hammers
      aquaticEliteSkill: 4554, // Rite of the Great Dwarf

      terrestrialLegend1: 14, // Dragon
      terrestrialLegend2: 13, // Assassin
      aquaticLegend1: 15, // Demon
      aquaticLegend2: 16, // Dwarf
    },
  },
  {
    type: 'build',
    code: '[&DQQZGggqHiYlD3kAvQAAALkAAAC8AAAAlwEAABYAAAAAAAAAAAAAAAAAAAACMwAjAARn9wAA3fYAAJv2AADo9gAA]',
    meta: {
      profession: 4,

      specialization1: 25,
      traitChoices1: [2, 2, 1],
      specialization2: 8,
      traitChoices2: [2, 2, 2],
      specialization3: 30,
      traitChoices3: [2, 1, 2],

      terrestrialHealSkill: 3877,
      terrestrialUtilitySkill1: 189,
      terrestrialUtilitySkill2: 185,
      terrestrialUtilitySkill3: 188,
      terrestrialEliteSkill: 407,

      terrestrialPet1: 22,
      terrestrialPet2: 0,

      aquaticHealSkill: 121,
      aquaticUtilitySkill1: 0,
      aquaticUtilitySkill2: 0,
      aquaticUtilitySkill3: 0,
      aquaticEliteSkill: 0,

      aquaticPet1: 0,
      aquaticPet2: 0,

      selectedWeapons: [51, 35],
      selectedSkillVariants: [63335, 63197, 63131, 63208],
    },
  },
]

describe('encoding', () => {
  testCases.map((test) => {
    it('encodes ' + test.type + ' chat codes correctly', () => {
      expect(chatCodes.encode(test.type, test.id)).toEqual(test.code)
    })
  })

  it('encodes item chat codes correctly', () => {
    expect(chatCodes.encode('item', 46762)).toEqual('[&AgGqtgAA]')

    // @ts-expect-error
    expect(chatCodes.encode('item', '46762')).toEqual('[&AgGqtgAA]')

    itemTestCases.map((test) => {
      expect(chatCodes.encode(test.type, test.meta)).toEqual(test.code)
    })
  })

  it('encodes item stacks from the API correctly', () => {
    const item = {
      id: 46762,
      slot: 'WeaponA1',
      upgrades: [24554, 24615],
      skin: 5807,
      binding: 'Account',
    }

    expect(chatCodes.encode('item', item)).toEqual('[&AgGqtgDgrxYAAOpfAAAnYAAA]')
  })

  it('encodes build chat codes correctly', () => {
    buildTestCases.map((test) => {
      expect(chatCodes.encode(test.type, test.meta)).toEqual(test.code)
    })
  })

  it('fails gracefully for a invalid type', () => {
    expect(chatCodes.encode('nonexisting' as CodeType, 123)).toEqual(false)
  })

  it('fails gracefully for a invalid id', () => {
    expect(chatCodes.encode('item', '#notanid' as any)).toEqual(false)
    expect(chatCodes.encode('item', -5)).toEqual(false)
    expect(chatCodes.encode('item', {} as any)).toEqual(false)
    expect(chatCodes.encode('item', { id: '#notanid' as any })).toEqual(false)
    expect(chatCodes.encode('item', { id: -5 })).toEqual(false)

    expect(chatCodes.encode('objective', '1-foo')).toEqual(false)
    expect(chatCodes.encode('objective', 'foo-1')).toEqual(false)
    expect(chatCodes.encode('objective', '#notanid')).toEqual(false)
    expect(chatCodes.encode('objective', -5 as any)).toEqual(false)
    expect(chatCodes.encode('objective', {} as any)).toEqual(false)
    expect(chatCodes.encode('objective', { id: '#notanid' })).toEqual(false)
    expect(chatCodes.encode('objective', { id: -5 as any })).toEqual(false)

    expect(chatCodes.encode('map', '#notanid' as any)).toEqual(false)
    expect(chatCodes.encode('map', -5)).toEqual(false)
    expect(chatCodes.encode('map', {} as any)).toEqual(false)
    expect(chatCodes.encode('map', { id: '#notanid' as any })).toEqual(false)
    expect(chatCodes.encode('map', { id: -5 })).toEqual(false)
  })
})

describe('decoding', () => {
  testCases.map((test) => {
    it('decodes ' + test.type + ' chat codes correctly', () => {
      expect(chatCodes.decode(test.code)).toEqual({ type: test.type, id: test.id })
    })
  })

  it('decodes item chat codes correctly', () => {
    itemTestCases.map((test) => {
      expect(chatCodes.decode(test.code)).toEqual({
        type: test.type,
        quantity: 1,
        ...test.meta,
      })
    })
  })

  it('decodes build chat codes correctly', () => {
    buildTestCases.map((test) => {
      expect(chatCodes.decode(test.code)).toEqual({ type: test.type, ...test.meta })
    })
  })

  it('decodes legacy build chat codes correctly', () => {
    buildTestCases
      .filter(({ legacyCode }) => legacyCode !== undefined)
      .map((test) => {
        expect(chatCodes.decode(test.legacyCode!)).toEqual({ type: test.type, ...test.meta })
      })
  })

  it('fails gracefully for a invalid format', () => {
    expect(chatCodes.decode('this is not a chat code')).toEqual(false)
  })

  it('fails gracefully for a invalid type', () => {
    expect(chatCodes.decode('[&BXsAAAA=]')).toEqual(false)
  })
})
