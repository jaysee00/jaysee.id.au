import minimatch from 'minimatch';

const match = (path: string, pattern: string): boolean => {
    const result = minimatch(path, pattern, {matchBase: true});
    return result;
};

export default match;