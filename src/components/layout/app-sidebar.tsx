import { useEffect, useState } from 'react'
import { DownOutlined, PlusOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Layout, Menu, Tooltip } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTeamStore } from '@/stores/teamStore'
import { useListMyTeams } from '@/features/teams/_lib/services'
import { CreateTeamDialog } from '@/features/teams/components/create-team-dialog'
import { getSidebarData } from './data/sidebar-data'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

export function AppSidebar({
  collapsed,
  onCollapse,
}: {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}) {
  const { data: teams, isLoading } = useListMyTeams()
  const { setTeams, teams: storeTeams } = useTeamStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false)

  // 当获取到团队数据时，更新 store
  useEffect(() => {
    if (teams) {
      setTeams(teams)
    }
  }, [teams, setTeams])

  // 使用 storeTeams 或 teams 来生成侧边栏数据
  const myTeams = storeTeams.length > 0 ? storeTeams : teams || []
  const sidebarData = getSidebarData(myTeams)

  // 根据当前路径设置选中的菜单项
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)

    // 设置选中的菜单项
    if (pathSegments.length > 0) {
      setSelectedKeys([location.pathname])
    } else {
      setSelectedKeys(['/dashboard'])
    }

    // 设置展开的子菜单
    if (pathSegments.length > 0) {
      // 如果是工作区相关路径，展开工作区菜单
      if (pathSegments[0] === 'workspace') {
        setOpenKeys((prev) => {
          if (!prev.includes('Workspaces')) {
            return [...prev, 'Workspaces']
          }
          return prev
        })
      }
    }
  }, [location.pathname])

  // 处理菜单项点击
  const handleMenuClick = (info: { key: string }) => {
    navigate(info.key)
  }

  // 处理子菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  // 处理设置图标点击
  const handleSettingsClick = (e: React.MouseEvent, teamId: string) => {
    e.stopPropagation()
    navigate(`/workspace/${teamId}/settings`)
  }

  // 处理添加团队按钮点击
  const handleAddTeam = () => {
    setCreateTeamDialogOpen(true)
  }

  // 将侧边栏数据转换为 Ant Design Menu 组件所需的格式
  const getMenuItems = (): MenuItem[] => {
    const menuItems: MenuItem[] = []

    sidebarData.navGroups.forEach((group) => {
      // 添加分组标题
      menuItems.push({
        type: 'group',
        label: group.title,
        key: group.title,
        children: group.items.map((item) => {
          // 如果是工作区分组，添加添加团队按钮
          if (group.title === 'Workspaces' && item.title === 'My Workspace(private)') {
            return {
              key: item.url,
              icon: item.icon ? <item.icon className='text-lg' /> : null,
              label: (
                <div className='flex items-center justify-between w-full truncate text-ellipsis'>
                  <span>{item.title}</span>
                </div>
              ),
              onClick: () => navigate(item.url),
            }
          }

          // 如果有子项，创建子菜单
          if (item.items && item.items.length > 0) {
            return {
              key: item.url,
              icon: item.icon ? <item.icon className='text-lg' /> : null,
              label: (
                <div className='flex items-center justify-between w-full text-base'>
                  <span>{item.title}</span>
                  {item.url?.includes('/workspace/') &&
                    !item.url?.includes('/issues') &&
                    !item.url?.includes('/sprints') &&
                    !item.url?.includes('/releases') && (
                      <Tooltip title={`workspace设置`}>
                        <SettingOutlined
                          className='ml-2 mr-2 text-gray-400 hover:text-gray-500'
                          onClick={(e) => {
                            const teamId = item.url?.split('/').pop()
                            if (teamId) {
                              handleSettingsClick(e, teamId)
                            }
                          }}
                        />
                      </Tooltip>
                    )}
                </div>
              ),
              children: item.items.map((subItem) => ({
                key: subItem.url,
                icon: subItem.icon ? <subItem.icon className='text-lg' /> : null,
                label: subItem.title,
              })),
            }
          }

          // 普通菜单项
          return {
            key: item.url,
            icon: item.icon ? <item.icon className='text-lg' /> : null,
            label: item.title,
          }
        }),
      })
    })

    return menuItems
  }

  // 添加团队按钮
  const AddTeamButton = () => (
    <div className='px-4 mt-2'>
      <Button
        type='dashed'
        icon={<PlusOutlined />}
        block
        onClick={handleAddTeam}
        className='flex items-center justify-center'
      >
        添加工作区
      </Button>
    </div>
  )

  return (
    <Sider width={220} collapsible collapsed={collapsed} onCollapse={onCollapse} theme='light' className='border-r'>
      <div className='p-4'>
        <div className='flex items-center space-x-2 mb-4'>
          <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>X</div>
          {!collapsed && <span className='text-lg font-semibold'>XAgile</span>}
        </div>
      </div>

      <Menu
        mode='inline'
        items={getMenuItems()}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        expandIcon={({ isOpen }) => (isOpen ? <DownOutlined /> : <RightOutlined />)}
      />

      {!collapsed && <AddTeamButton />}

      <CreateTeamDialog
        open={createTeamDialogOpen}
        onOpenChange={setCreateTeamDialogOpen}
        onSuccess={() => {
          // 可以在这里刷新团队列表
        }}
      />
    </Sider>
  )
}
