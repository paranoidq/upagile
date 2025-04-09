import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamType } from '../types'

interface WorkspaceAdvancedManageProps {
  selectedWorkspace: TeamType | undefined
}

const WorkspaceAdvancedManage = ({ selectedWorkspace }: WorkspaceAdvancedManageProps) => {
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-2'>
          <CardTitle>权限设置</CardTitle>
          <CardDescription>管理工作区的权限</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>权限设置功能正在开发中...</p>
      </CardContent>
    </Card>
  )
}

export default WorkspaceAdvancedManage
