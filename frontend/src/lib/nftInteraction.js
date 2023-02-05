const installMetamaskError = {
  address: '',
  message: (
    <span>
      🦊{' '}
      <a
        style={{ color: '#fff' }}
        target="_blank"
        href={`https://metamask.io/download`}
        rel="noreferrer"
      >
        To connect your wallet, <strong>you must install Metamask extenstion</strong> in your
        browser first!
      </a>
    </span>
  ),
  severity: 'warning',
}

const connectToWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const obj = {
        message: 'Your wallet has been connected successfully!',
        address: addressArray[0],
      }
      return obj
    } catch (err) {
      return {
        address: '',
        message: '😥 ' + err.message,
        severity: 'error',
      }
    }
  } else {
    return installMetamaskError
  }
}

const getConnectedWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          message: 'Your wallet has been connected successfully!',
        }
      } else {
        return {
          address: '',
          message: '🦊 Please connect to Metamask wallet using the top right button!',
        }
      }
    } catch (err) {
      return {
        address: '',
        message: '😥 Wallet connection failed: ' + err.message,
        severity: 'error',
      }
    }
  } else {
    return installMetamaskError
  }
}

export { connectToWallet, getConnectedWallet }
