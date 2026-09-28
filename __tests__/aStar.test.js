import { aStar } from '../lib/algorithms/aStar'
import { dijkstra } from '../lib/algorithms/dijkstra'

describe('aStar', () => {
	test('finds a path of the same length as dijkstra on an open grid', () => {
		const config = { rows: 6, cols: 6, walls: [], start: [0, 0], end: [5, 5] }
		const aStarResult = aStar(config)
		const dijkstraResult = dijkstra(config)

		expect(aStarResult.found).toBe(true)
		// A* مضمون يديك نفس طول المسار الأمثل بتاع Dijkstra (لأن الـ heuristic بتاعتنا "admissible")
		expect(aStarResult.shortestPath.length).toBe(dijkstraResult.shortestPath.length)
	})

	test('typically visits fewer or equal cells than dijkstra thanks to the heuristic', () => {
		const config = { rows: 10, cols: 10, walls: [], start: [0, 0], end: [9, 9] }
		expect(aStar(config).visitedOrder.length).toBeLessThanOrEqual(dijkstra(config).visitedOrder.length)
	})

	test('returns found: false when blocked by walls', () => {
		const result = aStar({
			rows: 3, cols: 3,
			walls: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
			start: [0, 0], end: [2, 2],
		})

		expect(result.found).toBe(false)
	})
})