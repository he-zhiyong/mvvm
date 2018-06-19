export default class compiler {
  constructor(el, vm) {
    vm.$el = document.querySelector(el)
    let fragment = document.createDocumentFragment()
    this.replace(vm.$el, vm)
  }
  replace(frag, vm) {
    Array.from(frag.childNodes).forEach(node => {
      let txt = node.textContent
      let reg = /\{\{(.*?)\}\}/g // 正则匹配{{}}

      if (node.nodeType === 3 && reg.test(txt)) {
        let arr = RegExp.$1.split('.')
        let val = vm
        arr.forEach(key => {
          val = val[key]
        })
        node.textContent = txt.replace(reg, val).trim()
        vm.$watch(RegExp.$1, newVal => {
          node.textContent = txt.replace(reg, newVal).trim()
        })
      }

      if (node.nodeType === 1) {
        let nodeAttr = node.attributes
        Array.from(nodeAttr).forEach(attr => {
          let name = attr.name
          //判断是否是v-model,然后做绑定数据处理
          if (name === 'v-model') {
            let exp = attr.value
            let arr = exp.split('.')
            //input初始化赋值
            let value = vm
            arr.forEach((key, index) => {
              value = value[key]
            })
            node.value = value
            //添加监听数据值变化
            vm.$watch(exp, newVal => {
              node.value = newVal
            })
            //添加事件监听input值变化
            node.addEventListener('input', e => {
              let newVal = e.target.value
              let val = vm
              arr.forEach((key, index) => {
                if (index === arr.length - 1) {
                  val[key] = newVal
                  return
                }
                val = val[key]
              })
            })
          }
        })
      }

      if (node.childNodes && node.childNodes.length) {
        this.replace(node, vm)
      }
    })
  }
}