import { FC } from 'react'
import { Sprint } from '../types'

interface SprintCalendarProps {
  data: Sprint[] | undefined
}

const SprintCalendar: FC<SprintCalendarProps> = ({ data }) => {
  return <div>SprintCalendar</div>
}

export default SprintCalendar
