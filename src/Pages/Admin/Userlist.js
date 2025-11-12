import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../components/Header';
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from '../components/AppProvider';
import { BsPlus } from "react-icons/bs";
import Select from 'react-select';
import axios from 'axios';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import "./Userlist.css";
import Alert from '../components/Alert';
import { ThreeDots } from 'react-loader-spinner';
import MaterialTable from '@material-table/core';
import TableOptions from '../components/TableOptions';

const Userlist = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [userid] = useState(localStorage.getItem("user_id"));
    const [token] = useState(localStorage.getItem("token"));

    const [filterNum, setFilterNum] = useState(1);
    const [tableQuery, setTableQuery] = useState({ page: 0, pageSize: 5 });
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const tableRef = useRef(null);

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAlertTittle] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const filterOptions = [
        { value: 1, label: 'Active' },
        { value: 2, label: 'Inactive' },
        { value: 3, label: 'Disabled' }
    ];

    useEffect(() => {
        Aos.init({
            duration: 3000,
            once: true,
        });
    }, []);

    // useEffect(() => {
    //     const loadInitialData = async () => {
    //         setLoading(true);
    //         const initialData = await fetchTableData({ page: 0, pageSize: 5 }, filterNum);
    //         setTableData(initialData);
    //         setTableQuery({ page: 1, pageSize: 5 });
    //         setLoading(false);
    //     };

    //     loadInitialData();
    // }, [filterNum]);

    // useEffect(() => {
    //     const loadInitialData = async () => {
    //         setLoading(true);
    //         const initialData = await fetchTableData({ page: 0, pageSize: 5 }, filterNum);

    //         setTableData(initialData.items);
    //         // setTotalElements(initialData.totalElements);
    //         setTableQuery({ page: 1, pageSize: 5 });
    //         setLoading(false);
    //     };

    //     loadInitialData();
    // }, [filterNum]);

    const handleFilterChange = (selectedOption) => {
        setFilterNum(selectedOption.value);
        // setTableQuery({ page: 0, pageSize: 5 });
        // setTableData([]);
        // setHasMore(true);
        tableRef.current.onQueryChange();
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const navigate = useNavigate();

    const handleAddUser = () => {
        navigate('/AdminCreateuser');
    };

    const handleViewUser = (id) => {
        navigate('/ViewUserByadmin', { state: { id: id } });
    };

    const sentPassword = (id) => {
        const method = 'POST';
        const url = `/user/admin/sendPwd?id=${id}&loginId=${userid}`;
        const data = {};
        PostApi(method, url, data, headers)
            .then((response) => {
                if (response.data.status === 200) {
                    setUserAlert(true);
                    setAlertTittle("");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => {
                        setUserAlert(false)
                        window.location.reload();
                    });
                    setAlertType("info");
                }
                else if (response.data.status === 409) {
                    setUserAlert(true);
                    setAlertTittle("");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => {
                        setUserAlert(false)
                        window.location.reload();
                    });
                    setAlertType("info");
                }
            })
            .catch((error) => {
                console.log("Error sending password:", error);
            });
    };

    const fetchTableData = (query, filterNumber) => {
        return new Promise(async (resolve, reject) => {
            const method = 'POST';
            const url = `/user/admin/all?filter=${filterNumber}&pageNo=${query.page}&pageSize=${query.pageSize}`;
            const data = null;
            try {
                const response = await PostApi(method, url, data, headers);
                if (response.data.status === 200) {
                    resolve({
                        data: response.data.data,
                        page: response.data.pageNo,
                        totalCount: response.data.totalElements,
                    });
                } else {
                    resolve({
                        data: [],
                        page: response.data.pageNo,
                        totalCount: 0,
                    });
                }
            } catch (error) {
                console.log("Error fetching table data:", error);
                resolve({
                    data: [],
                    page: query.page,
                    totalCount: 0,
                });
            }
        });
    };

    const loadMoreData = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setTimeout(async () => {
            const data = await fetchTableData(tableQuery, filterNum);
            setTableData(prevData => [...prevData, ...data]);
            setLoading(false);
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setTableQuery(prevQuery => ({ ...prevQuery, page: prevQuery.page + 1 }));
            }
        }, 1000);
    };

    const columns = [
        { title: 'Name', field: 'firstName' },
        {
            title: 'Email Address',
            field: 'emailId',
            render: rowData => rowData.emailId.length > 12 ? `${rowData.emailId.slice(0, 15)}...` : rowData.emailId
        },
        {
            title: 'KYC Status',
            field: 'kycVerified',
            render: rowData => (
                <span style={{ color: rowData.kycVerified ? 'green' : 'red' }}>
                    {rowData.kycVerified ? 'Verified' : 'Not Verified'}
                </span>
            )
        },
        {
            title: 'Status',
            field: 'active',
            render: rowData => (
                <span style={{ color: rowData.active ? 'green' : 'red' }}>
                    {rowData.active ? 'Active' : 'In-Active'}
                </span>
            )
        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button type="button" className="btn btn-primary" onClick={() => handleViewUser(rowData.id)}>
                    View
                </button>
            )
        },
        {
            title: 'Send Password',
            field: 'sendPassword',
            render: rowData => (
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => sentPassword(rowData.id)}
                    disabled={!rowData.blocked}
                >
                    Send
                </button>
            )
        }
    ];

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div className="welcome_text">
                                <span>Golden Planet Users</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <button type="button" className="createbutton" style={{ marginTop: "20px" }} onClick={handleAddUser}>
                                    <span className="createbutton__text" >Add Users</span>
                                    <span className="createbutton__icon">
                                        <BsPlus className="icon" />
                                    </span>
                                </button>

                                <Select
                                    options={filterOptions}
                                    value={filterOptions.find(option => option.value === filterNum)}
                                    onChange={handleFilterChange}
                                    placeholder="Select Approval Status"
                                />
                            </div>
                            <div style={{ marginTop: "20px" }}>

                                {/* <InfiniteScroll
                                    dataLength={tableData.length}
                                    next={loadMoreData}
                                    hasMore={hasMore}
                                    loader={<ThreeDots strokeColor="#659DBD" animationDuration="0.50" visible={loading} />}
                                    endMessage={
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", marginTop: "2%" }}><p>No records to display</p></div>}
                                    scrollThreshold={0.9}
                                >
                                    <div className="admin-card" data-aos="zoom-in" >
                                        <div className="row">
                                            <div className="col-md-1 inverscontainer">
                                                <label className="projectlable">Name</label>
                                            </div>
                                            <div className="col-md-2 inverscontainer">
                                                <label className="projectlable">Email Address</label>
                                            </div>

                                            <div className="col-md-2 inverscontainer">
                                                <label className="projectlable">KYC Status</label>
                                            </div>
                                            <div className="col-md-2 inverscontainer">
                                                <label className="projectlable">Status</label>
                                            </div>
                                            <div className="col-md-2 inverscontainer" >
                                                <label className="projectlable" >Action</label>
                                            </div>
                                            <div className="col-md-2 inverscontainer" >
                                                <label className="projectlable" >Send Password</label>
                                            </div>
                                        </div>
                                    </div>
                                    {tableData.map((item, index) => (
                                        <div className="admin-card" data-aos="zoom-in" key={index}>

                                            <div className="row">
                                                <div className="col-md-1 inverscontainer">
                                                    <text className='admintabletxt'>{item.firstName}</text>
                                                </div>
                                                <div className="col-md-2 inverscontainer">
                                                    <text className='admintabletxt'>     {item.emailId.length > 12 ? `${item.emailId.slice(0, 15)}...` : item.emailId}</text>
                                                </div>
                                                <div className="col-md-2 inverscontainer">
                                                    <text className='admintabletxt' style={{ color: item.kycVerified ? 'green' : 'red' }}>{item.kycVerified ? 'Verified' : 'Not Verified'}</text>
                                                </div>
                                                <div className="col-md-2 inverscontainer">
                                                    <text className='admintabletxt' style={{ color: item.active ? 'green' : 'red' }}> {item.active ? 'Active' : 'In-Active'}
                                                    </text>
                                                </div>
                                                <div className="col-md-2 inverscontainer">
                                                    <button type='button' className="btn btn-primary" onClick={() => handleViewUser(item.id)}>View</button>
                                                </div>
                                                <div className="col-md-2 inverscontainer">
                                                    <button
                                                        type='button'
                                                        className="btn btn-primary"
                                                        onClick={() => sentPassword(item.id)}
                                                        disabled={!item.blocked}
                                                    >
                                                        Send
                                                    </button>

                                                </div>

                                            </div>


                                        </div>
                                    ))}
                                </InfiniteScroll> */}

                                <MaterialTable
                                    style={{ marginTop: "20px" }}
                                    title=""
                                    columns={columns}
                                    tableRef={tableRef}
                                    data={(query) => fetchTableData(query, filterNum)}
                                    options={{
                                        ...TableOptions(),
                                        search: false,
                                        toolbar: false,
                                    }}
                                    onQueryChange={(query) => {
                                        setTableQuery(query);
                                        fetchTableData(query, filterNum);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Alert
                    title={alertTittle}
                    msg={alertMsg}
                    open={userAlert}
                    type={alertType}
                    onClose={alertClose}
                />
            </div>
        </div>
    );
};

export default Userlist;