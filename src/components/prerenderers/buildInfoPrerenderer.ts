import git from 'isomorphic-git';
import moment from 'moment';
import fs from 'fs';

import { Graph } from '../graph.js';
import { Prerenderer } from '../prerender.js';
import RenderContext from '../renderContext.js';
import * as log from '../../util/log';

export default class BuildInfoPrerenderer implements Prerenderer {

    async run(graph: Graph, context: RenderContext): Promise<void> {
        // Load the repo
        const sha = await git.resolveRef({fs, dir: ".", ref: "HEAD"});
        log.msg(`> Current commit SHA: ${sha}`);
        const {commit} = await git.readCommit({fs, dir: ".", oid: sha});

        const commitInfo = {
            year: moment().format('YYYY'),
            date: moment(commit.author.timestamp * 1000).format('YYYY/MM/DD'),
            url: 'https://github.com/jaysee00', // TODO: Add link to exact commit
            hash: sha,
            shortHash: sha.slice(0, 6)
        };
        log.alert(`> Running build against ${commitInfo.shortHash}, committed on ${commitInfo.date}`);
        context.set('buildInfo', commitInfo);
    }
}
