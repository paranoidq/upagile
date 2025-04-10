interface User {
  name: string
  email: string
  avatar: string
}

interface Team {
  name: string
  logo: React.ElementType
  plan: string
}

interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

export interface NavItem {
  title: string
  url: string
  icon?: React.ElementType
  badge?: string | number
  items?: NavItem[]
}

export interface NavLink extends NavItem {}

export interface NavCollapsible extends NavItem {
  items: NavItem[]
}

interface NavGroup {
  title: string
  items: (NavLink | NavCollapsible)[]
}

interface SidebarData {
  navGroups: NavGroup[]
}

export type { NavCollapsible, NavGroup, NavItem, NavLink, SidebarData }
