
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan"

require('dotenv').config()

const config = {
  
  networks: {
    hardhat: {
      chainId: 1337,
      
    },
    mumbai: {
      url: `${process.env.NEXT_PUBLIC_RPC_ENDPOINT}`,
      accounts:[process.env.NEXT_PUBLIC_PRIVATE_KEY]
    }
  },
  solidity: "0.8.9",
  etherscan: {
    apiKey:""
  },
 
};

export default config;
