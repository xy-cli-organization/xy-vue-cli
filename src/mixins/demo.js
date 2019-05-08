
// 混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。
// 混入对象可以包含任意组件选项。
// 当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。

export default {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
