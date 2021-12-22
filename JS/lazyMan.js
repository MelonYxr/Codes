function log (...args) {
  console.log.apply(console, args)
}

function timeout (callback, time) {
  const repeat = function (time) {
    if (time === 0) {
      callback()
      return;
    }
    log(time);
    time--;
    setTimeout(() => { repeat(time) }, 1000)
  }

  repeat(time)
}

// 任务订阅
class Task {
  constructor() {
    this.list = []
  }
  // 后面添加
  sub (method, ...args) {
    const task = {
      method,
      args
    }
    this.list.push(task)
  }
  // 前面添加
  subShift (method, ...args) {
    const task = {
      method,
      args
    }
    this.list.unshift(task)
  }

  // 发布执行任务
  publish () {
    if (this.list.length === 0) {
      return;
    }
    const { method, args } = this.list.shift();
    log('提取 任务', method.name);
    method.apply(null, args)
  }
}



const task = new Task();

// 先睡
function sleepFirst (time) {
  log(`Wake up after ${time}`)

  timeout(() => { task.publish() }, time);
}

// 睡
// 单位 秒
function sleep (time) {
  log(`sleep ${time}s. `)
  timeout(() => { task.publish() }, time);
}

function sayHi (name) {
  log(`Hi, this is ${name}`)
  task.publish()
}

function eat (msg) {
  log(`Eat ${msg}. `)
  task.publish()
}

// 订阅基础类
class Man {
  constructor(name) {
    this.name = name;
  }
  sleepFirst (time) {
    task.subShift(sleepFirst, time)
    return this;
  }
  // 单位 秒
  sleep (time) {
    task.sub(sleep, time)
    return this;
  }
  eat (msg) {
    task.sub(eat, msg)
    return this;
  }
}

const lazyMan = function (name) {
  task.sub(sayHi, name)
  setTimeout(task.publish.bind(task), 0)
  return new Man(name);
}
