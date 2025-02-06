'use client';

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectButton() {
  return (
    <div className="relative z-[100]">
      <RainbowConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          
          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!mounted || !account || !chain) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="rounded-lg bg-pink-400 px-4 py-2 text-white hover:bg-pink-500 transition-colors"
                    >
                      Connect Wallet
                    </button>
                  );
                }
                return (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="rounded-lg bg-pink-400/10 px-4 py-2 text-pink-500 hover:bg-pink-400/20 transition-colors"
                    >
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="rounded-lg bg-pink-400 px-4 py-2 text-white hover:bg-pink-500 transition-colors"
                    >
                      {account.displayName}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </RainbowConnectButton.Custom>
    </div>
  );
}