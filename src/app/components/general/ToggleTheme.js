import React from 'react'
import { useAppContext } from '../context/provider'

const ToggleTheme = () => {

    const { toggleTheme } = useAppContext();

  return (
    <div>
        <button className="theme-button fixed" onClick={() => toggleTheme()}>Toggle</button>
    </div>
  )
}

export default ToggleTheme