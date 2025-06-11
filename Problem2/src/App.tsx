import { useState, useEffect } from 'react'
import './App.css'

interface Token {
  symbol: string
  name: string
  logo?: string
  address: string
}

function App() {
  const [sellAmount, setSellAmount] = useState<string>('')
  const [buyAmount, setBuyAmount] = useState<string>('')
  const [prices, setPrices] = useState<{currency: string, date: string, price: number}[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  const [sellToken, setSellToken] = useState<Token>({
    symbol: 'SOL',
    name: 'Solana',
    address: 'DEkq...EonT'
  })
  
  const [buyToken, setBuyToken] = useState<Token>({
    symbol: 'USDC',
    name: 'USD Coin',
    address: 'EPjF...Zj2c'
  })
  
  const [showSellTokenModal, setShowSellTokenModal] = useState<boolean>(false)
  const [showBuyTokenModal, setShowBuyTokenModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activePanel, setActivePanel] = useState<'sell' | 'buy'>('sell')
  
  // Fetch prices from prices.json
  useEffect(() => {
    fetch('/prices.json')
      .then(response => response.json())
      .then(data => {
        setPrices(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading prices:', error)
        setLoading(false)
      })
  }, [])
  
  // Get token price from prices array
  const getTokenPrice = (symbol: string): number | null => {
    // Default mappings for tokens that might have different names in the prices.json
    const symbolMap: {[key: string]: string} = {
      'SOL': 'SOL',
      'USDC': 'USDC',
      'USDe': 'USDe',
      'TRX': 'TRX',
      'APT': 'APT',
      'PENGU': 'PENGU',
      'WLD': 'WLD',
      'DRIFT': 'DRIFT',
      'JUP': 'JUP',
      // Add fallbacks to common currencies
      'ETH': 'ETH',
      'BUSD': 'BUSD',
      'USD': 'USD',
      'LUNA': 'LUNA'
    }
    
    // Try to find the token price using the mapped symbol
    const mappedSymbol = symbolMap[symbol] || symbol
    const tokenData = prices.find(p => p.currency === mappedSymbol)
    
    // If price is found, return it
    if (tokenData) return tokenData.price
    
    // Fallback to 1.0 for testing if price not found
    console.warn(`Price not found for token: ${symbol}, using fallback price of 1.0`)
    return 1.0
  }
  
  // Calculate exchange rate and update amounts
  const handleSellAmountChange = (value: string) => {
    setSellAmount(value)
    if (value && !isNaN(parseFloat(value))) {
      const sellPrice = getTokenPrice(sellToken.symbol)
      const buyPrice = getTokenPrice(buyToken.symbol)
      
      if (sellPrice && buyPrice) {
        const sellValueInUSDT = parseFloat(value) * sellPrice
        const buyValue = sellValueInUSDT / buyPrice
        setBuyAmount(buyValue.toFixed(6))
      }
    } else {
      setBuyAmount('')
    }
  }
  
  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value)
    if (value && !isNaN(parseFloat(value))) {
      const sellPrice = getTokenPrice(sellToken.symbol)
      const buyPrice = getTokenPrice(buyToken.symbol)
      
      if (sellPrice && buyPrice) {
        const buyValueInUSDT = parseFloat(value) * buyPrice
        const sellValue = buyValueInUSDT / sellPrice
        setSellAmount(sellValue.toFixed(6))
      }
    } else {
      setSellAmount('')
    }
  }
  
  // Check if swap button should be enabled
  const isSwapDisabled = (): boolean => {
    return loading || 
           !sellAmount || 
           !buyAmount || 
           isNaN(parseFloat(sellAmount)) || 
           isNaN(parseFloat(buyAmount)) ||
           parseFloat(sellAmount) <= 0 ||
           parseFloat(buyAmount) <= 0
  }
  
  // Calculate and format exchange rate
  const getExchangeRate = (): string => {
    const sellPrice = getTokenPrice(sellToken.symbol)
    const buyPrice = getTokenPrice(buyToken.symbol)
    
    if (sellPrice && buyPrice) {
      const rate = sellPrice / buyPrice
      return `1 ${sellToken.symbol} = ${rate.toFixed(6)} ${buyToken.symbol}`
    }
    return 'Loading rate...'
  }
  
  // Handle token selection and update rates
  const handleTokenSelect = (token: Token) => {
    if (activePanel === 'sell') {
      setSellToken(token)
      setShowSellTokenModal(false)
      
      // Update buy amount based on new token
      if (sellAmount) {
        const sellPrice = getTokenPrice(token.symbol)
        const buyPrice = getTokenPrice(buyToken.symbol)
        
        if (sellPrice && buyPrice) {
          const sellValueInUSDT = parseFloat(sellAmount) * sellPrice
          const buyValue = sellValueInUSDT / buyPrice
          setBuyAmount(buyValue.toFixed(6))
        }
      }
    } else {
      setBuyToken(token)
      setShowBuyTokenModal(false)
      
      // Update sell amount based on new token
      if (buyAmount) {
        const sellPrice = getTokenPrice(sellToken.symbol)
        const buyPrice = getTokenPrice(token.symbol)
        
        if (sellPrice && buyPrice) {
          const buyValueInUSDT = parseFloat(buyAmount) * buyPrice
          const sellValue = buyValueInUSDT / sellPrice
          setSellAmount(sellValue.toFixed(6))
        }
      }
    }
    setSearchQuery('')
  }
  
  // Using placeholder SVG components for token logos
  const renderTokenLogo = (symbol: string) => {
    switch(symbol) {
      case 'USDe':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <text x="20" y="25" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle">$</text>
          </svg>
        );
      case 'TRX':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <path d="M13 13L27 13L20 27L13 13Z" fill="#FF4747"/>
          </svg>
        );
      case 'APT':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <path d="M15 15H25M15 20H25M15 25H25" stroke="white" strokeWidth="2"/>
          </svg>
        );
      case 'PENGU':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <path d="M15 15C15 15 17 13 20 13C23 13 25 15 25 15V25C25 25 23 27 20 27C17 27 15 25 15 25V15Z" fill="#7BB9FF"/>
          </svg>
        );
      case 'WLD':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2"/>
          </svg>
        );
      case 'DRIFT':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <path d="M15 15H25L15 25H25" stroke="#9D71FF" strokeWidth="2"/>
          </svg>
        );
      case 'JUP':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <circle cx="20" cy="20" r="10" fill="#4CDDFF" fillOpacity="0.5"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#2C3347"/>
            <text x="20" y="25" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle">{symbol.substring(0, 1)}</text>
          </svg>
        );
    }
  };

  const tokens: Token[] = [
    { symbol: 'USDe', name: 'USDe', address: 'DEkq...EonT' },
    { symbol: 'TRX', name: 'Tron', address: 'Gbbe...LKkc' },
    { symbol: 'APT', name: 'Aptos', address: 'DTDQ...nkpC' },
    { symbol: 'PENGU', name: 'Pudgy Penguins', address: '2zMM...uauv' },
    { symbol: 'WLD', name: 'Worldcoin (Wormhole)', address: 'DN4L...VDFK' },
    { symbol: 'DRIFT', name: 'Drift', address: 'DriF...jwg7' },
    { symbol: 'JUP', name: 'Jupiter', address: 'JUPy...DvCN' }
  ]
  
  // This is now replaced by the expanded handleTokenSelect above
  
  const filteredTokens = searchQuery
    ? tokens.filter(token => 
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tokens

  return (
    <div className="bg-[#1a1f2b] rounded-2xl w-full max-w-[420px] p-6 relative shadow-lg">
      <div className="absolute top-4 right-4 text-[#6c7284] cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>
      
      <div className="bg-[#131722] rounded-xl p-4 mb-2">
        <div className="text-lg font-semibold mb-3 text-white text-left">Sell</div>
        <div className="flex justify-between items-center">
          <input 
            type="text" 
            value={sellAmount} 
            onChange={(e) => handleSellAmountChange(e.target.value)}
            className="amount-input"
            placeholder="0"
          />
          <div 
            className="currency-selector" 
            onClick={() => {
              setActivePanel('sell')
              setShowSellTokenModal(true)
            }}
          >
            <div className="currency-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#14F195" fillOpacity="0.2"/>
                <path d="M7.5 12.75L10.5 15.75L16.5 9.75" stroke="#14F195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="font-semibold mr-2">{sellToken.symbol}</div>
            <div className="text-[#6c7284]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center bg-[#212634] rounded-full w-10 h-10 -my-5 relative z-10 text-[#6c7284] cursor-pointer shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>
      
      <div className="bg-[#131722] rounded-xl p-4 mb-2">
        <div className="text-lg font-semibold mb-3 text-white text-left">Buy</div>
        <div className="flex justify-between items-center">
          <input 
            type="text" 
            value={buyAmount} 
            onChange={(e) => handleBuyAmountChange(e.target.value)}
            className="amount-input"
            placeholder="0"
          />
          <div 
            className="currency-selector" 
            onClick={() => {
              setActivePanel('buy')
              setShowBuyTokenModal(true)
            }}
          >
            <div className="currency-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#14F195" fillOpacity="0.2"/>
                <path d="M7.5 12.75L10.5 15.75L16.5 9.75" stroke="#14F195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="font-semibold mr-2">{buyToken.symbol}</div>
            <div className="text-[#6c7284]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {showSellTokenModal && (
        <div className="token-modal-overlay">
          <div className="token-modal">
            <div className="flex justify-between items-center p-4 border-b border-[#2c3347]">
              <h2 className="text-xl font-medium m-0 text-white">Select a token</h2>
              <button className="bg-transparent border-none text-[#8f9bb3] cursor-pointer text-base" onClick={() => setShowSellTokenModal(false)}>
                ×
              </button>
            </div>
            
            <div className="p-4 flex gap-2.5">
              <div className="relative flex-1 flex items-center bg-[#212634] rounded-lg px-3">
                <svg className="text-[#8f9bb3] mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search by name, symbol or address" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white text-base py-3 w-full outline-none placeholder:text-[#8f9bb3]"
                />
              </div>
              <button className="bg-[#14f195] text-black border-none rounded-lg px-5 font-medium cursor-pointer text-base">search</button>
            </div>
            
            <div className="px-2.5 pb-4">
              {filteredTokens.map((token) => (
                <div 
                  key={token.symbol} 
                  className="flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-[#212634] mb-1" 
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center bg-[#2c3347]">
                    {renderTokenLogo(token.symbol)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">{token.symbol} {token.name !== token.symbol && token.name}</div>
                    <div className="text-sm text-[#8f9bb3]">{token.address}</div>
                  </div>
                  <div className="text-[#8f9bb3] text-sm">[explorer]</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {showBuyTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1a1f2e] rounded-2xl w-[90%] max-w-[450px] max-h-[80vh] overflow-y-auto shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-[#2c3347]">
              <h2 className="text-xl font-medium m-0 text-white">Select a token</h2>
              <button className="bg-transparent border-none text-[#8f9bb3] cursor-pointer text-base" onClick={() => setShowBuyTokenModal(false)}>
                ×
              </button>
            </div>
            
            <div className="p-4 flex gap-2.5">
              <div className="relative flex-1 flex items-center bg-[#212634] rounded-lg px-3">
                <svg className="text-[#8f9bb3] mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search by name, symbol or address" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white text-base py-3 w-full outline-none placeholder:text-[#8f9bb3]"
                />
              </div>
              <button className="bg-[#14f195] text-black border-none rounded-lg px-5 font-medium cursor-pointer text-base">search</button>
            </div>
            
            <div className="px-2.5 pb-4">
              {filteredTokens.map((token) => (
                <div 
                  key={token.symbol} 
                  className="flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-[#212634] mb-1" 
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center bg-[#2c3347]">
                    {renderTokenLogo(token.symbol)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">{token.symbol} {token.name !== token.symbol && token.name}</div>
                    <div className="text-sm text-[#8f9bb3]">{token.address}</div>
                  </div>
                  <div className="text-[#8f9bb3] text-sm">[explorer]</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!loading && (
        <div className="text-center text-sm text-[#8f9bb3] mb-4">
          {getExchangeRate()}
        </div>
      )}
      
      <button 
        className={`bg-[#14f195] text-black border-none rounded-xl text-base font-semibold py-4 w-full mt-6 cursor-pointer transition-colors duration-200 hover:bg-[#0dd584] ${isSwapDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`} 
        disabled={isSwapDisabled()}
      >
        Swap
      </button>
    </div>
  )
}

export default App
