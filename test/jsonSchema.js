'use strict'

const chai = require('chai')
chai.use(require('../index.js'))
const expect = chai.expect

describe('jsonSchema()', function () {
  it('apple should match fruit schema.', function () {
    let apple = {
      name: 'foo',
      color: ['red', 'green', 'yellow'],
      value: 10
    }
    let schema = {
      title: 'fruit schema v0.1',
      type: 'object',
      required: ['name', 'color', 'value'],
      properties: {
        name: {
          type: 'string',
          minLength: 3
        },
        color: {
          type: 'array',
          minItems: 1,
          uniqueItems: true,
          items: {
            type: 'string'
          }
        },
        value: {
          type: 'integer',
          minimum: 5
        }
      }
    }
    expect(apple).to.be.jsonSchema(schema)
  })
  it('should print error message when not match schema.', function () {
    let apple = {
      value: 1.1
    }
    let schema = {
      type: 'object',
      required: ['value'],
      properties: {
        value: {
          type: 'integer'
        }
      }
    }
    try {
      expect(apple).to.be.jsonSchema(schema)
    } catch (e) {
      expect(e instanceof chai.AssertionError).to.be.true
      expect(e.message).to.be.equal(`expected value not match the json-schema
data.value should be integer`)
    }
  })
})
