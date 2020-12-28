const fs = require('fs-extra');

const config = require("./config");
const publisher = require('./publisher');
const processor = require('./processor');

// Glob: File pattern matching: https://www.npmjs.com/package/glob

// Init:
//  - Load and configure handlebars.
//  - Load and configure logging library
// Load all files from src dir.
// Visit each file and transform into a 'node'.
//      -> Lookup the right "behaviour", 
//          -> Behaviour defines, publish URL, slug, render template. 
//      -> Create some kind of 'node' object and populate it. 
//      -> Push the node into a publish queue
//      -> Maybe export the node into a queryable object for reference by other renderers.
// Publish & render
//      -> Load and compile the appropriate renderer & template.
//      -> Inject data from query context as required. 
//      -> Execute render
//      -> Write to file system. 
// Wrap
//  - Log stats
//  - Done!



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