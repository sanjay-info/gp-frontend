import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import MaterialTable from '@material-table/core';
import { useNavigate } from 'react-router-dom';
import Alert from "../components/Alert";
import TableOptions from "../components/TableOptions";
import { CiSearch } from "react-icons/ci";
import { BiWindowOpen } from "react-icons/bi";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from 'react-icons/ai';
import Select from 'react-select';
import moment from "moment";
import DatePicker from "react-datepicker";

const Scheme = (props) => {

    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [datalist, setDatalist] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [userid] = useState(localStorage.getItem("user_id"));
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [token] = useState(localStorage.getItem("token"));
    const [userType] = useState(localStorage.getItem("UserType"));
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [schemeName, setSchemeName] = useState("")
    const [dividendPerc, setDividendPerc] = useState("")
    const [interestPerc, setInterestPerc] = useState("")
    const [tdsPerc, setTdsPerc] = useState("")
    const [minUnitsReq, setMinUnitsReq] = useState("")
    const [investmentYear, setInvestmentYear] = useState("")
    const [diviPeriodType, setDiviPeriodType] = useState("")
    const [noofDivi, setNoofDivi] = useState("");
    const [startDate, setStartDate] = useState("");
    const [applicablefor, setApplicablefor] = useState("");
    const [description, setdescription] = useState("");
    const [userTypes, setUserTypes] = useState([]);
    const [periodTypes, setperiodTypes] = useState([]);
    const [faceValue, setFacevalue] = useState("")
    const [bonusPerc, setBounsPerc] = useState("");

    const [selectedUserType, setSelectedUserType] = useState();
    const [selectedPeroidType, setSelectedPeroidType] = useState();
    const [selectedPeroidTypeid, setSelectedPeroidTypeid] = useState();

    const [individualflag, setIndividualflag] = useState(null);
    const [jointflag, setjointflag] = useState(false);
    const [activeflag, setActiveflag] = useState(false);

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const handleSelected = (selectedOption) => {
        setSelectedUserType(selectedOption)
    };
    // const handleSelectedPeroid = (selectedOption) => {
    //     setSelectedPeroidType(selectedOption);
    // };
    // const handleSelectedPeroid = (selectedOption) => {
    //     setSelectedPeroidType(selectedOption);
    //     if (selectedOption !== "" && investmentYear !== "") {
    //         showNoOfdivident(selectedOption, investmentYear);
    //     }
    // };
    const handleSelectedPeroid = (selectedOption) => {
        setSelectedPeroidType(selectedOption);
        if (investmentYear != '') {
            showNoOfdivident(selectedOption);
        }
    };



    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
            getMyDocuments();
            getAllUserTypes();
            getAllSchemeType();
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])

    const navigate = useNavigate();

    const columns = [
        {
            title: 'S.No',
            field: 'index',
            render: (rowData) => rowData.tableData.index + 1
        },
        {
            title: 'Scheme',
            field: 'bondName'
        },
        {
            title: 'User Type',
            field: 'userType'
        },
        {
            title: 'Dividend %',
            field: 'dividendPercentage'
        },
        {
            title: 'Interest Percentage',
            field: 'interestPercentage'
        },
        {
            title: 'Status',
            field: 'active',
            render: rowData => (
                <label style={{ color: rowData.active ? 'green' : 'red' }}>
                    {rowData.active ? "Active" : "Inactive"}
                </label>
            )
        },
        {
            title: 'Action',
            field: 'active',
            render: rowData => (
                <button className="btn btn-primary" onClick={() => handleView(rowData.id)}>
                    View
                </button>
            ),
            cellStyle: {
                textAlign: 'center'
            },
            headerStyle: {
                textAlign: 'center'
            },
            sorting: false,
        }

    ];
    const handleView = (id) => {
        navigate("/ViewScheme", { state: { id: id } });
    }

    const focusOutValidation = async (label) => {
        if (label === "schemename") {
            if (schemeName === "") {
                setFormErrors((e) => {
                    return { ...e, schemename: "Please Enter Scheme Name" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, schemename: "" }
                });
            }
        }
        else if (label === "facevalue") {
            if (faceValue === "") {
                setFormErrors((e) => {
                    return { ...e, facevalue: "Please Enter Face Value" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, facevalue: "" }
                });
            }
        }
        else if (label === "dividendPerc") {
            if (dividendPerc === "") {
                setFormErrors((e) => {
                    return { ...e, dividendPerc: "Please Enter Dividend Percentage" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, dividendPerc: "" }
                });
            }
        }
        else if (label === "interestPerc") {
            if (interestPerc === "") {
                setFormErrors((e) => {
                    return { ...e, interestPerc: "Please Enter Interest Percentage" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, interestPerc: "" }
                });
            }
        }
        else if (label === "tdsPerc") {
            if (tdsPerc === "") {
                setFormErrors((e) => {
                    return { ...e, tdsPerc: "Please Enter TDS Percentage" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, tdsPerc: "" }
                });
            }
        }
        else if (label === "bonusPerc") {
            if (bonusPerc === "") {
                setFormErrors((e) => {
                    return { ...e, bonusPerc: "Please Enter Bonus Percentage" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, bonusPerc: "" }
                });
            }
        }
        else if (label === "minUnitsReq") {
            if (minUnitsReq === "") {
                setFormErrors((e) => {
                    return { ...e, minUnitsReq: "Please Enter Minimum Units Required" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, minUnitsReq: "" }
                });
            }
        }
        else if (label === "investmentYear") {
            if (investmentYear === "") {
                setFormErrors((e) => {
                    return { ...e, investmentYear: "Please Enter Investment Years" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, investmentYear: "" }
                });
            }
        }
        else if (label === "startdate") {
            if (startDate === "") {
                setFormErrors((e) => {
                    return { ...e, startdate: "Please Enter Start Date" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, startdate: "" }
                });
            }
        }
    };

    const onChangeValidation = (e, label) => {
        let value;
        if (label != "startdate") {
            value = e.target.value;
        }
        else {
            value = e
        }
        if (label === "schemename") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, schemename: "Please Enter Scheme Name" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, schemename: "" }
                });
            }
        }
        else if (label === "facevalue") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, facevalue: "Please Enter Face Value" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, facevalue: "" }
                });
            }
        }
        else if (label === "interestPerc") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, interestPerc: "Please Enter Interest Percentage" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, interestPerc: "" }
                });
            }
        }
        else if (label === "tdsPerc") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, tdsPerc: "Please Enter TDS Percentage" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, tdsPerc: "" }
                });
            }
        }
        else if (label === "bonusPerc") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, bonusPerc: "Please Enter Bonus Percentage" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, bonusPerc: "" }
                });
            }
        }
        else if (label === "minUnitsReq") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, minUnitsReq: "Please Enter Minimum Units Required" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, minUnitsReq: "" }
                });
            }
        }
        else if (label === "investmentYear") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, investmentYear: "Please Enter Investment Years" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, investmentYear: "" }
                });
            }
        }
        else if (label === "dividendPerc") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, dividendPerc: "Please Enter Dividend Percentage" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, dividendPerc: "" }
                });
            }
        }
        else if (label === "startdate") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, startdate: "Please Enter Start Date" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, startdate: "" }
                });
            }
        }
    };

    const SaveScheme = () => {
        alert("sucees")
    }

    const handleRegisterValidation = (event) => {
        event.preventDefault();
        const errors = {};

        if (schemeName.trim() === "") {
            errors.schemename = "Please Enter Scheme Name";
        }
        if (faceValue.trim() === "") {
            errors.facevalue = "Please Enter Face Value";
        }
        if (!selectedUserType || !selectedUserType.value) {
            errors.userType = "Please Select User Type";
        }
        if (dividendPerc.trim() === "") {
            errors.dividendPerc = "Please Enter Dividend Percentage";
        }
        if (interestPerc.trim() === "") {
            errors.interestPerc = "Please Enter Interest Percentage";
        }
        if (tdsPerc.trim() === "") {
            errors.tdsPerc = "Please Enter TDS Percentage";
        }
        if (bonusPerc.trim() === "") {
            errors.bonusPerc = "Please Enter Bonus Percentage";
        }
        if (minUnitsReq.trim() === "") {
            errors.minUnitsReq = "Please Enter Minimum Units Required";
        }
        if (investmentYear.trim() === "") {
            errors.investmentYear = "Please Enter Investment Years";
        }
        if (!selectedPeroidType) {
            errors.dividendPeriodType = "Please Select Dividend Period Type";
        }
        if (startDate.trim() === "") {
            errors.startdate = "Please Enter Start Date";
        }
        if (!individualflag && !jointflag) {
            errors.applicableFor = "Please Select at Least One Option for 'Applicable for'";
        }
        if (!selectedUserType) {
            errors.selectuserType = "Please Select User Type";
        }
        if (!jointflag && !individualflag) {
            errors.indjointflag = "Please Select INDIVIDUAL/JOINT";
        }

        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            hanldesave();
        }
    };
    const hanldesave = (event) => {
        // event.preventDefault();
        const url = "/client/bond/save";
        const data = {
            bondName: schemeName,
            standardFaceValue: faceValue,
            standardUnits: minUnitsReq,
            userTypeId: selectedUserType.value,
            interestPercentage: interestPerc,
            dividendPercentage: dividendPerc,
            tds: tdsPerc,
            investmentYears: investmentYear,
            periodTypes: {
                id: selectedPeroidType.value,
            },
            bonusPercentage: parseInt(bonusPerc),
            // noOfDividend : ,
            startDate, startDate,
            description: description,
            individual: individualflag,
            joint: jointflag,
            active: activeflag,
            lastUpdatedBy: userid,
        };
        PostApi('POST', url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setUserAlert(true);
                    setModalOpen(false);
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setAlertClose(() => () => { setShowAlert(false); setModalOpen(false); window.location.reload(); })
                } else if (response.data.status === 409) {
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };
    const getMyDocuments = () => {
        const method = 'POST';
        const url = `/client/bond/all`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "scheme list")
                setDatalist(response.data);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const getAllUserTypes = () => {
        const method = 'POST';
        const url = `/user/type/all`;
        const data = {};

        PostApi(method, url, data)
            .then((response) => {
                console.log(response, "usertype")
                const transformedUserTypes = response.data.map(applicantStatus => ({
                    value: applicantStatus.id,
                    label: applicantStatus.userType
                }));
                setUserTypes(transformedUserTypes);
                console.log(transformedUserTypes, "transfer")
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const getAllSchemeType = () => {
        const method = 'POST';
        const url = `/client/periodForSchemes`;
        const data = {};

        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "getallschemstype")
                const transformedUserTypes = response.data.data.map(applicantStatus => ({
                    value: applicantStatus.id,
                    label: applicantStatus.periodType
                }));
                setperiodTypes(transformedUserTypes);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }


    const showNoOfdivident = (selectedOption) => {
        console.log("hjhjhj")
        if (selectedOption && selectedOption.value && investmentYear) {
            const method = 'POST';
            const data = new FormData();
            const url = `/client/noOfDiv?periodId=${encodeURIComponent(selectedOption.value)}&years=${encodeURIComponent(investmentYear)}`;

            PostApi(method, url, data, headers)
                .then((response) => {
                    console.log(response, "noofdividend");
                    setNoofDivi(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching number of dividends:", error);
                });
        } else {
            console.error("Selected period type or investment year is missing.");
        }
    };


    const ViewSchemes = () => {
        navigate("/ViewScheme")
    }
    const handleCloseModal = () => {
        setModalOpen(false);
        setFormErrors({});
    };
    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container ">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div>
                            <div className="welcome_text" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Schemes</span>
                                <button type="button" className="gpbtn" onClick={() => setModalOpen(true)}>
                                    <span className="gpbtn_txt" >Create Scheme</span>
                                </button>
                                {/* <button type="button" className="gpbtn" onClick={ViewSchemes}>
                                    <span className="gpbtn_txt" >View Scheme</span>
                                </button> */}
                            </div>

                            <div className="d-block d-lg-none mt-3">
                                <div className='admin_inputcontainer'>
                                    <div className="input_icons">
                                        <CiSearch></CiSearch>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='srchinput_box'
                                    />
                                </div>
                            </div>
                            <div style={{ marginTop: "20px" }} className="d-none d-lg-block">
                                <MaterialTable
                                    style={{ width: "100%" }}
                                    title=""
                                    columns={columns}
                                    data={datalist}
                                    options={TableOptions()}
                                />
                            </div>
                            <Modal dialogClassName='modal-dialog modal-lg' centered show={modalOpen}>
                                <Modal.Header>
                                    <div className='modal_subhead'>
                                        <span className='modal_head_txt'>Create Scheme</span>
                                        <AiOutlineClose className="moda_closel_icon" onClick={handleCloseModal} />
                                    </div>
                                </Modal.Header>
                                <Modal.Body >
                                    <form onSubmit={handleRegisterValidation}>
                                        <div className="col-12 row" style={{ padding: "10px" }}>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Scheme Name <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="text"
                                                        id="schemename"
                                                        name="schemename"
                                                        className='inputscheme'
                                                        placeholder="Scheme Name"
                                                        onChange={(e) => {
                                                            setSchemeName(e.target.value);
                                                            onChangeValidation(e, 'schemename');
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const char = String.fromCharCode(e.charCode || e.keyCode);
                                                            // Allow only letters (a-z, A-Z), numbers (0-9), and space
                                                            if (!/[a-zA-Z0-9 ]/.test(char)) {
                                                                e.preventDefault();  // Prevent special characters
                                                            }
                                                        }}
                                                        onBlur={() => focusOutValidation("schemename")}
                                                    />
                                                    {formErrors.schemename && <div className="field_form_alert">
                                                        <span>{formErrors.schemename}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Face Value <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="facevalue"
                                                        name="facevalue"
                                                        className='inputscheme'
                                                        placeholder="Face value"
                                                        onChange={(e) => {
                                                            setFacevalue(e.target.value);
                                                            onChangeValidation(e, 'facevalue');
                                                        }}
                                                        onBlur={() => focusOutValidation("facevalue")}
                                                        maxLength={5}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                    {formErrors.facevalue && <div className="field_form_alert">
                                                        <span>{formErrors.facevalue}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer '>
                                                <label className="adminscheme_font">User Type <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <Select
                                                        id="userType"
                                                        placeholder="Select User Type"
                                                        value={selectedUserType}
                                                        options={userTypes}
                                                        onChange={(selectedOption) => {
                                                            handleSelected(selectedOption);
                                                            if (selectedOption) {
                                                                setFormErrors((e) => ({ ...e, userType: "" }));
                                                            }
                                                        }}
                                                    />
                                                    {formErrors.userType && <div className="field_form_alert">
                                                        <span>{formErrors.userType}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer '>
                                                <label className="adminscheme_font">Dividend % <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="dividendPerc"
                                                        name="dividendPerc"
                                                        className='inputscheme'
                                                        placeholder="Dividend %"
                                                        onChange={(e) => {
                                                            setDividendPerc(e.target.value)
                                                            onChangeValidation(e, 'dividendPerc')
                                                        }}
                                                        onBlur={() => focusOutValidation("dividendPerc")}
                                                        maxLength={5}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                    {formErrors.dividendPerc && <div className="field_form_alert">
                                                        <span>{formErrors.dividendPerc}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Interest % <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="interestPerc"
                                                        name="interestPerc"
                                                        className='inputscheme'
                                                        placeholder="Interest"
                                                        onChange={(e) => {
                                                            setInterestPerc(e.target.value)
                                                            onChangeValidation(e, 'interestPerc')
                                                        }}
                                                        onBlur={() => focusOutValidation("interestPerc")}
                                                        maxLength={5}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                    {formErrors.interestPerc && <div className="field_form_alert">
                                                        <span>{formErrors.interestPerc}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">TDS % <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="tdsPerc"
                                                        name="tdsPerc"
                                                        className='inputscheme'
                                                        placeholder="TDS"
                                                        onChange={(e) => {
                                                            setTdsPerc(e.target.value)
                                                            onChangeValidation(e, 'tdsPerc')
                                                        }}
                                                        onBlur={() => focusOutValidation("tdsPerc")}
                                                        maxLength={5}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                    {formErrors.tdsPerc && <div className="field_form_alert">
                                                        <span>{formErrors.tdsPerc}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Bonus % <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="bonusPerc"
                                                        name="bonusPerc"
                                                        className='inputscheme'
                                                        placeholder="Bonus"
                                                        onChange={(e) => {
                                                            setBounsPerc(e.target.value)
                                                            onChangeValidation(e, 'bonusPerc')
                                                        }}
                                                        onBlur={() => focusOutValidation("bonusPerc")}
                                                        maxLength={2}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                    {formErrors.bonusPerc && <div className="field_form_alert">
                                                        <span>{formErrors.bonusPerc}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Minimum Units Required <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="minUnitsReq"
                                                        name="minUnitsReq"
                                                        className='inputscheme'
                                                        placeholder="Minimum Units Required"
                                                        onChange={(e) => {
                                                            setMinUnitsReq(e.target.value)
                                                            onChangeValidation(e, 'minUnitsReq')
                                                        }}
                                                        onBlur={() => focusOutValidation("minUnitsReq")}
                                                        maxLength={5}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                    {formErrors.minUnitsReq && <div className="field_form_alert">
                                                        <span>{formErrors.minUnitsReq}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Investment Years <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="investmentYear"
                                                        name="investmentYear"
                                                        className='inputscheme'
                                                        placeholder="Investment Years"
                                                        onChange={(e) => {
                                                            setInvestmentYear(e.target.value)
                                                            onChangeValidation(e, 'investmentYear')
                                                            if (selectedPeroidType && e.target.value) {
                                                                showNoOfdivident();
                                                            }
                                                        }}
                                                        onBlur={() => focusOutValidation("investmentYear")}
                                                        maxLength={5}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const charCode = e.charCode || e.keyCode;
                                                            if (charCode < 48 || charCode > 57) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    />

                                                    {formErrors.investmentYear && <div className="field_form_alert">
                                                        <span>{formErrors.investmentYear}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Dividend Period Type <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <Select
                                                        id="dividendPeriodType"
                                                        placeholder="Select User Type"
                                                        value={selectedPeroidType}
                                                        options={periodTypes}
                                                        onChange={(selectedOption) => {
                                                            handleSelectedPeroid(selectedOption);
                                                            if (selectedOption) {
                                                                setFormErrors((e) => ({ ...e, dividendPeriodType: "" }));
                                                            }
                                                        }}
                                                    />
                                                    {formErrors.dividendPeriodType && <div className="field_form_alert">
                                                        <span>{formErrors.dividendPeriodType}</span>
                                                    </div>}
                                                </div>
                                            </div>

                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">No of Dividends </label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="text"
                                                        id="NoofDividends"
                                                        readOnly
                                                        disabled
                                                        value={noofDivi || "0"}
                                                        name="NoofDividends"
                                                        className='inputscheme'
                                                        placeholder="No of Dividends"
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Start Date <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    {/* <input
                                                        type="date"
                                                        id="startdate"
                                                        name="startdate"
                                                        className='inputscheme'
                                                        placeholder="Start Date"
                                                        min="2024-01-01"
                                                        onKeyDown={(e) => e.preventDefault()}
                                                        onChange={(e) => {
                                                            setStartDate(e.target.value)
                                                            onChangeValidation(e, ' startdate')


                                                        }}
                                                        onBlur={() => focusOutValidation("startdate")}
                                                    /> */}

                                                    <DatePicker
                                                        showIcon
                                                        showYearDropdown
                                                        scrollableYearDropdown
                                                        selected={startDate ? new Date(startDate) : null}
                                                        onChange={(date) => {
                                                            setStartDate(moment(date).format("YYYY-MM-DD"))
                                                            onChangeValidation(date, 'startdate');
                                                        }}
                                                        className='input_box'
                                                        placeholderText='dd-mm-yyyy'
                                                        dateFormat="dd-MM-yyyy"
                                                        onKeyDown={(e) => {
                                                            e.preventDefault()
                                                        }}
                                                        minDate={new Date()}
                                                        onBlur={() => focusOutValidation("startdate")}
                                                        shouldCloseOnSelect={true}
                                                    />

                                                    {formErrors.startdate && <div className="field_form_alert">
                                                        <span>{formErrors.startdate}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Description</label>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="text"
                                                        id="description"
                                                        name="description"
                                                        className='inputscheme'
                                                        placeholder="Description"
                                                        onChange={(e) => {

                                                            setdescription(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">Applicable for <span className="required">*</span></label>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">INDIVIDUAL</label>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="checkbox"
                                                        id="individualflag"
                                                        name="individualflag"
                                                        placeholder="Applicable for"
                                                        checked={individualflag}
                                                        onChange={(e) => {
                                                            setIndividualflag(e.target.checked)
                                                            if (e.target.checked || individualflag) {
                                                                setFormErrors((prevErrors) => ({ ...prevErrors, indjointflag: "" }));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {formErrors.indjointflag && <div className="field_form_alert">
                                                    <span>{formErrors.indjointflag}</span>
                                                </div>}
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">JOINT</label>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="checkbox"
                                                        id="jointflag"
                                                        name="jointflag"
                                                        placeholder="Applicable for"
                                                        onChange={(e) => {
                                                            setjointflag(e.target.checked);
                                                            if (e.target.checked || individualflag) {
                                                                setFormErrors((prevErrors) => ({ ...prevErrors, indjointflag: "" }));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>


                                            <div className='col-lg-4 col-12 admin_inputcontainer' style={{ marginTop: "30px" }}>
                                                <label className="adminscheme_font">Active </label>
                                            </div>
                                            <div className='col-lg-8 col-12' style={{ marginTop: "30px" }}>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="checkbox"
                                                        id="activeflag"
                                                        name="activeflag"
                                                        onChange={(e) => {
                                                            setActiveflag(e.target.checked);
                                                            if (e.target.checked || jointflag) {
                                                                setFormErrors((prevErrors) => ({ ...prevErrors, indjointflag: "" }));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                                                <div className="col-4 col-lg-4">
                                                    <button className="approve_btn" type="submit">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
                {showAlert && (
                    <Alert
                        title={""}
                        msg={alertMessage}
                        open={true}
                        type={"error"}
                        onClose={handleCloseAlert}
                    />
                )}
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

export default Scheme;