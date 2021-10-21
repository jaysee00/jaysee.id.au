// Responsible for loading, parsing and transforming site content.
const path = require('path');
const fs = require('fs-extra');
const fm = require('front-matter');
const marked = require('marked');
const CleanCSS = require('clean-css');

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

const processAssets = (dir) => {
    // console.log(`Processing directory ${dir}`);
    if (!fs.existsSync(dir)) {
        console.log(`Directory ${dir} does not exist.`);
        return [];
    }

    return fs.readdirSync(dir).map(file => {
        const fullPath = path.join(dir, file);
        // console.log(`Processing dir contents ${fullPath}`);

        // Process sub-dir
        return fs.lstatSync(fullPath).isDirectory() ?
            processAssets(fullPath) :
            processAsset(fullPath);
    }).flat();
}

//TODO: Move some of this to the publisher? 
const processAsset = (assetFile) => {
    const fileExtension = path.extname(assetFile);
    const destPath = path.relative(config.assetsDir, assetFile);

    if (fileExtension === ".css") {
        // minify
        console.log(`Reading file ${assetFile} for minification`);
        const input = fs.readFileSync(assetFile);
        const output = new CleanCSS({}).minify(input);
        // TODO: There's some efficiency stats in the output which might be worth logging.
        return {
            path: destPath,
            output: output.styles
        };

    } else {
        // copy as-is.
        return {
            path: destPath,
            // TODO: This is trying to defer execution of the read to avoid loading all assets into memory. Need to test if this works!
            output: () => {
                return fs.readFileSync(assetFile);
            }
        }
    }
}

const processFile = (file) => {
    // console.log(`Processing file ${file}`);
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

module.exports = {
    processDir: processDir,
    processAssets: processAssets
}