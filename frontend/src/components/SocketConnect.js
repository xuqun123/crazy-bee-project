import io from 'socket.io-client'
import { useState, useEffect } from 'react'

function SocketConnect() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const connection = io(process.env.REACT_APP_WS_URL)
    console.log('[socket] connection started.')
    setSocket(connection)

    connection.on('number', (msg) => {
      console.log('Random number: ' + msg)
    })

    return () => {
      connection.close()
      console.log('[socket] connection closed.')
    }
  }, [])

  return socket
}

export default SocketConnect
