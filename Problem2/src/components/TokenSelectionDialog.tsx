import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import type { Token } from '../types';

interface TokenSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTokens: Token[];
  handleTokenSelect: (token: Token) => void;
  renderTokenLogo: (symbol: string) => React.ReactNode;
}

export function TokenSelectionDialog({
  open,
  onOpenChange,
  searchQuery,
  setSearchQuery,
  filteredTokens,
  handleTokenSelect,
  renderTokenLogo,
}: TokenSelectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-white">Select a token</DialogTitle>
          <div className="pt-4">
            <Input
              type="text"
              placeholder="Search by name, symbol or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </DialogHeader>
        <div className="py-1">
          {filteredTokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-zinc-800"
              onClick={() => {
                handleTokenSelect(token)
              }}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center">
                {renderTokenLogo(token.symbol)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-white mb-1">{token.symbol} <span className="text-sm text-zinc-400 ml-1">{token.name}</span></div>
                <div className="text-sm text-zinc-400">{token.address}</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
