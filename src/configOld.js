const moment = require('moment');

const config = {
    srcDir: "./content",
    outDir: "./build",
    assetsDir: "./assets",
    behaviours: {
        "home": {
            outPath: "index.html",
            template: "home",
            crumbs: [{
                name: "home",
                href: "/"
            }]
        },
        "travelBlog": {
            crumbs: (node) => {
                // TODO: Don't duplicate this with the `outPath` func
                const publishDate = moment(node.attributes.date, 'YYYY-MM-DD').format('YYYY/MM/DD');
                return [{
                        name: "home",
                        href: "/"
                    },
                    {
                        name: "travel",
                        href: "/travel"
                    },
                    {
                        name: node.attributes.title,
                        href: `/travel/${publishDate}/${node.fileName}.html`
                    }
                ];
            },
            outPath: (node) => {
                const publishDate = moment(node.attributes.date, 'YYYY-MM-DD').format('YYYY/MM/DD');
                return `travel/${publishDate}/${node.fileName}.html`;
            },
            template: "travelBlog",
            context: {
                exports: [{
                    key: "travelBlogs",
                    putFunc: (node) => {
                        return node;
                    }
                }]
            }
        },
        "travel": {
            crumbs: [{
                    name: "home",
                    href: "/"
                },
                {
                    name: "travel",
                    href: "/travel"
                }
            ],
            outPath: "travel/index.html",
            template: "travel",
            context: {
                imports: [{
                    key: "travelBlogs",
                    filterFunc: null, // TODO: Slice top 10 blogs.
                    sortFunc: (nodeA, nodeB) => {
                        if (nodeA.attributes.date > nodeB.attributes.date) {
                            return -1;
                        } else if (nodeA.attributes.date < nodeB.attributes.date) {
                            return 1;
                        } else {
                            return 0;
                        }
                    },
                }]
            }
        },
        "portfolio": {
            outPath: "portfolio/index.html",
            template: "portfolio",
            context: {
                imports: [{
                    key: "portfolioBlogs"
                }]
            }
        },
        "portfolioBlog": {
            outPath: (node) => {
                return `portfolio/${node.fileName}.html`;
            },
            template: "portfolioBlog",
            context: {
                exports: [{
                    key: "portfolioBlogs",
                    putFunc: (node) => {
                        return node;
                    }
                }]
            },
        }
    }
}

module.exports = config