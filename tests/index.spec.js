/* eslint-env node, mocha */
const expect = require('chai').expect
const codes = require('../src/index.js')

const testCases = [
  {type: 'item', id: 46762, code: '[&AgGqtgAA]'},
  {type: 'map', id: 825, code: '[&BDkDAAA=]'},
  {type: 'skill', id: 5842, code: '[&BtIWAAA=]'},
  {type: 'trait', id: 1010, code: '[&B/IDAAA=]'},
  {type: 'recipe', id: 8, code: '[&CQgAAAA=]'},
  {type: 'skin', id: 2286, code: '[&Cu4IAAA=]'},
  {type: 'outfit', id: 28, code: '[&CxwAAAA=]'}
]

describe('encoding', () => {
  testCases.map(test => {
    it('encodes ' + test.type + ' chat codes correctly', () => {
      expect(codes.encode(test.type, test.id)).to.equal(test.code)
    })
  })

  it('fails gracefully for a invalid type', () => {
    expect(codes.encode('nonexisting', 123)).to.equal(false)
  })

  it('fails gracefully for a invalid id', () => {
    expect(codes.encode('item', '#notanid')).to.equal(false)
    expect(codes.encode('item', -5)).to.equal(false)
  })
})

describe('decoding', () => {
  testCases.map(test => {
    it('decodes ' + test.type + ' chat codes correctly', () => {
      expect(codes.decode(test.code)).to.deep.equal({type: test.type, id: test.id})
    })
  })

  it('fails gracefully for a invalid format', () => {
    expect(codes.decode('this is not a chat code')).to.equal(false)
  })

  it('fails gracefully for a invalid type', () => {
    expect(codes.decode('[&BXsAAAA=]')).to.equal(false)
  })
})
