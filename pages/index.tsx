import Head from "next/head";
import { CreateMember } from "../components/createMember";
import Navbar from "../components/navbar";
import { ProposalList } from "../components/proposalList";
import { useData } from "../contexts/dataContext";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";


function getLibrary(provider:any, connector:any) {

  return new Web3Provider(provider)
}

const Home = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
       <div className=''>
      
      </div>
    </Web3ReactProvider>
   
  
  )
}

export default Home
