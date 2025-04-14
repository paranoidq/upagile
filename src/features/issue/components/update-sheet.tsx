'use client'

import * as React from 'react'
import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCube, IconFlagFilled } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useTeamStore } from '@/stores/teamStore'
import { cn } from '@/lib/utils'
import AntdDatePicker from '@/components/ui/antd-date-picker'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateIssue } from '../_lib/services'
import { Issue, issueStatus, issueType } from '../types'

interface UpdateIssueSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue: Issue | null
}

// 定义表单验证schema
const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.string(),
  status: z.string(),
  priority: z.string(),
  startTime: z.string().date().nullable(),
  deadline: z.string().date().nullable(),
  teamId: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export function UpdateIssueSheet({ issue, ...props }: UpdateIssueSheetProps) {
  const { mutateAsync: updateIssue, isPending: isUpdatePending } = useUpdateIssue()
  const { teams } = useTeamStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: issue?.id,
      title: issue?.title,
      description: issue?.description,
      type: issue?.type,
      status: issue?.status,
      priority: issue?.priority,
      startTime: issue?.startTime ? dayjs(issue.startTime).format('YYYY-MM-DD') : null,
      deadline: issue?.deadline ? dayjs(issue.deadline).format('YYYY-MM-DD') : null,
      teamId: issue?.team?.id,
    },
  })

  useEffect(() => {
    if (issue) {
      form.reset({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        priority: issue.priority,
        startTime: issue.startTime ? dayjs(issue.startTime).format('YYYY-MM-DD') : null,
        deadline: issue.deadline ? dayjs(issue.deadline).format('YYYY-MM-DD') : null,
        teamId: issue.team?.id,
      })
    }
  }, [issue])

  const handleSubmit = async (values: FormValues) => {
    const data = {
      ...values,
      startTime: values.startTime ? dayjs(values.startTime).format('YYYY-MM-DD') : undefined,
      deadline: values.deadline ? dayjs(values.deadline).format('YYYY-MM-DD') : undefined,
    }

    toast.promise(updateIssue(data), {
      loading: 'Updating issue...',
      success: () => {
        props.onOpenChange?.(false)
        return 'Issue updated'
      },
      error: (error) => ({
        message: error.msg,
        description: error.reason,
      }),
    })
  }

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent className='w-[400px] sm:w-[540px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Update Issue</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issueType.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className={cn('px-2 py-1 rounded text-white font-semibold', type.color)}>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueStatus.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <span className={cn('px-2 py-1 rounded text-white font-semibold', status.color)}>
                              {status.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITIES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className='flex items-center gap-2'>
                              <IconFlagFilled className={cn('size-4', type.color)} />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <AntdDatePicker data={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='deadline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <AntdDatePicker data={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='teamId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            <div className='flex items-center gap-2'>
                              <IconCube className='size-4' />
                              {team.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-4'>
              <Button variant='outline' onClick={() => props.onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isUpdatePending}>
                {isUpdatePending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
