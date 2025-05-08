'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCode, IconCube, IconUserCircle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useTeamStore } from '@/stores/teamStore'
import AntdDatePicker from '@/components/ui/antd-date-picker'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useApplications } from '@/features/application/_lib/services'
import { useGetTeamMembers } from '@/features/workspace/_lib/services'
import { useCreateRelease, useUpdateRelease } from '../_lib/services'
import { createReleaseSchema, Release, releaseStatus, updateReleaseSchema } from '../types'

interface UpdateReleaseSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  release: Release | null
}

export function UpdateReleaseSheet({ release, onOpenChange, open }: UpdateReleaseSheetProps) {
  const isUpdating = !!release?.id

  const { mutateAsync: updateRelease, isPending: isUpdatePending } = useUpdateRelease()

  const { mutateAsync: createRelease, isPending: isCreatePending } = useCreateRelease()

  type UpdateFormValues = z.infer<typeof updateReleaseSchema>
  type CreateFormValues = z.infer<typeof createReleaseSchema>

  const defaultValues = {
    id: release?.id,
    title: release?.title || '',
    description: release?.description ?? '',
    testTime: release?.testTime ? dayjs(release.testTime).format('YYYY-MM-DD') : '',
    releaseTime: release?.releaseTime ? dayjs(release.releaseTime).format('YYYY-MM-DD') : '',
    productionTime: release?.productionTime ? dayjs(release.productionTime).format('YYYY-MM-DD') : '',
    status: release?.status || 'init',
    principalId: release?.principal?.id,
    applicationId: release?.application?.id,
    teamId: release?.application?.team?.id,
  }

  const form = useForm<UpdateFormValues | CreateFormValues>({
    resolver: zodResolver(isUpdating ? updateReleaseSchema : createReleaseSchema),
    defaultValues,
  })

  // team和assignee的联动
  const { teams } = useTeamStore()

  const watchedTeamId = form.watch('teamId')
  const { data: teamData } = useGetTeamMembers(watchedTeamId)
  const members = teamData?.members || []
  const { data: applications } = useApplications(watchedTeamId)

  useEffect(() => {
    if (release) {
      form.reset(defaultValues)
    }
  }, [release])

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
    }
  }, [open])

  function onSubmit(values: UpdateFormValues | CreateFormValues) {
    const data = {
      ...values,
      title: values.title || release?.title || '',
      testTime: values.testTime ? dayjs(values.testTime).format('YYYY-MM-DD') : undefined,
      releaseTime: values.releaseTime ? dayjs(values.releaseTime).format('YYYY-MM-DD') : undefined,
      productionTime: values.productionTime ? dayjs(values.productionTime).format('YYYY-MM-DD') : undefined,
      principalId: values.principalId === undefined ? null : values.principalId,
      applicationId: values.applicationId === undefined ? null : values.applicationId,
    }

    if (isUpdating) {
      toast.promise(updateRelease(data as UpdateFormValues), {
        loading: 'Updating release...',
        success: () => {
          onOpenChange?.(false)
          return 'Release updated'
        },
        error: (e) => ({
          message: e.message,
          description: e.reason,
        }),
      })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...createData } = data

      toast.promise(createRelease(createData as CreateFormValues), {
        loading: 'Creating release...',
        success: () => {
          onOpenChange?.(false)
          return 'Release create'
        },
        error: (e) => ({
          message: e.message,
          description: e.reason,
        }),
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader className='text-left'>
          <SheetTitle>Update release</SheetTitle>
          <SheetDescription>Update the release details and save the changes</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            {isUpdating && (
              <FormField
                control={form.control}
                name='id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input placeholder='' {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} />
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
                    <Textarea placeholder='' {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='capitalize'>
                        <SelectValue placeholder='Select a priority' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {releaseStatus.map((item) => (
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
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='testTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Time</FormLabel>
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
              name='releaseTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Time</FormLabel>
                  <FormControl>
                    <AntdDatePicker
                      data={field.value}
                      onChange={(date) => {
                        field.onChange(date?.format('YYYY-MM-DD'))
                      }}
                      placeholder='Select release time'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='productionTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Time</FormLabel>
                  <FormControl>
                    <AntdDatePicker
                      data={field.value}
                      onChange={(date) => {
                        field.onChange(date?.format('YYYY-MM-DD'))
                      }}
                      placeholder='Select production time'
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select workspace' />
                      </SelectTrigger>
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

            <FormField
              control={form.control}
              name='applicationId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchedTeamId}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select application' />
                      </SelectTrigger>
                      <SelectContent>
                        {applications?.map((application) => (
                          <SelectItem key={application.id} value={application.id}>
                            <div className='flex items-center gap-2'>
                              <IconCode className='size-4' />
                              {application.name}
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
              name='principalId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchedTeamId}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select principal' />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className='flex items-center gap-2'>
                              <IconUserCircle className='size-4' />
                              {member.name}
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

            <SheetFooter className='gap-2 pt-2 sm:space-x-0'>
              <SheetClose asChild>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </SheetClose>
              <Button type='submit' disabled={isUpdatePending || isCreatePending}>
                {isUpdatePending ? 'Updating...' : isCreatePending ? 'Creating...' : isUpdating ? 'Update' : 'Create'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
