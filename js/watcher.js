/**
 * 观察者
 * @param {Object} vm  Vue实例 
 * @param {String} exp data属性名称
 * @param {Function} cb 回调函数
 */
class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.get()
  }

  update() {  //数据更新
    let newVal = this.vm.data[this.exp]
    let oldVal = this.value
    if(newVal !== oldVal) {
      //1. 缓存最近一次更改的数据
      this.value = newVal
      //2. 通过call执行回调, 并把最新缓存的值抛回去
      this.cb.call(this.vm, newVal)
    }
  }
  
  get() {
    //1. 向订阅者添加预订位
    this.vm.dep.target = this
    //2. 通过vue实例 缓存data中的数据 -> 并同时触发observer中的get方法 -> 完成订阅者添加观察者的行为 
    let value = this.vm.data[this.exp]
    //3. 清楚订阅者的预定位
    this.vm.dep.target = null
    //4. 返回当前观察对象的缓存数据
    return this.value
  }
}