import { cellKey, getNeighbors, getCellWeight, reconstructPath } from '../grid-utils'
import { MinHeap } from '../min-heap'

// Dijkstra بيدور دايمًا على أرخص خلية "لسه ماتفحصتش" الأول (مش أقرب خلية
// بترتيب الاكتشاف زي BFS). ده بيخليه صح حتى لو الخلايا مختلفة في التكلفة
export function dijkstra({ rows, cols, walls, start, end, weights = {} }) {
	const wallsSet = new Set(walls.map(([r, c]) => cellKey(r, c)))
	const startKey = cellKey(...start)
	const endKey = cellKey(...end)

	const distances = new Map([[startKey, 0]])
	const cameFrom = new Map()
	const visited = new Set()
	const visitedOrder = []

	const heap = new MinHeap()
	heap.push(0, start)

	while (heap.size > 0) {
		const [row, col] = heap.pop()
		const key = cellKey(row, col)

		// ممكن نفس الخلية تتحط في الهيب أكتر من مرة بمسافات مختلفة —
		// لو اتفحصت قبل كده بمسافة أقصر، نتجاهل النسخة القديمة دي
		if (visited.has(key)) continue
		visited.add(key)
		visitedOrder.push([row, col])

		if (key === endKey) {
			return { visitedOrder, shortestPath: reconstructPath(cameFrom, endKey), found: true }
		}

		const currentDistance = distances.get(key)

		for (const [nRow, nCol] of getNeighbors(row, col, rows, cols)) {
			const nKey = cellKey(nRow, nCol)
			if (wallsSet.has(nKey) || visited.has(nKey)) continue

			const newDistance = currentDistance + getCellWeight(nRow, nCol, weights)

			if (newDistance < (distances.get(nKey) ?? Infinity)) {
				distances.set(nKey, newDistance)
				cameFrom.set(nKey, key)
				heap.push(newDistance, [nRow, nCol])
			}
		}
	}

	return { visitedOrder, shortestPath: [], found: false }
}