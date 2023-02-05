import { useState, useEffect, useContext, forwardRef } from 'react'
import WalletIcon from '@mui/icons-material/Wallet'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import IconButton from '@mui/material/IconButton'
import TokenIcon from '@mui/icons-material/Token'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { getConnectedWallet, connectToWallet } from '../lib/nftInteraction'
import { generateWalletAddress } from '../lib/utils'
import AlertMessageContext from '../lib/AlertMessageContext'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState('')
  const { setAlert } = useContext(AlertMessageContext)
  const [open, setOpen] = useState(false)

  const handleClickOpen = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleClose = (event) => {
    event.preventDefault()
    setOpen(false)
  }

  const connectWalletPressed = async () => {
    const { message, address, severity } = await connectToWallet()
    setAlert({ message, severity })
    setWalletAddress(address)
  }

  useEffect(() => {
    async function fetchWallet() {
      const { address, message, severity } = await getConnectedWallet()
      setWalletAddress(address)
      setAlert({ message, severity })
    }
    fetchWallet()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts?.length === 0) {
          setAlert({ message: 'You wallet has been disconnected successfully!' })
          setWalletAddress('')
        }
      })
    }
  }, [setAlert])

  return walletAddress.length > 0 ? (
    <>
      <Tooltip title="connected wallet address" arrow={true}>
        <Chip
          sx={{ borderRadius: 1, margin: 0.5 }}
          label={
            <>
              <TokenIcon sx={{ verticalAlign: 'middle', fontSize: 15, mr: 0.4, mb: 0.3 }} />
              <strong>{generateWalletAddress(walletAddress)}</strong>
            </>
          }
          color="info"
          variant="contained"
        />
      </Tooltip>
      <Tooltip
        title="please disconnect your crypto wallet using the MetaMask browser extension instead!"
        arrow={true}
      >
        <IconButton onClick={handleClickOpen}>
          <AccountBalanceWalletIcon color="alert" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Please use "MetaMask browser extension" instead!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Disconnect a digitial wallet is currently not avaliable in Web 2.0!
            <br />
            <br />
            More details can be found here:{' '}
            <a
              target="_blank"
              href={`https://github.com/MetaMask/metamask-extension/issues/10353`}
              rel="noreferrer"
            >
              MetaMask doesn't support that operation unfortunately.
            </a>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  ) : (
    <Tooltip title="connect to a crypto wallet" arrow={true}>
      <IconButton onClick={connectWalletPressed}>
        <WalletIcon />
      </IconButton>
    </Tooltip>
  )
}

export default WalletConnect
