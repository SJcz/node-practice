import { TreeNode } from '../树/二叉树遍历'

function 二叉搜索树_搜索(node: TreeNode, key: number, parent: TreeNode) {
	if (!node) {
		return [false, parent]
	}
	if (node.value === key) return [true, node]
	if (node.value > key) return 二叉搜索树_搜索(node.left, key, node)
	return 二叉搜索树_搜索(node.right, key, node)
}

function 二叉搜索树_插入(node: TreeNode, key: number) {
	const [find, parentNode] = 二叉搜索树_搜索(node, key, null)
	if (find) return node
	if (!parentNode) return { value: key }
	if (parentNode.value > key) parentNode.left = {
		value: key
	}
	if (parentNode.value < key) parentNode.right = {
		value: key
	}
	return node
}

/**
 * 这种方式的处理会导致树的高度发生较大的变化， 因此需要找一个不改变树的结构的修改方式
 * 加入我们找跟删除节点的值最接近的节点, 替换删除的节点, 那么树的结构就不会发生大的更改
 * @param node 
 * @param key 
 * @returns 
 */
function 二叉搜索树_删除(node: TreeNode, key: number) {
	const [find, parentNode] = 二叉搜索树_搜索(node, key, null)
	if (!find) return node
	if (parentNode.left.value === key) { // 左子树处理
		const findNode = parentNode.left
		let rightNode = findNode.right
		if (!rightNode) {
			parentNode.left = findNode.left
		} else {
			while(rightNode && rightNode.left) {
				rightNode = rightNode.left
			}
			rightNode.left = findNode.left
			parentNode.left = findNode.right
		}
	}
	
	return node
}

/**
 * 找值跟删除节点最近的节点, 替换删除节点
 * @param node 
 * @param key 
 */
function 二叉搜索树_删除优化(node: TreeNode, key: number, parentNode: TreeNode) {
	if (!node) return 
	if (node.value === key) return deleteNode(node, parentNode)
	if (node.value > key) return 二叉搜索树_删除优化(node.left, key, node)
	return 二叉搜索树_删除优化(node.right, key, node)
	
}

function deleteNode(node: TreeNode, parent: TreeNode) {
	const flag = parent.left == node ? 'left' : 'right'
	if (!node.left) { // 没有左子树
		parent[flag] = node.right
		return
	}
	if (!node.right) { // 没有右子树
		parent[flag] = node.left
		return
	}

	let minNode = node.left
	let minNodeParent = node
	while(minNode && minNode.right) { // 找左子树最大的一个节点
		minNodeParent = minNode
		minNode = minNode.right
	}
	if (minNodeParent !== node) {
		minNodeParent.right = minNode.left
	} else {
		minNodeParent.left = minNode.left
	}
	
	node.value = minNode.value // 直接数据替换即可
}