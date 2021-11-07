import {Graph, GraphItem} from './graph';

/**
 * - Test GraphItem
 *      - visit
 *      - getContents
 *      - add
 *      - clone
 * - Test graph:
 *      - add
 *      - filter
 *      - visit
 */

test('add item as child of graph', () => {
    const g = new Graph([] as GraphItem[]);
    const testItem = new GraphItem('/tmp', '/tmp', false, true, new Array<GraphItem>());
    
    g.add(testItem);
    expect(g.items.length).toEqual(1);
    expect(g.items[0].fileName).toEqual('tmp');
});

test('add item with intermediate children', () => {
    const g = new Graph([new GraphItem('/tmp', '/tmp', false, true, [] as GraphItem[])]);

    const testItem = new GraphItem('/tmp/images/file.txt', '/tmp', true, false);
    g.add(testItem);

    expect(g.items[0].items.length).toEqual(1);
    expect(g.items[0].items[0].fileName).toEqual('images');
    expect(g.items[0].items[0].items[0].fileName).toEqual('file.txt');
});

test('add multiple descendents', () => {
    const g = new Graph([new GraphItem('/tmp', '/tmp', false, true, [] as GraphItem[])]);

    const testItems = [
        new GraphItem('/tmp/images/pic.jpg', '/tmp', true, false),
        new GraphItem('/tmp/images/a.png', '/tmp', true, false),
        new GraphItem('/tmp/images/fool.bmp', '/tmp', true, false),
    ];
    testItems.forEach((i) => g.add(i));

    expect(g.items.length).toEqual(1);
    expect(g.items[0].items.length).toEqual(1);
    expect(g.items[0].items[0].items.length).toEqual(3);
});

