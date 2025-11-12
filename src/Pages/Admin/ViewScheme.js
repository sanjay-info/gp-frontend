import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import MaterialTable from '@material-table/core';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from "../components/Alert";
import TableOptions from "../components/TableOptions";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from 'react-icons/ai';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import moment from "moment";

const ViewScheme = (props) => {

    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [datalist, setDatalist] = useState([]);
    const [premiumdatalist, setpremiumDatalist] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [userid] = useState(localStorage.getItem("user_id"));

    const [token] = useState(localStorage.getItem("token"));
    const [userType] = useState(localStorage.getItem("UserType"));
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [premiummodalOpen, setpremiumModalOpen] = useState(false);
    const [editmodalOpen, seteditModalOpen] = useState(false);
    const [viewmodalOpen, setviewModalOpen] = useState(false);
    const [viewPremOpen, setviewPremOpen] = useState(false);

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
    const [userTypeId, setUserTypeId] = useState("");
    const [periodTypes, setperiodTypes] = useState([]);
    const [projectType, setprojectType] = useState([]);
    const [schemeType, setschemeType] = useState([]);
    const [faceValue, setFacevalue] = useState("")

    const [selectedUserType, setSelectedUserType] = useState('');
    const [selectedPeroidType, setSelectedPeroidType] = useState();
    const [selectedProjectType, setSelectedProjectType] = useState();
    const [selectedSchemeType, setSelectedSchemeType] = useState();

    const [individualflag, setIndividualflag] = useState(null);
    const [jointflag, setjointflag] = useState(false);
    const [activeflag, setActiveflag] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [premiumId, setpremiumId] = useState("");
    const [premiumstartDate, setPremiumStartDate] = useState("");
    const [premiumendDate, setpremiumEndDate] = useState("");
    const [premiumFaceValue, setpremiumFaceValue] = useState("");
    const [premiumMinUnitsReq, setpremiumMinUnitsReq] = useState("");
    const [premiumActiveflag, setpremiumActiveflag] = useState("");

    const [selecteduserId, setSelectedUserId] = useState("");

    const [activeflagProject, setactiveflagProject] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectedRowDataPremium, setSelectedRowDataPremium] = useState(null);
    const [isViewMode, setIsViewMode] = useState(true);

    const [bonusPerc, setBonusPerc] = useState("");

    const [activeTab, setActiveTab] = useState(1);
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const location = useLocation();
    const id = location.state.id;


    const roleId = localStorage.getItem("Role_id");
    let storedRoleId = JSON.parse(roleId)
    const [updateFlag, setUpdateFlag] = useState(null);

    useEffect(() => {

        if (storedRoleId && Array.isArray(storedRoleId) && storedRoleId.length > 0) {
            if (storedRoleId[0].id === 6) {
                setUpdateFlag(true);
            } else {
                setUpdateFlag(false);
            }
        } else {
            setUpdateFlag(false);
        }

        getAllUserTypes();
        getAllPeroidType();
        getallschemsDetails();
        getallscheme();
        getProjectall();
        getpremiumScheme();
        getallProjectslist();
        // showNoOfdivident();
        console.log(id, "schemeid")
    }, [])

    const navigate = useNavigate();

    const columns = [
        {
            title: 'S.No',
            field: 'index',
            render: (rowData) => rowData.tableData.index + 1
        },

        {
            title: 'Projects',
            field: updateFlag ? 'clientDetails.clientName' : 'clientName'
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
            field: 'actions',
            render: rowData => (
                <div style={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>
                    <button className="btn btn-primary" onClick={() => handleViewClick(rowData)}>
                        View
                    </button>
                </div>
            ),
            cellStyle: {
                textAlign: 'center'
            },
            headerStyle: {
                textAlign: 'center'
            },
            sorting: false,
        },
    ];
    // useEffect(() => {
    //     if (selectedRowDataPremium) {
    //         setpremiumActiveflag(selectedRowDataPremium.active);
    //     }
    // }, [selectedRowDataPremium]);
    useEffect(() => {
        if (selectedRowDataPremium) {
            setpremiumId(selectedRowDataPremium.id);
            setPremiumStartDate(selectedRowDataPremium.startDate);
            setpremiumEndDate(selectedRowDataPremium.endDate);
            setpremiumFaceValue(selectedRowDataPremium.premiumFaceValue);
            setpremiumMinUnitsReq(selectedRowDataPremium.premiumUnits);
            setpremiumActiveflag(selectedRowDataPremium.active);  // Assuming "active" is a boolean
        }
    }, [selectedRowDataPremium]);

    const premiumcolumns = [
        {
            title: 'S.No',
            field: 'index',
            render: (rowData) => rowData.tableData.index + 1
        },

        {
            title: 'Start Date',
            field: 'startDate'
        },
        {
            title: 'End Date',
            field: 'endDate'
        },
        {
            title: 'Premium Face Value',
            field: 'premiumFaceValue'
        },
        // {
        //     title: 'Premium Unit',
        //     field: 'premiumUnits'
        // },
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
            field: 'actions',
            render: rowData => (
                <div style={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleView(rowData)}
                        disabled={!rowData.active} // Disable the button if the status is inactive
                    >
                        View
                    </button>
                </div>
            ),
        },
    ];
    const handleViewClick = (rowData) => {
        if (updateFlag) {
            getViewAssignmentDetails(rowData)
        } else {
            setSelectedRowData(rowData);
            setviewModalOpen(true);
        }
    };

    const getViewAssignmentDetails = (rowData) => {
        const method = 'POST';
        let url = `/client/bondMappings/id?id=${rowData.id}`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data)
                if (response.data.status === 200) {
                    setSelectedRowData(response.data.data)
                    setviewModalOpen(true);
                }
                else {
                    setSelectedRowData([])
                    setviewModalOpen(true);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });

    }


    const handleView = (rowData) => {
        setSelectedRowDataPremium(rowData);
        setviewPremOpen(true);
    };
    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };
    const handleSelected = (selectedOption) => {
        if (selectedOption) {
            console.log("Selected ID:", selectedOption.value);
            setSelectedUserId(selectedOption.value);
            setSelectedUserType(selectedOption);
        }
    };
    const handleSelectedPeroid = (selectedOption) => {
        setSelectedPeroidType(selectedOption)
        if (selectedOption !== "" && investmentYear !== "") {
            showNoOfdivident(selectedOption.value, investmentYear);
        }
    };
    const handleSelectedProject = (selectedOption) => {
        setSelectedProjectType(selectedOption)
    };

    const getProjectall = () => {
        const method = 'POST';
        let url;

        if (storedRoleId[0].id === 6) {
            url = "/client/bondMappings?id=" + id;
        }
        else {
            url = "/client/byClientBondId?id=" + id;
        }

        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "Project all")
                if (response.data.status === 200) {
                    setDatalist(response.data.data);
                } else {
                    setDatalist([]);
                }

            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const getpremiumScheme = () => {
        const method = 'POST';
        const url = "/client/premium/clientBondId?id=" + id;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "premium all")
                if (response.data.status === 200) {
                    setpremiumDatalist(response.data.data);
                }
                else {
                    setpremiumDatalist([]);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getallProjectslist = () => {
        const method = 'POST';
        const url = "/client/all";
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "Project list")
                const transformedUserTypes = response.data.map(applicantStatus => ({
                    value: applicantStatus.id,
                    label: applicantStatus.clientName
                }));
                setprojectType(transformedUserTypes);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getallscheme = () => {
        const method = 'POST';
        const url = `/client/bond/all`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "scheme list")
                const transformedUserTypes = response.data.map(applicantStatus => ({
                    value: applicantStatus.id,
                    label: applicantStatus.bondName

                }));
                setschemeType(transformedUserTypes);
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


            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const getAllPeroidType = () => {
        const method = 'POST';
        const url = `/client/periodForSchemes`;
        const data = {};

        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "getallperoidtype")
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
    const assignProjectToScheme = () => {
        const errors = {};
        if (!selectedProjectType) {
            errors.selectedProjectType = "Project type is required.";
        }

        if (activeflagProject === false) {
            errors.activeflagaddproject = "Please Select the checkbox";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        const method = 'POST';
        const data = new FormData();
        var url = "/client/assign?clientId=" + selectedProjectType.value + "&clientBondId=" + id + "&loginId=" + userid + "&active=" + activeflagProject;

        PostApi(method, url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setUserAlert(true);
                    setAlertTitle("Success")
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setAlertClose(() => () => { setUserAlert(false); window.location.reload(); })
                } else if (response.data.status === 409) {
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    };

    const getallschemsDetails = async () => {
        const url = `/client/bond/id?id=${id}`;
        const data = {};
        try {
            const response = await PostApi('POST', url, data, headers);
            console.log(response, "viewscheme Details")
            setSchemeName(response.data.data.bondName)
            setFacevalue(response.data.data.acquisitionValue)
            // setUserTypes(response.data.data.userType);
            // setUserTypeId(response.data.data.userTypeId);
            setDividendPerc(response.data.data.dividendPercentage);
            setInterestPerc(response.data.data.interestPercentage);
            setTdsPerc(response.data.data.tds);
            setBonusPerc(response.data.data.bonusPercentage)
            setMinUnitsReq(response.data.data.standardUnits);
            setInvestmentYear(response.data.data.investmentYears);
            setDiviPeriodType(response.data.data.periodTypes);
            setStartDate(response.data.data.startDate);
            setActiveflag(response.data.data.active);
            setIndividualflag(response.data.data.individual);
            setjointflag(response.data.data.joint);
            setdescription(response.data.data.description);
            // setNoofDivi(response.data.data.noOfDividend)
            setSelectedPeroidType({
                value: response.data.data.periodTypes.id,
                label: response.data.data.periodTypes.periodType
            })
            setSelectedUserType({
                value: response.data.data.userTypeId,
                label: response.data.data.userType,
            })
            setSelectedUserId(response.data.data.userTypeId)
            // const selectedUserType = userTypes.find(applicantStatus => applicantStatus.value === response.data.data.userTypeId);
            // setSelectedUserType(selectedUserType); 
            showNoOfdivident(response.data.data.periodTypes.id, response.data.data.investmentYears)
        } catch (error) {
            console.log(error);
        }
    };
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
        else if (label === "premiumstartDate") {
            if (premiumstartDate === "") {
                setFormErrors((e) => {
                    return { ...e, premiumstartDate: "Please Enter Start Date" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, premiumstartDate: "" }
                });
            }
        }
        else if (label === "premiumendDate") {
            if (premiumendDate === "") {
                setFormErrors((e) => {
                    return { ...e, premiumendDate: "Please Enter End Date" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, premiumendDate: "" }
                });
            }
        }
        else if (label === "premiumFaceValue") {
            if (premiumFaceValue === "") {
                setFormErrors((e) => {
                    return { ...e, premiumFaceValue: "Please Enter Face Value" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, premiumFaceValue: "" }
                });
            }
        }
        // else if (label === "premiumMinUnitsReq") {
        //     if (premiumMinUnitsReq === "") {
        //         setFormErrors((e) => {
        //             return { ...e, premiumMinUnitsReq: "Please Enter Minimum Unit Required" }
        //         });
        //     }
        //     else {
        //         setFormErrors((e) => {
        //             return { ...e, premiumMinUnitsReq: "" }
        //         });
        //     }
        // }
    };

    const onChangeValidation = (e, label) => {
        let value;
        if (label != "startdate" && label != "endDate" && label != "premiumstartDate" && label != "premiumendDate") {
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
        else if (label === "premiumstartDate") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, premiumstartDate: "Please Enter Start Date" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, premiumstartDate: "" }
                });
            }
        }
        else if (label === "premiumendDate") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, premiumendDate: "Please Enter End Date" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, premiumendDate: "" }
                });
            }
        }
        else if (label === "premiumFaceValue") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, premiumFaceValue: "Please Enter Face Value" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, premiumFaceValue: "" }
                });
            }
        }
        // else if (label === "premiumMinUnitsReq") {
        //     if (value === "") {
        //         setFormErrors((e) => {
        //             return { ...e, premiumMinUnitsReq: "Please Enter Minimum Unit Required" }
        //         });
        //     } else {
        //         setFormErrors((e) => {
        //             return { ...e, premiumMinUnitsReq: "" }
        //         });
        //     }
        // }
    };

    const handleRegisterValidation = (event) => {
        event.preventDefault();
        const errors = {};

        if (schemeName === "") {
            errors.schemename = "Please Enter Scheme Name";
        }
        if (faceValue === "") {
            errors.facevalue = "Please Enter Face Value";
        }
        // if (!selectedUserType) {
        //     errors.userType = "Please Select User Type";
        // }
        if (dividendPerc === "") {
            errors.dividendPerc = "Please Enter Dividend Percentage";
        }
        if (interestPerc === "") {
            errors.interestPerc = "Please Enter Interest Percentage";
        }
        if (tdsPerc === "") {
            errors.tdsPerc = "Please Enter TDS Percentage";
        }
        if (bonusPerc === "") {
            errors.bonusPerc = "Please Enter Bonus Percentage";
        }
        if (minUnitsReq === "") {
            errors.minUnitsReq = "Please Enter Minimum Units Required";
        }
        if (investmentYear === "") {
            errors.investmentYear = "Please Enter Investment Years";
        }
        if (startDate === "") {
            errors.startdate = "Please Enter Start Date";
        }
        if (!individualflag && !jointflag) {
            errors.applicableFor = "Please Select at Least One Option for 'Applicable for'";
        }
        console.log(errors, "errors")
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            hanldesave();
        }
    };
    const hanldesave = (event) => {
        // event.preventDefault();
        let url;
        let data = null;

        if (updateFlag === true) {
            url = `/client/bond/update?id=${id}&active=${activeflag}`;
        } else {
            url = "/client/bond/save";
            data = {
                id: id,
                bondName: schemeName,
                faceValue: faceValue,
                units: minUnitsReq,
                userTypeId: selecteduserId,
                interestPercentage: interestPerc,
                dividendPercentage: dividendPerc,
                tds: tdsPerc,
                investmentYears: investmentYear,
                periodTypes: {
                    id: selectedPeroidType.value,
                    periodType: selectedPeroidType.label,
                },
                bonusPercentage: parseInt(bonusPerc),
                noOfDividend: noofDivi,
                startDate, startDate,
                description: description,
                individual: individualflag,
                joint: jointflag,
                active: activeflag,
                lastUpdatedBy: parseInt(userid),
            };
        }

        PostApi('POST', url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setAlertTitle("Success")
                    setUserAlert(true);
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setAlertClose(() => () => { setShowAlert(false); setModalOpen(false); navigate("/Scheme") })
                } else if (response.data.status === 409) {
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };

    const checkpremiumschemes = () => {
        const method = 'POST';
        const url = `/client/premium/check?id=${id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response)
                if (response.data === false) {
                    hanldepremiumSchemeSave()
                } else if (response.data === true) {
                    setAlertTitle("Alert")
                    setUserAlert(true);
                    setAlertType("error")
                    setAlertMsg("Please uncheck active Premium scheme  before Adding the New Premium")
                    setAlertClose(() => () => { setUserAlert(false); })
                }

            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handlepremiumSchemeValidation = (event) => {
        event.preventDefault();
        const errors = {};

        if (premiumstartDate === "") {
            errors.premiumstartDate = "Please Select Start Date";
        }
        if (premiumendDate === "") {
            errors.premiumendDate = "Please Select End Date";
        }
        if (premiumFaceValue === "") {
            errors.premiumFaceValue = "Please Enter Face Value";
        }
        // if (premiumMinUnitsReq === "") {
        //     errors.premiumMinUnitsReq = "Please Enter Minimum Unit Required";
        // }
        if (premiumActiveflag === false || premiumActiveflag === "" || premiumActiveflag === null || premiumActiveflag === undefined) {
            errors.premiumActiveflag = "Please Select the active checkbox";
        }
        console.log(errors, "errors")
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            checkpremiumschemes();
        }
    };
    const hanldepremiumSchemeSave = (event) => {
        const url = "/client/premium/save";
        const data = {
            clientBondDetails: {
                id: id
            },
            startDate: premiumstartDate,
            endDate: premiumendDate,
            premiumFaceValue: premiumFaceValue,
            premiumUnits: premiumMinUnitsReq,
            active: premiumActiveflag,
            lastUpdatedBy: parseInt(userid),
        };

        PostApi('POST', url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setAlertTitle("Success")
                    setUserAlert(true);
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setAlertClose(() => () => { setUserAlert(false); window.location.reload(); })
                } else if (response.data.status === 409) {
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };

    const hanldeupdatepremiumSave = (event) => {
        const url = "/client/premium/save";
        const data = {
            id: premiumId,
            clientBondDetails: {
                id: id
            },
            startDate: premiumstartDate,
            endDate: premiumendDate,
            premiumFaceValue: premiumFaceValue,
            premiumUnits: premiumMinUnitsReq,
            active: premiumActiveflag,
            lastUpdatedBy: parseInt(userid),
        };

        PostApi('POST', url, data, headers)
            .then((response) => {
                console.log(response)
                if (response.data.status === 200) {
                    setAlertTitle("Success")
                    setUserAlert(true);
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setAlertClose(() => () => { setUserAlert(false); window.location.reload(); })
                } else if (response.data.status === 409) {
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };
    const showNoOfdivident = (selectedOption, investmentYear) => {
        const method = 'POST';
        const data = new FormData();
        var url = "/client/noOfDiv?periodId=" + selectedOption + "&years=" + investmentYear
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "noofdividend")
                setNoofDivi(response.data)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handleCloseModal = () => {
        setpremiumModalOpen(false)
        setpremiumEndDate("");
        setPremiumStartDate("");
        setpremiumFaceValue("")
        setpremiumMinUnitsReq("");
        setpremiumActiveflag(false)
        setFormErrors({});
    };
    const handleOpenPremiumModal = (rowData) => {
        setSelectedRowData(rowData);
        setpremiumModalOpen(true);
    };

    const handleProjectAssignmentSave = (event) => {
        const url = `/client/bondMappings/update?id=${selectedRowData.id}&active=${selectedRowData.active}`;
        PostApi('POST', url, null, headers)
            .then((response) => {
                console.log(response)
                if (response.data.status === 200) {
                    setAlertTitle("Success")
                    setUserAlert(true);
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setAlertClose(() => () => { setUserAlert(false); window.location.reload(); })
                } else if (response.data.status === 409) {
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                }
            })
            .catch((error) => {
                console.log(error)
            });
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
                                <div className="salesforce-tabs" >
                                    <button className={activeTab === 1 ? "active" : ""} onClick={() => handleTabChange(1)}>
                                        <span>Schemes</span>
                                    </button>
                                    <button style={{ marginLeft: "3px" }} className={activeTab === 2 ? "active" : ""} onClick={() => handleTabChange(2)}>
                                        <span>Premium Scheme</span>
                                    </button>
                                    <button style={{ marginLeft: "3px" }} className={activeTab === 3 ? "active" : ""} onClick={() => handleTabChange(3)}>
                                        <span>Projects</span>
                                    </button>
                                </div>
                                {activeTab === 2 && (
                                    <button type="button" className="adminbtn" onClick={handleOpenPremiumModal}>
                                        <span className="gpbtn_txt" >Add Premium Scheme</span>
                                    </button>

                                )}
                                {activeTab === 3 && (
                                    <button type="button" className="adminbtn" onClick={() => setModalOpen(true)}>
                                        <span className="gpbtn_txt" >Add Assignment</span>
                                    </button>

                                )}
                            </div>
                            {activeTab === 1 && (
                                <form onSubmit={handleRegisterValidation}>
                                    <div className="col-12 row" style={{ padding: "10px" }}>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Scheme Name <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="text"
                                                    id="SchemeName"
                                                    name="Scheme Name"
                                                    value={schemeName}
                                                    className='inputscheme'
                                                    placeholder="Scheme Name"
                                                    disabled
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Face Value<span className="required">*</span></span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="number"
                                                    id="facevalue"
                                                    value={faceValue}
                                                    name="facevalue"
                                                    className='inputscheme'
                                                    placeholder="Face value"
                                                    disabled
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
                                        <div className='col-lg-6 col-12'>
                                            <label className="adminscheme_font">User Type <span className="required">*</span></label>

                                            <div className='input_contanier'>
                                                <Select
                                                    id="userType"
                                                    placeholder="Select User Type"
                                                    value={selectedUserType}
                                                    options={userTypes}
                                                    isDisabled
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Dividend % <span className="required">*</span></span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="number"
                                                    id="Dividend"
                                                    value={dividendPerc}
                                                    name="Dividend"
                                                    className='inputscheme'
                                                    disabled
                                                    placeholder="Dividend"
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Interest % <span className="required">*</span></span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="number"
                                                    id="interestPerc"
                                                    name="interestPerc"
                                                    value={interestPerc}
                                                    className='inputscheme'
                                                    placeholder="Interest"
                                                    disabled
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">TDS % <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="number"
                                                    id="tdsPerc"
                                                    name="tdsPerc"
                                                    className='inputscheme'
                                                    value={tdsPerc}
                                                    placeholder="TDS"
                                                    disabled
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Bonus % <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="tel"
                                                    id="bonusPerc"
                                                    name="bonusPerc"
                                                    className='inputscheme'
                                                    value={bonusPerc}
                                                    placeholder="Bonus"
                                                    disabled
                                                    onChange={(e) => {
                                                        setBonusPerc(e.target.value)
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Minimum Units Required <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="tel"
                                                    id="mur"
                                                    name="Tds"
                                                    className='inputscheme'
                                                    value={minUnitsReq}
                                                    disabled
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Investment Years <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="tel"
                                                    id="SchemeName"
                                                    name="Investment Years"
                                                    value={investmentYear}
                                                    disabled
                                                    className='inputscheme'
                                                    placeholder="Investment Years"
                                                    onChange={(e) => {
                                                        setInvestmentYear(e.target.value)
                                                        onChangeValidation(e, 'investmentYear')
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
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Dividend Period Type <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                <Select
                                                    id="userType"
                                                    placeholder="Select User Type"
                                                    value={selectedPeroidType}
                                                    options={periodTypes}
                                                    isDisabled
                                                    onChange={(selectedOption) => {
                                                        handleSelectedPeroid(selectedOption);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">No of Dividends </span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="text"
                                                    id="NoofDividends"
                                                    readOnly
                                                    disabled
                                                    value={noofDivi}
                                                    name="NoofDividends"
                                                    className='inputscheme'
                                                    placeholder="No of Dividends"
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Start Date <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                {/* <input
                                                    type="date"
                                                    id="startdate"
                                                    name="startdate"
                                                    className='inputscheme'
                                                    value={startDate}
                                                    placeholder="Start Date"
                                                    readOnly={activeflag === true}
                                                    disabled={activeflag === true}
                                                    onChange={(e) => {
                                                        setStartDate(e.target.value)
                                                        onChangeValidation(e, 'startdate')

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
                                                    disabled
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    onBlur={() => focusOutValidation("startdate")}
                                                    shouldCloseOnSelect={true}
                                                />
                                                {formErrors.startdate && <div className="field_form_alert">
                                                    <span>{formErrors.startdate}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Description</span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="text"
                                                    id="description"
                                                    name="description"
                                                    value={description}
                                                    className='inputscheme'
                                                    disabled
                                                    placeholder="Description"
                                                    onChange={(e) => {
                                                        setdescription(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12 row'>
                                            <span className="adminscheme_font">Applicable for <span className="required">*</span></span>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">INDIVIDUAL</label>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="checkbox"
                                                        id="individualflag"
                                                        name="individualflag"
                                                        disabled
                                                        checked={individualflag}
                                                        placeholder="Applicable for"
                                                        onChange={(e) =>
                                                            setIndividualflag(e.target.checked)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <label className="adminscheme_font">JOINT</label>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="checkbox"
                                                        id="jointflag"
                                                        name="jointflag"
                                                        checked={jointflag}
                                                        disabled
                                                        placeholder="Applicable for"
                                                        onChange={(e) => {
                                                            setjointflag(e.target.checked);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Active <span className="required">*</span></span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="checkbox"
                                                    id="activeflag"
                                                    name="activeflag"
                                                    checked={activeflag}
                                                    onChange={(e) => {
                                                        setActiveflag(e.target.checked);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-4 col-lg-4 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%", width: "100%" }}>
                                            <div className="col-4 col-lg-4">
                                                <button type="submit" className="approve_btn">
                                                    Save
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            )}
                            {activeTab === 2 && (
                                <div style={{ marginTop: "20px" }}>
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={premiumcolumns}
                                        data={premiumdatalist}
                                        options={TableOptions()}
                                    />
                                </div>
                            )}
                            {activeTab === 3 && (
                                <div style={{ marginTop: "20px" }}>
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={columns}
                                        data={datalist}
                                        options={TableOptions()}
                                    />
                                </div>
                            )}
                        </div>
                        {/* Add premium scheme*/}
                        <Modal dialogClassName='modal-dialog modal-lg' centered show={premiummodalOpen}>
                            <Modal.Header>
                                <div className='modal_subhead'>
                                    <span className='modal_head_txt'>Add Premium Scheme </span>
                                    <AiOutlineClose className="moda_closel_icon" onClick={handleCloseModal} />
                                </div>
                            </Modal.Header>
                            <Modal.Body >
                                <form onSubmit={handlepremiumSchemeValidation}>
                                    <div className="col-12 row" style={{ padding: "10px" }}>
                                        <div className='col-lg-4 col-12 admin_inputcontainer ' >
                                            <span className="adminscheme_font">Start Date  <span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                {/* <input
                                                    type="date"
                                                    id="premiumstartDate"
                                                    name="premiumstartDate"
                                                    className='inputscheme'
                                                    value={premiumstartDate}
                                                    min="2024-01-01"
                                                    placeholder="Start Date"
                                                    onChange={(e) => {
                                                        const selectedStartDate = e.target.value;
                                                        setPremiumStartDate(e.target.value)
                                                        onChangeValidation(e, 'premiumendDate');
                                                        document.getElementById("premiumendDate").min = selectedStartDate;
                                                    }}
                                                    onBlur={() => focusOutValidation("premiumstartDate")}
                                                /> */}
                                                <DatePicker
                                                    showIcon
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    selected={premiumstartDate ? new Date(premiumstartDate) : null}
                                                    onChange={(date) => {
                                                        setPremiumStartDate(moment(date).format("YYYY-MM-DD"))
                                                        onChangeValidation(date, 'premiumstartDate');
                                                    }}
                                                    className='input_box'
                                                    // disabled={activeflag === true}
                                                    minDate={new Date()}
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    shouldCloseOnSelect={true}
                                                />
                                                {formErrors.premiumstartDate && <div className="field_form_alert">
                                                    <span>{formErrors.premiumstartDate}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12 admin_inputcontainer'>
                                            <span className="adminscheme_font">End Date <span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                {/* <input
                                                    type="date"
                                                    id="premiumendDate"
                                                    name="premiumendDate"
                                                    className='inputscheme'
                                                    value={premiumendDate}
                                                    placeholder="End Date"
                                                    onChange={(e) => {
                                                        setpremiumEndDate(e.target.value)
                                                        onChangeValidation(e, 'premiumendDate')

                                                    }}

                                                    onBlur={() => focusOutValidation("premiumendDate")}
                                                /> */}
                                                <DatePicker
                                                    showIcon
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    selected={premiumendDate ? new Date(premiumendDate) : null}
                                                    onChange={(date) => {
                                                        setpremiumEndDate(moment(date).format("YYYY-MM-DD"))
                                                        onChangeValidation(date, 'premiumendDate');
                                                    }}
                                                    className='input_box'
                                                    // disabled={activeflag === true}
                                                    minDate={new Date(premiumstartDate)}
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    shouldCloseOnSelect={true}
                                                />
                                                {formErrors.premiumendDate && <div className="field_form_alert">
                                                    <span>{formErrors.premiumendDate}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12 admin_inputcontainer'>
                                            <span className="adminscheme_font">premium Face Value<span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="tel"
                                                    id="premiumFaceValue"
                                                    name="premiumFaceValue"
                                                    className='inputscheme'
                                                    value={premiumFaceValue}
                                                    placeholder="premium Face Value"
                                                    onChange={(e) => {
                                                        setpremiumFaceValue(e.target.value)
                                                        onChangeValidation(e, 'premiumFaceValue')

                                                    }}
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
                                                    onBlur={() => focusOutValidation("premiumFaceValue")}
                                                />
                                                {formErrors.premiumFaceValue && <div className="field_form_alert">
                                                    <span>{formErrors.premiumFaceValue}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        {/* <div className='col-lg-4 col-12 admin_inputcontainer'>
                                            <span className="adminscheme_font">Minimum Unit Required<span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="tel"
                                                    id="premiumMinUnitsReq"
                                                    name="premiumMinUnitsReq"
                                                    className='inputscheme'
                                                    value={premiumMinUnitsReq}
                                                    placeholder="Minimum Unit Required"
                                                    onChange={(e) => {
                                                        setpremiumMinUnitsReq(e.target.value)
                                                        onChangeValidation(e, 'premiumMinUnitsReq')

                                                    }}

                                                    onKeyPress={(e) => {
                                                        const charCode = e.charCode || e.keyCode;
                                                        if (charCode < 48 || charCode > 57) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onBlur={() => focusOutValidation("premiumMinUnitsReq")}
                                                />
                                                {formErrors.premiumMinUnitsReq && <div className="field_form_alert">
                                                    <span>{formErrors.premiumMinUnitsReq}</span>
                                                </div>}
                                            </div>
                                        </div> */}
                                        <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                            <span className="adminscheme_font">Active <span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="checkbox"
                                                    id="premiumActiveflag"
                                                    name="premiumActiveflag"
                                                    onChange={(e) => {
                                                        setpremiumActiveflag(e.target.checked)
                                                        setFormErrors(prevErrors => ({ ...prevErrors, premiumActiveflag: "" }));
                                                    }}
                                                />
                                                {formErrors.premiumActiveflag && <div className="field_form_alert">
                                                    <span>{formErrors.premiumActiveflag}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                                            <div className="col-4 col-lg-4">
                                                <button type="submit" className="approve_btn">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>
                        {/* View premium scheme*/}
                        <Modal dialogClassName='modal-dialog modal-lg' centered show={viewPremOpen}>
                            <Modal.Header>
                                <div className='modal_subhead'>
                                    <span className='modal_head_txt'>View Premium Scheme </span>
                                    <AiOutlineClose className="moda_closel_icon" onClick={() => setviewPremOpen(false)} />
                                </div>
                            </Modal.Header>
                            <Modal.Body >
                                <form>
                                    <div className="col-12 row" style={{ padding: "10px" }}>
                                        <div className='col-lg-4 col-12 admin_inputcontainer ' >
                                            <span className="adminscheme_font">Start Date  <span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="date"
                                                    id="premiumstartDate"
                                                    name="premiumstartDate"
                                                    className='inputscheme'
                                                    value={selectedRowDataPremium?.startDate || ''}
                                                    min="2024-01-01"
                                                    disabled
                                                    placeholder="Start Date"
                                                    onChange={(e) => {
                                                        const selectedStartDate = e.target.value;
                                                        setPremiumStartDate(e.target.value)
                                                        onChangeValidation(e, 'premiumendDate');
                                                        document.getElementById("premiumendDate").min = selectedStartDate;
                                                    }}
                                                    onBlur={() => focusOutValidation("premiumstartDate")}
                                                />
                                                {formErrors.premiumstartDate && <div className="field_form_alert">
                                                    <span>{formErrors.premiumstartDate}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12 admin_inputcontainer'>
                                            <span className="adminscheme_font">End Date <span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="date"
                                                    id="premiumendDate"
                                                    name="premiumendDate"
                                                    className='inputscheme'
                                                    disabled
                                                    value={selectedRowDataPremium?.endDate || ''}
                                                    placeholder="End Date"
                                                    onChange={(e) => {
                                                        setpremiumEndDate(e.target.value)
                                                        onChangeValidation(e, 'premiumendDate')

                                                    }}

                                                    onBlur={() => focusOutValidation("premiumendDate")}
                                                />
                                                {formErrors.premiumendDate && <div className="field_form_alert">
                                                    <span>{formErrors.premiumendDate}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-lg-4 col-12 admin_inputcontainer'>
                                            <span className="adminscheme_font">premium Face Value<span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="number"
                                                    id="premiumFaceValue"
                                                    name="premiumFaceValue"
                                                    className='inputscheme'
                                                    disabled
                                                    // value={premiumFaceValue}
                                                    value={selectedRowDataPremium?.premiumFaceValue || ''}
                                                    placeholder="premium Face Value"
                                                    onChange={(e) => {
                                                        setpremiumFaceValue(e.target.value)
                                                        onChangeValidation(e, 'premiumFaceValue')

                                                    }}
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
                                                    onBlur={() => focusOutValidation("premiumFaceValue")}
                                                />
                                                {formErrors.premiumFaceValue && <div className="field_form_alert">
                                                    <span>{formErrors.premiumFaceValue}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        {/* <div className='col-lg-4 col-12 admin_inputcontainer'>
                                            <span className="adminscheme_font">Minimum Unit Required<span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12'>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="number"
                                                    id="premiumMinUnitsReq"
                                                    name="premiumMinUnitsReq"
                                                    className='inputscheme'
                                                    disabled
                                                    value={selectedRowDataPremium?.premiumUnits || ''}
                                                    // value={premiumMinUnitsReq}
                                                    placeholder="Minimum Unit Required"
                                                    onChange={(e) => {
                                                        setpremiumMinUnitsReq(e.target.value)
                                                        onChangeValidation(e, 'premiumMinUnitsReq')

                                                    }}
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
                                                    onBlur={() => focusOutValidation("premiumMinUnitsReq")}
                                                />
                                                {formErrors.premiumMinUnitsReq && <div className="field_form_alert">
                                                    <span>{formErrors.premiumMinUnitsReq}</span>
                                                </div>}
                                            </div>
                                        </div> */}
                                        <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                            <span className="adminscheme_font">Active <span className="required">*</span></span>
                                        </div>
                                        <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                            <div className='admin_inputcontainer'>
                                                <input
                                                    type="checkbox"
                                                    id="premiumActiveflag"
                                                    name="premiumActiveflag"

                                                    checked={premiumActiveflag} // Bind to state variable
                                                    onChange={(e) => {
                                                        setpremiumActiveflag(e.target.checked); // Update state with checkbox value
                                                        setFormErrors(prevErrors => ({ ...prevErrors, premiumActiveflag: "" }));
                                                    }}
                                                />
                                                {formErrors.premiumActiveflag && (
                                                    <div className="field_form_alert">
                                                        <span>{formErrors.premiumActiveflag}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                                            <div className="col-4 col-lg-4">
                                                <button type="button" className="approve_btn" onClick={hanldeupdatepremiumSave}>
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Modal.Body>
                        </Modal>
                        {/* Add Project */}
                        <Modal dialogClassName='modal-dialog modal-lg' centered show={modalOpen}>
                            <Modal.Header>
                                <div className='modal_subhead'>
                                    <span className='modal_head_txt'>Add Project Assignment</span>
                                    <AiOutlineClose className="moda_closel_icon" onClick={() => setModalOpen(false)} />
                                </div>
                            </Modal.Header>
                            <Modal.Body >
                                <div className="col-12 row" style={{ padding: "10px" }}>
                                    <div className='col-lg-4 col-12 admin_inputcontainer ' >
                                        <span className="adminscheme_font">Project Name <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className='admin_inputcontainer'>
                                            <Select
                                                id="userType"
                                                placeholder="Select Project Type"
                                                value={selectedProjectType}
                                                options={projectType}
                                                onChange={(selectedOption) => {
                                                    handleSelectedProject(selectedOption);
                                                    if (selectedOption) {
                                                        setFormErrors((e) => ({ ...e, selectedProjectType: "" }));
                                                    }
                                                }}

                                            />
                                            {formErrors.selectedProjectType && <div className="field_form_alert">
                                                <span>{formErrors.selectedProjectType}</span>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12 admin_inputcontainer'>
                                        <span className="adminscheme_font">Scheme Type <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className='admin_inputcontainer'>
                                            <input
                                                type="text"
                                                id="SchemeName"
                                                name="Scheme Name"
                                                value={schemeName}
                                                readOnly
                                                disabled
                                                className='inputscheme'
                                                placeholder="Scheme Name"
                                                onChange={(e) => {
                                                    setSchemeName(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                        <span className="adminscheme_font">Active <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                        <div className='admin_inputcontainer'>
                                            <input
                                                type="checkbox"
                                                id="activeflagaddproject"
                                                name="activeflagaddproject"
                                                placeholder="Description"
                                                onChange={(e) => {
                                                    setactiveflagProject(e.target.checked)
                                                    setFormErrors(prevErrors => ({ ...prevErrors, activeflagaddproject: "" }));
                                                }}
                                            />
                                            {formErrors.activeflagaddproject && <div className="field_form_alert">
                                                <span>{formErrors.activeflagaddproject}</span>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                                        <div className="col-4 col-lg-4">
                                            <button type="button" className="approve_btn" onClick={assignProjectToScheme}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                        {/* View Project */}
                        <Modal dialogClassName='modal-dialog modal-lg' centered show={viewmodalOpen}>
                            <Modal.Header>
                                <div className='modal_subhead'>
                                    <span className='modal_head_txt'>View Project Assignment</span>
                                    <AiOutlineClose className="moda_closel_icon" onClick={() => setviewModalOpen(false)} />
                                </div>
                            </Modal.Header>
                            <Modal.Body >
                                <div className="col-12 row" style={{ padding: "10px" }}>
                                    <div className='col-lg-4 col-12 admin_inputcontainer ' >
                                        <span className="adminscheme_font">Project Name <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className='admin_inputcontainer'>
                                            {/* <Select
                                                id="userType"
                                                placeholder="Select Project Type"
                                                value={selectedProjectType}
                                                options={projectType}
                                                onChange={(selectedOption) => {
                                                    handleSelectedProject(selectedOption);
                                                }}
                                            /> */}
                                            <input
                                                type="text"
                                                id="projectName"
                                                name="projectName"
                                                readOnly
                                                disabled
                                                className='inputscheme'
                                                value={updateFlag ? selectedRowData?.clientDetails?.clientName : selectedRowData?.clientName}
                                                placeholder="Project Name"
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12 admin_inputcontainer'>
                                        <span className="adminscheme_font">Scheme Type <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className='admin_inputcontainer'>
                                            <input
                                                type="text"
                                                id="SchemeName"
                                                name="Scheme Name"
                                                value={updateFlag ? selectedRowData?.clientBondDetails?.bondName : schemeName}
                                                readOnly
                                                disabled
                                                className='inputscheme'
                                                placeholder="Scheme Name"
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                        <span className="adminscheme_font">Active <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                        <div className='admin_inputcontainer'>
                                            <input
                                                type="checkbox"
                                                id="Description"
                                                name="Description"
                                                placeholder="Description"
                                                checked={selectedRowData?.active}
                                                onChange={(e) => {
                                                    setSelectedRowData({
                                                        ...selectedRowData,
                                                        active: e.target.checked
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {updateFlag &&
                                    <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                                        <div className="col-4 col-lg-4">
                                            <button type="button" className="approve_btn" style={{ marginTop: "0px" }} onClick={handleProjectAssignmentSave}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                }
                            </Modal.Body>
                        </Modal>
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

export default ViewScheme;