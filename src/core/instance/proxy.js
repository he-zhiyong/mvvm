export default function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    configurable: true,
    set(newVal) {
      target[sourceKey][key] = newVal
    },
    get() {
      return target[sourceKey][key]
    }
  })
}