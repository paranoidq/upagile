import { useEffect, useState } from 'react'
import { IconCopy, IconEdit, IconTrash } from '@tabler/icons-react'
import { Dropdown, Tabs } from 'antd'
import { MoreVertical } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks } from './data/tasks'
import { useViews } from './services/view-services'

export default function Tasks() {
  const { data: views } = useViews()
  const [activeTab, setActiveTab] = useState<string>('0')

  useEffect(() => {
    if (views && views.length > 0) {
      setActiveTab(views[0].id.toString())
    }
  }, [views])

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
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <Tabs
            onChange={(key) => setActiveTab(key)}
            type='card'
            activeKey={activeTab}
            items={views?.map((view) => ({
              key: String(view.id),
              label: (
                <div className='flex items-center gap-2'>
                  <span className='max-w-[150px] overflow-hidden text-ellipsis  block'>
                    {view.name}
                  </span>
                  {activeTab == String(view.id) && (
                    <Dropdown
                      trigger={['click']}
                      menu={{
                        items: [
                          {
                            key: 'rename',
                            label: '重命名',
                            type: 'item',
                            icon: <IconEdit className='w-4 h-4' />,
                            onClick: () => alert('重命名'),
                          },
                          {
                            key: 'duplicate',
                            label: '复制视图',
                            icon: <IconCopy className='w-4 h-4' />,
                            type: 'item',
                            onClick: () => alert('复制视图'),
                          },
                          {
                            type: 'divider',
                          },
                          {
                            key: 'delete',
                            label: '删除视图',
                            icon: <IconTrash className='w-4 h-4' />,
                            type: 'item',
                            onClick: () => alert('删除视图'),
                          },
                        ],
                      }}
                    >
                      <MoreVertical className='h-4 w-4' />
                    </Dropdown>
                  )}
                </div>
              ),
              children: <DataTable data={tasks} columns={columns} />,
            }))}
          />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
