import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  LayoutDashboard, 
  ClipboardList, 
  StickyNote, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Settings as SettingsIcon,
  UserCog,
  Bell,
  Link,
  CreditCard,
  PlaneTakeoff,
  MessageSquare
} from 'lucide-react'
import PersonalNotes from './PersonalNotes'
import KanbanBoard from './KanbanBoard'

// Tabs for sidebar navigation
type DashboardTab = 'overview' | 'tasks' | 'notes' | 'profile' | 'settings'

// Settings menu item type
type SettingsMenuItem = {
  icon: React.ElementType;
  label: string;
  action: () => void;
}

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  const settingsMenuItems: SettingsMenuItem[] = [
    {
      icon: UserCog,
      label: 'My Account',
      action: () => {
        // TODO: Implement My Account functionality
        console.log('My Account clicked')
      }
    },
    {
      icon: Bell,
      label: 'My Notifications',
      action: () => {
        // TODO: Implement Notifications functionality
        console.log('Notifications clicked')
      }
    },
    {
      icon: Link,
      label: 'Connected Apps',
      action: () => {
        // TODO: Implement Connected Apps functionality
        console.log('Connected Apps clicked')
      }
    },
    {
      icon: PlaneTakeoff,
      label: 'Plans',
      action: () => {
        // TODO: Implement Plans functionality
        console.log('Plans clicked')
      }
    },
    {
      icon: CreditCard,
      label: 'Billing & Invoices',
      action: () => {
        // TODO: Implement Billing functionality
        console.log('Billing clicked')
      }
    },
    {
      icon: MessageSquare,
      label: 'Give Feedback',
      action: () => {
        // TODO: Implement Feedback functionality
        console.log('Feedback clicked')
      }
    }
  ]

  const SidebarNavigation = () => {
    const navItems: { 
      tab: DashboardTab, 
      icon: React.ElementType, 
      label: string 
    }[] = [
      { 
        tab: 'overview', 
        icon: LayoutDashboard, 
        label: 'Dashboard' 
      },
      { 
        tab: 'tasks', 
        icon: ClipboardList, 
        label: 'Tasks' 
      },
      { 
        tab: 'notes', 
        icon: StickyNote, 
        label: 'Notes' 
      },
      { 
        tab: 'profile', 
        icon: UserIcon, 
        label: 'Profile' 
      },
      { 
        tab: 'settings', 
        icon: SettingsIcon, 
        label: 'Settings' 
      }
    ]

    return (
      <nav className="space-y-2">
        {navItems.map((item) => (
          <div key={item.tab} className="relative">
            <button
              onClick={() => {
                setActiveTab(item.tab)
                setIsSidebarOpen(false)
                if (item.tab === 'settings') {
                  toggleSettings()
                } else {
                  setIsSettingsOpen(false)
                }
              }}
              className={`
                w-full flex items-center p-3 rounded-lg transition-all duration-200
                ${activeTab === item.tab 
                  ? 'bg-royal-blue-100 text-royal-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>

            {item.tab === 'settings' && isSettingsOpen && (
              <div className="absolute left-full top-0 ml-2 w-64 bg-white shadow-lg rounded-lg border">
                {settingsMenuItems.map((settingItem) => (
                  <button
                    key={settingItem.label}
                    onClick={() => {
                      settingItem.action()
                      setIsSettingsOpen(false)
                      setIsSidebarOpen(false)
                    }}
                    className="w-full flex items-center p-3 hover:bg-gray-100 transition-colors"
                  >
                    <settingItem.icon className="mr-3 h-5 w-5 text-gray-600" />
                    {settingItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    )
  }

  const DashboardContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Total Tasks</h2>
                <p className="text-3xl font-bold text-royal-blue-600">12</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
                <p className="text-3xl font-bold text-yellow-600">4</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Notes</h2>
                <p className="text-3xl font-bold text-royal-blue-600">5</p>
              </div>
            </div>
          </div>
        )
      case 'tasks':
        return <KanbanBoard />
      case 'notes':
        return <PersonalNotes />
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Profile Details</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-royal-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-royal-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{user.email}</h2>
                  <p className="text-gray-500">Registered User</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsMenuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="bg-white shadow-md rounded-lg p-6 flex items-center hover:bg-gray-50 transition-colors"
                >
                  <item.icon className="mr-4 h-8 w-8 text-royal-blue-600" />
                  <span className="text-xl font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Hamburger Menu */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <X className="h-6 w-6 text-royal-blue-600" /> : <Menu className="h-6 w-6 text-royal-blue-600" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg 
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-royal-blue-600">Dashboard</h1>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden"
            aria-label="Close Sidebar"
          >
            <X className="h-6 w-6 text-royal-blue-600" />
          </button>
        </div>
        <div className="p-4">
          <SidebarNavigation />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-md p-4 flex justify-end items-center">
          <button 
            onClick={handleSignOut}
            className="flex items-center text-royal-blue-600 hover:text-royal-blue-700 transition-colors"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <DashboardContent />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default Dashboard
