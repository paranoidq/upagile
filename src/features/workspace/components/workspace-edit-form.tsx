import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateTeam } from '../_lib/services'
import { TeamType, updateTeamSchema } from '../types'

interface WorkspaceEditFormProps {
  selectedWorkspace: TeamType | undefined
}

export function WorkspaceEditForm({ selectedWorkspace }: WorkspaceEditFormProps) {
  const form = useForm<z.infer<typeof updateTeamSchema>>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
    },
  })

  const { mutateAsync: updateTeam, isPending: isUpdatePending } = useUpdateTeam()

  const onSubmit = async (values: z.infer<typeof updateTeamSchema>) => {
    toast.promise(updateTeam(values), {
      loading: 'Updating workspace...',
      success: 'Workspace updated',
      error: (e) => ({
        message: e.msg,
        description: e.reason,
      }),
    })
  }

  const handleReset = () => {
    form.reset(selectedWorkspace)
  }

  // 只在 selectedWorkspace 改变时更新表单
  useEffect(() => {
    if (selectedWorkspace) {
      const defaultValues = {
        id: selectedWorkspace.id,
        name: selectedWorkspace.name,
        description: selectedWorkspace.description || '',
      }
      form.reset(defaultValues, {
        keepDefaultValues: true, // 保持默认值
      })
    }
  }, [selectedWorkspace?.id]) // 只依赖 id 变化

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-2'>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage the basic information of the workspace</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-2'>
              <Button type='submit' disabled={isUpdatePending}>
                {isUpdatePending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : ''}
                Modify
              </Button>
              <Button type='button' variant='outline' onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
