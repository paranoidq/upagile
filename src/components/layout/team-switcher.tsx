import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconNavigationBolt, IconStar } from '@tabler/icons-react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { useAuthStore } from '@/stores/authStore'
import { useTeamStore } from '@/stores/teamStore'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { checkTeamNameExisted, useCreateTeam } from '@/features/teams/_lib/services'

const formSchema = z.object({
  name: z.string().min(1, '请输入团队名称'),
  description: z.string().optional(),
})

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { teams, currentTeam } = useTeamStore()
  const { user } = useAuthStore().auth
  const [dialogOpen, setDialogOpen] = useState(false)
  const { mutate: createTeam } = useCreateTeam()
  const navigate = useNavigate()

  /* ------------------ form ------------------ */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  /* ------------------ name check ------------------ */
  const teamName = form.watch('name')
  // 添加状态来跟踪名称检查
  const [nameExists, setNameExists] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // 使用 debounce 处理名称检查
  const checkNameDebounced = useDebouncedCallback(async (name: string) => {
    if (!name || name.trim() === '') {
      setNameExists(false)
      return
    }

    setIsChecking(true)
    try {
      const exists = await checkTeamNameExisted(name.trim())
      setNameExists(exists)
    } catch (error) {
      console.error('检查团队名称失败', error)
    } finally {
      setIsChecking(false)
    }
  }, 500) // 500ms 延迟

  // 当团队名称变化时触发检查
  useEffect(() => {
    checkNameDebounced(teamName)

    // 清理函数
    return () => {
      checkNameDebounced.cancel()
    }
  }, [teamName, checkNameDebounced])

  /* ------------------ change active team ------------------ */
  const handleTeamChange = (teamId: string) => {
    const activeTeam = teams.find((team) => team.id === teamId)

    // 更新 localStorage 中的 activeTeam
    useTeamStore.getState().setCurrentTeam(activeTeam!)
  }

  /* ------------------ add team ------------------ */
  const handleAddTeam = async (values: z.infer<typeof formSchema>) => {
    // 再次检查名称是否已存在
    try {
      if (nameExists) {
        form.setError('name', {
          type: 'manual',
          message: '团队名称已存在，请换个名称吧',
        })
        return
      }

      createTeam(values)
      setDialogOpen(false)
      form.reset()
      toast({
        title: '创建成功',
        description: '团队创建成功',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: '团队创建失败，请重试',
      })
    }
  }

  /* ------------------ UI render ------------------ */
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {currentTeam && <IconNavigationBolt className='size-4' />}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>XAgile</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Workspaces</DropdownMenuLabel>
            {teams &&
              teams.map((team) => (
                <DropdownMenuItem key={team.id} onClick={() => handleTeamChange(team.id)} className='gap-2 p-2'>
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <IconNavigationBolt className='size-4 shrink-0' />
                  </div>
                  {team.name}

                  {/* 如果是当前用户创建的团队，则显示特殊图标 */}
                  {team.owner.username === user?.username && <IconStar className='ml-auto size-4 shrink-0' />}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='gap-2 p-2'
              onSelect={(e) => {
                e.preventDefault()
                setDialogOpen(true)
              }}
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>添加Workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* 添加团队对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建Workspace</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddTeam)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace名称</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input placeholder='输入团队名称' {...field} />
                        {isChecking && (
                          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                            <div className='size-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {nameExists && (
                      <p className='text-sm font-medium text-destructive'>Workspace名称已存在，请换个名称吧</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder='输入Workspace描述（可选）' className='resize-none' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={() => setDialogOpen(false)}>
                  取消
                </Button>
                <Button type='submit' disabled={nameExists || isChecking}>
                  创建
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}
