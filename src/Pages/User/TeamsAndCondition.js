import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Register.css';

const TeamsAndCondition = () => {
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const navigate = useNavigate()

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])

    return (
        <div>

            <form>
                <div>
                    <div className="page_wrapper">
                        {/* ------------ GPBond ----------- */}
                        <div className='register_container'>
                            <div>
                                <div style={{ borderBottom: '3px solid black' }}>
                                    <text className="gpbond_text">GOLDEN PLANET SENIOR HERITAGE HOMES PRIVATE LIMITED</text>
                                    <text className="gpbond_text" >CIN: U41000TN2023PTC165149</text>
                                </div>
                                <text className="gpbond_hed">Regd Office: Ananda Nilayam,No.31/10, Arya Gowda Road, West Mambalam,Chennai - 600033.</text>
                                <br></br>
                                <text className="gpbond_text" style={{ textAlign: "center" }}>
                                    TERMS AND CONDITIONS OF ISSUE OF CUMULATIVE, REDEEMABLE PREFERENCE SHARES </text>
                                <br /><br />
                                <div className='col-lg-12'>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Offer Price</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Rs. 10 per Share issued at Par</span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Coupon Rate</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Dividend option (a) 9% p.a. (b) 0% Coupon</span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Dividend Payable</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Dividend Payable under Companies Act 2013 and Rules framed thereunder <br></br>
                                                In the absence of Profits the Coupon Rate shall be accumulated
                                            </span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Redemption Period</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Redemption at the option of the Board of Directors<br></br>
                                                Redemption after 3 years of issue – expected during the 4th year after issue
                                            </span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Redemption Price</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Your Directors assure a Compounded Annual Return of
                                                (a)	5% p.a. for 9% p.a. coupon Shares<br></br>
                                                (b)	14% p.a for Zero Coupon Shares
                                            </span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Booking by</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Only Resident Indian Individuals and Indian Registered Corporates are
                                                Eligible to Apply
                                            </span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Details Required	</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Passport Size Photo <br></br>
                                                PAN Card Copy<br></br>
                                                Aadhar Card Copy
                                            </span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Voting Rights</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Preference Shareholders are eligible to copy of Annual Financial Statements<br></br>
                                                Preference Shareholders are entitled to attend General Meetings but with no <br></br>
                                                voting rights
                                            </span>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'> Dematerilization of Shares</span>
                                        </div>
                                        <div className='col-lg-6 col-md-12 mb-3'>
                                            <span className='tand_label'>Presently the Shares of the Company have not been dematerialized.<br></br>
                                                However under the Government Regulations the shares would be<br></br>
                                                dematerialized.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TeamsAndCondition;