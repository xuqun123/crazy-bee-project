import { createContext } from 'react'

const CurrentUserContext = createContext(null)
CurrentUserContext.displayName = 'CurrentUserContext'

export default CurrentUserContext
