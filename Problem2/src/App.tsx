import { useState, useEffect } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Settings, ArrowDown, CheckCircle } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Navbar } from './components/Navbar'
import { TokenSelectionDialog } from './components/TokenSelectionDialog'
import { SwapConfirmationDialog } from './components/SwapConfirmationDialog'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from './components/ui/form'
import { TokenField } from './components/TokenField'
import type { Token, SwapDetails } from './types'

// Define the Zod schema for form validation
const swapFormSchema = z.object({
  sellAmount: z.string()
    .refine(val => val.trim() !== '', {
      message: 'Sell amount is required'
    })
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Must be a positive number'
    }),
  buyAmount: z.string()
    .refine(val => val.trim() !== '', {
      message: 'Buy amount is required'
    })
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Must be a positive number'
    })
});

type SwapFormValues = z.infer<typeof swapFormSchema>;

function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const [tokens, setTokens] = useState<Token[]>([])
  const [sellToken, setSellToken] = useState<Token | null>(null)
  const [buyToken, setBuyToken] = useState<Token | null>(null)
  const [walletBalance, setWalletBalance] = useState<number>(10000) // Mock wallet balance in USDT
  
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([])
  const [activePanel, setActivePanel] = useState<'sell' | 'buy'>('sell')
  
  const [swapDetails, setSwapDetails] = useState<SwapDetails>({ 
    sellAmount: '', 
    buyAmount: '', 
    price: '',
    minimumReceived: '',
    slippage: '<0.01%',
    fee: ''
  })
  
  // Filter tokens based on search query
  useEffect(() => {
    if (tokens.length > 0) {
      const filtered = tokens.filter(token => {
        const query = searchQuery.toLowerCase();
        return (
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
        );
      });
      setFilteredTokens(filtered);
    }
  }, [searchQuery, tokens])
  
  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<SwapFormValues>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: {
      sellAmount: '',
      buyAmount: ''
    },
    mode: 'onChange'
  })
  
  // Fetch prices from prices.json
  useEffect(() => {
    fetch('/prices.json')
      .then(response => response.json())
      .then(data => {
        setTokens(data)
        // Set default tokens after loading
        const usdt = data.find((t: Token) => t.symbol === 'USDT')
        const btc = data.find((t: Token) => t.symbol === 'BTC')
        if (usdt) setSellToken(usdt)
        if (btc) setBuyToken(btc)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading prices:', error)
        setLoading(false)
      })
  }, [])
  
  // Handle swapping tokens and values
  const handleSwapTokens = () => {
    if (!sellToken || !buyToken) return
    
    // Store current values
    const tempToken = sellToken
    const sellAmount = form.getValues('sellAmount')
    const buyAmount = form.getValues('buyAmount')
    
    // Swap tokens
    setSellToken(buyToken)
    setBuyToken(tempToken)
    
    // Swap values
    form.setValue('sellAmount', buyAmount, { shouldValidate: true })
    form.setValue('buyAmount', sellAmount, { shouldValidate: true })
  }
  
  // Calculate exchange rate and update amounts
  const handleSellAmountChange = (value: string) => {
    form.setValue('sellAmount', value, { shouldValidate: true })
    
    if (value && sellToken && buyToken) {
      const sellPrice = sellToken.price
      const buyPrice = buyToken.price
      
      if (sellPrice && buyPrice) {
        const sellValueInUSDT = parseFloat(value) * sellPrice
        const buyValue = sellValueInUSDT / buyPrice
        const formattedBuyValue = buyValue.toFixed(4)
        form.setValue('buyAmount', formattedBuyValue, { shouldValidate: true })
      }
    } else {
      form.setValue('buyAmount', '', { shouldValidate: true })
    }
  }
  
  const handleBuyAmountChange = (value: string) => {
    form.setValue('buyAmount', value, { shouldValidate: true })
    if (value && sellToken && buyToken) {
      const sellPrice = sellToken.price
      const buyPrice = buyToken.price
      
      if (sellPrice && buyPrice) {
        const buyValueInUSDT = parseFloat(value) * buyPrice
        const sellValue = buyValueInUSDT / sellPrice
        const formattedSellValue = sellValue.toFixed(4)
        form.setValue('sellAmount', formattedSellValue, { shouldValidate: true })
      }
    } else {
      form.setValue('sellAmount', '', { shouldValidate: true })
    }
  }
  
  // Check if swap button should be disabled
  const isSwapDisabled = () => {
    return loading || !form.formState.isValid || !sellToken || !buyToken
  }
  
  // Handle token selection and update rates
  const handleTokenSelect = (token: Token) => {
    setShowTokenModal(false)
    
    if (activePanel === 'sell') {
      setSellToken(token)
      const sellAmount = form.getValues('sellAmount')
      if (sellAmount && buyToken) {
        const sellPrice = token.price
        const buyPrice = buyToken.price
        if (sellPrice && buyPrice) {
          const sellValueInUSDT = parseFloat(sellAmount) * sellPrice
          const buyValue = sellValueInUSDT / buyPrice
          form.setValue('buyAmount', buyValue.toFixed(4), { shouldValidate: true })
        }
      }
    } else {
      setBuyToken(token)
      const buyAmount = form.getValues('buyAmount')
      if (buyAmount && sellToken) {
        const sellPrice = sellToken.price
        const buyPrice = token.price
        if (sellPrice && buyPrice) {
          const buyValueInUSDT = parseFloat(buyAmount) * buyPrice
          const sellValue = buyValueInUSDT / sellPrice
          form.setValue('sellAmount', sellValue.toFixed(4), { shouldValidate: true })
        }
      }
    }
    setSearchQuery('')
  }
  
  // Render token logo from the token data
  const renderTokenLogo = (symbol: string) => {
    const token = tokens.find(t => t.symbol === symbol)
    if (token && token.logo) {
      return <img src={token.logo} alt={symbol} />
    }
    return <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
  }
  
  // Note: filteredTokens is already defined and updated via useEffect

  // Calculate swap details for confirmation dialog
  const calculateSwapDetails = (data: SwapFormValues) => {
    if (!sellToken || !buyToken) return;
    
    const sellAmount = parseFloat(data.sellAmount) || 0;
    const buyAmount = parseFloat(data.buyAmount) || 0;
    
    // Calculate price (rate)
    let price = '';
    if (sellAmount > 0 && buyAmount > 0) {
      const rate = sellAmount / buyAmount;
      price = `${rate.toFixed(8)} ${sellToken.symbol} per ${buyToken.symbol}`;
    }
    
    // Calculate minimum received (with 0.5% slippage)
    const minimumReceived = (buyAmount * 0.995).toFixed(6);
    
    // Calculate fee (0.3% of sell amount)
    const fee = (sellAmount * 0.003).toFixed(6);
    
    return {
      sellAmount: `${sellAmount} ${sellToken.symbol}`,
      buyAmount: `${buyAmount} ${buyToken.symbol}`,
      price,
      minimumReceived: `${minimumReceived} ${buyToken.symbol}`,
      slippage: '<0.01%',
      fee: `${fee} ${sellToken.symbol}`
    };
  };
  
  // Handle form submission
  const onSubmit = (data: SwapFormValues) => {
    console.log('Swap submitted with values:', data);
    
    // Calculate and set swap details
    const details = calculateSwapDetails(data);
    if (details) {
      setSwapDetails(details);
      setShowConfirmationModal(true);
    }
  };
  
  // Handle swap confirmation
  const handleConfirmSwap = () => {
    // Close confirmation dialog
    setShowConfirmationModal(false);
    
    // Get current form values
    const data = form.getValues();
    const sellAmount = parseFloat(data.sellAmount) || 0;
    
    // Calculate fee (0.3% of sell amount)
    const fee = sellAmount * 0.003;
    
    // Simulate a swap transaction by updating wallet balance (only deduct the fee)
    if (sellToken && sellToken.symbol === 'USDT') {
      // If selling USDT, reduce balance by fee amount only
      setWalletBalance(prev => Math.max(0, prev - fee));
    } else {
      // For other tokens, deduct fee equivalent in USDT (simplified)
      setWalletBalance(prev => Math.max(0, prev - fee));
    }
    
    // Reset form after swap
    form.reset({ sellAmount: '', buyAmount: '' });
    
    // Show success toast notification
    toast.success('Swap completed successfully!', {
      description: `Swapped ${data.sellAmount} ${sellToken?.symbol} for ${data.buyAmount} ${buyToken?.symbol}`,
      icon: <CheckCircle className="h-4 w-4" />,
      position: 'top-center',
      duration: 5000
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-8 px-4 w-full">
      <Toaster richColors position="top-center" />
      <Navbar walletBalance={walletBalance} />
      
      {/* Main Swap Container */}
      <div className="bg-zinc-900 rounded-2xl w-full max-w-lg p-6 relative shadow-lg flex flex-col items-end top-20">
      <Button variant="ghost" size="icon" className="mb-2"><Settings /></Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          {sellToken && (
            <TokenField 
              type="sell"
              token={sellToken}
              form={form}
              onAmountChange={handleSellAmountChange}
              onTokenClick={() => {
                setActivePanel('sell')
                setShowTokenModal(true)
              }}
              renderTokenLogo={renderTokenLogo}
            />
          )}
          
          <Button 
            size="icon" 
            className="flex justify-center items-center rounded-full w-10 h-10 -my-5 relative z-10 cursor-pointer shadow-md left-1/2 -translate-x-1/2 text-[#14f195] hover:bg-[#0dd584] hover:text-black transition-colors"
            onClick={handleSwapTokens}
            type="button"
          >
            <ArrowDown />
          </Button>
          
          {buyToken && (
            <TokenField 
              type="buy"
              token={buyToken}
              form={form}
              onAmountChange={handleBuyAmountChange}
              onTokenClick={() => {
                setActivePanel('buy')
                setShowTokenModal(true)
              }}
              renderTokenLogo={renderTokenLogo}
            />
          )}
      
          <Button 
            type="submit"
            className={`bg-[#14f195] text-black border-none rounded-xl text-base font-semibold py-4 w-full mt-6 cursor-pointer transition-colors duration-200 hover:bg-[#0dd584] ${isSwapDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={isSwapDisabled()}
          >
            Swap
          </Button>
        </form>
      </Form>
      
      <TokenSelectionDialog 
        open={showTokenModal}
        onOpenChange={setShowTokenModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredTokens={filteredTokens}
        handleTokenSelect={handleTokenSelect}
        renderTokenLogo={renderTokenLogo}
      />
      
      <SwapConfirmationDialog 
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
        swapDetails={swapDetails}
        sellToken={sellToken}
        buyToken={buyToken}
        onConfirm={handleConfirmSwap}
        renderTokenLogo={renderTokenLogo}
      />
      </div>
    </div>
  )
}

export default App
