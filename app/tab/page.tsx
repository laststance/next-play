'use client'

import { Activity, useState, Suspense } from 'react'
import { TabButtonUnderline } from '@/components/tab-button'
import { Home } from './home'
import { Posts } from './post'
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <>
      <div className="flex gap-4">
        <TabButtonUnderline
          isActive={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        >
          Home
        </TabButtonUnderline>
        <TabButtonUnderline
          isActive={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </TabButtonUnderline>
      </div>

      <Suspense fallback={<h1>Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  )
}
