import { useParams } from 'react-router-dom'
import { create } from 'zustand'
import { Team } from '@/features/workspace/types'

interface TeamState {
  teams: Team[]
  setTeams: (teams: Team[] | null) => void
  isLoading: boolean
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  isLoading: false,
  setTeams: (teams) => set({ teams: teams ?? [] }),
}))

export const useTeams = () => useTeamStore((state) => state.teams)
export const useCurrentTeam: () =>
  | Team
  | {
      id: undefined
    } = () => {
  const { teamId } = useParams()
  const teams = useTeams()
  return (
    teams.find((team) => team.id === teamId) || {
      id: undefined,
    }
  )
}
export const useSetTeams = () => useTeamStore((state) => state.setTeams)
