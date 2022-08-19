import FundingDAO from "../abis/FundingDAO.json";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { connectors } from "../connectors"
import {ethers} from "ethers"


// import 
import  {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect
} from "react";

import { Proposal } from "../utils/interface"
import { toast } from "react-toastify";




interface DataCOntextProps{
    account: string;
    loading: boolean;
    connect: () => Promise<void>;
    fundingDao: any;
    allProposals: Proposal[];
    isStakeholder: boolean;
    isMember: boolean;
    currentBal: string;
    allVotes: string[];
    allInvestedProposal: Proposal[];
    createStakeholder: (amount: string) => Promise<void>;
    provideFunds: (id: string, amount: string) => Promise<void>;
    getProposal: (id: string) => Promise<Proposal>;
    vote: (id: string, vote: boolean) => Promise<void>;
    releaseFunding: (id: string) => Promise<void>;
    createProposal: ({
        title,
        description,
        amount,
        recipient,
        imageId,
    }:{
    title: string;
    description: string;
    amount: string;
    recipient: string;
    imageId: string;
})=> Promise<void>;
}


const DataContext = createContext<DataCOntextProps>({
    account: "",
    loading: true,
    connect: async () => {},
    fundingDao: null,
    allProposals: [],
    isStakeholder: false,
    isMember: false,
    currentBal: "",
    allVotes: [],
    allInvestedProposal: [],
    createStakeholder: async (val) => {},
    provideFunds: async (id, amount) => {},
    createProposal: async () => {},
    vote: async () => {},
    releaseFunding: async () => {},
    getProposal: async (val) => {
      return {} as Proposal;
    },
    
})

export const DataProvider = ({ children }:{children:ReactNode}) => {
    const data = useProviderData();
    
    return (
        <DataContext.Provider
            //@ts-ignore
            value={data}>{children}</DataContext.Provider>
    )
   
}

export const useData = () => useContext<DataCOntextProps>(DataContext);

export const useProviderData = () => {
    const [loading, setLoading] = useState(true)
    const [accounts, setAccount] = useState("")
    const [fundingDao, setFundingDao] = useState<any>();
    const [allProposals, setAllProposals] = useState<Proposal[]>([]);
    const [isStakeholder, setIsStakeholder] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [currentBal, setCurrentBal] = useState("")
    const [allVotes, setAllVotes] = useState<string[]>([])
    const [allInvestedProposal, setAllInvestedProposal] = useState<Proposal[]>([]);
    const {chainId,connector, activate, account, deactivate,error, library,active } = useWeb3React()
    const { injected } = connectors;


    useEffect(() => {
        if (error instanceof UnsupportedChainIdError) {
            console.log("error", error)
            console.log("chainId", chainId)
            //@ts-ignore
            if(Boolean(connector.supportedChainIds) && !connector.supportedChainIds.includes(chainId)) {
                //@ts-ignore
                throw new UnsupportedChainIdError(chainId, connector.supportedChainIds);
              }
            
          
      }
      
    }) 
   

    useEffect(() => {
       
        connect()
       
    }, [])

    useEffect(() => {
        active && loadBlockchainData()
    },[active])


   
    // useEffect(() => {
    //     console.log("error",error)
    // },[error])

  


//help connect to wallet
const connect = async () => {
       
    try {
        await activate(injected)
     }
    catch (e) {
        console.log("error12", e)
        console.log("my-error",error)
  
        
    }
       
       
    }


    const loadBlockchainData = async () => {
        console.log("load block",`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi,library.getSigner())
        let contractInstance = new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi,library.getSigner());
        
        setFundingDao(contractInstance);

        setTimeout(async () => {

            console.log("totalPRO",await contractInstance.getAllProposals())
            let totalProposals = await contractInstance.getAllProposals()
            console.log("hrllo", totalProposals)
            let tempProposals: Proposal[] = [];

            totalProposals.forEach((item: Proposal) => {
                tempProposals.push(item);
                
            })

            setAllProposals(tempProposals)

            let isStakeholder = await contractInstance.isStakeholder()
           
            setIsStakeholder(isStakeholder)
            let isMember = await contractInstance.isMember()
            setIsMember(isMember)
            if (isMember && !isStakeholder) {
                let memberBal = await contractInstance.getMemberBal()
                console.log("memberBal",memberBal)
                setCurrentBal(ethers.utils.formatUnits(memberBal,"ether").toString())
            }
            else if (isMember && isStakeholder) {
                let stakeholderBal = await contractInstance.getStakeholderBal()
                setCurrentBal(ethers.utils.parseUnits(stakeholderBal, "ethers").toString())
                let votes = await contractInstance.getVotes()
                console.log("vote",votes)
                var res = tempProposals.filter((proposal) => {
                    const vote = votes.find((vote: string) => vote === proposal.id)
                    if (vote) {
                        return true;
                    }
                    return false
                    
                });
                
                setAllInvestedProposal(res)
                setAllVotes(votes);
                
            }
            else {
                setCurrentBal("")
            }
            setLoading(false)


        },500)
        
    }

    const createStakeholder = async (amount: string) => {
         let contractInstance = new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi, library.getSigner());
        if (amount === "" || amount === "0") {
            toast.error("Please enter valid amount",{})
            
        }
       
        let tx=  await contractInstance.createStakeholder({value:parseInt(ethers.utils.formatUnits(amount,"wei"))})
        // await loadBlockchainData()
    }

    const createProposal = async ({
        title,
        description,
        amount,
        recipient,
        imageId,
    }:{
        title: string;
        description: string;
        amount: string;
        recipient: string;
        imageId:string
        }) => {
            
            let contractInstance = new ethers.Contract(`${process.env.Fund_CONT_ADDR_NEXT_PUBLIC}`, FundingDAO.abi, library.getSigner());
        if (amount === "" || amount === "0") {
            toast.error("Please enter valid amount",{})
        }
        await contractInstance.createProposal(
            title,
            description,
            recipient,
            ethers.utils.formatUnits(amount, "wei"),
            imageId,
            {
                value:ethers.utils.formatUnits("5","wei")
            }
        )
        loadBlockchainData();
        
    }

    const getProposal = async (id: string) => {
        let contractInstance = new ethers.Contract(`${process.env.Fund_CONT_ADDR_NEXT_PUBLIC}`, FundingDAO.abi, library);
        let data = await contractInstance.getProposal(id)
        let proposal: Proposal = data;
        return proposal;
    }

    const vote = async (id: string, vote: boolean) => {
        let contractInstance = new ethers.Contract(`${process.env.Fund_CONT_ADDR_NEXT_PUBLIC}`, FundingDAO.abi, library);
        await contractInstance.vote(id, vote)
        loadBlockchainData();
    }

    const provideFunds = async (id: string, amount: string) => {
        let contractInstance = new ethers.Contract(`${process.env.Fund_CONT_ADDR_NEXT_PUBLIC}`, FundingDAO.abi, library);
        await contractInstance.provideFunds(id, ethers.utils.parseUnits(amount, "wei"), { value: ethers.utils.parseUnits(amount, "wei") })
        loadBlockchainData();
    }

    const releaseFunding = async (id: string) => {
        let contractInstance = new ethers.Contract(`${process.env.Fund_CONT_ADDR_NEXT_PUBLIC}`, FundingDAO.abi, library);
        await contractInstance.releaseFunding(id)
        loadBlockchainData();
    }


    return {
        account,
        fundingDao,
        loading,
        allProposals,
        isStakeholder,
        isMember,
        currentBal,
        allVotes,
        allInvestedProposal,
        connect,
        createStakeholder,
        createProposal,
        getProposal,
        provideFunds,
        releaseFunding,
        vote
    }
    
}