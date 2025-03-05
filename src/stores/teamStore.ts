import { create } from 'zustand'
import { TeamType } from '@/features/teams/types'

interface TeamState {
  teams: TeamType[]
  currentTeam: TeamType | null
  setTeams: (teams: TeamType[] | null) => void
  setCurrentTeam: (team: TeamType) => void
  isLoading: boolean
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  currentTeam: null,
  isLoading: false,
  setTeams: (teams) => set({ teams: teams ?? [] }),
  setCurrentTeam: (team) => set({ currentTeam: team }),
}))

export const useTeams = () => useTeamStore((state) => state.teams)
export const useCurrentTeam = () => useTeamStore((state) => state.currentTeam)
export const useSetTeams = () => useTeamStore((state) => state.setTeams)
export const useSetCurrentTeam = () => useTeamStore((state) => state.setCurrentTeam)
