/**
 * Requirements
 * 1. a behavioural pattern, which is a great way that allows objects to communicate with one another, without depending on each other
 * 2. it implements a module, which contains the subscrbed callbacks
 * 3. subscribe, unsubscribe and publish function
 */
import Singleton from './singleton.mjs';

class PubSub extends Singleton{
    topics = {}

    publish(topic, data) {
        if(!this.topics[topic]) {
            return;
        }
        this.topics[topic].forEach(callback => {
            callback(data)
        });
    }

    subscribe(topic, callback) {
        if(callback === null || typeof callback !== 'function') {
            throw new Error("Not a valid callback function");
        }
        
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

export default PubSub;
