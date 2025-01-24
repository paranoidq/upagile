import { type FC } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAddPost, usePosts } from './services/posthooks'

const Backlog: FC = () => {
  const {
    data: posts,
    error,
    isLoading,
    isSuccess,
    refetch,
    isRefetching,
    isFetching,
  } = usePosts()

  const { mutate: addPost } = useAddPost()
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
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Backlog</h1>
      <div className='rounded-lg bg-card text-card-foreground shadow-sm'>
        <div>
          <div className='flex gap-2'>
            <Button
              onClick={() => refetch()}
              disabled={isLoadingData}
              className='flex items-center gap-2'
            >
              {isLoadingData ? '刷新中...' : '刷新数据'}
              {isLoadingData && (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
              )}
            </Button>
            <Button
              onClick={handleAddPost}
              disabled={isLoadingData}
              variant='outline'
            >
              新增文章
            </Button>
          </div>
        </div>

        {error && <div>error: {error.message}</div>}
        {isSuccess && (
          <div
            className={cn(isLoadingData && 'opacity-50 pointer-events-none')}
          >
            {!isLoadingData &&
              posts.map((post) => (
                <div key={post.id}>
                  {post.id}, {post.title}，{post.authorInfo.name}
                </div>
              ))}
          </div>
        )}

        {/* 加载指示器 */}
        {isLoadingData && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900' />
          </div>
        )}
      </div>
    </div>
  )
}

export default Backlog
