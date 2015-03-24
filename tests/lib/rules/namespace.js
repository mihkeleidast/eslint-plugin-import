"use strict";

var linter = require("eslint").linter,
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(linter);

var test = require("../../utils").test;

function error(name, namespace) {
  return { message: "'" + name + "' not found in imported namespace " + namespace + "." };
}


eslintTester.addRuleTest("lib/rules/namespace", {
  valid: [
    test({code: "import * as names from './named-exports'; console.log(names.a); "}),
    test({code: "import * as names from './re-export-names'; console.log(names.foo);"})
  ],

  invalid: [
    test({code: "import * as names from './default-export';",
          errors: ["No exported names found in module './default-export'."]}),

    test({code: "import * as names from './named-exports'; console.log(names.c); ",
          errors: [error("c", "names")]}),

    test({code: "import * as names from './named-exports'; console.log(names['a']);",
          errors: ["Unable to validate computed reference to imported namespace 'names'."]})
  ]
});
