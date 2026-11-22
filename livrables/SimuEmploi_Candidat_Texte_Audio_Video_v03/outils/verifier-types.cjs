const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'projet-source');
const ts = require(path.join(root, 'node_modules/typescript'));
const configFile = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, root);
const program = ts.createProgram(config.fileNames, config.options);
const checker = program.getTypeChecker();
const report = program.getSourceFile(path.join(root, 'src/components/InterviewReportView.tsx'));
let fieldType;
function visit(node) {
  if (ts.isPropertyAccessExpression(node) && node.getText(report) === 'item.question') {
    fieldType = checker.typeToString(checker.getTypeAtLocation(node.expression));
  }
  ts.forEachChild(node, visit);
}
visit(report);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const lock = ts.parseConfigFileTextToJson('bun.lock', fs.readFileSync(path.join(root, 'bun.lock'), 'utf8')).config;
const versions = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies }).map(name => {
  const installed = JSON.parse(fs.readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8'));
  return { package: name, declared: manifest.dependencies?.[name] || manifest.devDependencies?.[name], archiveLock: lock.packages?.[name]?.[0], installed: installed.version };
});
const result = {
  typecheckDiagnostics: ts.getPreEmitDiagnostics(program).length,
  itemTypeInBrokenCopyHandler: fieldType,
  strictEnabled: config.options.strict === true,
  reactTypesDeclared: Boolean(manifest.dependencies?.['@types/react'] || manifest.devDependencies?.['@types/react']),
  dependencyReproduction: 'Installation pnpm avec plages package.json; bun.lock non appliqué. Ces résultats ne valident pas la reproduction exacte du lock original.',
  versions,
};
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
