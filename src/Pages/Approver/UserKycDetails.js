import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../components/AppProvider';
import MaterialTable from '@material-table/core';
import Select from 'react-select';
import TableOptions from '../components/TableOptions';
import { CiSearch } from "react-icons/ci";
import { Container, Row, Col } from 'react-bootstrap';
import { CiFileOn } from "react-icons/ci";

const UserKycDetails = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [datalist, setDatalist] = useState([]);
    const [token] = useState(localStorage.getItem("token"));

    const [approvalStatus, setApprovalStatus] = useState({});

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getUserDetails(2);
        setApprovalStatus({ value: 2, label: 'Approval Pending' })
    }, []);

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const getUserDetails = (status) => {
        const method = 'POST';
        const url = `/user/getUsersForApprove?status=${status}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
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

    const navigate = useNavigate();
    const handleView = (id) => {
        navigate('/ViewKycdata', { state: { id: id } });
    };

    const columns = [
        {
            title: 'Customer ID',
            field: 'customerId'
        },
        {
            title: 'User Name',
            field: 'firstName'
        },
        {
            title: 'Email Address',
            field: 'emailId'
        },
        {
            title: 'KYC Status',
            field: 'kycVerified',
            render: rowData => (
                <span style={{ color: rowData.kycVerified ? 'green' : 'orange' }}>
                    {rowData.kycVerified ? 'Approved' : 'Pending'}
                </span>
            )
        },
        {
            title: 'User Type',
            field: 'userType.userType'
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

    const approvalOptions = [      
        { value: 2, label: 'Approval Pending' },
        { value: 1, label: 'Approved' },
        { value: 3, label: 'Rejected' }
    ];

    const handleApprovalChange = (selectedOption) => {
        setApprovalStatus(selectedOption);
        getUserDetails(selectedOption.value)
    };

    // const filteredData = datalist.filter(item =>
    //     item.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.userType.userType.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredData = datalist.filter(item => {
    const search = searchTerm?.toLowerCase() || "";

    return (
        (item.customerId?.toLowerCase() || "").includes(search) ||
        (item.firstName?.toLowerCase() || "").includes(search) ||
        (item.emailId?.toLowerCase() || "").includes(search) ||
        (item.userType?.userType?.toLowerCase() || "").includes(search)
    );
});
    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">

                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div className="welcome_text" >
                            <span>Investors KYC Details</span>
                        </div>
                        <div className='col-lg-3' style={{ paddingTop: '20px' }}>
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
                            <MaterialTable style={{ width: "100%" }}
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
                                                        {item.firstName}
                                                    </p>
                                                    <p className="text-uppercase mb-2" style={{ fontSize: '12px', color: '#999' }} >
                                                        {item.emailId}
                                                    </p>
                                                    <p className="text-uppercase mb-2" style={{ fontSize: '12px', color: '#C100C1' }} >
                                                        <p style={{ margin: "0" }}>{item.customerId}</p>
                                                    </p>
                                                    <h5 style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                                        {item.userType.userType}
                                                    </h5>
                                                    <div className="holding_mbl">
                                                        <p style={{ fontSize: '13px', margin: "0" }}>
                                                            KYC Status:{' '}
                                                            <span style={{ color: item.kycVerified === true ? 'green' : 'orange' }}>
                                                                {item.kycVerified ? 'Approved' : 'Pending'}
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

export default UserKycDetails;