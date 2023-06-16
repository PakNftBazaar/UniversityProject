import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import heroSliderData from '../assets/fake-data/data-slider';
import Slider from '../components/slider/Slider';
import Expolore from './Explore'
import marketPlaceAddress from "../contractsData/MarketPlace-address.json";
import marketplaceAbi from  "../contractsData/MarketPlace.json"
import NFTAbi from "../contractsData/NFT.json"
import NFTAddress from "../contractsData/NFT-address.json"
import { ethers } from 'ethers';
import Loader from '../components/share/Loader';


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

const Home01 = ({account,changeNetwork, loding ,setloding}) => {

  
// console.log("hi",changeNetwork)
  const [Items, setItems] = useState([])



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

  useEffect(() => {
    loadMarketplaceItems();
  }, [])

  // console.log("Items", Items);


    return (
      <>
      {
        loding && 
        <Loader/>
      }

        <div className='home-1'>
        <Header account={account} changeNetwork={changeNetwork}/>
        <Slider data={heroSliderData} />
        {/* <LiveAuction data={Items} /> */}
        <Expolore loding={loding} setloding={setloding} />
        {/* <TopSeller data={topSellerData} /> */}
        {/* <PopularCollection data={popularCollectionData} /> */}
        {/* <Create /> */}
        <Footer />
    </div>
      
      </>
      
    );
}

export default Home01;
