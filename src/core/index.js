import proxy from './instance/proxy.js'
import initOptions from './instance/init.js'
import Compiler from './compile/index.js'
import Watcher from './observer/watcher.js'
import {
  callHook
} from './instance/lifecycle.js'

export default class MVVM {
  constructor(options = {}) {
    let vm = this
    vm.$options = options
    vm.$watch = function (key, callBack) {
      new Watcher(vm, key, callBack)
    }
    initOptions(vm)
    for (let key in vm._data) {
      proxy(vm, '_data', key)
    }
    callHook(vm, 'created')
    new Compiler(vm.$options.el, vm)
    callHook(vm, 'mounted')
  }
}
