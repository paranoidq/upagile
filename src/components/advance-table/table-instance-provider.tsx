import { createContext, useContext, useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { View } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableInstanceContextProps<T = any> {
  tableInstance: Table<T>
  setTableInstance: React.Dispatch<React.SetStateAction<Table<T>>>
  currentView: View | undefined
  setCurrentView: React.Dispatch<React.SetStateAction<View | undefined>>
}

const TableInstanceContext = createContext<TableInstanceContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableInstance: {} as Table<any>,
  setTableInstance: () => {},
  currentView: undefined,
  setCurrentView: () => {},
})

export function useTableInstanceContext() {
  const context = useContext(TableInstanceContext)
  if (!context) {
    throw new Error('useTableInstanceContext must be used within a TableInstanceProvider')
  }
  return context
}

export function TableInstanceProvider<T>({ table, children }: { table: Table<T>; children: React.ReactNode }) {
  const [tableInstance, setTableInstance] = useState<Table<T>>(table)
  const [currentView, setCurrentView] = useState<View | undefined>(undefined)
  return (
    <TableInstanceContext.Provider value={{ tableInstance, setTableInstance, currentView, setCurrentView }}>
      {children}
    </TableInstanceContext.Provider>
  )
}
