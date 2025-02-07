import { useEffect, useState } from 'react'
import { IconArrowLeft, IconCopy, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { Button, Dropdown, Popconfirm, Tabs } from 'antd'
import { MoreVertical } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ViewDialog } from '@/features/tasks/components/view/view-dialog.tsx'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks } from './data/tasks'
import { useDeleteView, useViews } from './services/view-services'

export default function Tasks() {
  const { data: views } = useViews()
  const [activeTab, setActiveTab] = useState<string>('0')
  const [openViewCreateOrRenameDialog, setOpenViewCreateOrRenameDialog] = useState(false)
  const [viewDialogType, setViewDialogType] = useState<'create' | 'rename'>('rename')

  const currentView = views?.find((view) => view.id === Number(activeTab))
  const currentViewType = currentView?.type

  useEffect(() => {
    if (views && views.length > 0) {
      setActiveTab(views[0].id.toString())
    }
  }, [views])

  const { mutate: deleteView, isPending: isDeleting } = useDeleteView()

  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>Here&apos;s a list of your tasks for this month!</p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <Tabs
            onChange={(key) => {
              setActiveTab(key)
              setViewDialogType('rename')
            }}
            activeKey={activeTab}
            type='card'
            items={views?.map((view) => ({
              key: String(view.id),
              label: (
                <div className='flex items-center gap-2'>
                  <span className='max-w-[150px] overflow-hidden text-ellipsis  block'>{view.name}</span>
                  {activeTab == String(view.id) && (
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
                            label: (
                              <Popconfirm
                                title={'删除视图'}
                                description={'删除后无法恢复，请确认是否删除'}
                                onConfirm={() => deleteView(view.id)}
                                okText='确定'
                                okButtonProps={{ loading: isDeleting }}
                                cancelText={'取消'}
                              >
                                删除视图
                              </Popconfirm>
                            ),
                            icon: <IconTrash className='w-4 h-4' />,
                            type: 'item',
                          },
                        ],
                      }}
                    >
                      <MoreVertical className='h-4 w-4' />
                    </Dropdown>
                  )}
                </div>
              ),
              children: <DataTable data={tasks} columns={columns} searchColumn='title' />,
            }))}
            tabBarExtraContent={
              <Button
                icon={<IconPlus />}
                type='primary'
                onClick={() => {
                  setViewDialogType('create')
                  setOpenViewCreateOrRenameDialog(true)
                }}
              >
                添加视图
              </Button>
            }
          />
        </div>
      </Main>

      <TasksDialogs />

      {/*// todo: 如果不加openViewRenameDialog这个状态，会导致ViewRenameDialog组件在切换tab时，form表单的值不会更新*/}
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
    </TasksProvider>
  )
}
