import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import '../Register.css';
import { useAppContext } from '../components/AppProvider';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import Alert from "../components/Alert";
import moment from "moment/moment";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { RotatingLines } from 'react-loader-spinner';
import DatePicker from "react-datepicker";

const ViewDividendFinance = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("user_id"));

    const [historyData, setHistoryData] = useState([]);
    const [applicationhistoryData, setApplicationhistoryData] = useState([]);

    const [interestData, setInterestData] = useState([]);

    const [amount, setAmount] = useState("");
    const [dividedDate, setDividendDate] = useState("");
    const [dividedToDate, setdividedToDate] = useState("");
    const [tdsPercentage, setTdsPercentage] = useState("");
    const [dividendPercentage, setdividendPercentage] = useState("");
    const [message, setMessage] = useState("");

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const [activeTab, setActiveTab] = useState(1);
    const [showApplicationTable, setShowApplicationTable] = useState(false);
    const [applicationFilterDate, setApplicationFilterDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const location = useLocation();
    const state = location.state.item
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [showAlert, setShowAlert] = useState(false);
    const [showDivided, setShowDivided] = useState(false)

    const [datalist, setDatalist] = useState([]);
    const navigate = useNavigate();

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    const minDate = formatDate(new Date(process.env.REACT_APP_PAYMENT_DATE));
    const maxDate = formatDate(new Date());

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        searchschemes();
        getInterest();
    }, []);


    const getInterest = () => {
        const method = 'POST';
        const url = `/dividend/getInterestDetails?id=${state.id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "interest");
                setInterestData(response.data.data);
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    };
    const searchschemes = () => {
        const method = 'POST';
        const url = `/dividend/getByClient?id=${state.id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "schemas");
                if (response.data.status === 409 || response.data.status === 200) {
                    setHistoryData(response.data.data)
                }
                else {
                    setShowDivided(false);
                }
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    };
    const saveDivided = (item) => {
        // Validate dividendDate
        if (!dividedDate) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg('Dividend Date is required.');
            setAlertClose(() => () => setUserAlert(false));
            return;
        }
        if (!dividedToDate) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg('Dividend ToDate is required.');
            setAlertClose(() => () => setUserAlert(false));
            return;
        }
        if (!dividendPercentage) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg('TDS Percentage is required.');
            setAlertClose(() => () => setUserAlert(false));
            return;
        }

        // Validate message
        if (!message) {
            setUserAlert(true);
            setAlertType("error");
            setAlertMsg('Message is required.');
            setAlertClose(() => () => setUserAlert(false));
            return;
        }
        // const selectedDate = new Date(dividedDate);
        // const isMarch31 = selectedDate.getMonth() === 2 && selectedDate.getDate() === 31;
        // const isSep30 = selectedDate.getMonth() === 8 && selectedDate.getDate() === 30;

        // if (!isMarch31 && !isSep30) {
        //     setUserAlert(true);
        //     setAlertType("error");
        //     setAlertMsg('Please select either March 31st or September 30th.');
        //     setAlertClose(() => () => setUserAlert(false));
        //     return;
        // }
        // Data preparation
        const url = `/dividend/save`;
        const data = {
            clientBondDetails: {
                id: state.id
            },
            dividendFromDate: dividedDate,
            dividendToDate: dividedToDate,
            dividendPercentage: dividendPercentage,
            // tdsPercentage:tdsPercentage,
            // amount: parseFloat(amount),
            declaration: message,
            createdBy: userid
        };

        // API call
        PostApi('POST', url, data, headers)
            .then((response) => {
                console.log(response, "save console");
                if (response.data.status === 200) {
                    setUserAlert(true);
                    setAlertType("success");
                    setAlertMsg('Dividend added successfully');
                    setAlertClose(() => () => {
                        setUserAlert(false);
                        window.location.reload();
                    });


                } else if (response.data.status === 409) {
                    setUserAlert(true);
                    setAlertType("error");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => setUserAlert(false));
                }
            })
            .catch((error) => {
                console.error("Error saving dividend:", error);
                setUserAlert(true);
                setAlertType("error");
                setAlertMsg('An error occurred while saving the dividend.');
                setAlertClose(() => () => setUserAlert(false));
            });
    };
    const searchApplicantion = (rowId) => {
        const data = {}
        const url = "/dividend/getCalculationByDate?id=" + rowId.id
        PostApi('POST', url, data, headers)
            .then((response) => {
                console.log(response, "Filter application")
                if (response.data.status === 200) {
                    setShowApplicationTable(true)
                    setApplicationhistoryData(response.data.data)
                } else {
                    setShowApplicationTable(false)
                    setUserAlert(true);
                    setAlertType("error");
                    setAlertMsg(response.data.message);
                    setAlertClose(() => () => setUserAlert(false));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const DocumentDownload = (rowId) => {
        setLoading(true);
        const axiosConfig = {
            responseType: 'blob', // Adjusted for Excel files
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Authorization: `Bearer ${token}`
            }
        };
        axios.post(`${baseUrl}/dividend/report?id=${rowId}`, null, axiosConfig)
            .then((response) => {
                if (!response.data || response.data.size === 0) { // Adjusted check for blob size
                    setShowAlert(true);
                    setAlertMessage("Excel file is not available. Please contact the finance team.");
                    return;
                }

                // Create a Blob object from the response data
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a URL for the Blob object
                const url = window.URL.createObjectURL(blob);

                // Create a link element and set its href to the Blob URL
                const link = document.createElement('a');
                link.href = url;

                // Set the download attribute to specify the filename
                link.setAttribute('download', 'Golden_Planet_Report.xlsx'); // Changed filename to .xlsx

                // Append the link to the body
                document.body.appendChild(link);

                // Programmatically click the link to trigger the download
                link.click();

                // Remove the link from the body
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching Excel file:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // const DocumentDownload = (rowId) => {
    //     setLoading(true);
    //     const axiosConfig = {
    //         responseType: 'arraybuffer',
    //         headers: {
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // };

    const handleBack = () => {
        navigate('/Dividend');
    };
    const columns = [
        {
            title: 'Schemes',
            field: 'schemes',
            render: rowData => (
                <span>{state.bondDescription}</span>
            )
        },

        {
            title: 'Dividend From Date',
            field: 'dividendFromDate',
            render: rowData => (
                <text>{moment(rowData.dividendFromDate).format("DD-MM-YYYY")}</text>
            )
        },
        {
            title: 'Dividend To Date',
            field: 'dividendToDate',
            render: rowData => (
                <text>{moment(rowData.dividendToDate).format("DD-MM-YYYY")}</text>
            )
        },
        {
            title: 'Dividend Percentage',
            field: 'dividendPercentage',
        },
        // {
        //     title: 'TDS Percentage',
        //     field: 'tdsPercentage',
        // },

        // {
        //     title: 'Amount',
        //     field: 'amount',
        //     render: rowData => (
        //         <span>{state.amount}</span>
        //     )
        // },
        {
            title: 'Description',
            field: 'declaration',
            render: rowData => {
                const description = rowData.declaration;
                const formattedDescription = description.length > 50
                    ? description.match(/.{1,50}/g).join('<br />')
                    : description;
                return <span dangerouslySetInnerHTML={{ __html: formattedDescription }} />;
            }
        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button type="button" className="btn btn-primary"
                    onClick={() => {
                        searchApplicantion(rowData);;
                        console.log(rowData.id, "page");
                    }} >
                    View
                </button >
            ),
            cellStyle: {
                textAlign: 'center'
            },
            headerStyle: {
                textAlign: 'center'
            },
            sorting: false,
        },
        {
            title: 'Download',
            field: 'action',
            render: rowData => (
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => DocumentDownload(rowData.id)}
                >
                    Download
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
    const applicationData = [
        {
            title: 'Form Number',
            field: 'userBondDetails.formNo',
        },
        {
            title: 'User Type',
            field: 'userBondDetails.userType',

        },
        {
            title: 'From Date',
            // field: 'fromdate',
            render: rowData => (
                <text>{moment(rowData.fromdate).format("DD-MM-YYYY")}</text>
            )

        },
        {
            title: 'To Date',
            // field: 'toDate',
            render: rowData => (
                <text>{moment(rowData.toDate).format("DD-MM-YYYY")}</text>
            )

        },
        {
            title: 'Dividend Amount',
            field: 'dividendAmount'
        },

        {
            title: 'TDS Deducted',
            field: 'tdsDeducted'
        },
        {
            title: 'TDS Percentage',
            field: 'tdsPercentage'
        },
        {
            title: 'Days',
            field: 'days',
        },
        {
            title: 'Alloted Amount',
            field: 'allotedAmount',
        },
        {
            title: 'Total Amount',
            field: 'totalAmountToPay',

        }
    ];
    const Interest = [
        // {
        //     title: 'User',
        //     field: 'userBondDetails.name',
        //     // render: rowData => (
        //     //     <span>{state.bondDescription}</span>
        //     // )
        // },

        {
            title: 'Application Form No',
            field: 'userBondDetails.formNo',

        },
        {
            title: 'Date of Received',
            render: rowData => (
                <text>{moment(rowData.userBondDetails.paymentDate).format("DD-MM-YYYY")}</text>
            )
        },
        {
            title: 'Date of allotted',
            render: rowData => (
                <text>{moment(rowData.shareAllocation.dateOfAllotment).format("DD-MM-YYYY")}</text>
            )
        },
        {
            title: 'Amount Received',
            field: 'receivedAmount'
        },
        {
            title: 'Allotted Amount',
            field: 'allotedAmount'
        },

        {
            title: 'Refund Amount',
            field: 'refundAmount'
        },
        {
            title: 'TDS Deducted',
            field: 'tdsDeducted'
        },
        {
            title: 'Interest Percentage',
            field: 'interestPercentage'
        },
        {
            title: 'Interest Amount',
            field: 'interestAmount'
        },
        {
            title: "Total Amount To Pay",
            field: 'totalAmountToPay'
        }

    ];

    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
        if (tabIndex != 1) {
            setAmount('');
            setMessage('')
            setDividendDate('')
        }
        if (tabIndex != 2) {
            setApplicationFilterDate('')
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setAmount(value);
    };

    const handleKeyDown = (e) => {
        const key = e.key;
        // Allow only numbers and control keys
        if (!/[0-9]/.test(key) && key !== 'Backspace' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== '.') {
            e.preventDefault();
        }
    };

    const handleFromDateChange = (e) => {
        setDividendDate(moment(e).format('YYYY-MM-DD'));
    };

    const handleToDateChange = (e) => {
        setdividedToDate(moment(e).format('YYYY-MM-DD'));
    };

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content " : "main_content collapsed "}>
                    <div className="Summary_card">
                        <div className="Dividend_header">
                            <span> Project : {state.clientId.clientName}</span>
                            <span> Schemes : {state.bondDescription}</span>

                        </div>
                        <div style={{ paddingTop: "20px" }}>
                            <div className="salesforce-tabs" >
                                <button className={activeTab === 1 ? "active" : ""} onClick={() => handleTabChange(1)}>
                                    <span>Interest </span>
                                </button>
                                <button className={activeTab === 3 ? "active" : ""} onClick={() => handleTabChange(3)}>
                                    <span>Dividend Details</span>
                                </button>
                                {/* <button className={activeTab === 2 ? "active" : ""} onClick={() => handleTabChange(2)}>
                                    <span>Dividend Application details</span>
                                </button> */}

                            </div>
                        </div>

                        {activeTab === 3 && (
                            <div className="divided_spc">
                                {/* <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "5px" }}>
                                    <div className="welcome_text">
                                        <span>Dividend</span>
                                    </div>
                                </div> */}
                                {/* --- inves card */}
                                <div className='inves_card'>
                                    <div>
                                        <div className="row inves_div">
                                            <div className="col-2">
                                                <label className="projectlable">Preference Shares</label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-1">
                                                <label className="projectlables"></label>
                                            </div>
                                            <div className="col-6">
                                                <label className="projectlables">{state.bondDescription} </label>
                                            </div>
                                        </div>
                                        <div className="row inves_div">
                                            <div className="col-2">
                                                <label className="projectlable">From Date  <span className="required">*</span></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-1">
                                                <label className="projectlables"></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-6">
                                                {/* <input
                                                    id="Dividenddate"
                                                    type="date"
                                                    className="form-control"
                                                    onChange={handleFromDateChange}
                                                /> */}
                                                <DatePicker
                                                    showIcon
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    selected={dividedDate ? new Date(dividedDate) : null}
                                                    onChange={handleFromDateChange}
                                                    className='form-control'
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                                                    maxDate={new Date()}
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    shouldCloseOnSelect={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="row inves_div">
                                            <div className="col-2">
                                                <label className="projectlable">To Date  <span className="required">*</span></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-1">
                                                <label className="projectlables"></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-6">
                                                {/* <input
                                                    id="Dividenddate"
                                                    type="date"
                                                    className="form-control"
                                                    onChange={handleToDateChange}
                                                    min={dividedDate}
                                                /> */}
                                                <DatePicker
                                                    showIcon
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    selected={dividedToDate ? new Date(dividedToDate) : null}
                                                    onChange={handleToDateChange}
                                                    className='form-control'
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    minDate={new Date(dividedDate)}
                                                    maxDate={new Date()}
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    shouldCloseOnSelect={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="row inves_div">
                                            <div className="col-2">
                                                <label className="projectlable">Dividend Percentage  <span className="required">*</span></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-1">
                                                <label className="projectlables"></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-6">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="dividendPercentage"
                                                        value={dividendPercentage}

                                                        onKeyDown={handleKeyDown}
                                                        onChange={(e) => setdividendPercentage(e.target.value)}
                                                    />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text">%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="row inves_div">
                                            <div className="col-2">
                                                <label className="projectlable">TDS Percentage  <span className="required">*</span></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-1">
                                                <label className="projectlables"></label>
                                            </div>
                                                        />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">%</span>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div> */}
                                        {/* <div className="row inves_div">
                                            <div className="col-2">
                                                <label className="projectlable">Amount  <span className="required">*</span></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-1">
                                                <label className="projectlables"></label>
                                            </div>
                                                        />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">?</span>
                                                        </div>
                                                    </div>
                                            </div>
                                        </div> */}
                                        <div className="row inves_div">
                                            <div className="col-2">
                                                <label className="projectlable">Message  <span className="required">*</span></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-1">
                                                <label className="projectlables"></label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-6">
                                                <textarea
                                                    type="text"
                                                    id="msg"
                                                    name="description"
                                                    className='inputtextarea'
                                                    rows={2}
                                                    maxLength={100}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: '10px' }}>
                                        <div className="col-4 col-md-4 col-lg-2">
                                            <button style={{ width: "100%" }} type="button" className="btn btn-primary" onClick={saveDivided}>Submit</button>
                                        </div>

                                        <div className="col-4 col-md-4 col-lg-2">
                                            <button style={{ width: "100%" }} type="button" className="btn btn-primary" onClick={handleBack}>Back</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: "20px" }}>
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={columns}
                                        data={historyData}
                                        options={TableOptions()}
                                    />
                                </div>


                                {showApplicationTable && (
                                    <div style={{ marginTop: "30px" }}>

                                        <MaterialTable
                                            style={{ width: "100%" }}
                                            title="Users Dividend Details"
                                            columns={applicationData}
                                            data={applicationhistoryData}
                                            options={TableOptions()}
                                        />

                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 2 && (
                            <>
                                {/* <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "5px" }}>
                                    <div className="welcome_text">
                                        <span>Dividend</span>
                                    </div>
                                </div> */}

                            </>
                        )}
                        {activeTab === 1 && (
                            <>
                                <div>
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={Interest}
                                        data={interestData}
                                        options={TableOptions()}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <Alert
                        msg={alertMsg}
                        open={userAlert}
                        type={alertType}
                        onClose={alertClose}
                    />
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
        </div>
    );
};
export default ViewDividendFinance;
