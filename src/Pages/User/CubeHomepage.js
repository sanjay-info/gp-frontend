import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseCircleFill } from "react-icons/ri";
import './CubeHomepage.css';
import { BiLogoFacebookSquare } from "react-icons/bi";
import { FaTelegram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
const CubeHomepage = (props) => {
    const [isVisible, setIsVisible] = useState(true);
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const navigate = useNavigate();

    useEffect(() => {
        if (roleId === null || roleId === "" || roleId === undefined) {
            navigate("/", { replace: true });
        }
    }, [roleId, navigate]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleLocationClick = () => {
        window.open(
            "https://maps.google.com/maps?q=No.%2011%2F5%2C%20%281st%20Floor%29%20Venkatakrishna%20Rd%2C%20Jeth%20Nagar%2C%20Mandaveli%2C%20Chennai%2C%20Tamil%20Nadu%20600028&t=m&z=10&output=embed&iwloc=near",
            "_blank"
        );
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="cube-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={handleClose}>
                <RiCloseCircleFill size={24} />
            </div>
            <div className="scene">
                <div className="cube">
                    <div className="card_homepage top">
                        <span className="label_cube">Golden Planet</span>
                    </div>

                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="card_homepage front">
                        <div className="labelgap">
                            <BiLogoFacebookSquare size={30}></BiLogoFacebookSquare>
                            {/* <span className="label_cube">Facebook</span> */}
                        </div>
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="card_homepage back">
                        <div className="labelgap">
                            <FaSquareXTwitter size={30} />
                            {/* <span className="label_cube">X</span> */}
                        </div>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="card_homepage left">
                        <div className="labelgap instagram-icon">
                            <FaInstagram size={30} className="instagram-icon" color="red"/>
                            {/* <span className="label_cube" >Instagram</span> */}
                        </div>
                    </a>
                    <div className="card_homepage right" onClick={handleLocationClick} style={{ cursor: 'pointer' }}>
                        <div className="labelgap" >
                            <FaLocationDot size={30} color="red"/>
                            {/* <span className="label_cube">Location</span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CubeHomepage;
