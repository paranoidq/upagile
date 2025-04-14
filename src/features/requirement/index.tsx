import { type FC } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const Requirement: FC = () => {
  return (
    <>
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Requirements</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div>需求属于通用，需求可以关联多个系统（团队），分解issue</div>
        <div>分解先不要用issue，等具体实施的时候才去关联到issue！！！这样分解是分解，issue是issue，比较合理</div>
        <div>
          路径可以是：需求撰写 = 评审 = 分解为issue，并确定关联系统（根据系统关联workspace）=
          根据issue来关联查看sprint、release等。从而形成一个需求能够对多个团队的工作进行跟踪，并且对功能点也进行跟踪
        </div>
        <div>
          ？？？跟sysnew的区别在哪里？1、可以直接编写、修改、评审需求，2、从全局的角度分解需求，先分解再看团队，3、分解出来的issue可以直接确定关联和依赖，4、迭代级别跟踪每个issue的进度情况
        </div>
      </Main>
    </>
  )
}

export default Requirement
