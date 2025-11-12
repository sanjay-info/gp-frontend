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
import { Container, Row, Col } from 'react-bootstrap';

const UserProjectlist = (props) => {

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
        navigate("/VideoUrlPage", { state: { id: id } });
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
                <div>
                    <button className="btn btn-primary" onClick={() => ViewProject(rowData.id)}>
                        View
                    </button>
                </div>
            ),
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

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container ">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div>
                            <div className="welcome_text" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Project</span>
                                {/* <button type="button" className="gpbtn" onClick={() => setModalOpen(true)}>
                                    <span className="gpbtn_txt" >Create Project</span>
                                </button> */}
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
                            {/* Mobile View */}
                            <div className="mt-4 d-block d-lg-none">
                                {!datalist || (Array.isArray(datalist) && datalist.length === 0) || (typeof datalist === 'object' && !Array.isArray(datalist) && Object.keys(datalist).length === 0) ? (
                                    <p>No records to display</p>
                                ) : (
                                    (datalist || []).map((item) => {
                                        return (
                                            <Row key={item.id}>
                                                <Col xs={12} md={8} lg={12}>
                                                    <div
                                                        className="p-3"
                                                        style={{
                                                            borderRadius: '10px',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                            backgroundColor: '#fff',
                                                            marginBottom: '5%',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                borderTop: '5px solid #274568',
                                                                borderRadius: '10px 10px 0 0',
                                                            }}
                                                        />
                                                        <div className="p-3">
                                                            <p className="text-uppercase mb-2" style={{ fontSize: '12px', color: '#999' }}>
                                                                <span style={{ color: "black",fontWeight:"bold" }}> Project Name : </span> {item.clientName}
                                                            </p>
                                                            <p
                                                                className="text-uppercase mb-2"
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: item.active ? 'green' : 'red',
                                                                }}
                                                            >
                                                                <span style={{ color: "black",fontWeight:"bold" }}> Status : </span> {item.active ? "Active" : "Inactive"}
                                                            </p>

                                                            <div className="holding_mbl">
                                                                <label style={{ fontSize: '13px' }}>
                                                                    <span
                                                                        style={{
                                                                            marginLeft: '4px',
                                                                            color: "blue"
                                                                        }}
                                                                        onClick={() => ViewProject(item.id)}
                                                                    >
                                                                        View
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        );
                                    })
                                )}
                            </div>
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

export default UserProjectlist;