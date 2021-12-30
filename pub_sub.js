/**
 * Requirements
 * 1. a behavioural pattern, which is a great way that allows objects to communicate with one another, without depending on each other
 * 2. it implements a module, which contains the subscrbed callbacks
 * 3. subscribe, unsubscribe and publish function
 */

class PubSub {
    topics = {}

    publish(topic, data) {
        if(!this.topics[topic]) {
            return;
        }
        this.topics[topic].forEach(callback => callback(data));
    }

    subscribe(topic, callback) {
        if(!this.topics[topic]) {
            this.topics[topic] = [];
        }

        this.topics[topic].push(callback);
        return {
            unsubscribe: () => {
                const index = this.topics[topic].indexOf(callback);
                if(index !== -1) {
                    this.topics[topic].splice(index, 1);
                }
            }
        }
    }
}

//testing

const pubsub = new PubSub();

const hello = pubsub.subscribe('hello', function(data) {
    console.log('hello ' + data);
});

const world = pubsub.subscribe('world', function(data) {
    console.log('world ' + data);
});

let hello2 = null;
for(let i=0; i < 20; i++) {
    if(i == 5) {
        world.unsubscribe();
    }
    if(i == 10) {
        hello2 = pubsub.subscribe('hello', function(data) {
            console.log('hello2 ' + data);
        });
    }

    if(i == 15) {
        hello.unsubscribe();
        hello2.unsubscribe();
    }

    if(i % 2 == 0) {
        pubsub.publish('hello', i);
    }else{
        pubsub.publish('world', i);
    }
    pubsub.publish('another', i);
}