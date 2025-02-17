import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType<T> {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: T | null
  setCurrentRow: React.Dispatch<React.SetStateAction<T | null>>
}

const TasksContext = React.createContext<TasksContextType<any> | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider<T>({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<T | null>(null)
  return <TasksContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</TasksContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = <T,>() => {
  const tasksContext = React.useContext(TasksContext) as TasksContextType<T> | null

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
