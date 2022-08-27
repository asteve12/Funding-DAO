import FundingDAO from "../abis/FundingDAO.json";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connectors } from "../connectors"
import {  BigNumber, ethers } from "ethers"


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
    library?:any,
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


export const DataContext = createContext<DataCOntextProps>({
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
               alert("blockchain connected to not supported")
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
        console.log("addr",process.env.NEXT_PUBLIC_Fund_CONT_ADDR)
        let contractInstance = new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi,library.getSigner());
        
        setFundingDao(contractInstance);

        setTimeout(async () => {

            console.log("totalPRO",await contractInstance.getAllProposals())
            let totalProposals = await contractInstance.getAllProposals()
            
            let tempProposals: Proposal[] = [];

            totalProposals.forEach((item: Proposal) => {
               
                const { id, amount, livePeriod,voteAgainst,voteInFavor } = item
                
                let livePer = BigNumber.from(livePeriod).toNumber()
                console.log("hrllo11", BigNumber.from(voteAgainst).toNumber())
                tempProposals.push({
                    ...item,
                    id:BigNumber.from(id).toNumber().toString(),
                    amount: ethers.utils.formatUnits(amount, "ether"),
                    livePeriod: BigNumber.from(livePeriod).toNumber().toString(),
                    voteAgainst: BigNumber.from(voteAgainst).toNumber().toString(),
                    voteInFavor: BigNumber.from(voteInFavor).toNumber().toString()
                    // livePeriod: ethers.utils.formatUnits(livePeriod)
                });
                
            })
            console.log("tempProposals",tempProposals)
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
                setCurrentBal(ethers.utils.formatUnits(stakeholderBal, "ether"))
                let votes = await contractInstance.getVotes()
                console.log("vote",votes)
                var res = tempProposals.filter((proposal) => {
                    const vote = votes.find((vote: string) => BigNumber.from(vote).toNumber().toString() === proposal.id)
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
       
        let tx=  await contractInstance.createStakeholder({value:ethers.utils.parseUnits(amount,"ether")})
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
            console.log(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi, library.getSigner())
            let contractInstance = new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi, library.getSigner());
        if (amount === "" || amount === "0") {
            toast.error("Please enter valid amount",{})
        }
        alert("creating stakeholder")
        console.log("amount12", title,
        description,
        recipient,
        ethers.utils.parseUnits(amount, "wei"),
        imageId)
        await contractInstance.createProposal(
            title,
            description,
            recipient,
            ethers.utils.parseUnits(amount, "ether"),
            imageId,
            {
                value:ethers.utils.parseUnits(amount,"ether")
            }
        )
        loadBlockchainData();
        
    }

    const getProposal = async (id: string) => {
        let contractInstance = new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi, library.getSigner());

        let data = await contractInstance.getProposal(parseInt(id))
        let proposal: Proposal = data;
       console.log("obtainedProposal",data)
        return proposal;
    }

    const vote = async (id: string, vote: boolean) => {
        let contractInstance = new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi, library.getSigner());
        await contractInstance.vote(id, vote)
        loadBlockchainData();
    }

    const provideFunds = async (id: string, amount: string) => {
        let contractInstance =  new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi, library.getSigner());
        await contractInstance.provideFunds(id, ethers.utils.parseUnits(amount, "wei"), { value: ethers.utils.parseUnits(amount, "ether") })
        loadBlockchainData();
    }

    const releaseFunding = async (id: string) => {
        let contractInstance =  new ethers.Contract(`${process.env.NEXT_PUBLIC_Fund_CONT_ADDR}`, FundingDAO.abi, library.getSigner());
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
        library,
        connect,
        createStakeholder,
        createProposal,
        getProposal,
        provideFunds,
        releaseFunding,
        vote
    }
    
}