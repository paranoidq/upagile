import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ViewType } from '../types'
import { ViewTabActions } from './view-tab-actions'

interface ViewTabsProps {
  views: ViewType[]
  activeTab: string
  onTabChange: (value: string) => void
  onViewCreate?: (view: Omit<ViewType, 'id'>) => Promise<void>
  onViewUpdate?: (view: ViewType) => Promise<void>
  onViewDelete?: (id: number) => Promise<void>
}

export function ViewTabs({ views, activeTab, onTabChange, onViewCreate, onViewUpdate, onViewDelete }: ViewTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className='w-full'>
      <TabsList className='inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground'>
        {views?.map((view) => (
          <TabsTrigger
            key={view.id}
            value={String(view.id)}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
              'relative pr-8', // 为操作按钮预留空间
            )}
          >
            <span className='relative'>{view.name}</span>
            {activeTab === String(view.id) && (
              <div className='absolute right-1'>
                <ViewTabActions view={view} onUpdate={onViewUpdate} onDelete={onViewDelete} />
              </div>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
