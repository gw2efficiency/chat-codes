/* eslint-env node, mocha */
import {expect} from 'chai'
import codes from '../src/index.js'

const testCases = [
  {type: 'map', id: 825, code: '[&BDkDAAA=]'},
  {type: 'skill', id: 5842, code: '[&BtIWAAA=]'},
  {type: 'trait', id: 1010, code: '[&B/IDAAA=]'},
  {type: 'recipe', id: 8, code: '[&CQgAAAA=]'},
  {type: 'skin', id: 2286, code: '[&Cu4IAAA=]'},
  {type: 'outfit', id: 28, code: '[&CxwAAAA=]'}
]

const itemTestCases = [
  {type: 'item', info: {id: 46762}, code: '[&AgGqtgAA]'},
  {type: 'item', info: {id: 46762, quantity: 42}, code: '[&AiqqtgAA]'},
  {type: 'item', info: {id: 46762, upgrade1: 24575}, code: '[&AgGqtgBA/18AAA==]'},
  {type: 'item', info: {id: 46762, upgrade1: 24575, upgrade2: 24615}, code: '[&AgGqtgBg/18AACdgAAA=]'},
  {type: 'item', info: {id: 46762, skin: 3709}, code: '[&AgGqtgCAfQ4AAA==]'},
  {type: 'item', info: {id: 46762, skin: 3709, upgrade1: 24575}, code: '[&AgGqtgDAfQ4AAP9fAAA=]'},
  {type: 'item', info: {id: 46762, skin: 3709, upgrade1: 24575, upgrade2: 24615}, code: '[&AgGqtgDgfQ4AAP9fAAAnYAAA]'},
  {type: 'item', info: {id: 46762, quantity: 42, skin: 3709, upgrade1: 24575, upgrade2: 24615}, code: '[&AiqqtgDgfQ4AAP9fAAAnYAAA]'}
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

  it('fails gracefully for a invalid type', () => {
    expect(codes.encode('nonexisting', 123)).to.equal(false)
  })

  it('fails gracefully for a invalid id', () => {
    expect(codes.encode('item', '#notanid')).to.equal(false)
    expect(codes.encode('item', -5)).to.equal(false)
    expect(codes.encode('item', {})).to.equal(false)
    expect(codes.encode('item', {id: '#notanid'})).to.equal(false)
    expect(codes.encode('item', {id: -5})).to.equal(false)
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

  it('fails gracefully for a invalid format', () => {
    expect(codes.decode('this is not a chat code')).to.equal(false)
  })

  it('fails gracefully for a invalid type', () => {
    expect(codes.decode('[&BXsAAAA=]')).to.equal(false)
  })
})
