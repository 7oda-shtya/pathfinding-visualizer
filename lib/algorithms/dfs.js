import { cellKey, getNeighbors, reconstructPath } from '../grid-utils'

// DFS بيغوص في اتجاه واحد لآخره الأول قبل ما يرجع يجرب اتجاه تاني —
// عكس BFS تمامًا. مبيضمنش أقصر مسار خالص (ممكن يوصل للهدف بعد لف كبير
// حتى لو كان قريب منه)، بس بيوضح الفرق البصري بينه وبين BFS بشكل واضح
export function dfs({ rows, cols, walls, start, end }) {
	const wallsSet = new Set(walls.map(([r, c]) => cellKey(r, c)))
	const endKey = cellKey(...end)

	const visited = new Set([cellKey(...start)])
	const cameFrom = new Map()
	const visitedOrder = []

	// الستاك (stack) هو قلب DFS: بنضيف وبنشيل من نفس الطرف (LIFO)،
	// وده اللي بيخلي الخوارزمية "تكمل" في نفس الاتجاه قبل ما ترجع تجرب غيره
	const stack = [start]

	while (stack.length > 0) {
		const [row, col] = stack.pop()
		const key = cellKey(row, col)
		visitedOrder.push([row, col])

		if (key === endKey) {
			return { visitedOrder, shortestPath: reconstructPath(cameFrom, endKey), found: true }
		}

		for (const [nRow, nCol] of getNeighbors(row, col, rows, cols)) {
			const nKey = cellKey(nRow, nCol)
			if (visited.has(nKey) || wallsSet.has(nKey)) continue

			visited.add(nKey)
			cameFrom.set(nKey, key)
			stack.push([nRow, nCol])
		}
	}

	return { visitedOrder, shortestPath: [], found: false }
}