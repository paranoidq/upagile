import { useEffect, useState } from 'react'
import {
  IconAlignLeft,
  IconArrowLeft,
  IconArrowLeftFromArc,
  IconCopy,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { Button, Dropdown, Form, Input, Popconfirm, Popover, Tabs } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { MoreVertical } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ViewRenameDialog } from '@/features/tasks/components/view/view-rename-dialog.tsx'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks } from './data/tasks'
import { useCreateView, useDeleteView, useViews } from './services/view-services'

export default function Tasks() {
  const { data: views } = useViews()
  const [activeTab, setActiveTab] = useState<string>('0')
  const [openViewRenameDialog, setOpenViewRenameDialog] = useState(false)
  const [openViewDuplicateDialog, setOpenViewDuplicateDialog] = useState(false)

  const currentView = views?.find((view) => view.id === Number(activeTab))

  useEffect(() => {
    if (views && views.length > 0) {
      setActiveTab(views[0].id.toString())
    }
  }, [views])

  const { mutate: deleteView, isPending: isDeleting } = useDeleteView()
  const { mutate: createView, isPending: isDuplicating } = useCreateView()

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
            onChange={(key) => setActiveTab(key)}
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
                            onClick: () => setOpenViewRenameDialog(true),
                          },
                          {
                            key: 'duplicate',
                            label: (
                              <Popover
                                open={openViewDuplicateDialog}
                                title={'复制视图'}
                                trigger={'click'}
                                content={
                                  <Form
                                    initialValues={{ name: view.name + ' 副本' }}
                                    layout='vertical'
                                    onFinish={(values) => {
                                      setOpenViewDuplicateDialog(false)
                                    }}
                                  >
                                    <FormItem required={true} label={'视图名称'} name='name'>
                                      <Input />
                                    </FormItem>
                                    <FormItem>
                                      <Button type='primary' htmlType='submit'>
                                        确定
                                      </Button>
                                      <Button type={'default'} onClick={() => setOpenViewDuplicateDialog(false)}>
                                        取消
                                      </Button>
                                    </FormItem>
                                  </Form>
                                }
                              >
                                复制视图
                              </Popover>
                            ),
                            icon: <IconCopy className='w-4 h-4' />,
                            type: 'item',
                            onClick: () => setOpenViewDuplicateDialog(true),
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
          />
        </div>
      </Main>
      <TasksDialogs />


      {/*// todo: 如果不加openViewRenameDialog这个状态，会导致ViewRenameDialog组件在切换tab时，form表单的值不会更新*/}
      {currentView && openViewRenameDialog && (
        <ViewRenameDialog
          open={openViewRenameDialog}
          onOpenChange={setOpenViewRenameDialog}
          id={currentView.id}
          name={currentView.name}
        />
      )}
    </TasksProvider>
  )
}
