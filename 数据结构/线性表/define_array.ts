
const MAXSIZE = 20
type int = number

/**
 * 线性表, 顺序存储
 */
class MyList_Array {
	data: int[]
	/**线性表的长度, 有效元素的个数 */
	length: number 

	constructor() { 
		this.data = new Array(MAXSIZE)
		this.length = 0
	}
	static initList() { 
		return new MyList_Array()
	}
  
	listEmpty() { 
		return this.length === 0
	}

	clearList() { 
		this.data = []
		this.length = 0
	}

	getElem(i: number) { 
		return this.data[i] // 基于数组初始内存地址, 指定偏移量的内存数据
	} 

	locateElem() { 

	}

	listInsert(i: number, value: int) { 
		if (this.length === MAXSIZE) return 'ERROR'
		if (i < 1 || i > this.length + 1) return 'ERROR'
		for (let k = this.length; k >= i; k--) { 
			this.data[k] = this.data[k - 1]
		}
		this.data[i - 1] = value
		this.length++
		return 'OK'
	}

	listDelete(i: number) { 
		if (this.length === 0) return 'ERROR'
		if (i < 1 || i > this.length) return 'ERROR'
		for (let k = i; i < this.length; k++) { 
			this.data[k - 1] = this.data[k]
		}
		this.length--
		return 'OK'
	}

	listLength() { 
		return this.length
	}
}