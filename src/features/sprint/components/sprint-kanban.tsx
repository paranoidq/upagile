import { FC } from 'react'
import { Sprint } from '../types'

interface SprintKanbanProps {
  data: Sprint[] | undefined
}

const SprintKanban: FC<SprintKanbanProps> = ({ data }) => {
  return <div>SprintKanban</div>
}

export default SprintKanban
