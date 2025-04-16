import { create } from 'zustand'
import { Team } from '@/features/workspace/types'

interface TeamState {
  teams: Team[]
  currentTeam: Team | null
  setTeams: (teams: Team[] | null) => void
  setCurrentTeam: (team: Team) => void
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
