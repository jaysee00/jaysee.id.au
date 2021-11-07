import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';



/** Temp Handlebars stuff */
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
        console.log(">>>>>>>>>>");
        console.log(optionalValue);
        console.log("<<<<<<<<<<<<");
    }
});
Handlebars.registerHelper("breadcrumbMatch", (path, crumb) => {
    if (crumb === "/") {
        return path === "index.html";
    } else {
        return ("/" + path).startsWith(crumb);
    }
});

const getTemplate = compileTemplate;
export default getTemplate;
