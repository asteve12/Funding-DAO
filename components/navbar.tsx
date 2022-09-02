import Link from "next/link"
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useData } from "../contexts/dataContext"






const Navbar = () => {
    const router = useRouter()
    const { account, connect, isMember, isStakeholder } = useData()
    
    
    return <>
        <nav className="w-full flex mt-4 max-w-5xl h-auto flex-col sm:flex-row sm:block ">
            <div className="flex flex-col sm:flex-row  sm:justify-between items-center h-full">
                <div className="mb-5">
                    <Link href="/" passHref>
                    <span className="font-semibold text-xl cursor-pointer mb-2">
                        FundingDAO
                    </span>
                    </Link>
                    <span className="text-xs bg-blue-500 text-white rounded-lg py-1 px-1 font-bold ml-2">
                        {
                            !isMember &&
                                !isStakeholder ?
                                "Not a Member" :
                                isStakeholder ?
                                "Stakeholder" : "Member"
                       } 
                    </span>
                   
                </div> 

                <div >

                {
                    account ? (
                        <div className="bg-green-500 px-6 py-2 rounded-md cursor-pointer">
                            <span className="text-lg text-white">
                                {account.substring(0,10)}
                            </span>
                        </div>
                    ) : (
                            <div
                                className="bg-green-500 px-6 py-2 rounded-md cursor-pointer"
                                onClick={() => {
                                    connect("")
                                }}
                            >
                                <span className="text-lg text-white">connect</span>
                            </div>
                    )
                    }
                    </div>
            </div>
        </nav>

        <nav className="w-full h-16 m-auto max-w-5xl flex justify-center mb-20 sm:mb-0">
            <div className="flex flex-col justify-between items-center h-full">
                {
                    account && (
                        <div className="flex flex-col mt-5 mb-5 items-center  h-full  sm:flex-row " >
                            <TabButton
                                title="Home"
                                isActive={router.asPath === "/"}
                                url={"/"}
                            />

                            
                            {
                                isMember && (
                                    <TabButton
                                        title="Create Proposal"
                                        isActive={router.asPath === "/create-proposal"}
                                        url={"/create-proposal"}
                                    />

                                   
                                )
                            }
                            {
                                isMember && (
                                    <TabButton
                                        title="Stakeholder Lounge"
                                        isActive={router.asPath === "/stakeholder-lounge"}
                                        url={"/stakeholder-lounge"}
                                    />

                                   
                                )
                            }
                            {
                                isStakeholder && (
                                    <TabButton
                                        title="Investment"
                                        isActive={router.asPath === "/investments"}
                                        url={"/investments"}
                                    />

                                   
                                )
                            }
                        </div>
                   )
                }
            </div>

        </nav>
    </>
}

export default Navbar

const TabButton = ({
    title,
    isActive,
    url,
}: {
        title: string;
        isActive: boolean;
        url:string
    }) => {
    
    return (
        <Link href={url} passHref>
            <div
                className={`h-full px-3 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer 
                ${ isActive ? "border-blue-700 text-blue-700 text-base font-semibold" : "border-white text-gray-400 text-base"}`}
                
            >
                <span>{title}</span>
            </div>
        </Link>
    )
}
