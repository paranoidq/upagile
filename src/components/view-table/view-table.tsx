import { useState } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Card } from '@/components/ui/card'
import { ConditionTags } from './components/condition-tags'
import { CreateViewDialog } from './components/create-view-dialog'
import { ViewDataTable } from './components/view-data-table'
import { ViewTabs } from './components/view-tabs'
import { ViewToolbar } from './components/view-toolbar'
import { useProcessedData } from './hooks/use-processed-data'
import { BaseData, ViewTableProps } from './types'

export function ViewTable<TData extends BaseData>({
  data,
  columns,
  views,
  searchColumn,
  toolbar = {
    filter: true,
    sort: true,
    group: true,
    columnVisibility: true,
  },
  onViewCreate,
  onViewUpdate,
  onViewDelete,
}: ViewTableProps<TData>) {
  const [activeTab, setActiveTab] = useState<string>('0')
  const currentView = views?.find((view) => view.id === Number(activeTab))

  // 处理后的数据
  const processedData = useProcessedData(data, currentView)

  // 创建 table 实例
  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='flex h-full flex-1 flex-col space-y-4 p-4'>
      <div className='flex items-center justify-between space-y-2'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-2xl font-bold tracking-tight'>视图</h2>
        </div>
      </div>
      <Card>
        <div className='flex flex-col space-y-4 p-4'>
          <div className='flex items-center justify-between'>
            <ViewTabs
              views={views}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onViewUpdate={onViewUpdate}
              onViewDelete={onViewDelete}
            />
            <CreateViewDialog onViewCreate={onViewCreate} />
          </div>

          <ViewToolbar currentView={currentView} table={table} toolbar={toolbar} onViewUpdate={onViewUpdate} />

          <ConditionTags currentView={currentView} onUpdate={onViewUpdate} />

          <ViewDataTable
            data={processedData}
            columns={columns}
            searchColumn={searchColumn}
            currentView={currentView}
            table={table}
          />
        </div>
      </Card>
    </div>
  )
}
