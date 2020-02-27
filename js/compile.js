class Compile{
  constructor (el, vm) {
    this.vm = vm
    this.el = document.querySelector(el)
    this.fragment = null
    this.init()
  }

  init() {
    //1.创建文档片段
    this.fragment = this.nodeToFragment(this.el)
    //2.编译文档片段中的指令
    this.compile(this.fragment)
    //3.将fragment移入到真实dom中
    this.el.appendChild(this.fragment)
  }

  //创建fragment文档片段
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild
    //循环把el上的节点移入到fragment上
    while(child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }

  //编译所有指令
  compile(fragment){
    let childNodes = [].slice.call(fragment.childNodes)
    childNodes.forEach(node => {
      this.compileDirective(node)

      //递归遍历子节点
      if(node.childNodes && node.childNodes.length) { 
        this.compile(node)
      }
    })
  } 
  
  //判断nodeType类型进行对应的指令编译
  compileDirective(node) {
    switch(node.nodeType) {
      case 1:       //元素节点
        this.compileElement(node)
        break;
      case 3:       //文本节点
        this.compileText(node)
        break;
    }
  }
  //编译元素节点
  compileElement(node) {
    let nodeAttrs = node.attributes
    Array.prototype.forEach.call(nodeAttrs, attr => {
      let attrName = attr.name
      if(attrName.indexOf('v-') == 0){  //判断是否指令是否以v-开头
        switch(attrName) {
          case 'v-model':
            this.compileModel(node, attr)
            break;
          case 'v-on:click':
            this.compileEvent(node, attr)
            break;
        }
        node.removeAttribute(attrName)
      }
    })
  }
  //解析事件
  compileEvent(node, attr) {
    //1.获取事件方法体  
    let cb = attr.value && this.vm.methods[attr.value];
    //2.获取触发事件类型
    let eventType = attr.name.split(':')[1]
    //3.绑定事件
    if(cb) {
      node.addEventListener(eventType, cb.bind(this.vm))
    }
  }
  //解析v-model
  compileModel(node, attr) {
    //1. 数据同步到input的value值
    let val = this.vm[attr.value]
    this.modelUpdater(node, val)

    //2. 添加观察者
    new Watcher(this.vm, attr.value, (newVal) => {
      this.modelUpdater(node, newVal)
    })
    
    //3.监听input框的值得变化  同步data中的数据
    node.addEventListener('input', (e) => {
      let newVal = e.target.value;
      if(val === newVal) return
      this.vm[attr.value] = newVal
      val = newVal
    })
  }
  modelUpdater(node, value) {
    node.value = typeof value == 'undefined' ? '' : value
  }

  //编译文本节点
  compileText(node) {
    //1.验证文本节点中的指令
    let text = node.textContent
    let reg = /\{\{(.*)\}\}/
    if(!reg.test(text)) return

    //2.取出{{}}指令中对应的值
    let exp = reg.exec(text)[1]
    let initText = this.vm.data[exp]

    //3. 将数据初始化到视图中
    this.updateText(node, initText)

    //4.添加观察者
    new Watcher(this.vm, exp, (newVal) => {
      this.updateText(node, newVal)
    })
  }
  updateText(node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value
  }
}