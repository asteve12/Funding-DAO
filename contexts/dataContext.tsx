import { useWeb3React } from "@web3-react/core";

import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect
} from "react";
import { Proposal } from "../utils/interface"


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
        <DataContext.Provider value={data}>{children}</DataContext.Provider>
    )
   
}

export const useData = () => useContext<DataCOntextProps>(DataContext);

export const useProviderData = () => {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState("")
    const [fundingDao, setFundingDao] = useState<any>();
    const [allProposals, setAllProposals] = useState<Proposal[]>([]);
    const [isStakeholder, setIsStakeholder] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [currentBal, setCurrentBal] = useState("")
    const [allVotes, setAllVotes] = useState<string[]>()
    const [allInvestedProposal, setAllInvestedProposal] = useState<Proposal[]>([]);
    const context = useWeb3Context()
    useEffect(() => {
    connect()
    })

    const connect = async () => {
        if()
    }
    
}