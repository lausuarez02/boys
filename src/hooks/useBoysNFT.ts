import { useAccount, useContractRead } from 'wagmi';
import { BoysABI } from '@/contracts/BoysABI';

const BOYS_CONTRACT_ADDRESS = '0x...';

export function useBoysNFT() {
  const { address } = useAccount();

  const { data: nfts, isLoading, error } = useContractRead({
    address: BOYS_CONTRACT_ADDRESS,
    abi: BoysABI,
    functionName: 'tokensOfOwner',
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(address)
    }
  });

  return { nfts, isLoading, error };
}