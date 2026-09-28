import { cellKey, keyToCell, getNeighbors, getCellWeight, reconstructPath } from '../lib/grid-utils'

describe('cellKey / keyToCell', () => {
	test('round-trips a cell through key and back', () => {
		expect(cellKey(3, 7)).toBe('3,7')
		expect(keyToCell('3,7')).toEqual([3, 7])
	})
})

describe('getNeighbors', () => {
	test('returns 4 neighbors for a cell in the middle of the grid', () => {
		const neighbors = getNeighbors(5, 5, 10, 10)
		expect(neighbors).toHaveLength(4)
		expect(neighbors).toEqual(expect.arrayContaining([[4, 5], [6, 5], [5, 4], [5, 6]]))
	})

	test('excludes out-of-bounds neighbors for a corner cell', () => {
		const neighbors = getNeighbors(0, 0, 10, 10)
		expect(neighbors).toHaveLength(2)
		expect(neighbors).toEqual(expect.arrayContaining([[1, 0], [0, 1]]))
	})

	test('excludes out-of-bounds neighbors for the bottom-right corner', () => {
		const neighbors = getNeighbors(9, 9, 10, 10)
		expect(neighbors).toHaveLength(2)
		expect(neighbors).toEqual(expect.arrayContaining([[8, 9], [9, 8]]))
	})
})

describe('getCellWeight', () => {
	test('returns 1 for a cell with no weight override', () => {
		expect(getCellWeight(2, 2, {})).toBe(1)
	})

	test('returns the overridden weight when present', () => {
		expect(getCellWeight(2, 2, { '2,2': 5 })).toBe(5)
	})
})

describe('reconstructPath', () => {
	test('builds the path from start to end using cameFrom', () => {
		const cameFrom = new Map([
			['1,1', '0,0'],
			['2,1', '1,1'],
		])
		expect(reconstructPath(cameFrom, '2,1')).toEqual([[0, 0], [1, 1], [2, 1]])
	})

	test('returns a single-cell path when start equals end', () => {
		expect(reconstructPath(new Map(), '0,0')).toEqual([[0, 0]])
	})
})