import Dep from './dep.js'

class Observer {
  constructor(value) {
    this.walk(value)
  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        this.walk(obj[key])
      }
      defineReactive(obj, key, obj[key])
    })
  }
}

const defineReactive = (obj, key, value) => {
  let dep = new Dep() //实例化一个依赖收集器
  Object.defineProperty(obj, key, {
    set(newVal) {
      if (newVal === value) return
      value = newVal
      dep.notify() //通知依赖更新数据
    },
    get() {
      if (Dep.target) dep.addDepend() //添加依赖收集
      return value
    }
  })
}

export default function observer(value) {
  if (!value || typeof value !== 'object') return
  return new Observer(value)
}