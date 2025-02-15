import { useEffect, useState } from 'react'
import Sidebar from './components/sidebar/sidebar'
import { FileWarning, LogOut, MessageCircleMore, Settings } from 'lucide-react'
import Chat from './components/chat/chat'
import Reports from './components/reports/reports'

export type User = {
  identifier: string;
  name: string;
  role: string;
  image: string;
}

function App() {
  const [selectedOption, setSelectedOption] = useState('chat')
  const options = [
    {
      id: "chat",
      name: "Chat",
      icon: (<MessageCircleMore />),
    },
    {
      id: "reports",
      name: "Reports",
      icon: (<FileWarning />),
    },
    {
      id: "settings",
      name: "Settings",
      icon: (<Settings />),
    },
    {
      id: "logout",
      name: "Logout",
      icon: (<LogOut />),
    },
  ]
  const changeOption = (option: string) => {
    setSelectedOption(option)
  }
  return (
    <div className="dark w-screen h-screen absolute top-0 left-0">
      <div className='flex flex-row bg-background text-primary absolute rounded-md' style={{ width: 1280, height: 720, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Sidebar options={options} selectedOption={changeOption} />
        <div className='flex flex-col p-2 w-full h-full'>
          {selectedOption === 'chat' && <Chat />}
          {selectedOption === 'reports' && <Reports />}
        </div>
        <div className="transform transform-z-0 rounded-md" id='dialog-container' style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: 100}}></div>
      </div>
    </div>
  )
}

export default App
