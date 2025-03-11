import React, { useEffect } from 'react'
import { useTeamStore } from '@/stores/teamStore'
import { cn } from '@/lib/utils'
import { useListMyTeams } from '@/features/teams/services'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, ...props }: MainProps) => {
  const { data: teams } = useListMyTeams()
  const { setTeams, setCurrentTeam } = useTeamStore()

  useEffect(() => {
    if (teams) {
      setTeams(teams)
      // 只有当没有当前选中的团队时，才设置第一个团队为当前团队
      if (!useTeamStore.getState().currentTeam && teams.length > 0) {
        setCurrentTeam(teams[0])
      }
    }
  }, [teams, setTeams, setCurrentTeam])

  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'px-4 py-1',
        fixed && 'fixed-main flex flex-col flex-grow overflow-hidden',
      )}
      {...props}
    />
  )
}

Main.displayName = 'Main'
