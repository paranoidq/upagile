import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const Docs = () => {
  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Docs</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div>用于平时整理一些方案之类或者写一些材料，类似一个wps的文档库，所有文档都可以往里面放</div>
      </Main>
    </>
  )
}

export default Docs
