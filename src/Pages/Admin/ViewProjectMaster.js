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

const ViewProjectMaster = (props) => {

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
    const [editmodalOpen, seteditModalOpen] = useState(false);
    const [viewmodalOpen, setviewModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState(1);
    const [projectName, setProjectName] = useState("");
    const [duration, setDuration] = useState("");
    const [startDate, setStartDate] = useState("");
    const [enddate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [activeflag, setActiveflag] = useState(null);

    const [formErrors, setFormErrors] = useState({});

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [selectedSchemeType, setSelectedSchemeType] = useState();
    const [schemeType, setschemeType] = useState([]);
    const [checkboxProject, setcheckboxProject] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null);

    const minDate = new Date(process.env.REACT_APP_PAYMENT_DATE);

    const location = useLocation();
    const id = location.state.id;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
            getMyDocuments();
            getallProjectDetails();
            getSchemesByProject();
            getallscheme();
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
                    >
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
    const handleView = (rowData) => {
        console.log(rowData.id);
        viewbyscheme(rowData)
        setSelectedRowData(rowData);
        setviewModalOpen(true);
    };
    const handleSelectedScheme = (selectedOption) => {
        setSelectedSchemeType(selectedOption)
    };
    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };
    const getMyDocuments = () => {
        const method = 'POST';
        const url = `/userbond/userId?id=${userid}`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setDatalist(response.data);
                } else {
                    setDatalist([]);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const focusOutValidation = async (label) => {
        if (label === "projectname") {
            if (projectName === "") {
                setFormErrors((e) => {
                    return { ...e, projectname: "Please Enter Project Name" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, projectname: "" }
                });
            }
        }
        else if (label === "durationyears") {
            if (duration === "") {
                setFormErrors((e) => {
                    return { ...e, durationyears: "Please Enter Duration Years" }
                });
            }
            else {
                setFormErrors((e) => {
                    return { ...e, durationyears: "" }
                });
            }
        }
        // else if (label === "endDate") {
        //     if (duration === "") {
        //         setFormErrors((e) => {
        //             return { ...e, endDate: "Please Select End Date" }
        //         });
        //     }
        //     else {
        //         setFormErrors((e) => {
        //             return { ...e, endDate: "" }
        //         });
        //     }
        // }
        // else if (label === "startDate") {
        //     if (duration === "") {
        //         setFormErrors((e) => {
        //             return { ...e, startDate: "Please Select End Date" }
        //         });
        //     }
        //     else {
        //         setFormErrors((e) => {
        //             return { ...e, startDate: "" }
        //         });
        //     }
        // }
    };

    const onChangeValidation = (e, label) => {
        let value;
        if (label != "startDate" && label != "endDate") {
            value = e.target.value;
        }
        else {
            value = e
        }
        if (label === "projectname") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, projectname: "Please Enter Project Name" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, projectname: "" }
                });
            }
        }
        else if (label === "durationyears") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, durationyears: "Please Enter Duration Years" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, durationyears: "" }
                });
            }
        }
        else if (label === "startDate") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, startDate: "Please Select Start Date" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, startDate: "" }
                });
            }
        }
        else if (label === "endDate") {
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, endDate: "Please Select End Date" }
                });
            } else {
                setFormErrors((e) => {
                    return { ...e, endDate: "" }
                });
            }
        }
    };
    const handleRegisterValidation = (event) => {
        event.preventDefault();
        const errors = {};

        if (projectName === "") {
            errors.projectname = "Please Enter Project Name";
        }
        if (duration === "") {
            errors.durationyears = "Please Enter Duration Name";
        }
        if (startDate === "") {
            errors.startDate = "Please Select Start Date";
        }
        if (enddate === "") {
            errors.endDate = "Please Select End Date";
        }
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            hanldesave();
        }
    };
    const hanldesave = (event) => {
        // event.preventDefault();
        const url = "/client/save";
        const data = {
            id: id,
            clientName: projectName,
            description: description,
            duration: duration,
            startDate: startDate,
            endDate: enddate,
            active: activeflag,
            createdBy: userid,
        };
        PostApi('POST', url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setUserAlert(true);
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setAlertClose(() => () => { setUserAlert(false); })
                } else if (response.data.status === 409) {
                    setAlertMessage(response.data.message);
                    setShowAlert(true);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };
    const viewbyscheme = async (rowData) => {
        const url = `/client/clientId?id=${rowData.id}`;
        const data = {};
        try {
            const response = await PostApi('POST', url, data, headers);
            console.log(response, "viewbyscheme")
            // set(response.data.data.bondName)
        } catch (error) {
            console.log(error);
        }
    };
    const getallProjectDetails = async () => {
        const url = `/client/clientId?id=${id}`;
        const data = {};
        try {
            const response = await PostApi('POST', url, data, headers);
            console.log(response, "Project Details")
            setProjectName(response.data.data.clientName);
            setStartDate(response.data.data.startDate);
            setEndDate(response.data.data.endDate);
            setDescription(response.data.data.description);
            setActiveflag(response.data.data.active);
            setDuration(response.data.data.duration)
            // set(response.data.data.bondName)
        } catch (error) {
            console.log(error);
        }
    };
    const getSchemesByProject = () => {
        const method = 'POST';
        const url = `/client/finance/id?id=${id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "schemasbyProject");
                if (response.data.status === 200) {
                    setDatalist(response.data.data);
                } else {
                    setDatalist([]);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    };
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
    const assignSchemeToProject = () => {
        const errors = {};
        if (!selectedSchemeType) {
            errors.selectedSchemeType = "Scheme type is required.";
        }

        if (checkboxProject === false) {
            errors.activeflagaddproject = "Please select the checkbox";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        const method = 'POST';
        const data = new FormData();
        var url = "/client/assign?clientId=" + id + "&clientBondId=" + selectedSchemeType.value + "&loginId=" + userid + "&active=" + checkboxProject
        PostApi(method, url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setUserAlert(true);
                    setAlertType("success")
                    setAlertMsg(response.data.message)
                    setModalOpen(false);
                    setAlertClose(() => () => { setUserAlert(false); setModalOpen(false); window.location.reload(); })
                } else if (response.data.status === 409) {
                    setUserAlert(true);
                    setModalOpen(false);
                    setAlertType("error")
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => { setUserAlert(false); setModalOpen(true); })

                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const ViewSchemes = () => {
        navigate("/")
    }
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
                                        <span>Projects</span>
                                    </button>
                                    <button style={{ marginLeft: "3px" }} className={activeTab === 2 ? "active" : ""} onClick={() => handleTabChange(2)}>
                                        <span>Schemes</span>
                                    </button>
                                </div>
                                {activeTab === 2 && (
                                    <button type="button" className="gpbtn" onClick={() => setModalOpen(true)}>
                                        <span className="gpbtn_txt" >Add Assignment</span>
                                    </button>

                                )}
                            </div>
                            {activeTab === 1 && (
                                <form onSubmit={handleRegisterValidation}>
                                    <div>
                                        <div className="col-12 row" style={{ padding: "10px" }}>

                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Project Name <span className="required">*</span></span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="projectname"
                                                        name="projectname"
                                                        value={projectName}
                                                        className='inputscheme'
                                                        placeholder="Project Name"
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            const regex = /^[a-zA-Z\s]*$/;
                                                            if (regex.test(inputValue)) {
                                                                setProjectName(inputValue);
                                                                onChangeValidation(e, 'projectname');
                                                            }
                                                        }}
                                                        onBlur={() => focusOutValidation("projectname")}
                                                    />
                                                    {formErrors.projectname && <div className="field_form_alert">
                                                        <span>{formErrors.projectname}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Duration (Years) <span className="required">*</span></span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="tel"
                                                        id="durationyears"
                                                        name="durationyears"
                                                        maxLength={3}
                                                        value={duration}
                                                        className='inputscheme'
                                                        placeholder="Duration Years"
                                                        onChange={(e) => {
                                                            setDuration(e.target.value);
                                                            onChangeValidation(e, 'durationyears');
                                                        }}
                                                        onBlur={() => focusOutValidation("durationyears")}
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
                                                    {formErrors.durationyears && <div className="field_form_alert">
                                                        <span>{formErrors.durationyears}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Start Date <span className="required">*</span></span>
                                                <div className='input_contanier'>
                                                    {/* <input
                                                        type="date"
                                                        id="startDate"
                                                        name="startDate"
                                                        value={startDate}
                                                        className='inputscheme'
                                                        placeholder="Start date"
                                                        onChange={(e) => {
                                                            const selectedStartDate = e.target.value;
                                                            setStartDate(selectedStartDate)
                                                            onChangeValidation(e, 'startDate');
                                                            document.getElementById("endDate").min = selectedStartDate;
                                                        }}
                                                        onBlur={() => focusOutValidation("startDate")}
                                                    /> */}
                                                    <DatePicker
                                                        showIcon
                                                        showYearDropdown
                                                        scrollableYearDropdown
                                                        selected={startDate ? new Date(startDate) : null}
                                                        onChange={(date) => {
                                                            setStartDate(moment(date).format("YYYY-MM-DD"))
                                                            setEndDate(null)
                                                            onChangeValidation(date, 'startDate');
                                                        }}
                                                        className='inputscheme'
                                                        placeholderText='dd-mm-yyyy'
                                                        dateFormat="dd-MM-yyyy"
                                                        minDate={minDate}
                                                        onKeyDown={(e) => {
                                                            e.preventDefault()
                                                        }}
                                                        onBlur={() => focusOutValidation("startDate")}
                                                        shouldCloseOnSelect={true}
                                                    />
                                                    {formErrors.startDate && <div className="field_form_alert">
                                                        <span>{formErrors.startDate}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">End Date <span className="required">*</span></span>

                                                <div className='input_contanier'>
                                                    {/* <input
                                                        type="date"
                                                        id="endDate"
                                                        name="endDate"
                                                        className='inputscheme'
                                                        value={enddate}
                                                        placeholder="End date"
                                                        onChange={(e) => {
                                                            setEndDate(e.target.value)
                                                            onChangeValidation(e, 'endDate');
                                                        }}
                                                        onBlur={() => focusOutValidation("endDate")}
                                                    /> */}
                                                    <DatePicker
                                                        showIcon
                                                        showYearDropdown
                                                        scrollableYearDropdown
                                                        selected={enddate ? new Date(enddate) : null}
                                                        onChange={(date) => {
                                                            setEndDate(moment(date).format("YYYY-MM-DD"))
                                                            onChangeValidation(date, 'endDate');
                                                        }}
                                                        className='input_box'
                                                        placeholderText='dd-mm-yyyy'
                                                        dateFormat="dd-MM-yyyy"
                                                        onKeyDown={(e) => {
                                                            e.preventDefault()
                                                        }}
                                                        minDate={new Date(startDate)}
                                                        onBlur={() => focusOutValidation("endDate")}
                                                        shouldCloseOnSelect={true}
                                                    />
                                                    {formErrors.endDate && <div className="field_form_alert">
                                                        <span>{formErrors.endDate}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">No of Schemes</span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="noofSchemes"
                                                        name="noofSchemes"
                                                        className='inputscheme'
                                                        placeholder="No of Schemes"
                                                        readOnly
                                                        disabled
                                                        value={datalist.length || "0"}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Description</span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="description"
                                                        name="description"
                                                        className='inputscheme'
                                                        maxLength={50}
                                                        placeholder="Description"
                                                        value={description}
                                                        onChange={(e) => {
                                                            setDescription(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Active </span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="checkbox"
                                                        id="Description"
                                                        name="Description"
                                                        placeholder="Description"
                                                        checked={activeflag}
                                                        onChange={(e) => {
                                                            setActiveflag(e.target.checked)
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
                                    </div>
                                </form>
                            )}
                            {activeTab === 2 && (
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
                                    <div className='col-lg-4 col-12 admin_inputcontainer'>
                                        <span className="adminscheme_font">Scheme Name <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className='admin_inputcontainer'>
                                            <Select
                                                id="userType"
                                                placeholder="Select Scheme Type"
                                                value={selectedSchemeType}
                                                options={schemeType}
                                                onChange={(selectedOption) => {
                                                    handleSelectedScheme(selectedOption);
                                                    if (selectedOption) {
                                                        setFormErrors((e) => ({ ...e, selectedSchemeType: "" }));
                                                    }
                                                }}

                                            />
                                            {formErrors.selectedSchemeType && <div className="field_form_alert">
                                                <span>{formErrors.selectedSchemeType}</span>
                                            </div>}

                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12 admin_inputcontainer'>
                                        <span className="adminscheme_font">Project Name <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className="admin_inputcontainer">
                                            <input
                                                type="text"
                                                id="ProjectType"
                                                name="ProjecName"
                                                value={projectName}
                                                className='inputscheme'
                                                placeholder="Project Name"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12 admin_inputcontainer' style={{ marginTop: "0px" }}>
                                        <span className="adminscheme_font">Active <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                        <div className="admin_inputcontainer">
                                            <input
                                                type="checkbox"
                                                id="activeflagaddproject"
                                                name="activeflagaddproject"
                                                placeholder="Description"
                                                onChange={(e) => {
                                                    setcheckboxProject(e.target.checked)
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
                                            <button type="button" className="approve_btn" onClick={assignSchemeToProject}>
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
                                    <div className='col-lg-4 col-12 admin_inputcontainer'>
                                        <span className="adminscheme_font">Scheme Name <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className="admin_inputcontainer">
                                            {/* <Select
                                                id="userType"
                                                placeholder="Select Scheme Type"
                                                value={selectedSchemeType}
                                                options={schemeType}
                                                onChange={(selectedOption) => {
                                                    handleSelectedScheme(selectedOption);
                                                }}
                                            /> */}
                                            <input
                                                type="text"
                                                id="schemeType"
                                                name="schemeType"
                                                readOnly
                                                disabled
                                                className='inputscheme'
                                                value={selectedRowData?.bondName || ''}
                                                placeholder="Project Name"
                                            />

                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12 admin_inputcontainer'>
                                        <span className="adminscheme_font">Project Name <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12'>
                                        <div className="admin_inputcontainer">
                                            <input
                                                type="text"
                                                id="ProjectType"
                                                name="ProjecName"
                                                value={projectName}
                                                className='inputscheme'
                                                placeholder="Project Name"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-12 admin_inputcontainer' style={{ marginTop: "0px" }}>
                                        <span className="adminscheme_font">Active <span className="required">*</span></span>
                                    </div>
                                    <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                        <div className="admin_inputcontainer">
                                            <input
                                                type="checkbox"
                                                id="Description"
                                                name="Description"
                                                placeholder="Description"
                                                disabled
                                                checked={selectedRowData?.active || ''}
                                            // onChange={(e) => {
                                            //     setName(e.target.value)
                                            //     onChangeValidation(e, 'name')
                                            // }}
                                            />
                                        </div>
                                    </div>
                                </div>
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

export default ViewProjectMaster;