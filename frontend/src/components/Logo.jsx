import React from 'react'
import { CiMicrophoneOff } from "react-icons/ci";

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-1 w-fit p-2">
      <div className="bg-primary p-1 rounded-lg shadow-md">
        <CiMicrophoneOff className="text-primary-content text-3xl" />
      </div>
      <h1 className="mb-2 text-3xl tracking-wide font-sans scale-y-150 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        unmute
      </h1>
    </div>
  )
}

export default Logo
