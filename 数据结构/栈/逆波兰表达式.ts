function 中缀表达式转后缀表达式(str: string) { 
	const splitArr = str.split('')
	const strArr = []
	for (let i = 0; i < splitArr.length; i++) { 
		if (是否算术符号(splitArr[i])) {
			strArr.push(splitArr[i])
		} else { 
			let topChat = strArr.pop() || ''
			if (是否算术符号(topChat)) {
				strArr.push(topChat)
				strArr.push(splitArr[i])
			} else { 
				topChat += splitArr[i]
				strArr.push(topChat)
			}
		}
	}
  
	const stack = []
	const newStrArr = []
	for (let i = 0; i < strArr.length; i++) { 
		if (!是否算术符号(strArr[i])) {
			newStrArr.push(strArr[i])
		} else { 
			处理右括号或者优先级小于栈顶元素(strArr[i], stack, newStrArr)
		}
	}
	let topChat = stack.pop()
	while (topChat) { 
		newStrArr.push(topChat)
		topChat = stack.pop()
	}
	
	return newStrArr
}

function 逆波兰表达式计算(str: string) { 
	const translateArr = 中缀表达式转后缀表达式(str)
	const stack = []
	for (let i = 0; i < translateArr.length; i++) { 
		if (是否算术符号(translateArr[i])) {
			const right = Number(stack.pop())
			const left = Number(stack.pop())
			let result
			if (translateArr[i] == '+') { 
				result = left + right
			}
			if (translateArr[i] == '-') { 
				result = left - right
			}
			if (translateArr[i] == '*') { 
				result = left * right
			}
			if (translateArr[i] == '/') { 
				result = left / right
			}
			stack.push(result)
		} else { 
			stack.push(translateArr[i])
		}
	}

	return stack.pop()
}

function 是否算术符号(chat: string) { 
	return ['+', '-', '*', '/', '(', ')'].includes(chat)
}

function 处理右括号或者优先级小于栈顶元素(chat: string, stack: string[], newStrArr: string[]) { 
	if (chat === ')') { 
		let topChat = stack.pop()
		while (topChat && topChat !== '(') { 
			newStrArr.push(topChat)
			topChat = stack.pop()
		}
		return
	}
	if (chat == '+' || chat == '-') { 
		let topChat = stack[stack.length - 1]
		if (topChat === '*' || topChat === '/') {
			topChat = stack.pop()
			while (topChat === '*' || topChat === '/' || topChat === '+' || topChat === '-') {
				newStrArr.push(topChat)
				topChat = stack.pop()
			}
			if (topChat) stack.push(topChat)
		}
	}
	stack.push(chat)
}

// 中缀表达式转后缀表达式('9+(3-1)*3+10/2')
逆波兰表达式计算('9+(3-1)*3+10/2')
console.log(逆波兰表达式计算('9+(3-2*2+3)*3+10/2'))