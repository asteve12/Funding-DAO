import FundingDAO from "../abis/FundingDAO.json";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../connectors"
import { ethers } from "ethers";

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

export const DataProvider = ({ children }:{children:ReactNode}): ReactNode => {
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
    const [allVotes, setAllVotes] = useState<string[]>()
    const [allInvestedProposal, setAllInvestedProposal] = useState<Proposal[]>([]);
    const { activate, account, deactivate,error, library } = useWeb3React()
    const { injected } = connectors;
    let contractInstance = new ethers.Contract(`${process.env.Fund_CONT_ADDR_NEXT_PUBLIC}`, FundingDAO.abi, library);
    useEffect(() => {
    connect()
    })


//help connect to wallet
const connect = async () => {
        //@ts-ignore
        if (window.ethereum) {
            await activate(injected)
        }
        else {
            alert("no wallet available try installing metamask")
            return;
        }

        await loadBlockchainData()
    }


    const loadBlockchainData = async () => {
        
        setFundingDao(contractInstance);

        setTimeout(async () => {
            let totalProposals = await contractInstance.getAllProposals()
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
                var memberBal = await contractInstance.getStakeholderBal()
                setCurrentBal(ethers.utils.parseUnits(memberBal,"ethers").toString())
            }
            else if (isMember && isStakeholder) {
                let stakeholderBal = await contractInstance.getStakeholderBal()
                setCurrentBal(ethers.utils.parseUnits(stakeholderBal, "ethers").toString())
                let votes = await contractInstance.getVotes()
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
        if (amount === "" || amount === "0") {
            toast.error("Please enter valid amount",{})
            
        }
         
        await contractInstance.createStakeholder({ value: ethers.utils.formatUnits(amount, "wei") })
        loadBlockchainData()
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
        let data = await contractInstance.getProposal(id)
        let proposal: Proposal = data;
        return proposal;
    }

    const vote = async (id: string, vote: boolean) => {
        await contractInstance.vote(id, vote)
        loadBlockchainData();
    }

    const provideFunds = async (id: string, amount: string) => {
        await contractInstance.provideFunds(id, ethers.utils.parseUnits(amount, "wei"), { value: ethers.utils.parseUnits(amount, "wei") })
        loadBlockchainData();
    }

    const releaseFunding = async (id: string) => {
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