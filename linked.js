//链表
class Node {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

// 单链表
class SingleList {
    constructor() {
        this.size = 0;  // 单链表的长度
        this.head = new Node('head');  // 表头节点
        this.currNode = '';  // 当前节点的指向
    }

    // 判断单链表是否为空
    isEmpty() {
        return this.size === 0;
    }

    // 获取单链表的最后一个节点
    findLast() {
        let currNode = this.head;

        while (currNode.next) {
            currNode = currNode.next;
        }

        return currNode;
    }

    // 单链表的遍历显示
    display() {
        let result = '';
        let currNode = this.head;

        while (currNode) {
            result += currNode.data;
            currNode = currNode.next;
            if(currNode) {
                result += '->';
            }
        }
        console.log(result);
    }

    // 从当前位置向前移动 n 个节点。
    advance(n, currNode = this.head) {
        this.currNode = currNode;

        while ((n--) && this.currNode.next) {
            this.currNode = this.currNode.next;
        }

        return this.currNode;
    }

    // 在单链表中寻找item元素
    find(item) {
        let currNode = this.head;

        while (currNode && (currNode.data !== item)) {
            currNode = currNode.next;
        }

        return currNode;
    }

    // 显示当前节点
    show() {
        console.log(this.currNode.data);
    }

    // 获取单链表的长度
    getLength() {
        return this.size;
    }

    // 向单链表中插入元素
    insert(item, element) {
        let itemNode = this.find(item);

        if(!itemNode) {  // 如果item元素不存在
            return;
        }

        let newNode = new Node(element);

        newNode.next = itemNode.next; // 若currNode为最后一个节点，则currNode.next为空
        itemNode.next = newNode;
       
        this.size++;
    }

    // 在单链表中删除一个节点
    remove(item) {
        if(!this.find(item)) {  // item元素在单链表中不存在时
            return;
        }

        // 企图删除头结点
        if (item === 'head') {
            if (!(this.isEmpty())) {
                return;
            } else {
                this.head.next = null;
                return;
            }
        }

        let currNode = this.head;

        while (currNode.next.data !== item) {
            // 企图删除不存在的节点
            if (!currNode.next) {
                return;
            }
            currNode = currNode.next;
        }


        currNode.next = currNode.next.next;
        this.size--;
    }

    // 在单链表的尾部添加元素
    append(element) {
        let currNode = this.findLast();
        let newNode = new Node(element);

        currNode.next = newNode;
        this.size++;
    }

    // 清空单链表
    clear() {
        this.head.next = null;
        this.size = 0;
    }
}


let myList = new SingleList();
console.log(myList)
let arr = [3, 4, 5, 6, 7, 8, 9];

for(let i=0; i<arr.length; i++){
    myList.append(arr[i]);
}
console.log(myList)

myList.display();  // head->3->4->5->6->7->8->9

console.log(myList.find(4));  // Node {data: 4, prev: null, next: Node}

myList.insert(9, 9.1);
myList.insert(3, 3.1);
myList.display();  // head->3->3.1->4->5->6->7->8->9->9.1

myList.remove(9.1);
myList.remove(3);
myList.display();  // head->3.1->4->5->6->7->8->9

console.log(myList.findLast());  // Node {data: 9, prev: null, next: null}

console.log(myList.advance(4));  // Node {data: 6, prev: null, next: Node}

console.log(myList.getLength());  // 7

myList.clear();
myList.display();  // head

//构建环形链表
var myList = new SingleList()
var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

arr.forEach(item => myList.append(item))

var C = myList.find('C')
var G = myList.findLast()
G.next = C

//判断是否有环
function isLoop (list) {
    // 使用快慢指针
    var p = list.head
    var q = list.head
  
    while (q) {
      p = p.next
      if (p.next) {
        q = q.next.next
      }
      if (p === q) {
        console.log('this list has rings')
        return
      }
    }
    console.log('this list has no rings')
  }
  
  isLoop(myList)

  //判断链表环的长度
// 2、如果链表有环，如何判断链表环的长度
    // 环长=每一次的速度差*前进次数
    function listCircleLength(root) {
        let p1 = root;
        let p2 = root;

        let meetCount = 0;//第几次相遇
        let length = 0; // 环长度
        while (p2 !== null && p2.next !== null) {
            p1 = p1.next;
            p2 = p2.next.next;
            // 第一相遇后，累计前进次数
            if (meetCount === 1) {
                length++
            }
            if (p1 === p2) {
                meetCount++
                // 第二次相遇，终止循环
                if (meetCount === 2) {
                    break;
                }
            }
        }
        if (meetCount === 0){
            return 0
        }
        // 环长=每一次的速度差*前进次数
        return 1*length;
    }

    console.log('链表环的长度:',listCircleLength(p1))

// 3、如果链表有环，入环节点是哪个
    // 公式推导：D = (n-1)(s1+s2)+s2 链表头结点到入环点的距离，等于从首次相遇点绕环（n-1）圈再回到入环点的距离。
    function listCircleEnter(root) {

        let p1 = root;
        let p2 = root;

        let firstMeet = null;
        while (p2 !== null && p2.next !== null) {
            p1 = p1.next;
            p2 = p2.next.next;
            if (p1 === p2) {
                firstMeet = p1;
                break;
            }
        }
        if (firstMeet === null){
            return null;
        }

        let p3 = root;
        let p4 = firstMeet;
        while (p3 !== null && p3.next != null) {
            console.log(p3.data)
            p3 = p3.next;
            p4 = p4.next;
            if (p3 === p4) {
                return p3;
            }
        }

    }

    console.log('链表环的入环节点:', listCircleEnter(p1))

//单链表翻转
//第一种
const reverseList = function(head) {
    let q = null;
    return r(head, q);
}
const r = function(p, q) {
    return p === null ? q : r(p.next, { val: p.val, next: q });
}

//第二种
const reverseList = (head, q = null) => {
    (head === null ? q : reverseList(head.next, { val: head.val, next: q }));
}

