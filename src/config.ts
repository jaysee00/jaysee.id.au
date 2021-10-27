export type ConfigDef = {
    srcDir: string,
    assetsDir: string,
    outDir: string,
    debug: boolean,
    preprocess: PreprocessorDef[],
    prerender: PrerenderDef[],
    render: RenderDef[]
};

export type RenderDef = {
    name: string,
    type: string,
    filter: GraphItemFilter,
    options: any
}

export type GraphItemFilter = {
    include: string,
    exclude?: string
}

export type PrerenderDef = {
    name: string,
    type: string
}

export type PreprocessorDef = {
    name: string,
    type: string,
    filter: GraphItemFilter,
    options?: any
};

// TODO: Consider moving this to a JSON file.
const config: ConfigDef = {
    debug: true, // TODO: Consider making this an environment variable
    srcDir: "./content",
    outDir: "./build",
    assetsDir: "./assets",
    preprocess: [
        {
            name: 'minifyCss',
            type: 'cssPreprocessor',
            // TODO: Consider adding a condition to disable minification during local dev.
            filter: {
                // TODO: Consider making this an array of string match patterns!
                include: '*.css',
                exclude: '*.min.css'
            }
        },
        {
            name: 'frontmatter',
            type: 'fmPreprocessor',
            filter: {
                include: '*.md'
            }
        }
    ],
    prerender: [
        {
            name: 'buildInfo',
            type: 'buildInfoPrerenderer'
        }
    ],
    render: [
        {
            name: 'homePage',
            type: 'singlePageMarkdownRenderer',
            filter: {
                include: 'home.md'
            },
            options: {
                template: 'home.hbs',
                outputPath: './index.html',
                crumbs: [{
                    name: "home",
                    href: "/"
                }]
            }
        }
    ]
}

export default config;