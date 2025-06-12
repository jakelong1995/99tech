import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { ArrowRight, Info } from 'lucide-react';
import type { Token, SwapDetails } from '../types';

interface SwapConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  swapDetails: SwapDetails;
  sellToken: Token | null;
  buyToken: Token | null;
  onConfirm: () => void;
  renderTokenLogo: (symbol: string) => React.ReactNode;
}

export function SwapConfirmationDialog({
  open,
  onOpenChange,
  swapDetails,
  sellToken,
  buyToken,
  onConfirm,
  renderTokenLogo,
}: SwapConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white">Confirm Swap</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Please review the details of your swap before confirming.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Swap Summary */}
          <div className="bg-zinc-800 rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center">
              {sellToken && renderTokenLogo(sellToken.symbol)}
              <span className="ml-2 text-white font-medium">{swapDetails.sellAmount}</span>
            </div>
            <ArrowRight className="text-zinc-500" />
            <div className="flex items-center">
              {buyToken && renderTokenLogo(buyToken.symbol)}
              <span className="ml-2 text-white font-medium">{swapDetails.buyAmount}</span>
            </div>
          </div>
          
          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-zinc-400">
                <span>Price</span>
                <Info className="h-4 w-4 ml-1" />
              </div>
              <span className="text-white">{swapDetails.price}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-zinc-400">
                <span>Minimum received</span>
                <Info className="h-4 w-4 ml-1" />
              </div>
              <span className="text-white">{swapDetails.minimumReceived}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-zinc-400">
                <span>Slippage Tolerance</span>
                <Info className="h-4 w-4 ml-1" />
              </div>
              <span className="text-green-500">{swapDetails.slippage}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-zinc-400">
                <span>Liquidity Provider Fee</span>
                <Info className="h-4 w-4 ml-1" />
              </div>
              <span className="text-white">{swapDetails.fee}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex w-full gap-3">
            <Button 
              onClick={() => onOpenChange(false)}
              className="cursor-pointer flex-1 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="cursor-pointer flex-1 bg-[#14f195] text-black border-none hover:bg-[#0dd584]"
            >
              Confirm Swap
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
