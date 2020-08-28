export class Timeline {
    constructor() {
        this.animations = [];
        this.requestID = null;
        this.state = 'inited'
    }
    tick() {
        let t = Date.now() - this.startTime;
        let animations = this.animations.filter(animation => !animation.finished)
        for (let animation of animations) {
            let { object, property, template, start, end, duration, delay, timingFunction, addTime } = animation;

            let progression = timingFunction((t - delay - addTime) / duration) // 0-1 之间的数

            if (t > duration + delay + addTime) {
                progression = 1;
                animation.finished = true;
            }

            let value = animation.valueFromProgression(progression)
                // if (property === 'backgroundColor') {
                //     console.log(value);
                //     console.log(property);
                //     console.log(object);
                // }
            object[property] = template(value)
            console.log(property, object[property]);
        }
        if (animations.length)
            this.requestID = requestAnimationFrame(() => this.tick())
    }
    pause() {
        if (this.state !== 'playing') return;
        this.state = 'paused';
        this.pauseTime = Date.now();
        if (this.requestID)
            cancelAnimationFrame(this.requestID)
    }
    resume() {
        if (this.state !== 'paused') return;
        this.state = 'playing';
        this.startTime += Date.now() - this.pauseTime;
        this.tick();
    }
    start() {
        if (this.state !== 'inited') return;
        this.state = 'playing';
        this.startTime = Date.now();
        this.tick();
    }
    add(animation, addTime) {
        this.animations.push(animation);
        animation.finished = false;
        if (this.state === 'playing') {
            animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
        } else {
            animation.addTime = addTime !== void 0 ? addTime : 0;
        }
    }
    restart() {
        if (this.state === 'playing')
            this.pause();
        this.animations = [];
        this.requestID = null;
        this.state = 'playing';
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }
}
export class Animation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.template = template;
        this.property = property;
        this.start = start;
        this.end = end;
        this.delay = delay;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start)
    }
}
export class ColorAnimation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.template = template || (v => `rgba(${v.r},${v.g},${v.b},${v.a})`);
        this.property = property;
        this.start = start;
        this.end = end;
        this.delay = delay;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
        return {
            r: this.start.r + progression * (this.end.r - this.start.r),
            g: this.start.g + progression * (this.end.g - this.start.g),
            b: this.start.b + progression * (this.end.b - this.start.b),
            a: this.start.a + progression * (this.end.a - this.start.a),
        }
    }
}

/**
let animation = new Animation(object,property,start,end,duration,delay,timingFunction); // 属性动画
let animation2 = new Animation(object,property,start,end,duration,delay,timingFunction);
let timeline= new Timeline;
timeline.add(animation);
timeline.add(animation2);
timeline.start()
timeline.pause()
timeline.resume()
timeline.stop()
setTimeout
setInterval
requestAnimationFrame
*/
