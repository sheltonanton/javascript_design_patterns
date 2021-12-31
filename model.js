/**
 * Requirements - the new model should use Model.extend() to create a class Object for model
 * new Model with properties (mapping with attributes to its values) should create a new instance of the extended model
 * deleting property on this object is not allowed
 * defining property on this object is not allowed
 * Model.extend(name, [object]) - argument should be object
 * object has listen and remove listener to add or remove listeners to the model object
 * ModelObserver is to be extended and handle ui changes in update() hook after calling modelObject.listen(this)
 * callback function could be also passed as argument to listen
*/

import { Subject, Observer } from './observer.mjs';

const Model = (() => {
    let blockInstantiation = true;
    class Model extends Subject {
        constructor(name, attributes, ...values) {
            super();
            if(blockInstantiation) {
                throw new Error("Cannot intantiate the Model directly, use new Model.extend()");
            }

            if(values != null) {
                const validObjects = values.every(value => typeof value === "object");
                if(! validObjects) {
                    throw new Error("all arguments in constructor should be a valid object");
                }

                values = Object.assign({}, ...values);
                const invalidKey = Object.keys(values).find(key => (!attributes.hasOwnProperty(key)));
                if(invalidKey) {
                    throw new Error(`invalid attribute supplied - '${invalidKey}'`);
                }
                //test for the type of attributes lies here
            }else{
                values = {};
            }

            this._values = values;
            this._attributes = attributes;
            this._name = name;
        }

        listen(listener) {
            if(listener instanceof ModelObserver) {
                this.subscribe(listener);
                return listener;
            }else if(typeof listener === "function") {
                const modelObserver = new ModelObserver(listener);
                this.subscribe(modelObserver);
                return modelObserver;
            }else{
                throw new Error(`${listener} is a valid function or a ModelObserver`);
            }
        }

        removeListener(listener) {
            return this.unsubscribe(listener);
        }
    
        static extend(name, attributes) {
            if(typeof attributes !== "object" || attributes === null) {
                throw new Error("Not a valid object extension");
            }
            attributes = Object.assign({}, attributes);
            
            const objectHandlers = {
                _getModel: function() {
                    return `Model<${name}>`;
                },
                _getProperty: function(property) {
                    return `property<'${property}'>`;
                },
                set: function(target, property, value) {
                    const old = target._values[property];
                    const result = Reflect.set(target._values, property, value);

                    target.notify({
                        attribute: property,
                        old,
                        new: value
                    });

                    return result;
                },
                defineProperty: function(target, property, value) {
                    if(!attributes.hasOwnProperty(property)) {
                        return Reflect.defineProperty(target, property, value);
                    }else{
                        throw new Error(
                            `Defining ${this._getProperty(property)} same as ` +
                            `attributes of ${this._getModel()} is not allowed`
                        );
                    }
                },
                deleteProperty: function() {
                    throw new Error(
                        `Deletion of attributes of ${this._getModel()} is not allowed`
                    );
                }
            }

            const handlers = {
                construct: function(target, args) {
                    blockInstantiation = false;
                    const instance = new Proxy(
                        new target(name, attributes, ...args),
                        objectHandlers
                    );
                    blockInstantiation = true;
                    return instance;
                }
            };
    
            return new Proxy(Model, handlers);
        }
    }

    return Model;
})();

export class ModelObserver extends Observer {
    constructor(callback) {
        super();
        this._callback = callback;
    }

    update(data) {
        if(typeof this._callback === "function") {
            this._callback(data);
        }
    }
}

export default Model;
