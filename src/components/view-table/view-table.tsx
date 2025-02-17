import React, { useEffect, useState } from 'react'
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
import { MoreVertical } from 'lucide-react'
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
import { ViewDialog } from '@/features/tasks/components/view/view-dialog.tsx'
import { useProcessedData } from '@/features/tasks/hooks/useProcessedData.ts'
import { useDeleteView, useViews } from '@/features/tasks/services/view-services.tsx'
import { BaseData, ViewTableProps } from './types'

export function ViewTable<TData extends BaseData>({ data, columns }: ViewTableProps<TData>) {
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
   * handle data
   */
  const processedData = useProcessedData(data, currentView)

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  // 创建主表格实例（仅用于工具栏）
  const mainTable = useReactTable({
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
                  <TabsContent key={view.id} value={String(view.id)}>
                    data-table-for-view-{view.id}
                    {/*<DataTable data={processedData} columns={columns} searchColumn='title' currentView={currentView} />*/}
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
            <AlertDialogDescription>删除后无法恢复，请确认是否删除</AlertDialogDescription>
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
