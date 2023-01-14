import { Graph_邻接矩阵表示 } from './图结构表示'

const visited: boolean[] = []

/**
 * 图的广度优先搜索, 相当于树的层序遍历
 * @param graph 
 * @param i 
 */
function BFS(graph: Graph_邻接矩阵表示) {
	const queue = [0]
	while(queue.length > 0) {
		const size = queue.length
		for (let i = 0; i < size; i++) {
			const j = queue.shift()
			visited[j] = true
			// 操作
			for (let k = 0; k < graph.vers[j].length; i++) {
				if (graph.vers[j][k] && !visited[k]) {
					queue.push(k)
				}
			}
		}
	}
}