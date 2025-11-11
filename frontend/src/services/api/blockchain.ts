/**
 * Blockchain API Services
 * Cryptocurrency, NFT, and smart contract integration
 */
import { api } from './client';

export interface CryptocurrencyWallet {
  id: string;
  userId: string;
  type: 'hot' | 'cold' | 'multisig' | 'hardware';
  blockchain: 'bitcoin' | 'ethereum' | 'polygon' | 'bsc' | 'solana' | 'cardano' | 'avalanche';
  address: string;
  publicKey?: string;
  balance: {
    native: {
      amount: string; // Using string to avoid precision issues
      symbol: string;
      decimals: number;
    };
    tokens: Array<{
      contractAddress: string;
      symbol: string;
      name: string;
      balance: string;
      decimals: number;
      logoUrl?: string;
      verified: boolean;
    }>;
  };
  status: 'active' | 'inactive' | 'frozen' | 'compromised';
  security: {
    multiSigRequired: boolean;
    multiSigThreshold?: number;
    multiSigParticipants?: string[];
    kycVerified: boolean;
    whitelistedAddresses: string[];
    dailyLimit?: {
      amount: string;
      remaining: string;
      resetAt: string;
    };
  };
  metadata: {
    createdAt: string;
    lastTransactionAt?: string;
    transactionCount: number;
    tags: string[];
    description?: string;
  };
}

export interface BlockchainTransaction {
  id: string;
  hash: string;
  blockchain: string;
  type: 'send' | 'receive' | 'smart_contract' | 'nft_transfer' | 'swap' | 'stake' | 'unstake';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'replaced';
  fromAddress: string;
  toAddress: string;
  amount: {
    value: string;
    symbol: string;
    usdValue?: string;
  };
  fee: {
    value: string;
    symbol: string;
    usdValue?: string;
    gasUsed?: number;
    gasPrice?: string;
  };
  blockNumber?: number;
  blockHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  timestamp: string;
  nonce?: number;
  data?: string; // Contract data or memo
  tags: string[];
  relatedOrderId?: string;
  metadata: Record<string, any>;
}

export interface SmartContract {
  id: string;
  address: string;
  blockchain: string;
  name: string;
  type: 'payment' | 'escrow' | 'nft' | 'token' | 'defi' | 'governance' | 'marketplace';
  abi: any[]; // Application Binary Interface
  version: string;
  deployedAt: string;
  deployedBy: string;
  verified: boolean;
  source?: {
    code: string;
    compiler: string;
    optimization: boolean;
  };
  features: {
    pausable: boolean;
    upgradeable: boolean;
    accessControl: boolean;
    reentrancyGuard: boolean;
  };
  functions: Array<{
    name: string;
    signature: string;
    inputs: Array<{
      name: string;
      type: string;
      description?: string;
    }>;
    outputs: Array<{
      name: string;
      type: string;
    }>;
    stateMutability: 'view' | 'pure' | 'nonpayable' | 'payable';
    description?: string;
  }>;
  events: Array<{
    name: string;
    signature: string;
    inputs: Array<{
      name: string;
      type: string;
      indexed: boolean;
    }>;
  }>;
  stats: {
    totalTransactions: number;
    totalValue: string;
    uniqueUsers: number;
    lastActivity: string;
  };
}

export interface NFTCollection {
  id: string;
  contractAddress: string;
  blockchain: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  bannerUrl?: string;
  websiteUrl?: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  creator: {
    address: string;
    name?: string;
    verified: boolean;
  };
  stats: {
    totalSupply: number;
    ownersCount: number;
    floorPrice: {
      amount: string;
      symbol: string;
    };
    volumeTraded: {
      amount: string;
      symbol: string;
    };
    listings: number;
    sales24h: number;
  };
  royalties: {
    percentage: number;
    recipient: string;
  };
  metadata: {
    createdAt: string;
    verified: boolean;
    featured: boolean;
    category: string;
    tags: string[];
  };
}

export interface NFTToken {
  id: string;
  tokenId: string;
  collectionId: string;
  contractAddress: string;
  blockchain: string;
  name: string;
  description: string;
  imageUrl: string;
  animationUrl?: string;
  externalUrl?: string;
  attributes: Array<{
    traitType: string;
    value: any;
    displayType?: 'boost_number' | 'boost_percentage' | 'number' | 'date';
    maxValue?: number;
  }>;
  owner: {
    address: string;
    name?: string;
  };
  creator: {
    address: string;
    name?: string;
  };
  rarity: {
    rank: number;
    score: number;
    traits: Array<{
      type: string;
      value: any;
      rarity: number;
    }>;
  };
  pricing: {
    lastSale?: {
      price: string;
      symbol: string;
      buyer: string;
      seller: string;
      timestamp: string;
    };
    currentListing?: {
      price: string;
      symbol: string;
      marketplace: string;
      expiresAt: string;
    };
    estimatedValue: {
      min: string;
      max: string;
      symbol: string;
    };
  };
  history: Array<{
    type: 'mint' | 'sale' | 'transfer' | 'listing' | 'delisting';
    from?: string;
    to?: string;
    price?: string;
    symbol?: string;
    marketplace?: string;
    timestamp: string;
    transactionHash: string;
  }>;
  metadata: {
    mintedAt: string;
    tokenStandard: 'ERC-721' | 'ERC-1155' | 'SPL';
    frozen: boolean;
    burned: boolean;
  };
}

export interface DeFiPosition {
  id: string;
  userId: string;
  protocol: string;
  blockchain: string;
  type: 'lending' | 'borrowing' | 'liquidity_pool' | 'staking' | 'farming' | 'insurance';
  tokens: Array<{
    address: string;
    symbol: string;
    amount: string;
    usdValue: string;
  }>;
  rewards: Array<{
    token: string;
    amount: string;
    usdValue: string;
    apy: number;
  }>;
  health: {
    factor: number; // Liquidation health factor
    risk: 'low' | 'medium' | 'high' | 'critical';
    warnings: string[];
  };
  performance: {
    totalValue: string;
    pnl: {
      absolute: string;
      percentage: number;
    };
    apy: number;
    duration: number; // in days
  };
  status: 'active' | 'inactive' | 'liquidated' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface CryptoPayment {
  id: string;
  orderId: string;
  userId: string;
  amount: {
    fiat: {
      value: number;
      currency: string;
    };
    crypto: {
      value: string;
      symbol: string;
      contractAddress?: string;
    };
    exchangeRate: number;
  };
  wallet: {
    fromAddress: string;
    toAddress: string;
    blockchain: string;
  };
  transaction: {
    hash?: string;
    status: 'pending' | 'confirming' | 'confirmed' | 'failed' | 'expired';
    confirmations: number;
    fee: string;
  };
  timeline: {
    createdAt: string;
    expiresAt: string;
    paidAt?: string;
    confirmedAt?: string;
    failedAt?: string;
  };
  refund?: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    amount: string;
    txHash?: string;
    reason: string;
  };
}

export const blockchainAPI = {
  /**
   * Create or import cryptocurrency wallet
   */
  createWallet: async (walletData: {
    type: CryptocurrencyWallet['type'];
    blockchain: CryptocurrencyWallet['blockchain'];
    address?: string; // For importing existing wallet
    publicKey?: string;
    multiSigConfig?: {
      threshold: number;
      participants: string[];
    };
  }): Promise<CryptocurrencyWallet> => {
    const { data } = await api.post('/blockchain/wallets', walletData);
    return data;
  },

  /**
   * Get user wallets
   */
  getWallets: async (
    userId: string,
    blockchain?: string
  ): Promise<CryptocurrencyWallet[]> => {
    const { data } = await api.get(`/blockchain/wallets/${userId}`, {
      params: { blockchain },
    });
    return data;
  },

  /**
   * Get wallet details and balance
   */
  getWallet: async (
    walletId: string,
    includeTransactions: boolean = false
  ): Promise<CryptocurrencyWallet & {
    transactions?: BlockchainTransaction[];
  }> => {
    const { data } = await api.get(`/blockchain/wallets/${walletId}`, {
      params: { includeTransactions },
    });
    return data;
  },

  /**
   * Update wallet settings
   */
  updateWallet: async (
    walletId: string,
    updates: Partial<Pick<CryptocurrencyWallet, 'security' | 'metadata'>>
  ): Promise<CryptocurrencyWallet> => {
    const { data } = await api.put(`/blockchain/wallets/${walletId}`, updates);
    return data;
  },

  /**
   * Get wallet balance
   */
  getBalance: async (
    address: string,
    blockchain: string,
    includeTokens: boolean = true
  ): Promise<CryptocurrencyWallet['balance']> => {
    const { data } = await api.get('/blockchain/balance', {
      params: { address, blockchain, includeTokens },
    });
    return data;
  },

  /**
   * Send cryptocurrency transaction
   */
  sendTransaction: async (transactionData: {
    fromWalletId: string;
    toAddress: string;
    amount: string;
    symbol: string;
    contractAddress?: string;
    gasPrice?: string;
    gasLimit?: number;
    data?: string;
    memo?: string;
  }): Promise<BlockchainTransaction> => {
    const { data } = await api.post('/blockchain/transactions/send', transactionData);
    return data;
  },

  /**
   * Get transaction details
   */
  getTransaction: async (
    transactionId: string
  ): Promise<BlockchainTransaction> => {
    const { data } = await api.get(`/blockchain/transactions/${transactionId}`);
    return data;
  },

  /**
   * Get transaction history
   */
  getTransactionHistory: async (
    walletId: string,
    options?: {
      limit?: number;
      offset?: number;
      type?: BlockchainTransaction['type'];
      status?: BlockchainTransaction['status'];
      from?: string;
      to?: string;
    }
  ): Promise<{
    transactions: BlockchainTransaction[];
    total: number;
    hasMore: boolean;
  }> => {
    const { data } = await api.get(`/blockchain/wallets/${walletId}/transactions`, {
      params: options,
    });
    return data;
  },

  /**
   * Estimate transaction fee
   */
  estimateFee: async (
    blockchain: string,
    transactionType: 'send' | 'smart_contract',
    data?: {
      amount?: string;
      contractAddress?: string;
      gasLimit?: number;
    }
  ): Promise<{
    slow: string;
    standard: string;
    fast: string;
    estimatedTime: {
      slow: number;
      standard: number;
      fast: number;
    };
  }> => {
    const { data: result } = await api.post('/blockchain/fees/estimate', {
      blockchain,
      transactionType,
      ...data,
    });
    return result;
  },

  /**
   * Deploy smart contract
   */
  deployContract: async (contractData: {
    blockchain: string;
    code: string;
    abi: any[];
    constructorArgs?: any[];
    name: string;
    type: SmartContract['type'];
    gasLimit?: number;
    gasPrice?: string;
  }): Promise<SmartContract> => {
    const { data } = await api.post('/blockchain/contracts/deploy', contractData);
    return data;
  },

  /**
   * Get smart contract details
   */
  getContract: async (
    contractAddress: string,
    blockchain: string
  ): Promise<SmartContract> => {
    const { data } = await api.get('/blockchain/contracts', {
      params: { address: contractAddress, blockchain },
    });
    return data;
  },

  /**
   * Call smart contract function
   */
  callContractFunction: async (
    contractAddress: string,
    blockchain: string,
    functionName: string,
    args: any[],
    options?: {
      value?: string; // ETH value to send
      gasLimit?: number;
      gasPrice?: string;
      fromWalletId?: string;
    }
  ): Promise<{
    result?: any;
    transactionHash?: string;
    gasUsed?: number;
    error?: string;
  }> => {
    const { data } = await api.post('/blockchain/contracts/call', {
      contractAddress,
      blockchain,
      functionName,
      args,
      ...options,
    });
    return data;
  },

  /**
   * Get contract events/logs
   */
  getContractEvents: async (
    contractAddress: string,
    blockchain: string,
    options?: {
      eventName?: string;
      fromBlock?: number;
      toBlock?: number;
      topics?: string[];
      limit?: number;
    }
  ): Promise<Array<{
    event: string;
    args: Record<string, any>;
    blockNumber: number;
    transactionHash: string;
    timestamp: string;
  }>> => {
    const { data } = await api.get(`/blockchain/contracts/${contractAddress}/events`, {
      params: { blockchain, ...options },
    });
    return data;
  },

  /**
   * Create NFT collection
   */
  createNFTCollection: async (
    collectionData: Omit<NFTCollection, 'id' | 'stats' | 'metadata'> & {
      walletId: string;
      maxSupply?: number;
      mintPrice?: string;
      royaltyPercentage?: number;
    }
  ): Promise<NFTCollection> => {
    const { data } = await api.post('/blockchain/nft/collections', collectionData);
    return data;
  },

  /**
   * Get NFT collections
   */
  getNFTCollections: async (
    options?: {
      blockchain?: string;
      creator?: string;
      featured?: boolean;
      category?: string;
      limit?: number;
      sortBy?: 'volume' | 'floor_price' | 'created_at';
    }
  ): Promise<NFTCollection[]> => {
    const { data } = await api.get('/blockchain/nft/collections', {
      params: options,
    });
    return data;
  },

  /**
   * Get NFT collection details
   */
  getNFTCollection: async (collectionId: string): Promise<NFTCollection> => {
    const { data } = await api.get(`/blockchain/nft/collections/${collectionId}`);
    return data;
  },

  /**
   * Mint NFT
   */
  mintNFT: async (mintData: {
    collectionId: string;
    walletId: string;
    recipient: string;
    tokenId?: string;
    name: string;
    description: string;
    imageUrl: string;
    attributes: NFTToken['attributes'];
    royaltyRecipient?: string;
    royaltyPercentage?: number;
  }): Promise<NFTToken> => {
    const { data } = await api.post('/blockchain/nft/mint', mintData);
    return data;
  },

  /**
   * Get NFT tokens
   */
  getNFTTokens: async (
    collectionId?: string,
    owner?: string,
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: 'token_id' | 'rarity' | 'price';
      traits?: Record<string, any>;
    }
  ): Promise<{
    tokens: NFTToken[];
    total: number;
    hasMore: boolean;
  }> => {
    const { data } = await api.get('/blockchain/nft/tokens', {
      params: { collectionId, owner, ...options },
    });
    return data;
  },

  /**
   * Get NFT token details
   */
  getNFTToken: async (
    contractAddress: string,
    tokenId: string,
    blockchain: string
  ): Promise<NFTToken> => {
    const { data } = await api.get('/blockchain/nft/token', {
      params: { contractAddress, tokenId, blockchain },
    });
    return data;
  },

  /**
   * Transfer NFT
   */
  transferNFT: async (transferData: {
    fromWalletId: string;
    toAddress: string;
    contractAddress: string;
    tokenId: string;
    blockchain: string;
  }): Promise<BlockchainTransaction> => {
    const { data } = await api.post('/blockchain/nft/transfer', transferData);
    return data;
  },

  /**
   * Create crypto payment
   */
  createCryptoPayment: async (paymentData: {
    orderId: string;
    amount: number;
    currency: string;
    acceptedCryptos: Array<{
      symbol: string;
      contractAddress?: string;
      blockchain: string;
    }>;
    expiryMinutes?: number;
  }): Promise<CryptoPayment> => {
    const { data } = await api.post('/blockchain/payments', paymentData);
    return data;
  },

  /**
   * Get crypto payment details
   */
  getCryptoPayment: async (paymentId: string): Promise<CryptoPayment> => {
    const { data } = await api.get(`/blockchain/payments/${paymentId}`);
    return data;
  },

  /**
   * Confirm crypto payment
   */
  confirmPayment: async (
    paymentId: string,
    transactionHash: string
  ): Promise<CryptoPayment> => {
    const { data } = await api.put(`/blockchain/payments/${paymentId}/confirm`, {
      transactionHash,
    });
    return data;
  },

  /**
   * Get DeFi positions
   */
  getDeFiPositions: async (
    userId: string,
    protocol?: string,
    type?: DeFiPosition['type']
  ): Promise<DeFiPosition[]> => {
    const { data } = await api.get(`/blockchain/defi/positions/${userId}`, {
      params: { protocol, type },
    });
    return data;
  },

  /**
   * Create DeFi position
   */
  createDeFiPosition: async (positionData: {
    protocol: string;
    blockchain: string;
    type: DeFiPosition['type'];
    walletId: string;
    tokens: Array<{
      address: string;
      amount: string;
    }>;
    settings: Record<string, any>;
  }): Promise<DeFiPosition> => {
    const { data } = await api.post('/blockchain/defi/positions', positionData);
    return data;
  },

  /**
   * Get supported cryptocurrencies
   */
  getSupportedCryptos: async (
    blockchain?: string
  ): Promise<Array<{
    symbol: string;
    name: string;
    contractAddress?: string;
    blockchain: string;
    decimals: number;
    logoUrl: string;
    verified: boolean;
    marketCap?: number;
    price?: number;
    priceChange24h?: number;
  }>> => {
    const { data } = await api.get('/blockchain/currencies', {
      params: { blockchain },
    });
    return data;
  },

  /**
   * Get cryptocurrency prices
   */
  getCryptoPrices: async (
    symbols: string[],
    vsCurrency: string = 'usd'
  ): Promise<Record<string, {
    price: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    marketCap: number;
    volume24h: number;
    lastUpdated: string;
  }>> => {
    const { data } = await api.get('/blockchain/prices', {
      params: { symbols: symbols.join(','), vsCurrency },
    });
    return data;
  },

  /**
   * Get blockchain network status
   */
  getNetworkStatus: async (
    blockchain: string
  ): Promise<{
    blockHeight: number;
    blockTime: number;
    gasPrice: {
      slow: string;
      standard: string;
      fast: string;
    };
    congestion: 'low' | 'medium' | 'high';
    status: 'operational' | 'degraded' | 'down';
    lastBlock: {
      hash: string;
      timestamp: string;
      transactionCount: number;
    };
  }> => {
    const { data } = await api.get(`/blockchain/networks/${blockchain}/status`);
    return data;
  },

  /**
   * Validate blockchain address
   */
  validateAddress: async (
    address: string,
    blockchain: string
  ): Promise<{
    valid: boolean;
    type?: 'wallet' | 'contract';
    warnings?: string[];
  }> => {
    const { data } = await api.get('/blockchain/validate-address', {
      params: { address, blockchain },
    });
    return data;
  },

  /**
   * Get gas tracker
   */
  getGasTracker: async (
    blockchain: string
  ): Promise<{
    current: {
      slow: string;
      standard: string;
      fast: string;
    };
    history: Array<{
      timestamp: string;
      gasPrice: string;
    }>;
    predictions: {
      next1h: string;
      next4h: string;
      next24h: string;
    };
  }> => {
    const { data } = await api.get(`/blockchain/gas-tracker/${blockchain}`);
    return data;
  },
};

export default blockchainAPI;