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
import { CiSearch } from "react-icons/ci";
import { BiWindowOpen } from "react-icons/bi";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from 'react-icons/ai';
import DatePicker from "react-datepicker";
import moment from "moment";

const ProjectMaster = (props) => {

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

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const minDate = new Date(process.env.REACT_APP_PAYMENT_DATE);

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
            getMyDocuments();
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])

    const navigate = useNavigate();

    const ViewProject = (id) => {
        navigate("/ViewProjectMaster", { state: { id: id } });
    }
    const columns = [
        {
            title: 'S.No',
            field: 'index',
            render: (rowData) => rowData.tableData.index + 1
        },

        {
            title: 'Projects',
            field: 'clientName'
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
                    {/* <button className="btn btn-primary" onClick={() => seteditModalOpen(true)}>
                        Edit
                    </button> */}
                    <button className="btn btn-primary" onClick={() => ViewProject(rowData.id)}>
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
    const getMyDocuments = () => {
        const method = 'POST';
        const url = `/client/all`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                setDatalist(response.data);
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
        //             return { ...e, startDate: "Please Select Start Date" }
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
            const specialCharRegex = /[^a-zA-Z0-9\s]/;
            if (value === "") {
                setFormErrors((e) => {
                    return { ...e, projectname: "Please Enter Project Name" }
                });
            } else if (specialCharRegex.test(value)) {
                setFormErrors((e) => {
                    return { ...e, projectname: "Project Name should not contain special characters" }
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

    const handleCloseModal = () => {
        setModalOpen(false);
        setStartDate("");
        setEndDate("");
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
                                <span>Projects</span>
                                <button type="button" className="gpbtn" onClick={() => setModalOpen(true)}>
                                    <span className="gpbtn_txt" >Create Project</span>
                                </button>
                            </div>

                            <div className="d-block d-lg-none mt-3">
                                <div className='input_contanier'>
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
                                        <span className='modal_head_txt'>Create Project</span>
                                        <AiOutlineClose className="moda_closel_icon" onClick={handleCloseModal} />
                                    </div>
                                </Modal.Header>
                                <Modal.Body >
                                    <form onSubmit={handleRegisterValidation}>
                                        <div className="col-12 row" style={{ padding: "10px" }}>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <span className="adminscheme_font">Project Name <span className="required">*</span></span>
                                            </div>
                                            <div className='col-lg-8 col-12 '>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="text"
                                                        id="projectname"
                                                        name="projectname"
                                                        className='inputscheme'
                                                        placeholder="Project Name"
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            // Regular expression to allow alphabets, numbers, and spaces
                                                            setProjectName(inputValue)
                                                            onChangeValidation(e, 'projectname');
                                                        }}
                                                        onKeyPress={(e) => {
                                                            const char = String.fromCharCode(e.charCode || e.keyCode);
                                                            // Allow only letters (a-z, A-Z), numbers (0-9), and space
                                                            if (!/[a-zA-Z0-9 ]/.test(char)) {
                                                                e.preventDefault();  // Prevent special characters
                                                            }
                                                        }}
                                                        onBlur={() => focusOutValidation("projectname")}
                                                    />

                                                    {formErrors.projectname && <div className="field_form_alert">
                                                        <span>{formErrors.projectname}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <span className="adminscheme_font">Duration (Years) <span className="required">*</span></span>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="tel"
                                                        id="durationyears"
                                                        name="durationyears"
                                                        className='inputscheme'
                                                        maxLength={3}
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
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <span className="adminscheme_font">Start Date <span className="required">*</span></span>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    {/* <input
                                                        type="date"
                                                        id="startDate"
                                                        name="startDate"
                                                        className='inputscheme'
                                                        placeholder="Start date"
                                                        min="2024-01-01"
                                                        onKeyDown={(e) => e.preventDefault()}
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
                                                        className='input_box'
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
                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <span className="adminscheme_font">End Date <span className="required">*</span></span>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    {/* <input
                                                        type="date"
                                                        id="endDate"
                                                        name="endDate"
                                                        className='inputscheme'
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

                                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                                <span className="adminscheme_font">Description</span>
                                            </div>
                                            <div className='col-lg-8 col-12'>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="text"
                                                        id="description"
                                                        name="description"
                                                        maxLength={50}
                                                        className='inputscheme'
                                                        placeholder="Description"
                                                        onChange={(e) => {
                                                            setDescription(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 col-12 admin_inputcontainer' style={{ marginTop: "30px" }}>
                                                <span className="adminscheme_font">Active</span>
                                            </div>
                                            <div className='col-lg-8 col-12' style={{ marginTop: "30px" }}>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="checkbox"
                                                        id="activeflg"
                                                        name="active"
                                                        placeholder="active"
                                                        onChange={(e) => {
                                                            setActiveflag(e.target.checked)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                                                <div className="col-4 col-lg-4">
                                                    <button type="submit" className="approve_btn" >
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

export default ProjectMaster;