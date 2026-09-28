import { cellKey, getNeighbors, reconstructPath } from '../grid-utils'

// BFS بيستكشف الجريد "طبقة بطبقة" (زي دوائر بتتوسع من نقطة البداية)،
// وده اللي بيضمن إن أول مرة يوصل فيها للهدف تكون بأقصر عدد خطوات ممكن —
// بس ده بيفترض إن كل خطوة نفس التكلفة (من غير أوزان مختلفة للخلايا)
export function bfs({ rows, cols, walls, start, end }) {
	const wallsSet = new Set(walls.map(([r, c]) => cellKey(r, c)))
	const endKey = cellKey(...end)

	const visited = new Set([cellKey(...start)])
	const cameFrom = new Map()
	const visitedOrder = []

	// الطابور (queue) هو قلب BFS: بنضيف في الآخر وبنشيل من الأول (FIFO)،
	// وده اللي بيضمن ترتيب "طبقة بطبقة". ملحوظة أداء: queue.shift() تكلفتها
	// O(n)، فلجريد كبير جدًا (آلاف الخلايا) الأفضل تستخدم مؤشر index بدل
	// الشيفت الحقيقي — هنا الجريد صغير كفاية إن الفرق مش محسوس
	const queue = [start]

	while (queue.length > 0) {
		const [row, col] = queue.shift()
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
			queue.push([nRow, nCol])
		}
	}

	return { visitedOrder, shortestPath: [], found: false }
}