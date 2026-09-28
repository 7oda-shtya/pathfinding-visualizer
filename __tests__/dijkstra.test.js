import { dijkstra } from '../lib/algorithms/dijkstra'

describe('dijkstra', () => {
	test('finds the shortest path on a uniform-weight grid', () => {
		const result = dijkstra({ rows: 5, cols: 5, walls: [], start: [0, 0], end: [4, 4] })

		expect(result.found).toBe(true)
		expect(result.shortestPath).toHaveLength(9)
	})

	test('prefers a longer route over a shorter one through expensive cells', () => {
		// طريق مباشر عبر الخلية الوسطى (1,2) بس هي مكلفة جدًا (وزن 100)،
		// المفروض Dijkstra يلف من فوق أو تحت بدل ما يمر عليها
		const result = dijkstra({
			rows: 3, cols: 5, walls: [],
			start: [1, 0], end: [1, 4],
			weights: { '1,2': 100 },
		})

		expect(result.found).toBe(true)
		const passesThroughExpensiveCell = result.shortestPath.some(([r, c]) => r === 1 && c === 2)
		expect(passesThroughExpensiveCell).toBe(false)
	})

	test('returns found: false when blocked by walls', () => {
		const result = dijkstra({
			rows: 3, cols: 3,
			walls: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
			start: [0, 0], end: [2, 2],
		})

		expect(result.found).toBe(false)
	})
})