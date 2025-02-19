import { useCallback, useEffect, useState } from 'react'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { IconArrowLeft, IconCopy, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { Dropdown } from 'antd'
import { produce } from 'immer'
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils.ts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { useProcessedData } from '@/components/view-table/hooks/useProcessedData.ts'
import { Card, CardContent, CardHeader } from '../ui/card.tsx'
import { DataTable } from './components/data-table.tsx'
import { DataTableToolbar } from './components/view-table-toolbar.tsx'
import { ViewDialog } from './components/view/view-dialog.tsx'
import { useDeleteView, useViews } from './components/view/view-services.tsx'
import { BaseData, GroupData, ViewTableProps } from './types'

export function ViewTable<TData extends BaseData>({ data, columns, searchColumn }: ViewTableProps<TData>) {
  /*
   * handle views
   */
  const [activeView, setActiveView] = useState<string>('0')
  const [openViewCreateOrRenameDialog, setOpenViewCreateOrRenameDialog] = useState(false)
  const [viewDialogType, setViewDialogType] = useState<'create' | 'rename'>('rename')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [viewToDelete, setViewToDelete] = useState<number | null>(null)

  const { data: views, isLoading: isViewsLoading } = useViews()
  const { mutate: deleteView, isPending: isDeleting } = useDeleteView()

  const currentView = views?.find((view) => view.id === Number(activeView))
  const currentViewType = currentView?.type
  // activate first view
  useEffect(() => {
    if (views && views.length > 0) {
      setActiveView(views[0].id.toString())
    }
  }, [views])

  const onDeleteViewTrigger = (viewId: number) => {
    setViewToDelete(viewId)
    setOpenDeleteDialog(true)
  }

  const onDeleteViewConfirm = () => {
    if (viewToDelete) {
      deleteView(viewToDelete)
      setOpenDeleteDialog(false)
      setViewToDelete(null)
    }
  }

  /*
   * process data
   */
  const processedData = useProcessedData(data, currentView)

  /*
   * handle groups
   */
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])
  const toggleGroup = useCallback(
    (groupKey: string) => {
      setCollapsedGroups(
        produce(collapsedGroups, (draft: string[]) => {
          if (draft.includes(groupKey)) {
            draft.splice(draft.indexOf(groupKey), 1)
          } else {
            draft.push(groupKey)
          }
        }),
      )
    },
    [collapsedGroups],
  )
  const collapseAll = () => {
    setCollapsedGroups([])
  }
  const expandAll = () => {
    setCollapsedGroups(processedData?.map((group) => group.key) || [])
  }
  const isCollapsed = (groupKey: string) => collapsedGroups.includes(groupKey)

  /*
   * render group title
   */
  const renderGroupTitle = (group: GroupData<TData>) => {
    if (group.key === '未分组') {
      return (
        <>
          <span className='font-semibold'>{group.key}: 未分组</span>
          <span className='text-muted-foreground'>({(group.data as TData[]).length || '0'} 条记录)</span>
        </>
      )
    }

    return (
      <>
        <span className=''>{group.key}</span>
        <span className='text-muted-foreground'>({(group.data as TData[]).length || '0'} 条记录)</span>
      </>
    )
  }

  /*
   * handle table data
   */
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableSorting: false,
    enableHiding: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  if (isViewsLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <div className='w-full'>
          <div className='flex items-center justify-between mb-2'>
            <Tabs value={activeView} onValueChange={setActiveView} className='w-full'>
              <div className='flex items-center justify-between w-full'>
                <TabsList className='h-10 w-full justify-start gap-1'>
                  {views?.map((view) => (
                    <TabsTrigger
                      key={view.id}
                      value={String(view.id)}
                      className='relative data-[state=active]:bg-background px-4'
                      onClick={() => {
                        setViewDialogType('rename')
                      }}
                    >
                      <div className='flex items-center gap-2'>
                        <span className='max-w-[150px] overflow-hidden text-ellipsis block'>{view.name}</span>
                        {activeView === String(view.id) && (
                          <Dropdown
                            trigger={['click']}
                            onOpenChange={() => setViewDialogType('rename')}
                            menu={{
                              items: [
                                {
                                  key: 'moveToFirst',
                                  label: '移动到首位',
                                  type: 'item',
                                  icon: <IconArrowLeft className='w-4 h-4' />,
                                  onClick: () => {
                                    alert('todo')
                                  },
                                },
                                {
                                  key: 'rename',
                                  label: '重命名',
                                  type: 'item',
                                  icon: <IconEdit className='w-4 h-4' />,
                                  onClick: () => setOpenViewCreateOrRenameDialog(true),
                                },
                                {
                                  key: 'duplicate',
                                  label: '复制视图',
                                  icon: <IconCopy className='w-4 h-4' />,
                                  type: 'item',
                                  onClick: () => alert('todo'),
                                },
                                {
                                  type: 'divider',
                                },
                                {
                                  key: 'delete',
                                  label: '删除视图',
                                  icon: <IconTrash className='w-4 h-4' />,
                                  type: 'item',
                                  onClick: () => onDeleteViewTrigger(view.id),
                                },
                              ],
                            }}
                          >
                            <MoreVertical className='h-4 w-4' />
                          </Dropdown>
                        )}
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button
                  onClick={() => {
                    setViewDialogType('create')
                    setOpenViewCreateOrRenameDialog(true)
                  }}
                  className='ml-2'
                >
                  <IconPlus className='mr-2 h-4 w-4' />
                  添加视图
                </Button>
              </div>

              {views?.map((view) =>
                currentView?.id == view.id ? (
                  <TabsContent key={view.id} value={String(view.id)} className='space-y-2'>
                    {/* toolbar */}
                    <DataTableToolbar
                      table={table}
                      searchColumn={searchColumn}
                      currentView={currentView}
                      onCollapseAll={collapseAll}
                      onExpandAll={expandAll}
                    />
                    {/* grouped tables */}
                    {processedData && processedData.length > 0 ? (
                      <div>
                        {processedData.map((group) => {
                          return (
                            <>
                              {
                                <Card key={group.key} className='mb-2'>
                                  <CardHeader className='p-2'>
                                    <Button
                                      variant='ghost'
                                      className={cn(
                                        'h-8 w-full flex items-center justify-start hover:bg-transparent pl-0.5 text-base',
                                      )}
                                      onClick={() => toggleGroup(group.key)}
                                    >
                                      <div className='w-4 h-4'>
                                        {isCollapsed(group.key) ? (
                                          <ChevronRight className='h-4 w-4 shrink-0' />
                                        ) : (
                                          <ChevronDown className='h-4 w-4 shrink-0' />
                                        )}
                                      </div>
                                      {renderGroupTitle(group)}
                                    </Button>
                                  </CardHeader>
                                  <CardContent className={cn('px-1 py-1', isCollapsed(group.key) && 'hidden')}>
                                    <DataTable table={table} />
                                  </CardContent>
                                </Card>
                              }
                            </>
                          )
                        })}
                      </div>
                    ) : (
                      <div className='flex items-center justify-center h-full'>
                        <span className='text-muted-foreground'>暂无数据</span>
                      </div>
                    )}
                  </TabsContent>
                ) : null,
              )}
            </Tabs>
          </div>
        </div>
      </div>

      {currentView && openViewCreateOrRenameDialog && viewDialogType === 'rename' && (
        <ViewDialog
          open={openViewCreateOrRenameDialog}
          onOpenChange={setOpenViewCreateOrRenameDialog}
          id={currentView.id}
          name={currentView.name}
        />
      )}

      {openViewCreateOrRenameDialog && viewDialogType === 'create' && (
        <ViewDialog
          open={openViewCreateOrRenameDialog}
          onOpenChange={setOpenViewCreateOrRenameDialog}
          id={undefined}
          name={'新建视图'}
          type={currentViewType}
        />
      )}

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除视图</AlertDialogTitle>
            <AlertDialogDescription className={'text-red-500'}>确认删除么？此操作无法撤销</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteViewConfirm} disabled={isDeleting}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
