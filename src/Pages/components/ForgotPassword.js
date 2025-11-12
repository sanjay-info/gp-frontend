import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../components/AppProvider';
import Alert from '../components/Alert';
import { gp_logo } from '../components/imageUrl';
import '../Login.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdVerified } from "react-icons/md";
import PhoneInput from 'react-phone-input-2'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [formErrors, setFormErrors] = useState({ email: '' });
    const [otpEmailSent, setOtpEmailSent] = useState(false);
    const [showEmailOtp, setShowEmailOtp] = useState(false);
    const [emailOtpVerified, setEmailOtpVerified] = useState(false);
    const [emailInputDisabled, setEmailInputDisabled] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const [alertClose, setAlertClose] = useState(() => null);
    const [countdown, setCountdown] = useState(180);
    const [mobile, setMobile] = useState('');
    const [mobileVerified, setMobileVerified] = useState(false);
    const [mobileOtp, setMobileOtp] = useState('');
    const [mobilOtpVerified, setMobileOtpVerified] = useState(false);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const navigate = useNavigate();
    const { PostApi } = useAppContext();

    const intervalRef = useRef(null);
    const startCountdown = () => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Start a new countdown
        intervalRef.current = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 0) {
                    clearInterval(intervalRef.current);
                    return 0;
                } else {
                    return prevCountdown - 1;
                }
            });
        }, 1000);
    };

    const focusOutValidation = async (label) => {
        if (label === "email") {
            if (email === "") {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter the Email Address" }
                })
            }
            else if (emailPattern.test(email) === false) {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter valid Email Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, email: "" }
                })
            }
        }
        else if (label === "mobile") {
            if (mobile === "") {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Mobile Number" }
                })
            }
            else if (mobile.length !== 10) {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Valid Mobile Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "" }
                })
            }
        }
    }

    const onChangeValidation = (e, label) => {
        if (label === "email") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter the Email Address" }
                })
            }
            else if (emailPattern.test(value) === false) {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter valid Email Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, email: "" }
                })
            }
        }
        else if (label === "mobile") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Mobile Number" }
                })
            }
            else if (value.length !== 10) {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Valid Mobile Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "" }
                })
            }
        }
    }

    const emailOtpBtn = (event) => {
        event.preventDefault();
        if (countdown === 0) {
            setCountdown(180);
        }
        if (!email || !email.trim()) {
            toast.error('Please Enter Your Email Address.');
            return;
        }
        const url = "/user/sendOtpForForgotPwd?mailId=" + email;
        PostApi('POST', url)
            .then((response) => {
                if (response.data.status === 200) {
                    setShowEmailOtp(true);
                    setOtpEmailSent(true);
                    setEmailInputDisabled(true)
                    startCountdown();
                    toast.success('OTP sent to your email.');
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const emailOtpVerify = (event) => {
        event.preventDefault();
        if (!emailOtp || !emailOtp.trim()) {
            toast.error('Please Enter Your OTP');
            return;
        }
        const url = "/user/validateMailOtp?otp=" + emailOtp + "&email=" + email;
        PostApi('POST', url)
            .then((response) => {
                if (response.data.status === 200) {
                    setEmailOtpVerified(true)
                } else if (response.data.status === 409) {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }


    const mobileOtpBtn = (event) => {
        event.preventDefault();
        if (countdown === 0) {
            setCountdown(180);
        }
        if (!mobile || !mobile.trim()) {
            toast.error('Please Enter Your Mobile Number.');
            return;
        }
        const url = "/user/sendMobileOtpForForgotPwd?mobileNo=" + mobile + "&mailId=" + email;
        PostApi('POST', url)
            .then((response) => {
                if (response.data.status === 200) {
                    setMobileVerified(true)
                    setCountdown(180);
                    toast.success('OTP sent to your Moblie Number.');
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const mobileOtpVerify = (event) => {
        event.preventDefault();
        if (!mobileOtp || !mobileOtp.trim()) {
            toast.error('Please Enter Your OTP');
            return;
        }
        const url = "/user/validateMobileOtpAndSendPwd?otp=" + mobileOtp + "&mobileNo=" + mobile;
        PostApi('POST', url)
            .then((response) => {
                if (response.data.status === 200) {
                    setMobileOtpVerified(true)
                    setShowAlert(true)
                    setAlertMessage(
                        <div>
                            OTP Verified Successfully<br />
                            Password Has Been Sent To Your Email Address
                        </div>
                    );
                    setAlertClose(() => () => navigate("/"))
                } else if (response.data.status === 409) {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleMobileChange = (value, country) => {
        const phoneNumberWithoutCountryCode = value.slice(country.dialCode.length).trim();
        setMobile(phoneNumberWithoutCountryCode);
    };

    return (
        <div>
            <div className="login_container2_bg">
                <div className='login_card'>
                    <div className='logflx'>
                        <img src={gp_logo} alt='no' className='logoimg'></img>
                    </div>
                    <div className='login_form_head_container'>
                        <text className="login_form_head">Forgot Password</text>
                    </div>
                    <form onSubmit={emailOtpVerify}>
                        <div className='input_container'>
                            <div className='input_container'>
                                <label className='login_label'>Email Address <span className="required">*</span></label>
                                <div className='input_contanier' style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        id="Email"
                                        name="Email"
                                        className='inputsf'
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            onChangeValidation(e, "email")
                                        }}
                                        onBlur={() => focusOutValidation("email")}
                                        disabled={emailInputDisabled}
                                    />
                                    {formErrors.email && <div className="field_form_alert">
                                        <span>{formErrors.email}</span>
                                    </div>}
                                    {!otpEmailSent &&
                                        <button style={{ position: 'absolute', right: '4px', top: '3.5px', height: '36px', border: 'none', borderRadius: "5px", backgroundColor: "#4071f4", width: "80px" }} onClick={emailOtpBtn}>
                                            <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {otpEmailSent ? 'Request OTP' : 'Request OTP'}</span></button>
                                    }
                                    {emailOtpVerified &&
                                        <MdVerified style={{ color: 'green' }} className="eye-icon_login" />
                                    }
                                </div>
                            </div>
                            {showEmailOtp && emailOtpVerified === false &&
                                <div className='input_contanier'>
                                    <input
                                        type="tel"
                                        maxLength={6}
                                        id="EmailOtp"
                                        name="EmailOtp"
                                        className='inputsf'
                                        placeholder="Enter Otp"
                                        value={emailOtp}
                                        onChange={(e) => {
                                            if (e.target.value.length > 6) {
                                                e.target.value = e.target.value.slice(0, 6);
                                            }
                                            setEmailOtp(e.target.value);
                                        }}
                                        onKeyPress={(e) => {
                                            const charCode = e.charCode || e.keyCode;
                                            if (charCode < 48 || charCode > 57) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <button
                                        style={{
                                            position: 'absolute',
                                            right: '4px',
                                            top: '3.5px',
                                            height: '36px',
                                            border: 'none',
                                            borderRadius: "5px",
                                            backgroundColor: "#3fd713",
                                            width: "80px",
                                            pointerEvents: emailOtp ? 'auto' : 'none',
                                            opacity: emailOtp ? 1 : 0.5
                                        }}
                                        onClick={emailOtpVerify}
                                        disabled={!emailOtp}
                                    >
                                        <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Verify</span>
                                    </button>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", marginTop: "5px" }}>
                                        {countdown > 0 && (
                                            <div>
                                                <label style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>Time Remaining {countdown}s </label>
                                            </div>
                                        )}
                                        <div>
                                            {countdown === 0 ? (
                                                <span className="link-like" style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                                    onClick={emailOtpBtn}> Resend OTP
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='input_container'>
                            <div className='input_container'>
                                <label className='login_label'>Mobile Number <span className="required">*</span></label>
                                <div className='phone_input_container'>

                                    <PhoneInput
                                        countryCodeEditable={false}
                                        placeholder="Mobile Number"
                                        onlyCountries={['us', 'in']}
                                        country={"in"}
                                        style={{ width: "100%", height: "43px" }}
                                        disabled={emailOtpVerified === false || mobileVerified === true}
                                        onChange={handleMobileChange}
                                        disableDropdown={emailOtpVerified === false || mobileVerified === true}
                                    />

                                    {(emailOtpVerified !== false && mobileVerified !== true) &&
                                        <button style={{ position: 'absolute', right: '4px', top: '3.5px', height: '36px', border: 'none', borderRadius: "5px", backgroundColor: "#4071f4", width: "80px" }} onClick={mobileOtpBtn}>
                                            <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> Request OTP</span></button>
                                    }
                                    {mobilOtpVerified === true &&
                                        <MdVerified style={{ color: 'green' }} className="phone_eye_icon" />
                                    }
                                </div>
                                {formErrors.mobileNo && <div className="field_form_alert">
                                    <span>{formErrors.mobileNo}</span>
                                </div>}
                            </div>
                            {mobileVerified &&
                                <div className='input_contanier'>
                                    <input
                                        type="tel"
                                        maxLength={6}
                                        className='inputsf'
                                        placeholder="Enter Otp"
                                        value={mobileOtp}
                                        onChange={(e) =>
                                            setMobileOtp(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            const charCode = e.charCode || e.keyCode;
                                            if (charCode < 48 || charCode > 57) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <button
                                        style={{
                                            position: 'absolute',
                                            right: '4px',
                                            top: '3.5px',
                                            height: '36px',
                                            border: 'none',
                                            borderRadius: "5px",
                                            backgroundColor: "#3fd713",
                                            width: "80px",
                                        }}
                                        onClick={mobileOtpVerify}
                                        disabled={mobilOtpVerified === true}
                                    >
                                        <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Verify</span>
                                    </button>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", marginTop: "5px" }}>
                                        {countdown > 0 && (
                                            <div>
                                                <label style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>Time Remaining {countdown}s </label>
                                            </div>
                                        )}
                                        <div>
                                            {countdown === 0 ? (
                                                <span className="link-like"
                                                    onClick={mobileOtpBtn}> Resend OTP
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='signup_ques_container'>
                            <h6>
                                <Link to="/" className="signup_text">Back To Login</Link>
                            </h6>
                        </div>
                    </form>
                </div>
                {showAlert && (
                    <Alert
                        title={"Success"}
                        msg={alertMessage}
                        open={true}
                        type={"success"}
                        onClose={alertClose}
                    />
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;