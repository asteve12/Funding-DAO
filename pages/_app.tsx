import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { DataProvider } from "../contexts/dataContext"
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const getLibrary = (provider:any,connector:any) => {
  return new Web3Provider(provider)
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider
    getLibrary={getLibrary}
    >
     <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    {/* Same as */}
    <ToastContainer />
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
      </Web3ReactProvider>
  )
}

export default MyApp
