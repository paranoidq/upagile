import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  authorInfo: z.object({
    name: z.string(),
    age: z.number(),
  }),
})

export type Post = z.infer<typeof PostSchema>

const fetchBacklogData = async (): Promise<Post[]> => {
  const response = await http.get('/posts')
  if (!response) {
    return []
  }
  return z.array(PostSchema).parse(response || [])
}
const addPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const response = await http.post('/posts', {
    ...post,
  })
  return response.data
}

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ['queryPosts'],
    queryFn: fetchBacklogData,
  })
}

export const useAddPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queryPosts'] })
    },
  })
}

// delete po
