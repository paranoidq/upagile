import { type FC } from 'react'
import { Button, Table, TableColumnsType } from 'antd'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BacklogType, useBacklogs, useCreateBacklog } from './services/backlog-services'

const backlogColumns: TableColumnsType<BacklogType> = [
  { title: 'id', dataIndex: 'id' },
  { title: '描述', dataIndex: 'desc' },
  { title: '状态', dataIndex: 'status' },
  { title: '优先级', dataIndex: 'priority' },
  { title: '分类', dataIndex: 'category' },
  { title: '创建人', dataIndex: 'crtUsr' },
  { title: '修改人', dataIndex: 'updUsr' },
  { title: '创建时间', dataIndex: 'crtTime' },
  { title: '修改时间', dataIndex: 'updTime' },
]

const Backlog: FC = () => {
  const { data: backlogs, isLoading, isSuccess, refetch, isRefetching, isFetching } = useBacklogs()

  const { mutate: createBacklogs, isPending: isCreating } = useCreateBacklog()
  const isLoadingData = isLoading || isFetching || isRefetching

  const handleAddPost = () => {
    createBacklogs({
      desc: '文章112',
      priority: 1,
      status: 0,
      category: 1,
      crtUsr: 'admin',
      updUsr: 'admin',
      crtTime: '2022-02-22 22:22:22',
      updTime: '2022-02-22 22:22:22',
    })
  }
  return (
    <>
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
            <h2 className='text-2xl font-bold tracking-tight'>Backlogs</h2>
            <p className='text-muted-foreground'>{`Here's a list of your backlogs`}</p>
          </div>
          <div>
            <div className='flex gap-2'>
              <Button type='default' onClick={() => refetch()} disabled={isLoadingData} loading={isLoadingData}>
                Refresh
              </Button>
              <Button onClick={handleAddPost} disabled={isLoadingData} type='primary' loading={isCreating}>
                Create
              </Button>
            </div>
          </div>
        </div>
        <div>
          {isSuccess && <Table dataSource={backlogs} columns={backlogColumns} rowKey={'id'} loading={isLoadingData} />}
        </div>
      </Main>
    </>
  )
}

export default Backlog
