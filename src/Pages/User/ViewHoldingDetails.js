import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import MaterialTable from '@material-table/core';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment/moment";
import TableOptions from "../components/TableOptions";
import { gp_logo } from '../components/imageUrl';
import Lightbox from 'react-image-lightbox';
import { Modal } from "react-bootstrap";
import axios from "axios";
import Alert from "../components/Alert";
import { RotatingLines } from 'react-loader-spinner';
import { Container, Row, Col } from 'react-bootstrap';
import { initializeLightGallery } from "../components/lightGalleryInitializer";

const ViewHoldingDetails = () => {

    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [datalist, setDatalist] = useState([]);
    const [paymentlist, setPaymentlist] = useState([]);
    const [userid] = useState(localStorage.getItem("user_id"));
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [activeTab, setActiveTab] = useState(1);

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

    const [allottednumber, setallottednumber] = useState("")
    const [allottedamount, setallottedamount] = useState("")

    const [redemptiondate, setredemptiondate] = useState("");
    const [redemptionamount, setredemptionamount] = useState("");
    const [bonusAmount, setBonusAmount] = useState("");
    const [bonusPerc, setBonusPerc] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [redemptionFlag, setRedemptionFlag] = useState(false);
    const [allocationFlag, setAllocationFlag] = useState(false);
    const [dividendFlag, setDividendFlag] = useState(false);

    const [allocationData, setAllocationData] = useState([])
    const [interestData, setInterestData] = useState([]);

    const [bondImg, setBondImg] = useState()

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        ViewDocuments();
        getDividendView();
        redemption();
    }, []);

    const handleCloseAlert = () => {
        setShowAlert(false);
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

    const location = useLocation();
    const id = location.state.rowData;


    const columns = [
        {
            title: 'Dividend Date',
            field: 'dividend.fixedDividendDate',
            render: rowData => {
                const date = moment(rowData.dividend.fixedDividendDate).format("DD-MM-YYYY")
                return `${date}`;
            }
        },
        {
            title: 'Dividend Amount',
            render: rowData => `₹ ${rowData.dividendAmount.toLocaleString('en-IN')}`
        },
        {
            title: 'TDS Deducted',
            render: rowData => `₹ ${rowData.tdsDeducted} (${rowData.tdsPercentage}%)`
        },
        {
            title: 'Dividend Amount (After TDS)',
            render: rowData => `₹ ${rowData.totalAmountToPay.toLocaleString('en-IN')}`
        },
        // {
        //     title: 'Dividend Amount ($)',
        //     render: rowData => (
        //         rowData.userBondDetails.currencyOfTransfer === 'USD'
        //             ? `$ ${rowData.totalAmountToPayInUsd.toLocaleString('en-IN')}`
        //             : `-` 
        //     )
        // },
        ...(selectedCurrency === "USD" ? [{
            title: 'Dividend Amount ($)',
            render: rowData => (
                rowData.totalAmountToPayInUsd === 0
                    ? `-`
                    : `$ ${rowData.totalAmountToPayInUsd.toLocaleString('en-IN')}`
            )
        }] : []),

        {
            title: 'Payout Date',
            render: rowData => ` ${rowData.payoutDate || '-'}`
        },
        {
            title: 'Mode of Payment',
            field: 'modeOfPayment',
            render: rowData => ` ${rowData.modeOfPayment || '-'}`
        },
        {
            title: 'Status',
            render: rowData => rowData.paid ? 'Paid' : 'Not Paid',
        },
    ];

    const paymentdetails = [
        {
            title: 'S.No',
            field: 'index',
            render: (rowData) => rowData.tableData.index + 1
        },
        {

            title: 'Mode of Payment',
            field: 'modeOfPayment'
        },
        {
            title: 'Amount',
            field: 'amount'
        },
        {
            title: 'Payment Status',
            field: 'paymentStatus.paymentStatus'
        },
        // {
        //     title: 'Receipt Status',
        //     render: rowData => (
        //         rowData.receiptUploaded ? (
        //             <span>Uploaded</span> // If true, show "Uploaded"
        //         ) : (
        //             <span>Not Uploaded</span> // If false, show "Not Uploaded"
        //         )
        //     )
        // },                 
        {
            title: 'Download Receipt',
            render: rowData => (
                <button
                    className="btn btn-primary"
                    onClick={() => RecepitDownload(rowData)}
                    disabled={!rowData.receiptUploaded} // Disable if receipt is not uploaded
                >
                    Receipt
                </button>
            )
        }

    ];
    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    const handleFileInputChange = (event) => {
        event.target.value = '';
    };
    const getDividendView = () => {
        const method = 'POST';
        const url = `/dividend/user/getDividend?id=${id}`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "Divident Details")
                if (response.data.status === 200) {
                    setDatalist(response.data.data);
                    setDividendFlag(true)
                }
                else if (response.data.status === 409) {
                    setDatalist([]);
                    setDividendFlag(false)
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const RecepitDownload = (item) => {
        setLoading(true);
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        axios
            .post(`${process.env.REACT_APP_BASE_URL}/userbond/getReceiptPdf?id=${id}&paymentId=${item.id}`, null, axiosConfig)
            .then((response) => {
                // Assuming response.data contains the direct URL to the PDF file
                const fileUrl = response.data;

                if (!response.data || response.data.byteLength === 0) {
                    alert("Pdf Not uploaded")
                    return;
                }

                // Create a link and download the file using the response URL
                const link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', 'Golden Planet_Receipt.pdf'); // The file name you want
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching PDF:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const ViewInvestment = () => {
        setLoading(true);
        const axiosConfig = {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
        axios.post(`${baseUrl}/userbond/bond/getPdfById?id=${id}`, null, axiosConfig)
            .then((response) => {
                console.log(response)
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Golden Planet_Application.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching PDF:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const DocumentDownload = () => {
        setLoading(true);
        const axiosConfig = {
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
        axios.post(`${baseUrl}/userbond/getBondPdf?id=${id}`, null, axiosConfig)
            .then((response) => {
                const fileUrl = response.data;  // Assuming the response contains a URL
                console.log(response, "lkkl")

                if (!fileUrl) {
                    setShowAlert(true);
                    setAlertMessage("PDF is not uploaded. Please contact the finance team.");
                    return;
                }

                // Create a link to download the file using the URL
                const link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', 'Golden Planet_Certificate.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching PDF:', error);
            })
            .finally(() => {
                setLoading(false);
            });
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

                setBondImg(response.data.data.bond)

                setRelationshipnominee(response.data.data.guardianRelationship)
                setNomineeDob(response.data.data.nomineeDateOfBirth)
                setNomineeguarname(response.data.data.guardianName)

                if ('allocation' in response.data && response.data.allocation !== null) {
                    setAllocationData(response.data.allocation);
                } else {
                    setAllocationData([]);
                }

                if ('interest' in response.data && response.data.interest !== null) {
                    setInterestData(response.data.interest);
                } else {
                    setInterestData([]);
                }

                setPaymentlist(response.data.data.paymentDetails)


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

    const redemption = () => {
        const method = 'POST';
        const url = `/dividend/redemption/bondId?id=${id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "View redemption")
                if (response.data != "") {
                    setRedemptionFlag(true)
                }
                else {
                    setRedemptionFlag(false)
                }

                setredemptionamount(response.data.data.fixedRedemptionAmount);
                setredemptiondate(response.data.data.fixedRedemptionDate);
                setBonusAmount(response.data.data.bonusAmount)
                setBonusPerc(response.data.data.bonusPercentage)
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
            <Header />
            <SidePanel />
            <div className="page_container ">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card" style={{ marginBottom: "10px" }}>

                        <div className='headerProfile row' style={{ marginBottom: "10px" }}>
                            <div className='col-12 col-md-6'>
                                <text className="welcome_text">Holding Documents</text>
                            </div>
                            <div className='col-12 col-md-6 headercontainer' >
                                <button className="appcerdwn" onClick={ViewInvestment}>
                                    <svg class="saveicon" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" stroke-linejoin="round" stroke-linecap="round"></path>
                                    </svg>
                                    Download Application
                                </button>
                                {bondImg &&
                                    <button className="appcerdwn" disabled={allocationData.certificateUploaded === false} onClick={DocumentDownload}>
                                        <svg class="saveicon" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" stroke-linejoin="round" stroke-linecap="round"></path>
                                        </svg>
                                        Download Certificate
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="salesforce-tabs" style={{ marginTop: "1%" }}>
                            <button className={activeTab === 1 ? "active" : ""} onClick={() => handleTabChange(1)}>
                                <span>Investment</span>
                            </button>
                            <button style={{ marginLeft: "5px" }} className={activeTab === 2 ? "active" : ""} onClick={() => handleTabChange(2)}>
                                <span>Payment</span>
                            </button>
                            {dividendFlag &&
                                <button style={{ marginLeft: "5px" }} className={activeTab === 3 ? "active" : ""} onClick={() => handleTabChange(3)}>
                                    <span>Dividend</span>
                                </button>
                            }
                        </div>

                    </div>
                    <div>
                        {activeTab === 1 && (
                            <>
                                <div>
                                    <div className="page_wrapper">
                                        {/* ------------ GPBond ----------- */}
                                        <div className='holding_container'>
                                            <div className='gpbond_card' style={{ marginBottom: "20px" }}>
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
                                                                                {(userType === "RESIDENT INDIAN" && nomineeType === "MAJOR") && (
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
                                                                                {(userType === "RESIDENT INDIAN" && nomineeType === "MAJOR") && (
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
                                                                                                    <div className="preview_card_img">
                                                                                                        <img
                                                                                                            alt=""
                                                                                                            onClick={() => setNomineeUploadPanImgView(true)}
                                                                                                            src={nomineeUploadPanImgPreview}
                                                                                                            className='bondimgPreview'
                                                                                                        />
                                                                                                    </div>
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
                                                                                {(userType === "RESIDENT INDIAN" && nomineeType === "MINOR") && (
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

                                                                                {userType === "NON-RESIDENT INDIAN" &&  nomineeType === "MAJOR"&& (
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

                                                                                {userType === "NON-RESIDENT INDIAN" &&  nomineeType === "MAJOR" && (
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
                                                                                                            <div className="preview_card_img">
                                                                                                                <img
                                                                                                                    alt=""
                                                                                                                    onClick={() => setNomineeUploadPanImgView(true)}
                                                                                                                    src={nomineeUploadPanImgPreview}
                                                                                                                    className='bondimgPreview'
                                                                                                                />
                                                                                                            </div>
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
                                                                                                            <div className="preview_card_img">
                                                                                                                <img
                                                                                                                    alt=""
                                                                                                                    onClick={() => setNomineeUploadPassPortImgView(true)}
                                                                                                                    src={nomineeUploadPassPortImgPreview}
                                                                                                                    className='bondimgPreview'
                                                                                                                />
                                                                                                            </div>
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
                                                                                                <div className="preview_card_img">
                                                                                                    <img
                                                                                                        alt=""
                                                                                                        onClick={() => setNomineeImngView(true)}
                                                                                                        src={nomineeUploadImgPreview}
                                                                                                        className='bondimgPreview'
                                                                                                    />
                                                                                                </div>
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
                                                                                                    <div className="preview_card_img">
                                                                                                        <img
                                                                                                            alt=""
                                                                                                            onClick={() => setSecondApplicantPanView(true)}
                                                                                                            src={secondnomineeUploadPanImgPreview}
                                                                                                            className='bondimgPreview'
                                                                                                        />
                                                                                                    </div>
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
                                                                                                            <div className="preview_card_img">
                                                                                                                <img
                                                                                                                    alt=""
                                                                                                                    onClick={() => setSecondApplicantPanView(true)}
                                                                                                                    src={secondnomineeUploadPanImgPreview}
                                                                                                                    className='bondimgPreview'
                                                                                                                />
                                                                                                            </div>
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
                                                                                                                    className='bondimgPreview'
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
                                                                                                <div className="preview_card_img">
                                                                                                    <img
                                                                                                        alt=""
                                                                                                        onClick={() => setSecondnomineeUploadProfileImgView(true)}
                                                                                                        src={secondnomineeUploadProfileImgPreview}
                                                                                                        className='bondimgPreview'
                                                                                                    />
                                                                                                </div>
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
                                                                                                    <div className="preview_card_img">
                                                                                                        <img
                                                                                                            alt=""
                                                                                                            onClick={() => setThirdNomineeUploadPanImgView(true)}
                                                                                                            src={thirdnomineeUploadPanImgPreview}
                                                                                                            className='bondimgPreview'
                                                                                                        />
                                                                                                    </div>
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
                                                                                                            <div className="preview_card_img">
                                                                                                                <img
                                                                                                                    alt=""
                                                                                                                    onClick={() => setThirdNomineeUploadPanImgView(true)}
                                                                                                                    src={thirdnomineeUploadPanImgPreview}
                                                                                                                    className='bondimgPreview'
                                                                                                                />
                                                                                                            </div>
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
                                                                                                            <div className="preview_card_img">
                                                                                                                <img
                                                                                                                    alt=""
                                                                                                                    // onClick={() => setThirdNomineeUploadPanImgView(true)}
                                                                                                                    src={thirdnomineeUploadPassPortImgPreview}
                                                                                                                    className='bondimgPreview'
                                                                                                                />
                                                                                                            </div>
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
                                                                                                <div className="preview_card_img">
                                                                                                    <img
                                                                                                        alt=""
                                                                                                        onClick={() => setThirdNomineeUploadProfileImgView(true)}
                                                                                                        src={thirdnomineeUploadProfileImgPreview}
                                                                                                        className='bondimgPreview'
                                                                                                    />
                                                                                                </div>
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
                                                                                    {(userType === "RESIDENT INDIAN" && nomineeType === "MAJOR") && (
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
                                                                                    {(userType === "RESIDENT INDIAN" && nomineeType === "MAJOR") && (
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
                                                                                                        <div className="preview_card_img">
                                                                                                            <img
                                                                                                                alt=""
                                                                                                                onClick={() => setNomineeUploadPanImgView(true)}
                                                                                                                src={nomineeUploadPanImgPreview}
                                                                                                                className='bondimgPreview'
                                                                                                            />
                                                                                                        </div>
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
                                                                                    {(userType === "RESIDENT INDIAN" && nomineeType === "MINOR") && (
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
                                                                                                                <div className="preview_card_img">
                                                                                                                    <img
                                                                                                                        alt=""
                                                                                                                        onClick={() => setNomineeUploadPanImgView(true)}
                                                                                                                        src={nomineeUploadPanImgPreview}
                                                                                                                        className='bondimgPreview'
                                                                                                                    />
                                                                                                                </div>
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
                                                                                                                <div className="preview_card_img">
                                                                                                                    <img
                                                                                                                        alt=""
                                                                                                                        onClick={() => setNomineeUploadPassPortImgView(true)}
                                                                                                                        src={nomineeUploadPassPortImgPreview}
                                                                                                                        className='bondimgPreview'
                                                                                                                    />
                                                                                                                </div>
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
                                                                                                    <div className="preview_card_img">
                                                                                                        <img
                                                                                                            alt=""
                                                                                                            onClick={() => setNomineeImngView(true)}
                                                                                                            src={nomineeUploadImgPreview}
                                                                                                            className='bondimgPreview'
                                                                                                        />
                                                                                                    </div>
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
                                                                                        <div className="preview_card_img">
                                                                                            <img
                                                                                                alt=""
                                                                                                onClick={() => setfirstSignView(true)}
                                                                                                src={firstSignImgPreview}
                                                                                                className='bondimgPreview'
                                                                                            />
                                                                                        </div>
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
                                                                                            <div className="preview_card_img">
                                                                                                <img
                                                                                                    alt=""
                                                                                                    onClick={() => setfirstSignView(true)}
                                                                                                    src={firstSignImgPreview}
                                                                                                    className='bondimgPreview'
                                                                                                />
                                                                                            </div>
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
                                                                                            <div className="preview_card_img">
                                                                                                <img
                                                                                                    alt=""
                                                                                                    onClick={() => setSecondSignImgView(true)}
                                                                                                    src={secondSignImgPreview}
                                                                                                    className='bondimgPreview'
                                                                                                />
                                                                                            </div>
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
                                                                                            <div className="preview_card_img">
                                                                                                <img
                                                                                                    alt=""
                                                                                                    onClick={() => setThirdSignImgView(true)}
                                                                                                    src={thirdSignImgPreview}
                                                                                                    className='bondimgPreview'
                                                                                                />
                                                                                            </div>
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
                                                                            <div className="preview_card_img">
                                                                                <img
                                                                                    alt=""
                                                                                    onClick={() => setChequeUploadView(true)}
                                                                                    src={chequeUploadImgPreview}
                                                                                    className='bondimgPreview'
                                                                                />
                                                                            </div>
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
                                                                                <div className="preview_card_img">
                                                                                    <img
                                                                                        alt=""
                                                                                        onClick={() => setChequeUploadView(true)}
                                                                                        src={chequeUploadImgPreview}
                                                                                        className='bondimgPreview'
                                                                                    />
                                                                                </div>
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
                                                                                <div className="preview_card_img">
                                                                                    <img
                                                                                        alt=""
                                                                                        onClick={() => setChequeUploadView(true)}
                                                                                        src={chequeUploadImgPreview}
                                                                                        className='bondimgPreview'
                                                                                    />
                                                                                </div>
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
                                        {(allocationData && Object.keys(allocationData).length > 0) &&
                                            <div className='holding_container'>
                                                <div className='gpbond_card' style={{ marginBottom: "20px" }}>
                                                    <div className='row' style={{ marginTop: "2%" }}>
                                                        <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                                            <span>ALLOTTED DETAILS</span>
                                                        </div>
                                                    </div>
                                                    {/* RI */}
                                                    {allocationData?.rejected === false ?
                                                        <div className="row" style={{ paddingTop: "20px" }}>
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>ALLOTTED SHARES : </label>
                                                                    <input
                                                                        id="allottednumber"
                                                                        type="text"
                                                                        placeholder="Allotted Number"
                                                                        className='inputbond'
                                                                        readOnly
                                                                        value={allocationData?.noOfSharesAlloted}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className='col-lg-4 col-12'>
                                                                <div className='responsive-column'>
                                                                    <label className='bond_label'>ALLOTTED AMOUNT : </label>
                                                                    <input
                                                                        id="allottedamount"
                                                                        type="text"
                                                                        placeholder="Allotted Amount"
                                                                        className='inputbond'
                                                                        readOnly
                                                                        value={allocationData?.allotedAmount}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div style={{ display: "flex", paddingTop: "20px", paddingLeft: "10px", gap: "10px" }}>
                                                            <span style={{ color: "red", paddingLeft: "0px" }}>Rejected Reason:</span>
                                                            <span style={{ color: "red", paddingLeft: "0px" }}>{allocationData?.remarks}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }

                                        {(interestData && Object.keys(interestData).length > 0) &&
                                            <div className='holding_container'>
                                                <div className='gpbond_card' style={{ marginBottom: "20px" }}>
                                                    <div className="welcome_text" style={{ paddingLeft: "10px" }}>
                                                        <span>Interest and Refund Details</span>
                                                    </div>
                                                    <div className="row" style={{ marginTop: "2%" }}>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>REFUND AMOUNT : </label>
                                                                <input
                                                                    id="accountInfoDate"
                                                                    type="text"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={interestData?.refundAmount || "0"}
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
                                                                <label className='bond_label'>TOTAL REFUND AMOUNT: </label>
                                                                <input
                                                                    id="accountInfoDate"
                                                                    type="text"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={interestData?.totalAmountToPay || ''}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>STATUS: </label>
                                                                <input
                                                                    id="accountInfoDate"
                                                                    type="text"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={interestData?.interestStatus?.status || ''}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {redemptionFlag &&
                                            <div className='holding_container'>
                                                <div className='gpbond_card' style={{ marginBottom: "20px" }}>
                                                    <div className='row' style={{ marginTop: "2%" }}>
                                                        <div className="welcome_text" style={{ paddingLeft: "20px" }}>
                                                            <span>REDEMPTION DETAILS </span>
                                                        </div>
                                                    </div>
                                                    {/* RI */}
                                                    <div className="row" style={{ paddingTop: "20px" }}>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>BONUS PERCENTAGE : </label>
                                                                <input
                                                                    id="redemptiondate"
                                                                    type="text"
                                                                    placeholder="BONUS PERCENTAGE"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={bonusPerc}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>BONUS AMOUNT : </label>
                                                                <input
                                                                    id="redemptionamount"
                                                                    type="text"
                                                                    placeholder="REDEMPTION AMOUNT"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={bonusAmount}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{ paddingTop: "20px" }}>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>REDEMPTION DATE : </label>
                                                                <input
                                                                    id="redemptiondate"
                                                                    type="text"
                                                                    placeholder="REDEMPTION DATE"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={moment(redemptiondate).format("DD-MM-YYYY")}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>REDEMPTION AMOUNT : </label>
                                                                <input
                                                                    id="redemptionamount"
                                                                    type="text"
                                                                    placeholder="REDEMPTION AMOUNT"
                                                                    className='inputbond'
                                                                    readOnly
                                                                    value={redemptionamount}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        }
                                        {/* ------------Bank Payment Details Container ----------- */}
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === 2 && (
                            <>
                                {/* RI */}
                                <div style={{ marginTop: "20px" }} className="d-none d-lg-block">
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={paymentdetails}
                                        data={paymentlist}
                                        options={TableOptions()}
                                    />
                                </div>
                                {/* Mobile View */}
                                <div className="mt-4 d-block d-lg-none">
                                    {!paymentlist || (Array.isArray(paymentlist) && paymentlist.length === 0) || (typeof paymentlist === 'object' && !Array.isArray(paymentlist) && Object.keys(paymentlist).length === 0) ? (
                                        <p>No records to display</p>
                                    ) : (
                                        (paymentlist || []).map((item, index) => {
                                            return (
                                                <Row key={item.id}>
                                                    <Col xs={12} md={8} lg={12}>
                                                        <div className="p-3"
                                                            style={{
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                                backgroundColor: '#fff',
                                                                marginBottom: '5%',
                                                            }}
                                                        >
                                                            <div style={{ borderTop: '5px solid #274568', borderRadius: '10px 10px 0 0', }} />
                                                            <div className="p-3">
                                                                <div className="payment-detail">
                                                                    <strong>S.No:</strong>
                                                                    <span> {index + 1}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Amount:</strong>
                                                                    <span> {item.amount}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Mode Of Payment:</strong>
                                                                    <span> {item.modeOfPayment}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Payment Status:</strong>
                                                                    <span> {item.paymentStatus.paymentStatus}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Receipt: </strong>
                                                                    {/* <span> {item.paymentStatus.paymentStatus}</span> */}
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        onClick={() => RecepitDownload(item)}
                                                                        disabled={!item.receiptUploaded}
                                                                    >
                                                                        Download
                                                                    </button>
                                                                </div>
                                                                {



                                                                }
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            );
                                        })
                                    )}
                                </div>

                            </>
                        )}
                        {activeTab === 3 && (
                            <>
                                <div style={{ marginTop: "20px" }} className="d-none d-lg-block">
                                    {/* {datalist.length > 0 && */}
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title={` Dividend Percentage - ${datalist[0].dividendPercentage} %`}
                                        columns={columns}
                                        data={datalist}
                                        options={TableOptions()}
                                    />
                                    {/* } */}
                                </div>
                                <div className="mt-4 d-block d-lg-none">
                                    {!datalist || (Array.isArray(datalist) && datalist.length === 0) || (typeof datalist === 'object' && !Array.isArray(datalist) && Object.keys(datalist).length === 0) ? (
                                        <p>No records to display</p>
                                    ) : (
                                        (datalist || []).map((item) => {
                                            return (
                                                <Row key={item.id}>
                                                    <Col xs={12} md={8} lg={12}>
                                                        <div className="p-3"
                                                            style={{
                                                                borderRadius: '10px',
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                                backgroundColor: '#fff',
                                                                marginBottom: '5%',
                                                            }}
                                                        >
                                                            <div style={{ borderTop: '5px solid #274568', borderRadius: '10px 10px 0 0', }} />
                                                            <div className="p-3">
                                                                <div className="payment-detail">
                                                                    <strong>Dividend Date :</strong>
                                                                    <span>{moment(item.dividend.fixedDividendDate).format('DD-MM-YYYY')}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Dividend Percentage :</strong>
                                                                    <span> {`${item.dividendPercentage} %`}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Dividend Amount :</strong>
                                                                    <span> {`₹ ${item.dividendAmount ? item.dividendAmount.toLocaleString('en-IN') : '0'}`}</span>
                                                                </div>
                                                                {selectedCurrency === "USD" && (
                                                                    <div className="payment-detail">
                                                                        <strong>Dividend Amount ($):</strong>
                                                                        <span>{item.totalAmountToPayInUsd && item.totalAmountToPayInUsd > 0 ? item.totalAmountToPayInUsd.toLocaleString('en-IN') : '-'}</span>
                                                                    </div>
                                                                )}


                                                                <div className="payment-detail">
                                                                    <strong>TDS Deducted :</strong>
                                                                    <span> ₹ {item.tdsDeducted} ({item.tdsPercentage}%)</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Dividend Amount <br /> (After TDS) :</strong>
                                                                    <span> {`₹ ${item.totalAmountToPay ? item.totalAmountToPay.toLocaleString('en-IN') : '0'}`}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Payout Date :</strong>
                                                                    <span> {`${item.payoutDate ? item.payoutDate : '-'}`}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Mode of payment :</strong>
                                                                    <span> {`${item.dividend.modeOfPayment ? item.dividend.modeOfPayment : '-'}`}</span>
                                                                </div>
                                                                <div className="payment-detail">
                                                                    <strong>Status:</strong>
                                                                    <span> {item.paid ? "PAID" : "NOT PAID"}</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            );
                                        })
                                    )}
                                </div>
                            </>


                        )}
                    </div>
                </div>

            </div>
            <Modal className='loader_modal' centered show={loading}>
                <RotatingLines
                    strokeColor="#659DBD"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={loading}
                />
            </Modal>
            {showAlert && (
                <Alert
                    title={""}
                    msg={alertMessage}
                    open={true}
                    type={"error"}
                    onClose={handleCloseAlert}
                />
            )}
        </div>
    )

}

export default ViewHoldingDetails