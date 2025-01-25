interface ImagesMasonryProps<T> {
  items: T[]
  render: (item: T, index: number) => React.ReactNode
}

export function ImagesMasonry<T>({ items, render }: ImagesMasonryProps<T>) {
  return (
    <div className="columns-1 gap-1 xs:columns-2 md:columns-3">
      {items.map((item, idx) => (
        <div key={idx} className="mb-1 break-inside-avoid">
          {render(item, idx)}
        </div>
      ))}
    </div>
  )
}
