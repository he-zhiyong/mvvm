import {
  popTarget,
  pushTarget
} from './dep'

export default class Watcher {
  constructor(vm, expression, callBack) {
    this.vm = vm
    this.callBack = callBack
    this.expression = expression
    this.value = this.getVal()
  }
  getVal() {
    pushTarget(this)
    let val = this.vm
    this.expression.split('.').forEach(key => {
      val = val[key]
    })
    popTarget()
    return val
  }
  addDep(dep) {
    dep.addSub(this)
  }
  update() {
    let val = this.vm
    this.expression.split('.').forEach(key => {
      val = val[key]
    })
    this.callBack.call(this.vm, val)
  }
}