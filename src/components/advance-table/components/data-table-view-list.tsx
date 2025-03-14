import { useRouter, useSearch } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchParams, View } from '@/components/advance-table/types'

interface DataTableViewListProps {
  views: View[] | undefined
  children: React.ReactNode
}

export function DataTableViewList({ views, children }: DataTableViewListProps) {
  const search = useSearch({ strict: false }) as SearchParams
  const router = useRouter()

  const viewId = search?.viewId
  const currentView = views?.find((v) => v.id === viewId)

  return (
    <div className='flex items-center justify-between'>
      <div>
        <Tabs defaultValue={currentView?.id?.toString() || '_all'}>
          <TabsList>
            <TabsTrigger
              value='_all'
              onClick={() => {
                router.navigate({
                  to: '.',
                  search: {},
                })
              }}
            >
              默认视图
            </TabsTrigger>
            {views?.map((view) => (
              <TabsTrigger
                key={view.id}
                value={view.id.toString()}
                className='relative data-[state=active]:bg-background px-4'
                onClick={() => {
                  router.navigate({
                    to: '.',
                    search: (prev) => ({
                      ...prev,
                      viewId: view.id,
                      ...calculateSearchParamsFromView(view),
                    }),
                  })
                }}
              >
                <div className='flex items-center gap-2'>
                  <span className='max-w-[150px] overflow-hidden text-ellipsis block'>{view.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {children}
    </div>
  )
}

function calculateSearchParamsFromView(view: View): SearchParams {
  return {
    viewId: view.id,
    columns: view.columns,
    filterParams: view.filterParams,
    sortParams: view.sortParams,
    groupParams: view.groupParams,
  }
}
