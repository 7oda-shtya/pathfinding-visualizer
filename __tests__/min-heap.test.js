import { MinHeap } from '../lib/min-heap'

describe('MinHeap', () => {
	test('pops items in ascending priority order', () => {
		const heap = new MinHeap()
		heap.push(5, 'e')
		heap.push(1, 'a')
		heap.push(3, 'c')
		heap.push(2, 'b')
		heap.push(4, 'd')

		const order = []
		while (heap.size > 0) order.push(heap.pop())

		expect(order).toEqual(['a', 'b', 'c', 'd', 'e'])
	})

	test('returns undefined when popping an empty heap', () => {
		expect(new MinHeap().pop()).toBeUndefined()
	})

	test('handles duplicate priorities without losing items', () => {
		const heap = new MinHeap()
		heap.push(1, 'x')
		heap.push(1, 'y')
		heap.push(1, 'z')

		const popped = [heap.pop(), heap.pop(), heap.pop()]
		expect(popped.sort()).toEqual(['x', 'y', 'z'])
	})
})