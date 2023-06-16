import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import TodayPicks from "../components/layouts/TodayPicks";
import todayPickData from "../assets/fake-data/data-today-pick";
import marketPlaceAddress from "../contractsData/MarketPlace-address.json";
import marketplaceAbi from "../contractsData/MarketPlace.json"
import NFTAbi from "../contractsData/NFT.json"
import NFTAddress from "../contractsData/NFT-address.json"
import { ethers } from 'ethers';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';




const SetTransactionSigner = () => {
  //Get provider from Metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // Set signer
  const signer = provider.getSigner()
  const marketplace = new ethers.Contract(marketPlaceAddress.address, marketplaceAbi.abi, signer)
  return marketplace
}

const SetNFTContract = () => {
  //Get provider from Metamask
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // Set signer
  const signer = provider.getSigner()
  const nftcontract = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
  return nftcontract
}

const { ethereum } = window;

const Explore01 = ({account, loding,setloding}) => {

  // console.log(loding,setloding)
  // const [loding, setloding] = useState(false)
  const [Items, setItems] = useState([])
  const [Search, setSearch] = useState('')
  const [array, setArray] = useState([]);



  const loadMarketplaceItems = async () => {
    try {
      // Load all unsold items
      const itemCount = await SetTransactionSigner().itemCount()
      // console.log(itemCount.toString());
      let items = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await SetTransactionSigner().items(i)
        if (!item.sold) {
          const auction = await SetTransactionSigner().isAuction(i)
          // console.log("this is nft ", auction)
          const time = await SetTransactionSigner().getLastTime(item.itemId.toString())
          const temp = Number(time.toString())
          // get uri url from nft contract
          const uri = await SetNFTContract().tokenURI(item.tokenId);
          // console.log("++++++++++++++++++++++uri",uri)
          // use uri to fetch the nft metadata stored on ipfs
          const response = await fetch(uri)
          const metadata = await response.json()
          // get total price of item (item price + fee)
          //get Royality fees in %%%%%%%%%%
          const royality = await SetNFTContract().getRoyalityFees(item.tokenId);
          const res = Number(royality.toString()) / 100;
          items.push({
            time: temp,
            auction: auction,
            totalPrice: item.price,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            Royality: res

          })
        }
      }
      setItems(items)
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = () => {
    const filteredArray = Items.filter(item =>
      item.name.toLowerCase().includes(Search.toLowerCase())
    );
    // Update the state with the filtered array
    setArray(filteredArray);
  };

  console.log("arrayarray",array)
  useEffect(() => {
    loadMarketplaceItems();
    handleSearch();
  }, [Search])

  // console.log("Items", Items);
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div>
    
      {currentPath === '/explore' ?
      <>
      <Header account={account}/>
       <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Explore</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/"> Home </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-12">
         <input type="text" placeholder="Item Name"  onChange={(e) => setSearch(e.target.value)}/>
        </div>
        </section> 

      <div className="container mt-5">
      <div className="row nftnot">

     {Search === ''   ?
     Items.map((item, index) => (
      <TodayPicks loding={loding} setloding={setloding} item={item} index={index} />
      ))
      :
      
      array.length > 0 ?
      array.map((item, index) => (
        <TodayPicks loding={loding} setloding={setloding} item={item} index={index} />
        ))
      
      :
      
      <div>
        <h1>No NFT Found</h1>
        </div>
     
      }
      </div>
      </div>

      {currentPath === '/explore' && <Footer  />} 
      </> 
      :
      <div className="container mt-5">
      <div className="row">
     {
       Items.map((item, index) => (
         <TodayPicks loding={loding} setloding={setloding} item={item} index={index} />
         ))
        }
       </div>
       </div> 
          }
      
      
    </div>
  );
};

export default Explore01;
