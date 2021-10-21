export type ConfigDef = {
    srcDir: string,
    assetsDir: string,
    outDir: string,
    preprocess: PreprocessorDef[]
};

export type GraphItemFilter = {
    include: string,
    exclude: string
}

export type PreprocessorDef = {
    name: string,
    type: string,
    filter: GraphItemFilter,
    options?: any
};

const config: ConfigDef = {
    srcDir: "./content",
    outDir: "./build",
    assetsDir: "./assets",
    preprocess: [
        {
            name: 'minifyCss',
            type: 'cssPreprocessor',
            filter: {
                include: '*.css',
                exclude: '*.min.css'
            }
        }
    ]
}

export default config;