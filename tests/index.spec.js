/* eslint-env node, mocha */
import {expect} from 'chai'
import codes from '../src/index.js'

const testCases = [
  {type: 'map', id: 825, code: '[&BDkDAAA=]'},
  {type: 'skill', id: 5842, code: '[&BtIWAAA=]'},
  {type: 'trait', id: 1010, code: '[&B/IDAAA=]'},
  {type: 'recipe', id: 8, code: '[&CQgAAAA=]'},
  {type: 'skin', id: 2286, code: '[&Cu4IAAA=]'},
  {type: 'outfit', id: 28, code: '[&CxwAAAA=]'},
  {type: 'objective', id: '38-11', code: '[&DAsAAAAmAAAA]'}
]

const itemTestCases = [
  {type: 'item', info: {id: 46762}, code: '[&AgGqtgAA]'},
  {type: 'item', info: {id: 46762, quantity: 42}, code: '[&AiqqtgAA]'},
  {type: 'item', info: {id: 46762, upgrades: [24575]}, code: '[&AgGqtgBA/18AAA==]'},
  {type: 'item', info: {id: 46762, upgrades: [24575, 24615]}, code: '[&AgGqtgBg/18AACdgAAA=]'},
  {type: 'item', info: {id: 46762, skin: 3709}, code: '[&AgGqtgCAfQ4AAA==]'},
  {type: 'item', info: {id: 46762, skin: 3709, upgrades: [24575]}, code: '[&AgGqtgDAfQ4AAP9fAAA=]'},
  {type: 'item', info: {id: 46762, skin: 3709, upgrades: [24575, 24615]}, code: '[&AgGqtgDgfQ4AAP9fAAAnYAAA]'},
  {type: 'item', info: {id: 46762, quantity: 42, skin: 3709, upgrades: [24575, 24615]}, code: '[&AiqqtgDgfQ4AAP9fAAAnYAAA]'}
]

const buildTestCases = [
  {type: 'build', info: {aquaticEliteSkill: 407, aquaticHealSkill: 3877, aquaticPet1: 0, aquaticPet2: 0, aquaticUtilitySkill1: 189, aquaticUtilitySkill2: 188, aquaticUtilitySkill3: 406, profession: 4, specializationId1: 33, specializationId2: 30, specializationId3: 55, terrestrialEliteSkill: 5678, terrestrialHealSkill: 5934, terrestrialPet1: 15619, terrestrialPet2: 4885, terrestrialUtilitySkill1: 190, terrestrialUtilitySkill2: 186, terrestrialUtilitySkill3: 5865, traitChoices1: [3, 1, 3], traitChoices2: [3, 1, 1], traitChoices3: [2, 3, 2]}, code: '[&DQQhNx4XNy4uFyUPvgC9ALoAvADpFpYBLhaXAQM9FRMAAAAAAAAAAAAAAAA=]'}
//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        [&DQQhNx4XNy4uFyUPvgC9ALoAvADpFpYBLhaXAQM9FRMAAAAAAAAAAAAAAAA=]
]

describe('encoding', () => {
  testCases.map(test => {
    it('encodes ' + test.type + ' chat codes correctly', () => {
      expect(codes.encode(test.type, test.id)).to.equal(test.code)
    })
  })

  it('encodes item chat codes correctly', () => {
    expect(codes.encode('item', 46762)).to.equal('[&AgGqtgAA]')

    itemTestCases.map(test => {
      expect(codes.encode(test.type, test.info)).to.equal(test.code)
    })
  })

  it('encodes item stacks from the API correctly', () => {
    const item = {
      id: 46762,
      slot: 'WeaponA1',
      upgrades: [
        24554,
        24615
      ],
      skin: 5807,
      binding: 'Account'
    }

    expect(codes.encode('item', item)).to.equal('[&AgGqtgDgrxYAAOpfAAAnYAAA]')
  })

  it('encodes build chat codes correctly', () => {
    buildTestCases.map(test => {
      expect(codes.encode(test.type, test.info)).to.equal(test.code)
    })
  })

  it('fails gracefully for a invalid type', () => {
    expect(codes.encode('nonexisting', 123)).to.equal(false)
  })

  it('fails gracefully for a invalid id', () => {
    expect(codes.encode('item', '#notanid')).to.equal(false)
    expect(codes.encode('item', -5)).to.equal(false)
    expect(codes.encode('item', {})).to.equal(false)
    expect(codes.encode('item', {id: '#notanid'})).to.equal(false)
    expect(codes.encode('item', {id: -5})).to.equal(false)
    expect(codes.encode('objective', 5)).to.equal(false)
  })
})

describe('decoding', () => {
  testCases.map(test => {
    it('decodes ' + test.type + ' chat codes correctly', () => {
      expect(codes.decode(test.code)).to.deep.equal({type: test.type, id: test.id})
    })
  })

  it('decodes item chat codes correctly', () => {
    itemTestCases.map(test => {
      expect(codes.decode(test.code)).to.deep.equal({type: test.type, quantity: 1, ...test.info})
    })
  })

  it('decodes build chat codes correctly', () => {
    buildTestCases.map(test => {
      expect(codes.decode(test.code)).to.deep.equal({type: test.type, ...test.info})
    })
  })

  it('fails gracefully for a invalid format', () => {
    expect(codes.decode('this is not a chat code')).to.equal(false)
  })

  it('fails gracefully for a invalid type', () => {
    expect(codes.decode('[&BXsAAAA=]')).to.equal(false)
  })
})
