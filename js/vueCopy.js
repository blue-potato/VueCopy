class VueCopy {
  constructor (options) {
    this.data = options.data
    this.methods = options.methods
    Object.keys(this.data).forEach(key => {
      this.proxyKeys(key)
    })
    
    this.dep = new Dep()             //创建订阅者队列
    
    new Observer(this.data, this.dep)  //创建发布者

    new Compile(options.el, this)   //创建编译模板
    
    options.mounted.call(this)      //mounted
  }
  proxyKeys(key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function getter() {
        return this.data[key]
      },
      set: function(newVal) {
        this.data[key] = newVal
      },
    }) 
  }
}
