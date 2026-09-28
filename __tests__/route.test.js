import { POST } from '../app/api/pathfind/route'

function makeRequest(body) {
	return new Request('http://localhost/api/pathfind', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
}

describe('POST /api/pathfind', () => {
	test('returns a valid path for a correct request', async () => {
		const res = await POST(makeRequest({
			algorithm: 'bfs',
			grid: { rows: 5, cols: 5, walls: [], start: [0, 0], end: [4, 4] },
		}))

		expect(res.status).toBe(200)
		const data = await res.json()
		expect(data.found).toBe(true)
		expect(data.stats).toHaveProperty('visitedCount')
		expect(data.stats).toHaveProperty('pathLength')
		expect(data.stats).toHaveProperty('executionTimeMs')
	})

	test('rejects an unknown algorithm', async () => {
		const res = await POST(makeRequest({
			algorithm: 'not-a-real-algorithm',
			grid: { rows: 5, cols: 5, walls: [], start: [0, 0], end: [4, 4] },
		}))
		expect(res.status).toBe(400)
	})

	test('rejects a grid that exceeds the maximum size', async () => {
		const res = await POST(makeRequest({
			algorithm: 'bfs',
			grid: { rows: 1000, cols: 1000, walls: [], start: [0, 0], end: [4, 4] },
		}))
		expect(res.status).toBe(400)
	})

	test('rejects start/end coordinates outside the grid', async () => {
		const res = await POST(makeRequest({
			algorithm: 'bfs',
			grid: { rows: 5, cols: 5, walls: [], start: [0, 0], end: [50, 50] },
		}))
		expect(res.status).toBe(400)
	})

	test('rejects a start or end cell that is also a wall', async () => {
		const res = await POST(makeRequest({
			algorithm: 'bfs',
			grid: { rows: 5, cols: 5, walls: [[0, 0]], start: [0, 0], end: [4, 4] },
		}))
		expect(res.status).toBe(400)
	})

	test('rejects malformed JSON bodies', async () => {
		const badRequest = new Request('http://localhost/api/pathfind', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: '{not valid json',
		})
		const res = await POST(badRequest)
		expect(res.status).toBe(400)
	})
})