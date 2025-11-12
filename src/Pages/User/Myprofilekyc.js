import React, { useContext, useEffect, useState } from "react";
import { RiMailLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { MdEdit, MdVerified } from "react-icons/md";
import { Modal } from "react-bootstrap";
import { FaRegUser } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../components/AppProvider";
import Alert from "../components/Alert";
import Webcam from "react-webcam";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import "../Register.css";
import "./Myprofilekyc.css";
import { useSidebar } from "../components/SidebarContext";
import decryptData from "../components/Decrypt";
import Select from "react-select";
import TeamsAndCondition from "./TeamsAndCondition";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import PhoneInput from "react-phone-input-2";
import getCountryCodeFromCallingCode from "../components/getCountryCode";
import { BiPhone } from "react-icons/bi";
import { loadModel, detectFace } from "../components/faceDetection";
import { RotatingLines } from "react-loader-spinner";
import {
  ritermsofofferPdf,
  nritermsofofferPdf,
  myprofileoffer,
} from "../components/imageUrl";
import PDFViewer from "../components/PDFViewer";
import DatePicker from "react-datepicker";
import moment from "moment";
import compressImg from "../components/compressImg";
import { initializeLightGallery } from "../components/lightGalleryInitializer";
import { FaFilePdf } from "react-icons/fa6";

const Myprofilekyc = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [dob, setDob] = useState("");
  const [panNo, setPanNo] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [panImg, setPanImg] = useState(null);
  const [aadhaarImg, setAadhaarImg] = useState(null);
  const [userPanImg, setUserPanImg] = useState(null);
  const [sfId, setsfId] = useState("");
  const [userAadhaarImg, setUserAadhaarImg] = useState(null);
  const webcamRef = React.useRef(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [webCamImgSrc, setWebCamImgSrc] = React.useState(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [profileImgUpload, setProfileImgUpload] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [customerRole, setCustomerRole] = useState("");
  const [userTypes, setUserTypes] = useState([]);
  const [countryTypes, setCountryTypes] = useState([]);
  const [stateTypes, setStateTypes] = useState([]);
  const [stateTypes1, setStateTypes1] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState();
  //   -------- current Address---------
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine11, setAddressLine11] = useState("");
  const [city1, setCity1] = useState("");
  const [state1, setState1] = useState("");
  const [selectedState1, setSelectedState1] = useState("");
  const [country1, setCountry1] = useState("");
  const [pincode1, setPincode1] = useState("");
  //   -------- Perment Address---------
  const [city2, setCity2] = useState("");
  const [state2, setState2] = useState("");
  const [country2, setCountry2] = useState("");
  const [pincode2, setPincode2] = useState("");
  const [sameAsCorrespondence, setSameAsCorrespondence] = useState(false);
  // ----- Alerts And Model---
  const [userAlert, setUserAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertconfirm, setAlertconfirm] = useState("");
  const [alertClose, setAlertClose] = useState(() => null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenAgree, setModalOpenAgree] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { sideBarCollapse } = useSidebar();
  const [formErrors, setFormErrors] = useState({});
  const { PostApi } = useAppContext();
  const [kycver, setKycver] = useState("");
  const navigate = useNavigate();
  // ------- pattern ------
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const passportPattern = /^[A-Za-z0-9]+$/;

  // const passportPattern = /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/;
  // const passportPattern = /^[A-PR-WY][0-9]\d\s?\d{4}[0-9]$/;

  const [userid] = useState(localStorage.getItem("user_id"));
  const [checkFlag, setCheckFlag] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const [roleId] = useState(localStorage.getItem("Role_id"));

  const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
  const [alertYesorNoMessage, setAlertYesorNoMessage] = useState("");

  const [showYesorNoErrorAlert, setShowYesorNoErrorAlert] = useState(false);
  const [alertYesorNoErrorMessage, setAlertYesorNoErrorMessage] = useState("");

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [mobileOtpModal, setMobileOtpModal] = useState(false);
  const [emailOtpModal, setEmailOtpModal] = useState(false);
  const [countdown, setCountdown] = useState(180);

  const [otpModalEmail, setOtpModalEmail] = useState("");
  const [otpModalMobile, setOtpModalMobile] = useState("");

  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);

  const [modalEmailOtpNo, setModalEmailOtpNo] = useState("");
  const [modalMobileOtpNo, setModalMobileNo] = useState("");

  const [emailOtpVerifiedNo, setEmailOtpVerifiedNo] = useState(false);
  const [mobileOtpVerifiedNo, setMobileOtpVerifiedNo] = useState(false);

  const [nriFlag, setNriFlag] = useState(false);

  const [maskedPanNo, setMaskedPanNo] = useState("");
  const [maskedAadhaarNo, setMaskedAadhaarNo] = useState("");

  const [maskedGuardianPanNo, setMaskedGuardianPanNo] = useState("");
  const [maskedGuardianAadhaarNo, setMaskedGuardianAadhaarNo] = useState("");

  const [userPanImgShow, setUserPanImgShow] = useState(false);
  const [userAadhaarImgShow, setUserAadhaarImgShow] = useState(false);
  const [userProfileImgShow, setUserProfileImgShow] = useState(false);

  const [remarkList, setRemarkList] = useState([]);

  const [offerModal, setOfferModal] = useState(false);
  const [offerFlag, setOfferFlag] = useState(false);

  const [ociYesFlag, setOciYesFlag] = useState(null);

  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [ociCardNo, setOciCardNo] = useState("");

  const [passportImg, setPassportImg] = useState(null);
  const [passportPreviewImg, setPassportPreviewImg] = useState(null);
  const [userPassportShow, setUserPassportShow] = useState(false);

  const [ociCardImg, setOciCardImg] = useState(null);
  const [ociCardPreviewImg, setOciCardPreviewImg] = useState(null);
  const [userOciCardShow, setUserOciCardShow] = useState(false);

  const [nationalityList, setNationalityList] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [sendCountryCode, setSendCountryCode] = useState("");
  const [multiFace, setMultiFace] = useState(false);

  const [userCategory, setuserCategory] = useState([]);
  const [selecteduserCategory, setSelecteduserCategory] = useState();
  const [selectedusermajorminor, setSelectedusermajorminor] = useState();

  const [guardianName, setguardianName] = useState("");
  const [guardianDob, setguardianDob] = useState("");
  const [guardianRelation, setguardianRelation] = useState("");
  const [guardianPan, setguardianPan] = useState("");
  const [guardianAadhaar, setguardianAadhaar] = useState("");

  const [guardianPanImg, setguardianPanImg] = useState("");
  const [guardianPanImgPreview, setguardianPanImgPreview] = useState("");
  const [guardianPanImgShow, setguardianPanImgShow] = useState(false);

  const [guardianAadhaarImg, setguardianAadhaarImg] = useState(null);
  const [guardianAadhaarImgPreview, setguardianAadhaarImgPreview] =
    useState("");
  const [guardianAadhaarImgShow, setguardianAadhaarImgShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailUpdate, setEmailUpdate] = useState(false);
  const [draftflag, setDraftflag] = useState(false);

  const handleYesorNo = () => {
    setShowYesorNoAlert(false);
  };

  const handleYesorNoError = () => {
    setShowYesorNoErrorAlert(false);
    setOfferModal(true);
    setOfferFlag(false);
    setFormErrors({});
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const AlphabetsPattern = (e) => {
    if (!/[a-zA-Z ]/i.test(e.key)) {
      e.preventDefault();
    }
  };

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxDate = eighteenYearsAgo.toISOString().split("T")[0];

  const countryOptions = [
    { value: "INDIA", label: "INDIA" },
    { value: "USA", label: "USA" },
  ];

  useEffect(() => {
    if (roleId !== null && roleId !== "" && roleId !== undefined) {
      getMyprofileDetails();
      getAllUserTypes();
      getAllCountry();
      getAllNationality();
      getuserCatagory();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const initializeModel = async () => {
      setLoading(true);
      // appContextValue.value = true;
      await loadModel();
      console.log("Model loaded successfully");
      setLoading(false);
      // appContextValue.value = false;
    };

    if (localStorage.getItem("kycverified") === "false") {
      initializeModel();
    }
  }, []);

  const focusOutValidation = async (label) => {
    if (label === "name") {
      if (name === "") {
        setFormErrors((e) => {
          return { ...e, name: "Please Enter  Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, name: "" };
        });
      }
    } else if (label === "usercategory") {
      if (selecteduserCategory.value === "") {
        setFormErrors((e) => {
          return { ...e, userCategory: "Please select User Category" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, userCategory: "" };
        });
      }
    } else if (label === "statusapplicant") {
      if (selectedUserType.value === "") {
        setFormErrors((e) => {
          return { ...e, statusapplicant: "Please select status of applicant" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, statusapplicant: "" };
        });
      }
    } else if (label === "email") {
      if (email === "") {
        setFormErrors((e) => {
          return { ...e, email: "Please Enter Email Address" };
        });
      } else if (emailPattern.test(email) === false) {
        setFormErrors((e) => {
          return { ...e, email: "Please Enter Valid Email Address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, email: "" };
        });
      }
    } else if (label === "modalEmail") {
      if (otpModalEmail === "") {
        setFormErrors((e) => {
          return { ...e, modalEmail: "Please Enter  Email Address" };
        });
      } else if (emailPattern.test(otpModalEmail) === false) {
        setFormErrors((e) => {
          return { ...e, modalEmail: "Please Enter Valid Email Address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, modalEmail: "" };
        });
      }
    } else if (label === "mobileNo") {
      if (mobileNo === "") {
        setFormErrors((e) => {
          return { ...e, mobileNo: "Please Enter Mobile Number" };
        });
      } else if (mobileNo.length !== 10) {
        setFormErrors((e) => {
          return { ...e, mobileNo: "Please Enter Valid Mobile Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, mobileNo: "" };
        });
      }
    } else if (label === "modalMobileNo") {
      if (otpModalMobile === "") {
        setFormErrors((e) => {
          return { ...e, modalMobileNo: "Please Enter Mobile Number" };
        });
      } else if (otpModalMobile.length !== 10) {
        setFormErrors((e) => {
          return { ...e, modalMobileNo: "Please Enter Valid Mobile Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, modalMobileNo: "" };
        });
      }
    } else if (label === "dob") {
      if (dob === "") {
        setFormErrors((e) => {
          return { ...e, dob: "Please Select  Date of Birth" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, dob: "" };
        });
      }
    } else if (label === "panNo") {
      if (panNo === "") {
        setFormErrors((e) => {
          return { ...e, panNo: "Please Enter  PAN Number" };
        });
      } else if (panPattern.test(panNo) === false) {
        setFormErrors((e) => {
          return { ...e, panNo: "Please Enter Valid PAN Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, panNo: "" };
        });
      }
    } else if (label === "aadhaar") {
      if (aadhaar === "" || aadhaar === null) {
        setFormErrors((e) => {
          return { ...e, aadhaar: "Please Enter Aadhaar Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, aadhaar: "" };
        });
      }
    } else if (label === "passportNo") {
      if (passportNo === "" || passportNo === null) {
        setFormErrors((e) => {
          return { ...e, passportNo: "Please Enter Passport Number" };
        });
      } else if (passportPattern.test(passportNo) === false) {
        setFormErrors((e) => {
          return { ...e, passportNo: "Please Enter Valid Passport Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, passportNo: "" };
        });
      }
    } else if (label === "countryOfResidence") {
      if (countryOfResidence === "" || countryOfResidence === null) {
        setFormErrors((e) => {
          return {
            ...e,
            countryOfResidence: "Please Enter Country Of residence",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, countryOfResidence: "" };
        });
      }
    } else if (label === "nationality") {
      if (nationality === "" || nationality === null) {
        setFormErrors((e) => {
          return { ...e, nationality: "Please Select Nationality" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, nationality: "" };
        });
      }
    } else if (label === "ociCardNo") {
      if (ociCardNo === "" || ociCardNo === null) {
        setFormErrors((e) => {
          return { ...e, ociCardNo: "Please Enter OCI Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, ociCardNo: "" };
        });
      }
    } else if (label === "addressLine1") {
      if (addressLine1 === "") {
        setFormErrors((e) => {
          return { ...e, addressLine1: "Please Enter Permanent Address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, addressLine1: "" };
        });
      }
    } else if (label === "addressLine11") {
      if (addressLine11 === "") {
        setFormErrors((e) => {
          return {
            ...e,
            addressLine11: "Please Enter Address for correspondence",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, addressLine11: "" };
        });
      }
    } else if (label === "city1") {
      if (city1 === "") {
        setFormErrors((e) => {
          return { ...e, city1: "Please Enter City" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, city1: "" };
        });
      }
    } else if (label === "city2") {
      if (city2 === "") {
        setFormErrors((e) => {
          return { ...e, city2: "Please Enter City" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, city2: "" };
        });
      }
    } else if (label === "pincode1") {
      if (pincode1 === "") {
        setFormErrors((e) => {
          return { ...e, pincode1: "Please Enter Postal Code" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pincode1: "" };
        });
      }
    } else if (label === "pincode2") {
      if (pincode2 === "") {
        setFormErrors((e) => {
          return { ...e, pincode2: "Please Enter Postal Code" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pincode2: "" };
        });
      }
    } else if (label === "state1") {
      if (state1 === "") {
        setFormErrors((e) => {
          return { ...e, state1: "Please Select State" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, state1: "" };
        });
      }
    } else if (label === "state2") {
      if (state2 === "") {
        setFormErrors((e) => {
          return { ...e, state2: "Please Select State" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, state2: "" };
        });
      }
    } else if (label === "country1") {
      if (country1 === "") {
        setFormErrors((e) => {
          return { ...e, country1: "Please Enter Addressline" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, country1: "" };
        });
      }
    } else if (label === "country2") {
      if (country2 === "") {
        setFormErrors((e) => {
          return { ...e, country2: "Please Select Country " };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, country2: "" };
        });
      }
    } else if (label === "check") {
      if (!checkFlag) {
        setFormErrors((errors) => {
          return {
            ...errors,
            checkbox: "Please agree to Terms and Conditions",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, checkbox: "" };
        });
      }
    } else if (label === "guardianName") {
      if (!guardianName) {
        setFormErrors((errors) => {
          return { ...errors, guardianName: "Please Enter Guardian Name" };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, guardianName: "" };
        });
      }
    } else if (label === "guardianDob") {
      if (!guardianDob) {
        setFormErrors((errors) => {
          return {
            ...errors,
            guardianDob: "Please Enter Guardian Date of Birth",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, guardianDob: "" };
        });
      }
    } else if (label === "guardianAadhaar") {
      if (!guardianAadhaar) {
        setFormErrors((errors) => {
          return {
            ...errors,
            guardianAadhaar: "Please Enter Guardian Aadhaar",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, guardianAadhaar: "" };
        });
      }
    } else if (label === "guardianPan") {
      if (!guardianPan) {
        setFormErrors((errors) => {
          return { ...errors, guardianPan: "Please Enter Guardian PAN" };
        });
      } else if (panPattern.test(guardianPan) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            guardianPan: "Please Enter Valid Guardian PAN Number",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, guardianPan: "" };
        });
      }
    } else if (label === "guardianRelation") {
      if (!guardianRelation) {
        setFormErrors((errors) => {
          return {
            ...errors,
            guardianRelation: "Please Enter Guardian Relation",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, guardianRelation: "" };
        });
      }
    }
  };

  const onChangeValidation = (e, label) => {
    if (label === "name") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, name: "Please Enter Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, name: "" };
        });
      }
    } else if (label === "userCategory") {
      const value = e.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, userCategory: "Please select User Category" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, userCategory: "" };
        });
      }
    } else if (label === "statusapplicant") {
      const value = e.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, statusapplicant: "Please select status of applicant" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, statusapplicant: "" };
        });
      }
    } else if (label === "email") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, email: "Please Enter Email Address" };
        });
      } else if (emailPattern.test(value) === false) {
        setFormErrors((e) => {
          return { ...e, email: "Please Enter Valid Email Address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, email: "" };
        });
      }
    } else if (label === "modalEmail") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, modalEmail: "Please Enter Email Address" };
        });
      } else if (emailPattern.test(value) === false) {
        setFormErrors((e) => {
          return { ...e, modalEmail: "Please Enter Valid Email Address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, modalEmail: "" };
        });
      }
    } else if (label === "mobileNo") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, mobileNo: "Please Enter Mobile Number" };
        });
      } else if (value.length !== 10) {
        setFormErrors((e) => {
          return { ...e, mobileNo: "Please Enter Valid Mobile Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, mobileNo: "" };
        });
      }
    } else if (label === "modalMobileNo") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, modalMobileNo: "Please Enter Mobile Number" };
        });
      } else if (value.length !== 10) {
        setFormErrors((e) => {
          return { ...e, modalMobileNo: "Please Enter Valid Mobile Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, modalMobileNo: "" };
        });
      }
    } else if (label === "dob") {
      const value = e;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, dob: "Please Select Date of Birth" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, dob: "" };
        });
      }
    } else if (label === "panNo") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, panNo: "Please Enter PAN Number" };
        });
      } else if (panPattern.test(value) === false) {
        setFormErrors((e) => {
          return { ...e, panNo: "Please Enter Valid PAN Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, panNo: "" };
        });
      }
    } else if (label === "aadhaar") {
      const value = e.target.value;
      if (value === "" || value === null) {
        setFormErrors((e) => {
          return { ...e, aadhaar: "Please Enter Aadhaar Number" };
        });
      } else if (value.length !== 12) {
        setFormErrors((e) => {
          return { ...e, aadhaar: "Please Enter Valid Aadhaar Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, aadhaar: "" };
        });
      }
    } else if (label === "passportNo") {
      const value = e.target.value;
      if (value === "" || value === null) {
        setFormErrors((e) => {
          return { ...e, passportNo: "Please Enter Passport Number" };
        });
      } else if (passportPattern.test(value) === false) {
        setFormErrors((e) => {
          return { ...e, passportNo: "Please Enter Valid Passport Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, passportNo: "" };
        });
      }
    } else if (label === "countryOfResidence") {
      const value = e.target.value;
      if (value === "" || value === null) {
        setFormErrors((e) => {
          return {
            ...e,
            countryOfResidence: "Please Enter Country Of residence",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, countryOfResidence: "" };
        });
      }
    } else if (label === "nationality") {
      const value = e;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, nationality: "Please Select Nationality" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, nationality: "" };
        });
      }
    } else if (label === "ociCardNo") {
      const value = e.target.value;
      if (value === "" || value === null) {
        setFormErrors((e) => {
          return { ...e, ociCardNo: "Please Enter OCI Number" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, ociCardNo: "" };
        });
      }
    } else if (label === "addressLine1") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, addressLine1: "Please Enter Permanent Address" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, addressLine1: "" };
        });
      }
    } else if (label === "addressLine11") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return {
            ...e,
            addressLine11: "Please Enter Address for correspondence",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, addressLine11: "" };
        });
      }
    } else if (label === "city1") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, city1: "Please Enter City" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, city1: "" };
        });
      }
    } else if (label === "city2") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, city2: "Please Enter City" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, city2: "" };
        });
      }
    } else if (label === "pincode1") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, pincode1: "Please Enter Postal Code" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pincode1: "" };
        });
      }
    } else if (label === "pincode2") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, pincode2: "Please Enter Postal Code" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, pincode2: "" };
        });
      }
    } else if (label === "country1") {
      const value = e.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, country1: "Please Select Country " };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, country1: "" };
        });
      }
    } else if (label === "country2") {
      const value = e.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, country2: "Please Select Country " };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, country2: "" };
        });
      }
    }
    // else if (label === "state1") {
    //     const value = e.target.value;
    //     if (value === "") {
    //         setFormErrors((e) => {
    //             return { ...e, state1: "Please Select State" }
    //         })
    //     }
    //     else {
    //         setFormErrors((e) => {
    //             return { ...e, state1: "" }
    //         })
    //     }
    // }
    // else if (label === "state2") {
    //     const value = e.target.value;
    //     if (value === "") {
    //         setFormErrors((e) => {
    //             return { ...e, state2: "Please Select State" }
    //         })
    //     }
    //     else {
    //         setFormErrors((e) => {
    //             return { ...e, state2: "" }
    //         })
    //     }
    // }
    else if (label === "check") {
      const value = e.target.checked;
      if (!value) {
        setFormErrors((errors) => {
          return {
            ...errors,
            checkbox: "Please agree to Terms and Conditions",
          };
        });
      } else {
        setFormErrors((errors) => {
          return { ...errors, checkbox: "" };
        });
      }
    } else if (label === "guardianName") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, guardianName: "Please Enter Guardian Name" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, guardianName: "" };
        });
      }
    } else if (label === "guardianDob") {
      const value = e;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, guardianDob: "Please Enter Guardian Date of Birth" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, guardianDob: "" };
        });
      }
    } else if (label === "guardianAadhaar") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return {
            ...e,
            guardianAadhaar: "Please Enter Valid Guardian Aadhaar Number",
          };
        });
      } else if (value.length !== 12) {
        setFormErrors((e) => {
          return {
            ...e,
            guardianAadhaar: "Please Enter Valid Guardian Aadhaar Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, guardianAadhaar: "" };
        });
      }
    } else if (label === "guardianPan") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, guardianPan: "Please Enter Guardian PAN" };
        });
      } else if (panPattern.test(value) === false) {
        setFormErrors((e) => {
          return {
            ...e,
            guardianPan: "Please Enter Valid Guardian PAN Number",
          };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, guardianPan: "" };
        });
      }
    } else if (label === "guardianRelation") {
      const value = e.target.value;
      if (value === "") {
        setFormErrors((e) => {
          return { ...e, guardianRelation: "Please Enter Guardian Relation" };
        });
      } else {
        setFormErrors((e) => {
          return { ...e, guardianRelation: "" };
        });
      }
    }
  };

  const handlePanUpload = async (event) => {
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
        // setFormErrors({ ...formErrors, panImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setPanImg(null)
        // setUserPanImg(null)
        // const { compressedFile, base64String } = await compressImg(file);

        // setPassportImg(compressedFile);
        // setPassportPreviewImg(base64String);
        // } else {
        setPanImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setUserPanImg(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, panImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          panImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file.",
        });
        setUserPanImg("");
        setPanImg("");
      }
    }
  };

  const handleGuardianPanUpload = async (event) => {
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
        // setFormErrors({ ...formErrors, guardianPanImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setguardianPanImg(null)
        // setguardianPanImgPreview(null)
        // } else {
        setguardianPanImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setguardianPanImgPreview(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, guardianPanImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          guardianPanImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file.",
        });
        setguardianPanImg("");
        setguardianPanImgPreview("");
      }
    }
  };
  const handleGuardianAadhaarUpload = async (event) => {
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
        // setFormErrors({ ...formErrors, guardianAadhaarImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setguardianAadhaarImg(null)
        // setguardianAadhaarImgPreview(null)
        // } else {
        setguardianAadhaarImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setguardianAadhaarImgPreview(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, guardianAadhaarImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          guardianAadhaarImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file.",
        });
        setguardianAadhaarImgPreview("");
        setguardianAadhaarImg("");
      }
    }
  };
  const handlePassportUpload = async (event) => {
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
        // setFormErrors({ ...formErrors, passportImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setPassportImg(null)
        // setPassportPreviewImg(null)
        // const { compressedFile, base64String } = await compressImg(file);

        // setPassportImg(compressedFile);
        // setPassportPreviewImg(base64String);
        // } else {
        setPassportImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setPassportPreviewImg(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, passportImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          passportImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file.",
        });
      }
    }
  };

  const handleOciCardUpload = async (event) => {
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
        // setFormErrors({ ...formErrors, ociCardImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setOciCardImg(null)
        // setOciCardPreviewImg(null)
        // } else {
        setOciCardImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setOciCardPreviewImg(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, ociCardImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          passportImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file.",
        });
      }
    }
  };

  const handleAadhaarUpload = async (event) => {
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
        // setFormErrors({ ...formErrors, aadhaarImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setAadhaarImg(null)
        // setUserAadhaarImg(null)
        // } else {
        setAadhaarImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          setUserAadhaarImg(base64String);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, aadhaarImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          aadhaarImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file.",
        });
        setUserAadhaarImg("");
        setUserAadhaarImg("");
      }
    }
  };

  // const handleProfileUpload = async (event) => {

  //     const fileInput = event.target;
  //     const file = fileInput.files[0];

  //     if (file) {
  //         const fileName = file.name.toLowerCase();
  //         if (fileName.endsWith('.png') || fileName.endsWith('.jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.pdf')) {
  //             const fileSizeInKB = file.size / 1024;
  //             if (fileSizeInKB > 500) {
  //                 setFormErrors({ ...formErrors, profileImg: "File size should not exceed 500KB" })
  //                 fileInput.value = '';
  //                 setProfileImg(null)
  //                 setProfileImgUpload(null)
  //                 setWebCamImgSrc(null)
  //             } else {
  //                 const reader = new FileReader();
  //                 reader.onload = async (e) => {
  //                     const base64String = e.target.result;
  //                     const numFaces = await detectFace(base64String);
  //                     if (numFaces === -1) {
  //                         console.error('Blazeface model is not loaded yet!');
  //                         setProfileImg(null)
  //                         setWebCamImgSrc(null)
  //                         setProfileImgUpload(null);
  //                     } else if (numFaces > 1) {
  //                         // alert('Multiple faces detected!');
  //                         setUserAlert(true);
  //                         setAlertType("error")
  //                         setAlertMsg('Multiple faces detected');
  //                         setAlertClose(() => () => setUserAlert(false))
  //                         setProfileImg(null)
  //                         setWebCamImgSrc(null)
  //                         setProfileImgUpload(null);
  //                     } else if (numFaces === 0) {
  //                         // alert('No faces detected');
  //                         setUserAlert(true);
  //                         setAlertType("error")
  //                         setAlertMsg('No faces detected');
  //                         setAlertClose(() => () => setUserAlert(false))
  //                         setProfileImg(null)
  //                         setWebCamImgSrc(null)
  //                         setProfileImgUpload(null);
  //                     } else {
  //                         setProfileImg(file)
  //                         setWebCamImgSrc(null)
  //                         setProfileImgUpload(base64String);
  //                     }
  //                 };
  //                 reader.readAsDataURL(file);
  //                 setFormErrors({ ...formErrors, profileImg: "" })
  //             }
  //         }
  //         else {
  //             fileInput.value = '';
  //             setFormErrors({ ...formErrors, profileImg: "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file." })
  //             setWebCamImgSrc(null)
  //         }
  //     }
  // }

  const handleProfileUpload = async (event) => {
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
        // setFormErrors({ ...formErrors, profileImg: "File size should not exceed 500KB" });
        // fileInput.value = '';
        // setProfileImg(null);
        // setProfileImgUpload(null);
        // setWebCamImgSrc(null);
        // } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target.result;
          if (fileName.endsWith(".pdf")) {
            setProfileImgUpload(base64String);
            setProfileImg(file);
            setWebCamImgSrc(null);
          } else {
            const numFaces = await detectFace(base64String);
            if (numFaces === -1) {
              console.error("Blazeface model is not loaded yet!");
              setProfileImg(null);
              setWebCamImgSrc(null);
              setProfileImgUpload(null);
            } else if (numFaces > 1) {
              setUserAlert(true);
              setAlertType("error");
              setAlertMsg("Multiple faces detected");
              setAlertClose(() => () => setUserAlert(false));
              setProfileImg(null);
              setWebCamImgSrc(null);
              setProfileImgUpload(null);
            } else if (numFaces === 0) {
              setUserAlert(true);
              setAlertType("error");
              setAlertMsg("No faces detected");
              setAlertClose(() => () => setUserAlert(false));
              setProfileImg(null);
              setWebCamImgSrc(null);
              setProfileImgUpload(null);
            } else {
              setProfileImg(file);
              setWebCamImgSrc(null);
              setProfileImgUpload(base64String);
            }
          }
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, profileImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          profileImg:
            "Invalid file format. Please upload a .png, .jpeg, .jpg, or .pdf file.",
        });
        setWebCamImgSrc(null);
      }
    }
  };

  const handleCheckboxChange = (isChecked) => {
    if (isChecked) {
      setAddressLine11(addressLine1);
      setCity2(city1);
      setState2(state1);
      setCountry2(country1);
      setPincode2(pincode1);
      setSameAsCorrespondence(true);
      setFormErrors({
        ...formErrors,
        addressLine11: "",
        city2: "",
        pincode2: "",
        state2: "",
        country2: "",
      });
    } else {
      setAddressLine11("");
      setCity2("");
      setState2("");
      setCountry2("");
      setPincode2("");
      setSameAsCorrespondence(false);
    }
  };

  const handleFileInputChange = (event) => {
    event.target.value = "";
  };

  const openWebCamModal = () => {
    setModalOpen(true);
    setIsWebcamOn(true);
    setProfileImg(null);
    setProfileImgUpload(null);

    const id = document.getElementById("uploadProfilePhoto");
    if (id) {
      id.value = "";
    }
  };

  const closeWebCamModal = () => {
    setModalOpen(false);
    setIsWebcamOn(false);
    setProfileImg(null);
    setShowPreview(false);
    setWebCamImgSrc(null);
  };

  const openAgreementModal = () => {
    setModalOpenAgree(true);
  };

  const closeAgreementModal = () => {
    setModalOpenAgree(false);
  };

  const doneWebCamModal = () => {
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
      setWebCamImgSrc(null);
      setProfileImg(null);
      setShowPreview(false);
    } else if (numFaces > 1) {
      setUserAlert(true);
      setAlertType("error");
      setAlertMsg("Multiple faces detected");
      setAlertClose(() => () => setUserAlert(false));
      setMultiFace(true);
      setWebCamImgSrc(null);
      setProfileImg(null);
      setShowPreview(false);
    } else if (numFaces === 0) {
      setUserAlert(true);
      setAlertType("error");
      setAlertMsg("No faces detected");
      setAlertClose(() => () => setUserAlert(false));
      // alert('No faces detected!');
      setMultiFace(true);
      setWebCamImgSrc(null);
      setProfileImg(null);
      setShowPreview(false);
    } else {
      setMultiFace(false);
      const file = dataURLtoFile(imageSrc, "webcam_image.jpg");
      setWebCamImgSrc(imageSrc);
      setProfileImg(file);
      setShowPreview(true);
      setMultiFace(false);
    }
  }, [webcamRef, setWebCamImgSrc]);

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

  const getAllUserTypes = () => {
    const method = "POST";
    const url = `/user/applicantStatus`;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "getallstatus of");
        const transformedUserTypes = response.data.data.map(
          (applicantStatus) => ({
            value: applicantStatus.id,
            label: applicantStatus.applicantStatus,
          })
        );
        setUserTypes(transformedUserTypes);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  const getAllCountry = () => {
    const method = "POST";
    const url = `/user/getAllCountries`;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "get All Country");
        const countryTypesmap = response.data.data.map((country) => ({
          value: country.id,
          label: country.countryName,
        }));
        if (localStorage.getItem("UserType").toString() === "1") {
          console.log(countryTypesmap.filter((e) => e.label === "INDIA"));
          setCountryTypes(countryTypesmap.filter((e) => e.label === "INDIA"));
        } else {
          setCountryTypes(countryTypesmap);
        }
        // setCountryTypes(countryTypesmap);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  const getStateByCountry = (country, e) => {
    const method = "POST";
    const url = `/user/getStateByCountry?country=${country}`;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "get All Country");
        const stateTypesmap = response.data.data.map((state) => ({
          value: state.id,
          label: state.stateName,
        }));
        if (e === "1") {
          setStateTypes(stateTypesmap);
        } else {
          setStateTypes1(stateTypesmap);
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  const getuserCatagory = () => {
    const method = "POST";
    const url = `/userbond/nomineeTypes`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "userCatagory");
        if (Array.isArray(response.data)) {
          const transformedCatagory = response.data.map((category) => ({
            value: category,
            label: category,
          }));
          console.log("User Category:", transformedCatagory);
          setuserCategory(transformedCatagory);
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };
  const getAllNationality = () => {
    const method = "POST";
    const url = `/user/nationality`;
    const data = {};

    PostApi(method, url, data, headers)
      .then((response) => {
        const mappedItem = response.data.map((item) => ({
          value: item,
          label: item,
        }));
        setNationalityList(mappedItem);
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
      console.log(response, "KYCDetails");

      if (response.data.data.offerFlag === false) {
        setOfferModal(true);
      } else {
        setOfferModal(false);
      }

      if (
        response.data.data.userType.id === 2 ||
        response.data.data.userType.id === 3
      ) {
        setNriFlag(true);
      }

      setCustomerId(response.data.data.customerId);
      setCustomerRole(response.data.data.userType.userType);
      setName(response.data.data.firstName);
      setLastName(response.data.data.lastName);
      setEmail(response.data.data.emailId);

      // setSelecteduserCategory({
      //     value: response.data.data.userCategory,
      //     label: response.data.data.userCategory
      // })

      if (response.data.data.userCategory !== null) {
        setSelecteduserCategory({
          value: response.data.data.userCategory,
          label: response.data.data.userCategory,
        });
      } else {
        setSelecteduserCategory("");
      }

      if (
        response.data.data.countryCode !== null &&
        response.data.data.countryCode !== ""
      ) {
        setCountryCode(response.data.data.countryCode);
      } else {
        if (response.data.data.userType.id === 1) {
          setCountryCode("+91");
        } else {
          setCountryCode("");
        }
      }

      setMobileNo(response.data.data.mobileNo);
      setDob(response.data.data.dateOfBirth);
      setsfId(response.data.data.sfId);

      if (response.data.data.pan !== null && response.data.data.pan !== "") {
        const storePan = decryptData(
          response.data.data.pan,
          response.data.data.key
        );
        setPanNo(storePan);
      } else {
        setPanNo("");
      }

      if (
        response.data.data.aadhaar !== null &&
        response.data.data.aadhaar !== ""
      ) {
        const storeAadhaar = decryptData(
          response.data.data.aadhaar,
          response.data.data.key
        );
        setAadhaar(storeAadhaar);
      } else {
        setAadhaar("");
      }

      if (
        response.data.data.guardianPan !== null &&
        response.data.data.guardianPan !== ""
      ) {
        const storePan = decryptData(
          response.data.data.guardianPan,
          response.data.data.key
        );
        setguardianPan(storePan);
      } else {
        setguardianPan("");
      }

      if (
        response.data.data.guardianAadhaar !== null &&
        response.data.data.guardianAadhaar !== ""
      ) {
        const storeAadhaar = decryptData(
          response.data.data.guardianAadhaar,
          response.data.data.key
        );
        setguardianAadhaar(storeAadhaar);
      } else {
        setguardianAadhaar("");
      }

      if (
        response.data.data.passportNo !== null &&
        response.data.data.passportNo !== ""
      ) {
        const storePan = decryptData(
          response.data.data.passportNo,
          response.data.data.key
        );
        setPassportNo(storePan);
      } else {
        setPassportNo("");
      }

      if (
        response.data.data.countryOfResidence !== null &&
        response.data.data.countryOfResidence !== ""
      ) {
        setCountryOfResidence(response.data.data.countryOfResidence);
      } else {
        setCountryOfResidence("");
      }

      if (
        response.data.data.nationality !== null &&
        response.data.data.nationality !== ""
      ) {
        setNationality({
          label: response.data.data.nationality,
          value: response.data.data.nationality,
        });
      } else {
        setNationality("");
      }

      if (response.data.data.ociCard !== null) {
        setOciYesFlag(response.data.data.ociCard);
      }

      if (
        response.data.data.ociCardNo !== null &&
        response.data.data.ociCardNo !== ""
      ) {
        setOciCardNo(response.data.data.ociCardNo);
      } else {
        setOciCardNo("");
      }

      setAddressLine1(response.data.data.addressLine1);
      setAddressLine11(response.data.data.addressLine11);
      setCity1(response.data.data.city1);
      setCity2(response.data.data.city2);

      if (response.data.data.country1 !== null) {
        setCountry1({
          label: response.data.data.country1,
          value: response.data.data.country1,
        });
        getStateByCountry(response.data.data.country1, "1");
      } else {
        setCountry1("");
      }
      if (response.data.data.country2 !== null) {
        setCountry2({
          label: response.data.data.country2,
          value: response.data.data.country2,
        });
        getStateByCountry(response.data.data.country2, "2");
      } else {
        setCountry2("");
      }

      setPincode1(response.data.data.pincode1);
      setPincode2(response.data.data.pincode2);

      if (response.data.data.state1 !== null) {
        setState1({
          label: response.data.data.state1,
          value: response.data.data.state1,
        });
      } else {
        setState1("");
      }

      // setState1(response.data.data.state1);
      if (response.data.data.state2 !== null) {
        setState2({
          label: response.data.data.state2,
          value: response.data.data.state2,
        });
      } else {
        setState2("");
      }
      // setState2(response.data.data.state2);

      var perAdd =
        response.data.data.addressLine1 +
        response.data.data.city1 +
        response.data.data.country1 +
        response.data.data.pincode1 +
        response.data.data.state1 +
        response.data.data.country1;
      var corAdd =
        response.data.data.addressLine11 +
        response.data.data.city2 +
        response.data.data.country2 +
        response.data.data.pincode2 +
        response.data.data.state2 +
        response.data.data.country2;

      if (perAdd === corAdd) {
        if (perAdd !== 0 || corAdd !== 0) {
          setSameAsCorrespondence(true);
        } else {
          setSameAsCorrespondence(false);
        }
      } else {
        setSameAsCorrespondence(false);
      }

      setKycver(response.data.data.kycVerified);
      setCheckFlag(response.data.data.consentChkFlag);

      if (response.data.data.applicantStatus !== null) {
        setSelectedUserType({
          value: response.data.data.applicantStatus.id,
          label: response.data.data.applicantStatus.applicantStatus,
        });
      } else if (
        response.data.data.applicantStatus === null &&
        (response.data.data.userType.id === 2 ||
          response.data.data.userType.id === 3)
      ) {
        setSelectedUserType({
          value: 1,
          label: "INDIVIDUAL",
        });
      } else {
        setSelectedUserType("");
      }

      localStorage.setItem("kycverifiedfkflag", response.data.data.kycVerified);

      // if (response.data.data.aadhaar !== null && response.data.data.aadhaar !== '') {
      //     const decryptedAadhaar = decryptData(response.data.data.aadhaar, response.data.data.key);
      //     if (decryptedAadhaar !== null && decryptedAadhaar !== '') {
      //         const aadhaarLength = decryptedAadhaar.length;
      //         const maskedAadhaar = '*'.repeat(aadhaarLength - 4) + decryptedAadhaar.slice(-4);
      //         setMaskedAadhaarNo(maskedAadhaar);
      //     }
      //     else {
      //         setMaskedAadhaarNo('');
      //     }

      // }

      // else {
      //     setMaskedAadhaarNo('');
      // }
      if (
        response.data.data.aadhaar !== null &&
        response.data.data.aadhaar !== ""
      ) {
        const decryptedAadhaar = decryptData(
          response.data.data.aadhaar,
          response.data.data.key
        );
        if (decryptedAadhaar !== null && decryptedAadhaar !== "") {
          const aadhaarLength = decryptedAadhaar.length;
          console.log("Decrypted Aadhaar:", decryptedAadhaar); // Debugging
          console.log("Aadhaar Length:", aadhaarLength); // Debugging

          // Ensure the repeat count is not negative
          const maskedLength = Math.max(aadhaarLength - 4, 0);
          console.log("Masked Length:", maskedLength); // Debugging

          const maskedAadhaar =
            "*".repeat(maskedLength) + decryptedAadhaar.slice(-4);
          setMaskedAadhaarNo(maskedAadhaar);
        } else {
          setMaskedAadhaarNo("");
        }
      } else {
        setMaskedAadhaarNo("");
      }

      if (response.data.data.pan !== null && response.data.data.pan !== "") {
        const decryptedPan = decryptData(
          response.data.data.pan,
          response.data.data.key
        );

        if (decryptedPan !== null && decryptedPan !== "") {
          const panLength = decryptedPan.length;
          const maskedPan = "x".repeat(panLength - 3) + decryptedPan.slice(-3);
          setMaskedPanNo(maskedPan);
        } else {
          setMaskedPanNo("");
        }
      } else {
        setMaskedPanNo("");
      }

      if (response.data.data.aadhaarImage !== null) {
        // const aadhaarImageUrl = base64ToImageUrl(response.data.data.aadhaarImage);
        setUserAadhaarImg(response.data.data.aadhaarImage);
      } else {
        setUserAadhaarImg(null);
      }

      if (response.data.data.panImage !== null) {
        // const panImageUrl = base64ToImageUrl(response.data.data.panImage);
        setUserPanImg(response.data.data.panImage);
      } else {
        setUserPanImg(null);
      }

      if (response.data.data.passportImage !== null) {
        // const profileImageUrl = base64ToImageUrl(response.data.data.passportImage);
        setPassportPreviewImg(response.data.data.passportImage);
      } else {
        setPassportPreviewImg(null);
      }

      if (response.data.data.ociImage !== null) {
        // const profileImageUrl = base64ToImageUrl(response.data.data.ociImage);
        setOciCardPreviewImg(response.data.data.ociImage);
      } else {
        setOciCardPreviewImg(null);
      }

      if (response.data.data.profileImage !== null) {
        // const profileImageUrl = base64ToImageUrl(response.data.data.profileImage);
        setWebCamImgSrc(response.data.data.profileImage);
      } else {
        setWebCamImgSrc(null);
      }

      if (
        response.data.data.kycVerified === false &&
        response.data.data.userKycRemarks !== null
      ) {
        const remarks = response.data.data.userKycRemarks;
        const lastRemarkIndex = remarks.length > 0 ? remarks.length - 1 : null;
        setRemarkList(remarks[lastRemarkIndex].remarks);
      } else {
        setRemarkList([]);
      }

      setguardianName(response.data.data.guardianName);
      setguardianDob(response.data.data.guardianDob);
      // setguardianPan(response.data.data.guardianPan);
      setguardianRelation(response.data.data.guardianRelation);
      // setguardianAadhaar(response.data.data.guardianAadhaar);

      if (
        response.data.data.guardianPan !== null &&
        response.data.data.guardianPan !== ""
      ) {
        const decryptedPan = decryptData(
          response.data.data.guardianPan,
          response.data.data.key
        );
        console.log(
          response.data.data.guardianPan,
          response.data.data.key,
          "kjjhjhj"
        );

        if (decryptedPan !== null && decryptedPan !== "") {
          const panLength = decryptedPan.length;
          const maskedGuardianPan =
            "x".repeat(panLength - 3) + decryptedPan.slice(-3);
          setMaskedGuardianPanNo(maskedGuardianPan);
        } else {
          setMaskedGuardianPanNo("");
        }
      }
      if (
        response.data.data.guardianAadhaar !== null &&
        response.data.data.guardianAadhaar !== ""
      ) {
        const decryptedguardianaadhaar = decryptData(
          response.data.data.guardianAadhaar,
          response.data.data.key
        );

        if (
          decryptedguardianaadhaar !== null &&
          decryptedguardianaadhaar !== ""
        ) {
          const panLength = decryptedguardianaadhaar.length;
          const maskedGuardianaadhaar =
            "x".repeat(panLength - 3) + decryptedguardianaadhaar.slice(-3);
          setMaskedGuardianAadhaarNo(maskedGuardianaadhaar);
        } else {
          setMaskedGuardianAadhaarNo("");
        }
      }
      // if (response.data.data.guardianPanImage !== null) {
      //     const guardianpanImageUrl = base64ToImageUrl(response.data.data.guardianPanImage);
      //     setguardianPanImg(guardianpanImageUrl);
      // }
      // else {
      //     setguardianPanImg(null);
      // }
      // if (response.data.data.guardianAadhaarImage !== null) {
      //     const guardianaadhaarImageUrl = base64ToImageUrl(response.data.data.guardianAadhaarImage);
      //     setguardianAadhaarImg(guardianaadhaarImageUrl);
      // }
      // else {
      //     setguardianAadhaarImg(null);
      // }
      if (response.data.data.guardianAadhaarImage !== null) {
        // const aadhaarImageUrl = base64ToImageUrl(response.data.data.guardianAadhaarImage);
        setguardianAadhaarImgPreview(response.data.data.guardianAadhaarImage);
      } else {
        setguardianAadhaarImgPreview(null);
      }

      if (response.data.data.guardianPanImage !== null) {
        // const guardianpanImageUrl = base64ToImageUrl(response.data.data.guardianPanImage);
        setguardianPanImgPreview(response.data.data.guardianPanImage);
      } else {
        setguardianAadhaarImgPreview(null);
      }

      setDraftflag(response.data.data.draft);
      // setguardianAadhaarImg(response.data.data.guardianAadhaarImage);
      // setguardianPanImg(response.data.data.guardianPanImage);
    } catch (error) {
      console.log(error);
    }
  };

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
  const handleSelected = (selectedOption) => {
    setSelectedUserType(selectedOption);
  };
  const handleuserCatagory = (selectedOption) => {
    setSelecteduserCategory(selectedOption);
    setSelectedusermajorminor(selectedOption.value);

    setguardianName("");
    setguardianDob(null);
    setguardianRelation("");
    setguardianPan("");
    setMaskedGuardianPanNo("");
    setguardianAadhaar("");
    setMaskedGuardianAadhaarNo("");
    setguardianAadhaarImg(null);
    setguardianPanImg(null);
    setguardianPanImgPreview(null);
    setguardianAadhaarImgPreview(null);

    setDob("");
    setMaskedAadhaarNo("");
    setMaskedAadhaarNo("");
    setMaskedPanNo("");
    setPanNo("");
    setAadhaar("");
    // Clear any form validation errors related to guardian fields
    setFormErrors({
      ...formErrors,
      name: "",
      dob: "",
      panNo: "",
      aadhaar: "",
      guardianName: "",
      guardianDob: "",
      guardianRelation: "",
      guardianPan: "",
      guardianAadhaar: "",
      guardianPanImg: "",
      guardianAadhaarImg: "",
    });

    console.log(selectedOption);
  };

  // ------------ Handle Save Submit --------

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
    if (errors.name) {
      scrollToElement("name");
    } else if (errors.statusapplicant) {
      scrollToElement("statusapplicant");
    } else if (errors.email) {
      scrollToElement("email");
    } else if (errors.mobileNo) {
      scrollToElement("mobileNo");
    } else if (errors.dob) {
      scrollToElement("dob");
    } else if (errors.panNo) {
      scrollToElement("panNo");
    } else if (errors.aadhaar) {
      scrollToElement("aadhaar");
    } else if (errors.passportNo) {
      scrollToElement("passportNo");
    } else if (errors.countryOfResidence) {
      scrollToElement("countryOfResidence");
    } else if (errors.nationality) {
      scrollToElement("nationality");
    } else if (errors.ociCardNo) {
      scrollToElement("ociCardNo");
    } else if (errors.addressLine1) {
      scrollToElement("addressLine1");
    } else if (errors.city1) {
      scrollToElement("city1");
    } else if (errors.state1) {
      scrollToElement("state1");
    } else if (errors.country1) {
      scrollToElement("country1");
    } else if (errors.pincode1) {
      scrollToElement("pincode1");
    } else if (errors.addressLine11) {
      scrollToElement("addressLine11");
    } else if (errors.city2) {
      scrollToElement("city2");
    } else if (errors.country2) {
      scrollToElement("country2");
    } else if (errors.state2) {
      scrollToElement("state2");
    } else if (errors.pincode2) {
      scrollToElement("pincode2");
    } else if (errors.passportImg) {
      scrollToElement("passportImg");
    } else if (errors.ociCardImg) {
      scrollToElement("ociCardImg");
    } else if (errors.profileImg) {
      scrollToElement("profileImg");
    } else if (errors.checkbox) {
      scrollToElement("checkbox");
    }
  };
  const saveAsDraft = () => {
    setUserAlert(true);
    setAlertMsg("Are you sure you want to save the application as a draft ?");
    setAlertType("yesorno");
    setAlertClose(() => () => setUserAlert(false));
    setAlertconfirm(() => () => handleRegister(true));
  };
  const handleRegisterValidation = (event) => {
    event.preventDefault();
    const errors = {};
    if (name === "") {
      errors.name = "Please Enter  Name";
    }

    if (selectedUserType === "") {
      errors.statusapplicant = "Please Select Status of Applicant";
    }
    if (email === "") {
      errors.email = "Please Enter Email Address";
    } else if (emailPattern.test(email) === false) {
      errors.email = "Please Enter Valid Email Address";
    }
    if (mobileNo === "") {
      errors.mobileNo = "Please Enter Mobile Number";
    }
    if (dob === "" || dob === null) {
      errors.dob = "Please Select Date of Birth";
    }
    // else {
    //     const dobDate = new Date(dob);
    //     const currentDate = new Date();
    //     const minDate = new Date();
    //     const maxDate = new Date();
    //     minDate.setFullYear(currentDate.getFullYear() - 18);
    //     maxDate.setFullYear(currentDate.getFullYear() - 100);

    //     if (isNaN(dobDate)) {
    //         errors.dob = "Invalid date format.";
    //     } else if (dobDate > minDate) {
    //         errors.dob = "Dob must be at least 18 years old.";
    //     } else if (dobDate < maxDate) {
    //         errors.dob = "Dob must be less than 100 years old.";
    //     }
    // }
    // if ((nriFlag === false && selecteduserCategory.value ==="MINOR") && (panNo === "" || panNo === null)) {
    //     errors.panNo = "Please Enter PAN Number";
    // } else if ((nriFlag === false && selecteduserCategory.value ==="MINOR") && (panPattern.test(panNo) === false)) {
    //     errors.panNo = "Please Enter Valid PAN Number";
    // }
    // if (nriFlag === false && selectedusermajorminor !== "MAJOR"
    //     ((panImg === null || panImg === "") && (userPanImg === null || userPanImg === ""))) {
    //     errors.panImg = "Please Upload PAN Image";
    // }
    if (nriFlag === false && selecteduserCategory.value !== "MINOR") {
      if (panNo === "" || panNo === null) {
        errors.panNo = "Please Enter PAN Number";
      } else if (panPattern.test(panNo) === false) {
        errors.panNo = "Please Enter a Valid PAN Number";
      }
    }
    if (nriFlag === false && selecteduserCategory.value !== "MINOR") {
      if (
        (panImg === null || panImg === "") &&
        (userPanImg === null || userPanImg === "")
      ) {
        errors.panImg = "Please Upload PAN Image";
      }
    }

    if (nriFlag === false && (aadhaar === "" || aadhaar === null)) {
      errors.aadhaar = "Please Enter Aadhaar Number";
    } else if (nriFlag === false && aadhaar.length !== 12) {
      errors.aadhaar = "Please Enter Valid Aadhaar Number";
    }
    if (nriFlag === true && (passportNo === "" || passportNo === null)) {
      errors.passportNo = "Please Enter Passport Number";
    } else if (nriFlag === true && passportPattern.test(passportNo) === false) {
      errors.passportNo = "Please Enter Valid Passport Number";
    }
    if (
      nriFlag === true &&
      (countryOfResidence === "" || countryOfResidence === null)
    ) {
      errors.countryOfResidence = "Please Enter Country of residence ";
    }
    if (nriFlag === true && (nationality === "" || nationality === null)) {
      errors.nationality = "Please Select Nationality ";
    }
    if (
      nriFlag === true &&
      ociYesFlag === true &&
      (ociCardNo === "" || ociCardNo === null)
    ) {
      errors.ociCardNo = "Please Enter OCI Number";
    }
    if (addressLine1 === "" || addressLine1 === null) {
      errors.addressLine1 = "Please Enter Permanent Address";
    }
    if (addressLine11 === "" || addressLine11 === null) {
      errors.addressLine11 = "Please Enter Address for correspondence";
    }
    if (city1 === "" || city1 === null) {
      errors.city1 = "Please Enter City";
    }
    if (city2 === "" || city2 === null) {
      errors.city2 = "Please Enter City";
    }
    if (state1 === "" || state1 === null) {
      errors.state1 = "Please Select State";
    }
    if (state2 === "" || state2 === null) {
      errors.state2 = "Please Select State";
    }
    if (country1 === "" || country1 === null) {
      errors.country1 = "Please Select Country ";
    }
    if (country2 === "" || country2 === null) {
      errors.country2 = "Please Select Country ";
    }
    // if (pincode1 === "" || pincode1 === null) {
    //     errors.pincode1 = "Please Enter Postal Code ";
    // }
    if (pincode1 === "" || pincode1 === null) {
      errors.pincode1 = "Please Enter Postal Code";
    }

    // if (pincode2 === "" || pincode2 === null) {
    //     errors.pincode2 = "Please Enter Postal Code";
    // }
    if (pincode2 === "" || pincode2 === null) {
      errors.pincode2 = "Please Enter Postal Code";
    }
    if (
      nriFlag === false &&
      (selecteduserCategory === "" || selecteduserCategory === null)
    ) {
      errors.userCategory = "Please Select User Category";
    }

    if (
      (aadhaarImg === null || aadhaarImg === "") &&
      (userAadhaarImg === null || userAadhaarImg === "")
    ) {
      errors.aadhaarImg = "Please Upload Address Proof";
    }
    if (
      nriFlag === true &&
      (passportImg === null || passportImg === "") &&
      (passportPreviewImg === null || passportPreviewImg === "")
    ) {
      errors.passportImg = "Please Upload Passport";
    }
    if (
      nriFlag === true &&
      ociYesFlag === true &&
      (ociCardImg === null || ociCardImg === "") &&
      (ociCardPreviewImg === null || ociCardPreviewImg === "")
    ) {
      errors.ociCardImg = "Please Upload OCI Card";
    }
    if (
      (webCamImgSrc === null || webCamImgSrc === "") &&
      (profileImgUpload === null || profileImgUpload === "")
    ) {
      errors.profileImg = "Please Upload Profile Photo";
    }
    if (checkFlag === "" || checkFlag === null || checkFlag === false) {
      errors.checkbox = "Please agree to Terms and Conditions";
    }
    if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      (guardianName === "" || guardianName === null)
    ) {
      errors.guardianName = "Please Enter Guardian Name";
    }
    if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      (guardianDob === "" || guardianDob === null)
    ) {
      errors.guardianDob = "Please Enter Guardian Date of Birth";
    }
    if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      (guardianAadhaar === "" || guardianAadhaar === null)
    ) {
      errors.guardianAadhaar = "Please Enter Guardian Aadhaar";
    } else if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      guardianAadhaar.length !== 12
    ) {
      errors.guardianAadhaar = "Please Enter Valid Guardian Aadhaar Number";
    }

    if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      (guardianPan === "" || guardianPan === null)
    ) {
      errors.guardianPan = "Please Enter Guardian PAN";
    } else if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      panPattern.test(guardianPan) === false
    ) {
      errors.guardianPan = "Please Enter Valid Guardian PAN Number";
    }
    if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      (guardianRelation === "" || guardianRelation === null)
    ) {
      errors.guardianRelation = "Please Enter Guardian Relation";
    }
    if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      (guardianAadhaarImg === "" || guardianAadhaarImg === null) &&
      (guardianAadhaarImgPreview === "" || guardianAadhaarImgPreview === null)
    ) {
      errors.guardianAadhaarImg = "Please Upload Guardian Aadhaar Image";
    }
    if (
      (selectedusermajorminor === "MINOR" ||
        selecteduserCategory.value === "MINOR") &&
      (guardianPanImg === "" || guardianPanImg === null) &&
      (guardianPanImgPreview === "" || guardianPanImgPreview === null)
    ) {
      errors.guardianPanImg = "Please Upload Guardian PAN Image";
    }

    setFormErrors(errors);
    setFormErrorsAndScroll(errors);

    if (Object.keys(errors).length === 0) {
      setShowYesorNoAlert(true);
      setAlertYesorNoMessage("Are you sure you want to submit ?");
    }
  };

  const handleRegister = (draft) => {
    const url = "/user/register";
    const data = new FormData();
    data.append("id", userid);
    data.append("sfId", sfId);
    data.append("firstName", name);
    if (selectedUserType) {
      data.append("applicantStatusId", selectedUserType.value);
    }
    data.append("lastName", lastName);
    data.append("emailId", email);
    data.append("mobileNo", parseInt(mobileNo));
    if (dob) {
      data.append("dateOfBirth", dob);
    }
    data.append("pan", panNo);
    data.append("aadhaar", aadhaar);
    if (addressLine1) {
      data.append("addressLine1", addressLine1);
    }
    if (addressLine11) {
      data.append("addressLine11", addressLine11);
    }
    if (city1) {
      data.append("city1", city1);
    }
    if (city2) {
      data.append("city2", city2);
    }
    if (pincode1) {
      data.append("pincode1", pincode1);
    }
    if (pincode2) {
      data.append("pincode2", pincode2);
    }
    if (country1) {
      data.append("country1", country1.label);
    }
    if (country2) {
      data.append("country2", country2.label);
    }
    if (state1) {
      data.append("state1", state1.label);
    }
    if (state2) {
      data.append("state2", state2.label);
    }
    data.append("roleId", 2);
    data.append("aadhaarImg", aadhaarImg);
    data.append("panImg", panImg);
    data.append("profileImg", profileImg);
    data.append("consentChkFlag", checkFlag);
    data.append("countryCode", countryCode);
    if (nationality) {
      data.append("nationality", nationality.value);
    }
    data.append("countryOfResidence", countryOfResidence);
    data.append("passportNo", passportNo);
    data.append("ociCard", ociYesFlag);
    data.append("ociCardNo", ociCardNo);
    data.append("passportImg", passportImg);
    data.append("ociCardImg", ociCardImg);
    if (selecteduserCategory) {
      data.append("userCategory", selecteduserCategory.value);
    }
    data.append("draft", draft);
    if (nriFlag === false && selecteduserCategory.value === "MINOR") {
      data.append("guardianName", guardianName);
      if (guardianDob) {
        data.append("guardianDob", guardianDob);
      }
      data.append("guardianRelation", guardianRelation);
      data.append("guardianAadhaar", guardianAadhaar);
      data.append("guardianPan", guardianPan);
      data.append("guardianAadhaarImg", guardianAadhaarImg);
      data.append("guardianPanImg", guardianPanImg);
    }
    PostApi("POST", url, data)
      .then((response) => {
        if (response.data.status === 200) {
          setShowAlert(true);
          setUserAlert(false);
          setShowYesorNoAlert(false);
          setAlertMessage(
            <>
              <div
                className="d-none d-lg-block"
                dangerouslySetInnerHTML={{
                  __html: draft
                    ? "Your application has been saved as draft."
                    : "The above information provided has been updated.<br />The files uploaded have been received.<br />KYC verification is being processed.",
                }}
              ></div>

              <div
                className="d-block d-lg-none txtali alerttxt"
                dangerouslySetInnerHTML={{
                  __html: draft
                    ? "Your application has been saved as draft."
                    : "The above information provided has been updated.<br />The files uploaded have been received.<br />KYC verification is being processed.",
                }}
              ></div>
            </>
          );
          setAlertClose(() => () => navigate("/HomePage"));
        } else {
          setUserAlert(true);
          setShowYesorNoAlert(false);
          setAlertType("error");
          setAlertMsg(response.data.message);
          setAlertClose(() => () => setUserAlert(false));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleConditions = () => {
    setShowYesorNoErrorAlert(true);
    setOfferModal(false);
    setAlertYesorNoErrorMessage(
      "Without agreeing, we can't allow you into the application. Are you sure you want to logout?"
    );
  };
  const handleNavigate = () => {
    navigate("/");
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "43px",
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "2px",
    }),
  };

  const handleOtpModal = (label) => {
    setOtpModalOpen(true);
    if (label === "mobile") {
      setMobileOtpModal(true);
    } else if (label === "email") {
      setEmailOtpModal(true);
    }
  };

  const hanldeCloseOtpModal = () => {
    setOtpModalOpen(false);
    setMobileOtpModal(false);
    setEmailOtpModal(false);
    setFormErrors({});
    setCountdown(0);
    setMobileOtpVerified(false);
    setEmailOtpVerified(false);
    setOtpModalEmail("");
    setOtpModalMobile("");
    setModalEmailOtpNo("");
    setModalMobileNo("");
    setEmailUpdate(false);
  };

  const startCountdown = () => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(intervalId);
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  const handleOtpVerifiy = (label) => {
    if (label === "email") {
      if (countdown === 0) {
        setCountdown(180);
      }

      const errors = {};
      if (otpModalEmail === "") {
        errors.modalEmail = "Please Enter Email Address";
      } else if (emailPattern.test(otpModalEmail) === false) {
        errors.modalEmail = "Please Enter Valid Email Address";
      }

      setFormErrors(errors);
      if (Object.keys(errors).length === 0) {
        const url = "/user/otpToMail?mail=" + otpModalEmail + "&id=" + userid;
        PostApi("POST", url)
          .then((response) => {
            if (response.data.status === 200) {
              setEmailOtpVerified(true);
              setEmailUpdate(true);
              startCountdown();
              toast.success("OTP sent to your email address.");
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (label === "mobile") {
      if (countdown === 0) {
        setCountdown(180);
      }

      const errors = {};
      if (otpModalMobile === "") {
        errors.modalMobileNo = "Please Enter Mobile Number";
      } else if (otpModalMobile.length < 10) {
        errors.modalMobileNo = "Please Enter Valid Mobile Number";
      }
      setFormErrors(errors);
      if (Object.keys(errors).length === 0) {
        const url =
          "/user/otpToMobile?mobile=" + otpModalMobile + "&id=" + userid;
        PostApi("POST", url)
          .then((response) => {
            if (response.data.status === 200) {
              toast.success("OTP sent to your mobile number.");
              setMobileOtpVerified(true);
              startCountdown();
            } else if (response.data.status === 409) {
              toast.error(response.data.message);
            } else if (response.data.message === "No User Found...!") {
              setAlertMessage("Registed With Saleforce is not matched");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  const emailOtpVerify = (event) => {
    if (modalEmailOtpNo === "") {
      toast.error("Please Enter Otp");
    } else {
      event.preventDefault();
      const url =
        "/user/verifyMail?otp=" +
        modalEmailOtpNo +
        "&mail=" +
        otpModalEmail +
        "&id=" +
        userid;
      PostApi("POST", url)
        .then((response) => {
          if (response.data.message === "Email updated successfully") {
            setEmailOtpVerifiedNo(true);
            toast.success("Email updated successfully");
            navigate("/");
          } else if (response.data.message === "Email already verified") {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg(response.data.message);
            setAlertClose(() => () => window.location.reload());
          } else if (response.data.message === "Invalid otp") {
            toast.error("Invalid Email OTP Entered");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const mobileOtpVerify = (event) => {
    if (modalMobileOtpNo === "") {
      toast.error("Please Enter Otp");
    } else {
      let code = encodeURIComponent(sendCountryCode);
      const url =
        "/user/verifyMobile?otp=" +
        modalMobileOtpNo +
        "&mobileNo=" +
        otpModalMobile +
        "&id=" +
        userid +
        "&countryCode=" +
        code;

      PostApi("POST", url)
        .then((response) => {
          if (response.data.message === "Mobile updated successfully") {
            setMobileOtpVerifiedNo(true);
            window.location.reload();
            toast.success("Mobile OTP verified successfully.");
          } else if (response.data.message === "Mobile already verified") {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg(response.data.message);
            setAlertClose(() => () => window.location.reload());
          } else if (response.data.message === "Invalid otp") {
            toast.error("Invalid Mobile OTP Entered");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const offerConfirm = () => {
    const errors = {};
    if (offerFlag === false) {
      errors.offerFlag = "Please agree the Terms for the Offer";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const url = `/user/offer?userId=${userid}&status=${offerFlag}`;
      const data = null;
      PostApi("POST", url, data, headers)
        .then((response) => {
          if (response.data === true) {
            setOfferModal(false);
            setShowAlert(true);
            setAlertMessage("Thanks for Accepting the terms for the Offer.");
            setAlertClose(() => () => window.location.reload());
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChange = (value, country) => {
    const phoneNumberWithoutCountryCode = value
      .slice(country.dialCode.length)
      .trim();
    setOtpModalMobile(phoneNumberWithoutCountryCode);
    setSendCountryCode(`+${country.dialCode}`);
  };

  const subYears = (date, years) => {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() - years);
    console.log(newDate.toISOString().split("T")[0]);
    return newDate.toISOString().split("T")[0];
  };

  return (
    <div>
      <Header />
      <SidePanel />
      <div className="page_container">
        <div
          className={
            sideBarCollapse ? "main_content " : "main_content collapsed "
          }
        >
          <div className="page_wrapper">
            <div className="Summary_card">
              <div className="headerProfile row">
                <div className="col-12 col-md-6">
                  <text className="welcome_text">My Profile</text>
                </div>
                <div className="col-12 col-md-6 headercontainer">
                  <text className="customerid_head">
                    Role{" "}
                    <span
                      className="customerid_head"
                      style={{ color: "green" }}
                    >
                      {customerRole}
                    </span>{" "}
                  </text>
                  <text className="customerid_head">
                    Customer ID{" "}
                    <span
                      className="customerid_head"
                      style={{ color: "green" }}
                    >
                      {customerId}
                    </span>{" "}
                  </text>
                  <text className="customerid_head">
                    KYC Status{" "}
                    <span
                      className="customerid_head"
                      style={{ color: kycver === true ? "green" : "red" }}
                    >
                      {kycver === true ? "Success" : "Pending"}
                    </span>
                  </text>
                </div>
              </div>
              <form onSubmit={handleRegisterValidation}>
                <div className="row" style={{ marginTop: "20px" }}>
                  <div
                    className={
                      nriFlag ? "col-lg-4 col-md-12" : "col-lg-3 col-md-12"
                    }
                  >
                    <label className="login_label">
                      Name of Applicant<span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <div className="input_icons">
                        <FaRegUser />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input_box"
                        placeholder="First Name"
                        maxLength={40}
                        value={name}
                        readOnly={kycver === true}
                        onChange={(e) => {
                          setName(e.target.value);
                          onChangeValidation(e, "name");
                        }}
                        onKeyDown={AlphabetsPattern}
                        onBlur={() => focusOutValidation("name")}
                      />
                      <div className="myprofile-error-field">
                        {formErrors.name && (
                          <div className="field_form_alert">
                            <span>{formErrors.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {nriFlag === false && (
                    <div className="col-lg-3 col-md-12">
                      <div className="input_container">
                        <label className="login_label">
                          User Category<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <Select
                            styles={customStyles}
                            id="usercategory"
                            placeholder="Select Category"
                            value={selecteduserCategory}
                            options={userCategory}
                            onChange={(selectedOption) => {
                              handleuserCatagory(selectedOption);
                              setFormErrors((prevErrors) => ({
                                ...prevErrors,
                                userCategory: "", // Clear the error for userCategory
                              }));
                            }}
                            isDisabled={kycver === true || nriFlag === true}
                          />

                          <div className="myprofile-error-field">
                            {formErrors.userCategory && (
                              <div className="field_form_alert">
                                <span>{formErrors.userCategory}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={
                      nriFlag ? "col-lg-4 col-md-12" : "col-lg-3 col-md-12"
                    }
                  >
                    <div className="input_container">
                      <label className="login_label">
                        Status of Applicant
                        <span className="required_star">*</span>
                      </label>
                      <div className="input_contanier">
                        <Select
                          styles={customStyles}
                          id="statusapplicant"
                          placeholder="Select User Type"
                          value={selectedUserType}
                          options={userTypes}
                          onChange={(selectedOption) => {
                            handleSelected(selectedOption);
                            onChangeValidation(
                              { value: selectedOption.value },
                              "statusapplicant"
                            );
                          }}
                          isDisabled={kycver === true || nriFlag === true}
                        />
                        <div className="myprofile-error-field">
                          {formErrors.statusapplicant && (
                            <div className="field_form_alert">
                              <span>{formErrors.statusapplicant}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      nriFlag ? "col-lg-4 col-md-12" : "col-lg-3 col-md-12"
                    }
                  >
                    <label className="login_label">
                      Email Address<span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <div className="input_icons">
                        <RiMailLine />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input_box"
                        placeholder="Email"
                        value={email}
                        readOnly
                        onChange={(e) => {
                          setEmail(e.target.value);
                          onChangeValidation(e, "email");
                        }}
                        onBlur={() => focusOutValidation("email")}
                      />
                      {kycver === true && (
                        <MdEdit
                          disabled={kycver === true}
                          onClick={() => handleOtpModal("email")}
                          className="eye-icon_login"
                        />
                      )}
                      <div className="myprofile-error-field">
                        {formErrors.email && (
                          <div className="field_form_alert">
                            <span>{formErrors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Mobile Number <span className="required_star">*</span>{" "}
                    </label>
                    <div className="phone_input_container">
                      <div className="input_icons">
                        <BiPhone />
                      </div>
                      <PhoneInput
                        id="mobileNo"
                        countryCodeEditable={false}
                        disabled
                        value={countryCode + mobileNo}
                        containerClass="phone_input"
                        inputClass="phone_input_field"
                        disableDropdown
                        placeholder="Mobile Number"
                      />
                      {kycver === true && (
                        <MdEdit
                          disabled={kycver === true}
                          onClick={() => handleOtpModal("mobile")}
                          className="phone_eye_icon"
                        />
                      )}

                      <div className="myprofile-error-field">
                        {formErrors.mobileNo && (
                          <div className="field_form_alert">
                            <span>{formErrors.mobileNo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12 mobile_container">
                    <label className="login_label">
                      Date of Birth <span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <div className="input_icons">
                        <CiCalendarDate />
                      </div>
                      <DatePicker
                        showIcon
                        selected={dob ? new Date(dob) : null}
                        minDate={subYears(new Date(), 118)}
                        onChange={(date) => {
                          setDob(moment(date).format("YYYY-MM-DD"));
                          onChangeValidation(date, "dob");
                        }}
                        className="input_box"
                        placeholderText="dd-mm-yyyy"
                        dateFormat="dd-MM-yyyy"
                        maxDate={
                          nriFlag === true ||
                          (nriFlag === false &&
                            selecteduserCategory &&
                            selecteduserCategory.value === "MAJOR")
                            ? new Date(maxDate)
                            : new Date()
                        }
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        shouldCloseOnSelect={true}
                        disabled={kycver === true}
                        onBlur={() => focusOutValidation("dob")}
                      />

                      <div className="myprofile-error-field">
                        {formErrors.dob && (
                          <div className="field_form_alert">
                            <span>{formErrors.dob}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      PAN Number{" "}
                      {nriFlag === false &&
                      (selectedusermajorminor === "MAJOR" ||
                        (selecteduserCategory &&
                          selecteduserCategory.value === "MAJOR")) ? (
                        <span className="required_star">*</span>
                      ) : (
                        <></>
                      )}{" "}
                    </label>
                    <div className="input_contanier">
                      <div className="input_icons">
                        <FaRegAddressCard />
                      </div>
                      <input
                        type="text"
                        id="panNo"
                        name="pan"
                        className="input_box"
                        placeholder="PAN Number"
                        value={maskedPanNo}
                        readOnly={kycver === true}
                        maxLength={10}
                        onChange={(e) => {
                          const inputValue = e.target.value.toUpperCase();
                          // const filteredValue = inputValue.replace(/[^A-Z0-9]/g, '');
                          setPanNo(inputValue);
                          setMaskedPanNo(inputValue);
                          onChangeValidation(
                            {
                              ...e,
                              target: { ...e.target, value: inputValue },
                            },
                            "panNo"
                          );
                        }}
                        onKeyPress={(e) => {
                          const char = String.fromCharCode(
                            e.charCode || e.keyCode
                          );
                          // Allow only letters (a-z, A-Z), numbers (0-9), and space
                          if (!/[a-zA-Z0-9]/.test(char)) {
                            e.preventDefault(); // Prevent special characters
                          }
                        }}
                        onBlur={() => focusOutValidation("panNo")}
                        style={{
                          pointerEvents: kycver === true ? "none" : "auto",
                        }}
                      />
                      <div className="myprofile-error-field">
                        {formErrors.panNo && (
                          <div className="field_form_alert">
                            <span>{formErrors.panNo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Aadhaar Number{" "}
                      {nriFlag === false ? (
                        <span className="required_star">*</span>
                      ) : (
                        <></>
                      )}{" "}
                    </label>
                    <div className="input_contanier">
                      <div className="input_icons">
                        <FaRegAddressCard />
                      </div>
                      <input
                        id="aadhaar"
                        type="tel"
                        name="aadhaar"
                        className="input_box"
                        placeholder="Aadhaar Number"
                        maxLength={12}
                        readOnly={kycver === true}
                        value={maskedAadhaarNo}
                        onChange={(e) => {
                          let input = e.target.value.replace(/\D/g, "");
                          input = input.slice(0, 12);
                          setAadhaar(input);
                          setMaskedAadhaarNo(input);
                          onChangeValidation(e, "aadhaar");
                        }}
                        onBlur={() => focusOutValidation("aadhaar")}
                        style={{
                          pointerEvents: kycver === true ? "none" : "auto",
                        }}
                      />
                      <div className="myprofile-error-field">
                        {formErrors.aadhaar && (
                          <div className="field_form_alert">
                            <span>{formErrors.aadhaar}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {nriFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Passport Number <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <div className="input_icons">
                          <FaRegAddressCard />
                        </div>
                        <input
                          type="text"
                          id="passportNo"
                          name="pan"
                          className="input_box"
                          placeholder="Passport Number"
                          value={passportNo}
                          readOnly={kycver === true}
                          maxLength={10}
                          // onChange={(e) => {
                          //     const value = e.target.value;
                          //     const regex = /^[a-zA-Z0-9\s]*$/;
                          //     if (regex.test(value)) {
                          //         onChangeValidation(e, 'addressLine1');
                          //     }
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^[a-zA-Z0-9\s]*$/;
                            if (regex.test(value)) {
                              onChangeValidation(e, "passportNo");
                              setPassportNo(value);
                            }
                          }}
                          onBlur={() => focusOutValidation("passportNo")}
                        />
                        <div className="myprofile-error-field">
                          {formErrors.passportNo && (
                            <div className="field_form_alert">
                              <span>{formErrors.passportNo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {nriFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Country of residence{" "}
                        <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <div className="input_icons">
                          <FaRegAddressCard />
                        </div>
                        <input
                          id="countryOfResidence"
                          type="text"
                          className="input_box"
                          placeholder="Country of residence"
                          readOnly={kycver === true}
                          value={countryOfResidence}
                          onChange={(e) => {
                            const input = e.target.value.replace(
                              /[^A-Za-z\s]/g,
                              ""
                            );
                            setCountryOfResidence(input);
                            onChangeValidation(e, "countryOfResidence");
                          }}
                          onBlur={() =>
                            focusOutValidation("countryOfResidence")
                          }
                        />
                        <div className="myprofile-error-field">
                          {formErrors.countryOfResidence && (
                            <div className="field_form_alert">
                              <span>{formErrors.countryOfResidence}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {nriFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Nationality <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <div className="input_icons">
                          <FaRegAddressCard />
                        </div>
                        <Select
                          id="nationality"
                          styles={customStyles}
                          options={nationalityList}
                          placeholder="Select Nationality"
                          value={nationality}
                          isDisabled={kycver === true}
                          onChange={(e) => {
                            setNationality(e);
                            onChangeValidation(e, "nationality");
                          }}
                        />
                        <div className="myprofile-error-field">
                          {formErrors.nationality && (
                            <div className="field_form_alert">
                              <span>{formErrors.nationality}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-12">
                    <label className="login_label">
                      Permanent Address<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        className="inputsf"
                        placeholder="Permanent Address"
                        value={addressLine1}
                        readOnly={kycver === true}
                        onChange={(e) => {
                          const value = e.target.value;
                          // const regex = /^[a-zA-Z0-9\s]*$/;
                          const regex =
                            /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]*$/;
                          if (regex.test(value)) {
                            setAddressLine1(value);
                            if (sameAsCorrespondence === true) {
                              setAddressLine11(value);
                            }
                            onChangeValidation(e, "addressLine1");
                          }
                        }}
                        onBlur={() => focusOutValidation("addressLine1")}
                      />
                      <div className="myprofile-error-field">
                        {formErrors.addressLine1 && (
                          <div className="field_form_alert">
                            <span>{formErrors.addressLine1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <label className="login_label">
                          Country<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <Select
                            id="country1"
                            styles={customStyles}
                            options={countryTypes}
                            placeholder="Select Country"
                            value={country1}
                            isDisabled={kycver === true}
                            onChange={(e) => {
                              setCountry1(e);
                              setState1(null);
                              if (sameAsCorrespondence === true) {
                                setCountry2(e);
                              }
                              onChangeValidation(e, "country1");
                              getStateByCountry(e.label, "1");
                            }}
                            onKeyPress={(e) => {
                              const charCode = e.charCode || e.keyCode;
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <div className="myprofile-error-field">
                            {formErrors.country1 && (
                              <div className="field_form_alert">
                                <span>{formErrors.country1}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <label className="login_label">
                          State<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <Select
                            id="state1"
                            styles={customStyles}
                            options={stateTypes}
                            placeholder="Select State"
                            value={state1}
                            isDisabled={kycver === true}
                            onChange={(e) => {
                              if (e) {
                                setState1(e);
                                console.log("Selected state:", e.value);
                                setFormErrors((prevErrors) => ({
                                  ...prevErrors,
                                  state1: null,
                                }));
                                if (sameAsCorrespondence === true) {
                                  setState2(e);
                                }
                                onChangeValidation(e, "state1");
                              } else {
                                setState1(null);
                              }
                            }}
                            onKeyPress={(e) => {
                              const charCode = e.charCode || e.keyCode;
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <div className="myprofile-error-field">
                            {formErrors.state1 && (
                              <div className="field_form_alert">
                                <span>{formErrors.state1}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-12">
                        <label className="login_label">
                          City<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <input
                            type="text"
                            id="city1"
                            name="city1"
                            className="inputsf"
                            placeholder="City"
                            value={city1}
                            readOnly={kycver === true}
                            onChange={(e) => {
                              const input = e.target.value.replace(
                                /[^A-Za-z\s]/g,
                                ""
                              );
                              setCity1(input);
                              if (sameAsCorrespondence === true) {
                                setCity2(e.target.value);
                              }
                              onChangeValidation(e, "city1");
                            }}
                            onBlur={() => focusOutValidation("city1")}
                          />
                          <div className="myprofile-error-field">
                            {formErrors.city1 && (
                              <div className="field_form_alert">
                                <span>{formErrors.city1}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <label className="login_label">
                          Postal Code<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <input
                            type="tel"
                            id="pincode1"
                            name="pincode1"
                            className="inputsf"
                            placeholder="Postal Code"
                            value={pincode1}
                            maxLength={6}
                            readOnly={kycver === true}
                            onChange={(e) => {
                              // const value = e.target.value
                              let value = e.target.value;
                              value = value.replace(/\D/g, "");
                              setPincode1(value);
                              if (sameAsCorrespondence === true) {
                                setPincode2(e.target.value);
                              }
                              onChangeValidation(e, "pincode1");
                            }}
                            onBlur={() => focusOutValidation("pincode1")}
                          />
                          <div className="myprofile-error-field">
                            {formErrors.pincode1 && (
                              <div className="field_form_alert">
                                <span>{formErrors.pincode1}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <label className="login_label">
                        Address for correspondence
                        <span className="required_star">*</span>
                      </label>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <input
                          type="checkbox"
                          disabled={kycver === true}
                          id="agreeCheckbox"
                          checked={sameAsCorrespondence}
                          onChange={(e) =>
                            handleCheckboxChange(e.target.checked)
                          }
                        />
                        <label className="sap_address">
                          {" "}
                          Same as Permanent Address
                        </label>
                      </div>
                    </div>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="addressLine11"
                        name="addressLine11"
                        className="inputsf"
                        placeholder="Address for correspondence"
                        disabled={sameAsCorrespondence}
                        value={addressLine11}
                        readOnly={kycver === true}
                        onChange={(e) => {
                          const value = e.target.value;
                          const regex =
                            /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]*$/;

                          if (regex.test(value)) {
                            setAddressLine11(value);
                            onChangeValidation(e, "addressLine11");
                          }
                        }}
                        onBlur={() => focusOutValidation("addressLine11")}
                      />

                      <div className="myprofile-error-field">
                        {formErrors.addressLine11 && (
                          <div className="field_form_alert">
                            <span>{formErrors.addressLine11}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <label className="login_label">
                          Country<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <Select
                            id="country2"
                            styles={customStyles}
                            options={countryTypes}
                            placeholder="Select Country"
                            value={country2}
                            isDisabled={sameAsCorrespondence || kycver === true}
                            onChange={(e) => {
                              setCountry2(e);
                              setState2(null);
                              onChangeValidation(e, "country2");
                              getStateByCountry(e.label, "2");
                            }}
                            onKeyPress={(e) => {
                              const charCode = e.charCode || e.keyCode;
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <div className="myprofile-error-field">
                            {formErrors.country2 && (
                              <div className="field_form_alert">
                                <span>{formErrors.country2}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-lg-6 col-md-6">
                                                <label className='login_label'>State <span className="required_star">*</span></label>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="state2"
                                                        name="state2"
                                                        className='inputsf'
                                                        placeholder="State"
                                                        value={state2}
                                                        readOnly={kycver === true}
                                                        disabled={sameAsCorrespondence}
                                                        onChange={(e) => {
                                                            const input = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                                            setState2(input)
                                                            onChangeValidation(e, 'state2')
                                                        }}
                                                        onBlur={() => focusOutValidation("state2")}
                                                    />
                                                    {formErrors.state2 && <div className="field_form_alert">
                                                        <span>{formErrors.state2}</span>
                                                    </div>}
                                                </div>
                                            </div> */}
                      <div className="col-lg-6 col-md-6">
                        <label className="login_label">
                          State<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <Select
                            id="state2"
                            styles={customStyles}
                            options={stateTypes1}
                            placeholder="Select State"
                            value={state2}
                            isDisabled={sameAsCorrespondence || kycver === true}
                            onChange={(e) => {
                              if (e) {
                                setState2(e);
                                setFormErrors((prevErrors) => ({
                                  ...prevErrors,
                                  state2: null,
                                }));
                                // console.log("Selected state:", e.value);
                                onChangeValidation(e, "state2");
                              } else {
                                state2(null);
                              }
                            }}
                            onKeyPress={(e) => {
                              const charCode = e.charCode || e.keyCode;
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                              }
                            }}
                          />

                          <div className="myprofile-error-field">
                            {formErrors.state2 && (
                              <div className="field_form_alert">
                                <span>{formErrors.state2}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <label className="login_label">
                          City <span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <input
                            type="text"
                            id="city2"
                            name="city2"
                            className="inputsf"
                            placeholder="City"
                            disabled={sameAsCorrespondence}
                            value={city2}
                            readOnly={kycver === true}
                            onChange={(e) => {
                              const input = e.target.value.replace(
                                /[^A-Za-z\s]/g,
                                ""
                              );
                              setCity2(input);
                              onChangeValidation(e, "city2");
                            }}
                            onBlur={() => focusOutValidation("city2")}
                          />
                          <div className="myprofile-error-field">
                            {formErrors.city2 && (
                              <div className="field_form_alert">
                                <span>{formErrors.city2}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <label className="login_label">
                          Postal Code<span className="required_star">*</span>
                        </label>
                        <div className="input_contanier">
                          <input
                            type="tel"
                            id="pincode2"
                            name="pincode2"
                            className="inputsf"
                            placeholder="Postal Code"
                            value={pincode2}
                            readOnly={kycver === true}
                            disabled={sameAsCorrespondence}
                            maxLength={6}
                            // maxLength={country2.value === "INDIA" ? 6 : 5}
                            onChange={(e) => {
                              let input = e.target.value;
                              input = input.replace(/\D/g, "");
                              setPincode2(input);
                              onChangeValidation(e, "pincode2");
                            }}
                            onBlur={() => focusOutValidation("pincode2")}
                          />
                          <div className="myprofile-error-field">
                            {formErrors.pincode2 && (
                              <div className="field_form_alert">
                                <span>{formErrors.pincode2}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload images  */}
                <div className="row">
                  {nriFlag === false && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Upload PAN{" "}
                        {nriFlag === false &&
                        (selectedusermajorminor === "MAJOR" ||
                          (selecteduserCategory &&
                            selecteduserCategory.value === "MAJOR")) ? (
                          <span className="required_star">*</span>
                        ) : (
                          <></>
                        )}{" "}
                      </label>
                      {/* <label className='login_label'>Upload PAN {selectedusermajorminor === "MAJOR" ? <span className="required_star">*</span> : <></>}   </label> */}
                      <div className="input_contanier">
                        <input
                          type="file"
                          id="uploadPan"
                          name="uploadPan"
                          className="input_box"
                          style={{ paddingLeft: "6px" }}
                          accept=".jpg,.png,.pdf"
                          disabled={kycver === true}
                          onChange={handlePanUpload}
                          onClick={handleFileInputChange}
                          onBlur={() => focusOutValidation("panImg")}
                        />
                        <span style={{ fontSize: "10px" }}>
                          {" "}
                          (.png, .jpeg, .jpg or .pdf)
                        </span>
                        <div className="myprofile-error-field">
                          {formErrors.panImg && (
                            <div className="field_form_alert">
                              <span>{formErrors.panImg}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {/* {userPanImg &&
                                                        <img src={userPanImg} alt='' onClick={() => setUserPanImgShow(true)} className='img_preview' />
                                                    } */}
                          {userPanImg &&
                            (userPanImg.startsWith("data:application/pdf") ||
                            userPanImg.endsWith(".pdf") ? (
                              <div style={{ width: "100%", height: "100%" }}>
                                <button
                                  class="preview-button"
                                  type="button"
                                  onClick={() =>
                                    initializeLightGallery(userPanImg)
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
                                onClick={() => setUserPanImgShow(true)}
                                src={userPanImg}
                                className="img_preview"
                              />
                            ))}
                          {userPanImgShow && (
                            <Lightbox
                              mainSrc={userPanImg}
                              onCloseRequest={() => setUserPanImgShow(false)}
                              onImageLoad={() => {
                                window.dispatchEvent(new Event("resize"));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {nriFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Upload Passport <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <input
                          type="file"
                          id="passportImg"
                          name="uploadPan"
                          className="input_box"
                          style={{ paddingLeft: "6px" }}
                          accept=".jpg,.png,.pdf"
                          disabled={kycver === true}
                          onChange={handlePassportUpload}
                          onClick={handleFileInputChange}
                          onBlur={() => focusOutValidation("passsportImg")}
                        />
                        <span style={{ fontSize: "10px" }}>
                          {" "}
                          (.png, .jpeg, .jpg or .pdf)
                        </span>
                        <div className="myprofile-error-field">
                          {formErrors.passportImg && (
                            <div className="field_form_alert">
                              <span>{formErrors.passportImg}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {/* {passportPreviewImg &&
                                                        <img src={passportPreviewImg} alt='' className='img_preview' onClick={() => setUserPassportShow(true)} />
                                                    } */}
                          {passportPreviewImg &&
                            (passportPreviewImg.startsWith(
                              "data:application/pdf"
                            ) || passportPreviewImg.endsWith(".pdf") ? (
                              <div style={{ width: "100%", height: "100%" }}>
                                <button
                                  class="preview-button"
                                  type="button"
                                  onClick={() =>
                                    initializeLightGallery(passportPreviewImg)
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
                                onClick={() => setUserPassportShow(true)}
                                src={passportPreviewImg}
                                className="img_preview"
                              />
                            ))}
                        </div>
                        {userPassportShow && (
                          <Lightbox
                            mainSrc={passportPreviewImg}
                            onCloseRequest={() => setUserPassportShow(false)}
                            onImageLoad={() => {
                              window.dispatchEvent(new Event("resize"));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  <div className="col-lg-4 col-md-12">
                    <label className="login_label">
                      Upload Address Proof{" "}
                      <span style={{ fontSize: "8px" }}>
                        {" "}
                        {nriFlag === true
                          ? "( Utility Invoices /  Driver's License )"
                          : "( Aadhaar / Driver's License )"}
                      </span>{" "}
                      <span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <input
                        type="file"
                        id="aadhaarImg"
                        name="uploadAadhaar"
                        className="input_box"
                        style={{ paddingLeft: "6px" }}
                        accept=".jpg,.png,.pdf"
                        disabled={kycver === true}
                        onChange={handleAadhaarUpload}
                        onClick={handleFileInputChange}
                      />
                      <span style={{ fontSize: "10px" }}>
                        {" "}
                        (.png, .jpeg, .jpg or .pdf)
                      </span>
                      <div className="myprofile-error-field">
                        {formErrors.aadhaarImg && (
                          <div className="field_form_alert">
                            <span>{formErrors.aadhaarImg}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        {/* {userAadhaarImg &&
                                                    <img src={userAadhaarImg} alt='' onClick={() => setUserAadhaarImgShow(true)} className='img_preview' />
                                                } */}
                        {userAadhaarImg &&
                          (userAadhaarImg.startsWith("data:application/pdf") ||
                          userAadhaarImg.endsWith(".pdf") ? (
                            <div style={{ width: "100%", height: "100%" }}>
                              <button
                                class="preview-button"
                                type="button"
                                onClick={() =>
                                  initializeLightGallery(userAadhaarImg)
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
                            <img
                              alt=""
                              onClick={() => setUserAadhaarImgShow(true)}
                              src={userAadhaarImg}
                              className="img_preview"
                            />
                          ))}
                        {userAadhaarImgShow && (
                          <Lightbox
                            mainSrc={userAadhaarImg}
                            onCloseRequest={() => setUserAadhaarImgShow(false)}
                            onImageLoad={() => {
                              window.dispatchEvent(new Event("resize"));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <label className="login_label">
                      Upload Profile Photo /
                      <span
                        onClick={() => (kycver ? null : openWebCamModal())}
                        style={{
                          color: "blue",
                          cursor: kycver ? "not-allowed" : "pointer",
                        }}
                        readOnly={kycver === true}
                      >
                        Click Camera
                      </span>
                      <span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <input
                        type="file"
                        id="profileImg"
                        name="uploadProfilePhoto"
                        className="input_box"
                        style={{ paddingLeft: "6px" }}
                        accept=".jpg,.png,.pdf"
                        disabled={kycver === true}
                        onChange={handleProfileUpload}
                        onClick={handleFileInputChange}
                      />
                      <span style={{ fontSize: "10px" }}>
                        {" "}
                        (.png, .jpeg, .jpg or .pdf)
                      </span>
                      <div className="myprofile-error-field">
                        {formErrors.profileImg && (
                          <div className="field_form_alert">
                            <span>{formErrors.profileImg}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        {/* {(webCamImgSrc && modalOpen === false) &&
                                                    <div>
                                                        <img alt='' onClick={() => setUserProfileImgShow(true)} src={webCamImgSrc} className='img_preview' />
                                                    </div>
                                                } */}
                        {webCamImgSrc &&
                          modalOpen === false &&
                          (webCamImgSrc.startsWith("data:application/pdf") ||
                          webCamImgSrc.endsWith(".pdf") ? (
                            <div style={{ width: "100%", height: "100%" }}>
                              <button
                                class="preview-button"
                                type="button"
                                onClick={() =>
                                  initializeLightGallery(webCamImgSrc)
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
                            <img
                              alt=""
                              onClick={() => setUserProfileImgShow(true)}
                              src={webCamImgSrc}
                              className="img_preview"
                            />
                          ))}
                      </div>
                      <div>
                        {profileImgUpload &&
                          (profileImgUpload.startsWith(
                            "data:application/pdf"
                          ) || profileImgUpload.endsWith(".pdf") ? (
                            <div style={{ width: "100%", height: "100%" }}>
                              <button
                                class="preview-button"
                                type="button"
                                onClick={() =>
                                  initializeLightGallery(profileImgUpload)
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
                            <img
                              alt=""
                              onClick={() => setUserProfileImgShow(true)}
                              src={profileImgUpload}
                              className="img_preview"
                            />
                          ))}
                      </div>
                      {userProfileImgShow && (
                        <Lightbox
                          mainSrc={webCamImgSrc || profileImgUpload}
                          onCloseRequest={() => setUserProfileImgShow(false)}
                          onImageLoad={() => {
                            window.dispatchEvent(new Event("resize"));
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {nriFlag === false && (
                  <>
                    {selectedusermajorminor === "MINOR" ||
                    (selecteduserCategory &&
                      selecteduserCategory.value === "MINOR") ? (
                      <>
                        <div className="col-12 col-md-12">
                          <span className="dottedlines"></span>
                        </div>
                        <div className="col-12 col-md-6">
                          <text className="welcome_text">Guardian Details</text>
                        </div>
                        {/* Guardian Details for RI  */}
                        <div className="row" style={{ marginTop: "20px" }}>
                          <div className="col-lg-3 col-md-12">
                            <label className="login_label">
                              Guardian Name{" "}
                              <span className="required_star">*</span>{" "}
                            </label>
                            <div className="input_contanier">
                              <div className="input_icons">
                                <FaRegUser />
                              </div>
                              <input
                                type="text"
                                id="guardianName"
                                name="guardianName"
                                className="input_box"
                                placeholder="Enter Guardian Name"
                                maxLength={40}
                                value={guardianName}
                                readOnly={kycver === true}
                                onChange={(e) => {
                                  setguardianName(e.target.value);
                                  onChangeValidation(e, "guardianName");
                                }}
                                onKeyDown={AlphabetsPattern}
                                onBlur={() =>
                                  focusOutValidation("guardianName")
                                }
                              />
                              <div className="myprofile-error-field">
                                {formErrors.guardianName && (
                                  <div className="field_form_alert">
                                    <span>{formErrors.guardianName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-12 mobile_container">
                            <label className="login_label">
                              Guardian Date of Birth{" "}
                              <span className="required_star">*</span>{" "}
                            </label>
                            <div className="input_contanier">
                              <div className="input_icons">
                                <CiCalendarDate />
                              </div>
                              <DatePicker
                                showIcon
                                selected={
                                  guardianDob ? new Date(guardianDob) : null
                                }
                                onChange={(date) => {
                                  if (date) {
                                    const formattedDate =
                                      moment(date).format("YYYY-MM-DD");
                                    setguardianDob(formattedDate);
                                    onChangeValidation(
                                      formattedDate,
                                      "guardianDob"
                                    );
                                  } else {
                                    console.error("Date is undefined");
                                  }
                                }}
                                className="input_box"
                                placeholderText="dd-mm-yyyy"
                                dateFormat="dd-MM-yyyy"
                                maxDate={new Date(maxDate)}
                                minDate={subYears(new Date(), 118)}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                                shouldCloseOnSelect={true}
                                disabled={kycver === true}
                                onBlur={() => focusOutValidation("guardianDob")}
                              />

                              <div className="myprofile-error-field">
                                {formErrors.guardianDob && (
                                  <div className="field_form_alert">
                                    <span>{formErrors.guardianDob}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-12">
                            <label className="login_label">
                              Guardian Relation
                              <span className="required_star">*</span>{" "}
                            </label>
                            <div className="input_contanier">
                              <div className="input_icons">
                                <FaRegUser />
                              </div>
                              <input
                                type="text"
                                id="guardianRelation"
                                name="guardianRelation"
                                className="input_box"
                                placeholder="Enter Guardian Relation"
                                maxLength={40}
                                value={guardianRelation}
                                readOnly={kycver === true}
                                onChange={(e) => {
                                  setguardianRelation(e.target.value);
                                  onChangeValidation(e, "guardianRelation");
                                }}
                                onKeyDown={AlphabetsPattern}
                                onBlur={() =>
                                  focusOutValidation("guardianRelation")
                                }
                              />
                              <div className="myprofile-error-field">
                                {formErrors.guardianRelation && (
                                  <div className="field_form_alert">
                                    <span>{formErrors.guardianRelation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-12">
                            <label className="login_label">
                              Guardian PAN Number{" "}
                              <span className="required_star">*</span>{" "}
                            </label>
                            <div className="input_contanier">
                              <div className="input_icons">
                                <FaRegAddressCard />
                              </div>
                              <input
                                type="text"
                                id="guardianPan"
                                name="guardianPan"
                                className="input_box"
                                placeholder="Enter Guardian PAN Number"
                                value={maskedGuardianPanNo}
                                readOnly={kycver === true}
                                maxLength={10}
                                onChange={(e) => {
                                  const inputValue =
                                    e.target.value.toUpperCase();
                                  // const filteredValue = inputValue.replace(/[^A-Z0-9]/g, '');
                                  setguardianPan(inputValue);
                                  setMaskedGuardianPanNo(inputValue);
                                  onChangeValidation(
                                    {
                                      ...e,
                                      target: {
                                        ...e.target,
                                        value: inputValue,
                                      },
                                    },
                                    "guardianPan"
                                  );
                                }}
                                onKeyPress={(e) => {
                                  const char = String.fromCharCode(
                                    e.charCode || e.keyCode
                                  );
                                  // Allow only letters (a-z, A-Z), numbers (0-9), and space
                                  if (!/[a-zA-Z0-9]/.test(char)) {
                                    e.preventDefault(); // Prevent special characters
                                  }
                                }}
                                onBlur={() => focusOutValidation("guardianPan")}
                                style={{
                                  pointerEvents:
                                    kycver === true ? "none" : "auto",
                                }}
                              />
                              <div className="myprofile-error-field">
                                {formErrors.guardianPan && (
                                  <div className="field_form_alert">
                                    <span>{formErrors.guardianPan}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12">
                            <label className="login_label">
                              Guardian Aadhaar Number{" "}
                              <span className="required_star">*</span>{" "}
                            </label>
                            <div className="input_contanier">
                              <div className="input_icons">
                                <FaRegAddressCard />
                              </div>
                              <input
                                id="guardianAadhaar"
                                type="tel"
                                name="guardianAadhaar"
                                className="input_box"
                                placeholder="Enter Guardian Aadhaar Number"
                                maxLength={12}
                                readOnly={kycver === true}
                                value={maskedGuardianAadhaarNo}
                                onChange={(e) => {
                                  let input = e.target.value.replace(/\D/g, "");
                                  input = input.slice(0, 12);
                                  setguardianAadhaar(input);
                                  setMaskedGuardianAadhaarNo(input);
                                  onChangeValidation(e, "guardianAadhaar");
                                }}
                                onBlur={() =>
                                  focusOutValidation("guardianAadhaar")
                                }
                                style={{
                                  pointerEvents:
                                    kycver === true ? "none" : "auto",
                                }}
                              />
                              <div className="myprofile-error-field">
                                {formErrors.guardianAadhaar && (
                                  <div className="field_form_alert">
                                    <span>{formErrors.guardianAadhaar}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12">
                            <label className="login_label">
                              Upload Guardian PAN{" "}
                              <span className="required_star">*</span>{" "}
                            </label>
                            <div className="input_contanier">
                              <input
                                type="file"
                                id="guardianPanImg"
                                name="guardianPanImg"
                                className="input_box"
                                style={{ paddingLeft: "6px" }}
                                accept=".jpg,.png,.pdf"
                                disabled={kycver === true}
                                onChange={handleGuardianPanUpload}
                                onClick={handleFileInputChange}
                                onBlur={() =>
                                  focusOutValidation("guardianPanImg")
                                }
                              />
                              <span style={{ fontSize: "10px" }}>
                                {" "}
                                (.png, .jpeg, .jpg or .pdf)
                              </span>
                              <div className="myprofile-error-field">
                                {formErrors.guardianPanImg && (
                                  <div className="field_form_alert">
                                    <span>{formErrors.guardianPanImg}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                {/* {guardianPanImgPreview &&
                                                                    <img src={guardianPanImgPreview} alt='' onClick={() => setguardianPanImgShow(true)} className='img_preview' />
                                                                } */}
                                {guardianPanImgPreview &&
                                  (guardianPanImgPreview.startsWith(
                                    "data:application/pdf"
                                  ) ||
                                  guardianPanImgPreview.endsWith(".pdf") ? (
                                    <div
                                      style={{ width: "100%", height: "100%" }}
                                    >
                                      <button
                                        class="preview-button"
                                        type="button"
                                        onClick={() =>
                                          initializeLightGallery(
                                            guardianPanImgPreview
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
                                      onClick={() =>
                                        setguardianPanImgShow(true)
                                      }
                                      src={guardianPanImgPreview}
                                      className="img_preview"
                                    />
                                  ))}
                                {guardianPanImgShow && (
                                  <Lightbox
                                    mainSrc={guardianPanImgPreview}
                                    onCloseRequest={() =>
                                      setguardianPanImgShow(false)
                                    }
                                    onImageLoad={() => {
                                      window.dispatchEvent(new Event("resize"));
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12">
                            <label className="login_label">
                              Upload Guardian Aadhaar{" "}
                              <span className="required_star">*</span>{" "}
                            </label>
                            <div className="input_contanier">
                              <input
                                type="file"
                                id="guardianAadhaarImg"
                                name="guardianAadhaarImg"
                                className="input_box"
                                style={{ paddingLeft: "6px" }}
                                accept=".jpg,.png,.pdf"
                                disabled={kycver === true}
                                onChange={handleGuardianAadhaarUpload}
                                onClick={handleFileInputChange}
                                onBlur={() =>
                                  focusOutValidation("guardianAadhaarImg")
                                }
                              />
                              <span style={{ fontSize: "10px" }}>
                                {" "}
                                (.png, .jpeg, .jpg or .pdf)
                              </span>
                              <div className="myprofile-error-field">
                                {formErrors.guardianAadhaarImg && (
                                  <div className="field_form_alert">
                                    <span>{formErrors.guardianAadhaarImg}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                {/* {guardianAadhaarImgPreview &&
                                                                    <img src={guardianAadhaarImgPreview} alt='' onClick={() => setguardianAadhaarImgShow(true)} className='img_preview' />
                                                                } */}
                                {guardianAadhaarImgPreview &&
                                  (guardianAadhaarImgPreview.startsWith(
                                    "data:application/pdf"
                                  ) ||
                                  guardianAadhaarImgPreview.endsWith(".pdf") ? (
                                    <div
                                      style={{ width: "100%", height: "100%" }}
                                    >
                                      <button
                                        class="preview-button"
                                        type="button"
                                        onClick={() =>
                                          initializeLightGallery(
                                            guardianAadhaarImgPreview
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
                                      onClick={() =>
                                        setguardianAadhaarImgShow(true)
                                      }
                                      src={guardianAadhaarImgPreview}
                                      className="img_preview"
                                    />
                                  ))}
                                {guardianAadhaarImgShow && (
                                  <Lightbox
                                    mainSrc={guardianAadhaarImgPreview}
                                    onCloseRequest={() =>
                                      setguardianAadhaarImgShow(false)
                                    }
                                    onImageLoad={() => {
                                      window.dispatchEvent(new Event("resize"));
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </>
                )}
                {/* Are you OCI */}

                <div className="row">
                  {nriFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Are You OCI ? <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <div style={{ gap: "10px", display: "flex" }}>
                          <input
                            id="ociyes"
                            type="radio"
                            name="ociFlag"
                            disabled={kycver === true}
                            checked={ociYesFlag === true}
                            onChange={() => setOciYesFlag(true)}
                          />
                          <label>Yes</label>
                          <input
                            id="ocino"
                            type="radio"
                            name="ociFlag"
                            checked={ociYesFlag === false}
                            disabled={kycver === true}
                            onChange={() => {
                              setOciYesFlag(false);
                              setOciCardNo("");
                              setOciCardImg(null);
                              setOciCardPreviewImg(null);
                              setFormErrors((e) => {
                                return { ...e, ociCardNo: "", ociCardImg: "" };
                              });
                            }}
                          />
                          <label>No</label>
                        </div>
                        <div>
                          <div className="myprofile-error-field">
                            {formErrors.ociYesFlag && (
                              <div className="field_form_alert">
                                <span>{formErrors.ociYesFlag}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {ociYesFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        OCI Number <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <div className="input_icons">
                          <FaRegAddressCard />
                        </div>
                        <input
                          id="ocinumber"
                          type="text"
                          className="input_box"
                          placeholder="OCI Number"
                          readOnly={kycver === true}
                          value={ociCardNo}
                          maxLength={15}
                          // onChange={(e) => {
                          //     let input = e.target.value
                          //     setOciCardNo(input);
                          //     onChangeValidation(e, "ociCardNo");
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^[a-zA-Z0-9\s]*$/;
                            if (regex.test(value)) {
                              onChangeValidation(e, "ociCardNo");
                              setOciCardNo(value);
                            }
                          }}
                          onBlur={() => focusOutValidation("ociCardNo")}
                        />
                        <div className="myprofile-error-field">
                          {formErrors.ociCardNo && (
                            <div className="field_form_alert">
                              <span>{formErrors.ociCardNo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {ociYesFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Upload OCI Card <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <input
                          type="file"
                          id="uploadocicard"
                          name="uploadPan"
                          className="input_box"
                          style={{ paddingLeft: "6px" }}
                          accept=".jpg,.png,.pdf"
                          disabled={kycver === true}
                          onChange={handleOciCardUpload}
                          onClick={handleFileInputChange}
                          onBlur={() => focusOutValidation("ociCardImg")}
                        />
                        <span style={{ fontSize: "10px" }}>
                          {" "}
                          (.png, .jpeg, .jpg or .pdf)
                        </span>
                        <div className="myprofile-error-field">
                          {formErrors.ociCardImg && (
                            <div className="field_form_alert">
                              <span>{formErrors.ociCardImg}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          {/* {ociCardPreviewImg &&
                                                        <img src={ociCardPreviewImg} alt='' className='img_preview' onClick={() => setUserOciCardShow(true)} />
                                                    } */}
                          {ociCardPreviewImg &&
                            (ociCardPreviewImg.startsWith(
                              "data:application/pdf"
                            ) || ociCardPreviewImg.endsWith(".pdf") ? (
                              <div style={{ width: "100%", height: "100%" }}>
                                <button
                                  class="preview-button"
                                  type="button"
                                  onClick={() =>
                                    initializeLightGallery(ociCardPreviewImg)
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
                                onClick={() => setUserOciCardShow(true)}
                                src={ociCardPreviewImg}
                                className="img_preview"
                              />
                            ))}
                        </div>
                        {userOciCardShow && (
                          <Lightbox
                            mainSrc={ociCardPreviewImg}
                            onCloseRequest={() => setUserOciCardShow(false)}
                            onImageLoad={() => {
                              window.dispatchEvent(new Event("resize"));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="Myprofile_agree checkbox_div">
                  <input
                    type="checkbox"
                    id="iagree"
                    className="iagreemyprofile"
                    checked={checkFlag}
                    disabled={kycver === true}
                    onChange={(e) => {
                      setCheckFlag(e.target.checked);
                      onChangeValidation(e, "check");
                    }}
                    onBlur={() => focusOutValidation("check")}
                  />
                  <label>
                    I agree to the Terms and Conditions{" "}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => openAgreementModal()}
                    >
                      {" "}
                      (Click Here for T&C){" "}
                      <span className="required_star">*</span>
                    </span>
                    <div className="myprofile-error-field">
                      {formErrors.checkbox && (
                        <div className="field_form_alert">
                          <span>{formErrors.checkbox}</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                {remarkList.length !== 0 && (
                  <div style={{ color: "red" }}>
                    <span>Rejected Reason *</span>
                    {remarkList.match(/.{1,50}/g).map((chunk, index) => (
                      <div key={index} className="reson_text">
                        {chunk}
                      </div>
                    ))}
                  </div>
                )}
                {kycver === false && (
                  // <div className='col-12 cenAlig' style={{gap:"20px"}}>
                  //     <div className='login_btn_container'>
                  //         <button id="profilesubmit" className="register_btn" type='submit'>Submit</button>
                  //     </div>
                  //     <div className='login_btn_container'>
                  //         <button id="saveussubmit" type='button' className="register_btn"  onClick={() => saveAsDraft()}>Save us Draft</button>
                  //     </div>
                  // </div>
                  <div className="cenAlig" style={{ gap: "20px" }}>
                    <button
                      id="profilesubmit"
                      className="subt_btn"
                      type="submit"
                    >
                      Submit
                    </button>
                    {draftflag && (
                      <button
                        id="saveussubmit"
                        type="button"
                        className="subt_btn"
                        onClick={() => saveAsDraft()}
                      >
                        Save as Draft
                      </button>
                    )}
                  </div>
                )}
              </form>
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
                          src={webCamImgSrc}
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
                          disabled={multiFace === true}
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
          {/* ------------ Conditions Open Modal ----------- */}
          <Modal dialogClassName="modal-xl" centered show={modalOpenAgree}>
            <Modal.Header>
              <div className="modal_subhead">
                <span className="modal_head_txt">Terms and Conditions</span>
                <AiOutlineClose
                  id="modalcloseteamsandconditions"
                  className="moda_closel_icon"
                  onClick={() => closeAgreementModal()}
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="modal_body_container" style={{ height: "500px" }}>
                <PDFViewer pdfUrl={myprofileoffer} />
              </div>
            </Modal.Body>
          </Modal>
          {/***************************** OTP Modal*************************/}
          <Modal
            dialogClassName="modal-dialog modal-md"
            centered
            show={otpModalOpen}
          >
            <Modal.Header>
              <div className="modal_subhead">
                {emailOtpModal && (
                  <span className="modal_head_txt">Email Update</span>
                )}
                {mobileOtpModal && (
                  <span className="modal_head_txt">Mobile Number Update</span>
                )}
                <AiOutlineClose
                  className="moda_closel_icon"
                  onClick={() => hanldeCloseOtpModal()}
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="modal_body_container">
                {emailOtpModal && (
                  <div name="email_content">
                    <div className="input_container">
                      <label className="login_label">
                        Email Address <span className="required">*</span>
                      </label>
                      <div
                        className="input_contanier"
                        style={{ position: "relative" }}
                      >
                        <input
                          type="email"
                          id="Emailotp"
                          name="Email"
                          className="inputsf"
                          disabled={emailUpdate === true}
                          placeholder="Email Address"
                          onChange={(e) => {
                            setOtpModalEmail(e.target.value);
                            onChangeValidation(e, "modalEmail");
                          }}
                          onBlur={() => focusOutValidation("modalEmail")}
                        />
                        <div className="myprofile-error-field">
                          {formErrors.modalEmail && (
                            <div className="field_form_alert">
                              <span>{formErrors.modalEmail}</span>
                            </div>
                          )}
                        </div>
                        {emailOtpVerified === false && (
                          <button
                            id="otpemail"
                            type="button"
                            className="otp_button"
                            onClick={() => handleOtpVerifiy("email")}
                          >
                            <span className="otp_span">Request OTP</span>
                          </button>
                        )}
                        {emailOtpVerifiedNo && (
                          <MdVerified
                            style={{ color: "green" }}
                            className="eye-icon_login"
                          />
                        )}
                      </div>
                    </div>
                    {emailOtpVerified === true && (
                      <div className="input_contanier">
                        <input
                          type="number"
                          id="EmailOtp"
                          name="EmailOtp"
                          className="inputsf"
                          placeholder="Enter OTP"
                          readOnly={emailOtpVerifiedNo === true}
                          onChange={(e) => {
                            if (e.target.value.length > 6) {
                              e.target.value = e.target.value.slice(0, 6);
                            }
                            setModalEmailOtpNo(e.target.value);
                          }}
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
                        {emailOtpVerifiedNo === false && (
                          <button
                            style={{
                              position: "absolute",
                              right: "4px",
                              top: "3.5px",
                              height: "36px",
                              border: "none",
                              borderRadius: "5px",
                              backgroundColor: "#3fd713",
                              width: "80px",
                            }}
                            type="button"
                            onClick={emailOtpVerify}
                            disabled={emailOtpVerifiedNo === true}
                          >
                            <span
                              style={{
                                fontSize: "10px",
                                color: "white",
                                fontWeight: "bold",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              Verify
                            </span>
                          </button>
                        )}
                        {emailOtpVerifiedNo === false && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              marginTop: "5px",
                            }}
                          >
                            {countdown > 0 && (
                              <div>
                                <label
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "red",
                                  }}
                                >
                                  Time Remaining {countdown}s{" "}
                                </label>
                              </div>
                            )}
                            <div>
                              {countdown === 0 ? (
                                <span
                                  className="link-like"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleOtpVerifiy("email");
                                  }}
                                >
                                  {" "}
                                  Resend OTP
                                </span>
                              ) : null}
                            </div>
                          </div>
                        )}
                        {emailOtpVerifiedNo === true &&
                          modalEmailOtpNo !== "" && (
                            <MdVerified
                              style={{ color: "green" }}
                              className="eye-icon_login"
                            />
                          )}
                      </div>
                    )}
                  </div>
                )}
                {mobileOtpModal && (
                  <div name="mobile_content">
                    <div
                      className="input_container"
                      style={{ marginBottom: "20px" }}
                    >
                      <label className="login_label">
                        {" "}
                        Mobile Number <span className="required">*</span>
                      </label>
                      <div>
                        <div className="phone_input_container">
                          <PhoneInput
                            countryCodeEditable={false}
                            country={getCountryCodeFromCallingCode(countryCode)}
                            onlyCountries={["us", "in"]}
                            style={{ width: "100%", height: "43px" }}
                            disabled={mobileOtpVerified === true}
                            onChange={handleChange}
                            placeholder="Mobile Number"
                          />

                          {mobileOtpVerified === false && (
                            <button
                              type="button"
                              style={{
                                position: "absolute",
                                right: "4px",
                                top: "3.5px",
                                height: "36px",
                                border: "none",
                                borderRadius: "5px",
                                backgroundColor: "#4071f4",
                                width: "80px",
                              }}
                              onClick={() => handleOtpVerifiy("mobile")}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "white",
                                  fontWeight: "bold",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                Request OTP
                              </span>
                            </button>
                          )}
                          {mobileOtpVerifiedNo === true && (
                            <MdVerified
                              style={{ color: "green" }}
                              className="phone_eye_icon"
                            />
                          )}
                        </div>
                        <div className="myprofile-error-field">
                          {formErrors.modalMobileNo && (
                            <div className="field_form_alert">
                              <span>{formErrors.modalMobileNo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {mobileOtpVerified === true && (
                      <div className="input_contanier">
                        <input
                          type="number"
                          id="MoblieOtp"
                          name="MoblieOtp"
                          className="inputsf"
                          placeholder="Enter OTP"
                          readOnly={mobileOtpVerifiedNo === true}
                          onChange={(e) => {
                            if (e.target.value.length > 6) {
                              e.target.value = e.target.value.slice(0, 6);
                            }
                            setModalMobileNo(e.target.value);
                          }}
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
                        {mobileOtpVerifiedNo === false && (
                          <button
                            style={{
                              position: "absolute",
                              right: "4px",
                              top: "3.5px",
                              height: "36px",
                              border: "none",
                              borderRadius: "5px",
                              backgroundColor: "#3fd713",
                              width: "80px",
                            }}
                            onClick={mobileOtpVerify}
                            disabled={mobileOtpVerifiedNo === true}
                          >
                            <span
                              style={{
                                fontSize: "10px",
                                color: "white",
                                fontWeight: "bold",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              Verify
                            </span>
                          </button>
                        )}
                        {mobileOtpVerifiedNo === false && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              marginTop: "5px",
                            }}
                          >
                            {countdown > 0 && (
                              <div>
                                <label
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "red",
                                  }}
                                >
                                  Time Remaining {countdown}s{" "}
                                </label>
                              </div>
                            )}
                            <div>
                              {countdown === 0 ? (
                                <span
                                  className="link-like"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleOtpVerifiy("mobile");
                                  }}
                                >
                                  {" "}
                                  Resend OTP
                                </span>
                              ) : null}
                            </div>
                          </div>
                        )}
                        {mobileOtpVerifiedNo === true &&
                          modalMobileOtpNo !== "" && (
                            <MdVerified
                              style={{ color: "green" }}
                              className="eye-icon_login"
                            />
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <Modal dialogClassName="modal-dialog modal-xl" centered show={offerModal}>
        <Modal.Header>
          <div className="modal_subhead">
            <span className="modal_head_txt">Terms for the Offer</span>
            <AiOutlineClose
              className="moda_closel_icon"
              onClick={handleConditions}
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "420px" }}>
            {nriFlag === true ? (
              <PDFViewer pdfUrl={nritermsofofferPdf} />
            ) : (
              <PDFViewer pdfUrl={ritermsofofferPdf} />
            )}
          </div>
          <div className="login_label temscheckbox_div">
            <input
              type="checkbox"
              checked={offerFlag}
              onClick={(e) => {
                e.stopPropagation();
                setOfferFlag(e.target.checked);
                setFormErrors((e) => {
                  return { ...e, offerFlag: "" };
                });
              }}
            />
            <label>
              I agree to the terms for the Offer{" "}
              <span className="required_star">*</span>
            </label>
          </div>
          {formErrors.offerFlag && (
            <div
              className="field_form_alert"
              style={{
                paddingTop: "2px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <span>{formErrors.offerFlag}</span>
            </div>
          )}
          <div
            className="col-12  login_btn_container cenAlig"
            style={{ marginTop: "10px" }}
          >
            <button
              id="modalsubmitoffer"
              className=" col-lg-3 btn btn-primary"
              type="button"
              onClick={() => offerConfirm()}
            >
              Submit
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <Alert
        msg={alertMsg}
        open={userAlert}
        type={alertType}
        onClose={alertClose}
        onConfirm={alertconfirm}
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
          onConfirm={() => handleRegister(false)}
        />
      )}
      {showYesorNoErrorAlert && (
        <Alert
          title={"Alert"}
          msg={alertYesorNoErrorMessage}
          open={true}
          type={"yesorno"}
          onClose={handleYesorNoError}
          onConfirm={handleNavigate}
        />
      )}
      <div>
        <Modal className="loader_modal" centered show={loading}>
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

export default Myprofilekyc;
