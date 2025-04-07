import { ReactNode, useEffect, useState } from 'react'
import { IconSettings2 } from '@tabler/icons-react'
import { ChevronRight, Plus } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { CreateTeamDialog } from '@/features/teams/components/create-team-dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { NavCollapsible, NavItem, NavLink, type NavGroup } from './types'

export function NavGroup({ title, items }: NavGroup) {
  const { state } = useSidebar()
  const location = useLocation()
  const href = location.pathname
  const navigate = useNavigate()

  // 添加状态来跟踪展开的项
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // 添加状态控制对话框
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false)

  // 初始化时根据当前路径设置展开状态
  useEffect(() => {
    const activeItem = items.find(
      (item) => item.items && (checkIsActive(href, item) || item.items.some((subItem) => checkIsActive(href, subItem))),
    )

    if (activeItem && activeItem.url) {
      setExpandedItems([activeItem.url])
    }
  }, [href, items])

  // 处理展开/折叠逻辑
  const handleExpand = (itemUrl: string) => {
    setExpandedItems([itemUrl]) // 只保留当前点击的项
  }

  // 修改处理添加团队的函数
  const handleAddTeam = () => {
    setCreateTeamDialogOpen(true)
  }

  return (
    <SidebarGroup>
      {/* 为 Workspaces 标题添加添加团队按钮 */}
      <div className='flex items-center justify-between'>
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
        {title === 'Workspaces' && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 mr-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    onClick={handleAddTeam}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>添加团队</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 添加创建团队对话框 */}
            <CreateTeamDialog
              open={createTeamDialogOpen}
              onOpenChange={setCreateTeamDialogOpen}
              onSuccess={() => {
                // 可以在这里刷新团队列表
              }}
            />
          </>
        )}
      </div>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`
          const isExpanded = item.url ? expandedItems.includes(item.url) : false

          if (!item.items) return <SidebarMenuLink key={key} item={item} href={href} />

          if (state === 'collapsed')
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                href={href}
                onExpand={() => item.url && handleExpand(item.url)}
              />
            )

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item}
              href={href}
              isExpanded={isExpanded}
              onExpand={() => item.url && handleExpand(item.url)}
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => {
  return <Badge variant='outline'>{children}</Badge>
}

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={checkIsActive(href, item)} tooltip={item.title}>
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
  href,
  isExpanded,
  onExpand,
}: {
  item: NavCollapsible
  href: string
  isExpanded: boolean
  onExpand: () => void
}) => {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()

  // 处理 Workspace 点击事件
  const handleWorkspaceClick = (e: React.MouseEvent) => {
    // 如果点击的是箭头图标区域，则不导航
    if ((e.target as HTMLElement).closest('.chevron-container')) {
      return
    }

    // 导航到 workspace 页面
    if (item.url) {
      navigate(item.url)
      setOpenMobile(false)
      // 展开当前项并折叠其他项
      onExpand()
    }
  }

  return (
    <Collapsible
      asChild
      open={isExpanded}
      onOpenChange={(open) => {
        if (open) onExpand()
      }}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <div className='flex w-full items-center'>
          {/* 可点击的主要内容 */}
          <div className='flex-1 cursor-pointer' onClick={handleWorkspaceClick}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
            </SidebarMenuButton>
          </div>

          {/* 折叠/展开按钮 */}
          <CollapsibleTrigger asChild>
            <div className='chevron-container p-2 hover:bg-sidebar-accent rounded-md'>
              <ChevronRight className='h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild isActive={checkIsActive(href, subItem)}>
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
  onExpand,
}: {
  item: NavCollapsible
  href: string
  onExpand: () => void
}) => {
  const navigate = useNavigate()

  // 处理 Workspace 点击事件
  const handleWorkspaceClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，避免触发下拉菜单
    e.stopPropagation()

    // 导航到 workspace 页面
    if (item.url) {
      navigate(item.url)
      // 展开当前项并折叠其他项
      onExpand()
    }
  }

  // 处理设置按钮点击事件
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡

    // 从 URL 中提取 teamId
    const teamId = item.url?.split('/').pop()
    if (teamId) {
      navigate(`/workspace/${teamId}/settings`)
    }
  }

  // 检查是否为工作区项目
  const isWorkspace =
    item.url?.includes('/workspace/') &&
    !item.url?.includes('/issues') &&
    !item.url?.includes('/sprints') &&
    !item.url?.includes('/releases')

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex w-full items-center'>
            <div className='flex-1 cursor-pointer' onClick={handleWorkspaceClick}>
              <SidebarMenuButton tooltip={item.title} isActive={checkIsActive(href, item)}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
              </SidebarMenuButton>
            </div>
            {isWorkspace && (
              <div
                className='p-1 rounded-full hover:bg-sidebar-accent cursor-pointer'
                onClick={handleSettingsClick}
                title={`${item.title} 设置`}
              >
                <IconSettings2 className='size-4 text-sidebar-foreground' />
              </div>
            )}
            <div className='ml-auto p-1'>
              <ChevronRight className='h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link to={sub.url} className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}>
                {sub.icon && <sub.icon />}
                <span className='max-w-52 text-wrap'>{sub.title}</span>
                {sub.badge && <span className='ml-auto text-xs'>{sub.badge}</span>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, checkChildren = false): boolean {
  if (href === item.url) return true
  if (checkChildren && item.items) {
    return item.items.some((child) => href === child.url)
  }
  return false
}
