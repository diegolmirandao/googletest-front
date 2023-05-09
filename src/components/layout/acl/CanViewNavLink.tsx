// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from './Can'

// ** Types
import { NavLink } from '../../../types/Layout'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null
}

export default CanViewNavLink
