import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../components/AppProvider";
import Alert from "../components/Alert";
import "../Register.css";
import { gp_logo } from "../components/imageUrl";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { declarationformpdf, samplePdf } from "../components/imageUrl";
import Lightbox from "react-image-lightbox";
import { RiCloseCircleFill } from "react-icons/ri";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileDownload } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { FaCircleInfo } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import moment from "moment";
import { initializeLightGallery } from "../components/lightGalleryInitializer";
import { detectFace, loadModel } from "../components/faceDetection";
import Webcam from "react-webcam";

const UpdateNriociform = () => {
  const location = useLocation();
  const id = location.state.id;

  const [formErrors, setFormErrors] = useState({});
  const { sideBarCollapse } = useSidebar();

  const { PostApi } = useAppContext();

  const navigate = useNavigate();

  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [firstApplicant, setFirstApplicant] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [panCard, setPanCard] = useState("");
  const [passportNo, setpassportNo] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [status, setStatus] = useState("");
  const [accountInfoDate, setAccountInfoDate] = useState("");
  const [utr, setUtr] = useState("");
  const [accountType, setAccountType] = useState("");
  const [modeofPayment, setModeofPayment] = useState("");
  const [detailsofNomine, setDetailsofNomine] = useState("");
  const [clientBondId, setClientBondId] = useState("");
  const [clientDetails, setClientDetails] = useState("");

  const [nomineePan, setNomineePan] = useState("");
  const [detailsecoundapplicant, setDetailsecoundapplicant] = useState("");
  const [pannumbersecondappli, setpannumbersecondappli] = useState("");
  const [passportnumbersecondappli, setPassportnumbersecondappli] =
    useState("");
  const [detailthirdapplicant, setDetailthirdapplicant] = useState("");
  const [pannumberthirdappli, setpannumberthirdappli] = useState("");
  const [passportnumberthirdappli, setPassportnumberthirdappli] = useState("");
  const [paymentType, setPaymentType] = useState([]);
  const [accountNo, setAccountNo] = useState("");
  const [consentChkFlag, setConsentChkFlag] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [noOfUnits, setNoOfUnits] = useState("");
  const [dob, setDob] = useState("");
  const [paymentStatus, setPaymentStatus] = useState();
  const [paymentflag, setPaymentflag] = useState();
  const [paymentStatusflag, setPaymentStatusflag] = useState();

  // Payment Details
  const [amountInCurrency, setAmountInCurrency] = useState("");

  // Bank Account details for Crediting Dividend
  const [ibankCode, setIbankCode] = useState("");
  const [remittanceThroughBank, setremittanceThroughBank] = useState("");
  const [declarationform, setDeclarationform] = useState("");
  const [unitsInWords, setUnitsInWords] = useState("");
  const [amountInWords, setAmountInWords] = useState("");
  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shareFormatter = new Intl.NumberFormat("en-IN");

  const [userType, setUserType] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
  const [alertYesorNoMessage, setAlertYesorNoMessage] = useState("");

  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState("");

  const [firstSignImg, setfirstSignImg] = useState(null);
  const [firstSignImgPreview, setfirstSignImgPreview] = useState(null);
  const [firstSignImgView, setfirstSignView] = useState(false);

  const [secondSignImg, setSecondSignImg] = useState(null);
  const [secondSignImgPreview, setSecondSignImgImgPreview] = useState(null);
  const [secondSignImgView, setSecondSignImgView] = useState(false);

  const [thirdSignImg, setThirdSignImg] = useState(null);
  const [thirdSignImgPreview, setThirdSignImgImgPreview] = useState(null);
  const [thirdSignImgView, setThirdSignImgView] = useState(false);

  const [chequeUploadImg, setChequeUploadImg] = useState(null);
  const [chequeUploadImgPreview, setChequeUploadPreview] = useState(null);
  const [chequeUploadImgView, setChequeUploadImgView] = useState(null);

  const [nomineeUploadImg, setNomineeUploadImg] = useState(null);
  const [nomineeUploadImgPreview, setNomineeUploadImgPreview] = useState(null);
  const [nomineeImgView, setNomineeImgView] = useState(false);

  const [nomineeUploadPanImg, setNomineeUploadPanImg] = useState(null);
  const [nomineeUploadPanImgPreview, setNomineeUploadPanImgPreview] =
    useState(null);
  const [nomineePanView, setNomineePanView] = useState(false);
  const [nomineePassPortView, setNomineePassPortView] = useState(false);

  const [secondNomineeUploadProfileImg, setSecondNomineeUploadProfileImg] =
    useState(null);
  const [
    secondnomineeUploadProfileImgPreview,
    setSecondNomineeUploadProfileImgPreview,
  ] = useState(null);
  const [
    secondnomineeUploadProfileImgView,
    setSecondnomineeUploadProfileImgView,
  ] = useState(false);

  const [secondNomineeUploadPanImg, setSecondNomineeUploadPanImg] =
    useState(null);
  const [
    secondnomineeUploadPanImgPreview,
    setSecondNomineeUploadPanImgPreview,
  ] = useState(null);
  const [secondnomineeUploadPanImgview, setSecondnomineeUploadPanImgview] =
    useState(false);
  const [secondnomineeUploadPassportview, setSecondnomineeUploadPassportview] =
    useState(false);

  const [thirdNomineeUploadProfileImg, setThirdNomineeUploadProfileImg] =
    useState(null);
  const [
    thirdnomineeUploadProfileImgPreview,
    setThirdNomineeUploadProfileImgPreview,
  ] = useState(null);
  const [
    thirdnomineeUploadProfileImgView,
    setThirdNomineeUploadProfileImgView,
  ] = useState(false);
  const [thirdnomineeUploadPanView, setThirdnomineeUploadPanView] =
    useState(false);
  const [thirdnomineeUploadPassportView, setThirdnomineeUploadPassportView] =
    useState(false);

  const [thirdNomineeUploadPanImg, setThirdNomineeUploadPanImg] =
    useState(null);
  const [thirdnomineeUploadPanImgPreview, setThirdNomineeUploadPanImgPreview] =
    useState(null);

  const [nomineeUploadPassPortImg, setNomineeUploadPassPortImg] =
    useState(null);
  const [nomineeUploadPassPortImgPreview, setNomineeUploadPassPortImgPreview] =
    useState(null);

  const [secondNomineeUploadPassPortImg, setSecondNomineeUploadPassPortImg] =
    useState(null);
  const [
    secondnomineeUploadPassPortImgPreview,
    setSecondNomineeUploadPassPortImgPreview,
  ] = useState(null);

  const [thirdNomineeUploadPassPortImg, setThirdNomineeUploadPassPortImg] =
    useState(null);
  const [
    thirdnomineeUploadPassPortImgPreview,
    setThirdNomineeUploadPassPortImgPreview,
  ] = useState(null);

  const [
    selectedthirdApplicantNationality,
    setSelectedThirdApplicantNationality,
  ] = useState("");

  const [
    selectedsecondApplicantNationality,
    setSelectedSecondApplicantNationality,
  ] = useState("");
  const [nomineeminormajor, setNomineeminormajor] = useState("");
  const [relationshipnominee, setRelationshipnominee] = useState("");
  const [nomineeguarname, setNomineeguarname] = useState("");
  const [nomineeDob, setNomineeDob] = useState("");
  const [nomineeList, setNomineeList] = useState([]);

  const [nomineePassport, setNomineePassport] = useState("");

  const [countryType, setCountryType] = useState([]);
  const [selectedCountryType, setSelectedCountryType] = useState("");

  const [selectedCurrency, setSelectedCurrency] = useState("");

  const [nationalityType, setNationalityType] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState("");

  const [declarationformSign, setDeclarationformSign] = useState(null);
  const [declarationformSignImgPreview, setDeclarationformSignImgPreview] =
    useState(null);

  const [createdDate, setCreatedDate] = useState("");
  const [userid] = useState(localStorage.getItem("user_id"));
  const [roleId] = useState(localStorage.getItem("Role_id"));
  const [token] = useState(localStorage.getItem("token"));
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const [relation, setRelation] = useState("");
  const [modalOpenAgree, setModalOpenAgree] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [remarkList, setRemarkList] = useState([]);
  const [remarkModal, setRemarkModal] = useState(false);

  const [maritalList, setMaritalList] = useState([]);
  const [minAmount, setMinAmount] = useState();
  const [maxAmount, setMaxAmount] = useState();
  let validatedate = process.env.REACT_APP_PAYMENT_DATE;

  const [paymentList, setPaymentList] = useState([]);

  const [paymentDetailsArr, setPaymentDetailsArr] = useState([]);

  const maxRows = 6;

  const [paymentId, setPaymentId] = useState("");
  const [userPaymentDate, setUserPaymentDate] = useState("");
  const [paymentUtrNo, setPaymentUtrNo] = useState("");
  const [userPayAmount, setUserPayAmount] = useState("");
  const [userModeOfPayment, setUserModeOfPayment] = useState("");

  const [swiftadviceImg, setswiftadviceImg] = useState(null);
  const [swiftadviceImgPreview, setswiftadviceImgPreview] = useState(null);
  const [swiftadviceImgView, setswiftadviceImgView] = useState(false);
  const [clientBondName, setClientBondName] = useState("");

  const [paymentModal, setPaymentModal] = useState(false);

  const [approvePaymentFlag, setApprovePaymentFlag] = useState(false);
  const [editPaymentFlag, setEditPaymentFlag] = useState(false);

  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [paymentRejectRemark, setPaymentRejectRemark] = useState("");

  const [paymentAlert, setPaymentAlert] = useState(false);
  const [paymentAlertMsg, setPaymentAlertMsg] = useState("");
  const [paymentAlertClose, setPaymentAlertClose] = useState(() => null);
  const [paymentAlertConfirm, setPaymentAlertConfirm] = useState(() => null);
  const [paymentAlertType, setPaymentAlertType] = useState("");

  const [lastPaymentDate, setLastPaymentDate] = useState("");

  const [faceValue, setFaceValue] = useState("");

  const [draftFlag, setDraftFlag] = useState(false);
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userAlert, setUserAlert] = useState(false);
  const [userAlertMsg, setUserAlertMsg] = useState("");
  const [userAlertClose, setUserAlertClose] = useState(() => null);
  const [userAlertConfirm, setUserAlertConfirm] = useState(() => null);
  const [userAlertType, setUserAlertType] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [multiFace, setMultiFace] = useState(false);

  const [webCamImageSrc, setWebCamImgSrc] = useState(null);
  const [webCamImageSrcPreview, setWebCamImgSrcPreview] = useState(null);

  const [photoFieldLabel, setPhotoFieldLabel] = useState("");

  const webcamRef = React.useRef(null);

  useEffect(() => {
    const initializeModel = async () => {
      setLoading(true);
      await loadModel();
      console.log("Model loaded successfully");
      setLoading(false);
    };

    initializeModel();
  }, []);

  useEffect(() => {
    if (roleId !== null && roleId !== "" && roleId !== undefined) {
      ViewDocuments();
      GetallPaymentType();
      getMaritalStatus();
      getModeofPayment();
      GetallCountry("");
      GetallNationality("");
      getNomineeType();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/HoldingTable");
  };

  const handleFileInputChange = (event) => {
    event.target.value = "";
  };

  const handleErrorCloseAlert = () => {
    setShowErrorAlert(false);
    // navigate('/HoldingTable');
  };

  const handleYesorNo = () => {
    setShowYesorNoAlert(false);
    setIsSubmitted(true);
  };

  const GetallCountry = () => {
    const method = "POST";
    const url = `/userbond/countries`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setCountryType(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const GetallCurrency = (value) => {
    const method = "POST";
    const url = "/userbond/currency?country=" + value;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setSelectedCurrency(response.data);
        if (response.data === "INR") {
          setMinAmount(400000);
          setMaxAmount(250000000);
          // setAmountInCurrency(500000);
        } else {
          setMinAmount("");
          setMaxAmount("");
          setAmountInCurrency("");
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const GetallNationality = () => {
    const method = "POST";
    const url = `/user/nationality`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setNationalityType(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const GetallPaymentType = () => {
    const method = "POST";
    const url = `/userbond/payment/types`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setPaymentType(response.data.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const getMaritalStatus = () => {
    const method = "POST";
    const url = `/user/maritalStatus`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setMaritalList(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const getModeofPayment = () => {
    const method = "POST";
    const url = `/userbond/modeOfPayment`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        setPaymentList(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const cellStyle = {
    border: "1px solid black",
    padding: "3px",
    textAlign: "left",
  };

  const cellStyleforPrice = {
    border: "1px solid black",
    padding: "3px",
    textAlign: "right",
  };

  const headerCellStyle = {
    ...cellStyle,
    fontWeight: "normal",
    textAlign: "center",
  };
  const getNomineeType = () => {
    const method = "POST";
    const url = `/userbond/nomineeTypes`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "Nominee List");
        setNomineeList(response.data);
        // setNomineeminormajor(response.data[1])
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  const ViewDocuments = () => {
    const method = "POST";
    const url = `/userbond/id?id=${id}`;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response);
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.paymentDetails)
        ) {
          setPaymentDetailsArr(response.data.data.paymentDetails);
        } else {
          setPaymentDetailsArr([]);
        }

        setLastPaymentDate(response.data.data.lastPaymentDate);

        setFirstApplicant(response.data.data.name);
        setAddress(response.data.data.address);
        setOccupation(response.data.data.occupation);
        setpassportNo(response.data.data.passportNo);
        setFatherName(response.data.data.fatherName);
        setStatus(response.data.data.status);
        setDetailsofNomine(response.data.data.nomineeDetails);
        setNomineePan(response.data.data.nomineePan);
        setBankName(response.data.data.bankName);
        setBranchName(response.data.data.branchName);
        setIfscCode(response.data.data.ifscCode);
        setIbankCode(response.data.data.ibanCode);
        setAmountInCurrency(response.data.data.amount);
        setPrice(response.data.data.amount);
        setUserType(response.data.data.userType);
        setInvestorType(response.data.data.investorType.id);
        setClientBondId(response.data.data.clientBondDetails.id);
        setClientDetails(response.data.data.clientDetails.id);
        setCreatedDate(response.data.data.createdDate);
        setDetailsecoundapplicant(response.data.data.secondApplicant);
        setpannumbersecondappli(response.data.data.secondApplicantPan);
        setDetailthirdapplicant(response.data.data.thirdApplicant);
        setpannumberthirdappli(response.data.data.thirdApplicantPan);
        if (
          response.data.data.accountNo != null &&
          response.data.data.accountNo != ""
        ) {
          setAccountNo(response.data.data.accountNo);
        } else {
          setAccountNo("");
        }
        setConsentChkFlag(response.data.data.consentChkFlag);
        setAccountType(response.data.data.accountType);
        setSelectedNationality(response.data.data.nomineeNationality);
        setSelectedSecondApplicantNationality(
          response.data.data.secondApplicantNationality
        );
        setSelectedThirdApplicantNationality(
          response.data.data.thirdApplicantNationality
        );
        setNomineeminormajor(response.data.data.nomineeType);
        setSelectedCurrency(response.data.data.currencyOfTransfer);
        setSelectedCountryType(response.data.data.countryOfRemittance);
        setDeclarationform(response.data.data.declarationFlag);
        setNomineePassport(response.data.data.nomineePassportNo);
        setremittanceThroughBank(response.data.data.remittanceBank);
        setPassportnumbersecondappli(
          response.data.data.secondApplicantPassport
        );
        setPassportnumberthirdappli(response.data.data.thirdApplicantPassport);
        setRelationshipnominee(response.data.data.guardianRelationship);
        setNomineeDob(response.data.data.nomineeDateOfBirth);
        setNomineeguarname(response.data.data.guardianName);

        setPaymentStatusflag(response.data.data.paymentStatus);
        setDraftFlag(response.data.data.draft);

        // remittanceBank
        if (response.data.data.userPayDate !== null) {
          setAccountInfoDate(
            moment(response.data.data.userPayDate).format("YYYY-MM-DD HH:mm:ss")
          );
        } else {
          setAccountInfoDate("");
        }
        setUtr(response.data.data.userTransactionNo);
        setModeofPayment(response.data.data.modeOfPayment);
        setNoOfUnits(response.data.data.noOfUnits);
        setUnitsInWords(response.data.data.sharesAppliedWords);
        setAmountInWords(response.data.data.amountPaidWords);
        setPaymentStatus(response.data.data.paymentType.id);
        setPaymentflag(response.data.data.paymentVerified);
        setDob(response.data.data.dateOfBirth);
        setRelation(response.data.data.relation);

        setFaceValue(response.data.data.faceValue);

        // const firstsingImageUrl = base64ToImageUrl(response.data.data.firstApplicantSign);
        setfirstSignImgPreview(response.data.data.firstApplicantSign);

        // const secondSignImg = base64ToImageUrl(response.data.data.secondApplicantSign);
        setSecondSignImgImgPreview(response.data.data.secondApplicantSign);

        // const thirdSignImg = base64ToImageUrl(response.data.data.thirdApplicantSign);
        setThirdSignImgImgPreview(response.data.data.thirdApplicantSign);

        // const chequeUpload = base64ToImageUrl(response.data.data.cancelChequeImg);
        setChequeUploadPreview(response.data.data.cancelChequeImg);
        setClientBondName(response.data.data.clientBondDetails.bondName);

        // const declarationSignImg = base64ToImageUrl(response.data.data.declarationSignImg);
        setDeclarationformSignImgPreview(response.data.data.declarationSignImg);

        if (
          response.data.data.applicantRemarks ||
          response.data.data.paymentRemarks ||
          response.data.data.nomineeRemarks
        ) {
          const applicantRemarks = response.data.data.applicantRemarks || [];
          const paymentRemarks = response.data.data.paymentRemarks || [];
          const nomineeRemarks = response.data.data.nomineeRemarks || [];

          setRemarkList([
            ...applicantRemarks,
            ...paymentRemarks,
            ...nomineeRemarks,
          ]);
        } else {
          setRemarkList([]);
        }

        if (response.data.data.nomineePanImg !== null) {
          // const nomineeProfileImg = base64ToImageUrl(response.data.data.nomineePanImg);
          setNomineeUploadPanImgPreview(response.data.data.nomineePanImg);
        } else {
          setNomineeUploadPanImgPreview(null);
        }

        if (response.data.data.nomineePassportImg !== null) {
          // const nomineePassportImage = base64ToImageUrl(response.data.data.nomineePassportImage);
          setNomineeUploadPassPortImgPreview(
            response.data.data.nomineePassportImg
          );
        } else {
          setNomineeUploadPassPortImgPreview(null);
        }

        if (response.data.data.nomineeProfileImg !== null) {
          // const nomineeProfileImg = base64ToImageUrl(response.data.data.nomineeProfileImg);
          setNomineeUploadImgPreview(response.data.data.nomineeProfileImg);
        } else {
          setNomineeUploadImgPreview(null);
        }

        if (response.data.data.secondApplicantPanImg !== null) {
          // const secondNomineePanImg = base64ToImageUrl(response.data.data.secondApplicantPanImg);
          setSecondNomineeUploadPanImgPreview(
            response.data.data.secondApplicantPanImg
          );
        } else {
          setSecondNomineeUploadPanImgPreview(null);
        }

        if (response.data.data.secondApplicantPassportImg !== null) {
          // const secondApplicantPassportImg = base64ToImageUrl(response.data.data.secondApplicantPassportImg);
          setSecondNomineeUploadPassPortImgPreview(
            response.data.data.secondApplicantPassportImg
          );
        } else {
          setSecondNomineeUploadPassPortImgPreview(null);
        }

        if (response.data.data.secondApplicantProfileImg !== null) {
          // const secondNomineeProfileImg = base64ToImageUrl(response.data.data.secondApplicantProfileImg);
          setSecondNomineeUploadProfileImgPreview(
            response.data.data.secondApplicantProfileImg
          );
        } else {
          setSecondNomineeUploadProfileImgPreview(null);
        }

        if (response.data.data.thirdApplicantPanImg !== null) {
          // const thirdNomineePanImg = base64ToImageUrl(response.data.data.thirdApplicantPanImg);
          setThirdNomineeUploadPanImgPreview(
            response.data.data.thirdApplicantPanImg
          );
        } else {
          setThirdNomineeUploadPanImgPreview(null);
        }

        if (response.data.data.thirdApplicantProfileImg !== null) {
          // const thirdNomineeProfile = base64ToImageUrl(response.data.data.thirdApplicantProfileImg);
          setThirdNomineeUploadProfileImgPreview(
            response.data.data.thirdApplicantProfileImg
          );
        } else {
          setThirdNomineeUploadProfileImgPreview(null);
        }

        if (response.data.data.thirdApplicantPassportImg !== null) {
          // const thirdApplicantPassportImg = base64ToImageUrl(response.data.data.thirdApplicantPassportImg);
          setThirdNomineeUploadPassPortImgPreview(
            response.data.data.thirdApplicantPassportImg
          );
        } else {
          setThirdNomineeUploadPassPortImgPreview(null);
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const paymentModalOpen = () => {
    if (paymentDetailsArr.length >= maxRows) {
      setPaymentAlert(true);
      setPaymentAlertType("error");
      setPaymentAlertMsg(`You cannot add more than ${maxRows} Transaction.`);
      setPaymentAlertClose(() => () => setPaymentAlert(false));
      return;
    }

    console.log(paymentDetailsArr[0]);
    if (
      paymentDetailsArr[0] &&
      paymentDetailsArr[0].userBondDetails.userType === "NON-RESIDENT INDIAN" &&
      paymentflag
    ) {
      setPaymentAlert(true);
      setPaymentAlertType("error");
      setPaymentAlertMsg(`You have fully paid for your share application.`);
      setPaymentAlertClose(() => () => setPaymentAlert(false));
      return;
    }

    if (
      selectedCurrency === "INR" &&
      calculateRemainingAmount(paymentDetailsArr, price) === 0
    ) {
      priceExists(1);
      return;
    }
    console.log(paymentDetailsArr);
    setPaymentModal(true);
  };

  const updatePaymentDetail = (key, value) => {
    if (key === "modeOfPayment") {
      setUserModeOfPayment(value);
    }

    if (key === "userPaymentDate") {
      setUserPaymentDate(value);
    }

    if (key === "userTransactionNo") {
      setPaymentUtrNo(value);
    }

    if (key === "amount") {
      setUserPayAmount(value);
      setFormErrors((e) => {
        return {
          ...e,
          modalAlert: "",
        };
      });
    }
  };

  const paymentModalClose = () => {
    setPaymentModal(false);
    setUserModeOfPayment("");
    setUserPaymentDate("");
    setPaymentUtrNo("");
    setUserPayAmount("");
    setPaymentId("");
    setEditPaymentFlag(false);
    setApprovePaymentFlag(false);
    setswiftadviceImgPreview(null);
    setswiftadviceImg(null);
    setPaymentRejectRemark("");
    setFormErrors((e) => {
      return {
        ...e,
        modalAlert: "",
      };
    });
  };

  const editPayment = (item) => {
    setPaymentModal(true);
    setUserModeOfPayment(item.modeOfPayment);
    setUserPaymentDate(item.userPaymentDate);
    setPaymentUtrNo(item.userTransactionNo);
    setUserPayAmount(item.amount);
    setPaymentId(item.id);
    if (item.swiftImg !== null) {
      setswiftadviceImgPreview(item.swiftImg);
      setswiftadviceImg(item.swiftImg);
    } else {
      setswiftadviceImgPreview(null);
      setswiftadviceImg(null);
    }

    if (item.paymentVerified) {
      setApprovePaymentFlag(true);
      setPaymentRejectRemark("");
    } else {
      setApprovePaymentFlag(false);
      if (item.paymentRemarks && item.paymentRemarks.length > 0) {
        const lastRemark =
          item.paymentRemarks[item.paymentRemarks.length - 1].remarks;
        setPaymentRejectRemark(lastRemark);
      }
    }
    setEditPaymentFlag(true);
  };

  const paymentSave = () => {
    var remainingAmount = parseFloat(
      calculateRemainingAmount(paymentDetailsArr, price)
    );
    if (paymentId === "") {
      remainingAmount = remainingAmount + 0;
    } else {
      remainingAmount =
        remainingAmount +
        parseFloat(paymentDetailsArr.find((e) => e.id === paymentId).amount);
    }
    const userAmount = parseFloat(userPayAmount);
    console.log("Remaining Amount:", remainingAmount);
    console.log("User Entered Amount:", userAmount);

    if (userAmount > remainingAmount) {
      setFormErrors((e) => {
        return {
          ...e,
          modalAlert: `The total amount exceeds the allowed value of Rs. ${remainingAmount}. Please adjust the entered amount.`,
        };
      });
      return;
    }

    const url = `/userbond/savePaymentDetails?applicationId=${id}`;
    const data = new FormData();

    if (paymentId != "") {
      data.append("id", paymentId);
    }
    const isAmountInvalid = /^(0+(\.0*)?)$/.test(userPayAmount);
    if (isAmountInvalid) {
      setPaymentAlert(true);
      setPaymentAlertType("error");
      setPaymentAlertMsg("Amount cannot be zero");
      setPaymentAlertClose(() => () => setPaymentAlert(false));
      return;
    }
    data.append("userTransactionNo", paymentUtrNo);
    data.append("amount", userPayAmount);
    data.append("userPaymentDate", userPaymentDate);
    data.append("modeOfPayment", userModeOfPayment);

    if (swiftadviceImg != null) {
      data.append("swiftCopyImg", swiftadviceImg);
    }

    PostApi("POST", url, data, headers)
      .then(async (response) => {
        await handleSaveBond(draftFlag, false);
        if (response.data.status === 200) {
          paymentModalClose();
          setPaymentAlert(true);
          setPaymentAlertType("success");
          setPaymentAlertMsg(response.data.message);
          setPaymentAlertClose(() => () => {
            window.location.reload();
          });
        } else {
          paymentModalClose();
          setPaymentAlert(true);
          setPaymentAlertType("error");
          setPaymentAlertMsg("Something Went Wrong !");
          setPaymentAlertClose(() => () => setPaymentAlert(false));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const priceExists = (e) => {
    setPaymentAlert(true);
    setPaymentAlertType("error");
    setPaymentAlertMsg(
      e === 0
        ? `The total amount exceeds the allowed value of Rs. ${formatter.format(
            price
          )}. Please adjust the entered amount.`
        : "You have fully paid for your share application."
    );
    setPaymentAlertClose(() => () => setPaymentAlert(false));
  };

  const calculateRemainingAmount = (arr, Price) => {
    const totalAmount = arr.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);

    const remainingAmount = parseFloat(Price) - totalAmount;
    return remainingAmount;
  };

  const RecepitDownload = (item) => {
    setLoading(true);
    const axiosConfig = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/userbond/getReceiptPdf?id=${id}&paymentId=${item.id}`,
        null,
        axiosConfig
      )
      .then((response) => {
        // Assuming response.data contains the direct URL to the PDF file
        const fileUrl = response.data;

        if (!fileUrl) {
          setPaymentAlert(true);
          setPaymentAlertMsg(
            "PDF is not uploaded. Please contact the finance team."
          );
          setPaymentAlertClose(() => () => setPaymentAlert(false));
          return;
        }

        // Create a link and download the file using the response URL
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "Golden Planet_Receipt.pdf"); // The file name you want
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.log("Error fetching PDF:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const focusOutValidation = async (label) => {
    if (label === "firstApplicant") {
      if (firstApplicant === "") {
        setFormErrors((e) => {
          return { ...e, firstApplicant: "Please Enter the First Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, firstApplicant: "" };
        });
      }
    } else if (label === "dob") {
      if (dob === "") {
        setFormErrors((e) => {
          return { ...e, dob: "Please Enter Date Of Birth" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, dob: "" };
        });
      }
    } else if (label === "address") {
      if (address === "") {
        setFormErrors((e) => {
          return { ...e, address: "Please Enter Address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, address: "" };
        });
      }
    } else if (label === "occupation") {
      if (occupation === "") {
        setFormErrors((e) => {
          return { ...e, occupation: "Please Enter Occupation" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, occupation: "" };
        });
      }
    } else if (label === "passportNo") {
      if (passportNo === "") {
        setFormErrors((e) => {
          return { ...e, passportNo: "Please Enter Passport Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, passportNo: "" };
        });
      }
    } else if (label === "fatherName") {
      if (fatherName === "") {
        setFormErrors((e) => {
          return { ...e, fatherName: "Please Enter Spouse's / Father's Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, fatherName: "" };
        });
      }
    } else if (label === "status") {
      if (status === "") {
        setFormErrors((e) => {
          return { ...e, status: "Please Enter Marital Status" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, status: "" };
        });
      }
    } else if (label === "nomineePan") {
      if (panPattern.test(nomineePan) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            nomineePan: "Please Enter Valid Nominee's PAN Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, nomineePan: "" };
        });
      }
    } else if (label === "bankName") {
      if (bankName === "") {
        setFormErrors((e) => {
          return { ...e, bankName: "Please Enter Bank Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, bankName: "" };
        });
      }
    } else if (label === "branchName") {
      if (branchName === "") {
        setFormErrors((e) => {
          return { ...e, branchName: "Please Enter Branch Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, branchName: "" };
        });
      }
    } else if (label === "ifscCode") {
      if (ifscCode === "") {
        setFormErrors((e) => {
          return { ...e, ifscCode: "Please Enter IFSC Code" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, ifscCode: "" };
        });
      }
    } else if (label === "accountNo") {
      if (accountNo === "") {
        setFormErrors((e) => {
          return { ...e, accountNo: "Please Enter Account Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, accountNo: "" };
        });
      }
    } else if (label === "pannumbersecondappli") {
      if (panPattern.test(pannumbersecondappli) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            pannumbersecondappli:
              "Please Enter Valid Second Applicant Pan Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pannumbersecondappli: "" };
        });
      }
    } else if (label === "pannumberthirdappli") {
      if (panPattern.test(pannumberthirdappli) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            pannumberthirdappli:
              "Please Enter Valid Third Applicant Pan Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pannumberthirdappli: "" };
        });
      }
    } else if (label === "consentChkFlag") {
      if (!consentChkFlag) {
        setFormErrors((errors) => {
          return {
            ...errors,
            consentChkFlag:
              "Please select the checkbox to confirm the above statement.",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, consentChkFlag: "" };
        });
      }
    } else if (label === "declarationform") {
      if (!declarationform) {
        setFormErrors((errors) => {
          return {
            ...errors,
            declarationform:
              "Please select the checkbox to confirm the above statement.",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, declarationform: "" };
        });
      }
    }
  };

  const onChangeValidation = (e, label) => {
    if (label === "firstApplicant") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, firstApplicant: "Please Enter First Applicant" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, firstApplicant: "" };
        });
      }
    } else if (label === "dob") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, dob: "Please Select Date of Birth" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, dob: "" };
        });
      }
    } else if (label === "address") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, address: "Please Enter address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, address: "" };
        });
      }
    } else if (label === "occupation") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, occupation: "Please Enter Occupation" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, occupation: "" };
        });
      }
    } else if (label === "passportNo") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, passportNo: "Please Enter Passport Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, passportNo: "" };
        });
      }
    } else if (label === "fatherName") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, fatherName: "Please Enter Spouse's / Father's Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, fatherName: "" };
        });
      }
    } else if (label === "status") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, status: "Please Enter Marital Status" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, status: "" };
        });
      }
    } else if (label === "nomineePan") {
      const value = e.target.value;
      if (panPattern.test(value) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            nomineePan: "Please Enter Valid  Nominee's PAN Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, nomineePan: "" };
        });
      }
    } else if (label === "bankName") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, bankName: "Please Enter Bank Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, bankName: "" };
        });
      }
    } else if (label === "accountNo") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, accountNo: "Please Enter Account Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, accountNo: "" };
        });
      }
    } else if (label === "branchName") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, branchName: "Please Enter Branch Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, branchName: "" };
        });
      }
    } else if (label === "ibankCode") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, ibankCode: "Please Enter IBankCode" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, ibankCode: "" };
        });
      }
    } else if (label === "pannumbersecondappli") {
      const value = e.target.value;
      if (panPattern.test(value) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            pannumbersecondappli:
              "Please Enter Valid  Second Applicant Pan Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pannumbersecondappli: "" };
        });
      }
    } else if (label === "ifscCode") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, ifscCode: "Please Enter IFSC Code" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, ifscCode: "" };
        });
      }
    } else if (label === "pannumberthirdappli") {
      const value = e.target.value;
      if (panPattern.test(value) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            pannumberthirdappli:
              "Please Enter Valid Third Nominee's PAN Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pannumberthirdappli: "" };
        });
      }
    } else if (label === "consentChkFlag") {
      const value = e.target.checked;
      if (!value) {
        setFormErrors((errors) => {
          return {
            ...errors,
            consentChkFlag:
              "Please select the checkbox to confirm the above statement.",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, consentChkFlag: "" };
        });
      }
    } else if (label === "declarationform") {
      const value = e.target.checked;
      if (!value) {
        setFormErrors((errors) => {
          return {
            ...errors,
            declarationform:
              "Please select the checkbox to confirm the above statement.",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, declarationform: "" };
        });
      }
    }
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const setFormErrorsAndScroll = (errors) => {
    setFormErrors(errors);

    if (errors.occupation) {
      scrollToElement("occupation");
    } else if (errors.fatherName) {
      scrollToElement("fatherName");
    } else if (errors.firstSignImg) {
      scrollToElement("firstSignImg");
    } else if (errors.secondSignImg) {
      scrollToElement("secoundApplicantSign");
    } else if (errors.thirdSignImg) {
      scrollToElement("thirdApplicantSign");
    } else if (errors.amountincurrency) {
      scrollToElement("amountincurrency");
    } else if (errors.accountNo) {
      scrollToElement("accountNo");
    } else if (errors.accountType) {
      scrollToElement("accountType");
    } else if (errors.bankName) {
      scrollToElement("bankName");
    } else if (errors.branchName) {
      scrollToElement("branchName");
    } else if (errors.paymentId) {
      scrollToElement("paymentId");
    }
  };
  const handleSaveBondvalidation = (event) => {
    event.preventDefault();
    const errors = {};
    // ----------- JOINT ----------
    if (investorType === 2) {
      // if (pannumbersecondappli) {
      //     if (panPattern.test(pannumbersecondappli) === false) {
      //         errors.pannumbersecondappli = "Please Enter Valid Second Applicant Pan Number";
      //     }
      // } else {
      //     delete errors.pannumbersecondappli;
      // }
      // if (pannumberthirdappli) {
      //     if (panPattern.test(pannumberthirdappli) === false) {
      //         errors.pannumberthirdappli = "Please Enter Valid Third Applicant Pan Number";
      //     }
      // } else {
      //     delete errors.pannumberthirdappli;
      // }
      if (
        (secondSignImg === null || secondSignImg === "") &&
        (secondSignImgPreview === null || secondSignImgPreview === "")
      ) {
        errors.secondSignImg = "Please Upload Second Applicant's Signature";
      }
      if (
        (thirdSignImg === null || thirdSignImg === "") &&
        (thirdSignImgPreview === null || thirdSignImgPreview === "")
      ) {
        errors.thirdSignImg = "Please Upload Third Applicant's Signature";
      }
    }
    if (selectedCurrency === "INR") {
      if (ifscCode === "") {
        errors.ifscCode = "Please Select IFSC CODE";
      }
    }
    if (selectedCurrency === "USD") {
      if (accountType === "") {
        errors.accountType = "Please Enter Account Type";
      }
    }
    // --------- Validition ------
    if (firstApplicant === "") {
      errors.firstApplicant = "Please Enter first Applicant Name";
    }
    if (dob === "") {
      errors.dob = "Please Select Date of Birth";
    }
    if (address === "") {
      errors.address = "Please Enter Address";
    }
    if (occupation === "") {
      errors.occupation = "Please Enter Occupation";
    }
    if (passportNo === "") {
      errors.passportNo = "Please Enter PAN Card Number";
    }
    if (fatherName === "") {
      errors.fatherName = "Please Enter Spouse's / Father's Name";
    }
    // if (status === "") {
    //     errors.status = "Please Enter Marital Status"
    // }
    // if (nomineePan) {
    //     if (panPattern.test(nomineePan) === false) {
    //         errors.nomineePan = "Please Enter Valid Nominee's PAN Number";
    //     }
    // } else {
    //     delete errors.nomineePan;
    // }

    if (accountNo === "") {
      errors.accountNo = "Please Enter Account Number";
    }
    if (branchName === "") {
      errors.branchName = "Please Enter Branch Name";
    }
    if (bankName === "") {
      errors.bankName = "Please Enter Bank Name";
    }
    if (
      (chequeUploadImg === null || chequeUploadImg === "") &&
      (chequeUploadImgPreview === null || chequeUploadImgPreview === "")
    ) {
      errors.chequeUploadImg =
        "Please Upload CANCELLED CHEQUE LEAF / BANK STATEMENT / PASSBOOK FRONT PAGE ";
    }
    if (
      (firstSignImg === null || firstSignImg === "") &&
      (firstSignImgPreview === null || firstSignImgPreview === "")
    ) {
      errors.firstSignImg = "Please Upload First Applicant's Signature";
    }
    if (
      consentChkFlag === "" ||
      consentChkFlag === null ||
      consentChkFlag === false
    ) {
      errors.consentChkFlag =
        "Please select the checkbox to confirm the above statement.";
    }
    if (
      declarationform === "" ||
      declarationform === null ||
      declarationform === false
    ) {
      errors.declarationform =
        "Please select the checkbox to confirm the above statement.";
    }
    if (selectedCountryType === "") {
      errors.selectedCountryType = "Please Select Country Type";
    }
    if (selectedCurrency === "") {
      errors.selectedCurrency = "Please Select Currency Type";
    }

    if (accountInfoDate !== "") {
      let selectedDate = new Date(accountInfoDate);
      let minDate = validatedate;

      if (selectedDate < minDate) {
        errors.accountInfoDate = "Please Select after 01-01-2024 00:00";
      }
    }

    setFormErrors(errors);
    setFormErrorsAndScroll(errors);
    // let missingFieldsNote = "";
    // if (!paymentDetailsArr || paymentDetailsArr.length === 0) {
    //     missingFieldsNote = (
    //         <span style={{ color: "red", fontSize: "12px" }}>
    //             Note: Payment details not filled. The form will not be sent to the Golden Planet team.  <br></br>
    //         </span>
    //     );
    // }
    let missingFieldsNote = "";
    if (selectedCurrency === "INR") {
      // if (accountInfoDate === "" || utr === "" || modeofPayment === "") {
      if (!paymentDetailsArr || paymentDetailsArr.length === 0) {
        missingFieldsNote = (
          <span style={{ color: "red", fontSize: "12px" }}>
            Note: Payment details not filled. The form will not sent to the
            Golden Planet team. <br></br>
          </span>
        );
      }
    }
    if (selectedCurrency === "USD") {
      // if (accountInfoDate === "" || utr === "" || modeofPayment === "" || swiftadviceImgPreview === null || swiftadviceImg === "") {
      if (!paymentDetailsArr || paymentDetailsArr.length === 0) {
        missingFieldsNote = (
          <span style={{ color: "red", fontSize: "12px" }}>
            Note: Payment details not filled. The form will not sent to the
            Golden Planet team. <br></br>
          </span>
        );
      }
    }
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      setShowYesorNoAlert(true);
      setAlertYesorNoMessage(
        <div>
          {missingFieldsNote}
          Thank You for applying <br></br>
          Compulsorily Convertible Preference Shares
          <br />
          Click Yes to confirm.
        </div>
      );
    }
  };

  const saveAsDraft = () => {
    setPaymentAlert(true);
    setPaymentAlertMsg(
      "Are you sure you want to save the application as a draft ?"
    );
    setPaymentAlertType("yesorno");
    setPaymentAlertClose(() => () => setPaymentAlert(false));
    setPaymentAlertConfirm(() => () => handleSaveBond(true));
  };

  const handleSaveBond = (draft, alertFlag) => {
    setPaymentAlert(false);
    const url = "/userbond/save";
    const data = new FormData();
    data.append("Id", id);
    data.append("userType", userType);
    data.append("userId", userid);
    data.append("name", firstApplicant);
    data.append("dateOfBirth", dob);
    data.append("address", address);
    data.append("occupation", occupation);
    data.append("passportNo", passportNo);
    data.append("relation", relation);
    data.append("fatherName", fatherName);
    data.append("createdDate", createdDate);
    data.append("status", status);
    data.append("consentChkFlag", consentChkFlag);
    data.append("sharesAppliedWords", unitsInWords);
    data.append("amountPaidWords", priceInWords);
    data.append("paymentVerified", paymentflag);
    data.append("faceValue", faceValue);
    data.append("noOfUnits", noOfUnits);
    data.append("clientBondDetails.Id", clientBondId);
    data.append("clientDetails.Id", clientDetails);
    data.append("nomineeDetails", detailsofNomine);
    data.append("nomineePan", nomineePan);
    data.append("secondApplicant", detailsecoundapplicant);
    data.append("secondApplicantPan", pannumbersecondappli);
    data.append("thirdApplicant", detailthirdapplicant);
    data.append("thirdApplicantPan", pannumberthirdappli);
    data.append("investorType.Id", investorType);
    data.append("noOfLots", 0);
    data.append("noOfShares", 0);
    data.append("amount", price);
    data.append("amountInUsd", 0.0);
    data.append("paymentType.id", paymentStatus);
    data.append("bankName", bankName);
    data.append("accountNo", accountNo);
    data.append("accountType", accountType);
    data.append("branchName", branchName);
    data.append("ifscCode", ifscCode);
    data.append("ibanCode", ibankCode);
    // data.append('declarationFlag', declarationform)
    data.append("remittanceBank", remittanceThroughBank);
    data.append("interestIfscCode", "");
    data.append("remittanceDetails", "");
    data.append("swiftDetails", "");
    data.append("countryOfRemittance", selectedCountryType);
    data.append("currencyOfTransfer", selectedCurrency);
    data.append("firstSign", firstSignImg);
    data.append("secondSign", secondSignImg);
    data.append("thirdSign", thirdSignImg);
    data.append("cancelCheque", chequeUploadImg);
    data.append("nomineeProImg", nomineeUploadImg);
    data.append("nomineePanImage", nomineeUploadPanImg);
    data.append("nomPassportImg", nomineeUploadPassPortImg);
    data.append("nomineeNationality", selectedNationality);
    data.append("nomineePassportNo", nomineePassport);
    data.append("secondAppProImg", secondNomineeUploadProfileImg);
    data.append("secondAppPanImg", secondNomineeUploadPanImg);
    data.append("secondAppPassportImg", secondNomineeUploadPassPortImg);
    data.append(
      "secondApplicantNationality",
      selectedsecondApplicantNationality
    );
    data.append("secondApplicantPassport", passportnumbersecondappli);
    data.append("thirdAppProImg", thirdNomineeUploadProfileImg);
    data.append("thirdAppPanImg", thirdNomineeUploadPanImg);
    data.append("thirdAppPassportImg", thirdNomineeUploadPassPortImg);
    data.append("thirdApplicantNationality", selectedthirdApplicantNationality);
    data.append("thirdApplicantPassport", passportnumberthirdappli);
    data.append("declarationImg", declarationformSign);
    data.append("declarationFlag", declarationform);
    data.append("consentChkFlag", consentChkFlag);
    data.append("paymentStatus.id", paymentStatusflag.id);
    data.append("paymentStatus.paymentStatus", paymentStatusflag.paymentStatus);
    if (lastPaymentDate != null && lastPaymentDate != "") {
      data.append("lastPaymentDate", lastPaymentDate);
    }

    data.append("nomineeType", nomineeminormajor);
    if (nomineeDob != null && nomineeDob != "") {
      data.append("nomineeDateOfBirth", nomineeDob);
    }
    data.append("guardianName", nomineeguarname);
    data.append("guardianRelationship", relationshipnominee);

    data.append("draft", draft);
    if (chequeUploadImgPreview) {
      data.append("cancelCheque", chequeUploadImg);
    } else {
      data.append("cancelCheque", []);
    }

    PostApi("POST", url, data, headers)
      .then((response) => {
        if (response.data.status === 200) {
          if (
            alertFlag === null ||
            alertFlag === undefined ||
            alertFlag != false
          ) {
            setShowAlert(true);
            // setAlertMessage(
            //     <div>
            //         Your Compulsorily Convertible Preference Shares application
            //         <br></br>
            //         is in process.
            //     </div>
            // );
            setAlertMessage(
              <>
                <div
                  className="d-none d-lg-block"
                  dangerouslySetInnerHTML={{
                    __html: draft
                      ? "Your application has been saved as draft."
                      : "Your application for Compulsorily Convertible Preference Shares is currently being processed.",
                  }}
                ></div>

                <div
                  className="d-block d-lg-none txtali alerttxt"
                  dangerouslySetInnerHTML={{
                    __html: draft
                      ? "Your application has been saved as draft."
                      : "Your application for Compulsorily Convertible Preference Shares is currently being processed.",
                  }}
                ></div>
              </>
            );
            setShowYesorNoAlert(false);
          }
        } else if (response.data.status === 409) {
          setAlertErrorMessage(response.data.message);
          setShowErrorAlert(true);
          setShowYesorNoAlert(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openAgreementModal = () => {
    setModalOpenAgree(true);
  };

  const closeAgreementModal = () => {
    setModalOpenAgree(false);
  };

  // ------------ Byte image converter --------
  const base64ToImageUrl = (base64String) => {
    try {
      if (typeof base64String !== "string" || base64String.trim() === "") {
        throw new Error("Invalid Base64 string");
      }

      const paddedBase64String = base64String.padEnd(
        base64String.length + ((4 - (base64String.length % 4)) % 4),
        "="
      );

      const binaryString = window.atob(paddedBase64String);
      const binaryLen = binaryString.length;

      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes.buffer], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error converting Base64 string to image URL:", error);
      return null;
    }
  };

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const thousandsINR = ["", "Thousand", "Lakhs", "Crore"];
  const thousandsUSD = ["", "Thousand", "Million", "Billion", "Trillion"];

  const getChunkWords = (num, currency) => {
    let chunkWords = "";
    if (num >= 100) {
      chunkWords += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num >= 20) {
      chunkWords += tens[Math.floor(num / 10)] + " " + ones[num % 10];
    } else if (num >= 10) {
      chunkWords += teens[num - 10];
    } else if (num > 0) {
      chunkWords += ones[num];
    }
    return chunkWords.trim();
  };

  const getChunks = (num, isINR) => {
    const chunks = [];
    while (num > 0) {
      if (isINR && chunks.length === 1) {
        chunks.push(num % 100);
        num = Math.floor(num / 100);
      } else {
        chunks.push(num % 1000);
        num = Math.floor(num / 1000);
      }
    }
    return chunks;
  };

  const convertToWords = (number, label, selectedCurrency) => {
    if (number === 0) {
      return `Zero ${label} Only`;
    }

    const isINR = selectedCurrency === "INR";
    const thousands = isINR ? thousandsINR : thousandsUSD;

    const chunks = getChunks(number, isINR);
    let words = "";

    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i] !== 0) {
        words = getChunkWords(chunks[i]) + " " + thousands[i] + " " + words;
      }
    }

    if (label === "Shares") {
      return words.trim() + ` ${label} Only`;
    } else {
      return label + ` ${words.trim()} Only`;
    }
  };

  const Currency = amountInCurrency;
  let currencyLabel;
  if (selectedCurrency === "INR") {
    currencyLabel = "Rupee";
  } else if (selectedCurrency === "USD") {
    currencyLabel = "Rupee";
  }
  const priceInWords = convertToWords(
    Currency,
    currencyLabel,
    selectedCurrency
  );

  const imageUploadApi = async (file) => {
    try {
      const url = "/userbond/validateImageFile";
      const data = new FormData();
      data.append("multipartFile", file);

      const response = await PostApi("POST", url, data, headers);

      return response;
    } catch (error) {
      return { success: false, error: "Error uploading image" };
    }
  };

  const handleFirstSign = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, firstSignImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setfirstSignImg(null);
        // setfirstSignImgPreview(null)
        // } else {
        const response = await imageUploadApi(file);

        if (response.data.status === 409) {
          fileInput.value = "";
          setfirstSignImg(null);
          setfirstSignImgPreview(null);
          setFormErrors({ ...formErrors, firstSignImg: response.data.message });
        } else if (response.data.status === 200) {
          setfirstSignImg(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setfirstSignImgPreview(e.target.result);
          };
          reader.readAsDataURL(file);
          setFormErrors({ ...formErrors, firstSignImg: "" });
        }
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          firstSignImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setfirstSignImg(null);
        setfirstSignImgPreview(null);
      }
    }
  };

  const handleSecondSign = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, secondSignImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setSecondSignImg(null);
        // setSecondSignImgImgPreview(null);
        // } else {
        const response = await imageUploadApi(file);

        if (response.data.status === 409) {
          fileInput.value = "";
          setSecondSignImg(null);
          setSecondSignImgImgPreview(null);
          setFormErrors({
            ...formErrors,
            secondSignImg: response.data.message,
          });
        } else if (response.data.status === 200) {
          setSecondSignImg(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setSecondSignImgImgPreview(e.target.result);
          };
          reader.readAsDataURL(file);
          setFormErrors({ ...formErrors, secondSignImg: "" });
        }
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          secondSignImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setSecondSignImg(null);
        setSecondSignImgImgPreview(null);
      }
    }
  };

  const handleThirdSign = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, thirdSignImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setThirdSignImg(null);
        // setThirdSignImgImgPreview(null)
        // } else {
        const response = await imageUploadApi(file);

        if (response.data.status === 409) {
          fileInput.value = "";
          setThirdSignImg(null);
          setThirdSignImgImgPreview(null);
          setFormErrors({ ...formErrors, thirdSignImg: response.data.message });
        } else if (response.data.status === 200) {
          setThirdSignImg(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setThirdSignImgImgPreview(e.target.result);
          };
          reader.readAsDataURL(file);
          setFormErrors({ ...formErrors, thirdSignImg: "" });
        }
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          thirdSignImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setThirdSignImg(null);
        setThirdSignImgImgPreview(null);
      }
    }
  };

  const handleChequeLeafUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, chequeUploadImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setChequeUploadImg(null)
        // setChequeUploadPreview(null)
        // } else {
        setChequeUploadImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setChequeUploadPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, chequeUploadImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          chequeUploadImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setChequeUploadImg(null);
        setChequeUploadPreview(null);
      }
    }
  };

  const handleNomineePanImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, nomineeUploadPanImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setNomineeUploadPanImg(null)
        // setNomineeUploadPanImgPreview(null)
        // } else {
        setNomineeUploadPanImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setNomineeUploadPanImgPreview(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, nomineeUploadPanImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          nomineeUploadPanImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setNomineeUploadPanImg(null);
        setNomineeUploadPanImgPreview(null);
      }
    }
  };

  const handleNomineeProfileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, nomineeUploadImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setNomineeUploadImg(null)
        // setNomineeUploadImgPreview(null)
        // } else {
        setNomineeUploadImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setNomineeUploadImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, nomineeUploadImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          nomineeUploadImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setNomineeUploadImg(null);
        setNomineeUploadImgPreview(null);
      }
    }
  };

  const handleSecondNomineePanImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, secondNomineeUploadPanImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setSecondNomineeUploadPanImg(null)
        // setSecondNomineeUploadPanImgPreview(null)
        // } else {
        setSecondNomineeUploadPanImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setSecondNomineeUploadPanImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, secondNomineeUploadPanImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          secondNomineeUploadPanImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setSecondNomineeUploadPanImg(null);
        setSecondNomineeUploadPanImgPreview(null);
      }
    }
  };

  const handleSecondNomineeProfileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, secondNomineeUploadProfileImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setSecondNomineeUploadProfileImg(null)
        // setSecondNomineeUploadProfileImgPreview(null)
        // } else {
        setSecondNomineeUploadProfileImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setSecondNomineeUploadProfileImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, secondNomineeUploadProfileImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          secondNomineeUploadProfileImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setSecondNomineeUploadProfileImg(null);
        setSecondNomineeUploadProfileImgPreview(null);
      }
    }
  };

  const handleSecondNomineePassPortImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, secondNomineeUploadPassPortImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setSecondNomineeUploadPassPortImg(null)
        // setSecondNomineeUploadPassPortImgPreview(null)
        // } else {
        setSecondNomineeUploadPassPortImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setSecondNomineeUploadPassPortImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, secondNomineeUploadPassPortImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          secondNomineeUploadPassPortImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setSecondNomineeUploadPassPortImg(null);
        setSecondNomineeUploadPassPortImgPreview(null);
      }
    }
  };

  const handleThirdNomineePanImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, thirdNomineeUploadPanImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setThirdNomineeUploadPanImg(null)
        // setThirdNomineeUploadPanImgPreview(null)
        // } else {
        setThirdNomineeUploadPanImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setThirdNomineeUploadPanImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, thirdNomineeUploadPanImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          thirdNomineeUploadPanImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setThirdNomineeUploadPanImg(null);
        setThirdNomineeUploadPanImgPreview(null);
      }
    }
  };

  const handleThirdNomineeProfileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, thirdNomineeUploadProfileImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setThirdNomineeUploadProfileImg(null)
        // setThirdNomineeUploadProfileImgPreview(null)
        // } else {
        setThirdNomineeUploadProfileImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setThirdNomineeUploadProfileImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, thirdNomineeUploadProfileImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          thirdNomineeUploadProfileImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setThirdNomineeUploadProfileImg(null);
        setThirdNomineeUploadProfileImgPreview(null);
      }
    }
  };

  const handleThirdNomineePassPortImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, thirdNomineeUploadPassPortImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setThirdNomineeUploadPassPortImg(null)
        // setThirdNomineeUploadPassPortImgPreview(null)
        // } else {
        setThirdNomineeUploadPassPortImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setThirdNomineeUploadPassPortImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, thirdNomineeUploadPassPortImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          thirdNomineeUploadPassPortImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setThirdNomineeUploadPassPortImg(null);
        setThirdNomineeUploadPassPortImgPreview(null);
      }
    }
  };

  const handleSwiftAdvice = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        setFormErrors({
          ...formErrors,
          swiftadviceImg: "File size should not exceed 500KB",
        });
        fileInput.value = "";
        setswiftadviceImg(null);
        setswiftadviceImgPreview(null);
        // } else {
        setswiftadviceImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setswiftadviceImgPreview(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, setswiftadviceImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          swiftadviceImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setswiftadviceImg(null);
        setswiftadviceImgPreview(null);
      }
    }
  };

  const handleNomineePassportImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".pdf")
      ) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, nomineeUploadPassPortImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setNomineeUploadPassPortImg(null)
        // setNomineeUploadPassPortImgPreview(null)
        // } else {
        setNomineeUploadPassPortImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setNomineeUploadPassPortImgPreview(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, nomineeUploadPassPortImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          nomineeUploadPassPortImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file...",
        });
        setNomineeUploadPassPortImg(null);
        setNomineeUploadPassPortImgPreview(null);
      }
    }
  };

  const openWebCamModal = (label) => {
    setPhotoFieldLabel(label);
    setModalOpen(true);
    setIsWebcamOn(true);

    if (label === "nominee") {
      setNomineeUploadImg(null);
      setNomineeUploadImgPreview(null);
      const id = document.getElementById("nomineeUploadImg");
      if (id) {
        id.value = "";
      }
    } else if (label === "2nominee") {
      setSecondNomineeUploadProfileImg(null);
      setSecondNomineeUploadProfileImgPreview(null);
      const id = document.getElementById("secondNomineeUploadProfileImg");
      if (id) {
        id.value = "";
      }
    } else if (label === "3nominee") {
      setThirdNomineeUploadProfileImg(null);
      setThirdNomineeUploadProfileImgPreview(null);
      const id = document.getElementById("thirdNomineeUploadProfileImg");
      if (id) {
        id.value = "";
      }
    }
  };

  const doneWebCamModal = () => {
    if (photoFieldLabel === "nominee") {
      setNomineeUploadImg(webCamImageSrc);
      setNomineeUploadImgPreview(webCamImageSrcPreview);
      setPhotoFieldLabel("");
    } else if (photoFieldLabel === "2nominee") {
      setSecondNomineeUploadProfileImg(webCamImageSrc);
      setSecondNomineeUploadProfileImgPreview(webCamImageSrcPreview);
      setPhotoFieldLabel("");
    } else if (photoFieldLabel === "3nominee") {
      setThirdNomineeUploadProfileImg(webCamImageSrc);
      setThirdNomineeUploadProfileImgPreview(webCamImageSrcPreview);
      setPhotoFieldLabel("");
    }

    setModalOpen(false);
    setIsWebcamOn(false);
    setShowPreview(false);
  };

  const webCamCapture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const numFaces = await detectFace(imageSrc);
    if (numFaces === -1) {
      console.error("Blazeface model is not loaded yet!");
      setMultiFace(true);
      setShowPreview(false);
      setWebCamImgSrc(null);
      setWebCamImgSrcPreview(null);
    } else if (numFaces > 1) {
      setUserAlert(true);
      setUserAlertType("error");
      setUserAlertMsg("Multiple faces detected");
      setUserAlertClose(() => () => setUserAlert(false));
      setMultiFace(true);
      setShowPreview(false);
      setWebCamImgSrc(null);
      setWebCamImgSrcPreview(null);
    } else if (numFaces === 0) {
      setUserAlert(true);
      setUserAlertType("error");
      setUserAlertMsg("No faces detected");
      setUserAlertClose(() => () => setUserAlert(false));
      setMultiFace(true);
      setShowPreview(false);
      setWebCamImgSrc(null);
      setWebCamImgSrcPreview(null);
    } else {
      setMultiFace(false);
      const file = dataURLtoFile(imageSrc, "webcam_image.jpg");
      setWebCamImgSrc(file);
      setWebCamImgSrcPreview(imageSrc);
      setShowPreview(true);
      setMultiFace(false);
    }
  }, [webcamRef, photoFieldLabel]);

  const closeWebCamModal = () => {
    setModalOpen(false);
    setIsWebcamOn(false);
    setShowPreview(false);

    if (photoFieldLabel === "nominee") {
      setNomineeUploadImg(null);
      setNomineeUploadImgPreview(null);
      setPhotoFieldLabel("");
    } else if (photoFieldLabel === "2nominee") {
      setSecondNomineeUploadProfileImg(null);
      setSecondNomineeUploadProfileImgPreview(null);
      setPhotoFieldLabel("");
    } else if (photoFieldLabel === "3nominee") {
      setThirdNomineeUploadProfileImg(null);
      setThirdNomineeUploadProfileImgPreview(null);
      setPhotoFieldLabel("");
    }
  };

  function dataURLtoFile(dataURL, filename) {
    var byteString = atob(dataURL.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], { type: "image/jpeg" });
    return new File([blob], filename, { type: "image/jpeg" });
  }

  return (
    <div>
      <Header />
      <SidePanel />
      <div className="page_container bond_view">
        <form onSubmit={handleSaveBondvalidation}>
          <div
            className={
              sideBarCollapse ? "main_content " : "main_content collapsed "
            }
          >
            <div className="page_wrapper">
              {/* ------------ GPBond ----------- */}
              <div className="register_container">
                <div className="gpbond_card">
                  <div className="logflx">
                    <img src={gp_logo} alt="no" className="logoimg"></img>
                  </div>
                  <div>
                    <text className="gpbond_text">
                      PRIVATE AND CONFIDENTIAL
                    </text>
                    <text className="gpbond_text">
                      GOLDEN PLANET SENIOR HERITAGE HOMES PRIVATE LIMITED
                    </text>
                    <text className="gpbond_text">
                      CIN: U41000TN2023PTC165149
                    </text>
                    <text className="gpbond_hed">
                      Regd Office: Ananda Nilayam,No.31/10, Arya Gowda Road,
                      West Mambalam,Chennai,600033
                    </text>
                    <br></br>
                    <text
                      className="gpbond_text"
                      style={{ textAlign: "center" }}
                    >
                      APPLICATION FOR NON-RESIDENTS TO APPLY FOR COMPULSORILY
                      CONVERTIBLE PREFERENCE SHARES <br></br>{" "}
                      {clientBondName?.toUpperCase()}
                    </text>
                    <br></br> <br></br>
                    <div className="row">
                      <div className="col-lg">
                        <div className="collg-12">
                          <span className="bond_label">
                            {" "}
                            MODE OF APPLICATION: DIRECT
                          </span>
                          <br></br>
                          <br></br>
                          <span className="bond_label"> To</span>
                          <br></br>
                          <span className="bond_label">
                            The Board of Directors <br></br>
                            Golden Planet Senior Heritage Homes Private Limited{" "}
                            <br></br>Regd. Off: Ananda Nilayam, 31/10, Arya
                            Gowda Road <br></br> West Mambalam, Chennai - 600033
                            <br></br>-------------------------------------
                          </span>
                        </div>
                      </div>
                      <div className="col-lg">
                        <div className="collg-12">
                          <span className="bond_label">
                            {" "}
                            FOR OFFICE USE ONLY
                          </span>
                          <br></br>
                          <span className="bond_label">
                            -------------------------------------
                          </span>
                          <br></br>
                          <span className="bond_label">No.of application</span>
                          <br></br>
                          <span className="bond_label">
                            Folio No. <br></br>
                            Date of Recepit{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="bond_label">Dear Sirs,</span>
                      <br></br>
                      <br></br>
                      <span className="bond_label">
                        I, hereby apply to you for allotment of the Cumulative
                        Redeemable Preference shares without premium to us as
                        stated below. The amount payable on application is shown
                        below is remitted herewith. We hereby agree to accept
                        the above Preference shares applied for, or such lesser
                        number of Preference shares as may be allotted to us. We
                        also understand that those shares will have one voting
                        right for every Preference Shares at Class Meetings of
                        respective shareholders. We undertake that we will sign
                        all such other documents and do all such other acts, if
                        any, necessary on our part to enable us to be registered
                        as the holder(s) of the Preference shares that may be
                        allotted to us. We authorize you to place our name on
                        the Register of Members of the Company as holders of the
                        Preference Shares that may be allotted to us and to
                        register my/our address(es) as given below. We note that
                        the Board of Directors are entitled in their absolute
                        discretion to accept or reject this application in whole
                        or in part without assigning any reasons whatsoever in
                        the event, the amount paid by us is incorrect.
                      </span>
                    </div>
                    <br></br>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="col-lg-8">
                        <table style={tableStyle}>
                          <thead>
                            <tr>
                              <th style={headerCellStyle}>Description</th>
                              <th style={headerCellStyle}>In numbers</th>
                              <th style={headerCellStyle}>In words</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={cellStyle}>
                                No of Preference Shares applied
                              </td>
                              <td style={cellStyleforPrice}>
                                {shareFormatter.format(noOfUnits)}
                              </td>
                              <td style={cellStyle}>{unitsInWords}</td>
                            </tr>
                            <tr>
                              <td style={cellStyle}>Amount paid</td>
                              <td style={cellStyleforPrice}>
                                {formatter.format(amountInCurrency)}
                              </td>
                              <td style={cellStyle}>{amountInWords}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="col-lg">
                        <div
                          className="collg-12"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span className="bond_label">
                            Share Premium amount: Nil
                          </span>
                          <br></br>
                          <br></br>
                          <br></br>
                          {investorType === 2 && (
                            <div className="col-lg-12">
                              <div className="row">
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      NAME OF SOLE/FIRST APPLICANT :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="firstApplicant"
                                      type="text"
                                      placeholder="Enter Name"
                                      className="inputbond"
                                      readOnly
                                      disabled
                                      value={firstApplicant}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      DATE OF BIRTH :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="dob"
                                      type="date"
                                      placeholder="Enter dob"
                                      className="inputbond"
                                      readOnly
                                      disabled
                                      value={dob}
                                    />
                                    {formErrors.dob && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.dob}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      ADDRESS :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="address"
                                      type="text"
                                      placeholder="Enter Address"
                                      className="inputbond"
                                      readOnly
                                      disabled
                                      value={address}
                                      onChange={(e) => {
                                        setAddress(e.target.value);
                                        onChangeValidation(e, "address");
                                      }}
                                      onBlur={() =>
                                        focusOutValidation("address")
                                      }
                                    />
                                    {formErrors.address && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.address}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      OCCUPATION :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="occupation"
                                      type="text"
                                      placeholder="Enter Occupation"
                                      className="inputbond"
                                      value={occupation}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(inputValue)) {
                                          setOccupation(inputValue);
                                          onChangeValidation(e, "occupation");
                                        }
                                      }}
                                      onBlur={() =>
                                        focusOutValidation("occupation")
                                      }
                                    />
                                    {formErrors.occupation && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.occupation}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      PASSPORT NUMBER :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="passportNo"
                                      type="text"
                                      placeholder="Enter Passport Number"
                                      className="inputbond"
                                      maxLength={10}
                                      value={passportNo}
                                      readOnly
                                      disabled
                                      // onChange={(e) => {
                                      //     setpassportNo(e.target.value);
                                      //     onChangeValidation(e, 'passportNo');
                                      // }}
                                      // onBlur={() => focusOutValidation("occupation")}
                                    />
                                    {formErrors.passportNo && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.passportNo}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      SPOUSE'S / FATHER'S NAME :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <select
                                        id="Spousefathername"
                                        className="inputbond"
                                        style={{ width: "90px" }}
                                        value={relation}
                                        onChange={(e) =>
                                          setRelation(e.target.value)
                                        }
                                      >
                                        <option value="FATHER">FATHER</option>
                                        <option value="SPOUSE">SPOUSE</option>
                                      </select>
                                      <input
                                        id="fatherName"
                                        type="text"
                                        placeholder="Enter Spouse's / Father's Name"
                                        className="inputbond"
                                        value={fatherName}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          const regex = /^[a-zA-Z\s]*$/;
                                          if (regex.test(inputValue)) {
                                            setFatherName(inputValue);
                                            onChangeValidation(e, "fatherName");
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation("fatherName")
                                        }
                                      />
                                    </div>
                                    {formErrors.fatherName && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.fatherName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      MARITAL STATUS :{" "}
                                    </label>
                                    <input
                                      id="maritalstatus"
                                      type="text"
                                      placeholder="Enter Marital Status"
                                      className="inputbond"
                                      value={status}
                                      maxLength={50}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(inputValue)) {
                                          setStatus(inputValue);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* ---------- test code----- */}
                              <div className="row">
                                {/* <div className='col-lg-6 col-12'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>NATIONALITY / NAME OF THE NOMINEE : </label>
                                                                        <div style={{ display: "flex", gap: '10px' }}>
                                                                            <select
                                                                                className='inputbond'
                                                                                style={{ width: "130px" }}
                                                                                value={selectedNationality}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    setSelectedNationality(value);

                                                                                    if (value === 'INDIAN') {
                                                                                        setNomineePassport('');
                                                                                        setNomineeUploadPassPortImg(null);
                                                                                        setNomineeUploadPassPortImgPreview(null);
                                                                                        const passportImgElement = document.getElementById('nomineeUploadPassPortImg');
                                                                                        if (passportImgElement && passportImgElement.value !== '') {
                                                                                            passportImgElement.value = '';
                                                                                        }
                                                                                    } else if (value === 'AMERICAN') {
                                                                                        setNomineePan('');
                                                                                        setNomineeUploadPanImg(null);
                                                                                        setNomineeUploadPanImgPreview(null);
                                                                                        const panImgElement = document.getElementById('nomineeUploadPanImg');
                                                                                        if (panImgElement && panImgElement.value !== '') {
                                                                                            panImgElement.value = '';
                                                                                        }
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <option value="" disabled>NATIONALITY</option>
                                                                                {nationalityType.map((type, index) => (
                                                                                    <option key={index} value={type}>
                                                                                        {type}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <input
                                                                                id="nomineeName"
                                                                                type="text"
                                                                                placeholder="Enter Nominee's Name"
                                                                                className='inputbond'
                                                                                value={detailsofNomine}
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value;
                                                                                    const regex = /^[a-zA-Z\s]*$/;
                                                                                    if (regex.test(inputValue)) {
                                                                                        setDetailsofNomine(inputValue);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div> */}
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      NATIONALITY :
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <select
                                        className="inputbond"
                                        value={selectedNationality}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setSelectedNationality(value);

                                          if (value === "INDIAN") {
                                            setNomineePassport("");
                                            setNomineeUploadPassPortImg(null);
                                            setNomineeUploadPassPortImgPreview(
                                              null
                                            );
                                            const passportImgElement =
                                              document.getElementById(
                                                "nomineeUploadPassPortImg"
                                              );
                                            if (
                                              passportImgElement &&
                                              passportImgElement.value !== ""
                                            ) {
                                              passportImgElement.value = "";
                                            }
                                          } else if (value === "AMERICAN") {
                                            setNomineePan("");
                                            setNomineeUploadPanImg(null);
                                            setNomineeUploadPanImgPreview(null);
                                            const panImgElement =
                                              document.getElementById(
                                                "nomineeUploadPanImg"
                                              );
                                            if (
                                              panImgElement &&
                                              panImgElement.value !== ""
                                            ) {
                                              panImgElement.value = "";
                                            }
                                          }
                                        }}
                                      >
                                        <option value="" disabled>
                                          NATIONALITY
                                        </option>
                                        {nationalityType.map((type, index) => (
                                          <option key={index} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      TYPE / NAME OF THE NOMINEE :{" "}
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <select
                                        id="Spousefathername"
                                        className="inputbond"
                                        style={{ width: "90px" }}
                                        value={nomineeminormajor}
                                        onChange={(e) => {
                                          const selectedValue = e.target.value;
                                          setNomineeminormajor(selectedValue);
                                          if (selectedValue === "MAJOR") {
                                            setNomineeDob("");
                                            setNomineeguarname("");
                                            setRelationshipnominee("");
                                          } else if (
                                            selectedValue === "MINOR"
                                          ) {
                                            setNomineePan("");
                                            setNomineeUploadPanImg(null);
                                            setNomineeUploadPanImgPreview(null);
                                            setNomineeUploadImg(null);
                                            setNomineeUploadImgPreview(null);
                                          }
                                        }}
                                      >
                                        <option value="" disabled>
                                          Select Type of Nominee{" "}
                                        </option>
                                        {nomineeList.map((paymentMethod, i) => (
                                          <option key={i} value={paymentMethod}>
                                            {paymentMethod}
                                          </option>
                                        ))}
                                      </select>

                                      <input
                                        id="detailsofNomine"
                                        type="text"
                                        placeholder="Enter Nominee's Name"
                                        className="inputbond"
                                        maxLength={50}
                                        value={detailsofNomine}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          const regex = /^[a-zA-Z\s]*$/;
                                          if (regex.test(inputValue)) {
                                            setDetailsofNomine(inputValue);
                                            onChangeValidation(
                                              e,
                                              "detailsofNomine"
                                            );
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation("detailsofNomine")
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                {selectedNationality === "INDIAN" &&
                                  nomineeminormajor === "MAJOR" && (
                                    <>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            NOMINEE'S PAN NUMBER:
                                          </label>
                                          <input
                                            id="nomineepannumber"
                                            type="text"
                                            placeholder="Enter Nominee's PAN Number"
                                            className="inputbond"
                                            value={nomineePan}
                                            maxLength={10}
                                            onChange={(e) => {
                                              const inputValue =
                                                e.target.value.toUpperCase();
                                              const regex = /^[A-Z0-9]*$/;
                                              if (regex.test(inputValue)) {
                                                setNomineePan(inputValue);
                                              }
                                            }}
                                            onBlur={() =>
                                              focusOutValidation("nomineePan")
                                            }
                                          />
                                          {formErrors.nomineePan && (
                                            <div className="field_form_alert">
                                              <span>
                                                {formErrors.nomineePan}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            UPLOAD NOMINEE'S PAN :
                                          </label>
                                          <input
                                            id="nomineeUploadPanImg"
                                            name="nomineeUploadPanImg"
                                            type="file"
                                            accept=".jpg,.png,.pdf"
                                            onChange={handleNomineePanImgUpload}
                                            onClick={handleFileInputChange}
                                            className="inputbond"
                                          />
                                          <span style={{ fontSize: "10px" }}>
                                            Note (.png, .jpeg, .jpg or .pdf)
                                          </span>
                                          {formErrors.nomineeUploadPanImg && (
                                            <div className="field_form_alert">
                                              <span>
                                                {formErrors.nomineeUploadPanImg}
                                              </span>
                                            </div>
                                          )}
                                          {nomineePanView && (
                                            <Lightbox
                                              mainSrc={
                                                nomineeUploadPanImgPreview
                                              }
                                              onCloseRequest={() =>
                                                setNomineePanView(false)
                                              }
                                              onImageLoad={() => {
                                                window.dispatchEvent(
                                                  new Event("resize")
                                                );
                                              }}
                                            />
                                          )}
                                          {/* {nomineeUploadPanImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={nomineeUploadPanImgPreview} onClick={() => setNomineePanView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                          {nomineeUploadPanImgPreview &&
                                            (nomineeUploadPanImgPreview.startsWith(
                                              "data:application/pdf"
                                            ) ||
                                            nomineeUploadPanImgPreview.endsWith(
                                              ".pdf"
                                            ) ? (
                                              <div
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                }}
                                              >
                                                <button
                                                  class="preview-button"
                                                  type="button"
                                                  onClick={() =>
                                                    initializeLightGallery(
                                                      nomineeUploadPanImgPreview
                                                    )
                                                  }
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
                                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                      <polyline points="14 2 14 8 20 8"></polyline>
                                                      <line
                                                        x1="16"
                                                        y1="13"
                                                        x2="8"
                                                        y2="13"
                                                      ></line>
                                                      <line
                                                        x1="16"
                                                        y1="17"
                                                        x2="8"
                                                        y2="17"
                                                      ></line>
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
                                                  onClick={() =>
                                                    setNomineePanView(true)
                                                  }
                                                  src={
                                                    nomineeUploadPanImgPreview
                                                  }
                                                  className="img_preview"
                                                />
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                {selectedNationality === "AMERICAN" &&
                                  nomineeminormajor === "MAJOR" && (
                                    <>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            NOMINEE'S PASSPORT NUMBER :
                                          </label>
                                          <input
                                            id="nomineepassportnumber"
                                            type="text"
                                            placeholder="Enter Nominee's Passport Number :"
                                            className="inputbond"
                                            maxLength={10}
                                            value={nomineePassport}
                                            onChange={(e) => {
                                              const inputValue =
                                                e.target.value.toUpperCase();
                                              const regex = /^[A-Z0-9]*$/;
                                              if (regex.test(inputValue)) {
                                                setNomineePassport(inputValue);
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            UPLOAD NOMINEE'S PASSPORT :
                                          </label>
                                          <input
                                            id="nomineeUploadPassPortImg"
                                            name="nomineeUploadPassPortImg"
                                            type="file"
                                            accept=".jpg,.png,.pdf"
                                            onChange={
                                              handleNomineePassportImgUpload
                                            }
                                            onClick={handleFileInputChange}
                                            className="inputbond"
                                          />
                                          <span style={{ fontSize: "10px" }}>
                                            Note (.png, .jpeg, .jpg or .pdf)
                                          </span>
                                          {formErrors.nomineeUploadPassPortImg && (
                                            <div className="field_form_alert">
                                              <span>
                                                {
                                                  formErrors.nomineeUploadPassPortImg
                                                }
                                              </span>
                                            </div>
                                          )}
                                          {nomineePassPortView && (
                                            <Lightbox
                                              mainSrc={
                                                nomineeUploadPassPortImgPreview
                                              }
                                              onCloseRequest={() =>
                                                setNomineePassPortView(false)
                                              }
                                              onImageLoad={() => {
                                                window.dispatchEvent(
                                                  new Event("resize")
                                                );
                                              }}
                                            />
                                          )}
                                          {/* {nomineeUploadPassPortImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={nomineeUploadPassPortImgPreview} onClick={() => setNomineePassPortView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}

                                          {nomineeUploadPassPortImgPreview &&
                                            (nomineeUploadPassPortImgPreview.startsWith(
                                              "data:application/pdf"
                                            ) ||
                                            nomineeUploadPassPortImgPreview.endsWith(
                                              ".pdf"
                                            ) ? (
                                              <div
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                }}
                                              >
                                                <button
                                                  class="preview-button"
                                                  type="button"
                                                  onClick={() =>
                                                    initializeLightGallery(
                                                      nomineeUploadPassPortImgPreview
                                                    )
                                                  }
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
                                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                      <polyline points="14 2 14 8 20 8"></polyline>
                                                      <line
                                                        x1="16"
                                                        y1="13"
                                                        x2="8"
                                                        y2="13"
                                                      ></line>
                                                      <line
                                                        x1="16"
                                                        y1="17"
                                                        x2="8"
                                                        y2="17"
                                                      ></line>
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
                                                  onClick={() =>
                                                    setNomineePassPortView(true)
                                                  }
                                                  src={
                                                    nomineeUploadPassPortImgPreview
                                                  }
                                                  className="img_preview"
                                                />
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                {nomineeminormajor === "MINOR" && (
                                  <>
                                    <div className="col-lg-4 col-12">
                                      <div className="responsive-column">
                                        <label className="bond_label">
                                          NOMINEE'S DATE OF BIRTH :{" "}
                                        </label>
                                        {/* <input
                                                                                    id="nomineeDob"
                                                                                    type="date"
                                                                                    placeholder="Enter Nominee Date of Birth"
                                                                                    className='inputbond'
                                                                                    value={nomineeDob}
                                                                                    onChange={(e) => {
                                                                                        setNomineeDob(e.target.value)
                                                                                        onChangeValidation(e, 'nomineeDob');
                                                                                    }}
                                                                                    onBlur={() => focusOutValidation("nomineeDob")}
                                                                                    onKeyDown={(e) => e.preventDefault()}
                                                                                    max={new Date().toISOString().split("T")[0]}
                                                                                /> */}
                                        <DatePicker
                                          showIcon
                                          showYearDropdown
                                          scrollableYearDropdown
                                          yearDropdownItemNumber={100}
                                          selected={
                                            nomineeDob
                                              ? new Date(nomineeDob)
                                              : null
                                          }
                                          onChange={(date) => {
                                            setNomineeDob(
                                              moment(date).format("YYYY-MM-DD")
                                            );
                                          }}
                                          className="inputbond"
                                          placeholderText="dd-mm-yyyy"
                                          dateFormat="dd-MM-yyyy"
                                          maxDate={new Date()}
                                          onKeyDown={(e) => {
                                            e.preventDefault();
                                          }}
                                          shouldCloseOnSelect={true}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                      <div className="responsive-column">
                                        <label className="bond_label">
                                          GUARDIAN NAME :
                                        </label>
                                        <input
                                          id="nomineeguarname"
                                          type="text"
                                          placeholder="Enter Guardian Name"
                                          className="inputbond"
                                          maxLength={50}
                                          value={nomineeguarname}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setNomineeguarname(inputValue);
                                              onChangeValidation(
                                                e,
                                                "nomineeguarname"
                                              );
                                            }
                                          }}
                                          onBlur={() =>
                                            focusOutValidation(
                                              "nomineeguarname"
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                      <div className="responsive-column">
                                        <label className="bond_label">
                                          GUARDIAN RELATIONSHIP :
                                        </label>
                                        <input
                                          id="relationshipnominee"
                                          type="text"
                                          placeholder="Enter Guardian Relationship"
                                          className="inputbond"
                                          maxLength={50}
                                          value={relationshipnominee}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setRelationshipnominee(
                                                inputValue
                                              );
                                              onChangeValidation(
                                                e,
                                                "relationshipnominee"
                                              );
                                            }
                                          }}
                                          onBlur={() =>
                                            focusOutValidation(
                                              "relationshipnominee"
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD NOMINEE'S PHOTO /
                                      <span
                                        onClick={() =>
                                          openWebCamModal("nominee")
                                        }
                                        style={{
                                          color: "blue",
                                          cursor: "pointer",
                                          paddingLeft: "5px",
                                        }}
                                      >
                                        Click Camera
                                      </span>{" "}
                                      :
                                    </label>
                                    <input
                                      id="jointNomineePhotoUpload"
                                      type="file"
                                      accept=".jpg,.png,.pdf"
                                      onChange={handleNomineeProfileUpload}
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg, .jpg or .pdf)
                                    </span>
                                    {formErrors.nomineeUploadImg && (
                                      <div className="field_form_alert">
                                        <span>
                                          {formErrors.nomineeUploadImg}
                                        </span>
                                      </div>
                                    )}
                                    {/* {nomineeUploadImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={nomineeUploadImgPreview} onClick={() => setNomineeImgView(true)} alt="No" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {nomineeUploadImgPreview &&
                                      (nomineeUploadImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      nomineeUploadImgPreview.endsWith(
                                        ".pdf"
                                      ) ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                nomineeUploadImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setNomineeImgView(true)
                                            }
                                            src={nomineeUploadImgPreview}
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {nomineeImgView && (
                                      <Lightbox
                                        mainSrc={nomineeUploadImgPreview}
                                        onCloseRequest={() =>
                                          setNomineeImgView(false)
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                                {/* <div className='col-lg-6 col-md-6'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>
                                                                            {selectedNationality === "INDIAN" ? "NOMINEE'S PAN NUMBER :" : "NOMINEE'S PASSPORT NUMBER :"}
                                                                        </label>
                                                                        {selectedNationality === "INDIAN" ? (
                                                                            <input
                                                                                id="nomineepannumber"
                                                                                type="text"
                                                                                placeholder="Enter Nominee's PAN Number"
                                                                                className='inputbond'
                                                                                value={nomineePan}
                                                                                maxLength={10}
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value.toUpperCase();
                                                                                    const regex = /^[A-Z0-9]*$/;
                                                                                    if (regex.test(inputValue)) {
                                                                                        setNomineePan(inputValue);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                id="nomineepassportnumber"
                                                                                type="text"
                                                                                placeholder="Enter Nominee's Passport Number : "
                                                                                className='inputbond'
                                                                                value={nomineePassport}
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value.toUpperCase();
                                                                                    const regex = /^[A-Z0-9]*$/;
                                                                                    if (regex.test(inputValue)) {
                                                                                        setNomineePassport(inputValue);
                                                                                    }
                                                                                }}
                                                                            // onChange={(e) => setNomineePassport(e.target.value)}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-6 col-md-6'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>
                                                                            {selectedNationality === "INDIAN" ? "UPLOAD NOMINEE'S PAN :" : "UPLOAD NOMINEE'S PASSPORT :"}
                                                                        </label>
                                                                        {selectedNationality === "INDIAN" ? (
                                                                            <>
                                                                                <input
                                                                                    id="nomineeUploadPanImg"
                                                                                    name="nomineeUploadPanImg"
                                                                                    type="file"
                                                                                    accept='.jpg,.png,.pdf'
                                                                                    onChange={handleNomineePanImgUpload}
                                                                                    onClick={handleFileInputChange}
                                                                                    className="inputbond"
                                                                                />
                                                                                <span style={{ fontSize: '10px' }}>Note (.png, .jpeg, .jpg or .pdf)</span>
                                                                                {nomineeUploadPanImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={nomineeUploadPanImgPreview} onClick={() => setNomineePanView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )}
                                                                                {nomineePanView && (
                                                                                    <Lightbox
                                                                                        mainSrc={nomineeUploadPanImgPreview}
                                                                                        onCloseRequest={() => setNomineePanView(false)}
                                                                                        onImageLoad={() => {
                                                                                            window.dispatchEvent(new Event('resize'));
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <input
                                                                                    id="nomineeUploadPassPortImg"
                                                                                    name="nomineeUploadPassPortImg"
                                                                                    type="file"
                                                                                    accept='.jpg,.png,.pdf'
                                                                                    onChange={handleNomineePassportImgUpload}
                                                                                    onClick={handleFileInputChange}
                                                                                    className="inputbond"
                                                                                />
                                                                                <span style={{ fontSize: '10px' }}>Note (.png, .jpeg, .jpg or .pdf)</span>
                                                                                {nomineeUploadPassPortImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={nomineeUploadPassPortImgPreview} onClick={() => setNomineePassPortView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )}
                                                                                {nomineePassPortView && (
                                                                                    <Lightbox
                                                                                        mainSrc={nomineeUploadPassPortImgPreview}
                                                                                        onCloseRequest={() => setNomineePassPortView(false)}
                                                                                        onImageLoad={() => {
                                                                                            window.dispatchEvent(new Event('resize'));
                                                                                        }}
                                                                                    />
                                                                                )}

                                                                            </>

                                                                        )}



                                                                    </div>
                                                                </div> */}
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      NATIONALITY / NAME OF THE SECOND APPLICANT
                                      :{" "}
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <select
                                        className="inputbond"
                                        style={{ width: "130px" }}
                                        value={
                                          selectedsecondApplicantNationality
                                        }
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setSelectedSecondApplicantNationality(
                                            value
                                          );

                                          if (value === "INDIAN") {
                                            setPassportnumbersecondappli("");
                                            setSecondNomineeUploadPassPortImg(
                                              null
                                            );
                                            setSecondNomineeUploadPassPortImgPreview(
                                              null
                                            );

                                            const secondpassportImgElement =
                                              document.getElementById(
                                                "secondNomineeUploadPassPortImg"
                                              );
                                            if (
                                              secondpassportImgElement &&
                                              secondpassportImgElement.value !==
                                                ""
                                            ) {
                                              secondpassportImgElement.value =
                                                "";
                                            }
                                          } else if (value === "AMERICAN") {
                                            setpannumbersecondappli("");
                                            setSecondNomineeUploadPanImg(null);
                                            setSecondNomineeUploadPanImgPreview(
                                              null
                                            );
                                            const secondpanImgElement =
                                              document.getElementById(
                                                "secondNomineeUploadPanImg"
                                              );
                                            if (
                                              secondpanImgElement &&
                                              secondpanImgElement.value !== ""
                                            ) {
                                              secondpanImgElement.value = "";
                                            }
                                          }
                                        }}
                                      >
                                        <option value="" disabled>
                                          NATIONALITY
                                        </option>
                                        {nationalityType.map((type, index) => (
                                          <option key={index} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                      </select>
                                      {/* <select
                                                                                className='inputbond'
                                                                                style={{ width: "130px" }}
                                                                                value={selectedsecondApplicantNationality}
                                                                                onChange={(e) => setSelectedSecondApplicantNationality(e.target.value)}
                                                                            >
                                                                                <option value="" disabled>NATIONALITY</option>
                                                                                {nationalityType.map((type, index) => (
                                                                                    <option key={index} value={type}>
                                                                                        {type}
                                                                                    </option>
                                                                                ))}
                                                                            </select> */}
                                      <input
                                        id="detailsecoundapplicant"
                                        type="text"
                                        placeholder="Enter Second Applicant's Name"
                                        className="inputbond"
                                        maxLength={60}
                                        value={detailsecoundapplicant}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          const regex = /^[a-zA-Z\s]*$/;
                                          if (regex.test(inputValue)) {
                                            setDetailsecoundapplicant(
                                              inputValue
                                            );
                                            onChangeValidation(
                                              e,
                                              "detailsecoundapplicant"
                                            );
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation(
                                            "detailsecoundapplicant"
                                          )
                                        }
                                      />
                                    </div>
                                    {/* <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg, .jpg or .pdf)
                                    </span> */}
                                    {formErrors.detailsecoundapplicant && (
                                      <div className="field_form_alert">
                                        <span>
                                          {formErrors.detailsecoundapplicant}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD SECOND APPLICANT'S PHOTO /
                                      <span
                                        onClick={() =>
                                          openWebCamModal("2nominee")
                                        }
                                        style={{
                                          color: "blue",
                                          cursor: "pointer",
                                          paddingLeft: "5px",
                                        }}
                                      >
                                        Click Camera
                                      </span>{" "}
                                      :
                                    </label>
                                    <input
                                      id="secondNomineeUploadProfileImg"
                                      type="file"
                                      accept=".jpg,.png,.pdf"
                                      onChange={
                                        handleSecondNomineeProfileUpload
                                      }
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg, .jpg or .pdf)
                                    </span>
                                    {formErrors.secondNomineeUploadProfileImg && (
                                      <div className="field_form_alert">
                                        <span>
                                          {
                                            formErrors.secondNomineeUploadProfileImg
                                          }
                                        </span>
                                      </div>
                                    )}
                                    {/* {secondnomineeUploadProfileImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={secondnomineeUploadProfileImgPreview} onClick={() => setSecondnomineeUploadProfileImgView(true)} alt="No" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {secondnomineeUploadProfileImgPreview &&
                                      (secondnomineeUploadProfileImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      secondnomineeUploadProfileImgPreview.endsWith(
                                        ".pdf"
                                      ) ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                secondnomineeUploadProfileImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setSecondnomineeUploadProfileImgView(
                                                true
                                              )
                                            }
                                            src={
                                              secondnomineeUploadProfileImgPreview
                                            }
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {secondnomineeUploadProfileImgView && (
                                      <Lightbox
                                        mainSrc={
                                          secondnomineeUploadProfileImgPreview
                                        }
                                        onCloseRequest={() =>
                                          setSecondnomineeUploadProfileImgView(
                                            false
                                          )
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      {" "}
                                      {selectedsecondApplicantNationality ===
                                      "INDIAN"
                                        ? "PAN NUMBER OF SECOND APPLICANT"
                                        : "PASSPORT NUMBER OF SECOND APPLICANT :"}
                                    </label>
                                    {selectedsecondApplicantNationality ===
                                    "INDIAN" ? (
                                      <input
                                        id="pannumbersecondappli"
                                        type="text"
                                        placeholder="Enter Second Applicant Pan Number"
                                        className="inputbond"
                                        maxLength={10}
                                        value={pannumbersecondappli}
                                        onChange={(e) => {
                                          const inputValue =
                                            e.target.value.toUpperCase();
                                          const regex = /^[A-Z0-9]*$/;
                                          if (regex.test(inputValue)) {
                                            setpannumbersecondappli(inputValue);
                                            onChangeValidation(
                                              e,
                                              "pannumbersecondappli"
                                            );
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation(
                                            "pannumbersecondappli"
                                          )
                                        }
                                      />
                                    ) : (
                                      <input
                                        id="passportnumbersecondappli"
                                        type="text"
                                        placeholder="Enter Second Applicant's Passport Number"
                                        className="inputbond"
                                        value={passportnumbersecondappli}
                                        onChange={(e) => {
                                          const inputValue =
                                            e.target.value.toUpperCase();
                                          const regex = /^[A-Z0-9]*$/;
                                          if (regex.test(inputValue)) {
                                            setPassportnumbersecondappli(
                                              inputValue
                                            );
                                          }
                                        }}

                                        // onChange={(e) => setPassportnumbersecondappli(e.target.value)}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      {" "}
                                      {selectedsecondApplicantNationality ===
                                      "INDIAN"
                                        ? "UPLOAD SECOND APPLICANT'S PAN :"
                                        : "UPLOAD SECOND APPLICANT'S PASSPORT :"}
                                    </label>

                                    {selectedsecondApplicantNationality ===
                                    "INDIAN" ? (
                                      <>
                                        <input
                                          id="secondNomineeUploadPanImg"
                                          type="file"
                                          accept=".jpg,.png,.pdf"
                                          onChange={
                                            handleSecondNomineePanImgUpload
                                          }
                                          onClick={handleFileInputChange}
                                          className="inputbond"
                                        />
                                        <span style={{ fontSize: "10px" }}>
                                          Note (.png, .jpeg, .jpg or .pdf)
                                        </span>
                                        {/* {secondnomineeUploadPanImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={secondnomineeUploadPanImgPreview} onClick={() => setSecondnomineeUploadPanImgview(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                        {secondnomineeUploadPanImgPreview &&
                                          (secondnomineeUploadPanImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          secondnomineeUploadPanImgPreview.endsWith(
                                            ".pdf"
                                          ) ? (
                                            <div
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                              }}
                                            >
                                              <button
                                                class="preview-button"
                                                type="button"
                                                onClick={() =>
                                                  initializeLightGallery(
                                                    secondnomineeUploadPanImgPreview
                                                  )
                                                }
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
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line
                                                      x1="16"
                                                      y1="13"
                                                      x2="8"
                                                      y2="13"
                                                    ></line>
                                                    <line
                                                      x1="16"
                                                      y1="17"
                                                      x2="8"
                                                      y2="17"
                                                    ></line>
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
                                                onClick={() =>
                                                  setSecondnomineeUploadPanImgview(
                                                    true
                                                  )
                                                }
                                                src={
                                                  secondnomineeUploadPanImgPreview
                                                }
                                                className="img_preview"
                                              />
                                            </div>
                                          ))}
                                        {secondnomineeUploadPanImgview && (
                                          <Lightbox
                                            mainSrc={
                                              secondnomineeUploadPanImgPreview
                                            }
                                            onCloseRequest={() =>
                                              setSecondnomineeUploadPanImgview(
                                                false
                                              )
                                            }
                                            onImageLoad={() => {
                                              window.dispatchEvent(
                                                new Event("resize")
                                              );
                                            }}
                                          />
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <input
                                          id="secondNomineeUploadPassPortImg"
                                          type="file"
                                          accept=".jpg,.png,.pdf"
                                          onChange={
                                            handleSecondNomineePassPortImgUpload
                                          }
                                          onClick={handleFileInputChange}
                                          className="inputbond"
                                        />
                                        <span style={{ fontSize: "10px" }}>
                                          Note (.png, .jpeg, .jpg or .pdf)
                                        </span>
                                        {/* {secondnomineeUploadPassPortImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={secondnomineeUploadPassPortImgPreview} onClick={() => setSecondnomineeUploadPassportview(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                        {secondnomineeUploadPassPortImgPreview &&
                                          (secondnomineeUploadPassPortImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          secondnomineeUploadPassPortImgPreview.endsWith(
                                            ".pdf"
                                          ) ? (
                                            <div
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                              }}
                                            >
                                              <button
                                                class="preview-button"
                                                type="button"
                                                onClick={() =>
                                                  initializeLightGallery(
                                                    secondnomineeUploadPassPortImgPreview
                                                  )
                                                }
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
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line
                                                      x1="16"
                                                      y1="13"
                                                      x2="8"
                                                      y2="13"
                                                    ></line>
                                                    <line
                                                      x1="16"
                                                      y1="17"
                                                      x2="8"
                                                      y2="17"
                                                    ></line>
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
                                                onClick={() =>
                                                  setSecondnomineeUploadPassportview(
                                                    true
                                                  )
                                                }
                                                src={
                                                  secondnomineeUploadPassPortImgPreview
                                                }
                                                className="img_preview"
                                              />
                                            </div>
                                          ))}
                                        {secondnomineeUploadPassportview && (
                                          <Lightbox
                                            mainSrc={
                                              secondnomineeUploadPassPortImgPreview
                                            }
                                            onCloseRequest={() =>
                                              setSecondnomineeUploadPassportview(
                                                false
                                              )
                                            }
                                            onImageLoad={() => {
                                              window.dispatchEvent(
                                                new Event("resize")
                                              );
                                            }}
                                          />
                                        )}
                                      </>
                                    )}
                                    {formErrors.secondNomineeUploadPassPortImg && (
                                      <div className="field_form_alert">
                                        <span>
                                          {
                                            formErrors.secondNomineeUploadPassPortImg
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      NATIONALITY / NAME OF THE THIRD APPLICANT
                                      (IF ANY) :
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      {/* <select
                                                                                className='inputbond'
                                                                                style={{ width: "130px" }}
                                                                                value={selectedthirdApplicantNationality}
                                                                                onChange={(e) => setSelectedThirdApplicantNationality(e.target.value)}
                                                                            >
                                                                                <option value="" disabled>NATIONALITY</option>
                                                                                {nationalityType.map((type, index) => (
                                                                                    <option key={index} value={type}>
                                                                                        {type}
                                                                                    </option>
                                                                                ))}
                                                                            </select> */}
                                      <select
                                        className="inputbond"
                                        style={{ width: "130px" }}
                                        value={
                                          selectedthirdApplicantNationality
                                        }
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setSelectedThirdApplicantNationality(
                                            value
                                          );

                                          if (value === "INDIAN") {
                                            setPassportnumberthirdappli("");
                                            setThirdNomineeUploadPassPortImg(
                                              null
                                            );
                                            setThirdNomineeUploadPassPortImgPreview(
                                              null
                                            );

                                            const thirdpassportImgElement =
                                              document.getElementById(
                                                "thirdNomineeUploadPassPortImg"
                                              );
                                            if (
                                              thirdpassportImgElement &&
                                              thirdpassportImgElement.value !==
                                                ""
                                            ) {
                                              thirdpassportImgElement.value =
                                                "";
                                            }
                                          } else if (value === "AMERICAN") {
                                            setpannumberthirdappli("");
                                            setThirdNomineeUploadPanImg(null);
                                            setThirdNomineeUploadPanImgPreview(
                                              null
                                            );
                                            const thirdpanImgElement =
                                              document.getElementById(
                                                "thirdNomineeUploadPanImg"
                                              );
                                            if (
                                              thirdpanImgElement &&
                                              thirdpanImgElement.value !== ""
                                            ) {
                                              thirdpanImgElement.value = "";
                                            }
                                          }
                                        }}
                                      >
                                        <option value="" disabled>
                                          NATIONALITY
                                        </option>
                                        {nationalityType.map((type, index) => (
                                          <option key={index} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        id="detailthirdapplicant"
                                        type="text"
                                        placeholder="Enter Third Applicant's Name"
                                        className="inputbond"
                                        value={detailthirdapplicant}
                                        maxLength={60}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          // Allow only alphabets and spaces
                                          const filteredValue =
                                            inputValue.replace(
                                              /[^a-zA-Z\s]/g,
                                              ""
                                            );
                                          setDetailthirdapplicant(
                                            filteredValue
                                          );
                                          onChangeValidation(
                                            {
                                              ...e,
                                              target: {
                                                ...e.target,
                                                value: filteredValue,
                                              },
                                            },
                                            "detailthirdapplicant"
                                          );
                                        }}
                                        // onChange={(e) => {
                                        //     const inputValue = e.target.value;
                                        //     setDetailthirdapplicant(inputValue);
                                        //     onChangeValidation(e, 'detailthirdapplicant');
                                        // }}
                                        onBlur={() =>
                                          focusOutValidation(
                                            "detailthirdapplicant"
                                          )
                                        }
                                      />
                                    </div>
                                    {formErrors.detailthirdapplicant && (
                                      <div className="field_form_alert">
                                        <span>
                                          {formErrors.detailthirdapplicant}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD THIRD APPLICANT'S PHOTO /
                                      <span
                                        onClick={() =>
                                          openWebCamModal("3nominee")
                                        }
                                        style={{
                                          color: "blue",
                                          cursor: "pointer",
                                          paddingLeft: "5px",
                                        }}
                                      >
                                        Click Camera
                                      </span>{" "}
                                      :
                                    </label>
                                    <input
                                      id="thirdNomineeUploadProfileImg"
                                      type="file"
                                      accept=".jpg,.png,.pdf"
                                      onChange={handleThirdNomineeProfileUpload}
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg, .jpg or .pdf)
                                    </span>
                                    {formErrors.thirdNomineeUploadProfileImg && (
                                      <div className="field_form_alert">
                                        <span>
                                          {
                                            formErrors.thirdNomineeUploadProfileImg
                                          }
                                        </span>
                                      </div>
                                    )}
                                    {/* {thirdnomineeUploadProfileImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={thirdnomineeUploadProfileImgPreview} onClick={() => setThirdNomineeUploadProfileImgView(true)} alt="No" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {thirdnomineeUploadProfileImgPreview &&
                                      (thirdnomineeUploadProfileImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      thirdnomineeUploadProfileImgPreview.endsWith(
                                        ".pdf"
                                      ) ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                thirdnomineeUploadProfileImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setThirdNomineeUploadProfileImgView(
                                                true
                                              )
                                            }
                                            src={
                                              thirdnomineeUploadProfileImgPreview
                                            }
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {thirdnomineeUploadProfileImgView && (
                                      <Lightbox
                                        mainSrc={
                                          thirdnomineeUploadProfileImgPreview
                                        }
                                        onCloseRequest={() =>
                                          setThirdNomineeUploadProfileImgView(
                                            false
                                          )
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      {" "}
                                      {selectedthirdApplicantNationality ===
                                      "INDIAN"
                                        ? "PAN NUMBER OF THIRD APPLICANT :"
                                        : "PASSPORT NUMBER OF THIRD APPLICANT :"}
                                    </label>
                                    {selectedthirdApplicantNationality ===
                                    "INDIAN" ? (
                                      <input
                                        id="pannumberthirdappli"
                                        type="text"
                                        placeholder="Enter Third Applicant Pan Number"
                                        className="inputbond"
                                        maxLength={10}
                                        value={pannumberthirdappli}
                                        onChange={(e) => {
                                          const inputValue =
                                            e.target.value.toUpperCase();
                                          const regex = /^[A-Z0-9]*$/;
                                          if (regex.test(inputValue)) {
                                            setpannumberthirdappli(inputValue);
                                            onChangeValidation(
                                              e,
                                              "pannumberthirdappli"
                                            );
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation(
                                            "pannumberthirdappli"
                                          )
                                        }
                                      />
                                    ) : (
                                      <input
                                        id="passportnumberthirdappli"
                                        type="text"
                                        placeholder="Enter Third Applicant's Passport Number : "
                                        className="inputbond"
                                        value={passportnumberthirdappli}
                                        onChange={(e) => {
                                          const inputValue =
                                            e.target.value.toUpperCase();
                                          const regex = /^[A-Z0-9]*$/;
                                          if (regex.test(inputValue)) {
                                            setPassportnumberthirdappli(
                                              inputValue
                                            );
                                          }
                                        }}

                                        // onChange={(e) => setPassportnumberthirdappli(e.target.value)}
                                      />
                                    )}
                                    {/* {formErrors.pannumberthirdappli && <div className="field_form_alert">
                                                                            <span>{formErrors.pannumberthirdappli}</span>
                                                                        </div>} */}
                                  </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      {" "}
                                      {selectedthirdApplicantNationality ===
                                      "INDIAN"
                                        ? "UPLOAD THIRD APPLICANT'S PAN :"
                                        : "UPLOAD THIRD APPLICANT'S PASSPORT :"}
                                    </label>
                                    {selectedthirdApplicantNationality ===
                                    "INDIAN" ? (
                                      <>
                                        <input
                                          id="thirdNomineeUploadPanImg"
                                          type="file"
                                          accept=".jpg,.png,.pdf"
                                          onChange={
                                            handleThirdNomineePanImgUpload
                                          }
                                          onClick={handleFileInputChange}
                                          className="inputbond"
                                        />
                                        <span style={{ fontSize: "10px" }}>
                                          Note (.png, .jpeg, .jpg or .pdf)
                                        </span>
                                        {/* {thirdnomineeUploadPanImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={thirdnomineeUploadPanImgPreview} onClick={() => setThirdnomineeUploadPanView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                        {thirdnomineeUploadPanImgPreview &&
                                          (thirdnomineeUploadPanImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          thirdnomineeUploadPanImgPreview.endsWith(
                                            ".pdf"
                                          ) ? (
                                            <div
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                              }}
                                            >
                                              <button
                                                class="preview-button"
                                                type="button"
                                                onClick={() =>
                                                  initializeLightGallery(
                                                    thirdnomineeUploadPanImgPreview
                                                  )
                                                }
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
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line
                                                      x1="16"
                                                      y1="13"
                                                      x2="8"
                                                      y2="13"
                                                    ></line>
                                                    <line
                                                      x1="16"
                                                      y1="17"
                                                      x2="8"
                                                      y2="17"
                                                    ></line>
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
                                                onClick={() =>
                                                  setThirdnomineeUploadPanView(
                                                    true
                                                  )
                                                }
                                                src={
                                                  thirdnomineeUploadPanImgPreview
                                                }
                                                className="img_preview"
                                              />
                                            </div>
                                          ))}
                                        {thirdnomineeUploadPanView && (
                                          <Lightbox
                                            mainSrc={
                                              thirdnomineeUploadPanImgPreview
                                            }
                                            onCloseRequest={() =>
                                              setThirdnomineeUploadPanView(
                                                false
                                              )
                                            }
                                            onImageLoad={() => {
                                              window.dispatchEvent(
                                                new Event("resize")
                                              );
                                            }}
                                          />
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <input
                                          id="thirdNomineeUploadPassPortImg"
                                          type="file"
                                          accept=".jpg,.png,.pdf"
                                          onChange={
                                            handleThirdNomineePassPortImgUpload
                                          }
                                          onClick={handleFileInputChange}
                                          className="inputbond"
                                        />
                                        <span style={{ fontSize: "10px" }}>
                                          Note (.png, .jpeg, .jpg or .pdf)
                                        </span>
                                        {/* {thirdnomineeUploadPassPortImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={thirdnomineeUploadPassPortImgPreview} onClick={() => setThirdnomineeUploadPassportView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                        {thirdnomineeUploadPassPortImgPreview &&
                                          (thirdnomineeUploadPassPortImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          thirdnomineeUploadPassPortImgPreview.endsWith(
                                            ".pdf"
                                          ) ? (
                                            <div
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                              }}
                                            >
                                              <button
                                                class="preview-button"
                                                type="button"
                                                onClick={() =>
                                                  initializeLightGallery(
                                                    thirdnomineeUploadPassPortImgPreview
                                                  )
                                                }
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
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line
                                                      x1="16"
                                                      y1="13"
                                                      x2="8"
                                                      y2="13"
                                                    ></line>
                                                    <line
                                                      x1="16"
                                                      y1="17"
                                                      x2="8"
                                                      y2="17"
                                                    ></line>
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
                                                onClick={() =>
                                                  setThirdnomineeUploadPassportView(
                                                    true
                                                  )
                                                }
                                                src={
                                                  thirdnomineeUploadPassPortImgPreview
                                                }
                                                className="img_preview"
                                              />
                                            </div>
                                          ))}
                                        {thirdnomineeUploadPassportView && (
                                          <Lightbox
                                            mainSrc={
                                              thirdnomineeUploadPassPortImgPreview
                                            }
                                            onCloseRequest={() =>
                                              setThirdnomineeUploadPassportView(
                                                false
                                              )
                                            }
                                            onImageLoad={() => {
                                              window.dispatchEvent(
                                                new Event("resize")
                                              );
                                            }}
                                          />
                                        )}
                                      </>
                                    )}
                                    {formErrors.thirdNomineeUploadPassPortImg && (
                                      <div className="field_form_alert">
                                        <span>
                                          {
                                            formErrors.thirdNomineeUploadPassPortImg
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {investorType === 1 && (
                            <div className="col-lg-12">
                              <div className="row">
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      NAME OF SOLE/FIRST APPLICANT :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter Name"
                                      className="inputbond"
                                      readOnly
                                      disabled
                                      value={firstApplicant}
                                      onChange={(e) =>
                                        setFirstApplicant(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      DATE OF BIRTH :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="dob"
                                      type="date"
                                      placeholder="Enter dob"
                                      className="inputbond"
                                      readOnly
                                      disabled
                                      value={dob}
                                    />
                                    {formErrors.dob && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.dob}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      ADDRESS :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="address"
                                      type="text"
                                      readOnly
                                      disabled
                                      placeholder="Enter Address"
                                      className="inputbond"
                                      value={address}
                                      onChange={(e) => {
                                        setAddress(e.target.value);
                                        onChangeValidation(e, "address");
                                      }}
                                      onBlur={() =>
                                        focusOutValidation("address")
                                      }
                                    />
                                    {formErrors.address && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.address}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      OCCUPATION :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="occupation"
                                      type="text"
                                      placeholder="Enter Occupation"
                                      className="inputbond"
                                      value={occupation}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(inputValue)) {
                                          setOccupation(inputValue);
                                          onChangeValidation(e, "occupation");
                                        }
                                      }}
                                      onBlur={() =>
                                        focusOutValidation("occupation")
                                      }
                                    />
                                    {formErrors.occupation && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.occupation}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      PASSPORT NUMBER :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="passportNo"
                                      type="text"
                                      placeholder="Enter Pan Number"
                                      className="inputbond"
                                      readOnly
                                      disabled
                                      maxLength={10}
                                      value={passportNo}
                                      // onChange={(e) => {
                                      //     setpassportNo(e.target.value);
                                      //     onChangeValidation(e, 'passportNo');
                                      // }}
                                      // onBlur={() => focusOutValidation("occupation")}
                                    />
                                    {formErrors.passportNo && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.passportNo}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      SPOUSE'S / FATHER'S NAME :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <select
                                        id="Spousefathername"
                                        className="inputbond"
                                        style={{ width: "90px" }}
                                        value={relation}
                                        onChange={(e) =>
                                          setRelation(e.target.value)
                                        }
                                      >
                                        <option value="FATHER">FATHER</option>
                                        <option value="SPOUSE">SPOUSE</option>
                                      </select>
                                      <input
                                        id="fatherName"
                                        type="text"
                                        placeholder="Enter Spouse's / Father's Name"
                                        className="inputbond"
                                        value={fatherName}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          const regex = /^[a-zA-Z\s]*$/;
                                          if (regex.test(inputValue)) {
                                            setFatherName(inputValue);
                                            onChangeValidation(e, "fatherName");
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation("fatherName")
                                        }
                                      />
                                    </div>
                                    {formErrors.fatherName && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.fatherName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      MARITAL STATUS :{" "}
                                    </label>
                                    <input
                                      id="maritalstatus"
                                      type="text"
                                      placeholder="Enter Marital Status"
                                      className="inputbond"
                                      value={status}
                                      maxLength={50}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(inputValue)) {
                                          setStatus(inputValue);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      NATIONALITY
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <select
                                        className="inputbond"
                                        value={selectedNationality}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setSelectedNationality(value);

                                          if (value === "INDIAN") {
                                            setNomineePassport("");
                                            setNomineeUploadPassPortImg(null);
                                            setNomineeUploadPassPortImgPreview(
                                              null
                                            );
                                            const passportImgElement =
                                              document.getElementById(
                                                "nomineeUploadPassPortImg"
                                              );
                                            if (
                                              passportImgElement &&
                                              passportImgElement.value !== ""
                                            ) {
                                              passportImgElement.value = "";
                                            }
                                          } else if (value === "AMERICAN") {
                                            setNomineePan("");
                                            setNomineeUploadPanImg(null);
                                            setNomineeUploadPanImgPreview(null);
                                            const panImgElement =
                                              document.getElementById(
                                                "nomineeUploadPanImg"
                                              );
                                            if (
                                              panImgElement &&
                                              panImgElement.value !== ""
                                            ) {
                                              panImgElement.value = "";
                                            }
                                          }
                                        }}
                                      >
                                        <option value="" disabled>
                                          NATIONALITY
                                        </option>
                                        {nationalityType.map((type, index) => (
                                          <option key={index} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      TYPE / NAME OF THE NOMINEE :{" "}
                                    </label>
                                    <div
                                      style={{ display: "flex", gap: "10px" }}
                                    >
                                      <select
                                        id="Spousefathername"
                                        className="inputbond"
                                        style={{ width: "90px" }}
                                        value={nomineeminormajor}
                                        onChange={(e) => {
                                          const selectedValue = e.target.value;
                                          setNomineeminormajor(selectedValue);
                                          if (selectedValue === "MAJOR") {
                                            setNomineeDob("");
                                            setNomineeguarname("");
                                            setRelationshipnominee("");
                                          } else if (
                                            selectedValue === "MINOR"
                                          ) {
                                            setNomineePan("");
                                            setNomineeUploadPanImg(null);
                                            setNomineeUploadPanImgPreview(null);
                                            setNomineeUploadImg(null);
                                            setNomineeUploadImgPreview(null);
                                          }
                                        }}
                                      >
                                        <option value="" disabled>
                                          Select Type of Nominee{" "}
                                        </option>
                                        {nomineeList.map((paymentMethod, i) => (
                                          <option key={i} value={paymentMethod}>
                                            {paymentMethod}
                                          </option>
                                        ))}
                                      </select>

                                      <input
                                        id="detailsofNomine"
                                        type="text"
                                        placeholder="Enter Nominee's Name"
                                        className="inputbond"
                                        maxLength={50}
                                        value={detailsofNomine}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          const regex = /^[a-zA-Z\s]*$/;
                                          if (regex.test(inputValue)) {
                                            setDetailsofNomine(inputValue);
                                            onChangeValidation(
                                              e,
                                              "detailsofNomine"
                                            );
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation("detailsofNomine")
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                {selectedNationality === "INDIAN" &&
                                  nomineeminormajor === "MAJOR" && (
                                    <>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            NOMINEE'S PAN NUMBER:
                                          </label>
                                          <input
                                            id="nomineepannumber"
                                            type="text"
                                            placeholder="Enter Nominee's PAN Number"
                                            className="inputbond"
                                            value={nomineePan}
                                            maxLength={10}
                                            onChange={(e) => {
                                              const inputValue =
                                                e.target.value.toUpperCase();
                                              const regex = /^[A-Z0-9]*$/;
                                              if (regex.test(inputValue)) {
                                                setNomineePan(inputValue);
                                              }
                                            }}
                                            onBlur={() =>
                                              focusOutValidation("nomineePan")
                                            }
                                          />
                                          {formErrors.nomineePan && (
                                            <div className="field_form_alert">
                                              <span>
                                                {formErrors.nomineePan}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            UPLOAD NOMINEE'S PAN :
                                          </label>
                                          <input
                                            id="nomineeUploadPanImg"
                                            name="nomineeUploadPanImg"
                                            type="file"
                                            accept=".jpg,.png,.pdf"
                                            onChange={handleNomineePanImgUpload}
                                            onClick={handleFileInputChange}
                                            className="inputbond"
                                          />
                                          <span style={{ fontSize: "10px" }}>
                                            Note (.png, .jpeg, .jpg or .pdf)
                                          </span>
                                          {formErrors.nomineeUploadPanImg && (
                                            <div className="field_form_alert">
                                              <span>
                                                {formErrors.nomineeUploadPanImg}
                                              </span>
                                            </div>
                                          )}
                                          {nomineePanView && (
                                            <Lightbox
                                              mainSrc={
                                                nomineeUploadPanImgPreview
                                              }
                                              onCloseRequest={() =>
                                                setNomineePanView(false)
                                              }
                                              onImageLoad={() => {
                                                window.dispatchEvent(
                                                  new Event("resize")
                                                );
                                              }}
                                            />
                                          )}
                                          {/* {nomineeUploadPanImgPreview && (
                                                                                    <div className="preview_card_img">

                                                                                        <img src={nomineeUploadPanImgPreview} onClick={() => setNomineePanView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                          {nomineeUploadPanImgPreview &&
                                            (nomineeUploadPanImgPreview.startsWith(
                                              "data:application/pdf"
                                            ) ||
                                            nomineeUploadPanImgPreview.endsWith(
                                              ".pdf"
                                            ) ? (
                                              <div
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                }}
                                              >
                                                <button
                                                  class="preview-button"
                                                  type="button"
                                                  onClick={() =>
                                                    initializeLightGallery(
                                                      nomineeUploadPanImgPreview
                                                    )
                                                  }
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
                                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                      <polyline points="14 2 14 8 20 8"></polyline>
                                                      <line
                                                        x1="16"
                                                        y1="13"
                                                        x2="8"
                                                        y2="13"
                                                      ></line>
                                                      <line
                                                        x1="16"
                                                        y1="17"
                                                        x2="8"
                                                        y2="17"
                                                      ></line>
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
                                                  onClick={() =>
                                                    setNomineePanView(true)
                                                  }
                                                  src={
                                                    nomineeUploadPanImgPreview
                                                  }
                                                  className="img_preview"
                                                />
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                {selectedNationality === "AMERICAN" &&
                                  nomineeminormajor === "MAJOR" && (
                                    <>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            NOMINEE'S PASSPORT NUMBER :
                                          </label>
                                          <input
                                            id="nomineepassportnumber"
                                            type="text"
                                            placeholder="Enter Nominee's Passport Number :"
                                            className="inputbond"
                                            maxLength={10}
                                            value={nomineePassport}
                                            onChange={(e) => {
                                              const inputValue =
                                                e.target.value.toUpperCase();
                                              const regex = /^[A-Z0-9]*$/;
                                              if (regex.test(inputValue)) {
                                                setNomineePassport(inputValue);
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-6">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            UPLOAD NOMINEE'S PASSPORT :
                                          </label>
                                          <input
                                            id="nomineeUploadPassPortImg"
                                            name="nomineeUploadPassPortImg"
                                            type="file"
                                            accept=".jpg,.png,.pdf"
                                            onChange={
                                              handleNomineePassportImgUpload
                                            }
                                            onClick={handleFileInputChange}
                                            className="inputbond"
                                          />
                                          <span style={{ fontSize: "10px" }}>
                                            Note (.png, .jpeg, .jpg or .pdf)
                                          </span>
                                          {formErrors.nomineeUploadPassPortImg && (
                                            <div className="field_form_alert">
                                              <span>
                                                {
                                                  formErrors.nomineeUploadPassPortImg
                                                }
                                              </span>
                                            </div>
                                          )}
                                          {nomineePassPortView && (
                                            <Lightbox
                                              mainSrc={
                                                nomineeUploadPassPortImgPreview
                                              }
                                              onCloseRequest={() =>
                                                setNomineePanView(false)
                                              }
                                              onImageLoad={() => {
                                                window.dispatchEvent(
                                                  new Event("resize")
                                                );
                                              }}
                                            />
                                          )}
                                          {/* {nomineeUploadPassPortImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={nomineeUploadPassPortImgPreview} onClick={() => setNomineePassPortView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )} */}
                                          {nomineeUploadPassPortImgPreview &&
                                            (nomineeUploadPassPortImgPreview.startsWith(
                                              "data:application/pdf"
                                            ) ||
                                            nomineeUploadPassPortImgPreview.endsWith(
                                              ".pdf"
                                            ) ? (
                                              <div
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                }}
                                              >
                                                <button
                                                  class="preview-button"
                                                  type="button"
                                                  onClick={() =>
                                                    initializeLightGallery(
                                                      nomineeUploadPassPortImgPreview
                                                    )
                                                  }
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
                                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                      <polyline points="14 2 14 8 20 8"></polyline>
                                                      <line
                                                        x1="16"
                                                        y1="13"
                                                        x2="8"
                                                        y2="13"
                                                      ></line>
                                                      <line
                                                        x1="16"
                                                        y1="17"
                                                        x2="8"
                                                        y2="17"
                                                      ></line>
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
                                                  onClick={() =>
                                                    setNomineePassPortView(true)
                                                  }
                                                  src={
                                                    nomineeUploadPassPortImgPreview
                                                  }
                                                  className="img_preview"
                                                />
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                {nomineeminormajor === "MINOR" && (
                                  <>
                                    <div className="col-lg-4 col-12">
                                      <div className="responsive-column">
                                        <label className="bond_label">
                                          NOMINEE'S DATE OF BIRTH :{" "}
                                        </label>
                                        {/* <input
                                                                                    id="nomineeDob"
                                                                                    type="date"
                                                                                    placeholder="Enter Nominee Date of Birth"
                                                                                    className='inputbond'
                                                                                    value={nomineeDob}
                                                                                    onChange={(e) => {
                                                                                        setNomineeDob(e.target.value)
                                                                                        onChangeValidation(e, 'nomineeDob');
                                                                                    }}
                                                                                    onBlur={() => focusOutValidation("nomineeDob")}
                                                                                    onKeyDown={(e) => e.preventDefault()}
                                                                                /> */}
                                        <DatePicker
                                          showIcon
                                          showYearDropdown
                                          scrollableYearDropdown
                                          yearDropdownItemNumber={100}
                                          selected={
                                            nomineeDob
                                              ? new Date(nomineeDob)
                                              : null
                                          }
                                          onChange={(date) => {
                                            setNomineeDob(
                                              moment(date).format("YYYY-MM-DD")
                                            );
                                          }}
                                          className="inputbond"
                                          placeholderText="dd-mm-yyyy"
                                          dateFormat="dd-MM-yyyy"
                                          maxDate={new Date()}
                                          onKeyDown={(e) => {
                                            e.preventDefault();
                                          }}
                                          shouldCloseOnSelect={true}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                      <div className="responsive-column">
                                        <label className="bond_label">
                                          GUARDIAN NAME :
                                        </label>
                                        <input
                                          id="nomineeguarname"
                                          type="text"
                                          placeholder="Enter Guardian Name"
                                          className="inputbond"
                                          maxLength={50}
                                          value={nomineeguarname}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setNomineeguarname(inputValue);
                                              onChangeValidation(
                                                e,
                                                "nomineeguarname"
                                              );
                                            }
                                          }}
                                          onBlur={() =>
                                            focusOutValidation(
                                              "nomineeguarname"
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-12">
                                      <div className="responsive-column">
                                        <label className="bond_label">
                                          GUARDIAN RELATIONSHIP :
                                        </label>
                                        <input
                                          id="relationshipnominee"
                                          type="text"
                                          placeholder="Enter Guardian Relationship"
                                          className="inputbond"
                                          maxLength={50}
                                          value={relationshipnominee}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setRelationshipnominee(
                                                inputValue
                                              );
                                              onChangeValidation(
                                                e,
                                                "relationshipnominee"
                                              );
                                            }
                                          }}
                                          onBlur={() =>
                                            focusOutValidation(
                                              "relationshipnominee"
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                {/* <div className='col-lg-4 col-md-6'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>
                                                                            {selectedNationality === "INDIAN" ? "NOMINEE'S PAN NUMBER :" : "NOMINEE'S PASSPORT NUMBER :"}
                                                                        </label>
                                                                        {selectedNationality === "INDIAN" ? (
                                                                            <input
                                                                                id="nomineepannumber"
                                                                                type="text"
                                                                                placeholder="Enter Nominee's PAN Number"
                                                                                className='inputbond'
                                                                                value={nomineePan}
                                                                                maxLength={10}
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value.toUpperCase();
                                                                                    const regex = /^[A-Z0-9]*$/;
                                                                                    if (regex.test(inputValue)) {
                                                                                        setNomineePan(inputValue);
                                                                                    }
                                                                                }}

                                                                            />

                                                                        ) : (
                                                                            <input
                                                                                id="nomineepassportnumber"
                                                                                type="text"
                                                                                placeholder="Enter Nominee's Passport Number :"
                                                                                className='inputbond'
                                                                                maxLength={8}
                                                                                value={nomineePassport}
                                                                                onChange={(e) => {
                                                                                    const inputValue = e.target.value.toUpperCase();
                                                                                    const regex = /^[A-Z0-9]*$/;
                                                                                    if (regex.test(inputValue)) {
                                                                                        setNomineePassport(inputValue);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-4 col-md-6'>
                                                                    <div className='responsive-column'>
                                                                        <label className='bond_label'>
                                                                            {selectedNationality === "INDIAN" ? "UPLOAD NOMINEE'S PAN :" : "UPLOAD NOMINEE'S PASSPORT :"}
                                                                        </label>
                                                                        {selectedNationality === "INDIAN" ? (
                                                                            <>
                                                                                <input
                                                                                    id="nomineeUploadPanImg"
                                                                                    name="nomineeUploadPanImg"
                                                                                    type="file"
                                                                                    accept='.jpg,.png,.pdf'
                                                                                    onChange={handleNomineePanImgUpload}
                                                                                    onClick={handleFileInputChange}
                                                                                    className="inputbond"
                                                                                />
                                                                                <span style={{ fontSize: '10px' }}>Note (.png, .jpeg, .jpg or .pdf)</span>
                                                                                {nomineeUploadPanImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={nomineeUploadPanImgPreview} onClick={() => setNomineePanView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )}
                                                                                {nomineePanView && (
                                                                                    <Lightbox
                                                                                        mainSrc={nomineeUploadPanImgPreview}
                                                                                        onCloseRequest={() => setNomineePanView(false)}
                                                                                        onImageLoad={() => {
                                                                                            window.dispatchEvent(new Event('resize'));
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <input
                                                                                    id="nomineeUploadPassPortImg"
                                                                                    name="nomineeUploadPassPortImg"
                                                                                    type="file"
                                                                                    accept='.jpg,.png,.pdf'
                                                                                    onChange={handleNomineePassportImgUpload}
                                                                                    onClick={handleFileInputChange}
                                                                                    className="inputbond"
                                                                                />
                                                                                <span style={{ fontSize: '10px' }}>Note (.png, .jpeg, .jpg or .pdf)</span>
                                                                                {nomineeUploadPassPortImgPreview && (
                                                                                    <div className="preview_card_img">
                                                                                        <img src={nomineeUploadPassPortImgPreview} onClick={() => setNomineePassPortView(true)} alt="Selected" className='bondimgPreview' />
                                                                                    </div>
                                                                                )}
                                                                                {nomineePassPortView && (
                                                                                    <Lightbox
                                                                                        mainSrc={nomineeUploadPassPortImgPreview}
                                                                                        onCloseRequest={() => setNomineePassPortView(false)}
                                                                                        onImageLoad={() => {
                                                                                            window.dispatchEvent(new Event('resize'));
                                                                                        }}
                                                                                    />
                                                                                )}

                                                                            </>

                                                                        )}



                                                                    </div>
                                                                </div> */}
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD NOMINEE'S PHOTO /
                                      <span
                                        onClick={() =>
                                          openWebCamModal("nominee")
                                        }
                                        style={{
                                          color: "blue",
                                          cursor: "pointer",
                                          paddingLeft: "5px",
                                        }}
                                      >
                                        Click Camera
                                      </span>{" "}
                                      :
                                    </label>
                                    <input
                                      id="nomineeUploadImg"
                                      name="nomineeUploadImg"
                                      type="file"
                                      accept=".jpg,.png,.pdf"
                                      onChange={handleNomineeProfileUpload}
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg, .jpg or .pdf)
                                    </span>
                                    {formErrors.nomineeUploadImg && (
                                      <div className="field_form_alert">
                                        <span>
                                          {formErrors.nomineeUploadImg}
                                        </span>
                                      </div>
                                    )}
                                    {/* {nomineeUploadImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={nomineeUploadImgPreview} onClick={() => setNomineeImgView(true)} alt="No" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {nomineeUploadImgPreview &&
                                      (nomineeUploadImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      nomineeUploadImgPreview.endsWith(
                                        ".pdf"
                                      ) ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                nomineeUploadImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setNomineeImgView(true)
                                            }
                                            src={nomineeUploadImgPreview}
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {nomineeImgView && (
                                      <Lightbox
                                        mainSrc={nomineeUploadImgPreview}
                                        onCloseRequest={() =>
                                          setNomineeImgView(false)
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <br></br>
                          <br></br>
                          <div>
                            <span className="bond_label">
                              I understand that the details furnished above are
                              true to the best of our knowledge the shares if
                              allotted are restricted for transfer purposes. All
                              provisions of the Companies Act, 2013 and
                              guidelines of the Articles of Association of the
                              Company together with rules of Reserve Bank of
                              India relating to FEMA are applicable. We also
                              declare that the amount is not borrowed funds and
                              investing out of my own funds. The discretion of
                              the Board shall be final, and we agree to be bound
                              by the decision of the Board in this respect.
                            </span>
                          </div>
                          <br></br>
                          {investorType === 1 && (
                            <div className="col-lg-12">
                              <div className="row">
                                <div className="col-lg-4 col-md-4">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD FIRST APPLICANT'S SIGNATURE{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="firstSignImg"
                                      name="firstSignImg"
                                      type="file"
                                      accept=".jpg,.png"
                                      onChange={handleFirstSign}
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg or .jpg)
                                    </span>
                                    {formErrors.firstSignImg && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.firstSignImg}</span>
                                      </div>
                                    )}
                                    {/* {firstSignImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={firstSignImgPreview} onClick={() => setfirstSignView(true)} alt="Selected" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {firstSignImgPreview &&
                                      (firstSignImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      firstSignImgPreview.endsWith(".pdf") ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                firstSignImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setfirstSignView(true)
                                            }
                                            src={firstSignImgPreview}
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {firstSignImgView && (
                                      <Lightbox
                                        mainSrc={firstSignImgPreview}
                                        onCloseRequest={() =>
                                          setfirstSignView(false)
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {investorType === 2 && (
                            <div className="col-lg-12">
                              <div className="row">
                                <div className="col-lg-4 col-md-6">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD FIRST APPLICANT'S SIGNATURE{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="firstApplicantSignImg"
                                      name="firstApplicantSignImg"
                                      type="file"
                                      accept=".jpg,.png"
                                      onChange={handleFirstSign}
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg or .jpg)
                                    </span>
                                    {formErrors.firstSignImg && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.firstSignImg}</span>
                                      </div>
                                    )}
                                    {/* {firstSignImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={firstSignImgPreview} onClick={() => setfirstSignView(true)} alt="Selected" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {firstSignImgPreview &&
                                      (firstSignImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      firstSignImgPreview.endsWith(".pdf") ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                firstSignImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setfirstSignView(true)
                                            }
                                            src={firstSignImgPreview}
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {firstSignImgView && (
                                      <Lightbox
                                        mainSrc={firstSignImgPreview}
                                        onCloseRequest={() =>
                                          setfirstSignView(false)
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD SECOND APPLICANT'S SIGNATURE{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="secoundApplicantSign"
                                      name="secoundApplicantSign"
                                      type="file"
                                      accept=".jpg,.png"
                                      onChange={handleSecondSign}
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg or .jpg)
                                    </span>
                                    {formErrors.secondSignImg && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.secondSignImg}</span>
                                      </div>
                                    )}
                                    {/* {secondSignImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={secondSignImgPreview} onClick={() => setSecondSignImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {secondSignImgPreview &&
                                      (secondSignImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      secondSignImgPreview.endsWith(".pdf") ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                secondSignImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setSecondSignImgView(true)
                                            }
                                            src={secondSignImgPreview}
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {secondSignImgView && (
                                      <Lightbox
                                        mainSrc={secondSignImgPreview}
                                        onCloseRequest={() =>
                                          setSecondSignImgView(false)
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UPLOAD THIRD APPLICANT'S SIGNATURE{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="thirdApplicantSign"
                                      name="thirdApplicantSign"
                                      type="file"
                                      accept=".jpg,.png"
                                      onChange={handleThirdSign}
                                      onClick={handleFileInputChange}
                                      className="inputbond"
                                    />
                                    <span style={{ fontSize: "10px" }}>
                                      Note (.png, .jpeg or .jpg)
                                    </span>
                                    {formErrors.thirdSignImg && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.thirdSignImg}</span>
                                      </div>
                                    )}
                                    {/* {thirdSignImgPreview && (
                                                                            <div className="preview_card_img">
                                                                                <img src={thirdSignImgPreview} onClick={() => setThirdSignImgView(true)} alt="Selected" className='bondimgPreview' />
                                                                            </div>
                                                                        )} */}
                                    {thirdSignImgPreview &&
                                      (thirdSignImgPreview.startsWith(
                                        "data:application/pdf"
                                      ) ||
                                      thirdSignImgPreview.endsWith(".pdf") ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        >
                                          <button
                                            class="preview-button"
                                            type="button"
                                            onClick={() =>
                                              initializeLightGallery(
                                                thirdSignImgPreview
                                              )
                                            }
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
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line
                                                  x1="16"
                                                  y1="13"
                                                  x2="8"
                                                  y2="13"
                                                ></line>
                                                <line
                                                  x1="16"
                                                  y1="17"
                                                  x2="8"
                                                  y2="17"
                                                ></line>
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
                                            onClick={() =>
                                              setThirdSignImgView(true)
                                            }
                                            src={thirdSignImgPreview}
                                            className="img_preview"
                                          />
                                        </div>
                                      ))}
                                    {thirdSignImgView && (
                                      <Lightbox
                                        mainSrc={thirdSignImgPreview}
                                        onCloseRequest={() =>
                                          setThirdSignImgView(false)
                                        }
                                        onImageLoad={() => {
                                          window.dispatchEvent(
                                            new Event("resize")
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="row" style={{ marginTop: "2%" }}>
                              <div
                                className="welcome_text"
                                style={{ paddingLeft: "20px" }}
                              >
                                <span>
                                  {" "}
                                  {selectedCountryType === "India" && (
                                    <span>NRO</span>
                                  )}{" "}
                                  Bank Account details for Crediting Dividend
                                </span>
                              </div>
                            </div>
                            <div className="row" style={{ marginTop: "2%" }}>
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    {" "}
                                    ACCOUNT NUMBER :{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    id="accountNo"
                                    type="text"
                                    placeholder="Account Number"
                                    className="inputbond"
                                    value={accountNo}
                                    disabled={paymentflag}
                                    maxLength={16}
                                    onChange={(e) => {
                                      if (!paymentflag) {
                                        const value = e.target.value;
                                        if (
                                          /^\d*$/.test(value) &&
                                          value.length <= 16
                                        ) {
                                          setAccountNo(value);
                                          onChangeValidation(e, "accountNo");
                                        }
                                      }
                                    }}
                                    onBlur={() =>
                                      focusOutValidation("accountNo")
                                    }
                                  />
                                  {formErrors.accountNo && (
                                    <div className="field_form_alert">
                                      <span>{formErrors.accountNo}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {selectedCountryType === "USA" && (
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      {" "}
                                      ACCOUNT TYPE :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="accountType"
                                      type="text"
                                      placeholder="Account Type"
                                      className="inputbond"
                                      value={accountType}
                                      disabled={paymentflag}
                                      onChange={(e) => {
                                        if (!paymentflag) {
                                          const value = e.target.value;
                                          if (
                                            /^[A-Za-z]*$/.test(value) &&
                                            value.length <= 30
                                          ) {
                                            setAccountType(value);
                                            onChangeValidation(
                                              e,
                                              "accountType"
                                            );
                                          }
                                        }
                                      }}
                                      onBlur={() =>
                                        focusOutValidation("accountType")
                                      }
                                    />
                                    {formErrors.accountType && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.accountType}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    BANK NAME :{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    id="bankName"
                                    type="text"
                                    placeholder="Bank Name"
                                    className="inputbond"
                                    value={bankName}
                                    disabled={paymentflag}
                                    onChange={(e) => {
                                      if (!paymentflag) {
                                        const inputValue = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(inputValue)) {
                                          setBankName(inputValue);
                                          onChangeValidation(e, "bankName");
                                        }
                                      }
                                    }}
                                    onBlur={() =>
                                      focusOutValidation("bankName")
                                    }
                                  />
                                  {formErrors.bankName && (
                                    <div className="field_form_alert">
                                      <span>{formErrors.bankName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    BRANCH NAME :{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    id="branchName"
                                    type="text"
                                    placeholder="Branch Name"
                                    className="inputbond"
                                    maxLength={50}
                                    value={branchName}
                                    disabled={paymentflag}
                                    onChange={(e) => {
                                      if (!paymentflag) {
                                        const inputValue = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(inputValue)) {
                                          setBranchName(inputValue);
                                          onChangeValidation(e, "branchName");
                                        }
                                      }
                                    }}
                                    onBlur={() =>
                                      focusOutValidation("branchName")
                                    }
                                  />
                                  {formErrors.branchName && (
                                    <div className="field_form_alert">
                                      <span>{formErrors.branchName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {selectedCountryType === "India" && (
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      IFSC CODE :{" "}
                                      <span className="required">*</span>
                                    </label>
                                    <input
                                      id="ifscCode"
                                      type="text"
                                      placeholder="IFSC Code"
                                      className="inputbond"
                                      value={ifscCode}
                                      disabled={paymentflag}
                                      maxLength={11}
                                      onChange={(e) => {
                                        if (!paymentflag) {
                                          const inputValue =
                                            e.target.value.toUpperCase(); // Convert input to uppercase
                                          const regex = /^[A-Z0-9]*$/;
                                          if (regex.test(inputValue)) {
                                            setIfscCode(inputValue);
                                            onChangeValidation(e, "ifscCode");
                                          }
                                        }
                                      }}
                                      onBlur={() =>
                                        focusOutValidation("ifscCode")
                                      }
                                    />
                                    {formErrors.ifscCode && (
                                      <div className="field_form_alert">
                                        <span>{formErrors.ifscCode}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {selectedCountryType === "USA" && (
                                <>
                                  <div className="col-lg-4 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        SWIFT / IBAN CODE :{" "}
                                      </label>
                                      <input
                                        id="ibankcode"
                                        type="text"
                                        placeholder="Enter SWIFT / IBAN Code"
                                        className="inputbond"
                                        disabled={paymentflag}
                                        value={ibankCode}
                                        onChange={(e) => {
                                          if (!paymentflag) {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z0-9\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setIbankCode(inputValue);
                                              onChangeValidation(
                                                e,
                                                "ibankCode"
                                              );
                                            }
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation("ibankCode")
                                        }
                                      />
                                      {formErrors.ibankCode && (
                                        <div className="field_form_alert">
                                          <span>{formErrors.ibankCode}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        REMITTANCE THROUGH BANK :{" "}
                                      </label>
                                      <input
                                        id="remittancethroughbank"
                                        type="text"
                                        placeholder="Enter remittance through bank"
                                        className="inputbond"
                                        value={remittanceThroughBank}
                                        disabled={paymentflag}
                                        maxLength={30}
                                        onChange={(e) => {
                                          if (!paymentflag) {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setremittanceThroughBank(
                                                inputValue
                                              );
                                              onChangeValidation(
                                                e,
                                                "remittancethroughbank"
                                              );
                                            }
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation(
                                            "remittancethroughbank"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    UPLOAD CANCELLED CHEQUE LEAF / BANK
                                    STATEMENT / PASSBOOK FRONT PAGE :{" "}
                                    <span className="required">*</span>
                                  </label>
                                  <input
                                    id="chequeUploadImg"
                                    name="chequeUploadImg"
                                    type="file"
                                    accept=".jpg,.png,.pdf"
                                    disabled={paymentflag}
                                    onChange={handleChequeLeafUpload}
                                    onClick={handleFileInputChange}
                                    className="inputbond"
                                  />
                                  <span style={{ fontSize: "10px" }}>
                                    Note (.png, .jpeg, .jpg or .pdf)
                                  </span>
                                  {formErrors.chequeUploadImg && (
                                    <div className="field_form_alert">
                                      <span>{formErrors.chequeUploadImg}</span>
                                    </div>
                                  )}
                                  {/* {chequeUploadImgPreview && (
                                                                        <div className="preview_card_img">
                                                                            <img src={chequeUploadImgPreview} alt="Selected" onClick={() => setChequeUploadImgView(true)} className='bondimgPreview' />
                                                                        </div>
                                                                    )} */}
                                  {chequeUploadImgPreview &&
                                    (chequeUploadImgPreview.startsWith(
                                      "data:application/pdf"
                                    ) ||
                                    chequeUploadImgPreview.endsWith(".pdf") ? (
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                        }}
                                      >
                                        <button
                                          class="preview-button"
                                          type="button"
                                          onClick={() =>
                                            initializeLightGallery(
                                              chequeUploadImgPreview
                                            )
                                          }
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
                                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                              <polyline points="14 2 14 8 20 8"></polyline>
                                              <line
                                                x1="16"
                                                y1="13"
                                                x2="8"
                                                y2="13"
                                              ></line>
                                              <line
                                                x1="16"
                                                y1="17"
                                                x2="8"
                                                y2="17"
                                              ></line>
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
                                          onClick={() =>
                                            setChequeUploadImgView(true)
                                          }
                                          src={chequeUploadImgPreview}
                                          className="img_preview"
                                        />
                                      </div>
                                    ))}
                                  {chequeUploadImgView && (
                                    <Lightbox
                                      mainSrc={chequeUploadImgPreview}
                                      onCloseRequest={() =>
                                        setChequeUploadImgView(false)
                                      }
                                      onImageLoad={() => {
                                        window.dispatchEvent(
                                          new Event("resize")
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              {remarkList.length !== 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "flex-end",
                                    paddingTop: "20px",
                                  }}
                                >
                                  <div>
                                    <span
                                      className="link-like"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setRemarkModal(true);
                                      }}
                                      style={{ color: "red" }}
                                    >
                                      Click to View Rejected Reason
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ------------ Payment Details Container ----------- */}
              <div className="register_container">
                <div className="gpbond_card col-lg-12">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "8px",
                    }}
                  >
                    <div className="welcome_text">
                      <span>Payment Details</span>
                      <span
                        className="info_icon"
                        data-tooltip="A maximum of 6 payments allowed."
                        style={{ cursor: "pointer", marginLeft: "8px" }}
                      >
                        <FaCircleInfo size={18} color="skyblue" />
                      </span>
                    </div>
                    {/* <div>
                                            <button type='button' className='btn btn-primary' onClick={() => paymentModalOpen()}>Add Payment</button>
                                        </div> */}
                  </div>
                  <div style={{ paddingLeft: "8px", paddingTop: "10px" }}>
                    <div className="row">
                      <div
                        className="col-lg-6 col-12"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label className="bond_label">
                          Country of Remittance{" "}
                          <span className="required">*</span>
                        </label>
                        <select
                          id="countryofremittance"
                          className="inputbond"
                          value={selectedCountryType}
                          onChange={(e) => {
                            setSelectedCountryType(e.target.value);
                            GetallCurrency(e.target.value);
                          }}
                          disabled={paymentDetailsArr.length > 0}
                        >
                          <option value="" disabled>
                            Select Country of Remittance
                          </option>
                          {countryType.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div
                        className="col-lg-6 col-12"
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <label className="bond_label">
                          Currency of Remittance{" "}
                          <span className="required">*</span>
                        </label>
                        <input
                          className="inputbond"
                          readOnly
                          value={selectedCurrency}
                        />
                      </div>
                    </div>
                  </div>
                  {selectedCurrency === "INR" && (
                    <div style={{ paddingLeft: "8px", paddingTop: "10px" }}>
                      <div className="row">
                        <div
                          className="col-lg-6 col-12"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label className="bond_label">Total Amount</label>
                          <input
                            readOnly
                            className="inputbond"
                            value={formatter.format(price)}
                          />
                        </div>
                        <div
                          className="col-lg-6 col-12"
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label className="bond_label">Pending Amount</label>
                          <input
                            readOnly
                            className="inputbond"
                            value={formatter.format(
                              calculateRemainingAmount(
                                paymentDetailsArr,
                                price
                              ) || 0
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    style={{ paddingLeft: "8px", paddingTop: "20px" }}
                    className="d-none d-lg-block"
                  >
                    {paymentDetailsArr.length > 0 && (
                      <table className="payment_table">
                        <tr>
                          <th>S.No</th>
                          <th>Payment Date</th>
                          <th>Payment Mode</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Remarks</th>
                          <th />
                        </tr>
                        {paymentDetailsArr.map((item, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>
                                {moment(item.userPaymentDate).format(
                                  "DD/MM/YYYY"
                                )}
                              </td>
                              <td>{item.modeOfPayment}</td>
                              {selectedCurrency === "INR" ? (
                                <td>₹ {item.amount}</td>
                              ) : (
                                <td>$ {item.amount}</td>
                              )}
                              <td
                                className={
                                  item.paymentStatus.paymentStatus === "SUCCESS"
                                    ? "green"
                                    : "orange"
                                }
                              >
                                {item.paymentStatus.paymentStatus}
                              </td>
                              <td className="remark-text">
                                {item.paymentStatus.paymentStatus !==
                                  "SUCCESS" &&
                                item.paymentRemarks &&
                                item.paymentRemarks.length > 0 &&
                                item.paymentRemarks[
                                  item.paymentRemarks.length - 1
                                ] &&
                                item.paymentRemarks[
                                  item.paymentRemarks.length - 1
                                ].remarks != null
                                  ? item.paymentRemarks[
                                      item.paymentRemarks.length - 1
                                    ].remarks
                                  : item.paymentStatus.paymentStatus ===
                                    "SUCCESS"
                                  ? ""
                                  : ""}
                              </td>

                              <td style={{ display: "flex", gap: "10px" }}>
                                <button
                                  type="button"
                                  onClick={() => editPayment(item)}
                                  className="btn btn-primary payment_icon_div"
                                >
                                  <AiFillEdit />
                                  Edit
                                </button>
                                {item.receiptUploaded && (
                                  <button
                                    type="button"
                                    disabled={!item.receiptUploaded}
                                    className="btn btn-primary payment_icon_div"
                                    onClick={() => RecepitDownload(item)}
                                  >
                                    <FaFileDownload />
                                    Receipt
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    )}
                  </div>
                  <div style={{ paddingLeft: "10px", marginTop: "10px" }}>
                    <button
                      type="button"
                      className="addPaymentbtn"
                      onClick={() => paymentModalOpen()}
                    >
                      <span className="gpbtn_txt">+ Add Payment</span>
                    </button>
                  </div>
                  <div className="mt-4 d-block d-lg-none">
                    {paymentDetailsArr.length > 0 &&
                      paymentDetailsArr.map((item, index) => (
                        <div className="card mb-3 payment-card" key={index}>
                          <div className="card-body">
                            <div className="payment-detail">
                              <strong>S.No:</strong>
                              <span>{index + 1}</span>
                            </div>
                            <div className="payment-detail">
                              <strong>Payment Date:</strong>
                              <span>
                                {moment(item.userPaymentDate).format(
                                  "DD/MM/YYYY"
                                )}
                              </span>
                            </div>
                            <div className="payment-detail">
                              <strong>Payment Mode:</strong>
                              <span>{item.modeOfPayment}</span>
                            </div>
                            <div className="payment-detail">
                              <strong>Amount:</strong>
                              {selectedCurrency === "INR" ? (
                                <span>₹ {item.amount}</span>
                              ) : (
                                <td>$ {item.amount}</td>
                              )}
                            </div>
                            <div className="payment-detail">
                              <strong>Status:</strong>
                              <span
                                className={
                                  item.paymentStatus?.paymentStatus ===
                                  "SUCCESS"
                                    ? "green"
                                    : "orange"
                                }
                              >
                                {item.paymentStatus?.paymentStatus}
                              </span>
                            </div>
                            <div className="payment-detail">
                              <strong>Remarks:</strong>
                              <span className="remark-text">
                                {item.paymentStatus?.paymentStatus !==
                                  "SUCCESS" &&
                                item?.paymentRemarks &&
                                item?.paymentRemarks.length > 0 &&
                                item?.paymentRemarks[
                                  item.paymentRemarks.length - 1
                                ] &&
                                item?.paymentRemarks[
                                  item.paymentRemarks.length - 1
                                ]?.remarks != null
                                  ? item?.paymentRemarks[
                                      item.paymentRemarks.length - 1
                                    ]?.remarks
                                  : item?.paymentStatus?.paymentStatus ===
                                    "SUCCESS"
                                  ? ""
                                  : ""}
                              </span>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-3">
                              <button
                                type="button"
                                onClick={() => editPayment(item)}
                                className="btn btn-primary payment_icon_div"
                              >
                                <AiFillEdit />
                                Edit
                              </button>
                              {item.receiptUploaded && (
                                <button
                                  type="button"
                                  disabled={!item.receiptUploaded}
                                  className="btn btn-primary payment_icon_div"
                                  onClick={() => RecepitDownload(item)}
                                >
                                  <FaFileDownload />
                                  Recepit
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* --------- Bank fields first ------ */}
                  <div>
                    <div className="agree_label form_checkbox_div">
                      <div>
                        <input
                          type="checkbox"
                          id="consentChkFlag"
                          checked={consentChkFlag}
                          onChange={(e) => {
                            setConsentChkFlag(e.target.checked);
                            onChangeValidation(e, "consentChkFlag");
                          }}
                          onBlur={() => focusOutValidation("consentChkFlag")}
                        />
                      </div>
                      <div>
                        <label>
                          I AGREE THAT THE ABOVE DETAILS PROVIDED IS CORRECT TO
                          THE BEST OF MY KNOWLEDGE.
                          <span className="required">*</span>
                        </label>
                        {formErrors.consentChkFlag && (
                          <div
                            className="field_form_alert"
                            style={{ paddingTop: "2px" }}
                          >
                            <span>{formErrors.consentChkFlag}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="agree_label form_checkbox_div">
                      <div>
                        <input
                          type="checkbox"
                          id="rbiflag"
                          checked={declarationform}
                          onChange={(e) => {
                            setDeclarationform(e.target.checked);
                            onChangeValidation(e, "declarationform");
                          }}
                          onBlur={() => focusOutValidation("declarationform")}
                        />
                      </div>
                      <div>
                        <label>
                          I AGREE THAT THE ALLOTMENT OF SHARES WILL BE MADE
                          SUBJECT TO THE RULES AND REGULATIONS OF RBI AND
                          FOREIGN EXCHANGE MANAGEMENT ACT.{" "}
                          <span className="required">*</span>
                        </label>

                        {formErrors.declarationform && (
                          <div
                            className="field_form_alert"
                            style={{ paddingTop: "2px" }}
                          >
                            <span>{formErrors.declarationform}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="cenAlig"></div>
                  </div>

                  <div className="cenAlig" style={{ gap: "20px" }}>
                    <button className="subt_btn" type="submit">
                      Submit
                    </button>
                    {draftFlag != false && (
                      <button
                        className="subt_btn"
                        type="button"
                        onClick={() => saveAsDraft()}
                      >
                        Save as Draft
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            dialogClassName="modal-dialog modal-md"
            centered
            show={remarkModal}
          >
            <Modal.Header>
              <div className="modal_subhead">
                <span className="modal_head_txt">Rejected Reason</span>
                <AiOutlineClose
                  className="moda_closel_icon"
                  onClick={() => setRemarkModal(false)}
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="modal_body_container">
                <div className="remarks_list_container">
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Remarks</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remarkList.map((item, i) => (
                        <tr key={item.id}>
                          <td>{i + 1}</td>
                          <td className="remarks-column">{item.remarks}</td>
                          <td>
                            {moment(item.createdDate).format(
                              "DD/MM/YYYY hh:mm:ss A"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          <Modal
            dialogClassName="modal-dialog modal-md"
            centered
            show={paymentModal}
          >
            <Modal.Body>
              <div className="payment_div_head">
                {editPaymentFlag === true ? (
                  <lable>Edit Payment</lable>
                ) : (
                  <lable>Add Payment</lable>
                )}
              </div>
              <div>
                <div className="col-12">
                  <div className="responsive-column">
                    <label className="bond_label">Payment Method : </label>
                    <select
                      id="PaymentMethod"
                      className={`inputbond`}
                      value={paymentStatus}
                      onChange={(e) => {
                        setPaymentStatus(e.target.value);
                      }}
                      disabled
                    >
                      <option value="" disabled>
                        Select Payment Method
                      </option>
                      {paymentType.map((type, i) => (
                        <option
                          key={i}
                          value={type.id}
                          selected={type.id === paymentStatus}
                        >
                          {type.paymentType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="responsive-column">
                    <label className="bond_label">
                      {selectedCurrency === "INR"
                        ? "MODE OF PAYMENT :"
                        : "SWIFT CODE OF REMITTING BANK :"}{" "}
                      <span className="required">*</span>
                    </label>
                    {selectedCurrency === "INR" ? (
                      <select
                        id="ModeofPayment"
                        className={`inputbond`}
                        value={userModeOfPayment}
                        disabled={approvePaymentFlag === true}
                        onChange={(e) =>
                          updatePaymentDetail("modeOfPayment", e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select Mode Of Payment
                        </option>
                        {paymentList.map((paymentMethod, i) => (
                          <option key={i} value={paymentMethod}>
                            {paymentMethod}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="accountInfoDate"
                        type="text"
                        className={`inputbond`}
                        readOnly={approvePaymentFlag === true}
                        value={userModeOfPayment}
                        maxLength={15}
                        // onChange={(e) => updatePaymentDetail('modeOfPayment', e.target.value)}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const regex = /^[a-zA-Z0-9\s]*$/;
                          if (regex.test(inputValue)) {
                            updatePaymentDetail("modeOfPayment", inputValue);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="responsive-column">
                    <label className="bond_label">
                      {" "}
                      PAYMENT DATE : <span className="required">*</span>
                    </label>
                    {/* <input
                                            id="accountInfoDate"
                                            type="datetime-local"
                                            className={`inputbond`}
                                            value={userPaymentDate}
                                            readOnly={approvePaymentFlag === true}
                                            min={process.env.REACT_APP_PAYMENT_DATE}
                                            max={moment().format('YYYY-MM-DDTHH:mm')}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const formattedDate = value ? moment(value).format('YYYY-MM-DDTHH:mm:ss') : '';
                                                updatePaymentDetail('userPaymentDate', formattedDate);
                                            }}
                                        /> */}
                    <DatePicker
                      showIcon
                      showYearDropdown
                      scrollableYearDropdown
                      selected={
                        userPaymentDate ? new Date(userPaymentDate) : null
                      }
                      onChange={(date) => {
                        const value = date;
                        const formattedDate = value
                          ? moment(value).format("YYYY-MM-DDTHH:mm:ss")
                          : "";
                        updatePaymentDetail("userPaymentDate", formattedDate);
                      }}
                      className={`inputbond`}
                      showTimeSelect
                      timeFormat="hh:mm aa"
                      timeIntervals={5}
                      placeholderText="dd-mm-yyyy hh:mm"
                      dateFormat="dd-MM-yyyy hh:mm aa"
                      readOnly={approvePaymentFlag === true}
                      minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                      maxDate={new Date()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      shouldCloseOnSelect={true}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="responsive-column">
                    <label className="bond_label">
                      {selectedCurrency === "INR"
                        ? "UTR NUMBER / CHEQUE NUMBER  :"
                        : "SWIFT NUMBER :"}{" "}
                      <span className="required">*</span>
                    </label>
                    <input
                      id="utr"
                      type="tel"
                      readOnly={approvePaymentFlag === true}
                      placeholder={
                        selectedCurrency === "INR"
                          ? "Enter UTR Number / CHEQUE Number"
                          : "Enter SWIFT Number"
                      }
                      className={`inputbond`}
                      value={paymentUtrNo}
                      // onChange={(e) => {
                      //     let input = e.target.value.replace(/\D/g, '').slice(0, 22);
                      //     updatePaymentDetail('userTransactionNo', input);
                      // }}
                      onChange={(e) => {
                        let input = e.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .toUpperCase()
                          .slice(0, 22); // Allow only alphanumeric characters and convert to uppercase
                        updatePaymentDetail("userTransactionNo", input);
                      }}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="responsive-column">
                    <label className="bond_label">
                      Amount : <span className="required">*</span>
                    </label>
                    <input
                      id="amount"
                      type="text"
                      placeholder="Enter Amount"
                      maxLength={9}
                      className={`inputbond`}
                      value={userPayAmount}
                      readOnly={approvePaymentFlag === true}
                      onChange={(e) => {
                        let input = e.target.value;
                        if (/^\d*\.?\d*$/.test(input)) {
                          const remainingAmount = calculateRemainingAmount(
                            paymentDetailsArr,
                            price
                          );
                          if (
                            selectedCurrency === "INR" &&
                            remainingAmount - parseFloat(input) < 0 &&
                            editPaymentFlag === false
                          ) {
                            priceExists(0);
                            return;
                          }

                          updatePaymentDetail("amount", input);
                        }
                      }}
                    />
                    {formErrors.modalAlert && (
                      <div className="field_form_alert">
                        <span>{formErrors.modalAlert}</span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedCurrency === "USD" && (
                  <div className="col-12">
                    <div className="responsive-column">
                      <label className="bond_label">
                        UPLOAD SWIFT ADVICE :{" "}
                        <span className="required">*</span>
                      </label>
                      <input
                        id="chequeUploadImg"
                        name="chequeUploadImg"
                        type="file"
                        accept=".jpg,.png,.pdf"
                        onChange={handleSwiftAdvice}
                        onClick={handleFileInputChange}
                        className={`inputbond `}
                        disabled={approvePaymentFlag === true}
                        readOnly={approvePaymentFlag === true}
                      />
                      <span style={{ fontSize: "10px" }}>
                        Note (.png, .jpeg, .jpg or .pdf)
                      </span>
                      {formErrors.swiftadviceImg && (
                        <div className="field_form_alert">
                          <span>{formErrors.swiftadviceImg}</span>
                        </div>
                      )}
                      {/* {swiftadviceImgPreview && (
                                                <div className="preview_card_img">
                                                    <img src={swiftadviceImgPreview} alt="Selected" className='bondimgPreview' />
                                                </div>
                                            )} */}
                      {swiftadviceImgPreview &&
                        (swiftadviceImgPreview.startsWith(
                          "data:application/pdf"
                        ) || swiftadviceImgPreview.endsWith(".pdf") ? (
                          <div style={{ width: "100%", height: "100%" }}>
                            <button
                              class="preview-button"
                              type="button"
                              onClick={() =>
                                initializeLightGallery(swiftadviceImgPreview)
                              }
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
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
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
                              // onClick={() => setSecondApplicantPanView(true)}
                              src={swiftadviceImgPreview}
                              className="bondimgPreview"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {paymentRejectRemark != "" && (
                  <div className="col-12">
                    <div className="responsive-column">
                      <label className="bond_label">Rejected Reason : </label>
                      <input
                        id="utr"
                        type="tel"
                        className={`inputbond`}
                        readOnly
                        value={paymentRejectRemark}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="payment_div_foot">
                {approvePaymentFlag != true && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={paymentSave}
                    disabled={
                      userModeOfPayment === "" ||
                      userPaymentDate === "" ||
                      paymentUtrNo === "" ||
                      userPayAmount === "" ||
                      (selectedCurrency === "USD" &&
                        (swiftadviceImg === null || swiftadviceImg === ""))
                    }
                  >
                    {editPaymentFlag ? "Update" : "Save"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn text-primary border-primary"
                  onClick={() => paymentModalClose()}
                >
                  Close
                </button>
              </div>
            </Modal.Body>
          </Modal>

          {showAlert && (
            <Alert
              title={"Thank You"}
              msg={alertMessage}
              open={true}
              type={"success"}
              onClose={handleCloseAlert}
            />
          )}
          {showErrorAlert && (
            <Alert
              title={""}
              msg={alertErrorMessage}
              open={true}
              type={"error"}
              onClose={handleErrorCloseAlert}
            />
          )}
          {showYesorNoAlert && (
            <Alert
              title={""}
              msg={alertYesorNoMessage}
              open={true}
              type={"yesorno"}
              onClose={handleYesorNo}
              onConfirm={() => handleSaveBond(false)}
            />
          )}

          {paymentAlert && (
            <Alert
              title={
                paymentAlertType === "success"
                  ? "Success"
                  : paymentAlertType === "error"
                  ? "Alert"
                  : ""
              }
              msg={paymentAlertMsg}
              open={true}
              type={paymentAlertType}
              onClose={paymentAlertClose}
              onConfirm={paymentAlertConfirm}
            />
          )}

          {/* ------------ Camera open Modal ----------- */}
          <Modal size="modal-dialog modal-md" centered show={modalOpen}>
            <Modal.Header>
              <div className="modal_subhead">
                <span className="modal_head_txt">Camera</span>
                <AiOutlineClose
                  id="modalclosecamera"
                  className="moda_closel_icon"
                  onClick={() => closeWebCamModal()}
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="modal_body_container">
                <div>
                  {isWebcamOn && !showPreview && (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={"100%"}
                      style={{ transform: "scaleX(-1)" }}
                    />
                  )}
                  {!showPreview && (
                    <div className="modal_container">
                      <button
                        className="login_btn"
                        type="button"
                        onClick={() => webCamCapture()}
                        style={{ width: "30%" }}
                      >
                        Capture
                      </button>
                    </div>
                  )}
                  <div className="cenAlig">
                    {showPreview && (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            paddingLeft: "10px",
                          }}
                        >
                          Preview Captured Image
                        </span>
                        <img
                          alt=""
                          style={{
                            height: "200px",
                            width: "200px",
                            paddingTop: "20px",
                            transform: "scaleX(-1)",
                          }}
                          src={webCamImageSrcPreview}
                          className="img_preview_cam"
                        />
                      </div>
                    )}
                  </div>
                  {showPreview && (
                    <div className="modal_container">
                      <button
                        className="login_btn capbtn"
                        type="button"
                        onClick={() => setShowPreview(false)}
                      >
                        Recapture
                      </button>
                      {multiFace === false && (
                        <button
                          // disabled={multiFace === true}
                          className="login_btn capbtn"
                          type="button"
                          onClick={() => doneWebCamModal()}
                        >
                          Ok
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </form>
      </div>

      {userAlert && (
        <Alert
          title={"Alert"}
          msg={userAlertMsg}
          open={true}
          type={userAlertType}
          onClose={userAlertClose}
          onConfirm={userAlertConfirm}
        />
      )}

      <div>
        <Modal
          className="loader_modal"
          centered
          show={loading}
          onHide={() => setLoading(false)}
        >
          <RotatingLines
            strokeColor="#659DBD"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={loading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UpdateNriociform;
