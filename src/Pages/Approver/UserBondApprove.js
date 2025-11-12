import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../components/AppProvider';
import MaterialTable from '@material-table/core';
import Select from 'react-select';
import TableOptions from '../components/TableOptions';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { CiFileOn } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

const UserBondApprove = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [datalist, setDatalist] = useState([]);
    const [token] = useState(localStorage.getItem("token"));
    const [approvalStatus, setApprovalStatus] = useState({});
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const [schemeList, setSchemeList] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState()

    useEffect(() => {
        getFilterList()
    }, []);

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleSchemeSelect = (item) => {
        setSelectedScheme(item)
        getUserDetails(item, approvalStatus)
    }

    const getUserDetails = (selectedScheme, status) => {
        const method = 'POST';
        const url = "/userbond/forAppVerify?id=" + selectedScheme.value + "&status=" + status.value;
        const data = {}
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "klkkl")
                if (response.data.data) {
                    setDatalist(response.data.data);
                }
                else {
                    setDatalist([])
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getFilterList = () => {
        const method = 'POST';
        const url = "/client/all";
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                const list = response.data.map(item => ({
                    value: item.id,
                    label: item.clientName
                }));
                setSchemeList(list)
                setSelectedScheme(list[0])
                setApprovalStatus({ value: 2, label: 'Approval Pending' })
                getUserDetails(list[0], { value: 2, label: 'Approval Pending' })
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const handleView = (id) => {
        navigate('/ViewBonddata', { state: { id: id } });
    };

    const handleApprovalChange = (selectedOption) => {
        setApprovalStatus(selectedOption);
        getUserDetails(selectedScheme, selectedOption)
    };

    const approvalOptions = [      
        { value: 2, label: 'Approval Pending' },
        { value: 1, label: 'Approved' },
        { value: 3, label: 'Rejected' }
    ];

    const columns = [
        {
            title: 'Form Number',
            field: 'formNo'
        },
        {
            title: 'User Name',
            field: 'name'
        },
        {
            title: 'Project',
            field: 'clientDetails.clientName'
        },
        {
            title: 'User Type',
            field: 'userType'
        },
        {
            title: 'Investor Type',
            field: 'investorType.investorType'
        },
        {
            title: 'Shares Details',
            field: 'clientBondDetails.bondName'
        },
        {
            title: 'Submitted Date',
            field: 'createdDate',
            render: rowData => {
                const date = new Date(rowData.createdDate);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
                return formattedDate;
            }
        },
        {
            title: 'Action',
            field: 'createdDate',
            render: rowData => (
                <button type='button' className="btn btn-primary" onClick={() => handleView(rowData.id)}>View</button>
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

    const filteredData = datalist.filter(item =>
        item.formNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.paymentStatus.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.investorType.investorType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>

                    <div className="Summary_card">
                        <div className="welcome_text" >
                            <span>Investors Details</span>
                        </div>
                        <div style={{ paddingTop: '20px', display: "flex", gap: "20px" }}>
                            <Select
                                options={schemeList}
                                value={selectedScheme}
                                onChange={handleSchemeSelect}
                                placeholder="Select Scheme"
                            />
                            <Select
                                options={approvalOptions}
                                value={approvalStatus}
                                onChange={handleApprovalChange}
                                placeholder="Select Approval Status"
                            />
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
                        <div style={{ paddingTop: '20px' }} className="d-none d-lg-block">
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
                                                className="p-3" style={{
                                                    borderRadius: '10px',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    backgroundColor: '#fff',
                                                    marginBottom: '5%',
                                                }}
                                            >
                                                <div style={{ borderTop: '5px solid #274568', borderRadius: '10px 10px 0 0' }} />
                                                <div className="p-3">
                                                    <p className="text-uppercase mb-2" style={{ fontSize: '12px', color: '#999' }} >
                                                        {item.name}
                                                    </p>
                                                    <p className="text-uppercase mb-2" style={{ fontSize: '12px', color: '#999' }} >
                                                        {item.clientBondDetails.bondDescription}
                                                    </p>
                                                    <p className="text-uppercase mb-2" style={{ fontSize: '12px', color: '#C100C1' }} >
                                                        {item.userType}
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
                                                            <span style={{ color: item.paymentStatus.paymentStatus === 'SUCCESS' ? 'green' : 'orange' }}>
                                                                {item.paymentStatus.paymentStatus}
                                                            </span>
                                                        </p>

                                                    </div>

                                                    <Row className="align-items-center">
                                                        <Col xs="auto">
                                                            <CiFileOn style={{ marginRight: '5px', marginBottom: '2px' }} />
                                                            <span
                                                                onClick={() => handleView(item.id)}
                                                                style={{
                                                                    color: '#007bff',
                                                                    textDecoration: 'underline',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                View
                                                            </span>

                                                        </Col>
                                                    </Row>
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
        </div>
    );
}

export default UserBondApprove;
