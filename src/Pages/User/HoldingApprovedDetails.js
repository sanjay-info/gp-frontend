import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../components/AppProvider';
import Alert from '../components/Alert';
import { gp_logo } from '../components/imageUrl';
import { useLocation } from "react-router-dom";
import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useSidebar } from "../components/SidebarContext";
import Lightbox from 'react-image-lightbox';
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from 'react-icons/ai';
import moment from "moment";
import { initializeLightGallery } from '../components/lightGalleryInitializer';


const HoldingApprovedDetails = () => {

    const location = useLocation();
    const id = location.state.id;

    const { sideBarCollapse } = useSidebar();

    const { PostApi } = useAppContext()

    const navigate = useNavigate()

    const [bondId, setBondId] = useState("");
    const [bankName, setBankName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [firstApplicant, setFirstApplicant] = useState("");
    const [address, setAddress] = useState("");
    const [occupation, setOccupation] = useState("");
    const [panCard, setPanCard] = useState("");
    const [passport, setPassport] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [status, setStatus] = useState("");
    const [dob, setDob] = useState("");
    const [noOfUnits, setNoOfUnits] = useState('');
    const [detailsofNomine, setDetailsofNomine] = useState("");
    const [nomineePan, setNomineePan] = useState("");
    const [detailsecoundapplicant, setDetailsecoundapplicant] = useState("");
    const [pannumbersecondappli, setpannumbersecondappli] = useState("");
    const [detailthirdapplicant, setDetailthirdapplicant] = useState("");
    const [pannumberthirdappli, setpannumberthirdappli] = useState("");

    const [userType, setUserType] = useState("");

    const [unitsInWords, setUnitsInWords] = useState('');
    const [amountInWords, setAmountInWords] = useState('')

    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    const shareFormatter = new Intl.NumberFormat('en-IN')

    const [accountNo, setAccountNo] = useState("");
    const [applicantStatus, setApplicantStatus] = useState(false);
    const [nomineeStatus, setNomineeStatus] = useState(false);

    const [nomineePassport, setNomineePassport] = useState("");
    const [passportnumberthirdappli, setPassportnumberthirdappli] = useState("");
    const [passportnumbersecondappli, setPassportnumbersecondappli] = useState("");

    const [applicantNotVerified, setApplicantNotVerified] = useState(false);
    const [nomineeNotVerified, setNomineeNotVerified] = useState(false);
    const [applicantNotVerifiedRemarks, setApplicantNotVerifiedRemarks] = useState("");
    const [nomineeNotVerifiedRemarks, setNomineeNotVerifiedRemarks] = useState("")
    const [modeofPayment, setModeofPayment] = useState("");
    const [utr, setUtr] = useState("");
    const [accountInfoDate, setAccountInfoDate] = useState("");
    const [clientscheme, setClientscheme] = useState("");

    const [relation, setRelation] = useState('');

    const [amount, setAmount] = useState("");

    const [verifiedFlag, setVerifiedFlag] = useState(false)

    const [remarkList, setRemarkList] = useState([])
    const [remarkModal, setRemarkModal] = useState(false)

    const [firstSignImgPreview, setfirstSignImgPreview] = useState(null);
    const [firstSignImgView, setfirstSignView] = useState(false);

    const [secondSignImgPreview, setSecondSignImgImgPreview] = useState(null);
    const [secondSignImgView, setSecondSignImgView] = useState(false);

    const [thirdSignImgPreview, setThirdSignImgImgPreview] = useState(null);
    const [thirdSignImgView, setThirdSignImgView] = useState(false);

    const [decImgPreview, setdecImgImgPreview] = useState(null);
    const [decImgView, setdecImgView] = useState(false);

    const [swiftUploadImageview, setSwiftUploadImageview] = useState(false);

    const [chequeUploadImgPreview, setChequeUploadImgPreview] = useState(null);
    const [chequeUploadView, setChequeUploadView] = useState(false);

    const [nomineeImgView, setNomineeImngView] = useState(false);
    const [nomineeUploadImgPreview, setNomineeUploadImgPreview] = useState(null);

    const [nomineeUploadPanImgView, setNomineeUploadPanImgView] = useState(false);
    const [nomineeUploadPassportImgView, setNomineeUploadPassportImgView] = useState(false);

    const [nomineeUploadPanImgPreview, setNomineeUploadPanImgPreview] = useState(null);

    const [secondnomineeUploadProfileImgPreview, setSecondNomineeUploadProfileImgPreview] = useState(null);
    const [secondnomineeUploadProfileImgView, setSecondnomineeUploadProfileImgView] = useState(false);

    const [secondnomineeUploadPanImgPreview, setSecondNomineeUploadPanImgPreview] = useState(null);
    const [secondApplicantPanView, setSecondApplicantPanView] = useState(false);
    const [secondApplicantPassportView, setSecondApplicantPassportView] = useState(false);


    const [thirdnomineeUploadProfileImgPreview, setThirdNomineeUploadProfileImgPreview] = useState(null);
    const [thirdnomineeUploadProfileImgView, setThirdNomineeUploadProfileImgView] = useState(false);

    const [thirdnomineeUploadPanImgPreview, setThirdNomineeUploadPanImgPreview] = useState(null);
    const [thirdnomineeUploadPanImgView, setThirdNomineeUploadPanImgView] = useState(false);

    const [nomineeUploadPassPortImgPreview, setNomineeUploadPassPortImgPreview] = useState(null);
    const [nomineeUploadPassPortImgView, setNomineeUploadPassPortImgView] = useState(false);

    const [secondnomineeUploadPassPortImgPreview, setSecondNomineeUploadPassPortImgPreview] = useState(null);

    const [thirdnomineeUploadPassPortImgPreview, setThirdNomineeUploadPassPortImgPreview] = useState(null);

    const [selectedthirdApplicantNationality, setSelectedThirdApplicantNationality] = useState("");
    const [selectedsecondApplicantNationality, setSelectedSecondApplicantNationality] = useState("");


    const [ibankCode, setIbankCode] = useState("");
    const [remittanceThroughBank, setremittanceThroughBank] = useState("");

    const [accountType, setAccountType] = useState("")

    const [selectedCountryType, setSelectedCountryType] = useState("");

    const [selectedCurrency, setSelectedCurrency] = useState("");

    const [selectedNationality, setSelectedNationality] = useState("");
    const [nomineeType, setNomineeType] = useState("");

    const [swiftadviceImgPreview, setswiftadviceImgPreview] = useState(null);

    const [relationshipnominee, setRelationshipnominee] = useState("");
    const [nomineeguarname, setNomineeguarname] = useState("");
    const [nomineeDob, setNomineeDob] = useState("");

    const [token] = useState(localStorage.getItem("token"));
    const [userId] = useState(localStorage.getItem("user_id"))

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        ViewDocuments();
    }, []);


    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%'
    };

    const cellStyle = {
        border: '1px solid black',
        padding: '3px',
        textAlign: 'left',
    };

    const cellStyleforPrice = {
        border: '1px solid black',
        padding: '3px',
        textAlign: 'right',
    };

    const headerCellStyle = {
        ...cellStyle,
        fontWeight: 'normal',
        textAlign: 'center',

    };

    const ViewDocuments = () => {
        const method = 'POST';
        const url = `/userbond/id?id=${id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "viewbond")
                setBondId(response.data.data.investorType.id)
                setFirstApplicant(response.data.data.name);
                setAddress(response.data.data.address);
                setOccupation(response.data.data.occupation);
                setPanCard(response.data.data.pan);
                setPassport(response.data.data.passportNo);
                setFatherName(response.data.data.fatherName);
                setStatus(response.data.data.status);
                setDetailsofNomine(response.data.data.nomineeDetails);
                setNomineePan(response.data.data.nomineePan);
                setBankName(response.data.data.bankName);
                setBranchName(response.data.data.branchName);
                setIbankCode(response.data.data.ibanCode);
                setIfscCode(response.data.data.ifscCode);
                setAmount(response.data.data.amount);
                setDetailsecoundapplicant(response.data.data.secondApplicant);
                setpannumbersecondappli(response.data.data.secondApplicantPan);
                setDetailthirdapplicant(response.data.data.thirdApplicant);
                setpannumberthirdappli(response.data.data.thirdApplicantPan);
                setAccountNo(response.data.data.accountNo);
                setUtr(response.data.data.userTransactionNo);
                setAccountInfoDate(response.data.data.userPayDate);
                setModeofPayment(response.data.data.modeOfPayment);
                setDob(response.data.data.dateOfBirth);
                setNoOfUnits(response.data.data.noOfUnits);
                setRelation(response.data.data.relation)
                setModeofPayment(response.data.data.modeOfPayment);
                setNomineePassport(response.data.data.modeOfPayment);
                setUnitsInWords(response.data.data.sharesAppliedWords)
                setAmountInWords(response.data.data.amountPaidWords)
                setAccountType(response.data.data.accountType);
                setSelectedNationality(response.data.data.nomineeNationality)
                setNomineeType(response.data.data.nomineeType)
                setSelectedSecondApplicantNationality(response.data.data.secondApplicantNationality)
                setSelectedThirdApplicantNationality(response.data.data.thirdApplicantNationality)
                setSelectedCurrency(response.data.data.currencyOfTransfer);
                setSelectedCountryType(response.data.data.countryOfRemittance);
                setNomineePassport(response.data.data.nomineePassportNo)
                setremittanceThroughBank(response.data.data.remittanceBank)
                setPassportnumbersecondappli(response.data.data.secondApplicantPassport)
                setPassportnumberthirdappli(response.data.data.thirdApplicantPassport)
                setUserType(response.data.data.userType);
                setClientscheme(response.data.data.clientBondDetails.id)

                setRelationshipnominee(response.data.data.guardianRelationship)
                setNomineeDob(response.data.data.nomineeDateOfBirth)
                setNomineeguarname(response.data.data.guardianName)


                if (response.data.data.firstApplicantSign !== null) {
                    // const firstsingImageUrl = base64ToImageUrl(response.data.data.firstApplicantSign);
                    setfirstSignImgPreview(response.data.data.firstApplicantSign);
                }
                else {
                    setfirstSignImgPreview(null);
                }

                // const secondSignImg = base64ToImageUrl(response.data.data.secondApplicantSign);
                setSecondSignImgImgPreview(response.data.data.secondApplicantSign);

                // const thirdSignImg = base64ToImageUrl(response.data.data.thirdApplicantSign);
                setThirdSignImgImgPreview(response.data.data.thirdApplicantSign);

                // const chequeUpload = base64ToImageUrl(response.data.data.cancelChequeImg);
                setChequeUploadImgPreview(response.data.data.cancelChequeImg);

                if (response.data.data.swiftImg !== null) {
                    // const swiftUpload = base64ToImageUrl(response.data.data.swiftImg);
                    setswiftadviceImgPreview(response.data.data.swiftImg);
                }
                else {
                    setswiftadviceImgPreview(null);
                }

                if (response.data.data.nomineePanImg !== null) {
                    // const nomineeProfileImg = base64ToImageUrl(response.data.data.nomineePanImg);
                    setNomineeUploadPanImgPreview(response.data.data.nomineePanImg);
                }
                else {
                    setNomineeUploadPanImgPreview(null);
                }
                if (response.data.data.nomineePassportImg !== null) {
                    // const nomineePassportImage = base64ToImageUrl(response.data.data.nomineePassportImage);
                    setNomineeUploadPassPortImgPreview(response.data.data.nomineePassportImg);
                }
                else {
                    setNomineeUploadPassPortImgPreview(null);
                }
                if (response.data.data.nomineeProfileImg !== null) {
                    // const nomineeProfileImg = base64ToImageUrl(response.data.data.nomineeProfileImg);
                    setNomineeUploadImgPreview(response.data.data.nomineeProfileImg);
                }
                else {
                    setNomineeUploadImgPreview(null);
                }


                if (response.data.data.secondApplicantPanImg !== null) {
                    // const secondNomineePanImg = base64ToImageUrl(response.data.data.secondApplicantPanImg);
                    setSecondNomineeUploadPanImgPreview(response.data.data.secondApplicantPanImg);
                }
                else {
                    setSecondNomineeUploadPanImgPreview(null);
                }

                if (response.data.data.secondApplicantProfileImg !== null) {
                    // const secondNomineeProfileImg = base64ToImageUrl(response.data.data.secondApplicantProfileImg);
                    setSecondNomineeUploadProfileImgPreview(response.data.data.secondApplicantProfileImg);

                }
                else {
                    setSecondNomineeUploadProfileImgPreview(null);
                }
                if (response.data.data.secondApplicantPassportImg !== null) {
                    // const secondApplicantPassportImg = base64ToImageUrl(response.data.data.secondApplicantPassportImg);
                    setSecondNomineeUploadPassPortImgPreview(response.data.data.secondApplicantPassportImg);
                }
                else {
                    setSecondNomineeUploadPassPortImgPreview(null);
                }
                if (response.data.data.thirdApplicantPanImg !== null) {
                    // const thirdNomineePanImg = base64ToImageUrl(response.data.data.thirdApplicantPanImg);
                    setThirdNomineeUploadPanImgPreview(response.data.data.thirdApplicantPanImg);
                }
                else {
                    setThirdNomineeUploadPanImgPreview(null);
                }

                if (response.data.data.thirdApplicantProfileImg !== null) {
                    // const thirdNomineeProfile = base64ToImageUrl(response.data.data.thirdApplicantProfileImg);
                    setThirdNomineeUploadProfileImgPreview(response.data.data.thirdApplicantProfileImg);
                }
                else {
                    setThirdNomineeUploadProfileImgPreview(null);
                }
                if (response.data.data.thirdApplicantPassportImg !== null) {
                    // const thirdApplicantPassportImg = base64ToImageUrl(response.data.data.thirdApplicantPassportImg);
                    setThirdNomineeUploadPassPortImgPreview(response.data.data.thirdApplicantPassportIm);
                }
                else {
                    setThirdNomineeUploadPassPortImgPreview(null);
                }
                if (response.data.data.applicantVerified === true && response.data.data.nomineeVerified === true) {
                    setVerifiedFlag(true)
                } else {
                    setVerifiedFlag(false)
                }

                if (response.data.data.applicantVerified === true) {
                    setApplicantStatus(true)
                    setApplicantNotVerified(false)
                }
                else if (response.data.data.applicantVerified === false) {
                    setApplicantStatus(false)
                    if (response.data.data.applicantRemarks !== null) {
                        setApplicantNotVerified(false);
                    }
                    else {
                        setApplicantNotVerified(false);
                    }
                }


                if (response.data.data.nomineeVerified === true) {
                    setNomineeStatus(true)
                    setNomineeNotVerified(false);
                }
                else if (response.data.data.nomineeVerified === false) {
                    setNomineeStatus(false)
                    if (response.data.data.nomineeRemarks !== null) {
                        setNomineeNotVerified(false);
                    }
                    else {
                        setNomineeNotVerified(false);
                    }
                }

                if (response.data.data.applicantRemarks || response.data.data.nomineeRemarks) {
                    const list = [
                        ...(response.data.data.applicantRemarks || []),
                        ...(response.data.data.nomineeRemarks || [])
                    ];
                    setRemarkList(list);
                } else {
                    setRemarkList([]);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    // ------------ Byte image converter --------

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

    return (
        <div>
            <div className="page_wrapper">
                {/* ------------ GPBond ----------- */}
                <div className='register_container'>
                    <div className='gpbond_card'>
                        <div className='logflx'>
                            <img src={gp_logo} alt='no' className='logoimg'></img>
                        </div>
                        <div>
                            <text className="gpbond_text">PRIVATE AND CONFIDENTIAL</text>
                            <text className="gpbond_text">GOLDEN PLANET SENIOR HERITAGE HOMES PRIVATE LIMITED</text>
                            <text className="gpbond_text">CIN: U41000TN2023PTC165149</text>
                            <text className="gpbond_hed">Regd Office: Ananda Nilayam,No.31/10, Arya Gowda Road, West Mambalam,Chennai,600033</text>
                            <br></br>
                            <div>
                                {clientscheme === 2 ? (
                                    <div>
                                        <p className="gpbond_text" style={{ textAlign: "center" }}>
                                            APPLICATION FOR RESIDENTS TO APPLY FOR CUMULATIVE REDEEMABLE PREFERENCE SHARES WITHOUT COUPON RATE
                                        </p>

                                    </div>
                                ) : clientscheme === 1 ? (
                                    <div>
                                        <p className="gpbond_text" style={{ textAlign: "center" }}>
                                            APPLICATION FOR RESIDENTS TO APPLY FOR CUMULATIVE REDEEMABLE PREFERENCE SHARES  WITH COUPON RATE AT 9% PER ANNUM.
                                        </p>

                                    </div>
                                ) : clientscheme === 3 ? (
                                    <div>
                                        <p className="gpbond_text" style={{ textAlign: "center" }}>
                                            APPLICATION FOR NON-RESIDENTS TO APPLY FOR COMPULSORILY CONVERTIBLE
                                            PREFERENCE SHARES  WITH A COUPON RATE AT 9% PER ANNUM.
                                        </p>


                                    </div>
                                ) : null}
                            </div>
                            <br></br>   <br></br>
                            <div className='row'>
                                <div className='col-lg'>
                                    <div className='collg-12'>
                                        <span className='bond_label'> MODE OF APPLICATION: DIRECT</span>
                                        <br></br><br></br>
                                        <span className='bond_label'> To</span>
                                        <br></br>
                                        <span className='bond_label'>The Board of Directors <br></br>
                                            Golden Planet Senior Heritage Homes Private Limited <br></br>Regd. Off: Ananda Nilayam, 31/10, Arya Gowda Road <br></br> West Mambalam, Chennai - 600033<br></br>-------------------------------------</span>
                                    </div>
                                </div>
                                <div className='col-lg'>
                                    <div className='collg-12'>
                                        <span className='bond_label'> FOR OFFICE USE ONLY</span>
                                        <br></br>
                                        <span className='bond_label'>-------------------------------------</span>
                                        <br></br>
                                        <span className='bond_label'>No.of application</span><br></br>
                                        <span className='bond_label'>Folio No. <br></br>
                                            Date of Recepit </span>
                                    </div>
                                </div>
                            </div>
                            <form className='register_form'>
                                <div>
                                    <span className='bond_label'>Dear Sirs/Madam,</span><br></br><br></br>
                                    <span className='bond_label'>I, hereby apply to you for allotment of the Cumulative Redeemable Preference shares without premium to us as stated below. The amount payable on application is shown below is remitted herewith. We hereby agree to accept the above Preference shares applied for, or such lesser number of Preference shares as may be allotted to us. We also understand that those shares will have one voting right for every Preference Shares at Class Meetings of respective shareholders. We undertake that we will sign all such other documents and do all such other acts, if any, necessary on our part to enable us to be registered as the holder(s) of the Preference shares that may be allotted to us. We authorize you to place our name on the Register of Members of the Company as holders of the Preference Shares that may be allotted to us and to register my/our address(es) as given below. We note that the Board of Directors are entitled in their absolute discretion to accept or reject this application in whole or in part without assigning any reasons whatsoever in the event, the amount paid by us is incorrect.</span>
                                </div>
                                <br></br>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className='col-lg-8'>
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={headerCellStyle}>Description</th>
                                                    <th style={headerCellStyle}>In Numbers</th>
                                                    <th style={headerCellStyle}>In Words</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={cellStyle}>No of Preference Shares applied</td>
                                                    <td style={cellStyleforPrice}>{shareFormatter.format(noOfUnits)}</td>
                                                    <td style={cellStyle}>{unitsInWords}</td>
                                                </tr>
                                                <tr>
                                                    <td style={cellStyle}>Amount paid</td>
                                                    <td style={cellStyleforPrice}>{formatter.format(amount)}</td>
                                                    <td style={cellStyle}>{amountInWords}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className='row' style={{ marginTop: "20px" }}>
                                    <div className='col-lg'>
                                        <div className='collg-12' style={{ display: 'flex', flexDirection: 'column' }} >
                                            <span className='bond_label'>
                                                Share Premium amount: Nil
                                            </span>
                                            <br>
                                            </br>

                                            <br></br><br></br>
                                            {/* JOINT */}
                                            {bondId === 2 && (
                                                <div className='col-lg-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>NAME OF SOLE/FIRST APPLICANT : </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Name"
                                                                    className='inputbond'
                                                                    value={firstApplicant}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>DATE OF BIRTH : </label>
                                                                <input
                                                                    id="dob"
                                                                    type="date"
                                                                    readOnly
                                                                    placeholder="Enter dob"
                                                                    className='inputbond'
                                                                    value={dob}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>ADDRESS : </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Address"
                                                                    className='inputbond'
                                                                    value={address}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>OCCUPATION :</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Occupation"
                                                                    className='inputbond'
                                                                    value={occupation}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        {userType === "RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>PAN NUMBER :</label>
                                                                    <input
                                                                        type="text"
                                                                        // placeholder="Enter Pan Number"
                                                                        className='inputbond'
                                                                        maxLength={10}
                                                                        value={panCard}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>PASSPORT NUMBER :</label>
                                                                    <input
                                                                        type="text"
                                                                        // placeholder="Enter Pan Number"
                                                                        className='inputbond'
                                                                        maxLength={10}
                                                                        value={passport}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>{relation}'S NAME :</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Spouse's / Father's Name"
                                                                    className='inputbond'
                                                                    value={fatherName}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>MARITAL STATUS :</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Status"
                                                                    className='inputbond'
                                                                    value={status}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className='row' style={{ marginTop: "2%" }}>
                                                        <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                                            <span>Nominee Details</span>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ marginTop: "2%" }}>
                                                        {selectedNationality !== null &&
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'> NATIONALITY OF NOMINEE :</label>
                                                                    <input
                                                                        type="text"
                                                                        className='inputbond'
                                                                        value={selectedNationality}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        {nomineeType !== null &&
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'> NOMINEE TYPE :</label>
                                                                    <input
                                                                        type="text"
                                                                        className='inputbond'
                                                                        value={nomineeType}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>NAME OF THE NOMINEE :</label>
                                                                <input
                                                                    type="text"
                                                                    className='inputbond'
                                                                    value={detailsofNomine}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        {userType === "RESIDENT INDIAN" && nomineeType === "MAJOR" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>NOMINEE'S PAN NUMBER :</label>
                                                                    <input
                                                                        type="text"
                                                                        className='inputbond'
                                                                        readOnly
                                                                        value={nomineePan}
                                                                        maxLength={10}
                                                                        onChange={(e) => setNomineePan(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "RESIDENT INDIAN" && nomineeType === "MAJOR" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>
                                                                        NOMINEE'S PAN :
                                                                    </label>

                                                                    {/* Nominee Pan */}
                                                                    {/* {nomineeUploadPanImgPreview && (
                                                                        <div>
                                                                            <img src={nomineeUploadPanImgPreview} onClick={() => setNomineeUploadPanImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                        </div>
                                                                    )} */}
                                                                    {nomineeUploadPanImgPreview && (
                                                                        (nomineeUploadPanImgPreview.startsWith("data:application/pdf") || nomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                            <div style={{ width: "100%", height: "100%" }}>
                                                                                <button class="preview-button"
                                                                                    type='button'
                                                                                    onClick={() => initializeLightGallery(nomineeUploadPanImgPreview)}
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
                                                                                onClick={() => setNomineeUploadPanImgView(true)}
                                                                                src={nomineeUploadPanImgPreview}
                                                                                className='img_preview'
                                                                            />
                                                                        )
                                                                    )}
                                                                    {nomineeUploadPanImgView && (
                                                                        <Lightbox
                                                                            mainSrc={nomineeUploadPanImgPreview}
                                                                            onCloseRequest={() => setNomineeUploadPanImgView(false)}
                                                                            onImageLoad={() => {
                                                                                window.dispatchEvent(new Event('resize'));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "RESIDENT INDIAN" && nomineeType === "MINOR" && (
                                                            <>
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>GUARDIAN RELATIONSHIP :</label>
                                                                        <input
                                                                            type="text"
                                                                            className='inputbond'
                                                                            readOnly
                                                                            value={relationshipnominee}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>GUARDIAN NAME :</label>
                                                                        <input
                                                                            type="text"
                                                                            className='inputbond'
                                                                            readOnly
                                                                            value={nomineeguarname}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>NOMINEE'S DATE OF BIRTH :</label>
                                                                        <input
                                                                            type="text"
                                                                            className='inputbond'
                                                                            readOnly
                                                                            value={nomineeDob}
                                                                            maxLength={10}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>
                                                                        {selectedNationality === "INDIAN" ? " NOMINEE'S PAN NUMBER :" : "NOMINEE'S PASSPORT NUMBER :"}
                                                                    </label>

                                                                    {selectedNationality === "INDIAN" ? (
                                                                        <input
                                                                            type="text"
                                                                            readOnly
                                                                            className='inputbond'
                                                                            value={nomineePan}
                                                                            onChange={(e) => setNomineePan(e.target.value)}
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            readOnly
                                                                            className='inputbond'
                                                                            value={nomineePassport}
                                                                            onChange={(e) => setNomineePassport(e.target.value)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>
                                                                        {selectedNationality === "INDIAN" ? "NOMINEE'S PAN :" : "NOMINEE'S PASSPORT :"}
                                                                    </label>

                                                                    {selectedNationality === "INDIAN" ? (
                                                                        <>
                                                                            {/* Nominee Pan */}
                                                                            {/* {nomineeUploadPanImgPreview && (
                                                                                <div>
                                                                                    <img src={nomineeUploadPanImgPreview} onClick={() => setNomineeUploadPanImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                                                            {nomineeUploadPanImgPreview && (
                                                                                (nomineeUploadPanImgPreview.startsWith("data:application/pdf") || nomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                                        <button class="preview-button"
                                                                                            type='button'
                                                                                            onClick={() => initializeLightGallery(nomineeUploadPanImgPreview)}
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
                                                                                        onClick={() => setNomineeUploadPanImgView(true)}
                                                                                        src={nomineeUploadPanImgPreview}
                                                                                        className='img_preview'
                                                                                    />
                                                                                )
                                                                            )}
                                                                            {nomineeUploadPanImgView && (
                                                                                <Lightbox
                                                                                    mainSrc={nomineeUploadPanImgPreview}
                                                                                    onCloseRequest={() => setNomineeUploadPanImgView(false)}
                                                                                    onImageLoad={() => {
                                                                                        window.dispatchEvent(new Event('resize'));
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {/* Nominee Passport */}
                                                                            {/* {nomineeUploadPassPortImgPreview && (
                                                                                <div>
                                                                                    <img src={nomineeUploadPassPortImgPreview} onClick={() => setNomineeUploadPassPortImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                                                            {nomineeUploadPassPortImgPreview && (
                                                                                (nomineeUploadPassPortImgPreview.startsWith("data:application/pdf") || nomineeUploadPassPortImgPreview.endsWith(".pdf")) ? (
                                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                                        <button class="preview-button"
                                                                                            type='button'
                                                                                            onClick={() => initializeLightGallery(nomineeUploadPassPortImgPreview)}
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
                                                                                        onClick={() => setNomineeUploadPassPortImgView(true)}
                                                                                        src={nomineeUploadPassPortImgPreview}
                                                                                        className='img_preview'
                                                                                    />
                                                                                )
                                                                            )}
                                                                            {nomineeUploadPassPortImgView && (
                                                                                <Lightbox
                                                                                    mainSrc={nomineeUploadPassPortImgPreview}
                                                                                    onCloseRequest={() => setNomineeUploadPassPortImgView(false)}
                                                                                    onImageLoad={() => {
                                                                                        window.dispatchEvent(new Event('resize'));
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>NOMINEE'S PHOTO</label>
                                                                {/* {nomineeUploadImgPreview && (
                                                                    <div>
                                                                        <img src={nomineeUploadImgPreview} alt="Selected" onClick={() => setNomineeImngView(true)} className='bondimgPreview' />
                                                                    </div>
                                                                )} */}
                                                                {nomineeUploadImgPreview && (
                                                                    (nomineeUploadImgPreview.startsWith("data:application/pdf") || nomineeUploadImgPreview.endsWith(".pdf")) ? (
                                                                        <div style={{ width: "100%", height: "100%" }}>
                                                                            <button class="preview-button"
                                                                                type='button'
                                                                                onClick={() => initializeLightGallery(nomineeUploadImgPreview)}
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
                                                                            onClick={() => setNomineeImngView(true)}
                                                                            src={nomineeUploadImgPreview}
                                                                            className='img_preview'
                                                                        />
                                                                    )
                                                                )}

                                                                {nomineeImgView && (
                                                                    <Lightbox
                                                                        mainSrc={nomineeUploadImgPreview}
                                                                        onCloseRequest={() => setNomineeImngView(false)}
                                                                        onImageLoad={() => {
                                                                            window.dispatchEvent(new Event('resize'));
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        {selectedsecondApplicantNationality !== null &&
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'> NATIONALITY OF SECOND APPLICANT :</label>
                                                                    <input
                                                                        type="text"
                                                                        className='inputbond'
                                                                        value={selectedsecondApplicantNationality}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>NAME OF THE SECOND APPLICANT :</label>
                                                                <input
                                                                    type="text"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={detailsecoundapplicant}
                                                                />
                                                            </div>
                                                        </div>
                                                        {userType === "RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>PAN NUMBER OF SECOND APPLICANT :</label>
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        className='inputbond'
                                                                        value={pannumbersecondappli}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>
                                                                        {selectedsecondApplicantNationality === "INDIAN" ? "PAN NUMBER OF SECOND APPLICANT :" : "PASSPORT NUMBER OF SECOND APPLICANT :"}
                                                                    </label>

                                                                    {selectedsecondApplicantNationality === "INDIAN" ? (
                                                                        <input
                                                                            type="text"
                                                                            readOnly
                                                                            className='inputbond'
                                                                            value={pannumbersecondappli}
                                                                            onChange={(e) => setpannumbersecondappli(e.target.value)}
                                                                        />
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            readOnly
                                                                            className='inputbond'
                                                                            value={passportnumbersecondappli}
                                                                            onChange={(e) => setPassportnumbersecondappli(e.target.value)}
                                                                        />
                                                                    )}
                                                                </div>

                                                            </div>
                                                        )}
                                                        {userType === "RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>SECOND APPLICANT'S PAN :</label>
                                                                    {/* {secondnomineeUploadPanImgPreview && (
                                                                        <div className="preview_card_img">
                                                                            <img src={secondnomineeUploadPanImgPreview} onClick={() => setSecondApplicantPanView(true)} alt="Selected" className='bondimgPreview' />
                                                                        </div>
                                                                    )} */}
                                                                    {secondnomineeUploadPanImgPreview && (
                                                                        (secondnomineeUploadPanImgPreview.startsWith("data:application/pdf") || secondnomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                            <div style={{ width: "100%", height: "100%" }}>
                                                                                <button class="preview-button"
                                                                                    type='button'
                                                                                    onClick={() => initializeLightGallery(secondnomineeUploadPanImgPreview)}
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
                                                                                onClick={() => setSecondApplicantPanView(true)}
                                                                                src={secondnomineeUploadPanImgPreview}
                                                                                className='img_preview'
                                                                            />
                                                                        )
                                                                    )}
                                                                    {secondApplicantPanView && (
                                                                        <Lightbox
                                                                            mainSrc={secondnomineeUploadPanImgPreview}
                                                                            onCloseRequest={() => setSecondApplicantPanView(false)}
                                                                            onImageLoad={() => {
                                                                                window.dispatchEvent(new Event('resize'));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    {selectedsecondApplicantNationality !== null ?
                                                                        <label className='bond_label'>  {selectedsecondApplicantNationality === "INDIAN" ? "SECOND APPLICANT'S PAN :" : "SECOND APPLICANT'S PASSPORT :"}
                                                                        </label>
                                                                        :
                                                                        <label className='bond_label'>SECOND APPLICANT'S PAN :</label>
                                                                    }
                                                                    {selectedsecondApplicantNationality === "INDIAN" ? (
                                                                        <>
                                                                            {/* {secondnomineeUploadPanImgPreview && (
                                                                                <div className="preview_card_img">

                                                                                    <img src={secondnomineeUploadPanImgPreview} onClick={() => setSecondApplicantPanView(true)} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                                                            {secondnomineeUploadPanImgPreview && (
                                                                                (secondnomineeUploadPanImgPreview.startsWith("data:application/pdf") || secondnomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                                        <button class="preview-button"
                                                                                            type='button'
                                                                                            onClick={() => initializeLightGallery(secondnomineeUploadPanImgPreview)}
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
                                                                                        onClick={() => setSecondApplicantPanView(true)}
                                                                                        src={secondnomineeUploadPanImgPreview}
                                                                                        className='img_preview'
                                                                                    />
                                                                                )
                                                                            )}
                                                                            {secondApplicantPanView && (
                                                                                <Lightbox
                                                                                    mainSrc={secondnomineeUploadPanImgPreview}
                                                                                    onCloseRequest={() => setSecondApplicantPanView(false)}
                                                                                    onImageLoad={() => {
                                                                                        window.dispatchEvent(new Event('resize'));
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {/* {secondnomineeUploadPassPortImgPreview && (
                                                                                <div className="preview_card_img">
                                                                                    <img src={secondnomineeUploadPassPortImgPreview} onClick={() => setSecondApplicantPassportView(true)} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                                                            {secondnomineeUploadPassPortImgPreview && (
                                                                                (secondnomineeUploadPassPortImgPreview.startsWith("data:application/pdf") || secondnomineeUploadPassPortImgPreview.endsWith(".pdf")) ? (
                                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                                        <button class="preview-button"
                                                                                            type='button'
                                                                                            onClick={() => initializeLightGallery(secondnomineeUploadPassPortImgPreview)}
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
                                                                                    <div className="preview_card_img">
                                                                                        <img
                                                                                            alt=""
                                                                                            onClick={() => setSecondApplicantPassportView(true)}
                                                                                            src={secondnomineeUploadPassPortImgPreview}
                                                                                            className='img_preview'
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                            {secondApplicantPassportView && (
                                                                                <Lightbox
                                                                                    mainSrc={secondnomineeUploadPassPortImgPreview}
                                                                                    onCloseRequest={() => setSecondApplicantPassportView(false)}
                                                                                    onImageLoad={() => {
                                                                                        window.dispatchEvent(new Event('resize'));
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )}

                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>SECOND APPLICANT'S PHOTO :</label>
                                                                {/* {secondnomineeUploadProfileImgPreview && (
                                                                    <div>
                                                                        <img src={secondnomineeUploadProfileImgPreview} onClick={() => setSecondnomineeUploadProfileImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                    </div>
                                                                )} */}
                                                                {secondnomineeUploadProfileImgPreview && (
                                                                    (secondnomineeUploadProfileImgPreview.startsWith("data:application/pdf") || secondnomineeUploadProfileImgPreview.endsWith(".pdf")) ? (
                                                                        <div style={{ width: "100%", height: "100%" }}>
                                                                            <button class="preview-button"
                                                                                type='button'
                                                                                onClick={() => initializeLightGallery(secondnomineeUploadProfileImgPreview)}
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
                                                                            onClick={() => setSecondnomineeUploadProfileImgView(true)}
                                                                            src={secondnomineeUploadProfileImgPreview}
                                                                            className='img_preview'
                                                                        />
                                                                    )
                                                                )}
                                                                {secondnomineeUploadProfileImgView && (
                                                                    <Lightbox
                                                                        mainSrc={secondnomineeUploadProfileImgPreview}
                                                                        onCloseRequest={() => setSecondnomineeUploadProfileImgView(false)}
                                                                        onImageLoad={() => {
                                                                            window.dispatchEvent(new Event('resize'));
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        {selectedthirdApplicantNationality !== null &&
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'> NATIONALITY OF THIRD APPLICANT :</label>
                                                                    <input
                                                                        type="text"
                                                                        className='inputbond'
                                                                        value={selectedthirdApplicantNationality}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>NAME OF THE THIRD APPLICANT: (IF ANY)</label>
                                                                <input
                                                                    type="text"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={detailthirdapplicant}
                                                                    maxLength={10}
                                                                />
                                                            </div>
                                                        </div>
                                                        {userType === "RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>PAN NUMBER OF THIRD APPLICANT :</label>
                                                                    <input
                                                                        type="text"
                                                                        className='inputbond'
                                                                        readOnly
                                                                        value={pannumberthirdappli}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            selectedthirdApplicantNationality === "INDIAN" ? (
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>PAN NUMBER OF THIRD APPLICANT :</label>
                                                                        <input
                                                                            type="text"
                                                                            className='inputbond'
                                                                            readOnly
                                                                            value={pannumberthirdappli}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>PASSPORT NUMBER OF THIRD APPLICANT :</label>
                                                                        <input
                                                                            type="text"
                                                                            className='inputbond'
                                                                            readOnly
                                                                            value={passportnumberthirdappli}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}

                                                        {userType === "RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>THIRD APPLICANT'S PAN :</label>
                                                                    {/* {thirdnomineeUploadPanImgPreview && (
                                                                        <div>
                                                                            <img src={thirdnomineeUploadPanImgPreview} onClick={() => setThirdNomineeUploadPanImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                        </div>
                                                                    )} */}
                                                                    {thirdnomineeUploadPanImgPreview && (
                                                                        (thirdnomineeUploadPanImgPreview.startsWith("data:application/pdf") || thirdnomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                            <div style={{ width: "100%", height: "100%" }}>
                                                                                <button class="preview-button"
                                                                                    type='button'
                                                                                    onClick={() => initializeLightGallery(thirdnomineeUploadPanImgPreview)}
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
                                                                                onClick={() => setThirdNomineeUploadPanImgView(true)}
                                                                                src={thirdnomineeUploadPanImgPreview}
                                                                                className='img_preview'
                                                                            />
                                                                        )
                                                                    )}
                                                                    {thirdnomineeUploadPanImgView && (
                                                                        <Lightbox
                                                                            mainSrc={thirdnomineeUploadPanImgPreview}
                                                                            onCloseRequest={() => setThirdNomineeUploadPanImgView(false)}
                                                                            onImageLoad={() => {
                                                                                window.dispatchEvent(new Event('resize'));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>  {selectedthirdApplicantNationality === "INDIAN" ? "THIRD APPLICANT'S PAN :" : "THIRD APPLICANT'S PASSPORT :"}</label>
                                                                    {selectedthirdApplicantNationality === "INDIAN" ? (
                                                                        <>
                                                                            {/* {thirdnomineeUploadPanImgPreview && (
                                                                                <div>
                                                                                    <img
                                                                                        src={thirdnomineeUploadPanImgPreview}
                                                                                        onClick={() => setThirdNomineeUploadPanImgView(true)}
                                                                                        alt="Selected"
                                                                                        className='bondimgPreview'
                                                                                    />
                                                                                </div>
                                                                            )} */}
                                                                            {thirdnomineeUploadPanImgPreview && (
                                                                                (thirdnomineeUploadPanImgPreview.startsWith("data:application/pdf") || thirdnomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                                        <button class="preview-button"
                                                                                            type='button'
                                                                                            onClick={() => initializeLightGallery(thirdnomineeUploadPanImgPreview)}
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
                                                                                        onClick={() => setThirdNomineeUploadPanImgView(true)}
                                                                                        src={thirdnomineeUploadPanImgPreview}
                                                                                        className='img_preview'
                                                                                    />
                                                                                )
                                                                            )}
                                                                            {thirdnomineeUploadPanImgView && (
                                                                                <Lightbox
                                                                                    mainSrc={thirdnomineeUploadPanImgPreview}
                                                                                    onCloseRequest={() => setThirdNomineeUploadPanImgView(false)}
                                                                                    onImageLoad={() => {
                                                                                        window.dispatchEvent(new Event('resize'));
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {/* {thirdnomineeUploadPassPortImgPreview && (
                                                                                <div>
                                                                                    <img
                                                                                        src={thirdnomineeUploadPassPortImgPreview}
                                                                                        alt="Selected"
                                                                                        className='bondimgPreview'
                                                                                    />
                                                                                </div>
                                                                            )} */}

                                                                            {thirdnomineeUploadPassPortImgPreview && (
                                                                                (thirdnomineeUploadPassPortImgPreview.startsWith("data:application/pdf") || thirdnomineeUploadPassPortImgPreview.endsWith(".pdf")) ? (
                                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                                        <button class="preview-button"
                                                                                            type='button'
                                                                                            onClick={() => initializeLightGallery(thirdnomineeUploadPassPortImgPreview)}
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
                                                                                        // onClick={() => setThirdNomineeUploadPanImgView(true)}
                                                                                        src={thirdnomineeUploadPassPortImgPreview}
                                                                                        className='img_preview'
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </>
                                                                    )}




                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>THIRD APPLICANT'S PHOTO :</label>

                                                                {/* {thirdnomineeUploadProfileImgPreview && (
                                                                    <div>
                                                                        <img src={thirdnomineeUploadProfileImgPreview} onClick={() => setThirdNomineeUploadPanImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                    </div>
                                                                )} */}
                                                                {thirdnomineeUploadProfileImgPreview && (
                                                                    (thirdnomineeUploadProfileImgPreview.startsWith("data:application/pdf") || thirdnomineeUploadProfileImgPreview.endsWith(".pdf")) ? (
                                                                        <div style={{ width: "100%", height: "100%" }}>
                                                                            <button class="preview-button"
                                                                                type='button'
                                                                                onClick={() => initializeLightGallery(thirdnomineeUploadProfileImgPreview)}
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
                                                                            onClick={() => setThirdNomineeUploadProfileImgView(true)}
                                                                            src={thirdnomineeUploadProfileImgPreview}
                                                                            className='img_preview'
                                                                        />
                                                                    )
                                                                )}
                                                                {thirdnomineeUploadProfileImgView && (
                                                                    <Lightbox
                                                                        mainSrc={thirdnomineeUploadProfileImgPreview}

                                                                        onCloseRequest={() => setThirdNomineeUploadProfileImgView(false)}
                                                                        onImageLoad={() => {
                                                                            window.dispatchEvent(new Event('resize'));
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                            {/* INDIVIVUAL */}
                                            {bondId === 1 && (
                                                <div className='col-lg-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>NAME OF SOLE/FIRST APPLICANT :</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Name"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={firstApplicant}
                                                                    onChange={(e) => setFirstApplicant(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>DATE OF BIRTH : </label>
                                                                <input
                                                                    id="dob"
                                                                    type="date"
                                                                    placeholder="Enter dob"
                                                                    className='inputbond'
                                                                    value={dob}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>ADDRESS : </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Address"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={address}
                                                                    onChange={(e) => setAddress(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>OCCUPATION :</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Occupation"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={occupation}
                                                                />
                                                            </div>
                                                        </div>
                                                        {userType === "RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>PAN NUMBER :</label>
                                                                    <input
                                                                        type="text"
                                                                        // placeholder="Enter Pan Number"
                                                                        className='inputbond'
                                                                        maxLength={10}
                                                                        value={panCard}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userType === "NON-RESIDENT INDIAN" && (
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>PASSPORT NUMBER :</label>
                                                                    <input
                                                                        type="text"
                                                                        // placeholder="Enter Pan Number"
                                                                        className='inputbond'
                                                                        maxLength={10}
                                                                        value={passport}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>{relation}'S NAME :</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Spouse's / Father's Name"
                                                                    className='inputbond'
                                                                    value={fatherName}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>MARITAL STATUS :</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Status"
                                                                    readOnly
                                                                    className='inputbond'
                                                                    value={status}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ marginTop: "2%" }}>
                                                            <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                                                <span>Nominee Details</span>
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ marginTop: "2%" }}>
                                                            {selectedNationality !== null &&
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'> NATIONALITY OF NOMINEE :</label>
                                                                        <input
                                                                            type="text"

                                                                            className='inputbond'
                                                                            value={selectedNationality}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            }
                                                            {nomineeType !== null &&
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'> NOMINEE TYPE :</label>
                                                                        <input
                                                                            type="text"
                                                                            className='inputbond'
                                                                            value={nomineeType}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            }
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>NAME OF THE NOMINEE :</label>
                                                                    <input
                                                                        type="text"
                                                                        className='inputbond'
                                                                        value={detailsofNomine}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                            {userType === "RESIDENT INDIAN" && nomineeType === "MAJOR" && (
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>NOMINEE'S PAN NUMBER :</label>
                                                                        <input
                                                                            type="text"
                                                                            className='inputbond'
                                                                            readOnly
                                                                            value={nomineePan}
                                                                            maxLength={10}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {userType === "RESIDENT INDIAN" && nomineeType === "MAJOR" && (
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>
                                                                            NOMINEE'S PAN :
                                                                        </label>

                                                                        {/* Nominee Pan */}
                                                                        {/* {nomineeUploadPanImgPreview && (
                                                                            <div>
                                                                                <img src={nomineeUploadPanImgPreview} onClick={() => setNomineeUploadPanImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                                                        {nomineeUploadPanImgPreview && (
                                                                            (nomineeUploadPanImgPreview.startsWith("data:application/pdf") || nomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                                <div style={{ width: "100%", height: "100%" }}>
                                                                                    <button class="preview-button"
                                                                                        type='button'
                                                                                        onClick={() => initializeLightGallery(nomineeUploadPanImgPreview)}
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
                                                                                    onClick={() => setNomineeUploadPanImgView(true)}
                                                                                    src={nomineeUploadPanImgPreview}
                                                                                    className='img_preview'
                                                                                />
                                                                            )
                                                                        )}
                                                                        {nomineeUploadPanImgView && (
                                                                            <Lightbox
                                                                                mainSrc={nomineeUploadPanImgPreview}
                                                                                onCloseRequest={() => setNomineeUploadPanImgView(false)}
                                                                                onImageLoad={() => {
                                                                                    window.dispatchEvent(new Event('resize'));
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {userType === "RESIDENT INDIAN" && nomineeType === "MINOR" && (
                                                                <>
                                                                    <div className='col-lg-4 col-12'>
                                                                        <div className='responsive-column'>
                                                                            <label className='bond_label'>GUARDIAN RELATIONSHIP :</label>
                                                                            <input
                                                                                type="text"
                                                                                className='inputbond'
                                                                                readOnly
                                                                                value={relationshipnominee}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-4 col-12'>
                                                                        <div className='responsive-column'>
                                                                            <label className='bond_label'>GUARDIAN NAME :</label>
                                                                            <input
                                                                                type="text"
                                                                                className='inputbond'
                                                                                readOnly
                                                                                value={nomineeguarname}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-4 col-12'>
                                                                        <div className='responsive-column'>
                                                                            <label className='bond_label'>NOMINEE'S DATE OF BIRTH :</label>
                                                                            <input
                                                                                type="text"
                                                                                className='inputbond'
                                                                                readOnly
                                                                                value={nomineeDob}
                                                                                maxLength={10}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {userType === "NON-RESIDENT INDIAN" && nomineeType === "MAJOR" && (
                                                                <div className='col-lg-4 col-12'>

                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>
                                                                            {selectedNationality === "INDIAN" ? " NOMINEE'S PAN NUMBER : " : "NOMINEE'S PASSPORT NUMBER :"}
                                                                        </label>

                                                                        {selectedNationality === "INDIAN" ? (
                                                                            <input
                                                                                type="text"
                                                                                readOnly
                                                                                className='inputbond'
                                                                                value={nomineePan}
                                                                                onChange={(e) => setNomineePan(e.target.value)}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                readOnly
                                                                                className='inputbond'
                                                                                value={nomineePassport}
                                                                                onChange={(e) => setNomineePassport(e.target.value)}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {userType === "NON-RESIDENT INDIAN" && nomineeType === "MAJOR" && (
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>
                                                                            {selectedNationality === "INDIAN" ? "NOMINEE'S PAN :" : "NOMINEE'S PASSPORT :"}
                                                                        </label>

                                                                        {selectedNationality === "INDIAN" ? (
                                                                            <>
                                                                                {/* Nominee Pan */}
                                                                                {/* {nomineeUploadPanImgPreview && (
                                                                                    <div>
                                                                                        <img src={nomineeUploadPanImgPreview} onClick={() => setNomineeUploadPanImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                                                                {nomineeUploadPanImgPreview && (
                                                                                    (nomineeUploadPanImgPreview.startsWith("data:application/pdf") || nomineeUploadPanImgPreview.endsWith(".pdf")) ? (
                                                                                        <div style={{ width: "100%", height: "100%" }}>
                                                                                            <button class="preview-button"
                                                                                                type='button'
                                                                                                onClick={() => initializeLightGallery(nomineeUploadPanImgPreview)}
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
                                                                                            onClick={() => setNomineeUploadPanImgView(true)}
                                                                                            src={nomineeUploadPanImgPreview}
                                                                                            className='img_preview'
                                                                                        />
                                                                                    )
                                                                                )}
                                                                                {nomineeUploadPanImgView && (
                                                                                    <Lightbox
                                                                                        mainSrc={nomineeUploadPanImgPreview}
                                                                                        onCloseRequest={() => setNomineeUploadPanImgView(false)}
                                                                                        onImageLoad={() => {
                                                                                            window.dispatchEvent(new Event('resize'));
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {/* Nominee Passport */}
                                                                                {/* {nomineeUploadPassPortImgPreview && (
                                                                                    <div>
                                                                                        <img src={nomineeUploadPassPortImgPreview} onClick={() => setNomineeUploadPassPortImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                                                                {nomineeUploadPassPortImgPreview && (
                                                                                    (nomineeUploadPassPortImgPreview.startsWith("data:application/pdf") || nomineeUploadPassPortImgPreview.endsWith(".pdf")) ? (
                                                                                        <div style={{ width: "100%", height: "100%" }}>
                                                                                            <button class="preview-button"
                                                                                                type='button'
                                                                                                onClick={() => initializeLightGallery(nomineeUploadPassPortImgPreview)}
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
                                                                                            onClick={() => setNomineeUploadPassPortImgView(true)}
                                                                                            src={nomineeUploadPassPortImgPreview}
                                                                                            className='img_preview'
                                                                                        />
                                                                                    )
                                                                                )}
                                                                                {nomineeUploadPassPortImgView && (
                                                                                    <Lightbox
                                                                                        mainSrc={nomineeUploadPassPortImgPreview}
                                                                                        onCloseRequest={() => setNomineeUploadPassPortImgView(false)}
                                                                                        onImageLoad={() => {
                                                                                            window.dispatchEvent(new Event('resize'));
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {userType === "NON-RESIDENT INDIAN" && nomineeType === "MINOR" && (
                                                                <>
                                                                    <div className='col-lg-4 col-12'>
                                                                        <div className='responsive-column'>
                                                                            <label className='bond_label'>NOMINEE'S DATE OF BIRTH :</label>
                                                                            <input
                                                                                type="text"
                                                                                className='inputbond'
                                                                                readOnly
                                                                                value={nomineeDob}
                                                                                maxLength={10}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-4 col-12'>
                                                                        <div className='responsive-column'>
                                                                            <label className='bond_label'>GUARDIAN RELATIONSHIP :</label>
                                                                            <input
                                                                                type="text"
                                                                                className='inputbond'
                                                                                readOnly
                                                                                value={relationshipnominee}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-4 col-12'>
                                                                        <div className='responsive-column'>
                                                                            <label className='bond_label'>GUARDIAN NAME :</label>
                                                                            <input
                                                                                type="text"
                                                                                className='inputbond'
                                                                                readOnly
                                                                                value={nomineeguarname}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>NOMINEE'S PHOTO :</label>
                                                                    {/* {nomineeUploadImgPreview && (
                                                                        <div>
                                                                            <img src={nomineeUploadImgPreview} alt="Selected" onClick={() => setNomineeImngView(true)} className='bondimgPreview' />
                                                                        </div>
                                                                    )} */}
                                                                    {nomineeUploadImgPreview && (
                                                                        (nomineeUploadImgPreview.startsWith("data:application/pdf") || nomineeUploadImgPreview.endsWith(".pdf")) ? (
                                                                            <div style={{ width: "100%", height: "100%" }}>
                                                                                <button class="preview-button"
                                                                                    type='button'
                                                                                    onClick={() => initializeLightGallery(nomineeUploadImgPreview)}
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
                                                                                onClick={() => setNomineeImngView(true)}
                                                                                src={nomineeUploadImgPreview}
                                                                                className='img_preview'
                                                                            />
                                                                        )
                                                                    )}

                                                                    {nomineeImgView && (
                                                                        <Lightbox
                                                                            mainSrc={nomineeUploadImgPreview}
                                                                            onCloseRequest={() => setNomineeImngView(false)}
                                                                            onImageLoad={() => {
                                                                                window.dispatchEvent(new Event('resize'));
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <br></br><br></br>
                                            <div>
                                                <span className='bond_label'>I understand that the details furnished above are true to the best of our knowledge the shares if allotted are restricted for transfer purposes. All provisions of the Companies Act, 2013 and guidelines of the Articles of Association of the Company together with rules of Reserve Bank of India relating to FEMA are applicable. We also declare that the amount is not borrowed funds and investing out of my own funds. The discretion of the Board shall be final, and we agree to be bound by the decision of the Board in this respect.</span>
                                            </div>
                                            <br></br>
                                            {bondId === 1 && (
                                                <div>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                        {/* {firstSignImgPreview && (
                                                            <div>
                                                                <img src={firstSignImgPreview} onClick={() => setfirstSignView(true)} alt="Selected" className='bondimgPreview' />
                                                            </div>
                                                        )} */}
                                                        {firstSignImgPreview && (
                                                            (firstSignImgPreview.startsWith("data:application/pdf") || firstSignImgPreview.endsWith(".pdf")) ? (
                                                                <div style={{ width: "100%", height: "100%" }}>
                                                                    <button class="preview-button"
                                                                        type='button'
                                                                        onClick={() => initializeLightGallery(firstSignImgPreview)}
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
                                                                    onClick={() => setfirstSignView(true)}
                                                                    src={firstSignImgPreview}
                                                                    className='img_preview'
                                                                />
                                                            )
                                                        )}
                                                        {firstSignImgView && (
                                                            <Lightbox
                                                                mainSrc={firstSignImgPreview}
                                                                onCloseRequest={() => setfirstSignView(false)}
                                                                onImageLoad={() => {
                                                                    window.dispatchEvent(new Event('resize'));
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center', padding: "20px" }}>
                                                        <label className='bond_label'>FIRST APPLICANT'S SIGNATURE</label>
                                                    </div>
                                                </div>
                                            )}
                                            {bondId === 2 && (
                                                <div className='approve_signature_div'>
                                                    <div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                            {/* {firstSignImgPreview && (
                                                                <div>
                                                                    <img src={firstSignImgPreview} onClick={() => setfirstSignView(true)} alt="Selected" className='bondimgPreview' />
                                                                </div>
                                                            )} */}
                                                            {firstSignImgPreview && (
                                                                (firstSignImgPreview.startsWith("data:application/pdf") || firstSignImgPreview.endsWith(".pdf")) ? (
                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                        <button class="preview-button"
                                                                            type='button'
                                                                            onClick={() => initializeLightGallery(firstSignImgPreview)}
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
                                                                        onClick={() => setfirstSignView(true)}
                                                                        src={firstSignImgPreview}
                                                                        className='img_preview'
                                                                    />
                                                                )
                                                            )}
                                                            {firstSignImgView && (
                                                                <Lightbox
                                                                    mainSrc={firstSignImgPreview}
                                                                    onCloseRequest={() => setfirstSignView(false)}
                                                                    onImageLoad={() => {
                                                                        window.dispatchEvent(new Event('resize'));
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center', padding: "20px" }}>
                                                            <label className='bond_label'>FIRST APPLICANT'S SIGNATURE</label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                            {/* {secondSignImgPreview && (
                                                                <div>
                                                                    <img src={secondSignImgPreview} onClick={() => setSecondSignImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                </div>
                                                            )} */}
                                                            {secondSignImgPreview && (
                                                                (secondSignImgPreview.startsWith("data:application/pdf") || secondSignImgPreview.endsWith(".pdf")) ? (
                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                        <button class="preview-button"
                                                                            type='button'
                                                                            onClick={() => initializeLightGallery(secondSignImgPreview)}
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
                                                                        onClick={() => setSecondSignImgView(true)}
                                                                        src={secondSignImgPreview}
                                                                        className='img_preview'
                                                                    />
                                                                )
                                                            )}
                                                            {secondSignImgView && (
                                                                <Lightbox
                                                                    mainSrc={secondSignImgPreview}
                                                                    onCloseRequest={() => setSecondSignImgView(false)}
                                                                    onImageLoad={() => {
                                                                        window.dispatchEvent(new Event('resize'));
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center', padding: "20px" }}>
                                                            <label className='bond_label'>SECOND APPLICANT'S SIGNATURE</label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                            {/* {thirdSignImgPreview && (
                                                                <div>
                                                                    <img src={thirdSignImgPreview} onClick={() => setThirdSignImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                </div>
                                                            )} */}
                                                            {thirdSignImgPreview && (
                                                                (thirdSignImgPreview.startsWith("data:application/pdf") || thirdSignImgPreview.endsWith(".pdf")) ? (
                                                                    <div style={{ width: "100%", height: "100%" }}>
                                                                        <button class="preview-button"
                                                                            type='button'
                                                                            onClick={() => initializeLightGallery(thirdSignImgPreview)}
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
                                                                        onClick={() => setThirdSignImgView(true)}
                                                                        src={thirdSignImgPreview}
                                                                        className='img_preview'
                                                                    />
                                                                )
                                                            )}
                                                            {thirdSignImgView && (
                                                                <Lightbox
                                                                    mainSrc={thirdSignImgPreview}
                                                                    onCloseRequest={() => setThirdSignImgView(false)}
                                                                    onImageLoad={() => {
                                                                        window.dispatchEvent(new Event('resize'));
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center', padding: "20px" }}>
                                                            <label className='bond_label'>THIRD APPLICANT'S SIGNATURE </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* ------------ Payment Details Container ----------- */}
                {userType === "RESIDENT INDIAN" && (
                    <div className='register_container'>
                        <div className="gpbond_card col-lg-12">
                            {/* ---------same us above bank list Bank ------ */}
                            <div>
                                <div className='row' style={{ marginTop: "2%" }}>
                                    <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                        <span>Bank Account details for Crediting Dividend</span>
                                    </div>
                                </div>
                                {/* RI */}

                                <div className="row" style={{ paddingTop: "20px" }}>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>ACCOUNT NUMBER : </label>
                                            <input
                                                id="accountnumber"
                                                type="text"
                                                placeholder="Account Number"
                                                className='inputbond'
                                                readOnly
                                                value={accountNo}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>BANK NAME : </label>
                                            <input
                                                type="text"
                                                placeholder="Bank Name"
                                                className='inputbond'
                                                readOnly
                                                value={bankName}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>BRANCH NAME :</label>
                                            <input
                                                type="text"
                                                placeholder="Branch Name"
                                                className='inputbond'
                                                value={branchName}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>IFSC CODE :</label>
                                            <input
                                                type="text"
                                                placeholder="IFSC Code"
                                                className='inputbond'
                                                value={ifscCode}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>CANCELLED CHEQUE LEAF / BANK STATEMENT / PASSBOOK FRONT PAGE : </label>
                                            {/* {chequeUploadImgPreview && (
                                                <div>
                                                    <img src={chequeUploadImgPreview} onClick={() => setChequeUploadView(true)} alt="Selected" className='bondimgPreview' />
                                                </div>
                                            )} */}
                                            {chequeUploadImgPreview && (
                                                (chequeUploadImgPreview.startsWith("data:application/pdf") || chequeUploadImgPreview.endsWith(".pdf")) ? (
                                                    <div style={{ width: "100%", height: "100%" }}>
                                                        <button class="preview-button"
                                                            type='button'
                                                            onClick={() => initializeLightGallery(chequeUploadImgPreview)}
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
                                                        onClick={() => setChequeUploadView(true)}
                                                        src={chequeUploadImgPreview}
                                                        className='img_preview'
                                                    />
                                                )
                                            )}
                                            {chequeUploadView && (
                                                <Lightbox
                                                    mainSrc={chequeUploadImgPreview}
                                                    onCloseRequest={() => setChequeUploadView(false)}
                                                    onImageLoad={() => {
                                                        window.dispatchEvent(new Event('resize'));
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
                {userType === "NON-RESIDENT INDIAN" && (
                    <div className='register_container'>
                        <div className="gpbond_card col-lg-12">
                            {/* ---------same us above bank list Bank ------ */}
                            <div>
                                <div className='row' style={{ marginTop: "2%" }}>
                                    <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                        <span>Bank Account details for Crediting Dividend</span>
                                    </div>
                                </div>
                                {/* RI */}
                                {selectedCurrency === "INR" && (
                                    <div className="row" style={{ paddingTop: "20px" }}>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>ACCOUNT NUMBER : </label>
                                                <input
                                                    id="accountnumber"
                                                    type="text"
                                                    placeholder="Account Number"
                                                    className='inputbond'
                                                    readOnly
                                                    value={accountNo}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>BANK NAME : </label>
                                                <input
                                                    type="text"
                                                    placeholder="Bank Name"
                                                    className='inputbond'
                                                    readOnly
                                                    value={bankName}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>BRANCH NAME :</label>
                                                <input
                                                    type="text"
                                                    placeholder="Branch Name"
                                                    className='inputbond'
                                                    value={branchName}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>IFSC CODE :</label>
                                                <input
                                                    type="text"
                                                    placeholder="IFSC Code"
                                                    className='inputbond'
                                                    value={ifscCode}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>CANCELLED CHEQUE LEAF / BANK STATEMENT / PASSBOOK FRONT PAGE : </label>
                                                {/* {chequeUploadImgPreview && (
                                                    <div>
                                                        <img src={chequeUploadImgPreview} onClick={() => setChequeUploadView(true)} alt="Selected" className='bondimgPreview' />
                                                    </div>
                                                )} */}
                                                {chequeUploadImgPreview && (
                                                    (chequeUploadImgPreview.startsWith("data:application/pdf") || chequeUploadImgPreview.endsWith(".pdf")) ? (
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <button class="preview-button"
                                                                type='button'
                                                                onClick={() => initializeLightGallery(chequeUploadImgPreview)}
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
                                                            onClick={() => setChequeUploadView(true)}
                                                            src={chequeUploadImgPreview}
                                                            className='img_preview'
                                                        />
                                                    )
                                                )}
                                                {chequeUploadView && (
                                                    <Lightbox
                                                        mainSrc={chequeUploadImgPreview}
                                                        onCloseRequest={() => setChequeUploadView(false)}
                                                        onImageLoad={() => {
                                                            window.dispatchEvent(new Event('resize'));
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* NRI */}
                                {selectedCurrency === "USD" && (
                                    <div className="row" style={{ marginTop: "2%" }}>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'> ACCOUNT NUMBER : <span className="required">*</span></label>
                                                <input
                                                    id="accountNo"
                                                    type="text"
                                                    placeholder="Account Number"
                                                    className='inputbond'
                                                    value={accountNo}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'> ACCOUNT TYPE : <span className="required">*</span></label>
                                                <input
                                                    id="accountType"
                                                    type="text"
                                                    placeholder="Account Type"
                                                    className='inputbond'
                                                    value={accountType}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>BANK NAME : <span className="required">*</span></label>
                                                <input
                                                    id="bankName"
                                                    type="text"
                                                    placeholder="Bank Name"
                                                    className='inputbond'
                                                    disabled
                                                    value={bankName}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>BRANCH NAME : <span className="required">*</span></label>
                                                <input
                                                    id="branchName"
                                                    type="text"
                                                    placeholder="Branch Name"
                                                    className='inputbond'
                                                    disabled
                                                    value={branchName}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>SWIFT / IBAN CODE : </label>
                                                <input
                                                    id="ibankcode"
                                                    type="text"
                                                    className='inputbond'
                                                    disabled
                                                    value={ibankCode}
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value;
                                                        const regex = /^[a-zA-Z\s]*$/;
                                                        if (regex.test(inputValue)) {
                                                            setIbankCode(inputValue);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>REMITTANCE THROUGH BANK : </label>
                                                <input
                                                    id="remittancethroughbank"
                                                    type="text"
                                                    className='inputbond'
                                                    disabled
                                                    value={remittanceThroughBank}
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value;
                                                        const regex = /^[a-zA-Z\s]*$/;
                                                        if (regex.test(inputValue)) {
                                                            setremittanceThroughBank(inputValue);
                                                        }
                                                    }}
                                                />
                                            </div>

                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>CANCELLED CHEQUE LEAF / BANK STATEMENT / PASSBOOK FRONT PAGE : </label>
                                                {/* {chequeUploadImgPreview && (
                                                    <div>
                                                        <img src={chequeUploadImgPreview} onClick={() => setChequeUploadView(true)} alt="Selected" className='bondimgPreview' />
                                                    </div>
                                                )} */}
                                                {chequeUploadImgPreview && (
                                                    (chequeUploadImgPreview.startsWith("data:application/pdf") || chequeUploadImgPreview.endsWith(".pdf")) ? (
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <button class="preview-button"
                                                                type='button'
                                                                onClick={() => initializeLightGallery(chequeUploadImgPreview)}
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
                                                            onClick={() => setChequeUploadView(true)}
                                                            src={chequeUploadImgPreview}
                                                            className='img_preview'
                                                        />
                                                    )
                                                )}
                                                {chequeUploadView && (
                                                    <Lightbox
                                                        mainSrc={chequeUploadImgPreview}
                                                        onCloseRequest={() => setChequeUploadView(false)}
                                                        onImageLoad={() => {
                                                            window.dispatchEvent(new Event('resize'));
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default HoldingApprovedDetails;