const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const Git = require('nodegit');

const config = require('./config');
const context = require('./context');

const Handlebars = require('handlebars');

const compileTemplate = (templatePath) => {
    return Handlebars.compile(fs.readFileSync(path.join('./templates', templatePath), 'utf-8'));
}

// Configure handlebars
// TODO: Make this dynamic.
Handlebars.registerPartial("page", compileTemplate('partials/page.hbs'));
Handlebars.registerPartial("header", compileTemplate('partials/header.hbs'));
Handlebars.registerPartial("footer", compileTemplate('partials/footer.hbs'));
Handlebars.registerPartial("bodyDefault", compileTemplate('partials/bodyDefault.hbs'));
Handlebars.registerPartial("travelBlogsBody", compileTemplate('partials/travelBlogsBody.hbs'));
Handlebars.registerPartial("portfolioBlogsBody", compileTemplate('partials/portfolioBlogsBody.hbs'));

Handlebars.registerHelper("formatDate", function(date) {
    return moment(date).format('YYYY/MM/DD');
});

Handlebars.registerHelper("toLowerCase", function(str) {
    return str ? str.toLowerCase() : "";
});
Handlebars.registerHelper("debug", function(optionalValue) {
    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});

const _loadContext = async() => {
    // Load the repo
    const repo = await Git.Repository.open(".");
    const commit = await repo.getBranchCommit("main");

    return {
        publish: {
            year: moment().format('YYYY'),
            date: moment(commit.timeMs()).format('YYYY/MM/DD'),
            url: 'https://github.com/jaysee00', // TODO: Add link to exact commit
            hash: commit.id(),
            shortHash: commit.id().toString().slice(0, 6)
        }
    };
}

const defaultTemplateContext = _loadContext();

const publishOutput = async(output) => {

    const fullPath = path.join(config.outDir, output.path);
    const pathInfo = path.parse(fullPath);

    // Load the correct renderer.
    const behaviour = config.behaviours[output.attributes.behaviour];
    if (behaviour.template) {
        console.log(`Rendering with template ${behaviour.template}`);
        var template = compileTemplate(`${behaviour.template}.hbs`);

        // Add default template context
        let templateContext = await defaultTemplateContext;
        templateContext.node = output;

        // Load  breadcrumbs
        if (behaviour.crumbs) {
            if (typeof behaviour.crumbs === "function") {
                templateContext.crumbs = behaviour.crumbs(output);
            } else {
                templateContext.crumbs = behaviour.crumbs
            }
        }

        // Load context imports, if any.
        if (behaviour.context && behaviour.context.imports) {
            behaviour.context.imports.forEach(ctxDef => {
                templateContext[ctxDef.key] = context.getContext(ctxDef.key).sort(ctxDef.sortFunc);
            });
        }

        const renderedOutput = template(templateContext);
        output.output = renderedOutput;

    } else {
        console.log("No template configured");
        output.output = output.body;
    }

    console.log(`Recursively creating dir ${pathInfo.dir}`);
    fs.ensureDirSync(pathInfo.dir);

    console.log(`Writing file to ${fullPath}`)

    fs.writeFileSync(fullPath, output.output);
    console.log("Done");
}

const publishOutputs = (allOutputs) => {
    allOutputs.forEach(publishOutput);
};

module.exports = {
    publishOutputs: publishOutputs
}