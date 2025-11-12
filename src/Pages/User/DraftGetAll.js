import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import MaterialTable from '@material-table/core';
import { useNavigate } from 'react-router-dom';
import Alert from "../components/Alert";
import axios from "axios";
import { RotatingLines } from 'react-loader-spinner';
import TableOptions from "../components/TableOptions";
import { Modal } from "react-bootstrap";
import { Container, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { CiFileOn } from "react-icons/ci";
import { CiReceipt } from "react-icons/ci";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";


const DraftGetAll = (props) => {

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

    const baseUrl = process.env.REACT_APP_BASE_URL;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
            getMyDraft();
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])

    const navigate = useNavigate();

    const handleView = (id) => {
        if (userType === "1") {
            navigate('/PreviewBondView', { state: { id: id } });
        } else {
            navigate('/UpdateNriociform', { state: { id: id } });
        }
    };

    const columns = [
        {
            title: 'Form Number',
            field: 'formNo'
        },
        {
            title: 'Name',
            field: 'name'
        },
        {
            title: 'Investor Type',
            field: 'investorType.investorType'
        },
        {
            title: 'Shares Details',
            field: 'clientBondDetails.bondName'
        },
        // {
        //     title: 'Form Status',
        //     field: 'paymentStatus',
        //     render: rowData => (
        //         <span style={{ color: rowData.paymentStatus && rowData.paymentStatus.paymentStatus === 'PENDING' ? 'orange' : (rowData.paymentStatus && rowData.paymentStatus.paymentStatus === 'SUCCESS' ? 'green' : 'red') }}>
        //             {rowData.paymentStatus ? rowData.paymentStatus.paymentStatus : 'N/A'}
        //         </span>
        //     )
        // },
        {
            title: 'View',
            render: rowData => (
                <button className="btn btn-primary" onClick={() => handleView(rowData.id)}>View</button>
            )
        },
    ];
    const getMyDraft = () => {
        const method = 'POST';
        const url = `/userbond/draft?id=${userid}`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                setDatalist(response.data);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }
    const filteredData = datalist.filter(item =>
        item.formNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.investorType.investorType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container ">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div>
                            <div className="welcome_text">
                                <span>Draft Investment Documents</span>
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
                            <div className="mt-4 d-block d-lg-none">
                                {filteredData.map((item) => {
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
                                                        <p
                                                            className="text-uppercase mb-2"
                                                            style={{ fontSize: '12px', color: '#999' }}
                                                        >
                                                            {item.clientBondDetails.bondDescription}
                                                        </p>
                                                        <h5 style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                                            {item.investorType.investorType}
                                                        </h5>
                                                        <div className="holding_mbl">
                                                            <p style={{ margin: "0" }}>{item.formNo}</p>
                                                        </div>
                                                        <div className="holding_mbl">
                                                            <p style={{ fontSize: '13px', margin: "0" }}>
                                                                Payment Status:{' '}
                                                                <span
                                                                    style={{
                                                                        color:
                                                                            item.paymentStatus &&
                                                                                item.paymentStatus.paymentStatus === 'PENDING'
                                                                                ? 'orange'
                                                                                : item.paymentStatus &&
                                                                                    item.paymentStatus.paymentStatus === 'SUCCESS'
                                                                                    ? 'green'
                                                                                    : 'red',
                                                                    }}
                                                                >
                                                                    {item.paymentStatus ? item.paymentStatus.paymentStatus : 'N/A'}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div className="holding_mbl">
                                                            <label style={{ fontSize: '13px' }}>
                                                                Update:
                                                                <span
                                                                    style={{
                                                                        marginLeft: '4px',
                                                                        color: "blue",
                                                                    }}
                                                                    onClick={ () => handleView(item.id)}
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
                                })}
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
                <div>
                    <Modal className='loader_modal' centered show={loading}>
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
        </div>
    );
};

export default DraftGetAll;