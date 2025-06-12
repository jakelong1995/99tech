
import { Button } from './ui/button';
import { Wallet, User, Menu } from 'lucide-react';

interface NavbarProps {
  walletBalance: number;
}

export function Navbar({ walletBalance }: NavbarProps) {
  return (
    <div className="w-full max-w-6xl flex justify-between items-center mb-8 px-4">
      <div className="flex items-center">
        <div className="text-[#14f195] font-bold text-2xl mr-8">SwapDEX</div>
        <div className="hidden md:flex space-x-6">
          <Button variant="ghost" className="text-white hover:text-[#14f195] hover:bg-transparent">Swap</Button>
          <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-transparent">Pool</Button>
          <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-transparent">Charts</Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Wallet Balance */}
        <div className="bg-zinc-800 rounded-full py-2 px-4 flex items-center">
          <Wallet className="h-4 w-4 text-[#14f195] mr-2" />
          <span className="text-white font-medium">{walletBalance.toLocaleString()} USDT</span>
        </div>
        
        {/* User Profile Button */}
        <Button variant="ghost" size="icon" className="rounded-full bg-zinc-800 text-white">
          <User className="h-5 w-5" />
        </Button>
        
        {/* Menu Button (Mobile) */}
        <Button variant="ghost" size="icon" className="md:hidden rounded-full bg-zinc-800 text-white">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
