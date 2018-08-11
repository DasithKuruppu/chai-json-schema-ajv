"use strict";

const Ajv = require("ajv");

function _createPlugin(chai, util, options) {
  const assert = chai.assert;
  const expect = chai.expect;

  let ajv = new Ajv(options);

  // export ajv to chai
  chai.ajv = ajv;

  /**
   * Test if {value} matches the {schema}
   */
  chai.Assertion.addMethod("jsonSchema", function(schema) {
    const value = this._obj;

    // assert.ok(schema, 'missing schema')

    const valid = ajv.validate(schema, value);

    let detail = "";
    if (options && options.verbose) {
      detail = JSON.stringify(ajv.errors, null, "  ");
    } else {
      detail = ajv.errorsText(valid.error);
    }

    if (valid) {
      this.assert(
        valid,
        `#{act} is of valid json schema - #{exp}`,
        `#{act} is not of valid json schema - #{exp}`,
        schema,
        value
      );
    }
    if (!valid) {
      this.assert(
        valid,
        `#{act} is of invalid json schema - #{exp} \n${detail}`,
        `#{act} is not of valid json schema - #{exp} \n${detail}`,
        schema,
        value
      );
    }
  });

  /**
   * Test if {schema} is valid
   */
  chai.Assertion.addProperty("validJsonSchema", function() {
    const schema = this._obj;
    const valid = ajv.validateSchema(schema);

    this.assert(
      valid,
      "value is not a valid JSON Schema:\n" +
        util.inspect(ajv.errors, null, null)
    );
  });
}

module.exports = _createPlugin;

module.exports.withOptions = function(options) {
  return function(chai, utils) {
    return _createPlugin(chai, utils, options);
  };
};
