import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import "../Register.css";
import { useAppContext } from "../components/AppProvider";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { RiCloseCircleFill } from "react-icons/ri";
import DatePicker from "react-datepicker";
import Lightbox from "react-image-lightbox";
import PDFViewer from "../components/PDFViewer";
import { FaFileUpload } from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import { initializeLightGallery } from "../components/lightGalleryInitializer";

const ChckFinancepayment = (props) => {
  const { PostApi, GetApi } = useAppContext();
  const { sideBarCollapse } = useSidebar();
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentDate, setPaymentDate] = useState(null);
  const [price, setPrice] = useState("");
  const [paymentTypeId, setPaymentTypeId] = useState(null);
  const [investorType, setInvestorType] = useState("");
  const [firstApplicant, setFirstApplicant] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [panCard, setPanCard] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [status, setStatus] = useState("");
  const [nomineePan, setNomineePan] = useState("");
  const [noOfUnits, setNoOfUnits] = useState("");
  const [amountapplied, setAmountApplied] = useState("");
  const [clientBondDetails, setClientBondDetails] = useState("");
  const [formNo, setFormNo] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlertClose, setShowAlertClose] = useState(() => null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentNotVerified, setPaymentNotVerified] = useState(false);
  const [notVerifiedRemarks, setNotVerifiedRemarks] = useState("");
  const [remarkList, setRemarkList] = useState([]);
  const [remarkModal, setRemarkModal] = useState(false);
  const [userPaymentDate, setUserPaymentDate] = useState("");
  const [userPaymentMode, setUserPaymentMode] = useState("");
  const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
  const [alertYesorNoMessage, setAlertYesorNoMessage] = useState("");
  const [errorYesNoAlert, setErrorYesNoAlert] = useState(false);
  const [errorYesNoAlertMsg, setErrorYesNoAlertMsg] = useState("");
  const [approvedFlag, setApprovedFlag] = useState(false);
  const [firstSignImg, setReceiptImg] = useState(null);
  const [receiptImgPreview, setReceiptImgPreview] = useState(null);
  const [bondImg, setbondImg] = useState(null);
  const [bondImgPreview, setbondImgPreview] = useState(null);
  const [utrNo, setUtrNo] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [verifiedFlag, setVerifiedFlag] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [nriFlag, setNriFlag] = useState(false);
  const [relation, setRelation] = useState("");
  const [amountInFinance, setAmountInFinance] = useState();
  const [unitsToAllotted, setUnitsToAllotted] = useState(0);
  const [userType, setUserType] = useState("");

  const [paymentStatusFlag, setPaymentStatusFlag] = useState(false);

  const [userId] = useState(localStorage.getItem("user_id"));
  const [buttonLabel, setButtonLabel] = useState("Approve");

  const [accountNo, setAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountType, setAccountType] = useState("");

  const [currencyofremittance, setcurrencyofremittance] = useState("");
  const [countryofremittance, setcountryofremittance] = useState("");
  const [amountincurrency, setamountincurrency] = useState("");
  const [ibanCode, setibanCode] = useState("");
  const [remmitancethroughbank, setremmitancethroughbank] = useState("");

  const [chequeUploadImgPreview, setChequeUploadImgPreview] = useState(null);
  const [chequeUploadView, setChequeUploadView] = useState(false);

  const [swiftadviceImgPreview, setswiftadviceImgPreview] = useState(null);
  const [swiftUploadImageview, setSwiftUploadImageview] = useState(false);
  const [paymentDetailmapping, setPaymentDetailmapping] = useState([]);
  const [recepitModal, setRecepitModal] = useState(false);
  const [lastpayment, setLastPayment] = useState("");
  const [noOfPayApprovalPending, setNoOfPayApprovalPending] = useState("");
  const [noOfPaymentapprov, setNoOfPaymentapprov] = useState("");
  const [noOfReceiptPending, setNoOfReceiptPending] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const [paymentId, setPaymentId] = useState("");

  const [userAlert, setUserAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertConfirm, setAlertConfirm] = useState(() => null);
  const [alertClose, setAlertClose] = useState(() => null);
  // const [paymentStatus,setPaymentStatus] = useState("")
  const [rejectedFlag, setRejectedFlag] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;

  useEffect(() => {
    GetallPaymentType("");
  }, []);

  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const updatePaymentDetail = (index, key, value) => {
    setPaymentDetailmapping((prevState) => {
      const updatedArr = [...prevState];
      updatedArr[index][key] = value;
      return updatedArr;
    });
  };

  const handleYesorNo = () => {
    setShowYesorNoAlert(false);
  };

  useEffect(() => {
    ViewDocuments();
  }, []);

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleFileInputChange = (event) => {
    event.target.value = "";
  };

  const handlereceiptUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".pdf")) {
        const fileSizeInKB = file.size / 1024;
        // if (fileSizeInKB > 500) {
        // setFormErrors({ ...formErrors, receipImg: "File size should not exceed 500KB" })
        // fileInput.value = '';
        // setReceiptImg(null);
        // setReceiptImgPreview(null)
        // } else {
        setReceiptImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setReceiptImgPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setFormErrors({ ...formErrors, receipImg: "" });
        // }
      } else {
        fileInput.value = "";
        setFormErrors({
          ...formErrors,
          receipImg: "Invalid file format. Please upload a .pdf file.",
        });
        setReceiptImg(null);
        setReceiptImgPreview(null);
      }
    }
  };

  const ViewDocuments = () => {
    const method = "POST";
    const url = `/userbond/id?id=${id}`;
    const data = null;
    PostApi(method, url, data, headers)
      .then((response) => {
        console.log(response, "finance side");
        if (response.data.payStatus) {
          setRejectedFlag(true);
        }
        setFirstApplicant(response.data.data.name);
        setDob(response.data.data.dateOfBirth);
        setAddress(response.data.data.address);
        setOccupation(response.data.data.occupation);
        setPanCard(response.data.data.pan);
        setPassportNo(response.data.data.passportNo);
        setFatherName(response.data.data.fatherName);
        setStatus(response.data.data.status);
        setNomineePan(response.data.data.nomineePan);
        setInvestorType(response.data.data.investorType.investorType);
        setNoOfUnits(response.data.data.noOfUnits);
        setPrice(formatter.format(response.data.data.amount));
        setPaymentTypeId(response.data.data.paymentType.paymentType);
        setUtrNo(response.data.data.userTransactionNo);
        setRelation(response.data.data.relation);
        setUserType(response.data.data.userType);
        setAccountNo(response.data.data.accountNo);
        setBankName(response.data.data.bankName);
        setBranch(response.data.data.branchName);
        setIfsc(response.data.data.ifscCode);
        setcurrencyofremittance(response.data.data.currencyOfTransfer);
        setcountryofremittance(response.data.data.countryOfRemittance);
        setAccountType(response.data.data.accountType);
        setibanCode(response.data.data.ibanCode);
        setremmitancethroughbank(response.data.data.remittanceBank);
        setPaymentDetailmapping(response.data.data.paymentDetails);
        // const chequeUpload = base64ToImageUrl(response.data.data.cancelChequeImg);
        setNoOfPayApprovalPending(response.data.data.noOfPayApprovalPending);
        setNoOfPaymentapprov(response.data.data.approvedCount);
        setNoOfReceiptPending(response.data.data.noOfReceiptPending);
        setChequeUploadImgPreview(response.data.data.cancelChequeImg);
        setFormNo(response.data.data.formNo);
        setTotalAmount(response.data.data.totalAmountPaid);
        setLastPayment(response.data.data.lastPaymentDate);
        setClientBondDetails(response.data.data.userType);
        setAmountApplied(response.data.data.amount);
        if (response.data.data.userType === "NON-RESIDENT INDIAN") {
          setNriFlag(true);
        } else {
          setNriFlag(false);
        }
        // if (response.data.data.swiftImg !== null) {
        //     const swiftUpload = base64ToImageUrl(response.data.data.swiftImg);
        //     setswiftadviceImgPreview(swiftUpload);
        // }
        // else {
        //     setswiftadviceImgPreview(null);
        // }
        setAmountInFinance(response.data.data.financeAmount);
        setUnitsToAllotted(response.data.data.unitsAlloted);
        setUserPaymentMode(response.data.data.paymentDetails.modeOfPayment);
        setUserPaymentDate(
          moment(response.data.data.userPayDate).format("YYYY-MM-DD HH:mm:ss")
        );

        if (response.data.data.paymentVerified === true) {
          setVerifiedFlag(true);
          setApprovedFlag(true);
          setPaymentVerified(true);
          // if (response.data.data.paymentDate !== null) {
          //     setPaymentDate(moment(response.data.data.paymentDate).toDate())
          // }
          // else {
          //     setPaymentDate(null)
          // }

          if (response.data.data.utrNo !== null) {
            setPaymentRefNo(response.data.data.utrNo);
          } else {
            setPaymentRefNo("");
          }

          if (response.data.data.paymentReceipt !== null) {
            // const paymentReceipt = base64ToPdfUrl(response.data.data.paymentReceipt);
            setReceiptImgPreview(response.data.data.paymentReceipt);
            setReceiptImg(
              convertBase64ToFile(
                response.data.data.paymentReceipt,
                "receipt.pdf",
                "application/octet-stream"
              )
            );
          } else {
            setReceiptImgPreview(null);
            setReceiptImg(null);
          }

          if (response.data.data.bond !== null) {
            // const bondImg = base64ToPdfUrl(response.data.data.bond);
            setbondImgPreview(response.data.data.bond);
            setbondImg(
              convertBase64ToFile(
                response.data.data.bond,
                "bond.pdf",
                "application/octet-stream"
              )
            );
          } else {
            setbondImgPreview(null);
            setbondImg(null);
          }
        } else if (
          response.data.data.paymentVerified === false &&
          response.data.data.status === false &&
          response.data.data.paymentRemarks !== null
        ) {
          // if (response.data.data.paymentDate !== null) {
          //     setPaymentDate(moment(response.data.data.paymentDate).toDate())
          // }
          // else {
          //     setPaymentDate(null)
          // }

          if (response.data.data.utrNo !== null) {
            setPaymentRefNo(response.data.data.utrNo);
          } else {
            setPaymentRefNo("");
          }

          setPaymentNotVerified(false);
          setNotVerifiedRemarks("");

          setRemarkList(response.data.data.paymentRemarks);

          if (response.data.data.paymentReceipt !== null) {
            // const paymentReceipt = base64ToPdfUrl(response.data.data.paymentReceipt);
            setReceiptImgPreview(response.data.data.paymentReceipt);
            setReceiptImg(
              convertBase64ToFile(
                response.data.data.paymentReceipt,
                "receipt.pdf",
                "application/octet-stream"
              )
            );
          } else {
            setReceiptImgPreview(null);
            setReceiptImg(null);
          }

          if (response.data.data.bond !== null) {
            // const bondImg = base64ToPdfUrl(response.data.data.bond);
            setbondImgPreview(response.data.data.bond);
            setbondImg(
              convertBase64ToFile(
                response.data.data.bond,
                "bond.pdf",
                "application/octet-stream"
              )
            );
          } else {
            setbondImgPreview(null);
            setbondImg(null);
          }
        } else {
          setPaymentNotVerified(false);
          // if (response.data.data.paymentDate !== null) {
          //     setPaymentDate(moment(response.data.data.paymentDate).toDate())
          // }
          // else {
          //     setPaymentDate(null)
          // }

          if (response.data.data.utrNo !== null) {
            setPaymentRefNo(response.data.data.utrNo);
          } else {
            setPaymentRefNo("");
          }
          setVerifiedFlag(false);
          setApprovedFlag(false);
          setReceiptImgPreview(null);
          setbondImgPreview(null);
          if (response.data.data.paymentRemarks !== null) {
            setNotVerifiedRemarks(response.data.data.paymentRemarks);
          } else {
            setNotVerifiedRemarks("");
          }
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
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
  const base64ToPdfUrl = (base64String) => {
    const binaryString = window.atob(base64String);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  };

  const convertBase64ToFile = (base64String, filename, mimeType) => {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    const file = new File([blob], filename, { type: mimeType });
    return file;
  };

  const GetallPaymentType = () => {
    const method = "POST";
    const url = `/userbond/payment/types`;
    const data = {};
    GetApi(method, url, data, headers)
      .then((response) => {})
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const handleErrorCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const finalSubmit = () => {
    if (firstSignImg === null) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        receipImg: "Please upload the payment receipt",
      }));
      return;
    }

    ImageSubmit();
  };

  const ImageSubmit = () => {
    const method = "POST";
    const data = new FormData();
    var url =
      "/userbond/uploadReceipt?id=" +
      id +
      "&loginId=" +
      userId +
      "&paymentId=" +
      paymentId;

    data.append("receipt", firstSignImg);

    PostApi(method, url, data, headers)
      .then((response) => {
        setRecepitModal(false);
        setShowAlert(true);
        setAlertMessage(response.data.message);
        setShowAlertClose(() => () => {
          setRecepitModal(false);
          setShowAlert(false);
          setPaymentId("");
          setReceiptImgPreview(null);
          setReceiptImg(null);
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const paymentApprove = () => {
    const method = "POST";
    var url = "/userbond/updatePaymentVerify?id=" + id + "&loginId=" + userId;

    const invalidPayments = paymentDetailmapping
      .map((paymentDetail, index) => ({ paymentDetail, index }))
      .filter(({ paymentDetail }) => {
        const isFinanceAmountInvalid =
          paymentDetail.userBondDetails.userType === "NON-RESIDENT INDIAN" &&
          (paymentDetail.financeAmount === undefined ||
            paymentDetail.financeAmount <= 0);

        return (
          (paymentDetail.paymentVerified &&
            (!paymentDetail.utrNo ||
              !moment(paymentDetail.paymentDate).isValid() ||
              isFinanceAmountInvalid)) ||
          (!paymentDetail.paymentVerified && !paymentDetail.remarks)
        ); // Check for invalid financeAmount
      });

    if (invalidPayments.length > 0) {
      const errorMessages = invalidPayments.map(({ paymentDetail, index }) => {
        console.log(paymentDetail);
        let message;
        if (!paymentDetail.paymentVerified) {
          message = `Please enter the remarks.`;
        } else if (
          !paymentDetail.utrNo &&
          !moment(paymentDetail.paymentDate).isValid()
        ) {
          message = `Transaction ID and Bank Credit Date is required for Payment ${
            index + 1
          } .`;
        } else if (!paymentDetail.utrNo) {
          message = `Transaction ID is required for Payment ${index + 1}.`;
        } else {
          message = `Bank Credit Date is required for  Payment ${index + 1}.`;
        }
        // Add specific message for invalid financeAmount
        if (
          paymentDetail.userBondDetails.userType === "NON-RESIDENT INDIAN" &&
          (paymentDetail.financeAmount === undefined ||
            paymentDetail.financeAmount <= 0)
        ) {
          message = `Payment ${
            index + 1
          }: Amount in INR should be greater than 0.`;
        }

        return message;
      });
      setAlertTitle("Alert");
      setAlertType("error");
      setAlertMsg(errorMessages.join("\n"));
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setUserAlert(true);

      return;
    }

    const data = paymentDetailmapping.map((paymentDetail, index) => ({
      id: paymentDetail.id,
      utrNo: paymentDetail.utrNo,
      paymentDate: moment(paymentDetail.paymentDate).isValid()
        ? moment(paymentDetail.paymentDate).format("YYYY-MM-DDTHH:mm:ss")
        : "",
      paymentVerified: paymentDetail.paymentVerified,
      remarks: paymentDetail.paymentVerified ? "" : paymentDetail.remarks,
      ...(paymentDetail.userBondDetails.userType === "NON-RESIDENT INDIAN" && {
        financeAmount: parseFloat(paymentDetail.financeAmount),
      }),
    }));

    PostApi(method, url, data, headers)
      .then((response) => {
        setShowAlert(true);
        setAlertMessage(response.data.message);
        setShowAlertClose(() => () => {
          setShowAlert(false);
          setActiveTab(2);
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
  };

  const submitpayment = () => {
    if (lastpayment === "" || lastpayment === null) {
      setAlertTitle("Alert");
      setAlertType("error");
      setAlertMsg("Please Select the Last Payment Date");
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setUserAlert(true);

      return;
    }
    if (!paymentVerified) {
      setAlertTitle("Alert");
      setAlertType("error");
      setAlertMsg("Please select the checkbox before payment verify");
      setAlertClose(() => () => {
        setUserAlert(false);
      });
      setUserAlert(true);
      return;
    }
    const method = "POST";
    var url =
      "/userbond/saveFinalPayment?id=" +
      id +
      "&paymentDate=" +
      lastpayment +
      "&status=" +
      paymentVerified +
      "&loginId=" +
      userId;
    const data = {};
    PostApi(method, url, data, headers)
      .then((response) => {
        if (response.data.status === 200) {
          setShowAlert(true);
          setAlertMessage(response.data.message);
          setShowAlertClose(() => () => {
            setShowAlert(false);
            navigate("/PaymentApprove");
          });
        } else if (response.data.status === 400) {
          setAlertType("error");
          setAlertMsg(response.data.message);
          setAlertClose(() => () => {
            setUserAlert(false);
          });
          setUserAlert(true);
        }
      })
      .catch((error) => {
        console.log("Error searching user:", error);
      });
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
          <div>
            <div className="Summary_card">
              <div className="salesforce-tabs">
                <button
                  className={activeTab === 1 ? "active" : ""}
                  onClick={() => handleTabChange(1)}
                >
                  <span>Applicant</span>
                </button>
                <button
                  style={{ marginLeft: "3px" }}
                  className={activeTab === 2 ? "active" : ""}
                  onClick={() => handleTabChange(2)}
                >
                  <span>Approval</span>
                </button>
              </div>
              {activeTab === 1 && (
                <div>
                  <div>
                    <div className="finance_card_head">
                      <div className="finance-color">
                        <span>Investment summary</span>
                      </div>
                      <div className="finance_card_sub">
                        <span>
                          Form No - <span className="span_view">{formNo}</span>{" "}
                        </span>
                        <span>
                          Inverstor Type -{" "}
                          <span className="span_view">{investorType}</span>{" "}
                        </span>
                        <span>
                          Investment Type -{" "}
                          <span className="span_view">{clientBondDetails}</span>{" "}
                        </span>
                      </div>
                    </div>
                    {/* INDIVIDUAL order Summary */}
                    {investorType === "INDIVIDUAL" && (
                      <div className="row">
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              NAME OF FIRST APPLICANT :{" "}
                            </label>
                            <input
                              type="text"
                              placeholder="Enter NAME OF FIRST APPLICANT"
                              className="inputbond"
                              value={firstApplicant}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              DATE OF BIRTH :{" "}
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={dob}
                              className="inputbond"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">ADDRESS : </label>
                            <input
                              type="text"
                              placeholder="Enter Address"
                              className="inputbond"
                              value={address}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">OCCUPATION :</label>
                            <input
                              type="text"
                              placeholder="Enter Occupation"
                              className="inputbond"
                              value={occupation}
                              readOnly
                            />
                          </div>
                        </div>
                        {userType === "RESIDENT INDIAN" && (
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">PAN NUMBER :</label>
                              <input
                                type="text"
                                placeholder="Enter Pan Number"
                                className="inputbond"
                                maxLength={10}
                                value={panCard || ""}
                                readOnly
                              />
                            </div>
                          </div>
                        )}

                        {userType === "NON-RESIDENT INDIAN" && (
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                PASSPORT NO :
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Pan Number"
                                className="inputbond"
                                maxLength={10}
                                value={passportNo}
                                readOnly
                              />
                            </div>
                          </div>
                        )}
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              {relation}'S NAME :
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Spouse's / Father's Name"
                              className="inputbond"
                              value={fatherName}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              MARITAL STATUS :
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Status"
                              className="inputbond"
                              value={status}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              NO OF UNITS APPLIED FOR :
                            </label>
                            <input
                              type="text"
                              placeholder="Lots"
                              className="inputbond"
                              value={noOfUnits}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              AMOUNT APPLIED :
                            </label>
                            <input
                              type="text"
                              placeholder="Lots"
                              className="inputbond"
                              value={`₹ ${
                                amountapplied
                                  ? amountapplied.toLocaleString("en-IN")
                                  : "0"
                              }`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* joint order Summary */}
                    {investorType === "JOINT" && (
                      <div className="row">
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              NAME OF SOLE/FIRST APPLICANT :{" "}
                            </label>
                            <input
                              type="text"
                              placeholder="Enter NAME OF FIRST APPLICANT"
                              className="inputbond"
                              value={firstApplicant}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              DATE OF BIRTH :{" "}
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Age"
                              className="inputbond"
                              maxLength={3}
                              value={dob}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">ADDRESS : </label>
                            <input
                              type="text"
                              placeholder="Enter Address"
                              className="inputbond"
                              value={address}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">OCCUPATION :</label>
                            <input
                              type="text"
                              placeholder="Enter Occupation"
                              className="inputbond"
                              value={occupation}
                              readOnly
                            />
                          </div>
                        </div>
                        {userType === "RESIDENT INDIAN" && (
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">PAN NUMBER :</label>
                              <input
                                type="text"
                                placeholder="Enter Pan Number"
                                className="inputbond"
                                maxLength={10}
                                value={panCard || ""}
                                readOnly
                              />
                            </div>
                          </div>
                        )}

                        {userType === "NON-RESIDENT INDIAN" && (
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                PASSPORT NO :
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Pan Number"
                                className="inputbond"
                                maxLength={10}
                                value={passportNo}
                                readOnly
                              />
                            </div>
                          </div>
                        )}
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              {relation}'S NAME :
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Spouse's / Father's Name"
                              className="inputbond"
                              value={fatherName}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              MARITAL STATUS :
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Status"
                              className="inputbond"
                              value={status}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              NO OF UNITS APPLIED FOR :
                            </label>
                            <input
                              type="text"
                              placeholder="Lots"
                              className="inputbond"
                              value={noOfUnits}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">
                              AMOUNT APPLIED :
                            </label>
                            <input
                              type="text"
                              placeholder="Lots"
                              className="inputbond"
                              value={`₹${amountapplied}`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row">
                      <div
                        className="finance-color"
                        style={{
                          paddingLeft: "20px",
                          paddingTop: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <span>Bank Account details for Crediting Dividend</span>
                      </div>
                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            ACCOUNT NUMBER :{" "}
                          </label>
                          <input
                            type="text"
                            placeholder="Lots"
                            className="inputbond"
                            value={accountNo}
                            readOnly
                          />
                        </div>
                      </div>
                      {userType === "NON-RESIDENT INDIAN" && (
                        <>
                          {currencyofremittance === "USD" && (
                            <div className="col-lg-4 col-12">
                              <div className="responsive-column">
                                <label className="bond_label">
                                  ACCOUNT TYPE :{" "}
                                </label>
                                <input
                                  type="text"
                                  placeholder="Lots"
                                  className="inputbond"
                                  value={accountType}
                                  readOnly
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">BANK NAME :</label>
                          <input
                            type="text"
                            placeholder="Lots"
                            className="inputbond"
                            value={bankName}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">BRANCH NAME :</label>
                          <input
                            type="text"
                            placeholder="Lots"
                            className="inputbond"
                            value={branch}
                            readOnly
                          />
                        </div>
                      </div>
                      {userType === "RESIDENT INDIAN" && (
                        <div className="col-lg-4 col-12">
                          <div className="responsive-column">
                            <label className="bond_label">IFSC CODE :</label>
                            <input
                              type="text"
                              placeholder="Lots"
                              className="inputbond"
                              value={ifsc}
                              readOnly
                            />
                          </div>
                        </div>
                      )}
                      {userType === "NON-RESIDENT INDIAN" && (
                        <>
                          {currencyofremittance === "USD" && (
                            <>
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    SWIFT / IBAN CODE:{" "}
                                  </label>
                                  <input
                                    type="text"
                                    className="inputbond"
                                    value={ibanCode}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    REMITTANCE THROUGH BANK:{" "}
                                  </label>
                                  <input
                                    type="text"
                                    className="inputbond"
                                    value={remmitancethroughbank}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {currencyofremittance === "INR" && (
                            <div className="col-lg-4 col-12">
                              <div className="responsive-column">
                                <label className="bond_label">
                                  IFSC CODE:{" "}
                                </label>
                                <input
                                  type="text"
                                  placeholder="Lots"
                                  className="inputbond"
                                  value={ifsc}
                                  readOnly
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="col-lg-4 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            CANCELLED CHEQUE LEAF / BANK STATEMENT / PASSBOOK
                            FRONT PAGE :{" "}
                          </label>
                          {/* {chequeUploadImgPreview && (
                                                        <div>
                                                            <img src={chequeUploadImgPreview} onClick={() => setChequeUploadView(true)} alt="Selected" className='bondimgPreview' />
                                                        </div>
                                                    )} */}
                          {chequeUploadImgPreview &&
                            (chequeUploadImgPreview.startsWith(
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
                                onClick={() => setChequeUploadView(true)}
                                src={chequeUploadImgPreview}
                                className="img_preview"
                              />
                            ))}
                          {chequeUploadView && (
                            <Lightbox
                              mainSrc={chequeUploadImgPreview}
                              onCloseRequest={() => setChequeUploadView(false)}
                              onImageLoad={() => {
                                window.dispatchEvent(new Event("resize"));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="finance-color"
                        style={{
                          paddingLeft: "20px",
                          paddingTop: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <span>Payment Confirmation</span>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            {" "}
                            No of Approved Payment:{" "}
                          </label>
                          <input
                            id="noofapprovalrequired"
                            placeholder="Enter No of Approvals Required"
                            type="text"
                            readOnly
                            disabled
                            value={noOfPaymentapprov}
                            className="inputbond"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            {" "}
                            No of Approvals Required :{" "}
                          </label>
                          <input
                            id="noofapprovalrequired"
                            placeholder="Enter No of Approvals Required"
                            type="text"
                            readOnly
                            disabled
                            value={noOfPayApprovalPending}
                            className="inputbond"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            {" "}
                            No of Pending Receipts :{" "}
                          </label>
                          <input
                            id="noofpendingreceipts"
                            placeholder="Enter No of Pending Receipts"
                            type="text"
                            readOnly
                            disabled
                            value={noOfReceiptPending}
                            className="inputbond"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="responsive-column">
                          <label className="bond_label"> Total Amount : </label>
                          <input
                            id="totalamount"
                            placeholder="Total Amount"
                            type="text"
                            className="inputbond"
                            readOnly
                            // value={` ₹ ${totalAmount.toLocaleString('en-IN')}`}
                            value={`₹ ${
                              totalAmount
                                ? totalAmount.toLocaleString("en-IN")
                                : "0"
                            }`}

                            // value={totalAmount}
                            // value={price}
                          />
                        </div>
                      </div>
                      {userType === "NON-RESIDENT INDIAN" && (
                        <>
                          <div className="col-lg-6 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                {" "}
                                Country of Remittance :{" "}
                              </label>
                              <input
                                id="countryofremittance"
                                placeholder="Enter Country of Remittance"
                                type="text"
                                disabled
                                className="inputbond"
                                value={currencyofremittance || ""}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                {" "}
                                Currency of Remittance :{" "}
                              </label>
                              <input
                                id="currencyofremittance"
                                type="text"
                                disabled
                                placeholder="Enter Country of Remittance"
                                className="inputbond"
                                value={currencyofremittance || ""}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-lg-6 col-12">
                        <div className="responsive-column">
                          <label className="bond_label">
                            {" "}
                            Last Payment Date :{" "}
                            <span className="required">*</span>
                          </label>
                          {/* <input
                                                        id="lastpaymnetdate"
                                                        type="date"
                                                        className='inputbond'
                                                        disabled={verifiedFlag === true}
                                                        value={lastpayment}
                                                        min="2024-01-01"
                                                        max={new Date().toISOString().split('T')[0]}
                                                        onKeyDown={(e) => e.preventDefault()}
                                                        onChange={(e) => {
                                                            setLastPayment(e.target.value)
                                                        }}
                                                    /> */}
                          <DatePicker
                            showIcon
                            showYearDropdown
                            scrollableYearDropdown
                            selected={
                              lastpayment ? new Date(lastpayment) : null
                            }
                            onChange={(date) =>
                              setLastPayment(moment(date).format("YYYY-MM-DD"))
                            }
                            className="inputbond"
                            placeholderText="dd-mm-yyyy"
                            dateFormat="dd-MM-yyyy"
                            minDate={
                              new Date(process.env.REACT_APP_PAYMENT_DATE)
                            }
                            maxDate={new Date()}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                            readOnly={verifiedFlag === true || rejectedFlag}
                            shouldCloseOnSelect={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      {verifiedFlag === false && remarkList.length !== 0 && (
                        <div>
                          <span
                            className="link-like"
                            onClick={(e) => {
                              e.preventDefault();
                              setRemarkModal(true);
                            }}
                          >
                            Remarks History of the Transaction
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                      <div className="payment_checkbox_div">
                        <input
                          type="checkbox"
                          disabled={verifiedFlag === true || rejectedFlag}
                          checked={paymentVerified}
                          id="applicantstatus"
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setPaymentVerified(isChecked);
                            console.log(isChecked);
                          }}
                        />
                        <label>
                          I confirm that the above details are verified by me.{" "}
                          <span style={{ color: "red" }}>*</span>{" "}
                          <span style={{ color: "blue", cursor: "pointer" }}>
                            {" "}
                          </span>
                        </label>
                      </div>
                      {/* } */}
                    </div>

                    {verifiedFlag === false && (
                      <div
                        className="col-12 col-lg-12 login_btn_container"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div className="col-4 col-lg-4">
                          <button
                            type="button"
                            className="approve_btn"
                            onClick={() => submitpayment()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  {paymentDetailmapping.map((payment, index) => (
                    <React.Fragment key={index}>
                      <>
                        <div className="row">
                          <div
                            className="finance-color"
                            style={{
                              paddingLeft: "20px",
                              paddingTop: "10px",
                              marginBottom: "10px",
                              bottomBorder: "20px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <span>Payment {index + 1}</span>
                            </div>
                            {payment.status === true && (
                              <div
                                onClick={() => {
                                  setRecepitModal(true);
                                  setPaymentId(payment.id);
                                  setReceiptImgPreview(
                                    payment.receipt ? payment.receipt : null
                                  );
                                  console.log(payment, "lkklk");
                                }}
                              >
                                <FaFileUpload size={15}></FaFileUpload>
                                <span style={{ fontSize: "15px" }}>
                                  Upload Receipt
                                </span>
                              </div>
                            )}
                          </div>
                          {userType === "NON-RESIDENT INDIAN" && (
                            <>
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    {" "}
                                    AMOUNT :{" "}
                                  </label>
                                  <input
                                    id="amountincurrency"
                                    className="inputbond"
                                    readOnly
                                    value={payment.amount || ""}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                {" "}
                                PAYMENT DATE :{" "}
                              </label>
                              <input
                                id="accountInfoDate"
                                type="datetime-local"
                                className="inputbond"
                                readOnly
                                value={payment.userPaymentDate || ""}
                              />
                            </div>
                          </div>
                          {userType === "RESIDENT INDIAN" && (
                            <div className="col-lg-4 col-12">
                              <div className="responsive-column">
                                <label className="bond_label">
                                  MODE OF PAYMENT :
                                </label>
                                <input
                                  id="Modeofpayment"
                                  type="text"
                                  className="inputbond"
                                  readOnly
                                  value={payment.modeOfPayment || ""}
                                />
                              </div>
                            </div>
                          )}
                          {userType === "NON-RESIDENT INDIAN" && (
                            <>
                              {currencyofremittance === "USD" && (
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      SWIFT CODE OF REMITTING BANK :
                                    </label>
                                    <input
                                      id="Modeofpayment"
                                      type="text"
                                      className="inputbond"
                                      readOnly
                                      value={payment.modeOfPayment || ""}
                                    />
                                  </div>
                                </div>
                              )}
                              {currencyofremittance === "INR" && (
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      MODE OF PAYMENT :
                                    </label>
                                    <input
                                      id="Modeofpayment"
                                      type="text"
                                      className="inputbond"
                                      readOnly
                                      value={payment.modeOfPayment || ""}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          {userType === "RESIDENT INDIAN" && (
                            <div className="col-lg-4 col-12">
                              <div className="responsive-column">
                                <label className="bond_label">
                                  UTR NUMBER / CHEQUE NUMBER :
                                </label>
                                <input
                                  type="text"
                                  className="inputbond"
                                  value={payment.userTransactionNo || ""}
                                  readOnly
                                />
                              </div>
                            </div>
                          )}
                          {userType === "NON-RESIDENT INDIAN" && (
                            <>
                              {currencyofremittance === "USD" && (
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      SWIFT NUMBER :
                                    </label>
                                    <input
                                      type="text"
                                      className="inputbond"
                                      value={payment.userTransactionNo || ""}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              )}
                              {currencyofremittance === "INR" && (
                                <div className="col-lg-4 col-12">
                                  <div className="responsive-column">
                                    <label className="bond_label">
                                      UTR NUMBER / CHEQUE NUMBER :
                                    </label>
                                    <input
                                      type="text"
                                      className="inputbond"
                                      value={payment.userTransactionNo || ""}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                {" "}
                                PAYMENT MODE :{" "}
                              </label>
                              <input
                                id="accountInfoDate"
                                type="text"
                                className="inputbond"
                                readOnly
                                value={
                                  payment.userBondDetails.paymentType
                                    .paymentType || ""
                                }
                              />
                            </div>
                          </div>
                          {userType === "NON-RESIDENT INDIAN" && (
                            <>
                              {currencyofremittance === "USD" && (
                                <div className="col-lg-4 col-12">
                                  {payment.swiftImg && (
                                    <div className="responsive-column">
                                      <label className="bond_label">
                                        SWIFT ADVICE :{" "}
                                      </label>
                                      <div className="preview_card_img">
                                        {/* <img src={payment.swiftImg} onClick={() => setSwiftUploadImageview(true)} alt="Selected" className='bondimgPreview' /> */}
                                        {payment.swiftImg &&
                                          (payment.swiftImg.startsWith(
                                            "data:application/pdf"
                                          ) ||
                                          payment.swiftImg.endsWith(".pdf") ? (
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
                                                    payment.swiftImg
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
                                                setSwiftUploadImageview(true)
                                              }
                                              src={payment.swiftImg}
                                              className="img_preview"
                                            />
                                          ))}
                                      </div>
                                      {swiftUploadImageview && (
                                        <Lightbox
                                          mainSrc={payment.swiftImg}
                                          onCloseRequest={() =>
                                            setSwiftUploadImageview(false)
                                          }
                                          onImageLoad={() => {
                                            window.dispatchEvent(
                                              new Event("resize")
                                            );
                                          }}
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                          {userType === "RESIDENT INDIAN" && (
                            <>
                              <div className="col-lg-4 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">AMOUNT :</label>
                                  <input
                                    type="text"
                                    placeholder="Lots"
                                    className="inputbond"
                                    value={payment.amount || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="row">
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                BANK CREDIT DATE :{" "}
                                <span className="required">*</span>
                              </label>
                              <DatePicker
                                showYearDropdown
                                scrollableYearDropdown
                                showIcon
                                selected={
                                  payment.paymentDate
                                    ? new Date(payment.paymentDate)
                                    : null
                                }
                                onChange={(date) =>
                                  updatePaymentDetail(
                                    index,
                                    "paymentDate",
                                    date
                                  )
                                }
                                className="inputbond"
                                showTimeSelect
                                timeFormat="hh:mm aa"
                                timeIntervals={5}
                                placeholderText="dd-mm-yyyy hh:mm"
                                dateFormat="dd-MM-yyyy hh:mm aa"
                                minDate={new Date(payment.userPaymentDate)}
                                maxDate={new Date()}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                                readOnly={payment.paymentVerified || rejectedFlag}
                                shouldCloseOnSelect={true}
                              />
                              {/* <input
                                                                id="accountInfoDate"
                                                                type="datetime-local"
                                                                className={`inputbond`}
                                                                value={payment.paymentDate || ""}
                                                                // min={process.env.REACT_APP_PAYMENT_DATE}
                                                                min={payment.userPaymentDate || moment().format('YYYY-MM-DDTHH:mm')}
                                                                max={moment().format('YYYY-MM-DDTHH:mm')}
                                                                readOnly={verifiedFlag === true || payment.paymentVerified}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const formattedDate = value ? moment(value).format('YYYY-MM-DDTHH:mm:ss') : '';
                                                                    updatePaymentDetail(index, 'paymentDate', formattedDate);
                                                                }}
                                                            /> */}
                            </div>
                          </div>
                          <div className="col-lg-4 col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                TRANSACTION ID :
                                <span className="required">*</span>
                              </label>
                              <input
                                id="transactionId"
                                type="text"
                                maxLength={50}
                                placeholder="Enter Transaction ID"
                                className="inputbond"
                                value={payment.utrNo}
                                readOnly={payment.paymentVerified || rejectedFlag}
                                onChange={(e) => {
                                  const newValue = e.target.value.replace(
                                    /[^a-zA-Z0-9]/g,
                                    ""
                                  );
                                  updatePaymentDetail(index, "utrNo", newValue);
                                }}
                              />
                            </div>
                          </div>
                          {nriFlag === true && (
                            <div className="col-lg-4 col-12">
                              <div className="responsive-column">
                                <label className="bond_label">
                                  AMOUNT IN INR:
                                  <span className="required">*</span>
                                </label>
                                <input
                                  id="transactionId"
                                  type="tel"
                                  placeholder="Enter Amount"
                                  className="inputbond"
                                  value={payment.financeAmount}
                                  maxLength={9}
                                  readOnly={
                                    verifiedFlag === true || rejectedFlag
                                  }
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const value = parseInt(inputValue, 10);
                                    if (
                                      isNaN(value) ||
                                      inputValue.trim() === ""
                                    ) {
                                      updatePaymentDetail(
                                        index,
                                        "financeAmount",
                                        0
                                      );
                                      updatePaymentDetail(
                                        index,
                                        "unitsAlloted",
                                        0
                                      );
                                    } else {
                                      updatePaymentDetail(
                                        index,
                                        "financeAmount",
                                        parseInt(value)
                                      );
                                      updatePaymentDetail(
                                        index,
                                        "unitsAlloted",
                                        Math.floor(value / 10)
                                      );
                                    }
                                  }}
                                  onKeyPress={(e) => {
                                    const charCode = e.charCode || e.keyCode;
                                    if (charCode < 48 || charCode > 57) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {/* {nriFlag === true &&
                                                        <div className='col-lg-4 col-12'>
                                                            <div className='responsive-column'>
                                                                <label className='bond_label'>EQUIVALENT UNIT TO BE ALLOTTED :<span className="required">*</span></label>
                                                                <input
                                                                    id="transactionId"
                                                                    type="text"
                                                                    placeholder="Enter Eqivalent Unit to be Allotted"
                                                                    className='inputbond'
                                                                    value={payment.unitsAlloted}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    } */}
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <div className="responsive-column">
                              <label className="bond_label">
                                Payment Confirmation :{" "}
                                <span className="required">*</span>
                              </label>
                            </div>
                          </div>
                          {payment.status === false ? (
                            <>
                              <div className="col-lg-6 col-12">
                                <div className="login_label checkbox_div">
                                  <input
                                    type="checkbox"
                                    id="paymentverified"
                                    disabled={
                                      payment.status === true ||
                                      rejectedFlag
                                    }
                                    checked={payment.paymentVerified === true}
                                    onChange={(e) =>
                                      updatePaymentDetail(
                                        index,
                                        "paymentVerified",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <label className="checkboxlabel">
                                    I confirm that the payment is verified.
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-6 col-12">
                                <div className="login_label checkbox_div">
                                  <input
                                    type="checkbox"
                                    id="paymnetclarification"
                                    disabled={
                                      payment.status === true ||
                                      rejectedFlag
                                    }
                                    checked={payment.paymentVerified === false}
                                    onChange={(e) =>
                                      updatePaymentDetail(
                                        index,
                                        "paymentVerified",
                                        !e.target.checked
                                      )
                                    }
                                  />
                                  <label className="checkboxlabel">
                                    I need more clarification to Approve.
                                  </label>
                                </div>
                              </div>
                            </>
                          ) : null}

                          {payment.status === true ? (
                            <div className="col-12">
                              <span
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  color: "green",
                                  marginTop: "15px",
                                  paddingLeft: "10px",
                                }}
                              >
                                Payment Verified
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {payment.paymentVerified === false && (
                          <div className="row">
                            {payment.paymentRemarks &&
                            payment.paymentRemarks.length > 0 &&
                            payment.paymentRemarks[
                              payment.paymentRemarks.length - 1
                            ].remarks ? (
                              <div className="col-lg-6 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    Previous Remarks:
                                  </label>
                                  <input
                                    id="remarkspayment"
                                    type="text"
                                    className="inputbond"
                                    value={
                                      payment.paymentRemarks[
                                        payment.paymentRemarks.length - 1
                                      ].remarks
                                    }
                                    disabled
                                    readOnly
                                  />
                                </div>
                              </div>
                            ) : null}
                            {payment.paymentRemarks === null && (
                              <div className="col-lg-6 col-12">
                                <div className="responsive-column">
                                  <label className="bond_label">
                                    {" "}
                                    Remarks :{" "}
                                  </label>
                                  <input
                                    id="remarkspayment"
                                    type="text"
                                    className="inputbond"
                                    maxLength={100}
                                    onChange={(e) =>
                                      updatePaymentDetail(
                                        index,
                                        "remarks",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </React.Fragment>
                  ))}
                  <div
                    className="col-12 col-lg-12 login_btn_container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      {noOfPayApprovalPending > 0 && (
                        <div>
                          {console.log(verifiedFlag)}
                          <button
                            className="approve_btn"
                            onClick={() => paymentApprove()}
                            disabled={rejectedFlag}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Modal
          dialogClassName="modal-dialog modal-md"
          centered
          show={recepitModal}
        >
          <Modal.Header>
            <div className="modal_subhead">
              <span className="modal_head_txt">Upload Receipt</span>
              <AiOutlineClose
                className="moda_closel_icon"
                onClick={() => {
                  setRecepitModal(false);
                  setPaymentId("");
                  setReceiptImgPreview(null);
                  setReceiptImg(null);
                  setFormErrors({});
                }}
              />
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="modal_body_container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="responsive-column">
                    <label className="bond_label">
                      PAYMENT RECEIPT <span className="required">*</span>
                    </label>
                    <input
                      style={{ marginTop: "5px" }}
                      id="receiptImg"
                      name="receiptImg"
                      type="file"
                      accept=".pdf"
                      onChange={handlereceiptUpload}
                      onClick={handleFileInputChange}
                      className="inputbond"
                    />
                    {formErrors.receipImg && (
                      <div className="field_form_alert">
                        <span>{formErrors.receipImg}</span>
                      </div>
                    )}
                    {receiptImgPreview && (
                      <div className="preview_card">
                        <RiCloseCircleFill
                          style={{ size: "25px" }}
                          onClick={() => {
                            setReceiptImg(null);
                            setReceiptImgPreview(null);
                            const receiptImgElement =
                              document.getElementById("receiptImg");
                            if (receiptImgElement.value !== "") {
                              receiptImgElement.value = "";
                            }
                          }}
                        />
                        <div style={{ width: "100%", height: "400px" }}>
                          <PDFViewer pdfUrl={receiptImgPreview} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-lg-12 login_btn_container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => finalSubmit()}
                  >
                    Upload Pdf
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          dialogClassName="modal-dialog modal-md"
          centered
          show={remarkModal}
        >
          <Modal.Header>
            <div className="modal_subhead">
              <span className="modal_head_txt">
                Remarks History of the Transaction
              </span>
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
        {showErrorAlert && (
          <Alert
            title={""}
            msg={alertErrorMessage}
            open={true}
            type={"error"}
            onClose={handleErrorCloseAlert}
          />
        )}
        <Alert
          title={""}
          msg={alertYesorNoMessage}
          open={showYesorNoAlert}
          type={"yesorno"}
          onClose={handleYesorNo}
          // onConfirm={Approve}
        />
        {errorYesNoAlert && (
          <Alert
            title={""}
            msg={errorYesNoAlertMsg}
            open={true}
            type={"yesorno"}
            onClose={() => setErrorYesNoAlert(false)}
            // onConfirm={Approve}
          />
        )}

        <Alert
          title={"Success"}
          msg={alertMessage}
          open={showAlert}
          type={"success"}
          onClose={showAlertClose}
        />
        <Alert
          title={alertTitle}
          msg={alertMsg}
          open={userAlert}
          type={alertType}
          onClose={alertClose}
          onConfirm={alertConfirm}
        />
      </div>
    </div>
  );
};

export default ChckFinancepayment;
