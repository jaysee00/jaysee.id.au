// Responsible for loading, parsing and transforming site content.
const path = require('path');
const fs = require('fs-extra');
const fm = require('front-matter');
const marked = require('marked');

const context = require('./context');
const config = require('./config');
const { behaviours } = require('./config');

const processDir = (dir) => {
    console.log(`Processing directory ${dir}`);
    if (!fs.existsSync(dir)) {
        console.log(`Directory ${dir} does not exist.`);
        return [];
    }

    return fs.readdirSync(dir).map(file => {
        const fullPath = path.join(dir, file);
        console.log(`Processing dir contents ${fullPath}`);

        // Process sub-dir
        return fs.lstatSync(fullPath).isDirectory() ?
            processDir(fullPath) :
            processFile(fullPath);
    }).flat();
}

const processFile = (file) => {
    console.log(`Processing file ${file}`);
    if (!fs.existsSync(file)) {
        console.log(`File ${file} does not exist.`);
        return null;
    }

    const data = fs.readFileSync(file, "utf8");
    // TODO: Consider making loading of Markdown an optional
    // behaviour, or at least based on file extension?
    const node = fm(data);

    node.fileName = path.basename(file, path.extname(file));
    node.body = marked(node.body);

    // Load behaviour
    const behaviourName = node.attributes.behaviour;
    const behaviour = config.behaviours[behaviourName];

    const outPath = behaviour.outPath;
    if (typeof outPath === "function") {
        node.path = outPath(node);
    } else {
        node.path = outPath;
    }

    // Configure export behaviours, if any
    if (behaviour.context && behaviour.context.exports) {
        behaviour.context.exports.forEach((exportDef) => {
            context.addContext(exportDef.key, exportDef.putFunc(node));
        });
    }

    return node;
}

const process = (dir) => {
    processDir(dir);
    context.sort();
}

module.exports = {
    processDir: processDir,
    process: process
}