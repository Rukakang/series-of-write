//力扣
//1、剑指 Offer 10- I. 斐波那契数列
//方法一：普通递归,
function fib(n){
    if(n===0 || n===1) return n
    return fib(n-2) + fib(n-1)
}

//方法二：循环,以空间换时间,时间复杂度o(n),空间复杂度o(n)
function fib1(n){
    let arr = [0,1]
    for(let i=2;i<=n;i++){
        arr[i] = arr[i-1]+arr[i-2]
    }
    return arr[n]
}

//方法三：双指针 时间复杂度o(n),空间复杂度o(1)--动态规划，较优解
function fib2(n){
    if(n<2) return n 
    let last1 =0 ,last2=0,sum=1
    for(let i=2; i<=n;i++){
        last1 = last2
        last2 = sum
        sum = (last1+last2)%1000000007 //对1000000007取余是为了防止大数越界
    }
    return sum 
}

//方法四：递归加缓存，减少计算次数
let fibonacci = function() {
    let temp = [0, 1];
    return function(n) {
        let result = temp[n];
        if(typeof result != 'number') {
            result = fibonacci(n - 1) + fibonacci(n - 2);
            temp[n] = result; // 将每次 fibonacci(n) 的值都缓存下来
        }
        return result;
    }
}(); // 外层立即执行
//或
function fib5(n){
	let cache=[0,1]
	function _fib(n){
        console.log(n)
        console.log("-----")
        console.log(cache[n])
		if(cache[n]) {
            return cache[n]
        }else{
            cache[n] = _fib(n-1) + _fib(n-2)
            console.log("fff")
            return cache[n]
        }
		
	}
	return _fib(n)
}
let final = fib5(0)
console.log(final)