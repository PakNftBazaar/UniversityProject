import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {useNavigate } from "react-router-dom";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import nft from "../contractsData/NFT.json";
import nftAddr from "../contractsData/NFT-address.json"
import Loader from "../components/share/Loader";


const CreateItem = ({account, changeNetwork, loding ,setloding}) => {
//start from here  
  const ethers = require("ethers");

  const [image, setImage] = useState('')
  const [royality, setRoyality] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate();

  async function OnChangeFile(e) {
    var file = e.target.files[0];

  
    if (typeof file !== 'undefined') {
      try {
        setloding(true)
        console.log("this is image file ", file);
        const resut = await uploadFileToIPFS(file);
        //const result = await client.add(file)
        console.log("!!!!!!!!!!!!!!!!!!",resut)
        setImage(resut.pinataURL);
        setloding(false)
      } catch (error) {
        setloding(false)
        console.log("ipfs image upload error: ", error)
      }
    }
  }


  const createNFT = async () => {


    console.log("this is image????????????? ", image);
    console.log("this is name ", name);
    console.log("this is description ", description);

    if (!image || !name || !description) return
    //let temp = image.("https://gateway.pinata.cloud/ipfs/").replace("https://gateway.pinata.cloud/ipfs/");
    const nftJSON = {
      "attributes":[
      {"trait_type":`${name}`,"value":"Testing"},
      {"trait_type":"First","value":"Onwer"},
      {"trait_type":"NFT","value":"Developer"},
      {"trait_type":"Web3","value":"FullStack"}],
      "description":`${description}`,
      "image":`${image}`,
      "name":`${name}`
    }


    try {
      setloding(true)
      const result = await uploadJSONToIPFS(nftJSON)
     console.log("this is json image format ",result);
     await mintThenList(result)
     setName("")
     setDescription("") 
     setRoyality("")
     navigate('/')
     setloding(false)
    } catch (error) {
      setloding(false)

      console.log("ipfs uri upload error: ", error)
    }
  }


  const mintThenList = async (result) => {
    try {
      setloding(true)
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // updateMessage("Please wait..");
      let contract = new ethers.Contract(
              nftAddr.address,
              nft.abi,
              signer
            );

    await (await contract.mint(result.pinataURL,royality)).wait()
      setName("")
     setDescription("")
     alert("congrates you mint")
     window.location.reload();
    } catch (error) {
      setloding(false)
      console.log(error)
    }
  }

// console.log("thIS IS image",image)









useEffect(()=>{

},[])



  return (
    <>
       {loding ?
      <Loader/>
      :
      <div className="create-item">
      <Header  account={account} changeNetwork={changeNetwork} />
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Create Item</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>Create Item</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="tf-create-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            
            <div className="col-xl-9 col-lg-6 col-md-12 col-12">
              <div className="form-create-item">
                <form action="#">
                  <h4 className="title-create-item">Upload file</h4>
                  <label className="uploadFile">
                    <span className="filename">
                      PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                    </span>
                    <input
                      type="file"
                      className="inputfile form-control"
                      name="file"
                      onChange={OnChangeFile}
                    />
                  </label>
                </form>
                <div className="flat-tabs tab-create-item">
               
                  <Tabs>
                    <TabPanel>
                      <form >
                       <h4 className="title-create-item">NFT Name</h4>
                        <input type="text" placeholder="Item Name"  onChange={(e) => setName(e.target.value)}/>

                        <h4 className="title-create-item">Description</h4>
                        <textarea placeholder="e.g. “This is very limited item”" onChange={(e) => setDescription(e.target.value)}></textarea>

                        <div className="row-form style-3">
                          <div className="inner-row-form">
                            <h4 className="title-create-item">Royalties</h4>
                            <input type="text" placeholder="5%" onChange={(e) => setRoyality(e.target.value)} />
                          </div>
                          <div className="inner-row-form">
                            
                          </div>
                          <div className="inner-row-form style-2">
                            <div className="seclect-box">
                             
                            </div>
                          </div>

                        </div>
                        <div>                        
                      <button type="button" onClick={createNFT}  style={{ marginTop:"30px"}} className="sc-button header-slider style style-2 note fl-button pri-1">
                    <span>Create</span>
                    </button>
                    </div>
                      </form>
                    </TabPanel>
                    
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    }

    </>
 
  );
};

export default CreateItem;
