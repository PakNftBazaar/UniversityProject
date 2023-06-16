import React , { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel  } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import NbftCard from './NftCard'
import avt from '../assets/images/avatar/avt-auth.jpg'
import NFTAbi from "../contractsData/NFT.json"
import NFTAddress from "../contractsData/NFT-address.json"
import marketPlaceAddress from "../contractsData/MarketPlace-address.json"
import marketPlaceAbi from  "../contractsData/MarketPlace.json"
import { ethers } from 'ethers';
import { Button, Modal } from 'react-bootstrap';
import Loader from '../components/share/Loader';


const SetNFTContract = ()=>{
    //Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    const nftcontract = new ethers.Contract(NFTAddress.address,NFTAbi.abi,signer)
    return nftcontract
  }

const SetTransactionSigner = ()=>{
    //Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    const marketplace = new ethers.Contract(marketPlaceAddress.address, marketPlaceAbi.abi, signer)
    return marketplace
   }
  
  const { ethereum } = window;
const Authors02 = ({account,loding,changeNetwork ,setloding}) => {
    const [modalShow, setModalShow] = useState(false);
    const [BidModalShow, setBidModalShow] = useState(false);
    const [FixModalShow, setFixModalShow] = useState(false);
    const [price, setPrice] = useState(null)
    const [purchases, setPurchases] = useState([])
    const [time, setTime] = useState(null)
    const [chainId,setChainId] = useState()
    const [name, setName] = useState('');
    

    const loadPurchasedItems = async () => {
      try {
        const tokenCount = await SetNFTContract().tokenCount()
        let purchasedItem = [];
        for (let i = 1; i <= tokenCount; i++) {
          const ownerof = await SetNFTContract().ownerOf(i)
       if (account?.toString().toLowerCase() == ownerof.toString().toLowerCase()) {
  
            const uri = await SetNFTContract().tokenURI(i)
            // console.log("++++++++++++++++++++++uri",uri)
            // use uri to fetch the nft metadata stored on ipfs 
            const response = await fetch(uri)
            const metadata = await response.json()
            // get Royality fees 
            const royality = await SetNFTContract().getRoyalityFees(i);
            const res = Number(royality.toString()) / 100
            // define listed item object
            // console.log("&&&&&&&&",uri,res);       
          purchasedItem.push({
              nft: SetNFTContract().address,
              itemId: i,
              marketplace: SetTransactionSigner().address,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              Royality: res
            })
          }
        }
        setPurchases(purchasedItem)
  
      }
  
      catch (error) {
        console.log(error)
      }
    }
  
    useEffect(() => {
      loadPurchasedItems();
     },[account])

     useEffect(() => {
      // Retrieve the stored name from local storage
      const storedName = localStorage.getItem('name');
      if (storedName) {
        setName(storedName);
      }
    }, []);

    /// this function for set username
    const handleNameChange = (event) => {
      const newName = event.target.value;
      setName(newName);
      // Store the name in local storage
      localStorage.setItem('name', newName);
    };


    console.log("nfts",purchases);


  
  
    const [visible , setVisible] = useState(8);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
    }

    return (
      <>
      {loding ?
      <Loader/>
      :
      <div className='authors-2'>
      <Header account={account} changeNetwork={changeNetwork}/>
      <section className="flat-title-page inner">
          <div className="overlay"></div>
          <div className="themesflat-container">
              <div className="row">
                  <div className="col-md-12">
                      <div className="page-title-heading mg-bt-12">
                          <h1 className="heading text-center">Author</h1>
                      </div>
                      <div className="breadcrumbs style2">
                          <ul>
                              <li><Link to="/">Home</Link></li>
                        
                              <li>Author</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>                    
      </section>
      <section className="tf-section authors">
          <div className="themesflat-container">
              <div className="flat-tabs tab-authors">
                  <div className="author-profile flex" style={{height: "47vh"}}>
                      <div className="feature-profile">
                          <img src={avt} alt="Axies" className="avatar" />
                      </div>
                      <div className="infor-profile">
                          <span>Author Address</span>
                          
                          {account ? 
                             <h2 className="title"> {account}  </h2>
                              :
                              <h2 className="title"> Address </h2>
                              }
                        
                         
                      </div>
                      
                  </div>
      
                      <div style={{marginLeft: "700px"}}>
                        <h2 className="title" style={{marginTop:"25px"}}>Your NFT's</h2>
                        </div>
                      <div className="content-tab">
                          <div className="content-inner">
                              <div className="row">
                              {purchases.map((item, index) => (
                                  <NbftCard account={account} loding={loding} setloding={setloding}  item={item} index={index} />
                                 ))
                              }
                              </div>
                          </div>
                      </div>
                </div>
          </div>
      </section>

      <Footer />
  </div>
    }
      </>
    );
}

export default Authors02;
