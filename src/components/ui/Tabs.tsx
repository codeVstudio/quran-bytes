import { useRef, type KeyboardEvent, type ReactNode } from 'react'

export interface TabItem {
  id: string
  tabId: string
  panelId: string
  label: ReactNode
  className: string
  content: ReactNode
}

export interface TabsProps {
  ariaLabel: string
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
}

export function Tabs({ ariaLabel, items, activeId, onChange }: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | undefined
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = items.length - 1

    if (next !== undefined) {
      event.preventDefault()
      onChange(items[next].id)
      tabRefs.current[next]?.focus({ preventScroll: true })
    }
  }

  return (
    <>
      <div className="concept-tabs" role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => {
          const selected = item.id === activeId
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              role="tab"
              id={item.tabId}
              type="button"
              aria-selected={selected}
              aria-controls={item.panelId}
              data-tab={item.id}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              onKeyDown={(event) => handleKeyDown(index, event)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => {
        const selected = item.id === activeId
        return (
          <div
            key={item.panelId}
            id={item.panelId}
            className={`${item.className} tab-panel`}
            role="tabpanel"
            aria-labelledby={item.tabId}
            tabIndex={0}
            hidden={!selected}
          >
            {item.content}
          </div>
        )
      })}
    </>
  )
}

export default Tabs
