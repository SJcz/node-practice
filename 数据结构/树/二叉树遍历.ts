type TreeNode = {
    value: number
    left: TreeNode,
    right: TreeNode
}


function 前序遍历(node: TreeNode, arr: TreeNode[]) {
	if (!node) return arr
	arr.push(node) // 业务处理
	if (node.left) {
		前序遍历(node.left, arr)
	}
	if (node.right) {
		前序遍历(node.right, arr)
	}
}

function 中序遍历(node: TreeNode, arr: TreeNode[]) {
	if (!node) return arr
	if (node.left) {
		中序遍历(node.left, arr)
	}
	arr.push(node) // 业务处理
	if (node.right) {
		中序遍历(node.right, arr)
	}
}

function 后序遍历(node: TreeNode, arr: TreeNode[]) {
	if (!node) return arr
	if (node.left) {
		后序遍历(node.left, arr)
	}
	if (node.right) {
		后序遍历(node.right, arr)
	}
	arr.push(node) // 业务处理
}


function 层序遍历(node: TreeNode, arr: TreeNode[]) {
	if (!node) return arr
	const queue = [node]
	while(queue.length > 0) {
		const size = queue.length
		for (let i = 0; i < size; i++) {
			const n = queue.shift()
			arr.push(n)
			if (n.left) queue.push(n.left)
			if (n.right) queue.push(n.right)
		}
	}
}
