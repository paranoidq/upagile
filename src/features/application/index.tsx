import { FC } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const ApplicationPage: FC = () => {
  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Applications</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div>系统创建、编辑、删除、查看</div>
        <div>系统设计文档、架构文档、运维文档、报错码、环境信息等的版本维护和演进</div>
      </Main>
    </>
  )
}

export default ApplicationPage
