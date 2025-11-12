import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const PaymentGatway = (props) => {
    const { PostApi } = useAppContext()

    const { sideBarCollapse } = useSidebar();

    const navigate = useNavigate();
    const location = useLocation();
    const item = location.state.item;
    const [roleId] = useState(localStorage.getItem("Role_id"));

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])

    const CreatePayment = () => {
        const method = 'POST';
        const url = `/payment/createPayment?id=${item.id}`;
        PostApi(method, url)
            .then((response) => {
                console.log(response.data.data.secretKey);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handlePaymentGatway = (event) => {
        CreatePayment();
    };

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="row col-12 col-md-12 col-lg-12" style={{ marginTop: "20px", display: 'flex', justifyContent: 'center' }}>
                        <div class="col-md-6 col-md-6 col-lg-6">
                            <div class="Summary_card">
                                <div className='row'>
                                    <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                        <span>Order Details</span>
                                    </div>
                                </div>
                                <div className='col-lg-12 col-12'>
                                    <div className='responsive-column'>
                                        <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", paddingTop: "10px" }}>
                                            <div>
                                                <label className='bond_label'>Units</label>
                                            </div>
                                            <div>
                                                <label className='bond_label'>{item?.clientBondDetails?.units ?? "null"}</label>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", paddingTop: "10px" }}>
                                            <div>
                                                <label className='bond_label'>Face Value</label>
                                            </div>
                                            <div>
                                                <label className='bond_label'>{item?.clientBondDetails?.faceValue ?? "null"}</label>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", paddingTop: "10px" }}>
                                            <div>
                                                <label className='bond_label'>Lot</label>
                                            </div>
                                            <div>
                                                <label className='bond_label'>{item?.noOfLots ?? "null"}</label>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", paddingTop: "10px" }}>
                                            <div>
                                                <label className='bond_label'>Total Price</label>
                                            </div>
                                            <div>
                                                <label className='bond_label' style={{ color: "green" }}>{item?.amountInInr ? `₹${item.amountInInr}` : "null"}</label>
                                            </div>
                                        </div>
                                        <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <button className="login_btn" onClick={handlePaymentGatway}>Pay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentGatway;