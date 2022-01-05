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

function factorial(n) {
    if(n == 1) {
        return 1;
    }
    return (n * factorial(n-1));
}

factorial = cacher(factorial);
console.log(factorial(10));
console.log(factorial(9));
console.log(factorial(11));
console.log(factorial(10));
