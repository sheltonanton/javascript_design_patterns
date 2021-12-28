/**
 * Requirements - 
 * 1. a queue needs to be maintained for sending and receiving asynchronous events
 * 2. any number of queue items can be listened for by listeners.
 * 3. when any event is generated, it looks for already listening promise and resolve it with that value in order
 * 4. when there isn't already listening promise, the value is stored in the queue, and any listener can pop this asynchronously with promise wrapper
 * 5. after termination, all pending promises should be resolved with EOD (End of Data) static value
 * 6. all the incoming events should be thrown as an Error, where the event pushing take place
 */