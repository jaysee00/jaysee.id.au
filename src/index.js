const fs = require('fs-extra');

const config = require("./config");
const publisher = require('./publisher');
const processor = require('./processor');

console.log("Starting publish");
const outputs = processor.processDir(config.srcDir)

console.log(`Publishing to ${config.outDir}`);

// TODO: Make 'clean build' optional instead of mandatory
fs.removeSync(config.outDir);
fs.mkdirSync(config.outDir);

publisher.publishOutputs(outputs);
// copy assets to build dir
fs.copySync(config.assetsDir, config.outDir);

console.log("Finished");