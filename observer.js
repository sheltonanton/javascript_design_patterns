/**
 * Requirements :-
 * 
 * 1. it should maintain a list of subscribers
 * 2. contains two component - Subject/Observer
 * 3. observers either subscribe or unsubscribe from Subject - methods - subscribe(), unsubscribe()
 * 4. when any event is generated on the subject, it notifies its observer (by calling notify() method or the callback supplied)
 * 5. an observer can subscribe to one or more events
 */

const [Subject, Observer] = (() => {
    class Subject {
        constructor() {
            const observers = new Set();
            this.actions = {
                addObserver: (observer) => observers.add(observer),
                removeObserver: (observer) => observers.delete(observer),
                updateObservers: () => observers.forEach(observer => {
                    observer.addSubject(this);
                    observer.update();
                })
            }
        }

        _validate(observer) {
            if(!(observer instanceof Observer)) {
                throw new Error("the observer supplied is not a valid type, either it should be Observer or sub-class of it");
            }
        }

        subscribe(observer) {
            this._validate(observer);
            this.actions.addObserver(observer);
        }

        unsubscribe(observer) {
            this._validate(observer);
            this.actions.removeObserver(observer);
        }

        notify() {
            this.actions.updateObservers();
        }
    }

    class Observer {
        #subject = null;

        addSubject(subject) {
            if(subject instanceof Subject) {
                this.#subject = subject;
            }
        }

        getSubject() {
            return this.#subject;
        }

        update() {
            throw new Error(`notify method is not implemented in  ${this.constructor.name} (Observer)`);
        }
    }

    return [Subject, Observer];
})();

class ReadSubject extends Subject {
    name = "read";
}

class WriteSubject extends Subject {
    name = "write";
}

class AsyncObserver extends Observer {
    constructor(name) {
        super();
        this.name = name;
    }

    update() {
        console.log(`${this.name} ${this.getSubject().name}`);
    }
}

let r = new ReadSubject();
let w = new WriteSubject();

const observers = [];
for(let i=0; i < 10; i++) {
    const observer = new AsyncObserver(i);
    r.subscribe(observer);
    w.subscribe(observer);
    observers.push(observer);
}

r.notify();
w.notify();

for(let i=0; i < 5; i++) {
    r.unsubscribe(observers[i]);
    w.unsubscribe(observers[i]);
}


for(let i=0; i < 5; i++) {
    r.unsubscribe(observers[i]);
    w.unsubscribe(observers[i]);
}

for(let i=2; i < 5; i++) {
    r.subscribe(observers[i]);
    w.subscribe(observers[i]);
}

// r.subscribe({notify: function() {
//     console.log('lol');
// }});

// r.unsubscribe({notify: function() {
//     console.log('lol');
// }});
// r.unsubscribe(Object.create(observers[2]));

r.notify();
w.notify();