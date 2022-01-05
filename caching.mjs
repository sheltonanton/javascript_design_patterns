/**
 * Requirements
 * 1. when a function is called, it should return some cache if already caching is done
 * 2. decorator design pattern
 */

const cacher = (() => {
    function cacher(func) {
        const cache = new WeakMap();
        return function(...args) {
            const context = this;
            const argString = args.join(",");
            const weakMapKey = func.name + "(" + argString + ")";
            if(cache.has(weakMapKey)) {
                console.log("--from cache--");
                return cache.get(weakMapKey);
            }else{
                return func.apply(context, args);
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
    return n * factorial(n-1);
}

factorial = cacher(factorial);
console.log(factorial(10));
console.log(factorial(9));
