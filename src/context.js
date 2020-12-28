const context = {};

const addContext = (key, value) => {
    let existing = getContext(key);
    if (existing) {
        existing.push(value);
    } else {
        context[key] = [value];
    }
};

const getContext = (key) => {
    return context[key];
};


module.exports = {
    addContext: addContext,
    getContext: getContext,
}