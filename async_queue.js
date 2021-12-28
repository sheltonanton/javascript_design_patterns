/**
 * Requirements - 
 * 1. a queue needs to be maintained for sending and receiving asynchronous events
 * 2. any number of queue items can be listened for by listeners.
 * 3. when any event is generated, it looks for already listening promise and resolve it with that value in order
 * 4. when there isn't already listening promise, the value is stored in the queue, and any listener can pop this asynchronously with promise wrapper
 * 5. after termination, all pending promises should be resolved with EOD (End of Data) static value
 * 6. all the incoming events should be thrown as an Error, where the event pushing take place
 */

const AsyncQueue = (() => {
    const EOD = Symbol("EOD");
    class AsyncQueue {
        constructor() {
            this.queue = [];
            this.resolvers = [];
            this.closed = false;
        }

        enqueue(data) {
            if(this.closed) {
                throw new Error("AsyncQueue is closed indefinitely");
            }else if(this.resolvers.length > 0) {
                const resolver = this.resolvers.shift();
                resolver(data);
            }else{
                this.queue.push(data);
            }
        }

        dequeue() {
            if(this.queue.length > 0) {
                return Promise.resolve(this.queue.shift());
            }else if(this.closed) {
                return Promise.resolve(EOD);
            }else {
                return new Promise((resolve) => {
                    this.resolvers.push(resolve);
                });
            }
        }

        [Symbol.asyncIterator]() {
            return this;
        }

        close() {
            while(this.resolvers.length > 0) {
                const resolver = this.resolvers.shift();
                resolver(EOD);
            }
            this.closed = true;
        }

        isEOD(symbol) {
            return this.EOD === symbol;
        }

        next() {
            return this.dequeue().then(value => (this.isEOD(value))? { value: undefined, done: true } : { value: value, done: false });
        }
    }

    return AsyncQueue;
})();


const queue = new AsyncQueue();
for(let i=0; i < 10; i++) {
    setTimeout(() => {
        queue.enqueue(i);
    }, Math.random() * 10000);
}

const execute = async () => {
    let count = 0;
    for await(const data of queue) {
        console.log(data);
        count += 1;
        if(count == 10) {
            break;
        }
    }
}

execute();