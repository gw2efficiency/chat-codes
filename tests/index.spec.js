/* eslint-env node, mocha */
const expect = require('chai').expect
const codes = require('../src/index.js')

describe('encoding', () => {
  it('encodes item chat codes correctly', () => {
    expect(codes.encode('item', 46762)).to.equal('[&AgGqtgAA]')
  })
})

describe('decoding', () => {
  it('decodes item chat codes correctly', () => {
    expect(codes.decode('[&AgGqtgAA]')).to.deep.equal({type: 'item', id: 46762})
  })

  it('fails gracefully for a invalid format', () => {
    expect(codes.decode('this is not a chat code')).to.equal(false)
  })

  it('fails gracefully for a invalid type', () => {
    expect(codes.decode('[&BXsAAAA=]')).to.equal(false)
  })
})
