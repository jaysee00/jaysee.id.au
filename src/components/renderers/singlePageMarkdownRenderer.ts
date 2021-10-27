import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';

import config, { GraphItemFilter, RenderDef } from "../../config";
import { Graph, GraphItem } from '../graph';
import RenderContext from "../renderContext";
import { Renderer } from "../renderer";
import * as log from '../../util/log';

/** Temp Handlebars stuff */
// TODO: Move handlebars logic to a separate module.
const compileTemplate = (templatePath: string) => {
    return Handlebars.compile(fs.readFileSync(path.join('./templates', templatePath), 'utf-8'));
}

// Configure handlebars
// TODO: Make this dynamic.
Handlebars.registerPartial("page", compileTemplate('partials/page.hbs'));
Handlebars.registerPartial("header", compileTemplate('partials/header.hbs'));
Handlebars.registerPartial("breadcrumb", compileTemplate('partials/breadcrumb.hbs'));
Handlebars.registerPartial("footer", compileTemplate('partials/footer.hbs'));
Handlebars.registerPartial("bodyDefault", compileTemplate('partials/bodyDefault.hbs'));
Handlebars.registerPartial("travelBlogsBody", compileTemplate('partials/travelBlogsBody.hbs'));
Handlebars.registerPartial("portfolioBody", compileTemplate('partials/portfolioBody.hbs'));
Handlebars.registerPartial("portfolioBlogsBody", compileTemplate('partials/portfolioBlogsBody.hbs'));
Handlebars.registerPartial("blog", compileTemplate('layouts/blog.hbs'));
Handlebars.registerPartial("home", compileTemplate('layouts/home.hbs'));

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
Handlebars.registerHelper("breadcrumbMatch", (path, crumb) => {
    if (crumb === "/") {
        return path === "index.html";
    } else {
        return ("/" + path).startsWith(crumb);
    }
});

/** End */


export class SinglePageMarkdownRenderer implements Renderer {

    name: string;
    filter: GraphItemFilter;
    options: any;

    constructor(def: RenderDef) {
        this.name = def.name;
        this.filter = def.filter;
        this.options = def.options;
    }

    getItemRenderer(inputGraph: Graph, outputGraph: Graph, context: RenderContext): (arg0: GraphItem) => void {
        // TODO: Compile template on construction?
        const template = compileTemplate(this.options.template);

        return (item: GraphItem) => {
            if (this.options.crumbs) {
                if (typeof this.options.crumbs === "function") {
                    context.set('crumbs', this.options.crumbs(item));
                } 
                else {
                    context.set('crumbs', this.options.crumbs);
                }
            }
            // Render
            const templateContext = context.smoosh(item.context);
            const renderedOutput = template(templateContext.hbsIt());

            // Push to output graph
            const outputPath = path.join(config.outDir, './index.html');

            const renderedItem = new GraphItem(outputPath, config.outDir, true, false);
            renderedItem.getContents = () => Buffer.from(renderedOutput);

            outputGraph.add(renderedItem);
        }
    }

    run(inputGraph: Graph, outputGraph: Graph, context: RenderContext) {

        log.msg(`Running ${this.name} Single Page Markdown renderer`);
        inputGraph.filter(this.filter).visit(this.getItemRenderer(inputGraph, outputGraph, context.clone()))
    }

}