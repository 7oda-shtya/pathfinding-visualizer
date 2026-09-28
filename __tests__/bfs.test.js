import { bfs } from '../lib/algorithms/bfs'

describe('bfs', () => {
	test('finds the shortest path on an open grid', () => {
		const result = bfs({ rows: 5, cols: 5, walls: [], start: [0, 0], end: [4, 4] })

		expect(result.found).toBe(true)
		// أقصر مسار على جريد مفتوح من (0,0) لـ (4,4): 4 خطوات تحت + 4 يمين + خلية البداية = 9
		expect(result.shortestPath).toHaveLength(9)
		expect(result.shortestPath[0]).toEqual([0, 0])
		expect(result.shortestPath.at(-1)).toEqual([4, 4])
	})

	test('returns found: false when the end is completely walled in', () => {
		const result = bfs({
			rows: 3, cols: 3,
			walls: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
			start: [0, 0], end: [2, 2],
		})

		expect(result.found).toBe(false)
		expect(result.shortestPath).toEqual([])
	})

	test('finds the only path through a narrow corridor', () => {
		const result = bfs({
			rows: 3, cols: 3,
			walls: [[0, 0], [0, 2], [2, 0], [2, 2]],
			start: [0, 1], end: [2, 1],
		})

		expect(result.found).toBe(true)
		expect(result.shortestPath).toEqual([[0, 1], [1, 1], [2, 1]])
	})
})