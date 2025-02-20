class Queue {
    current = null;
    waiting = [];

    constructor(initial) {
        if (initial instanceof Array) {
            let [ cur, ...wait ] = initial;
            this.current = cur;
            this.waiting = wait || this.waiting;
        } else {
            this.current = initial;
        }
    }

    push(o) {
        if (this.current == null) {
            this.current = o;
        } else {
            this.waiting.push(o);
        }
    }

    next() {
        let q = this.waiting;
        if (q.length == 0) {
            this.current = null;
        } else {
            this.current = q[0];
            this.waiting = q.slice(1, q.length - 1);
        }
        return this.current;
    }
}

export default Queue;