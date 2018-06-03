import MVVM from '../../src'

new MVVM({
  el: '#app',
  data: {
    msg: 'Hello MVVM',
    value:{
      a: '这里测试双向数据绑定'
    } 
  },
  created() {
    // console.log('created!')
  },
  mounted() {
    // console.log('mounted!')
  }
})