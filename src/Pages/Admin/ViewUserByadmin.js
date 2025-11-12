import React, { useEffect, useState } from 'react';
import { RiMailLine } from 'react-icons/ri';
import { FaRegUser } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../components/AppProvider';
import Alert from '../components/Alert';
import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import '../Register.css';
import { useSidebar } from "../components/SidebarContext";
import decryptData from '../components/Decrypt';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import Lightbox from "react-image-lightbox";
import { initializeLightGallery } from '../components/lightGalleryInitializer';

const ViewUserByadmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [dob, setDob] = useState('');
    const [userPanImg, setUserPanImg] = useState(null);
    const [userAadhaarImg, setUserAadhaarImg] = useState(null);
    const [webCamImgSrc, setWebCamImgSrc] = useState(null);
    const [selectedUserType, setSelectedUserType] = useState();
    //   -------- current Address---------
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine11, setAddressLine11] = useState('');
    const [city1, setCity1] = useState('');
    const [state1, setState1] = useState('');
    const [country1, setCountry1] = useState('');
    const [pincode1, setPincode1] = useState('');
    //   -------- Perment Address---------
    const [city2, setCity2] = useState('');
    const [state2, setState2] = useState('');
    const [country2, setCountry2] = useState('');
    const [pincode2, setPincode2] = useState('');
    const [sameAsCorrespondence, setSameAsCorrespondence] = useState(false);
    // ----- Alerts And Model--- 
    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");
    const { sideBarCollapse } = useSidebar();
    const { PostApi } = useAppContext()
    const [kycver, setKycver] = useState('');
    const navigate = useNavigate()
    // ------- pattern ------
    const [userid] = useState(localStorage.getItem("user_id"));
    const [checkFlag, setCheckFlag] = useState('');
    const [token] = useState(localStorage.getItem("token"));
    const [roleId] = useState(localStorage.getItem("Role_id"));

    const location = useLocation();
    const id = location.state.id;

    const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
    const [alertYesorNoMessage, setAlertYesorNoMessage] = useState('');

    const [nriFlag, setNriFlag] = useState(false);
    const [selectedActiveflag, setselectedActiveflag] = useState();

    const [maskedPanNo, setMaskedPanNo] = useState("");
    const [maskedAadhaarNo, setMaskedAadhaarNo] = useState("");

    const [userPanImgShow, setUserPanImgShow] = useState(false);
    const [userAadhaarImgShow, setUserAadhaarImgShow] = useState(false);
    const [userProfileImgShow, setUserProfileImgShow] = useState(false);

    const [ociYesFlag, setOciYesFlag] = useState(null);
    const [viewuserid, setviewuserid] = useState("");

    const [passportNo, setPassportNo] = useState("");
    const [nationality, setNationality] = useState('');
    const [countryOfResidence, setCountryOfResidence] = useState("");
    const [ociCardNo, setOciCardNo] = useState("");

    const [passportPreviewImg, setPassportPreviewImg] = useState(null)
    const [userPassportShow, setUserPassportShow] = useState(false)

    const [ociCardPreviewImg, setOciCardPreviewImg] = useState(null);
    const [userOciCardShow, setUserOciCardShow] = useState(false);

    const [userActive, setUserActive] = useState("");

    const [countryCode, setCountryCode] = useState('')

    const [userCategory, setuserCategory] = useState("");

    const [guardianName, setguardianName] = useState("");
    const [guardianDob, setguardianDob] = useState("");
    const [guardianRelation, setguardianRelation] = useState("");
    const [guardianPan, setguardianPan] = useState("");
    const [guardianAadhaar, setguardianAadhaar] = useState("");

    const [guardianPanImg, setguardianPanImg] = useState("");
    const [guardianPanImgShow, setguardianPanImgShow] = useState(false);

    const [guardianAadhaarImg, setguardianAadhaarImg] = useState(null);

    const handleYesorNo = () => {
        setShowYesorNoAlert(false);
    };

    const options = [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
    ];

    const handleStatusChange = (selectedOption) => {
        setselectedActiveflag(selectedOption)
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const countryOptions = [
        { value: 'INDIA', label: 'INDIA' },
        { value: 'USA', label: 'USA' },
    ];

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
            getMyprofileDetails();
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])


    const handleactivevalidation = (event) => {
        event.preventDefault();
        const errors = {};
        if (!selectedActiveflag.value) {
            setUserAlert(true);
            setAlertType("error")
            setAlertMsg("Please Select Status");
            setAlertClose(() => () => setUserAlert(false))
            return;
        }
        if (Object.keys(errors).length === 0) {
            setShowYesorNoAlert(true);
            setAlertYesorNoMessage("Are you sure you want to submit ?");
        }
    }

    const handleactive = (event) => {
        const url = "/user/admin/delete?id=" + userid + "&userId=" + viewuserid + "&status=" + selectedActiveflag.value + "&loginId=" + userid
        const data = {};
        PostApi('POST', url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setShowAlert(true)
                    setShowYesorNoAlert(false)
                    setAlertMessage(
                        response.data.message
                    );
                    setAlertClose(() => () => navigate("/userList"))
                }
                else {
                    setUserAlert(true);
                    setAlertType("error")
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => setUserAlert(false))
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getMyprofileDetails = async () => {

        const url = `/user/id?id=${id}`;
        const data = {};
        try {
            const response = await PostApi('POST', url, data, headers);

            if (response.data.data.userType.id === 2 || response.data.data.userType.id === 3) {
                setNriFlag(true)
            }

            setName(response.data.data.firstName)
            setEmail(response.data.data.emailId);

            if (response.data.data.countryCode !== null && response.data.data.countryCode !== "") {
                setCountryCode(response.data.data.countryCode)
            }
            else {
                if (response.data.data.userType.id === 1) {
                    setCountryCode('+91')
                }
                else {
                    setCountryCode('')
                }
            }

            setMobileNo(response.data.data.mobileNo);
            setDob(response.data.data.dateOfBirth);
            setviewuserid(response.data.data.id);

            if (response.data.data.passportNo !== null && response.data.data.passportNo !== '') {
                const storePan = decryptData(response.data.data.passportNo, response.data.data.key);
                setPassportNo(storePan);
            }
            else {
                setPassportNo('')
            }

            if (response.data.data.countryOfResidence !== null && response.data.data.countryOfResidence !== '') {
                setCountryOfResidence(response.data.data.countryOfResidence)
            }
            else {
                setCountryOfResidence('')
            }

            if (response.data.data.nationality !== null && response.data.data.nationality !== '') {
                setNationality({ label: response.data.data.nationality, value: response.data.data.nationality })
            }
            else {
                setNationality('')
            }

            if (response.data.data.ociCard !== null) {
                setOciYesFlag(response.data.data.ociCard)
            }

            if (response.data.data.ociCardNo !== null && response.data.data.ociCardNo !== '') {
                setOciCardNo(response.data.data.ociCardNo)
            }
            else {
                setOciCardNo('')
            }

            setAddressLine1(response.data.data.addressLine1);
            setAddressLine11(response.data.data.addressLine11);
            setCity1(response.data.data.city1);
            setCity2(response.data.data.city2);
            setUserActive(response.data.data.active);

            if (response.data.data.country1 !== null) {
                setCountry1({ label: response.data.data.country1, value: response.data.data.country1 });
            }
            else {
                setCountry1("")
            }
            if (response.data.data.country2 !== null) {
                setCountry2({ label: response.data.data.country2, value: response.data.data.country2 });
            }
            else {
                setCountry2("")
            }

            setPincode1(response.data.data.pincode1);
            setPincode2(response.data.data.pincode2);
            setState1(response.data.data.state1);
            setState2(response.data.data.state2);
            setselectedActiveflag(response.data.data.active)

            var perAdd = response.data.data.addressLine1 + response.data.data.city1 + response.data.data.country1 + response.data.data.pincode1 + response.data.data.state1 + response.data.data.country1
            var corAdd = response.data.data.addressLine11 + response.data.data.city2 + response.data.data.country2 + response.data.data.pincode2 + response.data.data.state2 + response.data.data.country2

            if (perAdd === corAdd) {
                if (perAdd !== 0 || corAdd !== 0) {
                    setSameAsCorrespondence(true)
                }
                else {
                    setSameAsCorrespondence(false)
                }
            } else {
                setSameAsCorrespondence(false)
            }

            setKycver(response.data.data.kycVerified);
            setCheckFlag(response.data.data.consentChkFlag);

            if (response.data.data.applicantStatus !== null) {
                setSelectedUserType({
                    value: response.data.data.applicantStatus.id,
                    label: response.data.data.applicantStatus.applicantStatus
                })
            }
            else if (response.data.data.applicantStatus === null && (response.data.data.userType.id === 2 || response.data.data.userType.id === 3)) {
                setSelectedUserType({
                    value: 1,
                    label: "INDIVIDUAL"
                })
            }
            else {
                setSelectedUserType("")
            }

            localStorage.setItem("kycverifiedfkflag", response.data.data.kycVerified);

            if (response.data.data.aadhaar !== null && response.data.data.aadhaar !== '') {
                const decryptedAadhaar = decryptData(response.data.data.aadhaar, response.data.data.key);
                if (decryptedAadhaar !== null && decryptedAadhaar !== '') {
                    const aadhaarLength = decryptedAadhaar.length;
                    const maskedAadhaar = '*'.repeat(aadhaarLength - 4) + decryptedAadhaar.slice(-4);
                    setMaskedAadhaarNo(maskedAadhaar);
                }
                else {
                    setMaskedAadhaarNo('');
                }

            }
            else {
                setMaskedAadhaarNo('');
            }

            if (response.data.data.pan !== null && response.data.data.pan !== '') {
                const decryptedPan = decryptData(response.data.data.pan, response.data.data.key);

                if (decryptedPan !== null && decryptedPan !== '') {
                    const panLength = decryptedPan.length;
                    const maskedPan = 'x'.repeat(panLength - 3) + decryptedPan.slice(-3);
                    setMaskedPanNo(maskedPan);
                }
                else {
                    setMaskedPanNo('');
                }
            }
            else {
                setMaskedPanNo('');
            }

            if (response.data.data.aadhaarImage !== null) {
                // const aadhaarImageUrl = base64ToImageUrl(response.data.data.aadhaarImage);
                setUserAadhaarImg(response.data.data.aadhaarImage);
            }
            else {
                setUserAadhaarImg(null);
            }

            if (response.data.data.panImage !== null) {
                // const panImageUrl = base64ToImageUrl(response.data.data.panImage);
                setUserPanImg(response.data.data.panImage);
            }
            else {
                setUserPanImg(null);
            }

            if (response.data.data.passportImage !== null) {
                // const passportImageUrl = base64ToImageUrl(response.data.data.passportImage);
                setPassportPreviewImg(response.data.data.passportImage);
            }
            else {
                setPassportPreviewImg(null);
            }

            if (response.data.data.ociImage !== null) {
                // const ociImageUrl = base64ToImageUrl(response.data.data.ociImage);
                setOciCardPreviewImg(response.data.data.ociImage);
            }
            else {
                setOciCardPreviewImg(null);
            }


            if (response.data.data.profileImage !== null) {
                // const profileImageUrl = base64ToImageUrl(response.data.data.profileImage);
                setWebCamImgSrc(response.data.data.profileImage);
            }
            else {
                setWebCamImgSrc(null);
            }
            setuserCategory(response.data.data.userCategory);
            setguardianName(response.data.data.guardianName);
            setguardianDob(response.data.data.guardianDob);
            // setguardianPan(response.data.data.guardianPan);
            setguardianRelation(response.data.data.guardianRelation);


            const decryptedGuardianAadhaar = decryptData(response.data.data.guardianAadhaar, response.data.data.key);
            setguardianAadhaar(decryptedGuardianAadhaar);

            const decryptedGuardianPan = decryptData(response.data.data.guardianPan, response.data.data.key);
            setguardianPan(decryptedGuardianPan);

            if (response.data.data.guardianPanImage !== null) {
                // const guardianpanImageUrl = base64ToImageUrl(response.data.data.guardianPanImage);
                setguardianPanImg(response.data.data.guardianPanImage);
            }
            else {
                setguardianPanImg(null);
            }
            if (response.data.data.guardianAadhaarImage !== null) {
                // const guardianaadhaarImageUrl = base64ToImageUrl(response.data.data.guardianAadhaarImage);
                setguardianAadhaarImg(response.data.data.guardianAadhaarImage);
            }
            else {
                setguardianAadhaarImg(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ------------ Byte image converter --------
    // const base64ToImageUrl = (base64String) => {
    //     const binaryString = window.atob(base64String);
    //     const binaryLen = binaryString.length;
    //     const bytes = new Uint8Array(binaryLen);
    //     for (let i = 0; i < binaryLen; i++) {
    //         bytes[i] = binaryString.charCodeAt(i);
    //     }
    //     const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
    //     return URL.createObjectURL(blob);
    // };
    const base64ToImageUrl = (base64String) => {
        try {
            if (typeof base64String !== 'string' || base64String.trim() === '') {
                throw new Error('Invalid Base64 string');
            }

            const paddedBase64String = base64String.padEnd(base64String.length + (4 - base64String.length % 4) % 4, '=');

            const binaryString = window.atob(paddedBase64String);
            const binaryLen = binaryString.length;

            const bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error converting Base64 string to image URL:', error);
            return null;
        }
    };
    // ------------ Handle Save Submit --------
    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '43px',
        }),
        menu: (provided) => ({
            ...provided,
            marginTop: '2px',
        }),
    };

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="page_wrapper">
                        <div className='Summary_card'>
                            <div className='headerProfile row'>
                                <div className='col-12 col-md-6 '>

                                    <text className="welcome_text">View User</text>

                                </div>
                                <div className='col-12 col-md-6 headercontainer'>
                                    <text className="customerid_head">Status : <span style={{ color: userActive ? 'green' : 'red' }}>{userActive ? 'Active' : 'In-Active'}</span> </text>
                                </div>
                            </div>

                            <div className='row' style={{ marginTop: "20px" }}>
                                <div className={"col-lg-4 col-md-12"}>
                                    <label className='login_label'>Name<span className="required_star">*</span> </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <FaRegUser />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className='input_box'
                                            placeholder="First Name"
                                            maxLength={30}
                                            value={name}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                {(userCategory != null && nriFlag === false) &&
                                    <div className={ "col-lg-4 col-md-12"}>
                                        <label className='login_label'>User Category<span className="required_star">*</span> </label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                <FaRegUser />
                                            </div>
                                            <input
                                                type="text"
                                                readOnly
                                                disabled
                                                id="name"
                                                name="name"
                                                className='input_box'
                                                placeholder="User Category"
                                                value={userCategory}
                                            />
                                        </div>
                                    </div>
                                }
                                {/* <div className={nriFlag ? "col-lg-4 col-md-12" : "col-lg-3 col-md-12"}>
                                    <div className='input_container'>
                                        <label className='login_label'>Status of Applicant <span className="required">*</span></label>
                                        <div className='input_contanier' >
                                            <Select styles={customStyles}
                                                id="statusofapplicant"
                                                placeholder="Select User Type"
                                                value={selectedUserType}
                                                isDisabled
                                            />

                                        </div>
                                    </div>
                                </div> */}
                                <div className={"col-lg-4 col-md-12"}>
                                    <label className='login_label'>Email Address<span className="required_star">*</span>  </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <RiMailLine />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className='input_box'
                                            placeholder="Email"
                                            value={email}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <label className='login_label'>Mobile Number <span className="required_star">*</span>  </label>
                                    <div className='phone_input_container'>
                                        <PhoneInput
                                            countryCodeEditable={false}
                                            value={countryCode + mobileNo}
                                            onlyCountries={['us', 'in']}
                                            style={{ width: "100%", height: "43px" }}
                                            disabled
                                            disableDropdown={true}
                                        />
                                    </div>
                                </div>
                                <div className={"col-lg-4 col-md-12"}>
                                    <label className='login_label'>Date of Birth <span className="required_star">*</span>  </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <CiCalendarDate />
                                        </div>
                                        <input
                                            type="date"
                                            id="dob"
                                            name="dob"
                                            disabled
                                            readOnly
                                            className='input_box'
                                            onKeyDown={(event) => {
                                                event.preventDefault();
                                            }}
                                            value={dob}

                                        />

                                    </div>
                                </div>
                                <div className={"col-lg-4 col-md-12"}>
                                    <label className='login_label'>PAN Number {nriFlag === false ? <span className="required_star">*</span> : <></>}  </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <FaRegAddressCard />
                                        </div>
                                        <input
                                            type="text"
                                            id="pan"
                                            name="pan"
                                            className='input_box'
                                            placeholder="PAN Number"
                                            disabled
                                            value={maskedPanNo}
                                            readOnly
                                            maxLength={10}
                                            style={{ pointerEvents: kycver === true ? "none" : "auto" }}
                                        />
                                    </div>
                                </div>
                                <div className={"col-lg-4 col-md-12"}>
                                    <label className='login_label'>Aadhaar Number {nriFlag === false ? <span className="required_star">*</span> : <></>}  </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <FaRegAddressCard />
                                        </div>
                                        <input
                                            id="aadhaar"
                                            type="tel"
                                            name="aadhaar"
                                            className='input_box'
                                            placeholder="Aadhaar Number"
                                            maxLength={12}
                                            disabled
                                            readOnly
                                            value={maskedAadhaarNo}
                                            style={{ pointerEvents: kycver === true ? "none" : "auto" }}
                                        />
                                    </div>
                                </div>
                                {nriFlag === true &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Passport Number <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                <FaRegAddressCard />
                                            </div>
                                            <input
                                                type="text"
                                                id="pan"
                                                name="pan"
                                                disabled
                                                className='input_box'
                                                placeholder="Passport Number"
                                                value={passportNo}
                                                readOnly
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>
                                }
                                {nriFlag === true &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Country of residence <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                <FaRegAddressCard />
                                            </div>
                                            <input
                                                id="countryOfResidence"
                                                type="text"
                                                className='input_box'
                                                disabled
                                                placeholder="Country of residence"
                                                readOnly
                                                value={countryOfResidence}
                                            />
                                        </div>
                                    </div>
                                }
                                {nriFlag === true &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Nationality <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                <FaRegAddressCard />
                                            </div>
                                            <Select
                                                styles={customStyles}
                                                placeholder="Select Nationality"
                                                value={nationality}
                                                disabled
                                                isDisabled
                                            />
                                        </div>
                                    </div>
                                }

                            </div>
                            <div className='row'>
                                <div className="col-lg-6 col-md-12">
                                    <label className='login_label'>Permanent Address<span className="required_star">*</span></label>
                                    <div className='input_contanier'>
                                        <input
                                            type="text"
                                            id="addressLine1"
                                            name="addressLine1"
                                            className='inputsf'
                                            placeholder="Permanent Address"
                                            value={addressLine1}
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                    <div className='row'>
                                        <div className="col-lg-6 col-md-12">
                                            <label className='login_label'>City<span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <input
                                                    type="text"
                                                    id="city1"
                                                    name="city1"
                                                    className='inputsf'
                                                    placeholder="City"
                                                    value={city1}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <label className='login_label'>State<span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <input
                                                    type="text"
                                                    id="state1"
                                                    name="state1"
                                                    className='inputsf'
                                                    placeholder="State"
                                                    disabled
                                                    value={state1}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-lg-6 col-md-6">
                                            <label className='login_label'>Country<span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <Select
                                                    styles={customStyles}
                                                    options={countryOptions}
                                                    placeholder="Select Country"
                                                    value={country1}
                                                    disabled
                                                    isDisabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <label className='login_label'>Postal Code<span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <input
                                                    type="tel"
                                                    id="pincode1"
                                                    name="pincode1"
                                                    className='inputsf'
                                                    placeholder="Postal Code"
                                                    disabled
                                                    value={pincode1}
                                                    maxLength={country1.value === "INDIA" ? 6 : 5}
                                                    readOnly

                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: 'row' }}>
                                        <label className='login_label'>Address for correspondence<span className="required_star">*</span>
                                        </label>
                                        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                            <input type="checkbox" disabled id="agreeCheckbox" checked={sameAsCorrespondence} />
                                            <label style={{ paddingLeft: "5px", fontWeight: "bold" }}> Same as Permanent Address
                                            </label>
                                        </div>
                                    </div>
                                    <div className='input_contanier'>
                                        <input
                                            type="text"
                                            id="addressLine11"
                                            name="addressLine11"
                                            className='inputsf'
                                            placeholder="Address for correspondence"
                                            disabled={sameAsCorrespondence}
                                            value={addressLine11}
                                            readOnly
                                        />
                                    </div>
                                    <div className='row'>
                                        <div className="col-lg-6 col-md-6">
                                            <label className='login_label'>City <span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <input
                                                    type="text"
                                                    id="city2"
                                                    name="city2"
                                                    className='inputsf'
                                                    placeholder="City"
                                                    disabled={sameAsCorrespondence}
                                                    value={city2}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <label className='login_label'>State <span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <input
                                                    type="text"
                                                    id="state2"
                                                    name="state2"
                                                    className='inputsf'
                                                    placeholder="State"
                                                    value={state2}
                                                    readOnly
                                                    disabled={sameAsCorrespondence}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-lg-6 col-md-6">
                                            <label className='login_label'>Country<span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <Select
                                                    styles={customStyles}
                                                    options={countryOptions}
                                                    placeholder="Select Country"
                                                    value={country2}
                                                    isDisabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <label className='login_label'>Postal Code<span className="required_star">*</span></label>
                                            <div className='input_contanier_address'>
                                                <input
                                                    type="tel"
                                                    id="pincode2"
                                                    name="pincode2"
                                                    className='inputsf'
                                                    placeholder="Postal Code"
                                                    value={pincode2}
                                                    readOnly
                                                    disabled={sameAsCorrespondence}
                                                    maxLength={country2.value === "INDIA" ? 6 : 5}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                {nriFlag === false &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Upload PAN <span className="required_star">*</span>   </label>
                                        <div className='input_contanier'>
                                            <input
                                                type='file'
                                                id="uploadPan"
                                                name="uploadPan"
                                                className='input_box'
                                                style={{ paddingLeft: "6px" }}
                                                accept='.jpg,.png,.pdf'
                                                disabled
                                            />
                                            <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                            <div>
                                                {/* {userPanImg &&
                                                    <img src={userPanImg} alt='' onClick={() => setUserPanImgShow(true)} className='img_preview' />
                                                } */}
                                                {userPanImg && (
                                                    (userPanImg.startsWith("data:application/pdf") || userPanImg.endsWith(".pdf")) ? (
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <button class="preview-button"
                                                                type='button'
                                                                onClick={() => initializeLightGallery(userPanImg)}
                                                            >
                                                                <div class="docs">
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        width="20"
                                                                        height="20"
                                                                        stroke="currentColor"
                                                                        stroke-width="2"
                                                                        fill="none"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                        class="css-i6dzq1"
                                                                    >
                                                                        <path
                                                                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                                                        ></path>
                                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                        <polyline points="10 9 9 9 8 9"></polyline>
                                                                    </svg>
                                                                    Preview
                                                                </div>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            alt=""
                                                            onClick={() => setUserPanImgShow(true)}
                                                            src={userPanImg}
                                                            className='img_preview'
                                                        />
                                                    )
                                                )}
                                                {userPanImgShow && (
                                                    <Lightbox
                                                        mainSrc={userPanImg}
                                                        onCloseRequest={() => setUserPanImgShow(false)}
                                                        onImageLoad={() => {
                                                            window.dispatchEvent(new Event('resize'));
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {nriFlag === true &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Upload Passport <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <input
                                                type='file'
                                                id="uploadPan"
                                                name="uploadPan"
                                                className='input_box'
                                                style={{ paddingLeft: "6px" }}
                                                accept='.jpg,.png,.pdf'
                                                disabled
                                            />
                                            <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                            <div>
                                                {/* {passportPreviewImg &&
                                                    <img src={passportPreviewImg} alt='' className='img_preview' onClick={() => setUserPassportShow(true)} />
                                                } */}
                                                {passportPreviewImg && (
                                                    (passportPreviewImg.startsWith("data:application/pdf") || passportPreviewImg.endsWith(".pdf")) ? (
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <button class="preview-button"
                                                                type='button'
                                                                onClick={() => initializeLightGallery(passportPreviewImg)}
                                                            >
                                                                <div class="docs">
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        width="20"
                                                                        height="20"
                                                                        stroke="currentColor"
                                                                        stroke-width="2"
                                                                        fill="none"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                        class="css-i6dzq1"
                                                                    >
                                                                        <path
                                                                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                                                        ></path>
                                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                        <polyline points="10 9 9 9 8 9"></polyline>
                                                                    </svg>
                                                                    Preview
                                                                </div>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            alt=""
                                                            onClick={() => setUserPassportShow(true)}
                                                            src={passportPreviewImg}
                                                            className='img_preview'
                                                        />
                                                    )
                                                )}
                                            </div>
                                            {userPassportShow && (
                                                <Lightbox
                                                    mainSrc={passportPreviewImg}
                                                    onCloseRequest={() => setUserPassportShow(false)}
                                                    onImageLoad={() => {
                                                        window.dispatchEvent(new Event('resize'));
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                }
                                <div className="col-lg-4 col-md-12">
                                    <label className='login_label'>Upload Address Proof <span style={{ fontSize: '10px' }}>  {nriFlag === true ? '( Utility Invoices /  Driver\'s License )' : '( Aadhaar / Driver\'s License )'}</span>   <span className="required_star">*</span>  </label>
                                    <div className='input_contanier'>
                                        <input
                                            type='file'
                                            id="uploadAadhaar"
                                            name="uploadAadhaar"
                                            className='input_box'
                                            style={{ paddingLeft: "6px" }}
                                            accept='.jpg,.png,.pdf'
                                            disabled
                                        />
                                        <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                        <div>
                                            {/* {userAadhaarImg &&
                                                <img src={userAadhaarImg} alt='' onClick={() => setUserAadhaarImgShow(true)} className='img_preview' />
                                            } */}
                                            {userAadhaarImg && (
                                                (userAadhaarImg.startsWith("data:application/pdf") || userAadhaarImg.endsWith(".pdf")) ? (
                                                    <div style={{ width: "100%", height: "100%" }}>
                                                        <button class="preview-button"
                                                            type='button'
                                                            onClick={() => initializeLightGallery(userAadhaarImg)}
                                                        >
                                                            <div class="docs">
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    width="20"
                                                                    height="20"
                                                                    stroke="currentColor"
                                                                    stroke-width="2"
                                                                    fill="none"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    class="css-i6dzq1"
                                                                >
                                                                    <path
                                                                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                                                    ></path>
                                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                    <polyline points="10 9 9 9 8 9"></polyline>
                                                                </svg>
                                                                Preview
                                                            </div>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <img
                                                        alt=""
                                                        onClick={() => setUserAadhaarImgShow(true)}
                                                        src={userAadhaarImg}
                                                        className='img_preview'
                                                    />
                                                )
                                            )}
                                            {userAadhaarImgShow && (
                                                <Lightbox
                                                    mainSrc={userAadhaarImg}
                                                    onCloseRequest={() => setUserAadhaarImgShow(false)}
                                                    onImageLoad={() => {
                                                        window.dispatchEvent(new Event('resize'));
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <label className='login_label'>Upload Profile Photo
                                        {/* <span
                                            onClick={() => null}
                                            style={{
                                                color: 'blue',
                                                cursor: 'not-allowed'
                                            }}
                                            readOnly
                                        >
                                            Click Camera
                                        </span> */}
                                        <span className="required_star">*</span> </label>
                                    <div className='input_contanier'>
                                        <input
                                            type='file'
                                            id="uploadProfilePhoto"
                                            name="uploadProfilePhoto"
                                            className='input_box'
                                            style={{ paddingLeft: "6px" }}
                                            accept='.jpg,.png,.pdf'
                                            disabled
                                        />
                                        <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                        <div>
                                            {/* {(webCamImgSrc) &&
                                                <div>
                                                    <img alt='' onClick={() => setUserProfileImgShow(true)} src={webCamImgSrc} className='img_preview' />
                                                </div>
                                            } */}
                                        </div>
                                        <div>
                                            {/* {profileImgUpload &&
                                                <img alt='' src={profileImgUpload} className='img_preview' />
                                            } */}
                                            {webCamImgSrc && (
                                                (webCamImgSrc.startsWith("data:application/pdf") || webCamImgSrc.endsWith(".pdf")) ? (
                                                    <div style={{ width: "100%", height: "100%" }}>
                                                        <button class="preview-button"
                                                            type='button'
                                                            onClick={() => initializeLightGallery(webCamImgSrc)}
                                                        >
                                                            <div class="docs">
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    width="20"
                                                                    height="20"
                                                                    stroke="currentColor"
                                                                    stroke-width="2"
                                                                    fill="none"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    class="css-i6dzq1"
                                                                >
                                                                    <path
                                                                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                                                    ></path>
                                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                    <polyline points="10 9 9 9 8 9"></polyline>
                                                                </svg>
                                                                Preview
                                                            </div>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <img
                                                        alt=""
                                                        onClick={() => setUserProfileImgShow(true)}
                                                        src={webCamImgSrc}
                                                        className='img_preview'
                                                    />
                                                )
                                            )}
                                        </div>
                                        {userProfileImgShow && (
                                            <Lightbox
                                                mainSrc={webCamImgSrc}
                                                onCloseRequest={() => setUserProfileImgShow(false)}
                                                onImageLoad={() => {
                                                    window.dispatchEvent(new Event('resize'));
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                {nriFlag === true &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Are You OCI ? <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <div style={{ gap: "10px", display: "flex" }}>
                                                <input
                                                    type="radio"
                                                    id="yes"
                                                    name="ociFlag"
                                                    disabled
                                                    checked={ociYesFlag === true}
                                                />
                                                <label>Yes</label>
                                                <input
                                                    type="radio"
                                                    id="no"
                                                    name="ociFlag"
                                                    checked={ociYesFlag === false}
                                                    disabled
                                                />
                                                <label>No</label>
                                            </div>
                                        </div>

                                    </div>
                                }
                                {ociYesFlag === true &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>OCI Number <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                <FaRegAddressCard />
                                            </div>
                                            <input
                                                type="text"
                                                className='input_box'
                                                placeholder="OCI Number"
                                                readOnly
                                                value={ociCardNo}
                                            />
                                        </div>
                                    </div>
                                }
                                {ociYesFlag === true &&
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Upload OCI Card <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <input
                                                type='file'
                                                id="uploadPan"
                                                name="uploadPan"
                                                className='input_box'
                                                style={{ paddingLeft: "6px" }}
                                                accept='.jpg,.png,.pdf'
                                                disabled
                                            />
                                            <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                            <div>
                                                {/* {ociCardPreviewImg &&
                                                    <img src={ociCardPreviewImg} alt='' className='img_preview' onClick={() => setUserOciCardShow(true)} />
                                                } */}
                                                {ociCardPreviewImg && (
                                                    (ociCardPreviewImg.startsWith("data:application/pdf") || ociCardPreviewImg.endsWith(".pdf")) ? (
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <button class="preview-button"
                                                                type='button'
                                                                onClick={() => initializeLightGallery(ociCardPreviewImg)}
                                                            >
                                                                <div class="docs">
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        width="20"
                                                                        height="20"
                                                                        stroke="currentColor"
                                                                        stroke-width="2"
                                                                        fill="none"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                        class="css-i6dzq1"
                                                                    >
                                                                        <path
                                                                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                                                        ></path>
                                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                        <polyline points="10 9 9 9 8 9"></polyline>
                                                                    </svg>
                                                                    Preview
                                                                </div>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            alt=""
                                                            onClick={() => setUserOciCardShow(true)}
                                                            src={ociCardPreviewImg}
                                                            className='img_preview'
                                                        />
                                                    )
                                                )}
                                            </div>
                                            {userOciCardShow && (
                                                <Lightbox
                                                    mainSrc={ociCardPreviewImg}
                                                    onCloseRequest={() => setUserOciCardShow(false)}
                                                    onImageLoad={() => {
                                                        window.dispatchEvent(new Event('resize'));
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                            {(nriFlag === false && userCategory === "MINOR") && (
                                <>

                                    <div className='col-12 col-md-12'>
                                        <span className="dottedlines"></span>
                                    </div>
                                    <div className='col-12 col-md-6'>
                                        <text className="welcome_text">Guardian Details</text>
                                    </div>
                                    {/* Guardian Details for RI  */}
                                    <div className='row' style={{ marginTop: "20px" }}>
                                        <div className="col-lg-3 col-md-12">
                                            <label className='login_label'>Guardian Name <span className="required_star">*</span> </label>
                                            <div className='input_contanier'>
                                                <div className="input_icons">
                                                    <FaRegUser />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="guardianName"
                                                    name="guardianName"
                                                    className='input_box'
                                                    placeholder="Enter Guardian Name"
                                                    maxLength={40}
                                                    value={guardianName}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-12 mobile_container">
                                            <label className='login_label'>Guardian Date of Birth <span className="required_star">*</span>  </label>
                                            <div className='input_contanier'>
                                                <div className="input_icons">
                                                    <CiCalendarDate />
                                                </div>
                                                <input
                                                    type="date"
                                                    id="guardianName"
                                                    name="guardianName"
                                                    className='input_box'
                                                    placeholder="Enter Guardian Name"
                                                    maxLength={40}
                                                    value={guardianDob}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-12">
                                            <label className='login_label'>Guardian Relation<span className="required_star">*</span> </label>
                                            <div className='input_contanier'>
                                                <div className="input_icons">
                                                    <FaRegUser />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="guardianRelation"
                                                    name="guardianRelation"
                                                    className='input_box'
                                                    placeholder="Enter Guardian Relation"
                                                    maxLength={40}
                                                    value={guardianRelation}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-12">
                                            <label className='login_label'>Guardian PAN Number <span className="required_star">*</span> </label>
                                            <div className='input_contanier'>
                                                <div className="input_icons">
                                                    <FaRegAddressCard />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="guardianPan"
                                                    name="guardianPan"
                                                    className='input_box'
                                                    placeholder="Enter Guardian PAN Number"
                                                    readOnly
                                                    disabled
                                                    maxLength={10}
                                                    value={guardianPan}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12">
                                            <label className='login_label'>Guardian Aadhaar Number  <span className="required_star">*</span>  </label>
                                            <div className='input_contanier'>
                                                <div className="input_icons">
                                                    <FaRegAddressCard />
                                                </div>
                                                <input
                                                    id="guardianAadhaar"
                                                    type="tel"
                                                    name="guardianAadhaar"
                                                    className='input_box'
                                                    placeholder="Enter Guardian Aadhaar Number"
                                                    maxLength={12}
                                                    readOnly
                                                    disabled
                                                    value={guardianAadhaar}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12">
                                            <label className='login_label'>Upload Guardian PAN <span className="required_star">*</span>   </label>
                                            <div className='input_contanier'>
                                                <div>
                                                    {/* {guardianPanImg &&
                                                        <img src={guardianPanImg} alt='' onClick={() => setguardianPanImgShow(true)} className='img_preview' />
                                                    } */}
                                                    {guardianPanImg && (
                                                        (guardianPanImg.startsWith("data:application/pdf") || guardianPanImg.endsWith(".pdf")) ? (
                                                            <div style={{ width: "100%", height: "100%" }}>
                                                                <button class="preview-button"
                                                                    type='button'
                                                                    onClick={() => initializeLightGallery(guardianPanImg)}
                                                                >
                                                                    <div class="docs">
                                                                        <svg
                                                                            viewBox="0 0 24 24"
                                                                            width="20"
                                                                            height="20"
                                                                            stroke="currentColor"
                                                                            stroke-width="2"
                                                                            fill="none"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            class="css-i6dzq1"
                                                                        >
                                                                            <path
                                                                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                                                            ></path>
                                                                            <polyline points="14 2 14 8 20 8"></polyline>
                                                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                            <polyline points="10 9 9 9 8 9"></polyline>
                                                                        </svg>
                                                                        Preview
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                alt=""
                                                                onClick={() => setguardianPanImgShow(true)}
                                                                src={guardianPanImg}
                                                                className='img_preview'
                                                            />
                                                        )
                                                    )}
                                                    {guardianPanImgShow && (
                                                        <Lightbox
                                                            mainSrc={guardianPanImg}
                                                            onCloseRequest={() => setguardianPanImgShow(false)}
                                                            onImageLoad={() => {
                                                                window.dispatchEvent(new Event('resize'));
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12">
                                            <label className='login_label'>Upload Guardian Aadhaar <span className="required_star">*</span>   </label>
                                            <div className='input_contanier'>
                                                <div>
                                                    {/* {guardianAadhaarImg &&
                                                        <img src={guardianAadhaarImg} alt='' className='img_preview' />
                                                    } */}
                                                    {guardianAadhaarImg && (
                                                        (guardianAadhaarImg.startsWith("data:application/pdf") || guardianAadhaarImg.endsWith(".pdf")) ? (
                                                            <div style={{ width: "100%", height: "100%" }}>
                                                                <button class="preview-button"
                                                                    type='button'
                                                                    onClick={() => initializeLightGallery(guardianAadhaarImg)}
                                                                >
                                                                    <div class="docs">
                                                                        <svg
                                                                            viewBox="0 0 24 24"
                                                                            width="20"
                                                                            height="20"
                                                                            stroke="currentColor"
                                                                            stroke-width="2"
                                                                            fill="none"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            class="css-i6dzq1"
                                                                        >
                                                                            <path
                                                                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                                                            ></path>
                                                                            <polyline points="14 2 14 8 20 8"></polyline>
                                                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                                                            <polyline points="10 9 9 9 8 9"></polyline>
                                                                        </svg>
                                                                        Preview
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                alt=""
                                                                onClick={() => setUserAadhaarImgShow(true)}
                                                                src={guardianAadhaarImg}
                                                                className='img_preview'
                                                            />
                                                        )
                                                    )}
                                                    {/* {guardianAadhaarImgShow && (
                                                            <Lightbox
                                                                mainSrc={guardianAadhaarImg}
                                                                onCloseRequest={() => setUserAadhaarImgShow(false)}
                                                                onImageLoad={() => {
                                                                    window.dispatchEvent(new Event('resize'));
                                                                }}
                                                            />
                                                        )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="col-lg-4 col-md-12">
                                <label className='login_label'>Status <span className="required_star">*</span></label>
                                <Select
                                    value={selectedActiveflag}
                                    options={options}
                                    placeholder="Select Status"
                                    onChange={handleStatusChange}
                                />
                            </div>
                            {/* <div className='login_label centered_check'>
                                <input type="checkbox" id="iagree"
                                    checked={checkFlag}
                                    disabled
                                />
                                <label style={{ paddingLeft: "5px" }}>I agree to the Terms and Conditions <span style={{ color: 'blue', cursor: "pointer" }} onClick={() => null}> (Click Here for T&C) <span className="required_star">*</span></span>
                                </label>
                            </div> */}
                            <div className='col-12  login_btn_container cenAlig' >
                                <button type='button' className="col-lg-3 register_btn" onClick={handleactivevalidation}>Submit</button>
                            </div>

                        </div>
                    </div>
                </div>
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
                    onClose={alertClose}
                />
            )}
            {showYesorNoAlert && (
                <Alert
                    title={"Confirmation"}
                    msg={alertYesorNoMessage}
                    open={true}
                    type={"yesorno"}
                    onClose={handleYesorNo}
                    onConfirm={handleactive}
                />
            )}
        </div>
    )
}

export default ViewUserByadmin