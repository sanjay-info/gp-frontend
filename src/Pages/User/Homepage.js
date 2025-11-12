import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { Tolkappiyam, gp_locationmap, ourvision, youtime } from "../components/imageUrl";
import './Homepage.css';
import '../Register.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useAppContext } from '../components/AppProvider';
import useWebSocket from '../components/useWebSocket';
import BackToTop from '../components/BackToTop';
import CubeHomepage from './CubeHomepage';

const HomePage = () => {
    const { sideBarCollapse } = useSidebar();
    const { GetApi } = useAppContext();

    const [token] = useState(localStorage.getItem("token"));

    const { usdAmount, aedAmount, ukAmount, setUsdAmount, setAedAmount, setUkAmount } = useWebSocket();

    useEffect(() => {
        Aos.init({
            duration: 3000,
            once: true,
        });
    }, []);


    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        getCurrencyDetails();
    }, []);

    const getCurrencyDetails = () => {
        const method = 'Get';
        const url = "/ws/usd"
        const data = null;
        GetApi(method, url, data, headers)
            .then((response) => {
                if (response.data && response.data.length !== 0) {
                    const usd = response.data
                        .filter(item => item.currency === "USD")
                        .map(item => item.amount ?? "--");
                    setUsdAmount(usd);

                    const aed = response.data
                        .filter(item => item.currency === "UAE")
                        .map(item => item.amount ?? "--");
                    setAedAmount(aed);

                    const uk = response.data
                        .filter(item => item.currency === "UK")
                        .map(item => item.amount ?? "--");
                    setUkAmount(uk);
                }
                else {
                    setUsdAmount("--");
                    setAedAmount("--");
                    setUkAmount("--");
                }
            })
            .catch((error) => {
                console.error("Error searching user:", error);
                setUsdAmount("--");
                setAedAmount("--");
                setUkAmount("--");
            });
    }

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div className="about-us-container row">
                            <div className='col-lg-12' data-aos="zoom-in">
                                <div style={{ display: 'flex', justifyContent: "center" }}>
                                    <div>
                                        <label className='homepgheader'>WELCOME TO GOLDEN PLANET</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-us-container row">
                            <div className='col-lg-6'>
                                <img src={ourvision} alt="Golden Planet Logo" className="gplocationimg" />
                            </div>
                            <div className='col-lg-6' data-aos="fade-up" style={{ display: 'flex', justifyContent: 'ceter', alignItems: "center" }}>
                                <div className='tol_container'>
                                    <label className='homepgheader'>OUR VISION</label>
                                    <text className='homepagetxt'>Our vision is to create a haven where the golden years are not just a time of rest but a period of continued growth, exploration, and vibrant living. To set the standard for exceptional retirement living, where residents find comfort, companionship, and a home that resonates with their individuality.</text>
                                </div>
                            </div>
                        </div>
                        <div className="about-us-container row">
                            <div className='col-lg-6' data-aos="fade-up">
                                <div className='tol_container'>
                                    <label className='homepgheader'>DESIGNED TO CELEBRATE OUR ROOTS</label>
                                    <span className='lblorg'>A Senior township inspired by Tolkappiyam</span>
                                    <text >Drawing inspiration from the five traditional landforms mentioned in the ancient Tamil text “Tolkappiyam” – Kurinji, Mullai, Marutham, Neithal, and Palai. Each landform translates into a distinct architectural element catering to the specific needs and preferences of senior citizens</text>
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <img src={Tolkappiyam} alt="Golden Planet Logo" className="tholkkapiyam" />
                            </div>
                        </div>
                        <div className="about-us-container row">
                            <div className='col-lg-6'>
                                <img src={youtime} alt="Golden Planet Logo" className="tholkkapiyam" />
                            </div>
                            <div className='col-lg-6' data-aos="fade-up" style={{ display: 'flex', justifyContent: 'ceter', alignItems: "center" }}>
                                <div className='tol_container'>
                                    <label className='homepgheader'>YOUR TIME, YOUR WAY</label>
                                    <text >Whether you seek a peaceful retreat or an active social life, Golden Planet caters to your unique desires. Engage in enriching activities, enjoy the lush communal spaces, or simply unwind in the tranquillity of your home.</text>
                                </div>
                            </div>
                        </div>
                        <div className="about-us-container row">
                            <div className='col-lg-6' data-aos="fade-up">
                                <div className='tol_container'>
                                    <label className='homepgheader'>CLOSER TO YOUR HEART AND YOUR NEEDS</label>
                                    <span className='lblorg'>A calm & serene resort-style urban township surrounded by lush greenery with a scenic lake view.</span>
                                    <ul className="location-list">
                                        <li>18.9 kms from Chengalpattu</li>
                                        <li>49 kms from Thiruvanmiyur</li>
                                        <li>9.9 Kms from MAHABALIPURAM JUNCTION</li>
                                        <li>7.6 Kms from THIRUKAZHUKUNDRAM TEMPLE</li>
                                        <li>7.4 Kms from CHETTINAD HOSPITAL PONJERI, ECR</li>
                                        <li>5.8 Kms from SHRI SATHYA SAI MEDICAL COLLEGE HOSPITAL</li>
                                    </ul>
                                    <text>A secluded tranquil location at <span style={{ fontWeight: "bold" }}> close proximity to ECR.</span></text>
                                    <text> <span style={{ fontWeight: "bold" }}>14 acres</span> of total land area with dual road access.</text>
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <img src={gp_locationmap} alt="Golden Planet Logo" className="gplocationimg" />
                            </div>

                        </div>
                        <div style={{ top: "20px", display: "flex", justifyContent: "flex-end" }}>
                            <div class="notification">
                                <div class="notiglow"></div>
                                <div class="notiborderglow"></div>
                                <div class="notititle">Today's Exchange Rate</div>
                                <div class="notibody">USD to INR : {usdAmount !== "--" ? "₹" : ""} {usdAmount}</div>
                                <div class="notibody">AED to INR : {aedAmount !== "--" ? "₹" : ""} {aedAmount}</div>
                                <div class="notibody">GBP to INR : {ukAmount !== "--" ? "₹" : ""} {ukAmount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="cube-div-container">
                        <CubeHomepage></CubeHomepage>
                    </div>

                </div>

                <BackToTop />
            </div>
        </div>
    );
};

export default HomePage;