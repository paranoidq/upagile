import React, { useEffect } from 'react'
import { useTeamStore } from '@/stores/teamStore'
import { cn } from '@/lib/utils'
import { useListMyTeams } from '@/features/workspace/_lib/services'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, ...props }: MainProps) => {
  const { data: teams } = useListMyTeams()
  const { setTeams } = useTeamStore()

  useEffect(() => {
    if (teams) {
      setTeams(teams)
    }
  }, [teams, setTeams])

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
