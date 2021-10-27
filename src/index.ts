import { collect } from './components/collector.js';
import { Graph } from './components/graph.js';
import { preprocess } from './components/preprocessor.js';
import { prerender } from './components/prerender.js';
import { render } from './components/renderer';
import publish from './components/publisher';
import RenderContext from './components/renderContext.js';

import * as log from './util/log.js';

log.success("Beginning publish operation");

collect()
    .then((inputGraph: Graph) => {
        return preprocess(inputGraph);  
    })
    .then((inputGraph: Graph) => {
        return prerender(inputGraph);
    })
    .then((tuple: [Graph, RenderContext]) => {
        return render(tuple[0], tuple[1]);
    })
    .then((outputGraph: Graph) => {
        return publish(outputGraph);
    })
    .then(()=> {
        log.success("DONE!");
    })
    .catch((err) => {
        throw new Error(err);
    });