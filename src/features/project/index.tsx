import { type FC } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const Project: FC = () => {
  return (
    <>
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Projects</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div>project基本CRUD</div>
        <div>project分级为为多个issue</div>
        <div>project需要支持时间线视图，更关注的应该是项目的每个阶段的进展</div>
        <div>需要能够设置private模式，只对部分团队或人员可见</div>
        <div>需要能够生成阶段性的report功能</div>
        <div>
          需求可以关联project，？？？project分解issue的时候，后续如何需求来了如何处理呢？先分解还是先有需求再分解？ ——
          project分解先不要用issue，等具体实施的时候才去关联到issue！！！这样分解是分解，issue是issue，比较合理
        </div>
        <div> project需要支持项目材料的管理维护</div>
        <div> project分解的issue，需要为这个project设置一个统一的root issue，便于后续在issue视图中查看</div>
        <div>
          需要能够设置project的负责人，负责人可以设置多个，可以设置多个项目负责人，可以设置项目负责人为团队，可以设置项目负责人为个人
        </div>
        <div>project分解应该如何分解比较好？思维导图肯定是首选</div>
      </Main>
    </>
  )
}

export default Project
