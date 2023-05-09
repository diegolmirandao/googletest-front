// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import { useLocation } from 'react-router-dom'

// ** Types
import type { ACLObj, AppAbility } from 'src/config/acl'

// ** Context Imports
import { AbilityContext } from '../layout/acl/Can'

// ** Config Import
import { buildAbility } from 'src/config/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import BlankLayout from '../layout/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)
  
  // ** Hooks
  const auth = useAuth()
  const location = useLocation()
  
  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (guestGuard || location.pathname === '/404' || location.pathname === '/500') {
    return <>{children}</>
  }
  
  // User is logged in, build ability for the user based on his role
  if (auth.isAuthenticated && !ability) {
    setAbility(buildAbility(auth.user?.permissions))
  }

  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
