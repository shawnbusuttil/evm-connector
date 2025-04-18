
import { EthereumProvider } from './providers/EthereumProvider';
import { Wallet } from './components/Wallet';

function App() {
  return (
      <div className='mx-5'>
        <EthereumProvider>
          <Wallet />
        </EthereumProvider>
      </div>
  )
}

export default App
