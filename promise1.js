const FULLFILLED ='fullfilled'
const REJECT ='reject'
const PENDING = 'pending'

function MyPromise1(excutor){
    var _this = this
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallback=[]
    this.onRejectedCallback = []
    const  resolve = (value)=>{
        if(_this.state === PENDING){
            _this.value = value
            _this.state = FULLFILLED
            _this.onFulfilledCallback.forEach(fn=>{
                fn(_this.value)
            })
        }
    }
    const reject = (reason)=>{
        if(_this.state === PENDING){
            _this.reason =  reason
            _this.state = REJECT
            _this.onRejectedCallback.forEach(fn=>{
                fn(_this.reason)
            })
        }
    }
    try{
        excutor(resolve,reject)
    }catch (e){
        reject(e)
    }
}

MyPromise1.prototype.then = function (onFullfilled,onReject){
    let _this = this
    /* 变成函数是为了使多个then链式调用的时候，当前一个then 没有传成功函数的时候，值也可以传递给下一个then的成功函数 */
    onFullfilled = typeof onFullfilled ==='function'?onFullfilled:value=>value;
    onReject = typeof onReject === 'function' ? onReject : reason => {throw reason}
    console.log(this.state)
    let promise2 = new MyPromise1((resolve,reject)=>{
        if(this.state === FULLFILLED){
            setTimeout(()=>{
                try{
                    let x = onFullfilled(_this.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e){
                    reject(e)
                }
            })
        }
        if(this.state === REJECT){
            setTimeout(()=>{
                try {
                    let x = onReject(this.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e){
                    reject(e)
                }
            })
        }
        if(this.state === PENDING){
            _this.onFulfilledCallback.push(()=>{
                setTimeout(()=>{
                    try {
                        let x = onFullfilled(_this.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                        reject(e)
                    }
                })
            })
            _this.onRejectedCallback.push(()=>{
                setTimeout(()=>{
                    try {
                        let x = onReject(_this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                        reject(e)
                    }
                })
            })
        }
    })
    return promise2
}

const resolvePromise =(p,x,resolve,reject)=>{
    if(p===x){
        reject(new TypeError("Chaining cycle"))
    }
    if(x instanceof  MyPromise1){
        x.then(resolve,reject)
    }else{
        resolve(x)
    }
}

//promise.prototype.catch
//是 promise.prototype.then(null,reject)的别名
MyPromise1.prototype.catch = function(failCallBack){
    return this.then(undefined,failCallBack)
}

//promise.prototyp.finally
MyPromise1.prototype.finally=function (callBack){
    return this.then((value)=>{
        return MyPromise1.resolve(callBack()).then(()=>value)
    },(reason)=>{
        return MyPromise1.resolve(callBack()).then(()=>{throw reason})
    })
}

//Promise.resolve
MyPromise1.resolve = function (value){
    if(value instanceof MyPromise1){
        return value
    }
    return new MyPromise1(resolve=>resolve(value))
}

//promise.all版本一
MyPromise1.all1 = function (promiseArr){
    let result = []
    let arr = Array.from(promiseArr)
    // let index = 0  //和版本而的区别1
    return new MyPromise1((resolve,reject)=>{
        function addResult(key,value){
            result[key]= value
            //和版本二的区别二
            /*index++;
            if(index === arr.length){
                resolve(result)
            }*/
        }
        for(let i =0 ; i < arr.length; i++){
            if(arr[i] instanceof MyPromise1){
                arr[i].then(value => addResult(i,value),reason => reject(reason))
            }else{
                addResult(i,arr[i])
            }
        }
        resolve(result)//和版本二的区别3
    })
}

//promise.all版本二
MyPromise1.all2 = function (promiseArr){
    let result = []
    let arr = Array.from(promiseArr)
    let index = 0
    return new MyPromise1((resolve,reject)=>{
        function addResult(key,value){
            result[key]= value
            /* for循环是同步，all1版本直接把result返回出去，当有异步任务时，得不到异步任务的结果
            *所以加一个index计数  */
            index++
            if(index === arr.length){
                resolve(result)
            }
        }
        for(let i =0 ; i < arr.length; i++){
            if(arr[i] instanceof MyPromise1){
                arr[i].then(value => addResult(i,value),reason => reject(reason))
            }else{
                addResult(i,arr[i])
            }
        }
    })
}

let generateP = function (){
    return new MyPromise1((resolve,reject)=>{
        /*if(Math.random() > 0.5){
            setTimeout(()=>{
                console.log("generate大")
            },1000)
        }else{
            setTimeout(()=>{
                console.log("generate小")
                reject("小")
            },1000)
        }*/
        reject("小")
    })
}

let p = generateP()

//链式调用，new promise中reject会进入第二个then的失败，然后进入第三个then的成功函数，为啥？？
/*p.then((value)=>{
    console.log("then的成功函數")
    console.log(value)
},(reason)=>{
    console.log("then的失败函数")
    console.log(reason)
    return reason
}).then((value)=>{
    console.log("then的第二个成功函數")
    console.log(value)
},(reason)=>{
    console.log("then的第二个失败函数")
    console.log(reason)
})*/

//循环引用promise的场景
let p3 = p.then(value=>{
    console.log("then的成功3函数")
},reason=>{
    console.log("test1")
    console.log(reason)
    return p3 //返回自己会报错，循环引用
})

p3.then(()=>{
    console.log("成功")
},(reason)=>{
    console.log(reason)
})


//调用promise.all函数
/*function p1(){
    return new MyPromise1((resolve,reject)=>{
        setTimeout(function (){
            resolve("pa1")
        },2000)
    })
}
function p2(){
    return new MyPromise1((resolve,reject)=>{
        resolve("pa2")
    })
}
MyPromise1.all1(['a','b',p1(),p2(),'c']).then(res=>{
    console.log(res)
})

MyPromise1.all2(['a','b',p1(),p2(),'c']).then(res=>{
    console.log("all2")
    console.log(res)
})*/