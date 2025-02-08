import { useState } from 'react'
import Sidebar from './components/sidebar/sidebar'
import { FileWarning, LogOut, Settings } from 'lucide-react'

function App() {
  const [selectedOption, setSelectedOption] = useState('reports')
  const options = [
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
    <div className='dark'>
      <div className='flex flex-row bg-background text-primary absolute rounded-md' style={{ width: 1280, height: 720, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Sidebar options={options} selectedOption={changeOption} />
        <div className='flex flex-col flex-1 p-2'>
        </div>
      </div>
    </div>
  )
}

export default App
