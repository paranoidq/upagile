import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type DialogType = 'create' | 'update' | 'delete' | 'import'

interface ContextType<T> {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: T | null
  setCurrentRow: React.Dispatch<React.SetStateAction<T | null>>
}

const Context = React.createContext<ContextType<any> | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ViewTableProvider<T>({ children }: Props) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<T | null>(null)
  return <Context value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</Context>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTableData = <T,>() => {
  const context = React.useContext(Context) as ContextType<T> | null

  if (!context) {
    throw new Error('useTableData has to be used within <ViewTableProvider>')
  }

  return context
}
