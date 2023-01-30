import { createContext } from 'react'

const AlertMessageContext = createContext({
  alert: { message: '', severity: 'success' },
  setAlert: () => {},
})
AlertMessageContext.displayName = 'AlertMessageContext'

export default AlertMessageContext
