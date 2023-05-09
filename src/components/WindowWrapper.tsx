// ** React Imports
import { useState, useEffect, ReactNode } from 'react'

// ** Next Import
import { useLocation } from 'react-router-dom'

interface Props {
  children: ReactNode
}

const WindowWrapper = ({ children }: Props) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)

  const location = useLocation()

  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        setWindowReadyFlag(true)
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location]
  )

  if (windowReadyFlag) {
    return <>{children}</>
  } else {
    return null
  }
}

export default WindowWrapper
