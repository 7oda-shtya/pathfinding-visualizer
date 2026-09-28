// Min-Heap بسيط بيرتب العناصر حسب "priority" — أصغر أولوية تطلع الأول.
// من غيره، كنا هنضطر نرتب أراي كامل في كل خطوة (O(n log n))، وباستخدامه
// بنطلع أصغر عنصر بتكلفة O(log n) بس — وده الفرق اللي بيخلي Dijkstra
// وA* عمليين على جريد كبير
export class MinHeap {
	constructor() {
		this.items = []
	}

	get size() {
		return this.items.length
	}

	push(priority, value) {
		this.items.push({ priority, value })
		this.#bubbleUp(this.items.length - 1)
	}

	pop() {
		if (this.items.length === 0) return undefined

		const top = this.items[0]
		const last = this.items.pop()

		if (this.items.length > 0) {
			this.items[0] = last
			this.#bubbleDown(0)
		}

		return top.value
	}

	#bubbleUp(index) {
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2)
			if (this.items[parentIndex].priority <= this.items[index].priority) break

			;[this.items[parentIndex], this.items[index]] = [this.items[index], this.items[parentIndex]]
			index = parentIndex
		}
	}

	#bubbleDown(index) {
		const length = this.items.length

		while (true) {
			const left = index * 2 + 1
			const right = index * 2 + 2
			let smallest = index

			if (left < length && this.items[left].priority < this.items[smallest].priority) smallest = left
			if (right < length && this.items[right].priority < this.items[smallest].priority) smallest = right
			if (smallest === index) break

			;[this.items[smallest], this.items[index]] = [this.items[index], this.items[smallest]]
			index = smallest
		}
	}
}