const context = require('./context');

test('add and get context value', () => {
    context.addContext('testKey', 'testVal');
    expect(context.getContext('testKey')).toEqual(['testVal']);
});

test('adding multiple values to same context key', () => {
    context.addContext('testKey2', 'testVal1');
    context.addContext('testKey2', 'testVal2');

    expect(context.getContext('testKey2')).toEqual(['testVal1', 'testVal2']);
});