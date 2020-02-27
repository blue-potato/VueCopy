//发布者
class Observer{
  constructor(data, dep) {
    if(data && typeof data == 'object'){
      this.data = data
      this.dep = dep
      this.walk(this.data)
    }
  }

  //遍历劫持data中的每一项
  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  
  //发布者的核心 添加观察者和通知各个观察者
  defineReactive(data, key, val) {
    Object.defineProperty(data, key, {
      enumerable: true,     
      configurable: true,   
      get: () => {
        if(this.dep.target){
          this.dep.addSub(this.dep.target)
        }
        return val
      },
      set: (newVal) => {
        if(newVal == val) return
        val = newVal
        this.dep.notify()
      }
    })
  }
}
