import RenderContext from './renderContext';

test('add and get context value', () => {

    const context = new RenderContext();

    context.set('testKey', 'testVal');
    expect(context.get('testKey')).toEqual(['testVal']);
});

test('adding multiple values to same context key', () => {
    const context = new RenderContext();

    context.set('testKey2', 'testVal1');
    context.set('testKey2', 'testVal2');

    expect(context.get('testKey2')).toEqual('testVal2');
});