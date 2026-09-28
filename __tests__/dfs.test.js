import { dfs } from '../lib/algorithms/dfs'

describe('dfs', () => {
	test('finds a path when one exists (not necessarily the shortest)', () => {
		const result = dfs({ rows: 5, cols: 5, walls: [], start: [0, 0], end: [4, 4] })

		expect(result.found).toBe(true)
		expect(result.shortestPath[0]).toEqual([0, 0])
		expect(result.shortestPath.at(-1)).toEqual([4, 4])
	})

	test('returns found: false when there is no possible path', () => {
		const result = dfs({
			rows: 3, cols: 3,
			walls: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
			start: [0, 0], end: [2, 2],
		})

		expect(result.found).toBe(false)
	})
})