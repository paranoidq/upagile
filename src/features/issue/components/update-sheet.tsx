'use client'

import * as React from 'react'
import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCube, IconFlagFilled, IconUserCircle } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useTeamStore } from '@/stores/teamStore'
import { cn } from '@/lib/utils'
import AntdDatePicker from '@/components/ui/antd-date-picker'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useGetTeamMembers } from '@/features/workspace/_lib/services'
import { useCreateIssue, useUpdateIssue } from '../_lib/services'
import { createIssueSchema, Issue, issueStatus, issueType, updateIssueSchema } from '../types'

interface UpdateIssueSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  open: boolean
  onOpenChange: (open: boolean) => void
  issue: Issue | null
  certainWorkspaceId?: string
}

export function UpdateIssueSheet({ issue, certainWorkspaceId, ...props }: UpdateIssueSheetProps) {
  const isUpdating = !!issue?.id

  const { mutateAsync: updateIssue, isPending: isUpdatePending } = useUpdateIssue()
  const { mutateAsync: createIssue, isPending: isCreatePending } = useCreateIssue()

  const { teams } = useTeamStore()

  type UpdateFormValues = z.infer<typeof updateIssueSchema>
  type CreateFormValues = z.infer<typeof createIssueSchema>
  const form = useForm<UpdateFormValues | CreateFormValues>({
    resolver: zodResolver(isUpdating ? updateIssueSchema : createIssueSchema),
    defaultValues: {
      id: issue?.id,
      title: issue?.title || '',
      description: issue?.description || '',
      type: issue?.type || 'unset',
      status: issue?.status || 'init',
      priority: issue?.priority || 'low',
      startTime: issue?.startTime ? dayjs(issue.startTime).format('YYYY-MM-DD') : undefined,
      deadline: issue?.deadline ? dayjs(issue.deadline).format('YYYY-MM-DD') : undefined,
      teamId: issue?.team?.id || certainWorkspaceId || '',
      assigneeId: issue?.assignee?.id || undefined,
    },
  })

  // team和assignee的联动
  const watchedTeamId = form.watch('teamId')
  const { data: teamData } = useGetTeamMembers(watchedTeamId)
  const members = teamData?.members || []

  useEffect(() => {
    if (issue) {
      form.reset({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        priority: issue.priority,
        startTime: issue.startTime ? dayjs(issue.startTime).format('YYYY-MM-DD') : undefined,
        deadline: issue.deadline ? dayjs(issue.deadline).format('YYYY-MM-DD') : undefined,
        teamId: issue.team?.id || certainWorkspaceId,
        assigneeId: issue.assignee?.id || undefined,
      })
    }
  }, [issue])

  // 处理表单提交
  const handleSubmit = async (values: UpdateFormValues) => {
    const data = {
      ...values,
      startTime: values.startTime ? dayjs(values.startTime).format('YYYY-MM-DD') : undefined,
      deadline: values.deadline ? dayjs(values.deadline).format('YYYY-MM-DD') : undefined,
      // 如果是 unassigned，则设置为 null
      assigneeId: values.assigneeId === 'unassigned' ? null : values.assigneeId,
    }

    if (isUpdating) {
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
    } else {
      const { id, ...createData } = data // 移除 id 字段

      toast.promise(createIssue(createData), {
        loading: 'Creating issue...',
        success: () => {
          props.onOpenChange?.(false)
          return 'Issue created'
        },
        error: (error) => ({
          message: error.msg,
          description: error.reason,
        }),
      })
    }
  }

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent className='w-[400px] sm:w-[540px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>{isUpdating ? 'Update Issue' : 'Create Issue'}</SheetTitle>
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
                    <Input {...field} placeholder='Enter issue title' />
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
                    <Textarea {...field} placeholder='Enter issue description' />
                  </FormControl>
                  <FormMessage />
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
                        <SelectValue placeholder='Select issue type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issueType.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className='flex items-center gap-2'>
                            <Badge variant='outline' className={cn('text-white font-semibold', type?.color)}>
                              {type?.label || type.value}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
                          <SelectValue placeholder='Select issue status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueStatus.map((item) => (
                          <SelectItem key={item.value} value={item.value} className='capitalize'>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`flex h-4 w-4 px-0.5 font-extrabold items-center justify-center rounded-full ${item?.color || ''} text-white`}
                              >
                                {item?.icon}
                              </div>
                              <span className='inline-flex items-center'>{item?.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage />
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
                    <AntdDatePicker
                      data={field.value}
                      onChange={(date) => {
                        field.onChange(date?.format('YYYY-MM-DD'))
                      }}
                      placeholder='Select start time'
                    />
                  </FormControl>
                  <FormMessage />
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
                    <AntdDatePicker
                      data={field.value}
                      onChange={(date) => {
                        field.onChange(date?.format('YYYY-MM-DD'))
                      }}
                      placeholder='Select deadline'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='teamId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!!certainWorkspaceId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select workspace' />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 在 teamId 选择框后添加 assignee 选择框 */}
            <FormField
              control={form.control}
              name='assigneeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchedTeamId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select assignee' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members &&
                          members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className='flex items-center gap-2'>
                                <Avatar className='h-6 w-6'>
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>
                                    <IconUserCircle className='h-4 w-4' />
                                  </AvatarFallback>
                                </Avatar>
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}

                        <SelectSeparator />
                        <Button
                          className='w-full px-2'
                          variant='secondary'
                          size='sm'
                          onClick={(e) => {
                            form.setValue('assigneeId', '')
                          }}
                        >
                          Clear
                        </Button>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-4'>
              <Button variant='outline' onClick={() => props.onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isUpdatePending || isCreatePending}>
                {isUpdatePending ? 'Updating...' : isCreatePending ? 'Creating...' : isUpdating ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
