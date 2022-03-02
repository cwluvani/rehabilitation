/**
 * Reflect.get(target, name, receiver)
 * Reflect.set(target, name, value, receiver)
 * Reflect.has(obj, name)
 * Reflect.deleteProperty(obj, name)
 * Reflect.construct(target, args)
 * Reflect.getPrototypeOf(obj)
 * Reflect.setPrototypeOf(obj, newProto)
 * Reflect.apply(func, thisArgs, args)
 * Reflect.defineProperty(target, propertyKey, attributes)
 * Reflect.getOwnPropertyDescriptor(target, propertyKey)
 * Reflect.isExtensible(target)
 * Reflect.preventExtensions(target)
 * Reflect.ownKeys(target)
 */

// simple observer
const queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, { set });

function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    queuedObservers.forEach(observer => observe());
    return result;
}

// get => execute
// reduce ------   function(total, currentValue, currentIndex, arr), initialValue
const pipe = function(value) {
    const funcStack = [];
    const oproxy = new Proxy({}, {
        get(pipeObject, fnName) {
            if (fnName === 'get') {
                return funcStack.reduce(function(val, fn) {
                    return fn(val);
                }, value);
            }
            funcStack.push(window[fnName]);
            return oproxy;
        }
    });

    return oproxy;
}