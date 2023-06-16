// import React, { useState, Fragment } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
// import Countdown from "react-countdown";
// import CardModal from "./CardModal";
// import { ethers } from 'ethers';
// import TodayPicks from "./TodayPicks";

// import "swiper/scss";
// import "swiper/scss/navigation";
// import "swiper/scss/pagination";

// const LiveAuction = (props) => {
//   const data = props.data;
//   console.log("!!!!!!!!!!!!!",data)

//   const [modalShow, setModalShow] = useState(false);


//   const renderer = ({ hours, minutes, seconds, completed }) => {
//     if (completed) {
//       // Render a completed state
//       return 'completed';
//     } else {
//       // Render a countdown
//       return <span>{hours}:{minutes}:{seconds}</span>;
//     }
//   };
//   return (
//     <Fragment>
//       <section className="tf-section live-auctions">
//         <div className="themesflat-container">
//           <div className="row">
//             <div className="col-md-12">
//               <div className="heading-live-auctions">
//                 <h2 className="tf-title pb-20">Listed NFT's</h2>
//                 <Link className="exp style2">
//                   EXPLORE MORE
//                 </Link>
//               </div>
//             </div>
//             <div className="col-md-12">
          
//                 {data.map((item, index) => (
//                    <TodayPicks item={item} index={index} />
           
//                 ))}
             
//             </div>
//           </div>
//         </div>
//       </section>
//       <CardModal show={modalShow} onHide={() => setModalShow(false)} />
//     </Fragment>
//   );
// };

// LiveAuction.propTypes = {
//   data: PropTypes.array.isRequired,
// };

// export default LiveAuction;
