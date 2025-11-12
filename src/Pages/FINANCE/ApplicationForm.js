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
import { RiCloseCircleFill } from "react-icons/ri";
import moment from "moment";
import PDFViewer from '../components/PDFViewer';
import DatePicker from "react-datepicker";
import { initializeLightGallery } from '../components/lightGalleryInitializer';

const ApplicationForm = () => {

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

    const [nomineePassport, setNomineePassport] = useState("");
    const [passportnumberthirdappli, setPassportnumberthirdappli] = useState("");
    const [passportnumbersecondappli, setPassportnumbersecondappli] = useState("");

    const [modeofPayment, setModeofPayment] = useState("");
    const [utr, setUtr] = useState("");
    const [accountInfoDate, setAccountInfoDate] = useState("");

    const [relation, setRelation] = useState('');

    const [amount, setAmount] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlertClose, setShowAlertClose] = useState(() => null)

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertErrorMessage, setAlertErrorMessage] = useState('');

    const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
    const [alertYesorNoMessage, setAlertYesorNoMessage] = useState('');

    const [firstSignImgPreview, setfirstSignImgPreview] = useState(null);
    const [firstSignImgView, setfirstSignView] = useState(false);

    const [secondSignImgPreview, setSecondSignImgImgPreview] = useState(null);
    const [secondSignImgView, setSecondSignImgView] = useState(false);

    const [thirdSignImgPreview, setThirdSignImgImgPreview] = useState(null);
    const [thirdSignImgView, setThirdSignImgView] = useState(false);

    const [chequeUploadImgPreview, setChequeUploadImgPreview] = useState(null);
    const [chequeUploadView, setChequeUploadView] = useState(null);

    const [nomineeImgView, setNomineeImngView] = useState(false);
    const [nomineeUploadImgPreview, setNomineeUploadImgPreview] = useState(null);

    const [nomineeUploadPanImgView, setNomineeUploadPanImgView] = useState(false);

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
    const [relationshipnominee, setRelationshipnominee] = useState("");
    const [nomineeguarname, setNomineeguarname] = useState("");
    const [nomineeDob, setNomineeDob] = useState("");

    const [swiftadviceImgPreview, setswiftadviceImgPreview] = useState(null);

    const [token] = useState(localStorage.getItem("token"));
    const [userId] = useState(localStorage.getItem("user_id"));

    const [allocationVerified, setAllocationVerified] = useState(null);
    const [allocationDate, setAllocationDate] = useState("");
    const [noOfAllocationUnits, setNoOfAllocationUnits] = useState("");
    const [allocationRemarks, setAllocationRemarks] = useState('');
    const [certificateImg, setCertificateImg] = useState(null);
    const [certificatePreviewImg, setCertificatePreviewImg] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [clientscheme, setClientscheme] = useState("");
    const [passport, setPassport] = useState("");

    const [shareAllocationId, setShareAllocationId] = useState("");

    const [allocationId, setAllocationId] = useState("")

    const [allocationReject, setAllocationReject] = useState(false)

    const [allocationApproveFlag, setAllocationApproveFlag] = useState(false)
    const [certificateFlag, setCertificateFlag] = useState(false)

    const [allotmentConfimFlag, setAllotementConfirmFlag] = useState(false);

    const [interestData, setInterestData] = useState([]);
    const [redemptionData, setRedemptionData] = useState([]);
    const [dataList, setDataList] = useState([])

    const [modeOfPaymentList, setModeOfPaymentList] = useState([])
    const [interestStatusList, setInterestStatusList] = useState([]);

    const [rejectionDate, setRejectionnDate] = useState("");

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const minDate = moment(process.env.REACT_APP_PAYMENT_DATE).format('YYYY-MM-DD');
    const currentDate = moment().format('YYYY-MM-DD');

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        ViewDocuments();
        getModeofPayment()
        getInterestStatus()
    }, []);

    const handleCloseAlert = () => {
        setShowAlert(false);
        navigate('/UserBondApprove');
    };

    const handleFileInputChange = (event) => {
        event.target.value = '';
    };

    const handleErrorCloseAlert = () => {
        setShowErrorAlert(false);
    };

    const handleYesorNo = () => {
        setShowYesorNoAlert(false);
    };

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
        const url = `/dividend/userbond/id?id=${id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "viewDocument")
                if ('data' in response.data) {
                    setDataList(response.data.data)
                }
                else {
                    setDataList([])
                }

                if ('interest' in response.data) {
                    setInterestData(response.data.interest)
                    if (response.data.share.rejected === false) {
                        setCertificateFlag(true)
                    }
                    else {
                        setCertificateFlag(false)
                    }
                }
                else {
                    setInterestData([])
                }

                if ('redemption' in response.data) {
                    setRedemptionData(response.data.redemption)
                }
                else {
                    setRedemptionData([])
                }

                if ('share' in response.data) {
                    setAllocationApproveFlag(true)
                    setShareAllocationId(response.data.share.id)
                    setNoOfAllocationUnits(response.data.share.noOfSharesAlloted)
                    setAllocationDate(response.data.share.dateOfAllotment)
                    setAllocationId(response.data.share.id)

                    if (response.data.share.rejected === false && response.data.share.certificateUploaded)

                        if (response.data.data.bond != null) {
                            // const certificate = base64ToPdfUrl(response.data.data.bond);
                            setCertificatePreviewImg(response.data.data.bond);
                        }
                        else {
                            setCertificatePreviewImg(null);
                        }
                    if (response.data.share.rejected === false) {
                        setAllocationVerified(true)
                        setAllocationReject(false)
                    }
                    else if (response.data.share.rejected === true) {
                        setAllocationVerified(false)
                        setAllocationReject(true)
                        setAllocationRemarks(response.data.share.remarks);
                        setRejectionnDate(response.data.share.rejectedDate)
                    }

                    if ((response.data.share.noOfSharesAlloted != null || response.data.share.noOfSharesAlloted === '') && response.data.share.rejected === false) {
                        setAllotementConfirmFlag(true)
                    }
                    else {
                        setAllotementConfirmFlag(false)
                    }
                } else {
                    setAllocationApproveFlag(false)
                    setNoOfAllocationUnits('')
                    setAllocationDate('')
                    setAllocationVerified(null)
                    setAllocationId('')
                }

                setClientscheme(response.data.data.clientBondDetails.id)
                setBondId(response.data.data.investorType.id)
                setFirstApplicant(response.data.data.name);
                setAddress(response.data.data.address);
                setOccupation(response.data.data.occupation);
                setPanCard(response.data.data.pan);

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
                setSelectedNationality(response.data.data.nomineeNationality);
                setPassport(response.data.data.passportNo);
                setSelectedSecondApplicantNationality(response.data.data.secondApplicantNationality)
                setSelectedThirdApplicantNationality(response.data.data.thirdApplicantNationality)
                setSelectedCurrency(response.data.data.currencyOfTransfer);
                setSelectedCountryType(response.data.data.countryOfRemittance);
                setNomineePassport(response.data.data.nomineePassportNo)
                setremittanceThroughBank(response.data.data.remittanceBank)
                setPassportnumbersecondappli(response.data.data.secondApplicantPassport)
                setPassportnumberthirdappli(response.data.data.thirdApplicantPassport)
                setUserType(response.data.data.userType);
                console.log(response.data.data.userType, "UserType")
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
                    setThirdNomineeUploadPassPortImgPreview(response.data.data.thirdApplicantPassportImg);
                }
                else {
                    setThirdNomineeUploadPassPortImgPreview(null);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getModeofPayment = () => {
        const method = 'POST';
        const url = `/userbond/modeOfPayment`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                setModeOfPaymentList(response.data)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getInterestStatus = () => {
        const method = 'POST';
        const url = `/dividend/interest/allStatus`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "interset Status List")
                if (response.data.status === 200) {
                    setInterestStatusList(response.data.data)
                }
                else {
                    setInterestStatusList([])
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

    const base64ToPdfUrl = (base64String) => {
        const binaryString = window.atob(base64String);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    };

    useEffect(() => {
        const input = document.getElementById('allottmentDate');
        const handleWheel = (event) => {
            event.preventDefault();
        };

        if (input) {
            input.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (input) {
                input.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    const handleCertificateUpload = async (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.pdf')) {
                const fileSizeInKB = file.size / 1024;
                // if (fileSizeInKB > 500) {
                // setFormErrors({ ...formErrors, certificateImg: "File size should not exceed 500KB" })
                // fileInput.value = '';
                // setCertificateImg(null);
                // setCertificatePreviewImg(null)
                // } else {

                const response = await imageUploadApi(file);

                if (response.data.status === 409) {
                    fileInput.value = '';
                    setCertificateImg(null)
                    setCertificatePreviewImg(null)
                    setFormErrors({ ...formErrors, certificateImg: response.data.message })
                }
                else if (response.data.status === 200) {
                    setShowAlert(true);
                    setAlertMessage(response.data.message);
                    setShowAlertClose(() => () => { window.location.reload() })
                    // setCertificateImg(file)
                    // const reader = new FileReader();
                    // reader.onload = (e) => {
                    //     setCertificatePreviewImg(e.target.result);
                    // };
                    // reader.readAsDataURL(file);
                    setFormErrors({ ...formErrors, certificateImg: "" })
                }

                // setCertificateImg(file)
                // const reader = new FileReader();
                // reader.onload = (e) => {
                //     setCertificatePreviewImg(e.target.result);
                // };
                // reader.readAsDataURL(file);
                // setFormErrors({ ...formErrors, certificateImg: "" })
                // }
            } else {
                fileInput.value = '';
                setFormErrors({ ...formErrors, certificateImg: "Invalid file format. Please upload a .pdf file." });
                setCertificateImg(null);
                setCertificatePreviewImg(null)
            }
        }
    };

    const imageUploadApi = async (file) => {
        try {
            const url = "/dividend/shareAllocation";
            const data = new FormData();
            data.append("id", shareAllocationId)
            data.append("userBondDetails.id", id)
            data.append("clientBondDetails.id", clientscheme)
            data.append("certificate", file)

            const response = await PostApi('POST', url, data, headers);

            return response
        } catch (error) {
            return { success: false, error: "Error uploading image" };
        }
    };

    const ApproveAllocation = () => {
        if (allocationVerified === null) {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please ensure to verify the details of the Unit Allocation before giving your approval");
            return;
        }
        if (allocationVerified === true && allocationDate === "") {
            setShowErrorAlert(true);
            setAlertErrorMessage("Before Approve Please enter the Date of Allotment.");
            return;
        }
        if (allocationVerified === true && noOfAllocationUnits === "") {
            setShowErrorAlert(true);
            setAlertErrorMessage("Before Approve Please enter the No of Shares to be Allotted.");
            return;
        }
        // if (allocationVerified === true && certificateImg === null) {
        //     setShowErrorAlert(true);
        //     setAlertErrorMessage("Before Approve Please Upload the Share Certificate.");
        //     return;
        // }

        if (allocationVerified === false && rejectionDate === "") {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Select the Rejection Date");
            return;
        }
        if (allocationVerified === false && allocationRemarks.trim().length === 0) {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please enter the remarks that explain the reason for rejecting the Unit Allocation.");
            return;
        }

        setShowYesorNoAlert(true);
        setAlertYesorNoMessage(`Are you sure you want to ${allocationVerified === false ? " Reject ?" : "Approve ?"}`);
    }

    const handleAllocationApprove = () => {
        console.log(allocationDate, "lkjkljklj")
        let date;
        var status;

        if (allocationDate != null && allocationDate != "") {
            date = moment(allocationDate).format("YYYY-MM-DD")
        }
        else {
            date = ''
        }

        if (allocationVerified === true) {
            status = false
        }
        else if (allocationVerified === false) {
            status = true
        }

        const method = 'POST';
        const data = new FormData()

        data.append("userBondDetails.id", id)
        data.append("clientBondDetails.id", clientscheme)
        data.append("noOfSharesAlloted", noOfAllocationUnits)
        data.append("dateOfAllotment", date)
        data.append("rejected", status)
        data.append("remarks", allocationRemarks)
        data.append("createdBy", userId)
        data.append("certificate", certificateImg)
        data.append("rejectedDate", rejectionDate)
        if (allocationApproveFlag === true) {
            data.append("updatedBy", userId)
        }

        if (allocationApproveFlag === true) {
            data.append("id", allocationId)
        }

        var url = "/dividend/shareAllocation"
        PostApi(method, url, data, headers)
            .then((response) => {
                setShowYesorNoAlert(false)
                // setShowYesorNoAlert(false)
                // setShowAlert(true);
                // setAlertMessage(response.data.message)
                if (response.data.status === 200) {
                    setShowAlert(true);
                    setAlertMessage(response.data.message);
                    setShowAlertClose(() => () => { setShowAlert(false); navigate('/UnitAllowcation'); })
                } else {
                    setAlertErrorMessage(response.data.message);
                    setShowErrorAlert(true);
                    setShowAlertClose(() => () => { setShowAlert(false); navigate('/UnitAllowcation'); })
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }


    const approveInterest = () => {
        if (interestData.actualPaidDate === null || interestData.actualPaidDate === '') {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Select the Interest Actual Payout Date");
            return;
        }

        if (interestData.actualAmountPaid === null || interestData.actualAmountPaid === 0 || interestData.actualAmountPaid === '') {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Enter the Interest Actual Amount to Pay");
            return;
        }

        if (parseInt(interestData.actualAmountPaid) <= 0) {
            setShowErrorAlert(true);
            setAlertErrorMessage("Interest Actual Amount to Pay should be greater than 0");
            return;
        }

        if (interestData.utrNo === null || interestData.utrNo === '') {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Enter the UTR Number");
            return;
        }

        if (interestData.modeOfPayment === null || interestData.modeOfPayment === '') {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Select the Mode Of Payment");
            return;
        }

        if (interestData.paid === null || interestData.paid === false) {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Select the Confirmation for Interest and Refund");
            return;
        }


        const method = 'POST';
        const data = {
            "userBondDetails": {
                "id": id
            },
            "id": interestData.id,
            "actualAmountPaid": parseInt(interestData.actualAmountPaid),
            "actualPaidDate": interestData.actualPaidDate,
            "paid": interestData.paid,
            "utrNo": interestData.utrNo,
            "modeOfPayment": interestData.modeOfPayment,
            "lastUpdatedBy": parseInt(userId),
            "interestStatus": interestData.interestStatus
        }
        var url = "/dividend/interest/payout"
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response)
                setShowYesorNoAlert(false)
                if (response.data.status === 200) {
                    setShowAlert(true);
                    setAlertMessage(response.data.message);
                    setShowAlertClose(() => () => { setShowAlert(false); navigate('/UnitAllowcation'); })
                } else {
                    setAlertErrorMessage(response.data.message);
                    setShowErrorAlert(true);
                    setShowAlertClose(() => () => { setShowAlert(false); navigate('/UnitAllowcation'); })
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });

    }

    const approveRedemption = () => {

        if (redemptionData.actualRedemptionDate === null || redemptionData.actualRedemptionDate === '') {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Select the Redemption Actual Payout Date");
            return;
        }

        if (redemptionData.actualRedemptionAmount === null || redemptionData.actualRedemptionAmount === 0 || redemptionData.actualRedemptionAmount === '') {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Enter the Redemption Actual Amount to Pay");
            return;
        }

        if (parseInt(redemptionData.actualRedemptionAmount) <= 0) {
            setShowErrorAlert(true);
            setAlertErrorMessage("Redemption Actual Amount to Pay should be greater than 0");
            return;
        }

        if (redemptionData.modeOfPayment === null || redemptionData.modeOfPayment === '') {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Select the Mode Of Payment");
            return;
        }

        if (redemptionData.paid === null || redemptionData.paid === false) {
            setShowErrorAlert(true);
            setAlertErrorMessage("Please Select the Confirmation for Redemption");
            return;
        }

        const method = 'POST';
        const data = {
            "id": redemptionData.id,
            "actualRedemptionDate": redemptionData.actualRedemptionDate,
            "actualRedemptionAmount": parseInt(redemptionData.actualRedemptionAmount),
            "paid": redemptionData.paid,
            "modeOfPayment": redemptionData.modeOfPayment,
            "lastUpdatedBy": parseInt(userId)
        }

        var url = "/dividend/updateRedemptionById"
        PostApi(method, url, data, headers)
            .then((response) => {
                setShowYesorNoAlert(false)
                if (response.data.status === 200) {
                    setShowAlert(true);
                    setAlertMessage(response.data.message);
                    setShowAlertClose(() => () => { setShowAlert(false); navigate('/UnitAllowcation'); })
                } else {
                    setAlertErrorMessage(response.data.message);
                    setShowErrorAlert(true);
                    setShowAlertClose(() => () => { setShowAlert(false); navigate('/UnitAllowcation'); })
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });

    }

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">

                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
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
                                    <br />
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
                                                    APPLICATION FOR RESIDENTS TO APPLY FOR CUMULATIVE REDEEMABLE PREFERENCE SHARES <br /> WITH COUPON RATE AT 9% PER ANNUM.
                                                </p>
                                            </div>
                                        ) : clientscheme === 3 ? (
                                            <div>
                                                <p className="gpbond_text" style={{ textAlign: "center" }}>
                                                    APPLICATION FOR NON-RESIDENTS TO APPLY FOR COMPULSORILY CONVERTIBLE
                                                    PREFERENCE SHARES WITH A COUPON RATE AT 9% PER ANNUM.
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>
                                    <br />
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
                                                                                placeholder="Enter Pan Number"
                                                                                className='inputbond'
                                                                                maxLength={10}
                                                                                value={panCard || ""}
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

                                                        </div>
                                                    )}
                                                    {bondId === 1 && (
                                                        <div className='col-lg-12'>
                                                            <div className='row'>
                                                                <div className='col-lg-4 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>NAME OF SOLE/FIRST APPLICANT : </label>
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
                                                                                placeholder="Enter Pan Number"
                                                                                className='inputbond'
                                                                                maxLength={10}
                                                                                value={panCard || ""}
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
                                                                {/* <div className='row' style={{ marginTop: "2%" }}>
                                                                    <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                                                        <span>Nominee Details</span>
                                                                    </div>
                                                                </div> */}


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
                                                                        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
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
                                                        <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", padding: "30px" }}>
                                                            <div>
                                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                    {/* {firstSignImgPreview && (
                                                                        <div>
                                                                            <img src={firstSignImgPreview} onClick={() => setfirstSignView(true)} alt="Selected" className='bondimgPreview' />
                                                                        </div>
                                                                    )} */}
                                                                    {firstSignImgPreview && (
                                                                        (firstSignImgPreview.startsWith("data:application/pdf") || firstSignImgPreview.endsWith(".pdf")) ? (
                                                                            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
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
                                                                            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
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
                                                                            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
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
                                                                    <label className='bond_label'>THIRD APPLICANT'S SIGNATURE</label>
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

                        {/* ------------ Bank Account Details Container ----------- */}

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
                                                        <label className='bond_label'>BRANCH NAME</label>
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
                                                        <label className='bond_label'> ACCOUNT NUMBER: <span className="required">*</span></label>
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

                        {/* ------------ Payment Details Container ----------- */}
                        <div className='register_container'>
                            <div className="gpbond_card col-lg-12">
                                <div className='row'>
                                    <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                        <span>Payment Details</span>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "2%" }}>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>PAYMENT DATE : </label>
                                            <input
                                                id="accountInfoDate"
                                                type="date"
                                                className='inputbond'
                                                readOnly
                                                value={dataList?.lastPaymentDate || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>TOTAL AMOUNT : </label>
                                            <input
                                                id="utr"
                                                type="text"
                                                placeholder="Enter Total Amount"
                                                className='inputbond'
                                                readOnly
                                                value={dataList?.totalAmountPaid || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>PAYMENT STATUS : </label>
                                            <input style={{ backgroundColor: '#F0F0F0' }}
                                                id="ModeofPayment"
                                                className='inputbond'
                                                readOnly
                                                value={dataList?.paymentStatus?.paymentStatus}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ------------ Allocation Details Container ----------- */}
                        <div className='register_container'>
                            <div className='gpbond_card' >
                                <div className="welcome_text" style={{ paddingLeft: "10px" }}>
                                    <span>Unit Allotment Details</span>
                                </div>
                                <div className='row' style={{ marginTop: "2%" }}>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>DATE OF ALLOTMENT : <span style={{ color: "red" }}>*</span></label>
                                            {/* <input
                                                type="date"
                                                placeholder="Enter Allotment Date"
                                                className='inputbond'
                                                min={minDate}
                                                max={currentDate}
                                                readOnly={allocationApproveFlag}
                                                value={allocationDate}
                                                onChange={(e) => setAllocationDate(e.target.value)}
                                                onKeyDown={(e) => {
                                                    e.preventDefault()
                                                }}
                                            /> */}
                                            <DatePicker
                                                showIcon
                                                showYearDropdown
                                                scrollableYearDropdown
                                                selected={allocationDate ? new Date(allocationDate) : null}
                                                onChange={(date) => {
                                                    setAllocationDate(moment(date).format("YYYY-MM-DD"))
                                                }}
                                                className='inputbond'
                                                placeholderText='dd-mm-yyyy'
                                                dateFormat="dd-MM-yyyy"
                                                onKeyDown={(e) => {
                                                    e.preventDefault()
                                                }}
                                                disabled={allocationApproveFlag}
                                                minDate={new Date(minDate)}
                                                maxDate={new Date()}
                                                shouldCloseOnSelect={true}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>NO OF SHARES TO BE ALLOTTED : <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                placeholder="Enter No of Shares to be Allotted"
                                                className='inputbond'
                                                id='allottmentDate'
                                                readOnly={allocationApproveFlag === true || allocationReject === true}
                                                value={noOfAllocationUnits}
                                                max={parseInt(noOfUnits, 10)}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '' || (Number(value) <= noOfUnits && /^\d*$/.test(value))) {
                                                        setNoOfAllocationUnits(value);
                                                    }
                                                }}
                                                onKeyDown={(event) => {
                                                    const key = event.key;
                                                    if (key === 'ArrowUp' || key === 'ArrowDown') {
                                                        event.preventDefault();
                                                    }
                                                    else if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Delete' && key !== 'Tab') {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-4'>
                                        <div className='responsive-column'>
                                            <label className='bond_label'>SHARE CERTIFICATE : </label>
                                            <input
                                                id="certificateImg"
                                                name="certificateImg"
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleCertificateUpload}
                                                onClick={handleFileInputChange}
                                                className="inputbond"
                                                disabled
                                            />
                                            {formErrors.certificateImg && <div className="field_form_alert">
                                                <span>{formErrors.certificateImg}</span>
                                            </div>}
                                            {certificatePreviewImg && (
                                                <div className="preview_card">
                                                    {/* {certificateFlag === false &&
                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                            setCertificateImg(null)
                                                            setCertificatePreviewImg(null)
                                                            const bondImgElement = document.getElementById('certificateImg');
                                                            if (bondImgElement.value !== '') {
                                                                bondImgElement.value = '';
                                                            }
                                                        }} />
                                                    } */}
                                                    {/* <div style={{ width: "100%", height: "150px" }}>
                                                        <PDFViewer pdfUrl={certificatePreviewImg} />
                                                    </div> */}
                                                    <div style={{ width: "100%", height: "100%" }}>
                                                        <button class="preview-button"
                                                            type='button'
                                                            onClick={() => initializeLightGallery(certificatePreviewImg)}
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
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {allotmentConfimFlag === false &&
                                    <>
                                        <div style={{ paddingTop: "5px" }}>
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
                                                <div className='row' style={{ paddingTop: "10px", display: "flex", alignItems: "center" }}>
                                                    <div className='login_label' >
                                                        <input type="radio" disabled={allocationApproveFlag === true || allocationReject === true} id="applicantstatus" onChange={(e) => { setAllocationVerified(true); setAllocationRemarks('') }} checked={allocationVerified === true} />
                                                        <label style={{ paddingLeft: "5px" }}>Approve.</label>
                                                    </div>
                                                </div>
                                                <div className='row' style={{ paddingTop: "10px" }}>
                                                    <div className='login_label' >
                                                        <input type="radio" disabled={allocationApproveFlag === true || allocationReject === true} id="applicantstatus" onChange={(e) => setAllocationVerified(false)} checked={allocationVerified === false} />
                                                        <label style={{ paddingLeft: "5px" }}>Reject.</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div >
                                                {allocationVerified === false &&
                                                    <div style={{ display: "flex", justifyContent: "center", paddingTop: "15px" }}>
                                                        <div className='responsive-column'>
                                                            <label className='bond_label'>REJECTION DATE : <span style={{ color: "red" }}>*</span></label>
                                                            {/* <input
                                                                type="date"
                                                                placeholder="Enter Rejection Date"
                                                                className='inputbond'
                                                                min={minDate}
                                                                max={currentDate}
                                                                readOnly={allocationReject}
                                                                value={rejectionDate}
                                                                onChange={(e) => setRejectionnDate(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    e.preventDefault()
                                                                }}
                                                            /> */}
                                                            <div className='input_contanier'>
                                                                <DatePicker
                                                                    showIcon
                                                                    showYearDropdown
                                                                    scrollableYearDropdown
                                                                    selected={rejectionDate ? new Date(rejectionDate) : null}
                                                                    onChange={(date) => {
                                                                        setRejectionnDate(moment(date).format("YYYY-MM-DD"))
                                                                    }}
                                                                    className='inputscheme'
                                                                    placeholderText='dd-mm-yyyy'
                                                                    dateFormat="dd-MM-yyyy"
                                                                    onKeyDown={(e) => {
                                                                        e.preventDefault()
                                                                    }}
                                                                    disabled={allocationReject}
                                                                    minDate={new Date(minDate)}
                                                                    maxDate={new Date()}
                                                                    shouldCloseOnSelect={true}
                                                                />
                                                            </div>
                                                        </div>
                                                        <textarea
                                                            type="text"
                                                            id="remarks"
                                                            name="remarks"
                                                            className='inputtextarea'
                                                            rows={3}
                                                            readOnly={allocationReject}
                                                            placeholder="Enter the Remarks"
                                                            value={allocationRemarks}
                                                            onChange={(e) => setAllocationRemarks(e.target.value)}
                                                            maxLength={100}
                                                            style={{ width: "fit-content" }}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        {(certificateFlag === false && allocationReject === false) &&
                                            <div style={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
                                                <button
                                                    className="subt_btn"
                                                    type='button'
                                                    onClick={() => ApproveAllocation()}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </div>

                        {/* ------------ Interest and Refund Details Container ----------- */}
                        {(interestData && Object.keys(interestData).length > 0) &&
                            <div className='register_container'>
                                <div className='gpbond_card' >
                                    <div className="welcome_text" style={{ paddingLeft: "10px" }}>
                                        <span>Interest and Refund Details</span>
                                    </div>
                                    <div className="row" style={{ marginTop: "2%" }}>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>TOTAL UNIT'S APPLIED : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.userBondDetails?.noOfUnits}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>TOTAL UNIT'S ALLOTED : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.shareAllocation?.noOfSharesAlloted}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>REFUND AMOUNT : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.refundAmount}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>INTEREST AMOUNT : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.interestAmount || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>TDS AMOUNT: </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.tdsDeducted}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>TDS % : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.tdsPercentage || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>FIXIED PAYOUT DATE : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="date"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.fixedPaidDate || ''}

                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>TOTAL AMOUNT TO PAY : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly
                                                    value={interestData?.totalAmountToPay || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12' />
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>INTEREST PAYOUT DATE : <span className="required_star">*</span></label>
                                                {/* <input
                                                    id="accountInfoDate"
                                                    type="date"
                                                    className='inputbond'
                                                    // min={minDate}
                                                    min={interestData?.fixedPaidDate || moment().format('YYYY-MM-DD')}
                                                    max={currentDate}
                                                    readOnly={interestData?.status === true}
                                                    value={interestData?.actualPaidDate || ''}
                                                    onChange={(e) => {
                                                        setInterestData((prevData) => ({
                                                            ...prevData,
                                                            actualPaidDate: e.target.value,
                                                        }));
                                                    }}
                                                /> */}
                                                <DatePicker
                                                    showIcon
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    selected={interestData?.actualPaidDate ? new Date(interestData?.actualPaidDate) : null}
                                                    onChange={(date) => {
                                                        setInterestData((prevData) => ({
                                                            ...prevData,
                                                            actualPaidDate: moment(date).format("YYYY-MM-DD"),
                                                        }));
                                                    }}
                                                    className='inputbond'
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    disabled={interestData?.status === true}
                                                    minDate={new Date(interestData?.fixedPaidDate)}
                                                    maxDate={new Date()}
                                                    shouldCloseOnSelect={true}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>ACTUAL AMOUNT TO PAY : <span className="required_star">*</span></label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="number"
                                                    className='inputbond'
                                                    readOnly={interestData?.status === true}
                                                    value={interestData?.actualAmountPaid}
                                                    onChange={(e) => {
                                                        setInterestData((prevData) => ({
                                                            ...prevData,
                                                            actualAmountPaid: e.target.value,
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>UTR Number : <span className="required_star">*</span></label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="text"
                                                    className='inputbond'
                                                    readOnly={interestData?.status === true}
                                                    value={interestData?.utrNo}
                                                    onChange={(e) => {
                                                        setInterestData((prevData) => ({
                                                            ...prevData,
                                                            utrNo: e.target.value,
                                                        }));
                                                    }}
                                                    onKeyDown={(e) => {
                                                        const key = e.key;
                                                        const isAlphanumeric = /^[a-zA-Z0-9]$/.test(key);

                                                        const controlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

                                                        if (!isAlphanumeric && !controlKeys.includes(key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>MODE OF PAYMENT : <span className="required_star">*</span></label>
                                                <select
                                                    id="ModeofPayment"
                                                    className={`inputbond`}
                                                    value={interestData?.modeOfPayment || ''}
                                                    disabled={interestData?.status === true}
                                                    onChange={(e) => {
                                                        setInterestData((prevData) => ({
                                                            ...prevData,
                                                            modeOfPayment: e.target.value,
                                                        }));
                                                    }}
                                                >
                                                    <option value="" disabled>Select Mode Of Payment</option>
                                                    {modeOfPaymentList.map((paymentMethod, i) => (
                                                        <option key={i} value={paymentMethod}>{paymentMethod}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>STATUS : <span className="required_star">*</span></label>
                                                <select
                                                    id="ModeofPayment"
                                                    className={`inputbond`}
                                                    value={JSON.stringify(interestData?.interestStatus) || ''}
                                                    disabled={interestData?.status === true}
                                                    onChange={(e) => {
                                                        const selectedValue = JSON.parse(e.target.value);
                                                        setInterestData((prevData) => ({
                                                            ...prevData,
                                                            interestStatus: selectedValue,
                                                        }));
                                                    }}
                                                >
                                                    <option value="" selected disabled>Select Status</option>
                                                    {interestStatusList.map((item, i) => (
                                                        <option key={i} value={JSON.stringify(item)}>{item.status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>INTEREST AND REFUND CONFIRMATION : <span className="required_star">*</span></label>
                                                <div style={{ display: "flex", justifyItems: "left", marginTop: "1%" }}>
                                                    <input
                                                        id="accountInfoDate"
                                                        type="checkbox"
                                                        disabled={interestData?.status === true}
                                                        checked={interestData?.paid || false}
                                                        onChange={(e) => {
                                                            setInterestData((prevData) => ({
                                                                ...prevData,
                                                                paid: e.target.checked,
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(interestData.status === false) &&
                                        <div style={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
                                            <button
                                                className="subt_btn"
                                                type='button'
                                                onClick={() => approveInterest()}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                        {/* ------------ Redemption  Details Container ----------- */}
                        {(redemptionData && Object.keys(redemptionData).length > 0) &&
                            <div className='register_container'>
                                <div className='gpbond_card' >
                                    <div className="welcome_text" style={{ paddingLeft: "10px" }}>
                                        <span>Redemption Details</span>
                                    </div>
                                    <div className="row" style={{ marginTop: "2%" }}>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>FIXIED REDEMPTION DATE : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="date"
                                                    className='inputbond'
                                                    readOnly
                                                    value={redemptionData?.fixedRedemptionDate || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>BONUS PERCENTAGE : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="number"
                                                    className='inputbond'
                                                    readOnly
                                                    value={redemptionData?.bonusPercentage || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>BONUS AMOUNT : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="number"
                                                    className='inputbond'
                                                    readOnly
                                                    value={redemptionData?.bonusAmount || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>REDEMPTION AMOUNT : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="number"
                                                    className='inputbond'
                                                    readOnly
                                                    value={redemptionData?.fixedRedemptionAmount || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>ACTUAL REDEMPTION DATE : </label>
                                                {/* <input
                                                    id="accountInfoDate"
                                                    type="date"
                                                    className='inputbond'
                                                    min={minDate}
                                                    max={currentDate}
                                                    readOnly={redemptionData?.status === true || redemptionData?.active === false}
                                                    value={redemptionData?.actualRedemptionDate || ''}
                                                    onChange={(e) => {
                                                        setRedemptionData((prevData) => ({
                                                            ...prevData,
                                                            actualRedemptionDate: e.target.value,
                                                        }));
                                                    }}
                                                /> */}
                                                <DatePicker
                                                    showIcon
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    selected={redemptionData?.actualRedemptionDate ? new Date(redemptionData?.actualRedemptionDate) : null}
                                                    onChange={(date) => {
                                                        setRedemptionData((prevData) => ({
                                                            ...prevData,
                                                            actualRedemptionDate: moment(date).format("YYYY-MM-DD"),
                                                        }));
                                                    }}
                                                    className='inputbond'
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    disabled={redemptionData?.status === true || redemptionData?.active === false}
                                                    minDate={new Date(minDate)}
                                                    maxDate={new Date(currentDate)}
                                                    shouldCloseOnSelect={true}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>ACTUAL REDEMPTION AMOUNT : </label>
                                                <input
                                                    id="accountInfoDate"
                                                    type="number"
                                                    className='inputbond'
                                                    readOnly={redemptionData?.status === true || redemptionData?.active === false}
                                                    value={redemptionData?.actualRedemptionAmount || ''}
                                                    onChange={(e) => {
                                                        setRedemptionData((prevData) => ({
                                                            ...prevData,
                                                            actualRedemptionAmount: e.target.value,
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column'>
                                                <label className='bond_label'>MODE OF PAYMENT : </label>
                                                <select
                                                    id="ModeofPayment"
                                                    className={`inputbond`}
                                                    value={redemptionData?.modeOfPayment || ''}
                                                    disabled={redemptionData?.status === true || redemptionData?.active === false}
                                                    onChange={(e) => {
                                                        setRedemptionData((prevData) => ({
                                                            ...prevData,
                                                            modeOfPayment: e.target.value,
                                                        }));
                                                    }}
                                                >
                                                    <option value="" disabled>Select Mode Of Payment</option>
                                                    {modeOfPaymentList.map((paymentMethod, i) => (
                                                        <option key={i} value={paymentMethod}>{paymentMethod}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12'>
                                            <div className='responsive-column' style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <label className='bond_label'>REDEMPTION CONFIRMATION : </label>
                                                <div style={{ display: "flex", justifySelf: "left" }}
                                                >
                                                    <input
                                                        id="accountInfoDate"
                                                        type="checkbox"
                                                        disabled={redemptionData?.status === true || redemptionData?.active === false}
                                                        checked={redemptionData?.paid || false}
                                                        onChange={(e) => {
                                                            setRedemptionData((prevData) => ({
                                                                ...prevData,
                                                                paid: e.target.checked,
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(redemptionData.status === false && redemptionData.active === true) &&
                                        <div style={{ display: "flex", justifyContent: 'center', alignItems: "center" }}>
                                            <button
                                                className="subt_btn"
                                                type='button'
                                                onClick={() => approveRedemption()}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                    </div>
                </div>
                {/* {showAlert && (
                    <Alert
                        title={"Success"}
                        msg={alertMessage}
                        open={true}
                        type={"success"}
                        onClose={handleCloseAlert}
                    />
                )} */}
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
                {showYesorNoAlert && (
                    <Alert
                        title={""}
                        msg={alertYesorNoMessage}
                        open={true}
                        type={"yesorno"}
                        onClose={handleYesorNo}
                        onConfirm={handleAllocationApprove}
                    />
                )
                }
                <Alert
                    title={"Success"}
                    msg={alertMessage}
                    open={showAlert}
                    type={"success"}
                    onClose={showAlertClose}
                />
            </div>
        </div>
    )
}

export default ApplicationForm;