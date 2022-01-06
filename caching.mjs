/**
 * Requirements
 * 1. when a function is called, it should return some cache if already caching is done
 * 2. decorator design pattern
 */

const cacher = (() => {
    function cacher(func) {
        const cache = new Map();
        return function(...args) {
            const context = this;
            const argString = args.join(",");
            const weakMapKey = func.name + "(" + argString + ")";

            if(cache.has(weakMapKey)) {
                console.log("--from cache--");
                return cache.get(weakMapKey);
            }else{
                const result = func.call(context, ...args);
                cache.set(weakMapKey, result);
                return result;
            }
        }
    }

    return cacher;
})();
export default cacher;
