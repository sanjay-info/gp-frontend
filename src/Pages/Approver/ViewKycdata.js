import React, { useEffect, useState } from "react";
import { RiMailLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../components/AppProvider";
import Alert from "../components/Alert";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import "../Register.css";
import { useSidebar } from "../components/SidebarContext";
import decryptData from "../components/Decrypt";
import { useLocation } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { initializeLightGallery } from "../components/lightGalleryInitializer";

const ViewKycdata = () => {
  const [name, setName] = useState("");
  const [userType, setUsertype] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [dob, setDob] = useState("");
  const [panNo, setPanNo] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [userPanImg, setUserPanImg] = useState(null);
  const [userAadhaarImg, setUserAadhaarImg] = useState(null);
  const [webCamImgSrc, setWebCamImgSrc] = React.useState(null);
  const [customerId, setCustomerId] = useState("");
  //   -------- current Address---------
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine11, setAddressLine11] = useState("");
  const [city1, setCity1] = useState("");
  const [state1, setState1] = useState("");
  const [country1, setCountry1] = useState("");
  const [pincode1, setPincode1] = useState("");
  //   -------- Perment Address---------
  const [city2, setCity2] = useState("");
  const [state2, setState2] = useState("");
  const [country2, setCountry2] = useState("");
  const [pincode2, setPincode2] = useState("");
  // ----- Alerts And Model---
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { sideBarCollapse } = useSidebar();
  const { PostApi } = useAppContext();
  const [kycver, setKycver] = useState("");
  const navigate = useNavigate();
  // ------- pattern ------
  const [approveCheckFlag, setApproveCheckFlag] = useState("");
  const [remarks, setRemarks] = useState("");
  const [remarksflag, setRemarksFlag] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  const [verifiedFlag, setVerifiedFlag] = useState(false);

  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState("");

  const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
  const [alertYesorNoMessage, setAlertYesorNoMessage] = useState("");

  const [userPanImgShow, setUserPanImgShow] = useState(false);
  const [userAadhaarImgShow, setUserAadhaarImgShow] = useState(false);
  const [userProfileImgShow, setUserProfileImgShow] = useState(false);

  const [remarkList, setRemarkList] = useState([]);
  const [remarkModal, setRemarkModal] = useState(false);

  const [ociYesFlag, setOciYesFlag] = useState(false);

  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [ociCardNo, setOciCardNo] = useState("");

  const [passportPreviewImg, setPassportPreviewImg] = useState(null);
  const [userPassportShow, setUserPassportShow] = useState(false);

  const [ociCardPreviewImg, setOciCardPreviewImg] = useState(null);
  const [userOciCardShow, setUserOciCardShow] = useState(false);

  const [userCategory, setuserCategory] = useState("");

  const [guardianName, setguardianName] = useState("");
  const [guardianDob, setguardianDob] = useState("");
  const [guardianRelation, setguardianRelation] = useState("");
  const [guardianPan, setguardianPan] = useState("");
  const [guardianAadhaar, setguardianAadhaar] = useState("");

  const [guardianPanImg, setguardianPanImg] = useState("");
  const [guardianPanImgShow, setguardianPanImgShow] = useState(false);

  const [guardianAadhaarImg, setguardianAadhaarImg] = useState(null);
  const [guardianAadhaarImgPreview, setguardianAadhaarImgPreview] =
    useState("");
  const [guardianAadhaarImgShow, setguardianAadhaarImgShow] = useState(false);

  const [nriFlag, setNriFlag] = useState(false);
  const [rejectedFlag, setRejectedFlag] = useState(false);

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const location = useLocation();
  const id = location.state.id;

  const [userId] = useState(localStorage.getItem("user_id"));

  const handleApprovalCheckboxChange = (e) => {
    setApproveCheckFlag(e.target.checked);
    if (e.target.checked) {
      setRemarksFlag(false);
    }
  };

  const handleRemarksCheckboxChange = (e) => {
    setRemarksFlag(e.target.checked);
    if (e.target.checked) {
      setApproveCheckFlag(false);
    }
  };

  const handleYesorNo = () => {
    setShowYesorNoAlert(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/UserKycDetails");
  };

  const handleErrorCloseAlert = () => {
    setShowErrorAlert(false);
  };

  useEffect(() => {
    getMyprofileDetails();
  }, []);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const ApproveBond = (event) => {
    event.preventDefault();
    if (!approveCheckFlag && !remarksflag) {
      setShowErrorAlert(true);
      setAlertErrorMessage("Before Submit Please Choose a Checkbox.");
      return;
    }
    if (!approveCheckFlag && !remarks) {
      setShowErrorAlert(true);
      setAlertErrorMessage("Please Enter Remarks");
      return;
    }
    setShowYesorNoAlert(true);
    setAlertYesorNoMessage("Are you sure you want to submit ?");
  };

  const Approve = (event) => {
    const method = "POST";
    const data = {};
    const url =
      "/user/approveKyc?id=" +
      id +
      "&status=" +
      approveCheckFlag +
      "&remarks=" +
      remarks +
      "&loginId=" +
      userId;
    PostApi(method, url, data, headers)
      .then((response) => {
        setShowYesorNoAlert(false);
        setShowAlert(true);
        setAlertMessage(response.data.message);
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const getMyprofileDetails = async () => {
    const url = `/user/id?id=${id}`;
    const data = {};
    try {
      const response = await PostApi("POST", url, data, headers);
      console.log(response, "ViewKYC");
      if (response.data.kycStatus) {
        setRejectedFlag(true);
      }
      setCustomerId(response.data.data.customerId);
      setName(response.data.data.firstName);
      setUsertype(response.data.data.applicantStatus.applicantStatus);
      setEmail(response.data.data.emailId);
      setMobileNo(response.data.data.mobileNo);
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
      setDob(response.data.data.dateOfBirth);
      setPanNo(response.data.data.pan);
      setAadhaar(response.data.data.aadhaar);
      setAddressLine1(response.data.data.addressLine1);
      setAddressLine11(response.data.data.addressLine11);
      setCity1(response.data.data.city1);
      setCity2(response.data.data.city2);
      setCountry1(response.data.data.country1);
      setCountry2(response.data.data.country2);
      setPincode1(response.data.data.pincode1);
      setPincode2(response.data.data.pincode2);
      setState1(response.data.data.state1);
      setState2(response.data.data.state2);
      setKycver(response.data.data.kycVerified);

      if (
        response.data.data.userType.id === 2 ||
        response.data.data.userType.id === 3
      ) {
        setNriFlag(true);
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

      if (response.data.data.kycVerified === true) {
        setVerifiedFlag(true);
        setApproveCheckFlag(true);
        setRemarks("");
      } else {
        setVerifiedFlag(false);
        if (response.data.data.kycRemarks !== null) {
          setRemarksFlag(true);
          setRemarks(response.data.data.kycRemarks);
        } else {
          setRemarks("");
        }

        if (
          response.data.data.kycVerified === false &&
          response.data.data.userKycRemarks !== null
        ) {
          setRemarkList(response.data.data.userKycRemarks);
        } else {
          setRemarkList([]);
        }
      }

      localStorage.setItem("kycverifiedfkflag", response.data.data.kycVerified);

      const decryptedAadhaar = decryptData(
        response.data.data.aadhaar,
        response.data.data.key
      );
      setAadhaar(decryptedAadhaar);

      const decryptedPan = decryptData(
        response.data.data.pan,
        response.data.data.key
      );
      setPanNo(decryptedPan);

      // const aadhaarImageUrl = base64ToImageUrl(response.data.data.aadhaarImage);
      setUserAadhaarImg(response.data.data.aadhaarImage);

      if (response.data.data.panImage !== null) {
        // const panImageUrl = base64ToImageUrl(response.data.data.panImage);
        setUserPanImg(response.data.data.panImage);
      } else {
        setUserPanImg(null);
      }

      // const profileImageUrl = base64ToImageUrl(response.data.data.profileImage);
      setWebCamImgSrc(response.data.data.profileImage);

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
      if (response.data.data.guardianPanImage !== null) {
        // const guardianpanImageUrl = base64ToImageUrl(response.data.data.guardianPanImage);
        setguardianPanImg(response.data.data.guardianPanImage);
      } else {
        setguardianPanImg(null);
      }
      if (response.data.data.guardianAadhaarImage !== null) {
        // const guardianaadhaarImageUrl = base64ToImageUrl(response.data.data.guardianAadhaarImage);
        setguardianAadhaarImg(response.data.data.guardianAadhaarImage);
      } else {
        setguardianAadhaarImg(null);
      }
      setuserCategory(response.data.data.userCategory);
      setguardianName(response.data.data.guardianName);
      setguardianDob(response.data.data.guardianDob);
      // setguardianPan(response.data.data.guardianPan);
      setguardianRelation(response.data.data.guardianRelation);

      if (response.data.data.guardianAadhaar !== null) {
        const decryptedGuardianAadhaar = decryptData(
          response.data.data.guardianAadhaar,
          response.data.data.key
        );
        setguardianAadhaar(decryptedGuardianAadhaar);
      } else {
        setguardianAadhaar(null);
      }

      if (response.data.data.guardianPan !== null) {
        const decryptedGuardianPan = decryptData(
          response.data.data.guardianPan,
          response.data.data.key
        );
        setguardianPan(decryptedGuardianPan);
      } else {
        setguardianPan(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ------------ Byte image converter --------
  const base64ToImageUrl = (base64String) => {
    const binaryString = window.atob(base64String);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  };

  // ------------ Handle Save Submit --------
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
                  <text className="welcome_text">KYC Approval</text>
                </div>
                <div className="col-12 col-md-6 headercontainer">
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
              {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <text className="welcome_text">KYC Approval</text>
                                <div style={{ display: 'flex', gap: "15px" }}>
                                    <text className="customerid_head">Customer ID - <span style={{ color: "green" }}>{customerId}</span> </text>
                                    <text className="customerid_head">KYC Status - <span style={{ color: kycver === true ? "green" : "red" }}>
                                        {kycver === true ? "Success" : "Pending"}
                                    </span>
                                    </text>
                                </div>
                            </div> */}
              <form>
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
                        readOnly
                        disabled
                        id="name"
                        name="name"
                        className="input_box"
                        placeholder="First Name"
                        value={name}
                      />
                    </div>
                  </div>
                  {nriFlag === false && (
                    <div
                      className={
                        nriFlag ? "col-lg-4 col-md-12" : "col-lg-3 col-md-12"
                      }
                    >
                      <label className="login_label">
                        User Category<span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <div className="input_icons">
                          <FaRegUser />
                        </div>
                        <input
                          type="text"
                          readOnly
                          disabled
                          id="name"
                          name="name"
                          className="input_box"
                          placeholder="User Category"
                          value={userCategory}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={
                      nriFlag ? "col-lg-4 col-md-12" : "col-lg-3 col-md-12"
                    }
                  >
                    <label className="login_label">
                      Status of Applicant{" "}
                      <span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <div className="input_icons">
                        <FaRegUser />
                      </div>
                      <input
                        id="statusofapplicant"
                        type="text"
                        readOnly
                        disabled
                        name="name"
                        className="input_box"
                        placeholder="First Name"
                        value={userType}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      nriFlag ? "col-lg-4 col-md-12" : "col-lg-3 col-md-12"
                    }
                  >
                    <label className="login_label">
                      Email <span className="required_star">*</span>{" "}
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
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Mobile Number <span className="required_star">*</span>{" "}
                    </label>
                    <div className="phone_input_container">
                      <PhoneInput
                        countryCodeEditable={false}
                        value={countryCode + mobileNo}
                        onlyCountries={["us", "in"]}
                        style={{ width: "100%", height: "43px" }}
                        disabled
                        disableDropdown={true}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Date of Birth <span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <div className="input_icons">
                        <CiCalendarDate />
                      </div>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        readOnly
                        disabled
                        className="input_box"
                        value={dob}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      PAN Number{" "}
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
                        type="text"
                        id="pan"
                        name="pan"
                        className="input_box"
                        placeholder="PAN Number"
                        readOnly
                        disabled
                        value={panNo}
                        maxLength={10}
                      />
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
                        type="tel"
                        id="aadhaar"
                        name="aadhaar"
                        className="input_box"
                        placeholder="Aadhaar"
                        readOnly
                        disabled
                        maxLength={12}
                        value={aadhaar}
                      />
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
                          id="pan"
                          name="pan"
                          className="input_box"
                          readOnly
                          disabled
                          placeholder="Passport Number"
                          value={passportNo}
                        />
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
                          value={countryOfResidence}
                          readOnly
                          disabled
                        />
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
                          styles={customStyles}
                          placeholder="Select Nationality"
                          value={nationality}
                          isDisabled
                        />
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
                        placeholder="Address line 1"
                        readOnly
                        disabled
                        value={addressLine1}
                      />
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
                        Correspondence Address
                        <span className="required_star">*</span>
                      </label>
                    </div>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="addressLine11"
                        name="addressLine11"
                        className="inputsf"
                        placeholder="Address line 2"
                        value={addressLine11}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-12">
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
                        readOnly
                        disabled
                        value={city1}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      State<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="state1"
                        name="state1"
                        className="inputsf"
                        placeholder="State"
                        readOnly
                        disabled
                        value={state1}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      City<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="city2"
                        name="city2"
                        className="inputsf"
                        placeholder="City"
                        value={city2}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      State<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="state2"
                        name="state2"
                        className="inputsf"
                        placeholder="State"
                        value={state2}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Country<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="country1"
                        name="country1"
                        className="inputsf"
                        placeholder="Country"
                        readOnly
                        disabled
                        value={country1}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Postal Code<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="number"
                        id="pincode2"
                        name="pincode2"
                        className="inputsf"
                        placeholder="Postal Code"
                        readOnly
                        disabled
                        value={pincode1}
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Country<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="text"
                        id="country2"
                        name="country2"
                        className="inputsf"
                        placeholder="Country"
                        readOnly
                        disabled
                        value={country2}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12">
                    <label className="login_label">
                      Postal Code<span className="required_star">*</span>
                    </label>
                    <div className="input_contanier">
                      <input
                        type="number"
                        id="pincode2"
                        name="pincode2"
                        className="inputsf"
                        placeholder="Postal Code"
                        value={pincode2}
                        readOnly
                        disabled
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  {nriFlag === false && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Upload PAN <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
                        <div>
                          {/* {userPanImg &&
                                                        <img src={userPanImg} onClick={() => setUserPanImgShow(true)} alt='' className='img_preview' />
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
                      Profile Photo <span className="required_star">*</span>{" "}
                    </label>
                    <div className="input_contanier">
                      <div>
                        {/* {webCamImgSrc &&
                                                    <img style={{ height: "200px", width: '200px' }} alt='' onClick={() => setUserProfileImgShow(true)} src={webCamImgSrc} className='img_preview' />
                                                } */}
                        {webCamImgSrc &&
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
                      {userProfileImgShow && (
                        <Lightbox
                          mainSrc={webCamImgSrc}
                          onCloseRequest={() => setUserProfileImgShow(false)}
                          onImageLoad={() => {
                            window.dispatchEvent(new Event("resize"));
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {nriFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Are You OCI ? <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
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
                            disabled
                            checked={ociYesFlag === false}
                          />
                          <label>No</label>
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
                          type="text"
                          className="input_box"
                          placeholder="OCI Number"
                          value={ociCardNo}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                  )}

                  {ociYesFlag === true && (
                    <div className="col-lg-4 col-md-12">
                      <label className="login_label">
                        Upload OCI Card <span className="required_star">*</span>{" "}
                      </label>
                      <div className="input_contanier">
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
                {nriFlag === false && userCategory === "MINOR" && (
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
                          Guardian Name <span className="required_star">*</span>{" "}
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
                            readOnly
                            disabled
                          />
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
                          <input
                            type="date"
                            id="guardianName"
                            name="guardianName"
                            className="input_box"
                            placeholder="Enter Guardian Name"
                            maxLength={40}
                            value={guardianDob}
                            readOnly
                            disabled
                          />
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
                            readOnly
                            disabled
                          />
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
                            readOnly
                            disabled
                            maxLength={10}
                            value={guardianPan}
                          />
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
                            readOnly
                            disabled
                            value={guardianAadhaar}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12">
                        <label className="login_label">
                          Upload Guardian PAN{" "}
                          <span className="required_star">*</span>{" "}
                        </label>
                        <div className="input_contanier">
                          <div>
                            {/* {guardianPanImg &&
                                                            <img src={guardianPanImg} alt='' onClick={() => setguardianPanImgShow(true)} className='img_preview' />
                                                        } */}
                            {guardianPanImg &&
                              (guardianPanImg.startsWith(
                                "data:application/pdf"
                              ) || guardianPanImg.endsWith(".pdf") ? (
                                <div style={{ width: "100%", height: "100%" }}>
                                  <button
                                    class="preview-button"
                                    type="button"
                                    onClick={() =>
                                      initializeLightGallery(guardianPanImg)
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
                                  onClick={() => setguardianPanImgShow(true)}
                                  src={guardianPanImg}
                                  className="img_preview"
                                />
                              ))}
                            {guardianPanImgShow && (
                              <Lightbox
                                mainSrc={guardianPanImg}
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
                          <div>
                            {/* {guardianAadhaarImg &&
                                                            <img src={guardianAadhaarImg} alt='' className='img_preview' />
                                                        } */}
                            {guardianAadhaarImg &&
                              (guardianAadhaarImg.startsWith(
                                "data:application/pdf"
                              ) || guardianAadhaarImg.endsWith(".pdf") ? (
                                <div style={{ width: "100%", height: "100%" }}>
                                  <button
                                    class="preview-button"
                                    type="button"
                                    onClick={() =>
                                      initializeLightGallery(guardianAadhaarImg)
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
                                  src={guardianAadhaarImg}
                                  className="img_preview"
                                />
                              ))}
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
                <div className="approver_kyc_remark_div">
                  <div>
                    {!remarksflag && (
                      <div className="login_label payment_checkbox_div">
                        <input
                          type="checkbox"
                          id="agreeCheckbox"
                          checked={approveCheckFlag}
                          onChange={handleApprovalCheckboxChange}
                          disabled={
                            verifiedFlag === true || rejectedFlag
                          }
                        />
                        <label>
                          I confirm that the above KYC is verified by me
                          <span className="required_star">*</span>
                        </label>
                      </div>
                    )}

                    {!approveCheckFlag && (
                      <div
                        className="login_label payment_checkbox_div"
                        style={{ marginTop: "20px" }}
                      >
                        <input
                          type="checkbox"
                          id="remarks"
                          checked={remarksflag}
                          onChange={handleRemarksCheckboxChange}
                          disabled={
                            verifiedFlag === true || rejectedFlag
                          }
                        />
                        <label>
                          I find that some of the KYC details are not in
                          compliance.<span className="required_star">*</span>
                        </label>
                      </div>
                    )}
                  </div>
                  {verifiedFlag === false && remarkList.length !== 0 && (
                    <div>
                      <span
                        className="link-like"
                        onClick={() => setRemarkModal(true)}
                      >
                        KYC Clarification History
                      </span>
                    </div>
                  )}
                </div>
                {remarksflag && (
                  <div>
                    <div className="col-lg-4 col-md-12">
                      <div className="input_contanier">
                        <textarea
                          type="text"
                          id="remarks"
                          name="remarks"
                          className="inputtextarea"
                          rows={3}
                          placeholder="Please enter remarks"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          maxLength={100}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {verifiedFlag === false && (
                  <div
                    className="col-12  login_btn_container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className=" col-lg-3 register_btn"
                      disabled={rejectedFlag}
                      onClick={ApproveBond}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <Alert
          title={"Success"}
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
          onConfirm={Approve}
        />
      )}

      <Modal
        dialogClassName="modal-dialog modal-md"
        centered
        show={remarkModal}
      >
        <Modal.Header>
          <div className="modal_subhead">
            <span className="modal_head_txt">KYC Clarification History</span>
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
    </div>
  );
};

export default ViewKycdata;
