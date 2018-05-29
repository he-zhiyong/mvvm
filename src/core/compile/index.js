export default class compiler {
  constructor(el, vm) {
    vm.$el = document.querySelector(el)
    let fragment = document.createDocumentFragment()
    this.replace(vm.$el, vm)
  }
  replace(frag, vm) {
    Array.from(frag.childNodes).forEach(node => {
      let txt = node.textContent
      let reg = /\{\{(.*?)\}\}/ // 正则匹配{{}}

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
          let exp = attr.value
          if (name.includes('v-')) {
            node.value = vm[exp]
          }
          vm.$watch(exp, newVal => {
            node.value = newVal
          })
          node.addEventListener('input', e => {
            let newVal = e.target.value
            let arr = exp.split('.')
            let val = vm
            arr.forEach((key, index) => {
              if (index === arr.length - 1) {
                val[key] = newVal
                return
              }
              val = val[key]
            })
          })
        })
      }

      if (node.childNodes && node.childNodes.length) {
        this.replace(node, vm)
      }
    })
  }
}