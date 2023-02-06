import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import CollectionsIcon from '@mui/icons-material/Collections'
import ImageIcon from '@mui/icons-material/Image'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import SocketContext from '../lib/SocketContext'

const calculateMsgCount = () => {
  try {
    const existingNotifications = localStorage.getItem('notifications')
      ? JSON.parse(localStorage.getItem('notifications'))
      : []

    return existingNotifications.length
  } catch (err) {
    console.error('Something went wrong when calculating the number of notifications: ', err)
    return 0
  }
}

function MessagesBadge() {
  const socket = useContext(SocketContext)
  const [msgCount, setMsgCount] = useState(calculateMsgCount())

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const getExistingNotifications = () => {
    try {
      const existingNotifications = localStorage.getItem('notifications')
        ? JSON.parse(localStorage.getItem('notifications'))
        : []

      return existingNotifications
    } catch (e) {
      return []
    }
  }

  const addNotification = (msg) => {
    try {
      const existingNotifications = getExistingNotifications()

      existingNotifications.push(msg)
      localStorage.setItem('notifications', JSON.stringify(existingNotifications))
    } catch (err) {
      console.error('Something went wrong when inserting notifcations to localStorage: ', err)
    }
  }

  const removeNotifcaiton = (msg) => {
    try {
      const existingNotifications = getExistingNotifications()

      const newNotifications = existingNotifications.filter((m) => m.id !== msg.id)
      localStorage.setItem('notifications', JSON.stringify(newNotifications))
      setMsgCount(calculateMsgCount())
    } catch (err) {
      console.error('Something went wrong when removing notifcations from localStorage: ', err)
    }
  }

  const renderNotificationMessages = () => {
    const existingNotifications = getExistingNotifications()

    return existingNotifications.map((msg) => {
      const text =
        msg.type === 'collection' ? (
          <span>
            A new collection <Link to={`/collections/${msg.id}`}>{msg.name}</Link> has been just
            created!
          </span>
        ) : (
          <span>
            A new asset <Link to={`/assets/${msg.id}`}>{msg.name}</Link> has been just created!
          </span>
        )

      return (
        <MenuItem key={msg.id} onClick={() => removeNotifcaiton(msg)}>
          <ListItemIcon>
            {msg.type === 'collection' ? (
              <ImageIcon fontSize="small" />
            ) : (
              <CollectionsIcon fontSize="small" />
            )}
          </ListItemIcon>
          {text}
        </MenuItem>
      )
    })
  }

  useEffect(() => {
    if (socket) {
      socket.off('assetOrCollectionCreated').on('assetOrCollectionCreated', (msg) => {
        console.log(`[socket] a new ${msg.type} has been created: `, msg)
        addNotification(msg)
        setMsgCount(calculateMsgCount())
      })
    }

    return () => {
      if (socket)
        socket.off('assetOrCollectionCreated', () =>
          console.log("[socket] 'assetOrCollectionCreated' event disconnected")
        )
    }
  }, [socket])

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip
          title={
            msgCount > 0 ? (
              <>
                <strong>{msgCount}</strong> notification{msgCount !== 1 ? 's' : ''}
              </>
            ) : (
              'no notifications'
            )
          }
          arrow={true}
        >
          <IconButton
            onClick={handleClick}
            aria-controls={open ? 'notifications-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {msgCount > 0 ? (
              <Badge badgeContent={msgCount} color="error">
                <ChatBubbleIcon />
              </Badge>
            ) : (
              <ChatBubbleOutlineIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      {msgCount > 0 && (
        <Menu
          anchorEl={anchorEl}
          id="notifications-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {renderNotificationMessages()}
        </Menu>
      )}
    </>
  )
}

export default MessagesBadge
