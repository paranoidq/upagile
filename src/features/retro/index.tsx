import { FC } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const RetroPage: FC = () => {
  return (
    <>
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Retro</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div>生产问题、经验、缺陷分析汇总</div>
        <div>迭代回顾，季度回顾等</div>
      </Main>
    </>
  )
}

export default RetroPage
