import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { LuMailOpen } from "react-icons/lu";
import '../Register.css';
import './About.css';

const AboutUs = (props) => {

    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const navigate = useNavigate();

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])


    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container ">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div className="about-us-container">
                            <h2>REACH US THROUGH</h2>
                            <br></br>
                            <div className="aboutheader">
                                <div>
                                    <FaLocationDot className="abouticon"></FaLocationDot>
                                </div>
                                <div className="aboutcontent">
                                    <h6 style={{ fontWeight: "bold" }}>Corporate Office</h6>
                                    <p className="par">
                                        No. 11/5, (1st Floor) Venkatakrishna Rd, Mandaveli, Chennai - 600028, Tamil Nadu , India
                                    </p>
                                    <h6 style={{ fontWeight: "bold" }}>Register Office</h6>
                                    <p className="par">
                                        “Ananda Nilayam”, 31/10, Arya Gowda Road, West Mambalam, Chennai - 600033. Tamil Nadu, India
                                    </p>
                                </div>
                            </div>
                            <div className="aboutheader">
                                <div>
                                    <MdCall className="abouticon"></MdCall>
                                </div>
                                <div  className="aboutcontent">
                                    <p className="par">
                                        +91 6384 04 05 06
                                    </p>
                                </div>
                            </div>
                            <div className="aboutheader">
                                <div>
                                    <LuMailOpen className="abouticon"></LuMailOpen>
                                </div>
                                <div className="aboutcontent">
                                    <p className="par">info@mygoldenplanet.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AboutUs;
