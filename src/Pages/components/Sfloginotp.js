import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAppContext } from '../components/AppProvider';
import Alert from '../components/Alert';
import { gp_logo } from '../components/imageUrl';
import '../Login.css';
import { toast } from 'react-toastify';
import { MdVerified } from "react-icons/md";
import PhoneInput from 'react-phone-input-2'
import { CiClock1 } from "react-icons/ci";

const SfLoginOtp = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const tkn = params.get('tkn');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertErrorMessage, setAlertErrorMessage] = useState('');

    const [customerId, setCustomerId] = useState("");
    // const [countryCode, setcountryCode] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [selectedUserType, setSelectedUserType] = useState("");
    const [emailOtp, setEmailOtp] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [countdown, setCountdown] = useState(180);
    const [formErrors, setFormErrors] = useState({});
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { PostApi } = useAppContext();
    const [sfMobileOtpSent, setSfMobileOtpSent] = useState(false);
    const [sfMobileOtpNoSent, setSfMobileOtpNoSent] = useState(false);
    const [sfEmailOtpSent, setSfEmailOtpSent] = useState(false);
    const [sfEmailOtpNoSent, setSfEmailOtpNoSent] = useState(false);

    const [emailIdflag, setSfemailIdflag] = useState("");
    const [emailVerified, setEmailVerified] = useState("");
    const [phoneVerified, setphoneVerified] = useState("");
    const [phonenumflag, setPhonenumflag] = useState("");

    const [countryCode, setCountryCode] = useState();
    const [opportunityId, setOpportunityId] = useState();

    // ----- Alerts And Model--- 
    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const navigate = useNavigate();

    const handleCloseAlert = () => {
        setShowAlert(false);
        window.location.hash = '/';
    };

    const getAllUserTypes = (sfUserType) => {
        const url = '/user/type/all';
        PostApi('POST', url)
            .then((response) => {
                const userType = response.data.filter(item => item.userType === sfUserType);
                const transformedUserTypes = userType.map(userType => ({
                    value: userType.id,
                    label: userType.userType
                }));
                setSelectedUserType(transformedUserTypes);
            })
            .catch((error) => {
                console.log("Error fetching user types:", error);
            });
    };

    const getClientDetails = () => {
        const url = `/user/getSfData?sfId=${tkn}`
        PostApi('POST', url, null)
            .then((response) => {
                console.log(response, "sfdata")
                if (response.data.status === 200) {
                    setName(response.data.data.Name)
                    setCustomerId(response.data.data.Account_Id__c)
                    setMobile(response.data.data.Mobile1_Primary__c)
                    setCountryCode(response.data.data.Country_code__c)
                    setEmail(response.data.data.Email1_Primary__c)
                    getAllUserTypes(response.data.data.User_Type__c)
                    setOpportunityId(response.data.data.Opportunity_id__c)

                    setSfemailIdflag(response.data.sfdata.emailVerified || null)
                    setEmailVerified(response.data.sfdata.emailId || null)
                    setPhonenumflag(response.data.sfdata.mobileVerified || null)
                    setphoneVerified(response.data.sfdata.mobileNo || null)

                }
                else if (response.data.status === 409) {
                    // setShowErrorAlert(true)
                    // setAlertErrorMessage(response.data.message)
                    navigate("/", { replace: true });
                }
                // else if (response.data.status === 409) {
                //     setShowErrorAlert(true)
                //     setAlertErrorMessage(response.data.message)
                // }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };

    useEffect(() => {
        getClientDetails();
    }, []);

    const handleErrorCloseAlert = () => {
        setShowErrorAlert(false);
    };

    const intervalRef = useRef(null);
    const startCountdown = () => {
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
        if (label === "userType") {
            if (selectedUserType === "") {
                setFormErrors((e) => {
                    return { ...e, userType: "Please Select User Type" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, userType: "" }
                })
            }
        }
        else if (label === "name") {
            if (name === "") {
                setFormErrors((e) => {
                    return { ...e, name: "Please Enter Name" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, name: "" }
                })
            }
        }
        else if (label === "customerId") {
            if (customerId === "") {
                setFormErrors((e) => {
                    return { ...e, customerId: "Please Enter Customer ID" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, customerId: "" }
                })
            }
        }
        else if (label === "email") {
            if (email === "") {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter the Email Address" }
                })
            }
            else if (emailPattern.test(email) === false) {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter the Valid Email Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, email: "" }
                })
            }
        }
        else if (label === "mobileNo") {
            if (mobile === "") {
                setFormErrors((e) => {
                    return { ...e, mobile: "Please Enter the Mobile Number" }
                })
            }
            else if (mobile.length !== 10) {
                setFormErrors((e) => {
                    return { ...e, mobile: "Please Enter the Valid Mobile Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, mobile: "" }
                })
            }
        }
    }

    const onChangeValidation = (e, label) => {
        if (label === "userType") {
            const value = e.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, userType: "Please Select User Type" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, userType: "" }
                })
            }
        }
        if (label === "name") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, name: "Please Enter Name" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, name: "" }
                })
            }
        }
        else if (label === "customerId") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, customerId: "Please Enter Customer ID" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, customerId: "" }
                })
            }
        }
        else if (label === "email") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter the Email Address" }
                })
            }
            else if (emailPattern.test(value) === false) {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter the Valid Email Address" }
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
                    return { ...e, mobile: "Please Enter the Mobile Number" }
                })
            }
            else if (value.length !== 10) {
                setFormErrors((e) => {
                    return { ...e, mobile: "Please Enter the Valid Mobile Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, mobile: "" }
                })
            }
        }
    }

    const emailOtpBtn = (event) => {
        setCountdown(180);
        const errors = {};
        if (email === "") {
            errors.email = "Please Enter Email Address"
        }
        else if (emailPattern.test(email) === false) {
            errors.email = "Please Enter the Valid Email Address"
        }
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            const url = "/user/otpToMail?mail=" + email + "&name=" + name + "&customerId=" + customerId;
            PostApi('POST', url)
                .then((response) => {
                    if (response.data.status === 200) {
                        setSfEmailOtpSent(true)
                        startCountdown();
                        toast.success('OTP sent to your email address.');
                    } else {
                        // toast.error(response.data.message);
                        setFormErrors(prevErrors => ({
                            ...prevErrors,
                            emailRequestOtp: response.data.message
                        }));

                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const emailOtpVerify = (event) => {
        event.preventDefault();
        if (!emailOtp || !emailOtp.trim()) {
            // toast.error('Please Enter Your Email OTP.');
            setFormErrors(prevErrors => ({
                ...prevErrors,
                emailOtp: 'Please Enter Your Email OTP.'
            }));
            return;
        }
        // const emailToSend = emailVerified !== null && emailVerified !== undefined && emailVerified !== "" ? emailVerified : email;
        const url = "/user/verifyMail?otp=" + emailOtp + "&mail=" + email;
        PostApi('POST', url)
            .then((response) => {
                console.log(response, "sfverify")
                if (response.data.message === "Email verified successfully") {
                    setSfEmailOtpNoSent(true)
                    toast.success('Email OTP verified successfully.');
                    getClientDetails();
                }
                else if (response.data.message === "Email already verified") {
                    setUserAlert(true);
                    setAlertType("error");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => window.location.reload());
                }
                else if (response.data.message === "Invalid otp") {
                    // toast.error('Entered Email Otp is invalid');
                    setFormErrors(prevErrors => ({
                        ...prevErrors,
                        emailOtp: 'Invalid Email OTP Entered'
                    }));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const mobileOtpBtn = async (event) => {
        event.preventDefault();

        setCountdown(180);
        const errors = {};
        if (mobile === "") {
            errors.mobile = "Please Enter Mobile Number";
        } else if (mobile.length !== 10) {
            errors.mobile = "Please Enter the Valid Mobile Number";
        }
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            // const url = "/user/otpToMobile?mobile=" + mobile + "&email=" + email ;
            // const url = "/user/otpToMobile?mobile=" + mobile + "&email=" + emailVerified ;
            // const emailToSend = (emailVerified !== null && emailVerified !== undefined && emailVerified !== "") ? emailVerified : email;
            const url = "/user/otpToMobile?mobile=" + mobile + "&email=" + emailVerified;
            PostApi('POST', url)
                .then((response) => {
                    if (response.data.status === 200) {
                        startCountdown();
                        setSfMobileOtpSent(true);

                        toast.success('OTP sent to your mobile number.');
                    } else if (response.data.status === 409) {
                        // toast.error('Mobile Number Already Exists');
                        setFormErrors(prevErrors => ({
                            ...prevErrors,
                            mobileSentOtp: response.data.message
                        }));
                    }
                    // else if (response.data.message === "No User Found...!") {
                    //     setShowAlert(true)
                    //     setAlertMessage("Registed With Saleforce is not matched")
                    // }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const mobileOtpVerify = (event) => {
        event.preventDefault();
        if (!mobileOtp || !mobileOtp.trim()) {
            // toast.error('Please Enter Your Mobile OTP.');
            setFormErrors(prevErrors => ({
                ...prevErrors,
                mobileOtp: 'Please Enter Your Mobile OTP.'
            }));
            return;
        }
        const url = "/user/verifyMobile?otp=" + mobileOtp + "&mobileNo=" + mobile;
        PostApi('POST', url)
            .then((response) => {
                if (response.data.message === "Mobile verified successfully") {
                    setSfMobileOtpNoSent(true)
                    toast.success('Mobile OTP verified successfully.');
                    getClientDetails();
                }
                else if (response.data.message === "Mobile already verified") {
                    setUserAlert(true);
                    setAlertType("error");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => window.location.reload());
                }
                else if (response.data.message === "Invalid otp") {
                    // toast.error('Invalid Mobile OTP');
                    setFormErrors(prevErrors => ({
                        ...prevErrors,
                        mobileOtp: 'Invalid Mobile OTP Entered'
                    }));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleRegister = (event) => {
        event.preventDefault();
        const errors = {};
        if (selectedUserType === "") {
            errors.userType = "Please Select User Type"
        }
        if (name === "") {
            errors.name = "Please Enter Name"
        }
        if (customerId === "") {
            errors.customerId = "Please Enter Customer ID"
        }
        if (email === "") {
            errors.email = "Please Enter the Email Address"
        }
        else if (emailPattern.test(email) === false) {
            errors.email = "Please Enter the Valid Email Address"
        }
        if (mobile === "") {
            errors.mobile = "Please Enter the Mobile Number"
        }
        else if (mobile.length !== 10 && !phonenumflag) {
            errors.mobile = "Please Enter the Valid Mobile Number"
        }
        console.log(errors)
        setFormErrors(errors)
        // const emailaddress = (emailVerified !== null && emailVerified !== undefined && emailVerified !== "") ? emailVerified : email;
        // const mobilenumber = (phoneVerified !== null && phoneVerified !== undefined && phoneVerified !== "") ? phoneVerified : mobile;
        if (Object.keys(errors).length === 0) {

            const url = "/user/register";
            const data = new FormData();
            data.append("sfId", tkn)
            data.append("opportunityId", opportunityId)
            data.append("firstName", name);
            data.append("emailId", emailVerified);
            data.append("mobileNo", parseInt(phoneVerified));
            data.append("customerId", customerId);
            data.append("countryCode", countryCode)
            data.append("userTypeId", selectedUserType[0].value);
            data.append("roleId[0]", 2);
            PostApi('POST', url, data)
                .then((response) => {
                    if (response.data.status === 200) {
                        setShowAlert(true);
                        setAlertMessage(
                            <div> User registered successfully.<br /> Username and Password sent to the registered email address </div>
                        );
                    }
                    else if (response.data.status === 409) {
                        setShowErrorAlert(true);
                        setAlertErrorMessage(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const handleMobileChange = (value, country) => {
        const phoneNumberWithoutCountryCode = value.slice(country.dialCode.length).trim();
        setMobile(phoneNumberWithoutCountryCode);
    };

    return (
        <div>
            <div className="register_container">
                <div className='login_card sf_container'>
                    <div className='logflx'>
                        <img src={gp_logo} alt='no' className='logoimg'></img>
                    </div>
                    <div className="welcome_text" style={{ paddingBottom: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <span>Registration Form</span>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className='input_container' style={{ marginTop: "10px" }}>
                            <label className='login_label'>User Type <span className="required">*</span> </label>
                            <div className='input_contanier'>
                                <Select placeholder="Select User Type"
                                    value={selectedUserType}
                                    isDisabled
                                />
                                {formErrors.name && <div className="field_form_alert">
                                    <span>{formErrors.userType}</span>
                                </div>}
                            </div>
                        </div>
                        <div className='input_container'>
                            <label className='login_label'>Name <span className="required">*</span> </label>
                            <div className='input_contanier'>
                                <input
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    className='inputsf'
                                    placeholder="Name"
                                    readOnly
                                    value={name}
                                    // onChange={(e) => {
                                    //     setName(e.target.value)
                                    //     onChangeValidation(e, 'name')
                                    // }}
                                    onBlur={() => focusOutValidation("name")}
                                />
                                {formErrors.name && <div className="field_form_alert">
                                    <span>{formErrors.name}</span>
                                </div>}
                            </div>
                        </div>
                        <div className='input_container' style={{ marginTop: "10px" }}>
                            <label className='login_label'>Customer ID <span className="required">*</span></label>
                            <div className='input_contanier'>
                                <input
                                    type="customerId"
                                    id="customerId"
                                    name="customer"
                                    className='inputsf'
                                    placeholder="Customer ID"
                                    readOnly
                                    value={customerId}
                                // onChange={(e) => {
                                //     setCustomerId(e.target.value)
                                //     onChangeValidation(e, 'customerId')
                                // }}
                                // onBlur={() => focusOutValidation("customerId")}
                                />
                                {/* {formErrors.customerId && <div className="field_form_alert">
                                    <span>{formErrors.customerId}</span>
                                </div>} */}
                            </div>
                        </div>
                        {!emailIdflag ? (
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
                                            disabled={sfEmailOtpSent}
                                        />
                                        {/* {formErrors.email && <div className="field_form_alert">
                                            <span>{formErrors.email}</span>
                                        </div>}
                                        {formErrors.emailRequestOtp && (
                                            <div className="field_form_alert">
                                                <span>{formErrors.emailRequestOtp}</span>
                                            </div>
                                        )} */}
                                        {(formErrors.email || formErrors.emailRequestOtp) && (
                                            <div className="field_form_alert">
                                                <span>{formErrors.email || formErrors.emailRequestOtp}</span>
                                            </div>
                                        )}

                                        {sfEmailOtpSent === false &&
                                            <button type="button" style={{ position: 'absolute', right: '4px', top: '3.5px', height: '36px', border: 'none', borderRadius: "5px", backgroundColor: "#4071f4", width: "80px" }} onClick={emailOtpBtn}>
                                                <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> Request OTP</span></button>
                                        }
                                        {sfEmailOtpNoSent === true &&
                                            <MdVerified style={{ color: 'green' }} className="eye-icon_login" />
                                        }
                                    </div>
                                </div>
                                {(sfEmailOtpSent && sfEmailOtpNoSent === false) &&
                                    <div className='input_contanier'>
                                        <input
                                            type="number"
                                            id="EmailOtp"
                                            name="EmailOtp"
                                            className='inputsf'
                                            placeholder="Enter OTP"
                                            value={emailOtp}
                                            onChange={(e) => {
                                                if (e.target.value.length > 6) {
                                                    e.target.value = e.target.value.slice(0, 6);
                                                }
                                                setEmailOtp(e.target.value);
                                            }}
                                            readOnly={sfEmailOtpNoSent}
                                            onKeyPress={(e) => {
                                                const charCode = e.charCode || e.keyCode;
                                                if (charCode < 48 || charCode > 57) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />

                                        {sfEmailOtpNoSent === false &&
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                                <div>
                                                    {formErrors.emailOtp && (
                                                        <div className="field_form_alert">
                                                            <span>{formErrors.emailOtp}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div >

                                                    {countdown > 0 && (
                                                        <div>
                                                            <label style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>Time Remaining {countdown}s </label>
                                                        </div>
                                                    )}
                                                    <div>
                                                        {countdown === 0 ? (
                                                            <span className="link-like" onClick={emailOtpBtn}> Resend OTP
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {sfEmailOtpNoSent === false &&
                                            <button
                                                type='button'
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
                                                onClick={emailOtpVerify}
                                            >
                                                <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Verify</span>
                                            </button>
                                        }
                                        {sfEmailOtpNoSent &&
                                            <MdVerified style={{ color: 'green' }} className="eye-icon_login" />
                                        }

                                    </div>
                                }
                            </div>
                        ) : (
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
                                            value={emailVerified}
                                            disabled
                                            readOnly
                                        />
                                        <MdVerified style={{ color: 'green' }} className="eye-icon_login" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {!phonenumflag ? (
                            <div className='input_container'>
                                <label className='login_label'> Mobile Number <span className="required">*</span></label>
                                <div>
                                    <div className='phone_input_container'>
                                        <PhoneInput
                                            countryCodeEditable={false}
                                            value={countryCode + mobile}
                                            onlyCountries={['us', 'in']}
                                            style={{ width: "100%", height: "43px" }}
                                            // disabled={sfEmailOtpNoSent === false || sfMobileOtpSent === true}
                                            // disabled={emailIdflag ? false : (sfEmailOtpNoSent === false || sfMobileOtpSent === true)}
                                            disabled={sfMobileOtpSent}
                                            onChange={handleMobileChange}
                                            disableDropdown={true}
                                        />

                                        {sfMobileOtpSent === false &&
                                            <button
                                                type='button'
                                                style={{
                                                    position: 'absolute',
                                                    right: '4px',
                                                    top: '3.5px',
                                                    height: '36px',
                                                    border: 'none',
                                                    borderRadius: "5px",
                                                    backgroundColor: "#4071f4",
                                                    width: "80px",
                                                    // cursor: (sfEmailOtpNoSent === false || sfMobileOtpSent === true) ? 'not-allowed' : 'pointer'
                                                }}
                                                onClick={mobileOtpBtn}
                                                // disabled={sfEmailOtpNoSent === false || sfMobileOtpSent === true || emailIdflag === true}
                                                disabled={emailIdflag ? false : (sfEmailOtpNoSent === false || sfMobileOtpSent === true)}
                                            >
                                                <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >Request OTP</span></button>
                                        }
                                        {sfMobileOtpNoSent === true &&
                                            <MdVerified style={{ color: 'green' }} className="phone_eye_icon" />
                                        }
                                    </div>
                                    {/* {formErrors.mobile && <div className="field_form_alert">
                                    <span>{formErrors.mobile}</span>
                                </div>}
                                    {formErrors.mobileSentOtp && (
                                        <div className="field_form_alert">
                                            <span>{formErrors.mobileSentOtp}</span>
                                        </div>
                                    )} */}
                                    {(formErrors.mobile || formErrors.mobileSentOtp) && (
                                        <div className="field_form_alert">
                                            <span>{formErrors.mobile || formErrors.mobileSentOtp}</span>
                                        </div>
                                    )}

                                </div>
                                {(sfMobileOtpSent && sfMobileOtpNoSent === false) &&
                                    <div className='input_contanier'>
                                        <input
                                            type="number"
                                            id="MobileOtp"
                                            name="MobileOtp"
                                            className='inputsf'
                                            placeholder="Enter OTP"
                                            value={mobileOtp}
                                            onChange={(e) => {
                                                if (e.target.value.length > 6) {
                                                    e.target.value = e.target.value.slice(0, 6);
                                                }
                                                setMobileOtp(e.target.value);
                                            }}
                                            disabled={sfMobileOtpNoSent}
                                            onKeyPress={(e) => {
                                                const charCode = e.charCode || e.keyCode;
                                                if (charCode < 48 || charCode > 57) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        {sfMobileOtpNoSent === false &&
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
                                                onClick={mobileOtpVerify}>
                                                <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Verify</span>
                                            </button>
                                        }
                                        {sfMobileOtpNoSent === true &&
                                            <MdVerified style={{ color: 'green' }} className="eye-icon_login" />
                                        }
                                        {sfMobileOtpNoSent === false &&
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                                                <div>
                                                    <div>
                                                        {formErrors.mobileOtp && (
                                                            <div className="field_form_alert">
                                                                <span>{formErrors.mobileOtp}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div >
                                                    {countdown > 0 && (
                                                        <div>
                                                            <label style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>Time Remaining {countdown}s </label>
                                                        </div>
                                                    )}
                                                    <div>
                                                        {countdown === 0 ? (
                                                            <span className="link-like" onClick={mobileOtpBtn}> Resend OTP
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        ) : (
                            <div className='input_container'>
                                <label className='login_label'> Mobile Number <span className="required">*</span></label>
                                <div>
                                    <div className='phone_input_container'>

                                        <PhoneInput
                                            countryCodeEditable={false}
                                            value={countryCode + phoneVerified}
                                            onlyCountries={['us', 'in']}
                                            style={{ width: "100%", height: "43px" }}
                                            disabled
                                            readOnly
                                            // disabled={sfEmailOtpNoSent === false || sfMobileOtpSent === true}
                                            onChange={handleMobileChange}
                                            disableDropdown={true}
                                        />
                                        <MdVerified style={{ color: 'green' }} className="phone_eye_icon" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='login_btn_container'>
                            {/* disabled={sfEmailOtpNoSent === false || sfMobileOtpNoSent === false}  */}
                            <button type="submit" className="login_btn" style={{ fontWeight: 'bold' }} disabled={!(emailIdflag && phonenumflag)}>Submit</button>
                        </div>
                        <Alert
                            msg={alertMsg}
                            open={userAlert}
                            type={alertType}
                            onClose={alertClose}
                        />
                        {showAlert && (
                            <Alert
                                title={"Success"}
                                msg={alertMessage}
                                open={true}
                                type={"success"}
                                onClose={handleCloseAlert}
                                onConfirm={() => setShowAlert(true)}
                            />
                        )}
                        {showErrorAlert && (
                            <Alert
                                title={"Alert"}
                                msg={alertErrorMessage}
                                open={true}
                                type={"error"}
                                onClose={handleErrorCloseAlert}
                            />
                        )
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SfLoginOtp;