/**
 * Helper to run extractWithUKBuildingRules in Node.js test environment using TypeScript transpile
 */
const fs = require('fs');
const ts = require('typescript');

const analyzerTs = fs.readFileSync('./src/lib/assistant/analyzer.ts', 'utf8');

const jsOutput = ts.transpileModule(analyzerTs, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const moduleObj = { exports: {} };
const fn = new Function('module', 'exports', 'require', jsOutput);
fn(moduleObj, moduleObj.exports, require);

module.exports = moduleObj.exports;
