import Git from 'nodegit';
import moment from 'moment';

import { Graph } from '../graph.js';
import { Prerenderer } from '../prerender.js';
import RenderContext from '../renderContext.js';
import * as log from '../../util/log';

export default class BuildInfoPrerenderer implements Prerenderer {

    async run(graph: Graph, context: RenderContext): Promise<void> {
        // Load the repo
        const repo = await Git.Repository.open(".")
        const commit = await repo.getHeadCommit();

        const commitInfo = {
            year: moment().format('YYYY'),
            date: moment(commit.timeMs()).format('YYYY/MM/DD'),
            url: 'https://github.com/jaysee00', // TODO: Add link to exact commit
            hash: commit.id().toString(),
            shortHash: commit.id().toString().slice(0, 6)
        };
        log.alert(`> Running build against ${commitInfo.shortHash}, committed on ${commitInfo.date}`);
        context.set('buildInfo', commitInfo);
    }
}
