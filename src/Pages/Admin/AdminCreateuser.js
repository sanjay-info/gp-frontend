import React, { useEffect, useState } from 'react';
import { RiMailLine } from 'react-icons/ri';
import { AiOutlineClose } from 'react-icons/ai';
import { Modal } from "react-bootstrap";
import { FaRegUser } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../components/AppProvider';
import Alert from '../components/Alert';
import Webcam from 'react-webcam';
import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import '../Register.css';
import { useSidebar } from "../components/SidebarContext";
import Select from 'react-select';
import TeamsAndCondition from '../User/TeamsAndCondition';
import Lightbox from "react-image-lightbox";
import PhoneInput from 'react-phone-input-2'
import DatePicker from "react-datepicker";
import moment from "moment";
import { initializeLightGallery } from '../components/lightGalleryInitializer';

const AdminCreateuser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [dob, setDob] = useState('');
    const [panNo, setPanNo] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [panImg, setPanImg] = useState(null);
    const [aadhaarImg, setAadhaarImg] = useState(null);
    const [userPanImg, setUserPanImg] = useState(null);
    const [userAadhaarImg, setUserAadhaarImg] = useState(null);
    const webcamRef = React.useRef(null);
    const [isWebcamOn, setIsWebcamOn] = useState(false);
    const [webCamImgSrc, setWebCamImgSrc] = React.useState(null);
    const [showPreview, setShowPreview] = React.useState(false);
    const [profileImgUpload, setProfileImgUpload] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [userTypes, setUserTypes] = useState([]);
    const [selectedUserType, setSelectedUserType] = useState();

    const [userListTypes, setUserListTypes] = useState([]);
    const [selectedUserListType, setSelectedUserListType] = useState();

    const [roleTypes, setRoleTypes] = useState([]);
    const [selectedRoleTypes, setSelectedRoleTypes] = useState();
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
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenAgree, setModalOpenAgree] = useState(false);
    const [alertClose, setAlertClose] = useState(() => null);
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("");
    const { sideBarCollapse } = useSidebar();
    const [formErrors, setFormErrors] = useState({});
    const { PostApi } = useAppContext()
    const navigate = useNavigate()
    // ------- pattern ------
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const passportPattern = /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/;
    const [userid] = useState(localStorage.getItem("user_id"));
    const [checkFlag, setCheckFlag] = useState('');
    const [token] = useState(localStorage.getItem("token"));
    const [roleId] = useState(localStorage.getItem("Role_id"));

    const [showYesorNoAlert, setShowYesorNoAlert] = useState(false);
    const [alertYesorNoMessage, setAlertYesorNoMessage] = useState('');

    const [maskedPanNo, setMaskedPanNo] = useState("");
    const [maskedAadhaarNo, setMaskedAadhaarNo] = useState("");

    const [userPanImgShow, setUserPanImgShow] = useState(false);
    const [userAadhaarImgShow, setUserAadhaarImgShow] = useState(false);
    const [userProfileImgShow, setUserProfileImgShow] = useState(false);

    const [countryCode, setCountryCode] = useState()

    const handleYesorNo = () => {
        setShowYesorNoAlert(false);
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
    const maxDate = eighteenYearsAgo.toISOString().split('T')[0];

    const countryOptions = [
        { value: 'INDIA', label: 'INDIA' },
        { value: 'USA', label: 'USA' },
    ];

    useEffect(() => {

        if (roleId !== null && roleId !== "" && roleId !== undefined) {
            getAllUserTypes();
            getAllRoleTypes();
            getAllUserListTypes();
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])

    const focusOutValidation = async (label) => {
        if (label === "name") {
            if (name === "") {
                setFormErrors((e) => {
                    return { ...e, name: "Please Enter  Name" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, name: "" }
                })
            }
        }
        else if (label === "statusapplicant") {
            if (selectedUserType === "") {
                setFormErrors((e) => {
                    return { ...e, statusofapplicant: "Please select status of applicant" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, statusofapplicant: "" }
                })
            }
        }
        else if (label === "email") {
            if (email === "") {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter Email Address" }
                })
            }
            else if (emailPattern.test(email) === false) {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter valid Email Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, email: "" }
                })
            }
        }
        else if (label === "mobileNo") {
            if (mobileNo === "") {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Mobile Number" }
                })
            }
            else if (mobileNo.length !== 10) {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Valid Mobile Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "" }
                })
            }
        }
        else if (label === "dob") {
            if (dob === "") {
                setFormErrors((e) => {
                    return { ...e, dob: "Please Select  Date of Birth" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, dob: "" }
                })
            }
        }
        else if (label === "panNo") {
            if (panNo === "") {
                setFormErrors((e) => {
                    return { ...e, panNo: "Please Enter  PAN Number" }
                })
            }
            else if (panPattern.test(panNo) === false) {
                setFormErrors((e) => {
                    return { ...e, panNo: "Please Enter Valid PAN Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, panNo: "" }
                })
            }
        }
        else if (label === "aadhaar") {
            if (aadhaar === "" || aadhaar === null) {
                setFormErrors((e) => {
                    return { ...e, aadhaar: "Please Enter  Aadhaar" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, aadhaar: "" }
                })
            }
        }
        else if (label === "addressLine1") {
            if (addressLine1 === "") {
                setFormErrors((e) => {
                    return { ...e, addressLine1: "Please Enter Permanent Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, addressLine1: "" }
                })
            }
        }
        else if (label === "addressLine11") {
            if (addressLine11 === "") {
                setFormErrors((e) => {
                    return { ...e, addressLine11: "Please Enter Address for correspondence" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, addressLine11: "" }
                })
            }
        }
        else if (label === "city1") {
            if (addressLine11 === "") {
                setFormErrors((e) => {
                    return { ...e, city1: "Please Enter City" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, city1: "" }
                })
            }
        }
        else if (label === "city2") {
            if (city2 === "") {
                setFormErrors((e) => {
                    return { ...e, city2: "Please Enter City" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, city2: "" }
                })
            }
        }
        else if (label === "pincode1") {
            if (pincode1 === "") {
                setFormErrors((e) => {
                    return { ...e, pincode1: "Please Enter Postal Code" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, pincode1: "" }
                })
            }
        }
        else if (label === "pincode2") {
            if (pincode2 === "") {
                setFormErrors((e) => {
                    return { ...e, pincode2: "Please Enter Postal Code" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, pincode2: "" }
                })
            }
        }
        else if (label === "state1") {
            if (state1 === "") {
                setFormErrors((e) => {
                    return { ...e, state1: "Please Enter State" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, state1: "" }
                })
            }
        }
        else if (label === "state2") {
            if (state2 === "") {
                setFormErrors((e) => {
                    return { ...e, state2: "Please Enter State" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, state2: "" }
                })
            }
        }
        else if (label === "country1") {
            if (country1 === "") {
                setFormErrors((e) => {
                    return { ...e, country1: "Please Enter Addressline" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, country1: "" }
                })
            }
        }
        else if (label === "country2") {
            if (country2 === "") {
                setFormErrors((e) => {
                    return { ...e, country2: "Please Enter Country" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, country2: "" }
                })
            }
        }
        else if (label === "check") {
            if (!checkFlag) {
                setFormErrors((errors) => {
                    return { ...errors, checkbox: "Please agree to  terms and conditions" };
                });
            } else {
                setFormErrors((errors) => {
                    return { ...errors, checkbox: "" };
                });
            }
        }
    }

    const onChangeValidation = (e, label) => {
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
        else if (label === "statusapplicant") {
            const value = e.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, statusofapplicant: "Please select status of applicant" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, statusofapplicant: "" }
                })
            }
        }
        else if (label === "email") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter Email Address" }
                })
            }
            else if (emailPattern.test(value) === false) {
                setFormErrors((e) => {
                    return { ...e, email: "Please Enter valid Email Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, email: "" }
                })
            }
        }
        else if (label === "modalEmail") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, modalEmail: "Please Enter Email Address" }
                })
            }
            else if (emailPattern.test(value) === false) {
                setFormErrors((e) => {
                    return { ...e, modalEmail: "Please Enter valid Email Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, modalEmail: "" }
                })
            }
        }
        else if (label === "mobileNo") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Mobile Number" }
                })
            }
            else if (value.length !== 10) {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "Please Enter Valid Mobile Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, mobileNo: "" }
                })
            }
        }
        else if (label === "modalMobileNo") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, modalMobileNo: "Please Enter Mobile Number" }
                })
            }
            else if (value.length !== 10) {
                setFormErrors((e) => {
                    return { ...e, modalMobileNo: "Please Enter Valid Mobile Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, modalMobileNo: "" }
                })
            }
        }
        else if (label === "dob") {
            const value = e;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, dob: "Please Select Date of Birth" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, dob: "" }
                })
            }
        }
        else if (label === "panNo") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, panNo: "Please Enter PAN Number" }
                })
            }
            else if (panPattern.test(value) === false) {
                setFormErrors((e) => {
                    return { ...e, panNo: "Please Enter Valid PAN Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, panNo: "" }
                })
            }
        }
        else if (label === "aadhaar") {
            const value = e.target.value;
            if (value === "" || value === null) {
                setFormErrors((e) => {
                    return { ...e, aadhaar: "Please Enter Aadhaar Number" }
                })
            }
            else if (value.length !== 12) {
                setFormErrors((e) => {
                    return { ...e, aadhaar: "Please Enter Valid Aadhaar Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, aadhaar: "" }
                })
            }
        }
        else if (label === "passportNo") {
            const value = e.target.value;
            if (value === "" || value === null) {
                setFormErrors((e) => {
                    return { ...e, passportNo: "Please Enter Passport Number" }
                })
            }
            else if (passportPattern.test(value) === false) {
                setFormErrors((e) => {
                    return { ...e, passportNo: "Please Enter valid Passport Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, passportNo: "" }
                })
            }
        }
        else if (label === "countryOfResidence") {
            const value = e.target.value;
            if (value === "" || value === null) {
                setFormErrors((e) => {
                    return { ...e, countryOfResidence: "Please Enter Country Of residence" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, countryOfResidence: "" }
                })
            }
        }
        else if (label === "nationality") {
            const value = e;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, nationality: "Please Select Nationality" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, nationality: "" }
                })
            }
        }
        else if (label === "ociCardNo") {
            const value = e.target.value;
            if (value === "" || value === null) {
                setFormErrors((e) => {
                    return { ...e, ociCardNo: "Please Enter OCI Number" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, ociCardNo: "" }
                })
            }
        }
        else if (label === "addressLine1") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, addressLine1: "Please Enter Permanent Address" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, addressLine1: "" }
                })
            }
        }
        else if (label === "addressLine11") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, addressLine11: "Please Enter Address for correspondence" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, addressLine11: "" }
                })
            }
        }
        else if (label === "city1") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, city1: "Please Enter City" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, city1: "" }
                })
            }
        }
        else if (label === "city2") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, city2: "Please Enter City" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, city2: "" }
                })
            }
        }
        else if (label === "pincode1") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, pincode1: "Please Enter Postal Code" }
                })
            }

            else if (value.length !== 6 || value === null) {
                setFormErrors((e) => {
                    return { ...e, pincode1: "Please Enter valid Postal Code" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, pincode1: "" }
                })
            }
        }
        else if (label === "pincode2") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, pincode2: "Please Enter Postal Code" }
                })
            }
            else if (value.length !== 6) {
                setFormErrors((e) => {
                    return { ...e, pincode2: "Please Enter valid Postal Code" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, pincode2: "" }
                })
            }
        }
        else if (label === "country1") {
            const value = e.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, country1: "Please Enter Country" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, country1: "" }
                })
            }
        }
        else if (label === "country2") {
            const value = e.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, country2: "Please Enter Country" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, country2: "" }
                })
            }
        }
        else if (label === "state1") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, state1: "Please Enter State" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, state1: "" }
                })
            }
        }
        else if (label === "state2") {
            const value = e.target.value;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, state2: "Please Enter State" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, state2: "" }
                })
            }
        }
        else if (label === "check") {
            const value = e.target.checked;
            if (!value) {
                setFormErrors((errors) => {
                    return { ...errors, checkbox: "Please agree to  Terms and conditions" };
                });
            } else {
                setFormErrors((errors) => {
                    return { ...errors, checkbox: "" };
                });
            }
        }

    }

    const handlePanUpload = async (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.png') || fileName.endsWith('.jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.pdf')) {
                const fileSizeInKB = file.size / 1024;
                // if (fileSizeInKB > 500) {
                // setFormErrors({ ...formErrors, panImg: "File size should not exceed 500KB" })
                // fileInput.value = '';
                // setPanImg(null)
                // setUserPanImg(null)
                // } else {
                setPanImg(file)
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result;
                    setUserPanImg(base64String);
                };
                reader.readAsDataURL(file);
                setFormErrors({ ...formErrors, panImg: "" })
                // }
            }
            else {
                fileInput.value = '';
                setFormErrors({ ...formErrors, panImg: "Invalid file format. Please upload a .png .jpeg, or .jpg file." })
            }
        }
    }

    const handleAadhaarUpload = async (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
        if (file) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.png') || fileName.endsWith('.jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.pdf')) {
                const fileSizeInKB = file.size / 1024;
                // if (fileSizeInKB > 500) {
                // setFormErrors({ ...formErrors, aadhaarImg: "File size should not exceed 500KB" })
                // fileInput.value = '';
                // setAadhaarImg(null)
                // setUserAadhaarImg(null)
                // } else {
                setAadhaarImg(file)
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result;
                    setUserAadhaarImg(base64String);
                };
                reader.readAsDataURL(file);
                setFormErrors({ ...formErrors, aadhaarImg: "" })
                // }
            }
            else {
                fileInput.value = '';
                setFormErrors({ ...formErrors, aadhaarImg: "Invalid file format. Please upload a .png .jpeg, or .jpg file." })
            }
        }
    }

    const handleProfileUpload = async (event) => {

        const fileInput = event.target;
        const file = fileInput.files[0];

        if (file) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith('.png') || fileName.endsWith('.jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.pdf')) {
                const fileSizeInKB = file.size / 1024;
                // if (fileSizeInKB > 500) {
                // setFormErrors({ ...formErrors, profileImg: "File size should not exceed 500KB" })
                // fileInput.value = '';
                // setProfileImg(null)
                // setProfileImgUpload(null)
                // setWebCamImgSrc(null)
                // } else {
                setProfileImg(file)
                setWebCamImgSrc(null)
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result;
                    setProfileImgUpload(base64String);
                };
                reader.readAsDataURL(file);
                setFormErrors({ ...formErrors, profileImg: "" })
                // }
            }
            else {
                fileInput.value = '';
                setFormErrors({ ...formErrors, profileImg: "Invalid file format. Please upload a .png .jpeg, or .jpg file." })
                setWebCamImgSrc(null)
            }
        }
    }

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
                addressLine11: '',
                city2: '',
                pincode2: '',
                state2: '',
                country2: ''

            });
        } else {
            setAddressLine11('');
            setCity2('');
            setState2('');
            setCountry2('');
            setPincode2('');
            setSameAsCorrespondence(false);
        }
    };

    const handleFileInputChange = (event) => {
        event.target.value = '';
    };

    const openWebCamModal = () => {
        setModalOpen(true)
        setIsWebcamOn(true)
        setProfileImgUpload(false)
        setProfileImg(null);
        setProfileImgUpload(null);

        const id = document.getElementById("uploadProfilePhoto")
        if (id) {
            id.value = ''
        }
    }

    const closeWebCamModal = () => {
        setModalOpen(false)
        setIsWebcamOn(false)
        setProfileImg(null)
        setShowPreview(false);
        setWebCamImgSrc(null)
    }

    const openAgreementModal = () => {
        setModalOpenAgree(true)
    }

    const closeAgreementModal = () => {
        setModalOpenAgree(false)
    }

    const doneWebCamModal = () => {
        setModalOpen(false);
        setIsWebcamOn(false);
        setShowPreview(false);
    };

    const webCamCapture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        const file = dataURLtoFile(imageSrc, 'webcam_image.jpg');
        setWebCamImgSrc(imageSrc);
        setProfileImg(file)
        setShowPreview(true);
    }, [webcamRef, setWebCamImgSrc]);

    function dataURLtoFile(dataURL, filename) {
        var byteString = atob(dataURL.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: 'image/jpeg' });
        return new File([blob], filename, { type: 'image/jpeg' });
    }

    const getAllUserListTypes = () => {
        const url = '/user/type/all';
        PostApi('POST', url)
            .then((response) => {
                const transformedUserTypes = response.data.map(userListType => ({
                    value: userListType.id,
                    label: userListType.userType
                }));
                setUserListTypes(transformedUserTypes);
                setSelectedUserListType(transformedUserTypes[0])
            })
            .catch((error) => {
                console.log("Error fetching user types:", error);
            });
    };

    const getAllUserTypes = () => {
        const method = 'POST';
        const url = `/user/applicantStatus`;
        const data = {};

        PostApi(method, url, data, headers)
            .then((response) => {
                const transformedUserTypes = response.data.data.map(applicantStatus => ({
                    value: applicantStatus.id,
                    label: applicantStatus.applicantStatus
                }));
                setUserTypes(transformedUserTypes);
                setSelectedUserType(transformedUserTypes[0])
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const getAllRoleTypes = () => {
        const method = 'POST';
        const url = `/user/role/all`;
        const data = {};

        PostApi(method, url, data, headers)
            .then((response) => {
                const transformedUserTypes = response.data.map(role => ({
                    value: role.id,
                    label: role.role

                }));
                setRoleTypes(transformedUserTypes);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handleSelected = (selectedOption) => {
        setSelectedUserType(selectedOption)
    };
    const handleRoleSelected = (selectedOption) => {
        setSelectedRoleTypes(selectedOption)
    };
    const handleUserListSelected = (selectedOption) => {
        setSelectedUserListType(selectedOption)
    };


    // ------------ Handle Save Submit --------
    const handleRegisterValidation = (event) => {
        event.preventDefault();
        const errors = {};
        if (name === "") {
            errors.name = "Please Enter  Name"
        }
        if (selectedUserType === "") {
            errors.statusapplicant = "Please Select Status of Applicant"
        }
        if (email === "") {
            errors.email = "Please Enter Email Address"
        }
        else if (emailPattern.test(email) === false) {
            errors.email = "Please Enter Valid Email Address"
        }
        if (mobileNo === "") {
            errors.mobileNo = "Please Enter Mobile Number"
        }
        if (dob === "" || dob === null) {
            errors.dob = "Please Select Date of Birth";
        } else {
            const dobDate = new Date(dob);
            const currentDate = new Date();
            const minDate = new Date();
            const maxDate = new Date();
            minDate.setFullYear(currentDate.getFullYear() - 18);
            maxDate.setFullYear(currentDate.getFullYear() - 100);

            if (isNaN(dobDate)) {
                errors.dob = "Invalid date format.";
            } else if (dobDate > minDate) {
                errors.dob = "Dob must be at least 18 years old.";
            } else if (dobDate < maxDate) {
                errors.dob = "Dob must be less than 100 years old.";
            }
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
            errors.state1 = "Please Enter State";
        }
        if (state2 === "" || state2 === null) {
            errors.state2 = "Please Enter State";
        }
        if (country1 === "" || country1 === null) {
            errors.country1 = "Please Enter Country ";
        }
        if (country2 === "" || country2 === null) {
            errors.country2 = "Please Enter Country";
        }
        if (pincode1 === "" || pincode1 === null) {
            errors.pincode1 = "Please Enter Postal Code ";
        }
        if (pincode2 === "" || pincode2 === null) {
            errors.pincode2 = "Please Enter Postal Code";
        }
        if ((aadhaarImg === null || aadhaarImg === "") && (userAadhaarImg === null || userAadhaarImg === "")) {
            errors.aadhaarImg = "Please Upload Address Proof";
        }
        if ((webCamImgSrc === null || webCamImgSrc === "") && (profileImgUpload === null || profileImgUpload === "")) {
            errors.profileImg = "Please Upload Profile Photo";
        }
        // if (checkFlag === "" || checkFlag === null || checkFlag === false) {
        //     errors.checkbox = "Please agree to  Terms and Conditions";
        // }

        console.log(errors,"jljjk")
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            setShowYesorNoAlert(true);
            setAlertYesorNoMessage("Are you sure you want to submit ?");
        }
    }

    const handleRegister = (event) => {
        const url = "/user/admin/register";
        const data = new FormData();

        data.append("createdBy", userid);
        data.append("userTypeId", selectedUserListType.value);
        data.append("firstName", name);
        data.append("applicantStatusId", selectedUserType.value);
        data.append("emailId", email);
        data.append("mobileNo", parseInt(mobileNo));
        data.append("dateOfBirth", dob);
        data.append("pan", panNo);
        data.append("aadhaar", aadhaar);
        data.append("addressLine1", addressLine1);
        data.append("addressLine11", addressLine11);
        data.append("city1", city1);
        data.append("city2", city2);
        data.append("pincode1", pincode1);
        data.append("pincode2", pincode2);
        data.append("country1", country1.value);
        data.append("country2", country2.value);
        data.append("state1", state1);
        data.append("state2", state2);
        data.append("roleId[0]", selectedRoleTypes.value);
        data.append("aadhaarImg", aadhaarImg);
        data.append("panImg", panImg);
        data.append("profileImg", profileImg);
        data.append("consentChkFlag", true);
        data.append("countryCode", countryCode);
        data.append("ociCard", false);
        data.append("ociCardNo", false);

        PostApi('POST', url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setShowAlert(true)
                    setShowYesorNoAlert(false)
                    setAlertMessage(
                        <div>
                            The above information provided has been updated.<br />
                            The files uploaded have been received.  <br />
                            KYC verification is being processed.
                        </div>
                    );
                    setAlertClose(() => () => navigate("/userList"))
                }
                else {
                    setShowYesorNoAlert(false);
                    setUserAlert(true);
                    setAlertType("error")
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => setUserAlert(false))
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }

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

    const handleMobileChange = (value, country) => {
        const phoneNumberWithoutCountryCode = value.slice(country.dialCode.length).trim();
        setMobileNo(phoneNumberWithoutCountryCode);
        setCountryCode(`+${country.dialCode}`)
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
                                <div className='col-12 col-md-6'>
                                    <text className="welcome_text">Create User</text>
                                </div>
                            </div>
                            <form onSubmit={handleRegisterValidation}>
                                <div className='row' style={{ marginTop: "20px" }}>
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Name <span className="required_star">*</span> </label>
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
                                                onChange={(e) => {
                                                    setName(e.target.value)
                                                    onChangeValidation(e, 'name')
                                                }}
                                                onKeyDown={AlphabetsPattern}
                                                onBlur={() => focusOutValidation("name")}
                                            />
                                            {formErrors.name && <div className="field_form_alert">
                                                <span>{formErrors.name}</span>
                                            </div>}
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-4 col-md-12">
                                        <div className='input_container'>
                                            <label className='login_label'>User Type<span className="required">*</span></label>
                                            <div className='input_contanier' >
                                                <Select styles={customStyles}
                                                    id="role"
                                                    placeholder="Select User Role"
                                                    value={selectedUserListType}
                                                    options={userListTypes}
                                                    isDisabled
                                                    onChange={(selectedOption) => {
                                                        handleUserListSelected(selectedOption);
                                                        onChangeValidation({ value: selectedOption.value }, "UserList");
                                                    }}
                                                />
                                                {formErrors.role && <div className="field_form_alert">
                                                    <span>{formErrors.role}</span>
                                                </div>}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-lg-4 col-md-12">
                                        <div className='input_container'>
                                            <label className='login_label'>Role<span className="required">*</span></label>
                                            <div className='input_contanier' >
                                                <Select styles={customStyles}
                                                    id="role"
                                                    placeholder="Select User Role"
                                                    value={selectedRoleTypes}
                                                    options={roleTypes}
                                                    onChange={(selectedOption) => {
                                                        handleRoleSelected(selectedOption);
                                                        onChangeValidation({ value: selectedOption.value }, "role");
                                                    }}
                                                />
                                                {formErrors.role && <div className="field_form_alert">
                                                    <span>{formErrors.role}</span>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-4 col-md-12">
                                        <div className='input_container'>
                                            <label className='login_label'>Status of Applicant <span className="required">*</span></label>
                                            <div className='input_contanier' >
                                                <Select styles={customStyles}
                                                    id="statusofapplicant"
                                                    placeholder="Select User Type"
                                                    value={selectedUserType}
                                                    options={userTypes}
                                                    isDisabled
                                                    onChange={(selectedOption) => {
                                                        handleSelected(selectedOption);
                                                        onChangeValidation({ value: selectedOption.value }, "statusapplicant");
                                                    }}

                                                />
                                                {formErrors.statusofapplicant && <div className="field_form_alert">
                                                    <span>{formErrors.statusofapplicant}</span>
                                                </div>}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-lg-4 col-md-12">
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
                                                onChange={(e) => {
                                                    setEmail(e.target.value)
                                                    onChangeValidation(e, "email")
                                                }}
                                                onBlur={() => focusOutValidation("email")}
                                            />
                                            {formErrors.email && <div className="field_form_alert">
                                                <span>{formErrors.email}</span>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-12">
                                        <label className='login_label'>Mobile Number <span className="required_star">*</span>  </label>
                                        <div className='phone_input_container'>
                                            <PhoneInput
                                                countryCodeEditable={false}
                                                onlyCountries={['us', 'in']}
                                                style={{ width: "100%", height: "43px" }}
                                                onChange={handleMobileChange}
                                            />
                                        </div>
                                        {formErrors.mobileNo && <div className="field_form_alert">
                                            <span>{formErrors.mobileNo}</span>
                                        </div>}
                                    </div>
                                

                                    <div className="col-lg-3 col-md-12">
                                        <label className='login_label'>Date of Birth <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                <CiCalendarDate />
                                            </div>
                                            {/* <input
                                                type="date"
                                                id="dob"
                                                name="dob"
                                                className='input_box'
                                                onKeyDown={(event) => {
                                                    event.preventDefault();
                                                }}
                                                value={dob}
                                                onChange={(e) => {
                                                    setDob(e.target.value)
                                                    onChangeValidation(e, "dob")
                                                }}
                                                max={maxDate}
                                            /> */}
                                            <DatePicker
                                                showIcon
                                                selected={dob ? new Date(dob) : null}
                                                onChange={(date) => {
                                                    setDob(moment(date).format("YYYY-MM-DD"))
                                                    onChangeValidation(date, "dob")
                                                }}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={100}
                                                className='input_box'
                                                placeholderText='dd-mm-yyyy'
                                                dateFormat="dd-MM-yyyy"
                                                maxDate={maxDate}
                                                onKeyDown={(e) => {
                                                    e.preventDefault()
                                                }}
                                                onBlur={() => focusOutValidation("dob")}
                                                shouldCloseOnSelect={true}
                                            />
                                            {formErrors.dob && <div className="field_form_alert">
                                                <span>{formErrors.dob}</span>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-12">
                                        <label className='login_label'>PAN Number <span className="required_star">*</span></label>
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
                                                value={maskedPanNo}
                                                maxLength={10}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                    setPanNo(inputValue);
                                                    setMaskedPanNo(inputValue)
                                                    onChangeValidation(e, "panNo")
                                                }}
                                                onBlur={() => focusOutValidation("panNo")}
                                            />
                                            {formErrors.panNo && <div className="field_form_alert">
                                                <span>{formErrors.panNo}</span>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-12">
                                        <label className='login_label'>Aadhaar Number <span className="required_star">*</span> </label>
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
                                                value={maskedAadhaarNo}
                                                onChange={(e) => {
                                                    let input = e.target.value.replace(/\D/g, '');
                                                    input = input.slice(0, 12);
                                                    setAadhaar(input);
                                                    setMaskedAadhaarNo(input);
                                                    onChangeValidation(e, "aadhaar");
                                                }}
                                                onBlur={() => focusOutValidation("aadhaar")}
                                            />
                                            {formErrors.aadhaar && <div className="field_form_alert">
                                                <span>{formErrors.aadhaar}</span>
                                            </div>}
                                        </div>
                                    </div>
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
                                                onChange={(e) => {
                                                    setAddressLine1(e.target.value)
                                                    if (sameAsCorrespondence === true) {
                                                        setAddressLine11(e.target.value)
                                                    }
                                                    onChangeValidation(e, 'addressLine1')
                                                }}
                                                onBlur={() => focusOutValidation("addressLine1")}
                                            />
                                            {formErrors.addressLine1 && <div className="field_form_alert">
                                                <span>{formErrors.addressLine1}</span>
                                            </div>}
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
                                                        onChange={(e) => {
                                                            const input = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                                            setCity1(input)
                                                            if (sameAsCorrespondence === true) {
                                                                setCity2(e.target.value)
                                                            }
                                                            onChangeValidation(e, 'city1')
                                                        }}
                                                        onBlur={() => focusOutValidation("city1")}
                                                    />
                                                    {formErrors.city1 && <div className="field_form_alert">
                                                        <span>{formErrors.city1}</span>
                                                    </div>}
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
                                                        value={state1}
                                                        onChange={(e) => {
                                                            const input = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                                            setState1(input)
                                                            if (sameAsCorrespondence === true) {
                                                                setState2(e.target.value)
                                                            }
                                                            onChangeValidation(e, 'state1')
                                                        }}
                                                        onBlur={() => focusOutValidation("state1")}
                                                    />
                                                    {formErrors.state1 && <div className="field_form_alert">
                                                        <span>{formErrors.state1}</span>
                                                    </div>}
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
                                                        onChange={(e) => {
                                                            setCountry1(e)
                                                            if (sameAsCorrespondence === true) {
                                                                setCountry2(e)
                                                            }
                                                            onChangeValidation(e, 'country1')
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                    {formErrors.country1 && <div className="field_form_alert">
                                                        <span>{formErrors.country1}</span>
                                                    </div>}
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
                                                        value={pincode1}
                                                        maxLength={country1.value === "INDIA" ? 6 : 5}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setPincode1(value);
                                                            if (sameAsCorrespondence === true) {
                                                                setPincode2(e.target.value)
                                                            }
                                                            onChangeValidation(e, 'pincode1');
                                                        }}
                                                        onBlur={() => focusOutValidation("pincode1")}
                                                    />
                                                    {formErrors.pincode1 && <div className="field_form_alert">
                                                        <span>{formErrors.pincode1}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: 'row' }}>
                                            <label className='login_label'>Address for correspondence<span className="required_star">*</span>
                                            </label>
                                            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                                <input type="checkbox" id="agreeCheckbox" checked={sameAsCorrespondence} onChange={(e) => handleCheckboxChange(e.target.checked)} />
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
                                                onChange={(e) => {
                                                    setAddressLine11(e.target.value)
                                                    onChangeValidation(e, 'addressLine11')
                                                }}
                                                onBlur={() => focusOutValidation("addressLine11")}
                                            />
                                            {formErrors.addressLine11 && <div className="field_form_alert">
                                                <span>{formErrors.addressLine11}</span>
                                            </div>}
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
                                                        onChange={(e) => {
                                                            const input = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                                            setCity2(input)
                                                            onChangeValidation(e, 'city2')
                                                        }}
                                                        onBlur={() => focusOutValidation("city2")}
                                                    />
                                                    {formErrors.city2 && <div className="field_form_alert">
                                                        <span>{formErrors.city2}</span>
                                                    </div>}
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
                                                        isDisabled={sameAsCorrespondence}
                                                        onChange={(e) => {
                                                            setCountry2(e)
                                                            onChangeValidation(e, 'country2')
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                    {formErrors.country2 && <div className="field_form_alert">
                                                        <span>{formErrors.country2}</span>
                                                    </div>}
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
                                                        disabled={sameAsCorrespondence}
                                                        maxLength={country2.value === "INDIA" ? 6 : 5}
                                                        onChange={(e) => {
                                                            let input = e.target.value
                                                            setPincode2(input);
                                                            onChangeValidation(e, 'pincode2');
                                                        }}
                                                        onBlur={() => focusOutValidation("pincode2")}
                                                    />
                                                    {formErrors.pincode2 && <div className="field_form_alert">
                                                        <span>{formErrors.pincode2}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
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
                                                onChange={handlePanUpload}
                                                onClick={handleFileInputChange}
                                                onBlur={() => focusOutValidation("panImg")}
                                            />
                                            <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                            {formErrors.panImg && <div className="field_form_alert">
                                                <span>{formErrors.panImg}</span>
                                            </div>}
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
                                    <div className="col-lg-4 col-md-12">
                                        <label className='login_label'>Upload Address Proof <span style={{ fontSize: '10px' }}>( Aadhaar / Driver\'s License )</span>   <span className="required_star">*</span>  </label>
                                        <div className='input_contanier'>
                                            <input
                                                type='file'
                                                id="uploadAadhaar"
                                                name="uploadAadhaar"
                                                className='input_box'
                                                style={{ paddingLeft: "6px" }}
                                                accept='.jpg,.png,.pdf'
                                                onChange={handleAadhaarUpload}
                                                onClick={handleFileInputChange}
                                            />
                                            <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                            {formErrors.aadhaarImg && <div className="field_form_alert">
                                                <span>{formErrors.aadhaarImg}</span>
                                            </div>}
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
                                                onClick={() => openWebCamModal()}
                                                style={{
                                                    color: 'blue',
                                                    cursor: 'pointer'
                                                }}
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
                                                onChange={handleProfileUpload}
                                                onClick={handleFileInputChange}
                                            />
                                            <span style={{ fontSize: '10px' }}> (.png, .jpeg, .jpg or .pdf)</span>
                                            {formErrors.profileImg && <div className="field_form_alert">
                                                <span>{formErrors.profileImg}</span>
                                            </div>}
                                            <div>
                                                {(webCamImgSrc && modalOpen === false) &&
                                                    <div>
                                                        <img alt='' onClick={() => setUserProfileImgShow(true)} src={webCamImgSrc} className='img_preview' />
                                                    </div>
                                                }
                                            </div>
                                            <div>
                                                {/* {profileImgUpload &&
                                                    <img alt='' src={profileImgUpload} className='img_preview' />
                                                } */}
                                                {profileImgUpload && (
                                                    (profileImgUpload.startsWith("data:application/pdf") || profileImgUpload.endsWith(".pdf")) ? (
                                                        <div style={{ width: "100%", height: "100%" }}>
                                                            <button class="preview-button"
                                                                type='button'
                                                                onClick={() => initializeLightGallery(profileImgUpload)}
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
                                                            src={profileImgUpload}
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
                                {/* <div className='login_label centered_check'>
                                    <input type="checkbox" id="iagree"
                                        checked={checkFlag}
                                        onChange={(e) => {
                                            setCheckFlag(e.target.checked);
                                            onChangeValidation(e, 'check')
                                        }}
                                        onBlur={() => focusOutValidation("check")}
                                    />
                                    <label style={{ paddingLeft: "5px" }}>I agree to the Terms and Conditions <span style={{ color: 'blue', cursor: "pointer" }} onClick={() => openAgreementModal()}> (Click Here for T&C) <span className="required_star">*</span></span>
                                        {formErrors.checkbox && (<div className="field_form_alert" style={{ paddingTop: "2px" }}>
                                            <span >{formErrors.checkbox}</span>
                                        </div>
                                        )}
                                    </label>
                                </div> */}
                                <div className='col-12  login_btn_container cenAlig' >
                                    <button className=" col-lg-3 register_btn" type='submit'>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* ------------ Camera open Modal ----------- */}
                    <Modal size='modal-dialog modal-md' centered show={modalOpen}>
                        <Modal.Header>
                            <div className='modal_subhead'>
                                <span className='modal_head_txt'>Camera</span>
                                <AiOutlineClose className="moda_closel_icon" onClick={() => closeWebCamModal()} />
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='modal_body_container'>
                                <div>
                                    {isWebcamOn && !showPreview &&
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            width={"100%"}
                                            style={{ transform: 'scaleX(-1)' }}
                                        />
                                    }
                                    {!showPreview &&
                                        <div className='modal_container'>
                                            <button
                                                className="login_btn"
                                                type='button'
                                                onClick={() => webCamCapture()}
                                                style={{ width: "30%" }}
                                            >Capture</button>
                                        </div>
                                    }
                                    <div className='cenAlig'>
                                        {showPreview &&
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: "bold", color: 'black', paddingLeft: "10px" }}>Preview Captured Image</span>
                                                <img alt='' style={{ height: "200px", width: '200px', paddingTop: "20px", transform: 'scaleX(-1)' }} src={webCamImgSrc} className='img_preview_cam' />
                                            </div>
                                        }
                                    </div>
                                    {showPreview &&
                                        <div className='modal_container' >
                                            <button
                                                className="login_btn capbtn"
                                                type='button'
                                                onClick={() => setShowPreview(false)}

                                            >Re-capture</button>
                                            <button
                                                className="login_btn capbtn"
                                                type='button'
                                                onClick={() => doneWebCamModal()}
                                            >Ok</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={() => closeWebCamModal()} className="modal_close_btn">Close</button>
                        </Modal.Footer>
                    </Modal>
                    {/* ------------ Conditions Open Modal ----------- */}
                    <Modal dialogClassName='modal-dialog modal-xl' centered show={modalOpenAgree}>
                        <Modal.Header>
                            <div className='modal_subhead'>
                                <span className='modal_head_txt'>Terms and Conditions</span>
                                <AiOutlineClose className="moda_closel_icon" onClick={() => closeAgreementModal()} />
                            </div>
                        </Modal.Header>
                        <Modal.Body >
                            <div className='modal_body_container'>
                                <TeamsAndCondition></TeamsAndCondition>
                            </div>
                        </Modal.Body>
                    </Modal>
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
                    onConfirm={handleRegister}
                />
            )}
        </div>
    )
}

export default AdminCreateuser