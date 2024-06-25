// 线索二叉树节点设计
type BiTreeNode = {
	value: number
	left: BiTreeNode
	right: BiTreeNode
	left_tag: number // 0 表示 left 指向左孩子, 1 表示 left 指向前驱节点
	right_tag: number
}

let pre: BiTreeNode

function 中序遍历线索化二叉树(node: BiTreeNode) {
	if (!node) return

	中序遍历线索化二叉树(node.left)
	if (!node.left) {
		node.left_tag = 1
		node.left = pre
	}
	if (pre && !pre.right) {
		pre.right_tag = 1
		pre.right = node
	}
	pre = node
	中序遍历线索化二叉树(node.right)
}