import { type FC } from 'react'
import { Button, FloatButton, List } from 'antd'
import { SearchCodeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import { useAddBacklog, useBacklogs } from './services/backlog-services'

const Backlog: FC = () => {
  const {
    data: posts,
    error,
    isLoading,
    isSuccess,
    refetch,
    isRefetching,
    isFetching,
  } = useBacklogs()

  const { mutate: addPost } = useAddBacklog()
  const isLoadingData = isLoading || isFetching || isRefetching

  const handleAddPost = () => {
    addPost({
      title: '新文章',
      authorInfo: {
        name: '新作者',
        age: 25,
      },
    })
  }
  return (
    <Main>
      <h1 className='text-2xl font-bold mb-6'>Backlog</h1>
      <div className='rounded-lg bg-card text-card-foreground shadow-sm'>
        <div>
          <div className='flex gap-2'>
            <Button
              type='primary'
              onClick={() => refetch()}
              disabled={isLoadingData}
              loading={isLoadingData}
              icon={<SearchCodeIcon className='h-4 w-4' />}
            >
              刷新文章
            </Button>
            <Button onClick={handleAddPost} disabled={isLoadingData}>
              新增文章
            </Button>
            <FloatButton
              type='primary'
              shape='circle'
              badge={{ count: 5, overflowCount: 999 }}
              onClick={() => alert('哈哈')}
              icon={<SearchCodeIcon className='h-4 w-4' />}
            ></FloatButton>
          </div>
        </div>

        {error && <div>error: {error.message}</div>}
        {isSuccess && (
          <div
            className={cn(isLoadingData && 'opacity-50 pointer-events-none')}
          >
            {!isLoadingData && (
              <List
                itemLayout='horizontal'
                dataSource={posts}
                renderItem={(post) => (
                  <List.Item>
                    <List.Item.Meta
                      title={post.title}
                      description={`作者: ${post.authorInfo.name}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        )}

        {/* 加载指示器 */}
        {isLoadingData && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
          </div>
        )}
      </div>
    </Main>
  )
}

export default Backlog
