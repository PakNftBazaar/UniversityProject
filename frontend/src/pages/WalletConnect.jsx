import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

import img1 from '../assets/images/icon/connect-1.png'
import img4 from '../assets/images/icon/connect-4.png'




const WalletConnect = () => {
    const [data] = useState(
        [
            {
                img: img1,
                title: 'Meta Mask',
                 
            },
            {
                img: img4,
                title: 'Wallet Connect',
                
            },
            
            
        ]
    )
    return (
        <div>
            <Header />
            <div className="tf-connect-wallet tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="tf-title-heading ct style-2 mg-bt-12">
                                Connect Your Wallet
                            </h2>
                           
                        </div>
                        <div className="col-md-12">
                            <div className="sc-box-icon-inner style-2">
                                {
                                    data.map((item,index) => (
                                        <div key={index} className="sc-box-icon">
                                            <div className="img">
                                                <img src={item.img} alt="Axies" />
                                            </div>
                                            <h4 className="heading"><Link to="/login">{item.title}</Link> </h4>
                                            <p className="content">{item.description}</p>
                                         </div>
                                    ))
                                }
                            </div>  
                        </div>    
                    </div>              
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default WalletConnect;
