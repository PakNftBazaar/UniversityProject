import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import marketPlaceAddress from "../contractsData/MarketPlace-address.json";
import marketplaceAbi from "../contractsData/MarketPlace.json"
import NFTAbi from "../contractsData/NFT.json"
import NFTAddress from "../contractsData/NFT-address.json"
import { ethers, utils } from "ethers";
import { Button, Modal } from "react-bootstrap";
import Loader from "../components/share/Loader";


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

const ItemDetails = ({loding ,setloding}) => {
  const { item } = useParams();
  const myArray = JSON.parse(decodeURIComponent(item));


  
  const [modal, setmodal] = useState(false)
  const [price, setPrice] = useState(null)
  const [Time, setTime] = useState(0)
  const [bid, setbid] = useState(0)
  const [bidder, setbidder] = useState(null)
  const [NowTime, setNowTime] = useState(0)
  const [account, setAccount] = useState(null)
  const [Placebid,setplacebid]=useState(false);
  const navigate = useNavigate();


  const checkIsWalletConnected = async () => {
    try {
      if (!ethereum) return alert("please install MetaMask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setAccount(accounts[0]);
      } else {
        console.log("No account Found");
      }
    } catch (err) {

      throw new Error("No ethereum Object");
    }
  }

  const getLastTime = async () => {
    try {
      const time = await SetTransactionSigner().getLastTime(myArray?.itemId)
      const temp = Number(time.toString())
      const nowDate = Math.floor((new Date()).getTime() / 1000);
      setTime(temp)
      setNowTime(nowDate)
    } catch (error) {
      console.log(error);
    }
  }

  const getHigestBid = async () => {
    try {
      let bid = await SetTransactionSigner().getHighestBid(myArray?.itemId);
      setbid(ethers.utils.formatEther(bid))
      // console.log("this is bid", bid.toString());
    } catch (error) {
      console.log(error);
    }
  }

  const getHigestBidder = async () => {
    try {
      let bidder = await SetTransactionSigner().getHighestBidder(myArray?.itemId);
      setbidder(bidder)
      // console.log("this is bid", bidder.toString());
    } catch (error) {
      console.log(error);
    }

  }

  const CancelListing = async () => {
    try {
      setloding(true)
      await (await SetTransactionSigner().cancelListing(myArray?.itemId)).wait();
      setloding(false);
      navigate('/');
    } catch (error) {
      setloding(false);
      console.log(error);
    }


  }

  const concludeAuction = async () => {
    try {
      setloding(true);
      await (await SetTransactionSigner().concludeAuction(myArray?.itemId, account)).wait();
      setloding(false);
      navigate('/')
    } catch (error) {
      setloding(false);
      console.log(error);
    }

  }

  const cancellAuction = async () => {
    try {
      setloding(true);
      await (await SetTransactionSigner().cancellAuction(myArray?.itemId, account)).wait();
      setloding(false);
      navigate('/')
    } catch (error) {
      setloding(false);
      console.log(error);
    }

  }


  const buyMarketItem = async (myArray) => {
    try {
      setloding(true)
      console.log("this is item id ", myArray?.itemId)
      await (await SetTransactionSigner().purchaseItem(myArray?.itemId, { value: myArray.totalPrice })).wait()
      setloding(false);
      navigate('/')
    } catch (error) {
      console.log(error);
      setloding(false);
    }
  }


  const placeBid = async () => {
    
    try {
      setloding(true);
      const bidding = ethers.utils.parseEther(price)
      await (await SetTransactionSigner().bid(myArray?.itemId, { value: bidding })).wait()
      setmodal(false);
      setloding(false);
      window.location.reload()
    } catch (error) {
      setloding(false);
      console.log(error);
    }

  }




  useEffect(() => {
    checkIsWalletConnected()
    getLastTime();
    getHigestBid();
    getHigestBidder();
  }, [bidder, bid, account]);


  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return 'completed';
    } else {
      // Render a countdown
      return <span>{hours}:{minutes}:{seconds}</span>;
    }
  };


  const [dataHistory] = useState([
    
  ]);

  return (
  <>
{
  loding && 
  <Loader/>
}
<div className="item-details">
<Header />
<section className="flat-title-page inner">
  <div className="overlay"></div>
  <div className="themesflat-container">
    <div className="row">
      <div className="col-md-12">
        <div className="page-title-heading mg-bt-12">
          <h1 className="heading text-center">Item Details</h1>
        </div>
        <div className="breadcrumbs style2">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>Item Details</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
<div className="tf-section tf-item-details">
  <div className="themesflat-container">
    <div className="row">
      <div className="col-xl-6 col-md-12">
        <div className="content-left">
          <div className="media">
            <img src={myArray?.image} alt="Axies" />
          </div>
        </div>
      </div>
      <div className="col-xl-6 col-md-12">
        <div className="content-right">
          <div className="sc-item-details">
            <h2 className="style2">
              {myArray?.name}
            </h2>
           
            <div className="client-infor sc-card-product">
              <div className="meta-info">
                <div className="author">
                  
                  <div className="info">
                    <span>Owned By</span>
                    <h6>
                      {" "}
                      <Link to="/authors">{myArray?.seller.slice(0,18)}....{myArray.seller.slice(30, 36)}</Link>{" "}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="meta-info">
                <div className="author">
                  
                  <div className="info">
                    <span>Create By</span>
                    <h6>
                      {" "}
                      <Link to="/authors">{myArray?.seller.slice(0,18)}....{myArray.seller.slice(30, 36)}</Link>{" "}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <p>
              {myArray?.description}
            </p>


        <div>
            <div className="meta-item-details style2">
              <div className="item meta-price">
                <span className="heading">Current Bid</span>
                {bid > 0
                  ?
                  <div className="price">
                    <div className="price-box">
                      <h5> {bid} MATIC</h5>
                    
                    </div>
                  </div>
                  :
                  <></>
                }
              </div>

              {myArray?.time > 0

                ?
                NowTime < Time

                  ?
    
                  //////yhn pe div's ko det krna hai fr aspe condition lagani hai //////////////////
    
                account?.toString().toLowerCase() === myArray?.seller?.toString().toLowerCase()
                    ?
                    <>
                    <div className="item count-down">
                      <span className="heading style-2">Countdown</span>
                      {<Countdown date={Time * 1000} renderer={renderer}/>}
                    </div>
                    <div>
                    <Link className="sc-button loadmore style bag fl-button pri-3">
                      <span>Auction In Progress</span>
                    </Link>
                  </div>
                  </>
                    :
                    <>
                    <div className="item count-down">
                      <span className="heading style-2">Countdown</span>
                      {<Countdown date={Time * 1000} renderer={renderer}/ >  }
                    </div>
                      <div>
                        <Link onClick={()=>setplacebid(true)} className="sc-button loadmore style bag fl-button pri-3">
                          <span>Place a Bid</span>
                        </Link>
                      </div>
                      </>
                  :

                  bid > 0 && bidder?.toString().toLowerCase() === account?.toString().toLowerCase()
                    ?
                    <div>
                      <Link onClick={concludeAuction} className="sc-button loadmore style bag fl-button pri-3">
                        <span>GET NFT</span>
                      </Link>
                    </div>
                    :
                    account?.toString().toLowerCase() !== myArray?.seller?.toString().toLowerCase()
                      ?
                      <Link  className="sc-button loadmore style bag fl-button pri-3">
                        <span> Auction has Ended</span>
                      </Link>
                      :
                      bid > 0
                        ?
                        <Link  className="sc-button loadmore style bag fl-button pri-3">
                          <span> Auction has Ended</span>
                        </Link>
                        :
                        <Link onClick={cancellAuction}  className="sc-button loadmore style bag fl-button pri-3">
                          <span> Auction End Take Your nft </span>
                        </Link>

                : account?.toString().toLowerCase() === myArray?.seller?.toString().toLowerCase()
                  ?
                  <Link onClick={CancelListing} className="sc-button loadmore style bag fl-button pri-3">
                    <span>Cancel Listing</span>
                  </Link>
                  :

                  <>
                    <div className="meta-item-details style2">
                      <div className="item meta-price" style={{ marginLeft: "176px" , marginRight: "10px" }}>
                        <span className="heading">Current Price</span>
                        <div className="price">
                          <div className="price-box" style={{margin: "20px"}}>
                            <h5> {ethers.utils.formatEther(myArray?.totalPrice)} MATIC</h5>
                           
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      onClick={() => buyMarketItem(myArray)}
                      className="sc-button loadmore style bag fl-button pri-3"
                    >
                      <span>Buy</span>
                    </Link>
                    </>

              }


            </div>

        </div>
            
            
            {/* //////////////////////////////////////// Bid History Section /////////////////////////////////////// */}
      </div>


          <div className="flat-tabs themesflat-tabs">
            <Tabs>
              

              <TabPanel>
                <ul className="bid-history-list">
                  {dataHistory.map((item, index) => (
                    <li key={index} item={item}>
                      <div className="content">
                        <div className="client">
                          <div className="sc-author-box style-2">
                            <div className="author-avatar">
                              <Link to="#">
                                <img
                                  src={item.img}
                                  alt="Axies"
                                  className="avatar"
                                />
                              </Link>
                              <div className="badge"></div>
                            </div>
                            <div className="author-infor">
                              <div className="name">
                                <h6>
                                  <Link to="/authors">
                                    {item.name}{" "}
                                  </Link>
                                </h6>{" "}
                                <span> place a bid</span>
                              </div>
                              <span className="time">{item.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="price">
                          <h5>{item.price}</h5>
                          <span>= {item.priceChange}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabPanel>
              
            </Tabs>
          </div>



        </div>
      </div>
    </div>
  </div>

 

         {/* Auction Model */}
         <Modal
         show={Placebid}
         onHide={() => setplacebid(false)}
     >
         <Modal.Header closeButton></Modal.Header>

         <div className="modal-body space-y-20 pd-40">
             <h3>MATIC Bid Amount</h3>
             <p className="text-center">Bid amount<span className="price color-popup"></span>
             </p>
             <input type="text" className="form-control"
                 onChange={(e) => setPrice(e.target.value)}
                 placeholder="00.00 MATIC" />

             <Button onClick={()=>placeBid(myArray)} disabled={loding} className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> Place Bid </Button>
         </div>
     </Modal>
</div>
</div>
</>
  );
};

export default ItemDetails;
