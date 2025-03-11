import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { priorities } from '@/consts/enums'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { Backlog, BacklogSchema, backlogTypes } from '../types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Backlog
}

export function BacklogMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<Backlog>({
    resolver: zodResolver(BacklogSchema),
    defaultValues: currentRow ?? {
      name: '',
      description: '',
      backlogType: '',
      priority: '',
      dueTime: '',
      estimatedTime: 0,
    },
  })

  const onSubmit = (data: Backlog) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Backlog</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the backlog by providing necessary info.'
              : 'Add a new backlog by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form id='backlog-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 flex-1'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='输入backlog名称' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='backlogType'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Backlog Type</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      items={backlogTypes}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select dropdown'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem className='space-y-3 relative'>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      {priorities.map((priority) => (
                        <FormItem className='flex items-center space-x-3 space-y-0' key={priority.value}>
                          <FormControl>
                            <RadioGroupItem value={priority.value} />
                          </FormControl>
                          <FormLabel className='font-normal'>{priority.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='backlog-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
