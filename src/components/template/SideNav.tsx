import navigationConfig from '@/configs/navigation.config'
import navigationIcon from '@/configs/navigation-icon.config'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setSideNavCollapse } from '@/store/slices/theme/themeSlice'
import { cn } from '@/utils/classNames'

export function SideNav() {
  const dispatch = useAppDispatch()
  const collapsed = useAppSelector((state) => state.theme.layout.sideNavCollapse)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-hairline bg-ivory transition-all',
        collapsed ? 'w-16' : 'w-60',
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex items-center justify-between border-b border-hairline px-4 py-4">
        {!collapsed && <span className="font-serif text-xl font-medium">quran bytes.</span>}
        <button
          type="button"
          onClick={() => dispatch(setSideNavCollapse(!collapsed))}
          className="rounded p-1 text-xs text-muted hover:text-emerald-deep"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navigationConfig.map((item) => (
          <a
            key={item.key}
            href={item.path}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-ink hover:bg-emerald-deep/10"
          >
            <span className="text-base text-emerald-deep">{navigationIcon[item.icon]}</span>
            {!collapsed && <span>{item.title}</span>}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default SideNav
