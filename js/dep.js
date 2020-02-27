//发布者
class Dep{
  constructor() {
    this.subs = []        //队列数组
    this.target = null    //预订加入队列的观察者空位
  }

  addSub(sub) {   //添加观察者
    this.subs.push(sub)
  }
  
  notify() {      //发布通知给所有观察者
    this.subs.forEach(sub => {
      sub.update()
    });
  }
}