'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
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
import { useUpdateRelease } from '../_lib/services'
import { Release, releaseStatus, updateReleaseSchema, UpdateReleaseSchema } from '../types'

interface UpdateReleaseSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  release: Release | null
}

export function UpdateReleaseSheet({ release, ...props }: UpdateReleaseSheetProps) {
  const { mutateAsync: updateRelease, isPending: isUpdatePending } = useUpdateRelease()

  const form = useForm<UpdateReleaseSchema>({
    resolver: zodResolver(updateReleaseSchema),
  })

  // 当 backlog 变化时重置表单
  React.useEffect(() => {
    if (release) {
      form.reset({
        id: release.id,
        title: release.title ?? '',
        description: release?.description ?? '',
        testTime: release?.testTime,
        releaseTime: release?.releaseTime,
        productionTime: release?.productionTime,
        status: release?.status,
        principalId: release?.principal?.id,
        applicationId: release?.application?.id,
      })
    }
  }, [release])

  function onSubmit(input: UpdateReleaseSchema) {
    // 确保 title 有值
    const data = {
      ...input,
      title: input.title || release?.title || '',
    }

    toast.promise(updateRelease(data), {
      loading: 'Updating release...',
      success: () => {
        form.reset()
        props.onOpenChange?.(false)
        return 'Release updated'
      },
      error: (e) => ({
        message: e.message,
        description: e.reason,
      }),
    })
  }

  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-md'>
        <SheetHeader className='text-left'>
          <SheetTitle>Update release</SheetTitle>
          <SheetDescription>Update the release details and save the changes</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' placeholder='' {...field} />
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
                    <Input type='date' placeholder='' {...field} />
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
                    <Input type='date' placeholder='' {...field} />
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
                    <Input type='date' placeholder='' {...field} />
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
              <Button disabled={isUpdatePending}>
                {isUpdatePending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
