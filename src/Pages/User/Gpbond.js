import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../components/AppProvider";
import Alert from "../components/Alert";
import "../User/Gpbond.css";
import "../Register.css";
import { gp_logo } from "../components/imageUrl";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import decryptData from "../components/Decrypt";
import { RiCloseCircleFill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import moment from "moment";
import { initializeLightGallery } from "../components/lightGalleryInitializer";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { detectFace, loadModel } from "../components/faceDetection";
import Webcam from "react-webcam";
import { RotatingLines } from "react-loader-spinner";

const Gpbond = () => {
  const location = useLocation();
  const item = location.state.item;

  const [formErrors, setFormErrors] = useState({});
  const { sideBarCollapse } = useSidebar();

  const { PostApi } = useAppContext();

  const navigate = useNavigate();

  const [accountInfoDate, setAccountInfoDate] = useState("");
  const [utr, setUtr] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [panCard, setPanCard] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [status, setStatus] = useState("");
  const [detailsofNomine, setDetailsofNomine] = useState("");
  const [nomineePan, setNomineePan] = useState("");
  const [detailsecoundapplicant, setDetailsecoundapplicant] = useState("");
  const [pannumbersecondappli, setpannumbersecondappli] = useState("");
  const [detailthirdapplicant, setDetailthirdapplicant] = useState("");
  const [pannumberthirdappli, setpannumberthirdappli] = useState("");
  const [consentChkFlag, setConsentChkFlag] = useState(false);

  const [maritalList, setMaritalList] = useState([]);

  const [paymentList, setPaymentList] = useState([]);

  const [nomineeList, setNomineeList] = useState([]);

  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shareFormatter = new Intl.NumberFormat("en-IN");

  const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
  const [alertYesorNoMessage, setAlertYesorNoMessage] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState("");

  const [firstSignImg, setfirstSignImg] = useState(null);
  const [firstSignImgPreview, setfirstSignImgPreview] = useState(null);

  const [secondSignImg, setSecondSignImg] = useState(null);
  const [secondSignImgPreview, setSecondSignImgImgPreview] = useState(null);

  const [thirdSignImg, setThirdSignImg] = useState(null);
  const [thirdSignImgPreview, setThirdSignImgImgPreview] = useState(null);

  const [chequeUploadImg, setChequeUploadImg] = useState(null);
  const [chequeUploadImgPreview, setChequeUploadImgPreview] = useState(null);

  const [nomineeminormajor, setNomineeminormajor] = useState("");
  const [nomineeguarname, setNomineeguarname] = useState("");
  const [nomineeUploadImg, setNomineeUploadImg] = useState(null);
  const [nomineeDob, setNomineeDob] = useState("");

  const [nomineeGurdianRelation, setNomineeGurdianRelation] = useState("");
  const [nomineeUploadImgPreview, setNomineeUploadImgPreview] = useState(null);

  const [nomineeUploadPanImg, setNomineeUploadPanImg] = useState(null);
  const [nomineeUploadPanImgPreview, setNomineeUploadPanImgPreview] =
    useState(null);

  const [secondNomineeUploadProfileImg, setSecondNomineeUploadProfileImg] =
    useState(null);
  const [
    secondnomineeUploadProfileImgPreview,
    setSecondNomineeUploadProfileImgPreview,
  ] = useState(null);

  const [secondNomineeUploadPanImg, setSecondNomineeUploadPanImg] =
    useState(null);
  const [
    secondnomineeUploadPanImgPreview,
    setSecondNomineeUploadPanImgPreview,
  ] = useState(null);

  const [thirdNomineeUploadProfileImg, setThirdNomineeUploadProfileImg] =
    useState(null);
  const [
    thirdnomineeUploadProfileImgPreview,
    setThirdNomineeUploadProfileImgPreview,
  ] = useState(null);

  const [thirdNomineeUploadPanImg, setThirdNomineeUploadPanImg] =
    useState(null);
  const [thirdnomineeUploadPanImgPreview, setThirdNomineeUploadPanImgPreview] =
    useState(null);

  let validatedate = process.env.REACT_APP_PAYMENT_DATE;

  const [roleId] = useState(localStorage.getItem("Role_id"));

  const [savedDate, setSaveDate] = useState("");
  const [paymentType, setPaymentType] = useState([]);
  const [paymentId, setPaymentId] = useState("");
  const [modeofPayment, setModeofPayment] = useState("");
  const [userid] = useState(localStorage.getItem("user_id"));
  const [userName, setUserName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token] = useState(localStorage.getItem("token"));

  const [relation, setRelation] = useState("FATHER");

  const [userAlert, setUserAlert] = useState(false);
  const [userAlertMsg, setUserAlertMsg] = useState("");
  const [userAlertClose, setUserAlertClose] = useState(() => null);
  const [userAlertConfirm, setUserAlertConfirm] = useState(() => null);
  const [userAlertType, setUserAlertType] = useState("");

  const detailsArr = {
    userPaymentDate: "",
    modeOfPayment: "",
    userTransactionNo: "",
    amount: "",
    active: true,
  };

  const [paymentDetailsArr, setPaymentDetailsArr] = useState([detailsArr]);
  const maxRows = 6;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [multiFace, setMultiFace] = useState(false);

  const [webCamImageSrc, setWebCamImgSrc] = useState(null);
  const [webCamImageSrcPreview, setWebCamImgSrcPreview] = useState(null);

  const [photoFieldLabel, setPhotoFieldLabel] = useState("");

  const webcamRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

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
      console.log(roleId, "role id");
      console.log(item, "previous page data");
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    GetallPaymentType("");
    getMaritalStatus();
    getMyprofileDetails("");
    getModeofPayment();
    getNomineeType();
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/HoldingTable", { state: { rowData: savedDate } });
  };

  const handleFileInputChange = (event) => {
    event.target.value = "";
  };

  const handleErrorCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const handleYesorNo = () => {
    setShowYesorNoAlert(false);
    setIsSubmitted(true);
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

  const priceExistAlert = () => {
    setShowErrorAlert(true);
    setAlertErrorMessage(
      `The total amount exceeds the allowed value of ${formatter.format(
        priceValue
      )}. Please adjust the entered amount.`
    );
  };

  const handleAmountKeyDown = (e) => {
    const input = e.target.value;

    // Allow Backspace, Tab, Delete, Arrow keys, etc.
    const allowedKeys = [
      "Backspace",
      "Tab",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    // Get the key pressed
    const { key } = e;

    // Allow numeric keys and the '.' key for decimal points
    if (/^\d$/.test(key) || key === ".") {
      // Prevent '0' as the first number unless followed by a decimal
      if (key === "0" && input === "") {
        e.preventDefault();
      }
    } else if (!allowedKeys.includes(key)) {
      // Block non-numeric and non-allowed keys
      e.preventDefault();
    }
  };

  const updatePaymentDetail = (index, key, value) => {
    setPaymentDetailsArr((prevState) => {
      const updatedArr = [...prevState];
      if (key === "amount") {
        const newTotalAmount = calculateTotalAmount(updatedArr, index, value);
        if (newTotalAmount > priceValue) {
          priceExistAlert();
          return prevState;
        }
      }
      updatedArr[index][key] = value;
      return updatedArr;
    });
  };

  const addNewRow = () => {
    const lastRow = paymentDetailsArr[paymentDetailsArr.length - 1];

    if (
      !lastRow.userPaymentDate ||
      !lastRow.userTransactionNo ||
      !lastRow.modeOfPayment ||
      !lastRow.amount
    ) {
      setShowErrorAlert(true);
      setAlertErrorMessage(
        "Please fill out all fields in the previous row before adding a new one."
      );
      return;
    }

    const totalAmount = calculateTotalAmount(paymentDetailsArr);

    if (totalAmount >= priceValue) {
      priceExistAlert();
      return;
    }

    if (paymentDetailsArr.length >= maxRows) {
      setShowErrorAlert(true);
      setAlertErrorMessage(`You cannot add more than ${maxRows} rows.`);
      return;
    }

    setPaymentDetailsArr([...paymentDetailsArr, detailsArr]);
  };

  const deleteRow = (index) => {
    setPaymentDetailsArr((prevState) =>
      prevState.filter((_, i) => i !== index)
    );
  };

  const calculateTotalAmount = (arr, currentIndex, currentValue) => {
    return arr.reduce((sum, item, idx) => {
      const amount =
        idx === currentIndex
          ? parseFloat(currentValue) || 0
          : parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const focusOutValidation = async (label) => {
    if (label === "dob") {
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
    } else if (label === "panCard") {
      if (panCard === "") {
        setFormErrors((e) => {
          return { ...e, panCard: "Please Enter PAN Number" };
        });
      } else if (panPattern.test(panCard) === false) {
        setFormErrors((e) => {
          return { ...e, panCard: "Please Enter Valid PAN Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, panCard: "" };
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
    } else if (label === "pannumbersecondappli") {
      if (panPattern.test(pannumbersecondappli) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            pannumbersecondappli: "Please Enter Valid Applicant Pan Number",
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
            pannumberthirdappli: "Please Enter Valid Applicant Pan Number",
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
    } else if (label === "panCard") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, panCard: "Please Enter PAN Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, panCard: "" };
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
    } else if (label === "detailsofNomine") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, detailsofNomine: "Please Enter Nominee's Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, detailsofNomine: "" };
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
    }
    // ----- bank details
    else if (label === "bankName") {
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
    } else if (label === "detailsecoundapplicant") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return {
            ...e,
            detailsecoundapplicant: "Please Enter Second Applicant's Name",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, detailsecoundapplicant: "" };
        });
      }
    } else if (label === "pannumbersecondappli") {
      const value = e.target.value;
      if (panPattern.test(value) === false) {
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
    } else if (label === "detailthirdapplicant") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return {
            ...e,
            detailthirdapplicant: "Please Enter Third Applicant's Name",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, detailthirdapplicant: "" };
        });
      }
    } else if (label === "pannumberthirdappli") {
      const value = e.target.value;
      if (panPattern.test(value) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            pannumberthirdappli:
              "Please Enter Valid Third Applicant's Nominee's PAN Number",
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
    }
    // else if (errors.nomineePan) {
    //     scrollToElement('nomineePan')
    // }
    // else if (errors.pannumbersecondappli) {
    //     scrollToElement('pannumbersecondappli')
    // }
    // else if (errors.pannumberthirdappli) {
    //     scrollToElement('pannumberthirdappli')
    // }
    else if (errors.firstSignImg) {
      scrollToElement("firstSignImg");
    } else if (errors.secondSignImg) {
      scrollToElement("secoundApplicantSign");
    } else if (errors.thirdSignImg) {
      scrollToElement("thirdApplicantSign");
    } else if (errors.accountNo) {
      scrollToElement("accountNo");
    } else if (errors.bankName) {
      scrollToElement("bankName");
    } else if (errors.branchName) {
      scrollToElement("branchName");
    } else if (errors.ifscCode) {
      scrollToElement("ifscCode");
    } else if (errors.chequeUploadImg) {
      scrollToElement("chequeUploadImg");
    }
  };

  const handleSaveBondvalidation = (event) => {
    event.preventDefault();
    const errors = {};
    // ----------- JOINT ----------
    if (item.bondId === "2") {
      if (pannumbersecondappli) {
        if (panPattern.test(pannumbersecondappli) === false) {
          errors.pannumbersecondappli =
            "Please Enter Valid Second Applicant Pan Number";
        }
      } else {
        delete errors.pannumbersecondappli;
      }
      if (pannumberthirdappli) {
        if (panPattern.test(pannumberthirdappli) === false) {
          errors.pannumberthirdappli =
            "Please Enter Valid Third Applicant Pan Number";
        }
      } else {
        delete errors.pannumberthirdappli;
      }
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
    // --------- Validition ------
    if (userName === "") {
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
    // if (panCard === "") {
    //     errors.panCard = "Please Enter PAN Card Number"
    // }
    // else if (panPattern.test(panCard) === false) {
    //     errors.panCard = "Please Enter Valid PAN Number"
    // }
    if (fatherName === "") {
      errors.fatherName = "Please Enter Spouse's / Father's Name";
    }
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
    if (ifscCode === "") {
      errors.ifscCode = "Please Enter IFSC Code";
    }
    // if (paymentId === "") {
    //     errors.paymentId = "Please Select Payment Mode"
    // }
    if (accountInfoDate !== "") {
      let selectedDate = new Date(accountInfoDate);
      let minDate = validatedate;

      if (selectedDate < minDate) {
        errors.accountInfoDate = "Please Select after 01-01-2024 00:00";
      }
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

    setFormErrors(errors);
    setFormErrorsAndScroll(errors);
    // let missingFieldsNote = "";
    const isPaymentDetailMissing = paymentDetailsArr.some((paymentDetail) => {
      //   const { userPaymentDate, userTransactionNo, amount, modeOfPayment } =
      //     paymentDetail;
      //   return (
      //     !userPaymentDate || !userTransactionNo || !amount || !modeOfPayment
      //   );
      const { userPaymentDate, userTransactionNo, amount, modeOfPayment } =
        paymentDetail;
      const allEmpty =
        !userPaymentDate && !userTransactionNo && !amount && !modeOfPayment;
      const allFilled =
        userPaymentDate && userTransactionNo && amount && modeOfPayment;
      return allEmpty || allFilled;
    });

    if (!isPaymentDetailMissing && Object.keys(errors).length === 0) {
      setShowErrorAlert(true);
      setAlertErrorMessage(
        "Each payment detail must have either all fields filled or all fields empty."
      );
      return;
      // missingFieldsNote = (
      //     <span style={{ color: "red", fontSize: "12px" }}>
      //         Note: Payment details not filled. The form will not be sent to the Golden Planet team.  <br></br>
      //     </span>
      // );
    }
    if (Object.keys(errors).length === 0) {
      setShowYesorNoAlert(true);
      setAlertYesorNoMessage(
        <div>
          {/* {missingFieldsNote} */}
          Thank You for applying <br></br>
          Redeemable Preference Shares.
          <br />
          Click Yes to confirm.
        </div>
      );
    }
  };

  const saveAsDraft = () => {
    setUserAlert(true);
    setUserAlertMsg(
      "Are you sure you want to save the application as a draft ?"
    );
    setUserAlertType("yesorno");
    setUserAlertClose(() => () => setUserAlert(false));
    setUserAlertConfirm(() => () => handleSaveBond(true));
  };

  const handleSaveBond = (draft) => {
    setUserAlert(false);
    const url = "/userbond/save";
    const data = new FormData();
    data.append("userId", userid);
    data.append("clientDetails.Id", item.clientId);
    data.append("clientBondDetails.Id", item.id);
    data.append("name", userName);
    data.append("dateOfBirth", dob);
    data.append("address", address);
    data.append("occupation", occupation);
    data.append("pan", panCard);
    data.append("relation", relation);
    data.append("fatherName", fatherName);
    data.append("status", status);
    data.append("nomineeDetails", detailsofNomine);
    data.append("nomineePan", nomineePan);
    data.append("secondApplicant", detailsecoundapplicant);
    data.append("secondApplicantPan", pannumbersecondappli);
    data.append("thirdApplicant", detailthirdapplicant);
    data.append("thirdApplicantPan", pannumberthirdappli);
    data.append("investorType.Id", item.bondId);
    data.append("faceValue", item.acquisitionValue);
    data.append("noOfUnits", item.standardUnits);
    data.append("noOfLots", 0);
    data.append("noOfShares", 0);
    data.append("amount", item.price);
    data.append("amountInUsd", 0.0);
    data.append("paymentType.id", 2);
    data.append("bankName", bankName);
    data.append("accountNo", accountNo);
    data.append("branchName", branchName);
    data.append("ifscCode", ifscCode);
    data.append("remittanceDetails", "");
    data.append("swiftDetails", "");
    data.append("sharesAppliedWords", priceInWords);
    data.append("amountPaidWords", price);
    data.append("consentChkFlag", consentChkFlag);
    data.append("firstSign", firstSignImg);
    data.append("secondSign", secondSignImg);
    data.append("thirdSign", thirdSignImg);
    data.append("cancelCheque", chequeUploadImg);
    data.append("nomineeProImg", nomineeUploadImg);
    data.append("nomineePanImage", nomineeUploadPanImg);
    data.append("secondAppProImg", secondNomineeUploadProfileImg);
    data.append("secondAppPanImg", secondNomineeUploadPanImg);
    data.append("thirdAppProImg", thirdNomineeUploadProfileImg);
    data.append("thirdAppPanImg", thirdNomineeUploadPanImg);
    data.append("nomineeType", nomineeminormajor);
    data.append("nomineeDateOfBirth", nomineeDob);
    data.append("guardianName", nomineeguarname);
    data.append("guardianRelationship", nomineeGurdianRelation);
    data.append("draft", draft);

    paymentDetailsArr.forEach((paymentDetail, index) => {
      const {
        userPaymentDate,
        userTransactionNo,
        amount,
        modeOfPayment,
        active,
      } = paymentDetail;

      if (userPaymentDate && userTransactionNo && amount && modeOfPayment) {
        data.append(`paymentDetails[${index}].active`, active);
        data.append(
          `paymentDetails[${index}].userPaymentDate`,
          userPaymentDate.replace(" ", "T")
        );
        data.append(
          `paymentDetails[${index}].userTransactionNo`,
          userTransactionNo
        );
        data.append(
          `paymentDetails[${index}].amount`,
          parseFloat(amount).toFixed(2)
        );
        data.append(`paymentDetails[${index}].modeOfPayment`, modeOfPayment);
      }
    });

    PostApi("POST", url, data, headers)
      .then((response) => {
        console.log(response, "response");
        if (response.data.status === 200) {
          setSaveDate(response.data.data);
          setShowAlert(true);
          setShowYesorNoAlert(false);
          // setAlertMessage(
          //     <div>
          //         Your Redeemable Preference Shares application
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
                    : "Your application for Redeemable Preference Shares is currently being processed.",
                }}
              ></div>

              <div
                className="d-block d-lg-none txtali alerttxt"
                dangerouslySetInnerHTML={{
                  __html: draft
                    ? "Your application has been saved as draft."
                    : "Your application for Redeemable Preference Shares is currently being processed.",
                }}
              ></div>
            </>
          );
        } else if (response.data.status === 409) {
          // const errorMessages = response.data.errors;
          // const errorMessageList = errorMessages.join(', ');
          setAlertErrorMessage(response.data.message);
          setShowErrorAlert(true);
          setShowYesorNoAlert(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const GetallPaymentType = () => {
    const method = "POST";
    const url = `/userbond/payment/types`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "Payment Type");
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
        console.log(response, "Maritail Status");
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
        console.log(response, "Mode of Payment List");
        setPaymentList(response.data);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const getNomineeType = () => {
    const method = "POST";
    const url = `/userbond/nomineeTypes`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "Nominee List");
        setNomineeList(response.data);
        setNomineeminormajor(response.data[1]);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const getMyprofileDetails = async (id) => {
    const url = `/user/id?id=${userid}`;
    const data = {};
    try {
      const response = await PostApi("POST", url, data, headers);

      console.log(response.data, "response from kyc");

      setDob(response.data.data.dateOfBirth);
      setPanCard(response.data.data.pan);
      setUserName(response.data.data.firstName);
      setAddress(
        `${response.data.data.addressLine1},${response.data.data.city1},${response.data.data.state1},${response.data.data.country1},${response.data.data.pincode1}`
      );
      const decryptedPan = decryptData(
        response.data.data.pan,
        response.data.data.key
      );
      setPanCard(decryptedPan);
    } catch (error) {
      console.log(error);
    }
  };

  const convertToWords = (number, label) => {
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
    const thousands = ["", "Thousand", "Lakh", "Crore"];

    if (number === 0) {
      return `Zero ${label} Only`;
    }

    let words = "";

    const getChunkWords = (num) => {
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

    // This is the main correction to handle the Indian numbering system.
    const getIndianChunks = (num) => {
      const chunks = [];
      // Handle the first 3 digits (up to 999)
      chunks.push(num % 1000);
      num = Math.floor(num / 1000);

      // Handle the next 2 digits (for Lakhs, up to 99)
      while (num > 0) {
        chunks.push(num % 100);
        num = Math.floor(num / 100);
      }

      return chunks;
    };

    const chunks = getIndianChunks(number);
    for (let i = chunks.length - 1; i >= 0; i--) {
      if (chunks[i] !== 0) {
        words += getChunkWords(chunks[i]) + " " + thousands[i] + " ";
      }
    }

    words = words.trim();

    if (label === "Shares") {
      return words + ` ${label} Only`;
    } else if (label === "Rupee") {
      return `Rupee ` + words + ` Only`;
    }
  };

  const sampleValue = item.standardUnits;
  const priceInWords = convertToWords(parseInt(sampleValue), "Shares");

  const priceValue = item.price;
  const price = convertToWords(parseInt(priceValue), "Rupee");

  const handleFirstSign = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
        // }
        // else {
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setfirstSignImg(null);
        setfirstSignImgPreview(null);
      }
    }
  };

  const handleSecondSign = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
        // setSecondSignImgImgPreview(null)
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setSecondSignImg(null);
        setSecondSignImgImgPreview(null);
      }
    }
  };

  const handleThirdSign = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setThirdSignImg(null);
        setThirdSignImgImgPreview(null);
      }
    }
  };

  const handleChequeLeafUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
        // setChequeUploadImgPreview(null)
        // } else {
        setChequeUploadImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setChequeUploadImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, chequeUploadImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          chequeUploadImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setChequeUploadImg(null);
        setChequeUploadImgPreview(null);
      }
    }
  };

  const handleNomineePanImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "nomineeUploadPanImg");
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setNomineeUploadPanImg(null);
        setNomineeUploadPanImgPreview(null);
      }
    }
  };

  const handleNomineeProfileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "nominee UploadImg");
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setNomineeUploadImg(null);
        setNomineeUploadImgPreview(null);
      }
    }
  };

  const handleSecondNomineePanImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setSecondNomineeUploadPanImg(null);
        setSecondNomineeUploadPanImgPreview(null);
      }
    }
  };

  const handleSecondNomineeProfileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setSecondNomineeUploadProfileImgPreview(null);
      }
    }
  };

  const handleThirdNomineePanImgUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setThirdNomineeUploadPanImg(null);
        setThirdNomineeUploadPanImgPreview(null);
      }
    }
  };

  const handleThirdNomineeProfileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file, "first sign");
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
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file..",
        });
        setThirdNomineeUploadProfileImg(null);
        setThirdNomineeUploadProfileImgPreview(null);
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
                      West Mambalam,Chennai - 600033
                    </text>
                    <br></br>
                    <div>
                      {/* {item.id === 2 ? (
                                                <div>
                                                    <text className="gpbond_text" style={{ textAlign: "center" }}>APPLICATION FOR RESIDENTS TO APPLY FOR CUMULATIVE REDEEMABLE PREFERENCE SHARES WITHOUT COUPON RATE</text>
                                                    <br />
                                                    <br />
                                                </div>
                                            ) : item.id === 1 ? (
                                                <div>
                                                    <text className="gpbond_text" style={{ textAlign: "center" }}>APPLICATION FOR RESIDENTS TO APPLY FOR CUMULATIVE REDEEMABLE PREFERENCE SHARES <br></br> WITH COUPON RATE AT 9% PER ANNUM.</text>
                                                    <br />
                                                    <br />
                                                </div>
                                            ) : null} */}
                      <div>
                        <text
                          className="gpbond_text"
                          style={{ textAlign: "center" }}
                        >
                          APPLICATION FOR RESIDENTS TO APPLY FOR CUMULATIVE
                          REDEEMABLE PREFERENCE SHARES{" "}
                          {item.bondName?.toUpperCase()}
                        </text>
                        <br />
                        <br />
                      </div>
                    </div>
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
                    <div className="register_form">
                      <div>
                        <span className="bond_label">Dear Sirs/Madam,</span>
                        <br></br>
                        <br></br>
                        <span className="bond_label">
                          I, hereby apply to you for allotment of the Cumulative
                          Redeemable Preference shares without premium to us as
                          stated below. The amount payable on application is
                          shown below is remitted herewith. We hereby agree to
                          accept the above Preference shares applied for, or
                          such lesser number of Preference shares as may be
                          allotted to us. We also understand that those shares
                          will have one voting right for every Preference Shares
                          at Class Meetings of respective shareholders. We
                          undertake that we will sign all such other documents
                          and do all such other acts, if any, necessary on our
                          part to enable us to be registered as the holder(s) of
                          the Preference shares that may be allotted to us. We
                          authorize you to place our name on the Register of
                          Members of the Company as holders of the Preference
                          Shares that may be allotted to us and to register
                          my/our address(es) as given below. We note that the
                          Board of Directors are entitled in their absolute
                          discretion to accept or reject this application in
                          whole or in part without assigning any reasons
                          whatsoever in the event, the amount paid by us is
                          incorrect.
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
                                <th style={headerCellStyle}>In Numbers</th>
                                <th style={headerCellStyle}>In Words</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={cellStyle}>
                                  No of Preference Shares Applied
                                </td>
                                <td style={cellStyleforPrice}>
                                  {shareFormatter.format(item.standardUnits)}
                                </td>
                                <td style={cellStyle}>{priceInWords}</td>
                              </tr>
                              <tr>
                                <td style={cellStyle}>Amount Paid</td>
                                <td style={cellStyleforPrice}>
                                  {formatter.format(item.price)}
                                </td>
                                <td style={cellStyle}>{price}</td>
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
                            {/* ------------- JOINT BOND --------- */}
                            {item.bondId === "2" && (
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
                                        value={userName}
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
                                        maxLength={50}
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
                                        PAN NUMBER :{" "}
                                        <span className="required">*</span>
                                      </label>
                                      <input
                                        id="panCard"
                                        type="text"
                                        placeholder="Enter Pan Card Number"
                                        className="inputbond"
                                        maxLength={10}
                                        value={panCard || ""}
                                        readOnly
                                        disabled
                                        // onChange={(e) => {
                                        //     setPanCard(e.target.value);
                                        //     onChangeValidation(e, 'panCard');
                                        // }}
                                        // onBlur={() => focusOutValidation("occupation")}
                                      />
                                      {formErrors.panCard && (
                                        <div className="field_form_alert">
                                          <span>{formErrors.panCard}</span>
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
                                          maxLength={50}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setFatherName(inputValue);
                                              onChangeValidation(
                                                e,
                                                "fatherName"
                                              );
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
                                  <div className="col-lg-6 col-12">
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
                                            const selectedValue =
                                              e.target.value;
                                            setNomineeminormajor(selectedValue);
                                            if (selectedValue === "MAJOR") {
                                              setNomineeDob("");
                                              setNomineeguarname("");
                                              setNomineeGurdianRelation("");
                                            } else if (
                                              selectedValue === "MINOR"
                                            ) {
                                              setNomineePan("");
                                              setNomineeUploadPanImg(null);
                                              setNomineeUploadPanImgPreview(
                                                null
                                              );
                                              setNomineeUploadImg(null);
                                              setNomineeUploadImgPreview(null);
                                            }
                                          }}
                                        >
                                          <option value="" disabled>
                                            Select Type of Nominee{" "}
                                          </option>
                                          {nomineeList.map(
                                            (paymentMethod, i) => (
                                              <option
                                                key={i}
                                                value={paymentMethod}
                                              >
                                                {paymentMethod}
                                              </option>
                                            )
                                          )}
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
                                            focusOutValidation(
                                              "detailsofNomine"
                                            )
                                          }
                                        />
                                      </div>
                                      {formErrors.detailsofNomine && (
                                        <div className="field_form_alert">
                                          <span>
                                            {formErrors.detailsofNomine}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* ----------- Nominee Details for major ---------- */}
                                  {nomineeminormajor === "MAJOR" && (
                                    <>
                                      <div className="col-lg-6 col-12">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            NOMINEE'S PAN NUMBER :
                                          </label>
                                          <input
                                            id="nomineePan"
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
                                      <div className="col-lg-6 col-12">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            UPLOAD NOMINEE'S PAN :{" "}
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
                                          {/* {nomineeUploadPanImgPreview && (
                                                                                        <div className="preview_card_img">
                                                                                            <div className='icon_div'>
                                                                                                <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                                    setNomineeUploadPanImg(null)
                                                                                                    setNomineeUploadPanImgPreview(null)
                                                                                                    const receiptImgElement = document.getElementById('nomineeUploadPanImg');
                                                                                                    if (receiptImgElement.value !== '') {
                                                                                                        receiptImgElement.value = '';
                                                                                                    }
                                                                                                }} />
                                                                                            </div>
                                                                                            <img src={nomineeUploadPanImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                        </div>
                                                                                    )} */}
                                          {nomineeUploadPanImgPreview && (
                                            <div className="preview_card_img">
                                              <div className="icon_div">
                                                <RiCloseCircleFill
                                                  style={{ size: "25px" }}
                                                  onClick={() => {
                                                    setNomineeUploadPanImg(
                                                      null
                                                    );
                                                    setNomineeUploadPanImgPreview(
                                                      null
                                                    );
                                                    const receiptImgElement =
                                                      document.getElementById(
                                                        "nomineeUploadPanImg"
                                                      );
                                                    if (
                                                      receiptImgElement.value !==
                                                      ""
                                                    ) {
                                                      receiptImgElement.value =
                                                        "";
                                                    }
                                                  }}
                                                />
                                              </div>
                                              {nomineeUploadPanImgPreview.startsWith(
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
                                                <img
                                                  alt=""
                                                  // onClick={() => setUserOciCardShow(true)}
                                                  src={
                                                    nomineeUploadPanImgPreview
                                                  }
                                                  className="bondimgPreview"
                                                />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {/* ----------- Nominee for minor Aadhaar ---------- */}
                                  {nomineeminormajor === "MINOR" && (
                                    <>
                                      <div className="col-lg-6 col-12">
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
                                                                                        }}
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
                                              const formattedDate = date
                                                ? moment(date).format(
                                                    "YYYY-MM-DD"
                                                  )
                                                : "";
                                              setNomineeDob(formattedDate);
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
                                      <div className="col-lg-6 col-12">
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
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-12">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            GUARDIAN RELATIONSHIP :
                                          </label>
                                          <input
                                            id="nomineeguarrelationship"
                                            type="text"
                                            placeholder="Enter Guardian Relationship"
                                            className="inputbond"
                                            maxLength={50}
                                            value={nomineeGurdianRelation}
                                            onChange={(e) => {
                                              const inputValue = e.target.value;
                                              const regex = /^[a-zA-Z\s]*$/;
                                              if (regex.test(inputValue)) {
                                                setNomineeGurdianRelation(
                                                  inputValue
                                                );
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  <div className="col-lg-6 col-12">
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
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setNomineeUploadImgPreview(null)
                                                                                            setNomineeUploadImg(null)
                                                                                            const receiptImgElement = document.getElementById('nomineeUploadImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={nomineeUploadImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                      {nomineeUploadImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setNomineeUploadImgPreview(
                                                  null
                                                );
                                                setNomineeUploadImg(null);
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "nomineeUploadImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {nomineeUploadImgPreview.startsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={nomineeUploadImgPreview}
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        NAME OF THE SECOND APPLICANT :
                                      </label>
                                      <input
                                        id="detailsecoundapplicant"
                                        type="text"
                                        placeholder="Enter Second Applicant's Name"
                                        className="inputbond"
                                        maxLength={50}
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
                                      {/* <label className='bond_label'>UPLOAD SECOND APPLICANT'S PHOTO : </label> */}
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
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setSecondNomineeUploadProfileImg(null)
                                                                                            setSecondNomineeUploadProfileImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('secondNomineeUploadProfileImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={secondnomineeUploadProfileImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                      {secondnomineeUploadProfileImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setSecondNomineeUploadProfileImg(
                                                  null
                                                );
                                                setSecondNomineeUploadProfileImgPreview(
                                                  null
                                                );
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "secondNomineeUploadProfileImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {secondnomineeUploadProfileImgPreview.startsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={
                                                secondnomineeUploadProfileImgPreview
                                              }
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        PAN NUMBER OF SECOND APPLICANT :{" "}
                                      </label>
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
                                      {formErrors.pannumbersecondappli && (
                                        <div className="field_form_alert">
                                          <span>
                                            {formErrors.pannumbersecondappli}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        UPLOAD SECOND APPLICANT'S PAN :{" "}
                                      </label>
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
                                      {formErrors.secondNomineeUploadPanImg && (
                                        <div className="field_form_alert">
                                          <span>
                                            {
                                              formErrors.secondNomineeUploadPanImg
                                            }
                                          </span>
                                        </div>
                                      )}
                                      {/* {secondnomineeUploadPanImgPreview && (
                                                                                <div className="preview_card_img">
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setSecondNomineeUploadPanImg(null)
                                                                                            setSecondNomineeUploadPanImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('secondNomineeUploadPanImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={secondnomineeUploadPanImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                      {secondnomineeUploadPanImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setSecondNomineeUploadPanImg(
                                                  null
                                                );
                                                setSecondNomineeUploadPanImgPreview(
                                                  null
                                                );
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "secondNomineeUploadPanImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {secondnomineeUploadPanImgPreview.startsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={
                                                secondnomineeUploadPanImgPreview
                                              }
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        NAME OF THE THIRD APPLICANT (IF ANY) :
                                      </label>
                                      <input
                                        id="detailthirdapplicant"
                                        type="text"
                                        maxLength={50}
                                        placeholder="Enter Third Applicant's Name"
                                        className="inputbond"
                                        value={detailthirdapplicant}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          const regex = /^[a-zA-Z\s]*$/;
                                          if (regex.test(inputValue)) {
                                            setDetailthirdapplicant(inputValue);
                                            onChangeValidation(
                                              e,
                                              "detailthirdapplicant"
                                            );
                                          }
                                        }}
                                        onBlur={() =>
                                          focusOutValidation(
                                            "detailthirdapplicant"
                                          )
                                        }
                                      />
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
                                      {/* <label className='bond_label'>UPLOAD THIRD APPLICANT'S PHOTO : </label> */}
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
                                        onChange={
                                          handleThirdNomineeProfileUpload
                                        }
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
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setThirdNomineeUploadProfileImg(null)
                                                                                            setThirdNomineeUploadProfileImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('thirdNomineeUploadProfileImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={thirdnomineeUploadProfileImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                      {thirdnomineeUploadProfileImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setThirdNomineeUploadProfileImg(
                                                  null
                                                );
                                                setThirdNomineeUploadProfileImgPreview(
                                                  null
                                                );
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "thirdNomineeUploadProfileImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {thirdnomineeUploadProfileImgPreview.startsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={
                                                thirdnomineeUploadProfileImgPreview
                                              }
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        PAN NUMBER OF THIRD APPLICANT :{" "}
                                      </label>
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
                                      {formErrors.pannumberthirdappli && (
                                        <div className="field_form_alert">
                                          <span>
                                            {formErrors.pannumberthirdappli}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-12">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        UPLOAD THIRD APPLICANT'S PAN :{" "}
                                      </label>
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
                                      {formErrors.thirdNomineeUploadPanImg && (
                                        <div className="field_form_alert">
                                          <span>
                                            {
                                              formErrors.thirdNomineeUploadPanImg
                                            }
                                          </span>
                                        </div>
                                      )}
                                      {/* {thirdnomineeUploadPanImgPreview && (
                                                                                <div className="preview_card_img">
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setThirdNomineeUploadPanImg(null)
                                                                                            setThirdNomineeUploadPanImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('thirdNomineeUploadPanImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={thirdnomineeUploadPanImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}
                                      {thirdnomineeUploadPanImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setThirdNomineeUploadPanImg(
                                                  null
                                                );
                                                setThirdNomineeUploadPanImgPreview(
                                                  null
                                                );
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "thirdNomineeUploadPanImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {thirdnomineeUploadPanImgPreview.startsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={
                                                thirdnomineeUploadPanImgPreview
                                              }
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* ------------- INDIVIUAL BOND --------- */}
                            {item.bondId === "1" && (
                              <div className="col-lg-12">
                                <div className="row">
                                  <div className="col-lg-4 col-md-6">
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
                                        maxLength={50}
                                        value={userName}
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
                                  <div className="col-lg-4 col-md-6">
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
                                  <div className="col-lg-4 col-md-6">
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
                                        maxLength={50}
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
                                  <div className="col-lg-4 col-md-6">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        PAN NUMBER :{" "}
                                        <span className="required">*</span>
                                      </label>
                                      <input
                                        id="panCard"
                                        type="text"
                                        readOnly
                                        disabled
                                        placeholder="Enter Pan Card Number"
                                        className="inputbond"
                                        maxLength={10}
                                        value={panCard}
                                        // onChange={(e) => {
                                        //     setPanCard(e.target.value);
                                        //     onChangeValidation(e, 'panCard');
                                        // }}
                                        // onBlur={() => focusOutValidation("occupation")}
                                      />
                                      {formErrors.panCard && (
                                        <div className="field_form_alert">
                                          <span>{formErrors.panCard}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-md-6">
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
                                          placeholder="Enter Name"
                                          className="inputbond"
                                          value={fatherName}
                                          maxLength={50}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[a-zA-Z\s]*$/;
                                            if (regex.test(inputValue)) {
                                              setFatherName(inputValue);
                                              onChangeValidation(
                                                e,
                                                "fatherName"
                                              );
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
                                            const selectedValue =
                                              e.target.value;
                                            setNomineeminormajor(selectedValue);
                                            if (selectedValue === "MAJOR") {
                                              setNomineeDob("");
                                              setNomineeguarname("");
                                              setNomineeGurdianRelation("");
                                            } else if (
                                              selectedValue === "MINOR"
                                            ) {
                                              setNomineePan("");
                                              setNomineeUploadPanImg(null);
                                              setNomineeUploadPanImgPreview(
                                                null
                                              );
                                              setNomineeUploadImg(null);
                                              setNomineeUploadImgPreview(null);
                                            }
                                          }}
                                        >
                                          <option value="" disabled>
                                            Select Type of Nominee{" "}
                                          </option>
                                          {nomineeList.map(
                                            (paymentMethod, i) => (
                                              <option
                                                key={i}
                                                value={paymentMethod}
                                              >
                                                {paymentMethod}
                                              </option>
                                            )
                                          )}
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
                                            focusOutValidation(
                                              "detailsofNomine"
                                            )
                                          }
                                        />
                                      </div>
                                      {formErrors.detailsofNomine && (
                                        <div className="field_form_alert">
                                          <span>
                                            {formErrors.detailsofNomine}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* ----------- Nominee Details for major ---------- */}
                                  {nomineeminormajor === "MAJOR" && (
                                    <>
                                      <div className="col-lg-4 col-12">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            NOMINEE'S PAN NUMBER :
                                          </label>
                                          <input
                                            id="nomineePan"
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
                                      <div className="col-lg-4 col-12">
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
                                          {/* {nomineeUploadPanImgPreview && (
                                                                                        <div className="preview_card_img">
                                                                                            <div className='icon_div'>
                                                                                                <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                                    setNomineeUploadPanImg(null)
                                                                                                    setNomineeUploadPanImgPreview(null)
                                                                                                    const receiptImgElement = document.getElementById('nomineeUploadPanImg');
                                                                                                    if (receiptImgElement.value !== '') {
                                                                                                        receiptImgElement.value = '';
                                                                                                    }
                                                                                                }} />
                                                                                            </div>
                                                                                            <img src={nomineeUploadPanImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                        </div>
                                                                                    )} */}

                                          {nomineeUploadPanImgPreview && (
                                            <div className="preview_card_img">
                                              <div className="icon_div">
                                                <RiCloseCircleFill
                                                  style={{ size: "25px" }}
                                                  onClick={() => {
                                                    setNomineeUploadPanImg(
                                                      null
                                                    );
                                                    setNomineeUploadPanImgPreview(
                                                      null
                                                    );
                                                    const receiptImgElement =
                                                      document.getElementById(
                                                        "nomineeUploadPanImg"
                                                      );
                                                    if (
                                                      receiptImgElement.value !==
                                                      ""
                                                    ) {
                                                      receiptImgElement.value =
                                                        "";
                                                    }
                                                  }}
                                                />
                                              </div>
                                              {nomineeUploadPanImgPreview.startsWith(
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
                                                <img
                                                  alt=""
                                                  // onClick={() => setUserOciCardShow(true)}
                                                  src={
                                                    nomineeUploadPanImgPreview
                                                  }
                                                  className="bondimgPreview"
                                                />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {/* ----------- Nominee for minor Aadhaar ---------- */}
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
                                                                                        }}
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
                                              const formattedDate = date
                                                ? moment(date).format(
                                                    "YYYY-MM-DD"
                                                  )
                                                : "";
                                              setNomineeDob(formattedDate);
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
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-12">
                                        <div className="responsive-column">
                                          <label className="bond_label">
                                            GUARDIAN RELATIONSHIP :
                                          </label>
                                          <input
                                            id="nomineeguarrelationship"
                                            type="text"
                                            placeholder="Enter Guardian Relationship"
                                            className="inputbond"
                                            maxLength={50}
                                            value={nomineeGurdianRelation}
                                            onChange={(e) => {
                                              const inputValue = e.target.value;
                                              const regex = /^[a-zA-Z\s]*$/;
                                              if (regex.test(inputValue)) {
                                                setNomineeGurdianRelation(
                                                  inputValue
                                                );
                                              }
                                            }}
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
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setNomineeUploadImgPreview(null)
                                                                                            setNomineeUploadImg(null)
                                                                                            const receiptImgElement = document.getElementById('nomineeUploadImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={nomineeUploadImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}

                                      {nomineeUploadImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setNomineeUploadImgPreview(
                                                  null
                                                );
                                                setNomineeUploadImg(null);
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "nomineeUploadImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {nomineeUploadImgPreview.startsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={nomineeUploadImgPreview}
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
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
                                I understand that the details furnished above
                                are true to the best of our knowledge the shares
                                if allotted are restricted for transfer
                                purposes. All provisions of the Companies Act,
                                2013 and guidelines of the Articles of
                                Association of the Company together with rules
                                of Reserve Bank of India relating to FEMA are
                                applicable. We also declare that the amount is
                                not borrowed funds and investing out of my own
                                funds. The discretion of the Board shall be
                                final, and we agree to be bound by the decision
                                of the Board in this respect.
                              </span>
                            </div>
                            <br></br>
                            {/* ------------- INDIVIUAL BOND SIGNATURE--------- */}
                            {item.bondId === "1" && (
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
                                        accept=".jpg,.png,"
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
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setfirstSignImg(null)
                                                                                            setfirstSignImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('firstSignImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={firstSignImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}

                                      {firstSignImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setfirstSignImg(null);
                                                setfirstSignImgPreview(null);
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "firstSignImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {firstSignImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          firstSignImgPreview.endsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={firstSignImgPreview}
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* ------------- JOINT BOND SIGNATURE--------- */}
                            {item.bondId === "2" && (
                              <div className="col-lg-12">
                                <div className="row">
                                  <div className="col-lg-4 col-md-6">
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        UPLOAD FIRST APPLICANT'S SIGNATURE{" "}
                                        <span className="required">*</span>
                                      </label>
                                      <input
                                        id="firstSignImg"
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
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setfirstSignImg(null)
                                                                                            setfirstSignImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('firstApplicantSignImg');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={firstSignImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}

                                      {firstSignImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setfirstSignImg(null);
                                                setfirstSignImgPreview(null);
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "firstApplicantSignImg"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {firstSignImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          firstSignImgPreview.endsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={firstSignImgPreview}
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
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
                                        accept=".jpg,.png,"
                                        onChange={handleSecondSign}
                                        onClick={handleFileInputChange}
                                        className="inputbond"
                                      />
                                      <span style={{ fontSize: "10px" }}>
                                        Note (.png, .jpeg or .jpg)
                                      </span>
                                      {formErrors.secondSignImg && (
                                        <div className="field_form_alert">
                                          <span>
                                            {formErrors.secondSignImg}
                                          </span>
                                        </div>
                                      )}
                                      {/* {secondSignImgPreview && (
                                                                                <div className="preview_card_img">
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setSecondSignImg(null)
                                                                                            setSecondSignImgImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('secoundApplicantSign');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={secondSignImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}

                                      {secondSignImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setSecondSignImg(null);
                                                setSecondSignImgImgPreview(
                                                  null
                                                );
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "secoundApplicantSign"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {secondSignImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          secondSignImgPreview.endsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={secondSignImgPreview}
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
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
                                        accept=".jpg,.png,"
                                        onChange={handleThirdSign}
                                        onClick={handleFileInputChange}
                                        className="inputbond"
                                      />
                                      <span style={{ fontSize: "10px" }}>
                                        Note (.png, .jpeg, or .jpg)
                                      </span>
                                      {formErrors.thirdSignImg && (
                                        <div className="field_form_alert">
                                          <span>{formErrors.thirdSignImg}</span>
                                        </div>
                                      )}
                                      {/* {thirdSignImgPreview && (
                                                                                <div className="preview_card_img">
                                                                                    <div className='icon_div'>
                                                                                        <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                                            setThirdSignImg(null)
                                                                                            setThirdSignImgImgPreview(null)
                                                                                            const receiptImgElement = document.getElementById('thirdApplicantSign');
                                                                                            if (receiptImgElement.value !== '') {
                                                                                                receiptImgElement.value = '';
                                                                                            }
                                                                                        }} />
                                                                                    </div>
                                                                                    <img src={thirdSignImgPreview} alt="Selected" className='bondimgPreview' />
                                                                                </div>
                                                                            )} */}

                                      {thirdSignImgPreview && (
                                        <div className="preview_card_img">
                                          <div className="icon_div">
                                            <RiCloseCircleFill
                                              style={{ size: "25px" }}
                                              onClick={() => {
                                                setThirdSignImg(null);
                                                setThirdSignImgImgPreview(null);
                                                const receiptImgElement =
                                                  document.getElementById(
                                                    "thirdApplicantSign"
                                                  );
                                                if (
                                                  receiptImgElement.value !== ""
                                                ) {
                                                  receiptImgElement.value = "";
                                                }
                                              }}
                                            />
                                          </div>
                                          {thirdSignImgPreview.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          thirdSignImgPreview.endsWith(
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
                                            <img
                                              alt=""
                                              // onClick={() => setUserOciCardShow(true)}
                                              src={thirdSignImgPreview}
                                              className="bondimgPreview"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
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
              {/* ------------ Payment Details Container ----------- */}
              <div className="register_container">
                <div className="gpbond_card col-lg-12">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "8px",
                    }}
                  >
                    <div className="welcome_text">
                      <span>Payment Details</span>
                    </div>
                    <span
                      className="info_icon"
                      data-tooltip="A maximum of 6 payments allowed."
                      style={{ cursor: "pointer", marginLeft: "8px" }}
                    >
                      <FaCircleInfo size={18} color="skyblue" />
                    </span>
                  </div>
                  {/* <div style={{ display: "flex", alignItems: "center", paddingLeft: "8px" }}>
                                        <span style={{fontSize:"12px",color:"red"}}>If Payment details not filled.The form will not be sent to the Golden Planet team.</span>
                                    </div> */}
                  {/* --------- Bank fields first ------ */}
                  {paymentDetailsArr.map((item, index) => (
                    <div
                      key={index}
                      className="row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingTop: "2%",
                      }}
                    >
                      <div className="col-11">
                        <div className="row">
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                PAYMENT DATE:{" "}
                              </label>
                              {/* <input
                                                                id="accountInfoDate"
                                                                type="datetime-local"
                                                                className={`inputbond ${(isSubmitted && !item.userPaymentDate) || showAlert ? 'input-error' : ''}`}
                                                                value={item.userPaymentDate}
                                                                min={process.env.REACT_APP_PAYMENT_DATE}
                                                                max={moment().format('YYYY-MM-DDTHH:mm')}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const formattedDate = value ? moment(value).format('YYYY-MM-DDTHH:mm:ss') : '';
                                                                    updatePaymentDetail(index, 'userPaymentDate', formattedDate);
                                                                }}
                                                            /> */}
                              <DatePicker
                                showIcon
                                showYearDropdown
                                scrollableYearDropdown
                                selected={
                                  item.userPaymentDate
                                    ? new Date(item.userPaymentDate)
                                    : null
                                }
                                onChange={(date) => {
                                  const value = date;
                                  const formattedDate = value
                                    ? moment(value).format(
                                        "YYYY-MM-DDTHH:mm:ss"
                                      )
                                    : "";
                                  updatePaymentDetail(
                                    index,
                                    "userPaymentDate",
                                    formattedDate
                                  );
                                }}
                                className={`inputbond ${
                                  (isSubmitted && !item.userPaymentDate) ||
                                  showAlert
                                    ? "input-error"
                                    : ""
                                }`}
                                showTimeSelect
                                timeFormat="hh:mm aa"
                                timeIntervals={5}
                                placeholderText="dd-mm-yyyy hh:mm"
                                dateFormat="dd-MM-yyyy hh:mm aa"
                                minDate={
                                  new Date(process.env.REACT_APP_PAYMENT_DATE)
                                }
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
                                UTR NUMBER / CHEQUE NUMBER:{" "}
                              </label>
                              <input
                                id="utr"
                                type="tel"
                                placeholder="Enter UTR Number / CHEQUE Number"
                                className={`inputbond ${
                                  (isSubmitted && !item.userTransactionNo) ||
                                  showAlert
                                    ? "input-error"
                                    : ""
                                }`}
                                value={item.userTransactionNo}
                                onChange={(e) => {
                                  let input = e.target.value
                                    .replace(/[^a-zA-Z0-9]/g, "")
                                    .toUpperCase()
                                    .slice(0, 22); // Allow only alphanumeric characters and convert to uppercase
                                  updatePaymentDetail(
                                    index,
                                    "userTransactionNo",
                                    input
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                MODE OF PAYMENT:{" "}
                              </label>
                              <select
                                id="ModeofPayment"
                                className={`inputbond ${
                                  (isSubmitted && !item.modeOfPayment) ||
                                  showAlert
                                    ? "input-error"
                                    : ""
                                }`}
                                value={item.modeOfPayment}
                                onChange={(e) =>
                                  updatePaymentDetail(
                                    index,
                                    "modeOfPayment",
                                    e.target.value
                                  )
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
                            </div>
                          </div>

                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">Amount : </label>
                              <input
                                id="amount"
                                type="text"
                                placeholder="Enter Amount"
                                className={`inputbond ${
                                  (isSubmitted && !item.amount) || showAlert
                                    ? "input-error"
                                    : ""
                                }`}
                                value={item.amount}
                                onChange={(e) => {
                                  let input = e.target.value;

                                  if (/^\d*\.?\d*$/.test(input)) {
                                    updatePaymentDetail(index, "amount", input);
                                  }
                                }}
                                onKeyDown={handleAmountKeyDown}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-1 col-1">
                        {paymentDetailsArr.length > 1 && (
                          <FaRegTrashCan
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteRow(index)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  {/* ---------same us above bank list Bank ------ */}
                  <div>
                    <div className="row" style={{ marginTop: "2%" }}>
                      <div
                        className="welcome_text"
                        style={{ paddingLeft: "20px" }}
                      >
                        <span>Bank Account details for Crediting Dividend</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginTop: "2%" }}>
                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            {" "}
                            ACCOUNT NUMBER: <span className="required">*</span>
                          </label>
                          <input
                            id="accountNo"
                            type="text"
                            placeholder="Account Number"
                            className="inputbond"
                            value={accountNo}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value) && value.length <= 16) {
                                setAccountNo(value);
                                onChangeValidation(e, "accountNo");
                              }
                            }}
                            onBlur={() => focusOutValidation("accountNo")}
                          />
                          {formErrors.accountNo && (
                            <div className="field_form_alert">
                              <span>{formErrors.accountNo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            BANK NAME : <span className="required">*</span>
                          </label>
                          <input
                            id="bankName"
                            type="text"
                            placeholder="Bank Name"
                            className="inputbond"
                            value={bankName}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const regex = /^[a-zA-Z\s]*$/;
                              if (regex.test(inputValue)) {
                                setBankName(inputValue);
                                onChangeValidation(e, "bankName");
                              }
                            }}
                            onBlur={() => focusOutValidation("bankName")}
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
                            BRANCH NAME : <span className="required">*</span>
                          </label>
                          <input
                            id="branchName"
                            type="text"
                            placeholder="Branch Name"
                            className="inputbond"
                            value={branchName}
                            maxLength={50}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const regex = /^[a-zA-Z\s]*$/;
                              if (regex.test(inputValue)) {
                                setBranchName(inputValue);
                                onChangeValidation(e, "branchName");
                              }
                            }}
                            onBlur={() => focusOutValidation("branchName")}
                          />
                          {formErrors.branchName && (
                            <div className="field_form_alert">
                              <span>{formErrors.branchName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            IFSC CODE : <span className="required">*</span>
                          </label>
                          <input
                            id="ifscCode"
                            type="text"
                            placeholder="IFSC Code"
                            className="inputbond"
                            value={ifscCode}
                            maxLength={11}
                            onChange={(e) => {
                              const inputValue = e.target.value.toUpperCase(); // Convert input to uppercase
                              const regex = /^[A-Z0-9]*$/;
                              if (regex.test(inputValue)) {
                                setIfscCode(inputValue);
                                onChangeValidation(e, "ifscCode");
                              }
                            }}
                            onBlur={() => focusOutValidation("ifscCode")}
                          />
                          {formErrors.ifscCode && (
                            <div className="field_form_alert">
                              <span>{formErrors.ifscCode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            UPLOAD CANCELLED CHEQUE LEAF / BANK STATEMENT /
                            PASSBOOK FRONT PAGE :{" "}
                            <span className="required">*</span>
                          </label>
                          <input
                            id="chequeUploadImg"
                            name="chequeUploadImg"
                            type="file"
                            accept=".jpg,.png,.pdf"
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
                                                            <div className='icon_div'>
                                                                <RiCloseCircleFill style={{ size: "25px" }} onClick={() => {
                                                                    setChequeUploadImg(null)
                                                                    setChequeUploadImgPreview(null)
                                                                    const receiptImgElement = document.getElementById('chequeUploadImg');
                                                                    if (receiptImgElement.value !== '') {
                                                                        receiptImgElement.value = '';
                                                                    }
                                                                }} />
                                                            </div>
                                                            <img src={chequeUploadImgPreview} alt="Selected" className='bondimgPreview' />
                                                        </div>
                                                    )} */}
                          {chequeUploadImgPreview && (
                            <div className="preview_card_img">
                              <div className="icon_div">
                                <RiCloseCircleFill
                                  style={{ size: "25px" }}
                                  onClick={() => {
                                    setChequeUploadImg(null);
                                    setChequeUploadImgPreview(null);
                                    const receiptImgElement =
                                      document.getElementById(
                                        "chequeUploadImg"
                                      );
                                    if (receiptImgElement.value !== "") {
                                      receiptImgElement.value = "";
                                    }
                                  }}
                                />
                              </div>
                              {chequeUploadImgPreview.startsWith(
                                "data:application/pdf"
                              ) || chequeUploadImgPreview.endsWith(".pdf") ? (
                                <div style={{ width: "100%", height: "100%" }}>
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
                                <img
                                  alt=""
                                  // onClick={() => setUserOciCardShow(true)}
                                  src={chequeUploadImgPreview}
                                  className="bondimgPreview"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="Payment_card" style={{ marginTop: "5%" }}>
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}> Payment Method <span className="required">*</span> </span>
                                            {formErrors.paymentId && <div className="field_form_alert">
                                                <span>{formErrors.paymentId}</span>
                                            </div>}
                                        </div>
                                        <div className='payment_div'>
                                            {paymentType.map((type, idx) => (
                                                <div key={idx} className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="investmentType"
                                                        id={`${type.id}-paymentId`}
                                                        value={type.id}
                                                        disabled={idx === 0}
                                                        onChange={(e) => {
                                                            setPaymentId(type.id)
                                                            onChangeValidation(e, 'paymentId');
                                                        }}
                                                        onBlur={() => focusOutValidation("paymentId")}
                                                    />
                                                    <label className="form-check-label">{type.paymentType} </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
                  <div>
                    <div className="login_label checkbox_div">
                      <input
                        type="checkbox"
                        id="consentChkFlag"
                        onChange={(e) => {
                          setConsentChkFlag(e.target.checked);
                          onChangeValidation(e, "consentChkFlag");
                        }}
                        onBlur={() => focusOutValidation("consentChkFlag")}
                      ></input>
                      <label className="checkboxlabel">
                        I AGREE THAT THE ABOVE DETAILS PROVIDED IS CORRECT TO
                        THE BEST OF MY KNOWLEDGE.
                        <span className="required">*</span>
                      </label>
                    </div>
                    <div className="cenAlig">
                      {formErrors.consentChkFlag && (
                        <div
                          className="field_form_alert"
                          style={{ paddingTop: "2px" }}
                        >
                          <span>{formErrors.consentChkFlag}</span>
                        </div>
                      )}
                    </div>
                    <div className="cenAlig" style={{ gap: "20px" }}>
                      <button className="subt_btn" type="submit">
                        Submit
                      </button>
                      <button
                        className="subt_btn"
                        type="button"
                        onClick={() => saveAsDraft()}
                      >
                        Save as Draft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
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
          </div>
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
              title={"Alert"}
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
        </form>
      </div>
    </div>
  );
};

export default Gpbond;
