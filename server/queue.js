class Queue {
  constructor(data) {
    this.head = data?.head
    this.last = data?.last
  }

  enqueue(value) {
    const link = { value, next: undefined }
    this.last = this.head
      ? this.last.next = link
      : this.head = link
  }

  dequeue() {
    let first
    return this.head && (
      first = this.head.value,
      this.head = this.head.next,
      first
    )
  }

  peek() {
    // eslint-disable-next-line no-unused-expressions
    this.head && this.head.value
  }
}

const queueOps = {
  isBusy: ({ table }) => getCacheProp({ prop: table }),
  getQueue: () => {
    wait({ condition: queueOps.isBusy() })
    setCacheProps({ props: { queue_busy: true } })
    const cache = getCacheProp({ prop: 'queue' })

    return new Queue(cache)
  },
  setQueue: ({ queue }) => {
    wait({ condition: queueOps.isBusy() })
    setCacheProps({ props: { queue, queue_busy: false } })
  },
  enqueue: ({ items }) => {
    const queue = getQueue()

    items.forEach(item => queue.enqueue(item))

    setQueue({ queue })
  },
  dequeue: () => {
    const queue = getQueue()
    const item = queue.dequeue()
    setQueue({ queue })
    return item
  },
}
