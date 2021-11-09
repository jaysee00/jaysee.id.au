import moment from 'moment';

import { collect } from './components/collector.js';
import { Graph } from './components/graph.js';
import { preprocess } from './components/preprocessor.js';
import { prerender } from './components/prerender.js';
import { render } from './components/renderer';
import publish from './components/publisher';
import RenderContext from './components/renderContext.js';
import * as log from './util/log.js';
import config from './config.js';

log.ok(`Hi Joe! 👋 Building your website @ ${moment().format()}`);
if (config.debug) {
    log.alert(`Debug mode is enabled.`);
}

process.on('unhandledRejection', (error: any, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', error);
    // application specific logging, throwing an error, or other logic here
    console.log(error.stack);
});

log.stage('Collect files');
collect()
    .then((inputGraph: Graph) => {
        log.success(`Collected ${inputGraph.size()} files for site build.`);
        log.stage('Preprocess');
        return preprocess(inputGraph);  
    })
    .then((inputGraph: Graph) => {
        log.success(`Preprocessing complete.`);
        log.stage('Pre-render');
        return prerender(inputGraph);
    })
    .then((tuple: [Graph, RenderContext]) => {
        log.success('Pre-render complete.');
        log.stage('Render');
        return render(tuple[0], tuple[1]);
    })
    .then((outputGraph: Graph) => {
        log.stage('Publish');
        return publish(outputGraph);
    })
    .then(()=> {
        log.success("Site build complete. Go get 'em, tiger! 🐯");
    })
    .catch((err) => {
        throw new Error(err);
    });

   