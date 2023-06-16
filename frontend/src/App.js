import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Authors02 from './pages/Authors';
import CreateItem from './pages/CreateItem';
import Explore01 from './pages/Explore';
import Home01 from './pages/Home';
import ItemDetails from './pages/ItemDetails';
import { ethers } from 'ethers';
import './App.css';


const { ethereum } = window;
function App() {
    const [loding, setloding] = useState(false)
    const [account, setAccount] = useState(null)

    ethereum.on("accountsChanged", async (account) => {
        setAccount(account[0]);
        window.location.reload()
    })

    const changeNetwork = async () => {
        try {
            if (!ethereum) throw new Error("No crypto wallet found");
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{
                   // chainId: "0x7A69"
                    //  chainId: "0x7A69 "
                    chainId: "0x13881"
                }]
            });
            await web3Handler();
        } catch (err) {
            console.log(err.message);
        }
    };
    window.ethereum && ethereum.on("chainChanged", async () => {
        window.location.reload();
    });

    const checkIsWalletConnected = async () => {
        try {
            if (!ethereum) return alert("please install MetaMask");
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setAccount(accounts[0]);
                // Get provider from Metamask
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                // Set signer
                const signer = provider.getSigner()
                // loadContracts(signer)
                const accountss = await signer.getAddress();
                // Use the selected account to fetch the account name
            } else {
                console.log("No account Found");
            }
        } catch (err) {
            throw new Error("No ethereum Object");
        }
    }

    // MetaMask Login/Connect
    const web3Handler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0])
        // Get provider from Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set signer
        const signer = provider.getSigner()
        const accountss = await signer.getAddress();
        // Use the selected account to fetch the account name
        const UserAccount = await provider.lookupAddress(accountss);
        const accountName = UserAccount.name;
        console.log("accountName(((((((((((((((((((((((", UserAccount)

        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        })

        window.ethereum.on('accountsChanged', async function (accounts) {
            setAccount(accounts[0])
            await web3Handler()
        })
        // loadContracts(signer)
    }

    const UpdateLoader = (data) => {
        setloding(data);
    }

    useEffect(() => {
        checkIsWalletConnected();
    }, [account])
    return (


        <Router>
            <Routes>

                <Route path='/' exact element={<Home01 account={account} changeNetwork={changeNetwork} loding={loding} setloding={UpdateLoader} />} />
                <Route path='/explore' exact element={<Explore01 account={account} loding={loding} setloding={UpdateLoader} />} />

                <Route path='/item-details/:item' exact element={<ItemDetails loding={loding} setloding={UpdateLoader} />} />

                <Route path='/authors' exact element={<Authors02 account={account} changeNetwork={changeNetwork} loding={loding} setloding={UpdateLoader} />} />


                <Route path='/create-item' exact element={<CreateItem  account={account} changeNetwork={changeNetwork} loding={loding} setloding={UpdateLoader} />} />


            </Routes>
        </Router>


    );
}

export default App;
