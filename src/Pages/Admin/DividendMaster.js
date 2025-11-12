import React, { useState, useEffect } from "react";
import { useAppContext } from "../components/AppProvider";
import Header from "../components/Header";
import { useSidebar } from "../components/SidebarContext";
import SidePanel from "../components/SidePanel";
import { useLocation } from "react-router-dom";
import MaterialTable from '@material-table/core';
import TableOptions from "../components/TableOptions";
import { CiSearch } from "react-icons/ci";
import Select from 'react-select';
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from 'react-icons/ai';
import moment from "moment";
import DatePicker from "react-datepicker";
import Alert from "../components/Alert";

const DividendMaster = () => {

    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const location = useLocation();
    const data = location.state.item

    const [token] = useState(localStorage.getItem("token"));

    const [activeTab, setActiveTab] = useState(1);

    const [index, setIndex] = useState(0)

    const [modalOpen, setModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [historySearchQuery, setHistorySearchQuery] = useState('');

    const minDate = new Date(process.env.REACT_APP_PAYMENT_DATE);
    const currentDate = new Date()

    const [formError, setFormError] = useState({})

    const [dividendYear, setDividendYear] = useState("");
    const [fixedDividendDate, setFixedDividendDate] = useState("");
    const [disbursedAmount, setDisbursedAmount] = useState("");
    const [actualDividendDate, setActualDividendDate] = useState("");
    const [dividendStatus, setDividendStatus] = useState();
    const [amountToPay, setAmountToPay] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dividendPeriodType, setDividendPeriodType] = useState("");
    const [noOfDividend, setNoOfDividend] = useState("");
    const [confirmFlag, setConfirmFlag] = useState(null);
    const [editFlag, setEditFlag] = useState(false);

    const [usdFlag, setUsdFlag] = useState(null);
    const [conversionRate, setConversionRate] = useState("");

    const [modeOfPayment, setModeofPayment] = useState("")
    const [modeOfPaymentList, setModeOfPaymentList] = useState([]);

    const [viewFlag, setViewFlag] = useState(false)

    const [userAlert, setUserAlert] = useState(false);
    const [userAlertMsg, setUserAlertMsg] = useState('');
    const [userAlertClose, setUserAlertClose] = useState(() => null);
    const [userAlertConfirm, setUserAlertConfirm] = useState(() => null);
    const [userAlertType, setUserAlertType] = useState('')

    const [dividendMasterId, setDividendMasterId] = useState("");

    const [dividendStatusList, setDividendStatusList] = useState([])

    const [masterDividendList, setMasterDividendList] = useState([]);
    const [historyListData, setHistoryListData] = useState([]);

    const [viewDividendData, setViewDividendData] = useState()

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
        if (tabIndex === 1) {
            getMasterDividendList(data.id)
        }
        if (tabIndex === 2) {
            getDividendHistory(dividendMasterId)
        }
    };

    useEffect(() => {
        console.log(data, "Item")
        getMasterDividendList(data.id)
        getDividendStatusList()
        getModeofPayment()
    }, [])


    const getModeofPayment = () => {
        const method = 'POST';
        const url = `/userbond/modeOfPayment`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                setModeOfPaymentList(response.data)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getMasterDividendList = (id) => {
        const method = 'POST';
        const url = `/dividend/getByClient?id=${id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response.data, "schemas");
                setMasterDividendList(response.data.data)
                setIndex(0)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getDividendHistory = (id) => {
        const data = {}
        const url = "/dividend/getCalculationByDate?id=" + id
        PostApi('POST', url, data, headers)
            .then((response) => {
                console.log(response, "Filter application")
                setIndex(2)
                setHistoryListData(response.data.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getDividendStatusList = () => {
        const method = 'POST';
        const url = `/dividend/status/all`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                const list = response.data.data.map(item => ({
                    value: item.id,
                    label: item.status
                }));
                setDividendStatusList(list)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const filteredMasterDividendData = Array.isArray(masterDividendList)
        ? masterDividendList.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : [];

    const filteredHistoryDividendData = Array.isArray(historyListData)
        ? historyListData.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(historySearchQuery.toLowerCase())
            )
        )
        : [];

    const dividendColumn = [
        {
            title: 'S.No',
            render: (rowData) => rowData.tableData.index + 1,
            width: "10px",
            sorting: false,
        },
        {
            title: 'Dividend Year',
            field: 'dividendYear'
        },
        {
            title: 'Fixed Dividend Date',
            field: 'fixedDividendDate'
        },
        {
            title: 'Dividend Period Type',
            field: 'periodTypes.periodType'
        },
        {
            title: 'Amount To Pay',
            field: 'amountToPay'
        },
        {
            title: 'Dividend Status',
            field: 'dividendStatus.status'
        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <div>
                    {rowData.dividendStatus.status === "YET TO PAY" ?
                        <button type="button" className="btn btn-primary"
                            onClick={() => {
                                openDividendModal(rowData);
                            }}
                        >
                            Add Disbursement
                        </button >
                        :
                        <button type="button" className="btn btn-primary"
                            onClick={() => getMasterDividendId(rowData)}
                        >
                            View
                        </button >
                    }
                </div>
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

    const historyColumn = [
        {
            title: 'S.No',
            field: 'index',
            render: (rowData) => rowData.tableData.index + 1,
            width: "10px",
            sorting: false,
        },
        {
            title: 'Application No',
            field: 'userBondDetails.formNo'
        },
        {
            title: 'Actual Dividend Date',
            field: 'payoutDate'
        },
        {
            title: 'Amount To Pay (₹)',
            field: 'totalAmountToPay',
            render: rowData => `₹ ${rowData.totalAmountToPay.toLocaleString('en-IN')}`
        },
        {
            title: 'Amount To Pay ($)',
            field: 'totalAmountToPayInUsd',
            render: rowData => (
                rowData.userBondDetails.currencyOfTransfer === 'USD'
                    ? `$ ${rowData.totalAmountToPayInUsd.toLocaleString('en-IN')}`
                    : `-`
            )
        },
        {
            title: 'Dividend Status',
            field: 'paid',
            render: rowData => (
                <div>
                    {rowData.paid === true ? "PAID" : "YET TO PAY"}
                </div>
            ),
            sorting: false,
        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button type="button" className="btn btn-primary"
                    onClick={() => getDividendHistoryView(rowData)}
                >
                    View
                </button >
            ),
            cellStyle: {
                textAlign: 'center' // Center align the cell content
            },
            headerStyle: {
                textAlign: 'center' // Center align the header content
            },
            sorting: false,
        }

    ];

    const handleDividendStatus = (item) => {
        setDividendStatus(item);
        onChangeValidation(item, "dividendStatus")
    }

    const openDividendModal = (item) => {
        setModalOpen(true)
        setDividendMasterId(item.id)
        setDividendYear(item.dividendYear)
        setFixedDividendDate(item.fixedDividendDate);
        setAmountToPay(item.amountToPay);
        setDividendPeriodType(item.periodTypes.periodType);
        setFromDate(item.dividendFromDate);
        setToDate(item.dividendToDate);
        setNoOfDividend(item.noOfDividend);
        setConfirmFlag(item.paid)
        setDisbursedAmount("");
        setActualDividendDate("");
        setDividendStatus();
        setModeofPayment("");
        setUsdFlag(item.usd)
        setViewFlag(false)
    }

    const disbursedModalClose = () => {
        setModalOpen(false)
        setDividendMasterId("")
        setDividendYear("")
        setFixedDividendDate("");
        setDisbursedAmount("");
        setActualDividendDate("");
        setDividendStatus();
        setAmountToPay("");
        setDividendPeriodType("");
        setFromDate("");
        setToDate("");
        setNoOfDividend("");
        setModeofPayment("");
        setConfirmFlag(null)
        setFormError({})
        setUsdFlag(null)
        setConversionRate('')
        setViewFlag(false)
    }

    const submitValidation = () => {
        const errors = {};

        if (modeOfPayment === "") {
            errors.modeOfPayment = "Please Select the Mode Of Payment"
        }

        if (actualDividendDate === "") {
            errors.actualDividendDate = "Please Select the Actual Dividend Date"
        }

        if (dividendStatus === undefined || dividendStatus === null) {
            errors.dividendStatus = "Please Select the Dividend Status"
        }

        if (usdFlag === true && conversionRate === "") {
            errors.conversionRate = "Please Enter the Conversion Rate"
        }
        else if (usdFlag === true && parseInt(conversionRate) <= 1) {
            errors.conversionRate = "Conversion Rate should be greater than 1"
        }

        setFormError(errors)

        if (Object.keys(errors).length === 0) {
            setIndex(1)
            setModalOpen(false)
        }
    }

    const onChangeValidation = (e, label) => {
        if (label === "modeOfPayment") {
            const value = e.target.value;
            if (value === "") {
                setFormError((e) => {
                    return { ...e, modeOfPayment: "Please Select the Mode Of Payment" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, modeOfPayment: "" }
                })
            }
        }
        else if (label === "actualDividendDate") {
            const value = e;
            if (value === "") {
                setFormError((e) => {
                    return { ...e, actualDividendDate: "Please Select the Actual Dividend Date" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, actualDividendDate: "" }
                })
            }
        }
        else if (label === "dividendStatus") {
            const value = e;
            if (value === "") {
                setFormError((e) => {
                    return { ...e, dividendStatus: "Please Select the Dividend Status" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, dividendStatus: "" }
                })
            }
        }
        else if (label === "conversionRate") {
            const value = e.target.value;
            if (value === "") {
                setFormError((e) => {
                    return { ...e, conversionRate: "Please Enter the Conversion Rate" }
                })
            }
            else if (parseInt(value) <= 1) {
                setFormError((e) => {
                    return { ...e, conversionRate: "Conversion Rate should be greater than 1" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, conversionRate: "" }
                })
            }
        }
    }

    const focusOutValidation = (label) => {
        if (label === "modeOfPayment") {
            if (modeOfPayment === "") {
                setFormError((e) => {
                    return { ...e, modeOfPayment: "Please Select the Mode Of Payment" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, modeOfPayment: "" }
                })
            }
        }
        else if (label === "actualDividendDate") {
            if (actualDividendDate === "") {
                setFormError((e) => {
                    return { ...e, actualDividendDate: "Please Select the Actual Dividend Date" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, actualDividendDate: "" }
                })
            }
        }
        else if (label === "dividendStatus") {
            if (dividendStatus === undefined || dividendStatus === null) {
                setFormError((e) => {
                    return { ...e, dividendStatus: "Please Select the Dividend Status" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, dividendStatus: "" }
                })
            }
        }
        else if (label === "conversionRate") {
            if (conversionRate === "") {
                setFormError((e) => {
                    return { ...e, conversionRate: "Please Enter the Conversion Rate" }
                })
            }
            else if (parseInt(conversionRate) <= 1) {
                setFormError((e) => {
                    return { ...e, conversionRate: "Conversion Rate should be greater than 1" }
                })
            }
            else {
                setFormError((e) => {
                    return { ...e, conversionRate: "" }
                })
            }
        }
    }

    const saveDisburedModal = () => {
        const errors = {};

        if (editFlag === true && modeOfPayment === "") {
            errors.actualDividendDate = "Please Select the Mode Of Payment"
        }

        if (editFlag === true && actualDividendDate === "") {
            errors.actualDividendDate = "Please Select the Actual Dividend Date"
        }

        if (editFlag === true && (dividendStatus === undefined || dividendStatus === null)) {
            errors.dividendStatus = "Please Select the Dividend Status"
        }

        if (editFlag === true && usdFlag === true && conversionRate === "") {
            errors.conversionRate = "Please Enter the Conversion Rate"
        }
        else if (editFlag === true && usdFlag === true && parseInt(conversionRate) <= 1) {
            errors.conversionRate = "Conversion Rate should be greater than 1"
        }

        setFormError(errors)

        if (Object.keys(errors).length === 0) {
            const method = 'POST';
            const url = `/dividend/update`;
            const data = {
                "id": dividendMasterId,
                "actualDividendDate": actualDividendDate,
                "dividendStatus": {
                    "id": dividendStatus.value
                },
                "paid": confirmFlag,
                "modeOfPayment": modeOfPayment,
                "conversionRate": parseFloat(conversionRate)
            };

            PostApi(method, url, data, headers)
                .then((response) => {
                    console.log(response, "kjjk")
                    if (response.data.status === 200) {
                        setUserAlert(true);
                        setUserAlertType("success");
                        setUserAlertMsg(response.data.message)
                        setUserAlertClose(() => () => window.location.reload())
                    }
                    else {
                        setUserAlert(true);
                        setUserAlertType("error");
                        setUserAlertMsg(response.data.message)
                        setUserAlertClose(() => () => setUserAlert(false))
                    }
                })
                .catch((error) => {
                    console.log("Error searching user:", error);
                });
        }
    }

    const getMasterDividendId = (rowData) => {
        const method = 'POST';
        const url = `/dividend/id?id=${rowData.id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response)
                setIndex(1)
                setDividendMasterId(response.data.data.id)
                setDividendYear(response.data.data.dividendYear)
                setFixedDividendDate(response.data.data.fixedDividendDate);
                setAmountToPay(response.data.data.amountToPay);
                setDividendPeriodType(response.data.data.periodTypes.periodType);
                setFromDate(response.data.data.dividendFromDate);
                setToDate(response.data.data.dividendToDate);
                setNoOfDividend(response.data.data.noOfDividend);
                setConfirmFlag(response.data.data.paid)
                setDisbursedAmount(response.data.data.disbursedAmount);
                setActualDividendDate(response.data.data.actualDividendDate);
                setDividendStatus(response.data.data.dividendStatus.status);
                setUsdFlag(response.data.data.usd)
                setConversionRate(response.data.data.conversionRate);
                setModeofPayment(response.data.data.modeOfPayment)
                const status = {
                    value: response.data.data.dividendStatus.id,
                    label: response.data.data.dividendStatus.status
                }
                setDividendStatus(status)
                setViewFlag(true)
            })
            .catch((error) => {
                console.log("Error searching user:", error);
            });
    }

    const getDividendHistoryView = (rowData) => {
        const method = 'POST';
        const url = `/dividend/details/id?id=${rowData.id}`;
        const data = null;
        PostApi(method, url, data, headers)
            .then((response) => {
                console.log(response, "dividend History Details")
                setViewDividendData(response.data.data)
                setIndex(3)
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="dividend-tabs" >
                                <button className={activeTab === 1 ? "active" : ""} onClick={() => handleTabChange(1)}>
                                    <span>Master Dividend</span>
                                </button>
                                {(index === 1 || index === 2 || index === 3) && (
                                    <button style={{ marginLeft: "3px" }} className={activeTab === 2 ? "active" : ""} onClick={() => handleTabChange(2)}>
                                        <span>Dividend History</span>
                                    </button>
                                )}
                            </div>
                            {(activeTab === 1 && index === 0) && (
                                <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <CiSearch />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className='input_box'
                                            value={searchQuery}
                                            style={{ height: "100%", width: "100%" }}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                            {(activeTab === 1 && index === 1) && (
                                <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                                    {confirmFlag === false &&
                                        <button type="button" className="btn btn-primary" onClick={() => setEditFlag(true)}>
                                            Edit
                                        </button>
                                    }
                                </div>
                            )}
                            {(activeTab === 2 && index === 2) && (
                                <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <CiSearch />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className='input_box'
                                            value={historySearchQuery}
                                            style={{ height: "100%", width: "100%" }}
                                            onChange={(e) => setHistorySearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div >
                            {(activeTab === 1 && index === 0) && (
                                <div style={{ paddingTop: "30px" }}>
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={dividendColumn}
                                        data={filteredMasterDividendData}
                                        options={{ ...TableOptions(), toolbar: false }}
                                    />
                                </div>
                            )}
                            {(activeTab === 1 && index === 1) && (
                                <div style={{ padding: "10px" }}>
                                    <div className="welcome_text" style={{ paddingBottom: "15px" }}>
                                        <span>Dividend Master Details</span>
                                    </div>
                                    <div className="row">

                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Dividend Year</span>
                                            <div className='input_contanier'>
                                                <input
                                                    type="text"
                                                    id="projectname"
                                                    name="projectname"
                                                    className="inputscheme"
                                                    readOnly
                                                    value={dividendYear}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Amount To Pay</span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="text"
                                                    id="durationyears"
                                                    name="durationyears"
                                                    className="inputscheme"
                                                    readOnly
                                                    value={`₹ ${amountToPay.toLocaleString('en-IN')}`}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Fixed Dividend Date</span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="date"
                                                    id="durationyears"
                                                    name="durationyears"
                                                    className="inputscheme"
                                                    readOnly
                                                    value={fixedDividendDate}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">From Date</span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="date"
                                                    id="durationyears"
                                                    name="durationyears"
                                                    className="inputscheme"
                                                    readOnly
                                                    value={fromDate}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Dividend Peroid Type</span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="text"
                                                    id="durationyears"
                                                    name="durationyears"
                                                    className="inputscheme"
                                                    readOnly
                                                    value={dividendPeriodType}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">To Date</span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="date"
                                                    id="durationyears"
                                                    name="durationyears"
                                                    className="inputscheme"
                                                    readOnly
                                                    value={toDate}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">No of Dividends</span>

                                            <div className='input_contanier'>
                                                <input
                                                    type="number"
                                                    id="durationyears"
                                                    name="durationyears"
                                                    className="inputscheme"
                                                    readOnly
                                                    value={noOfDividend}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Mode Of Payment</span>
                                            <div className='admin_inputcontainer'>
                                                <select
                                                    id="ModeofPayment"
                                                    className={`inputscheme`}
                                                    value={modeOfPayment}
                                                    disabled={editFlag === false}
                                                    onChange={(e) => {
                                                        setModeofPayment(e.target.value)
                                                        onChangeValidation(e, 'modeOfPayment');
                                                    }}
                                                    onBlur={() => focusOutValidation("modeOfPayment")}
                                                >
                                                    <option value="" disabled>Select Mode Of Payment</option>
                                                    {modeOfPaymentList.map((paymentMethod, i) => (
                                                        <option key={i} value={paymentMethod}>{paymentMethod}</option>
                                                    ))}
                                                </select>
                                                {formError.modeOfPayment && <div className="field_form_alert">
                                                    <span>{formError.modeOfPayment}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Dividend Status</span>
                                            <div className='admin_inputcontainer'>
                                                <Select
                                                    options={dividendStatusList}
                                                    onChange={handleDividendStatus}
                                                    placeholder="Select Dividend Status"
                                                    value={dividendStatus}
                                                    isDisabled={editFlag === false}
                                                />
                                                {formError.dividendStatus && <div className="field_form_alert">
                                                    <span>{formError.dividendStatus}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-12'>
                                            <span className="adminscheme_font">Dividend Date</span>

                                            <div className='input_contanier'>
                                                {/* <input
                                                    type="date"
                                                    id="Description"
                                                    name="Description"
                                                    placeholder="Description"
                                                    className='inputscheme'
                                                    min={minDate}
                                                    max={currentDate}
                                                    value={actualDividendDate}
                                                    readOnly={editFlag === false}
                                                    onChange={(e) => {
                                                        setActualDividendDate(e.target.value)
                                                        onChangeValidation(e, 'actualDividendDate');
                                                    }}
                                                    onBlur={() => focusOutValidation("actualDividendDate")}
                                                /> */}
                                                <DatePicker
                                                    showIcon
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    selected={actualDividendDate ? new Date(actualDividendDate) : null}
                                                    onChange={(date) => {
                                                        setActualDividendDate(moment(date).format("YYYY-MM-DD"))
                                                        onChangeValidation(date, 'actualDividendDate');
                                                    }}
                                                    className='inputscheme'
                                                    placeholderText='dd-mm-yyyy'
                                                    dateFormat="dd-MM-yyyy"
                                                    minDate={minDate}
                                                    maxDate={currentDate}
                                                    disabled={editFlag === false}
                                                    onKeyDown={(e) => {
                                                        e.preventDefault()
                                                    }}
                                                    onBlur={() => focusOutValidation("actualDividendDate")}
                                                    shouldCloseOnSelect={true}
                                                />
                                                {formError.actualDividendDate && <div className="field_form_alert">
                                                    <span>{formError.actualDividendDate}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        {usdFlag === true &&
                                            <>
                                                <div className='col-lg-6 col-12'>
                                                    <span className="adminscheme_font">Conversion Rate <br /> (INR to USD) :</span>

                                                    <div className='admin_inputcontainer'>
                                                        <input
                                                            type="text"
                                                            id="Description"
                                                            name="Description"
                                                            placeholder="Enter rate in INR"
                                                            className='inputscheme'
                                                            value={conversionRate}
                                                            readOnly={editFlag === false}
                                                            min={2}
                                                            onChange={(e) => {
                                                                setConversionRate(e.target.value)
                                                                onChangeValidation(e, 'conversionRate');
                                                            }}
                                                            onKeyPress={(e) => {
                                                                const charCode = e.charCode || e.keyCode;
                                                                const charStr = String.fromCharCode(charCode);

                                                                // Allow numbers and a single dot
                                                                if (!/^[0-9.]$/.test(charStr) || (charStr === '.' && e.target.value.includes('.'))) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onBlur={() => focusOutValidation("conversionRate")}
                                                        />
                                                        {formError.conversionRate && <div className="field_form_alert">
                                                            <span>{formError.conversionRate}</span>
                                                        </div>}
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <div className='col-lg-6 col-12' style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "5px" }}>
                                            <span className="adminscheme_font">Dividend Confirmation</span>

                                            <div className=''>
                                                <input
                                                    type="checkbox"
                                                    id="Description"
                                                    name="Description"
                                                    placeholder="Disbursed Amount"
                                                    checked={confirmFlag}
                                                    disabled={viewFlag === true}
                                                    onChange={(e) => {
                                                        setConfirmFlag(e.target.checked)
                                                    }}
                                                />
                                                {formError.confirmFlag && <div className="field_form_alert">
                                                    <span>{formError.confirmFlag}</span>
                                                </div>}
                                            </div>
                                        </div>
                                        {viewFlag === false &&
                                            <div className='col-4 col-lg-4 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%", width: "100%" }}>
                                                <div className="col-4 col-lg-4">
                                                    <button type="buttom" onClick={() => saveDisburedModal()} className="approve_btn">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )}
                            {(activeTab === 2 && index === 2) && (
                                <div>
                                    <MaterialTable
                                        style={{ width: "100%" }}
                                        title=""
                                        columns={historyColumn}
                                        data={filteredHistoryDividendData}
                                        options={{ ...TableOptions(), toolbar: false }}
                                    />
                                </div>
                            )}

                            {(activeTab === 2 && index === 3) && (
                                <div>
                                    <div style={{ padding: "20px" }}>
                                        <div className="welcome_text" style={{ paddingBottom: "15px" }}>
                                            <span>Dividend Details</span>
                                        </div>
                                        <div className="row">

                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Application No</span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="projectname"
                                                        name="projectname"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={viewDividendData.userBondDetails.formNo}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Project</span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="durationyears"
                                                        name="durationyears"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={viewDividendData.dividend.clientDetails.clientName}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Scheme</span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="durationyears"
                                                        name="durationyears"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={viewDividendData.dividend.clientBondDetails.bondName}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Dividend Amount</span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="durationyears"
                                                        name="durationyears"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={`₹ ${viewDividendData.dividendAmount.toLocaleString('en-IN')}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Dividend %</span>
                                                <div className='admin_inputcontainer'>
                                                    <input
                                                        type="number"
                                                        id="Description"
                                                        name="Description"
                                                        placeholder="Description"
                                                        className='inputscheme'
                                                        readOnly
                                                        value={viewDividendData.dividendPercentage}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">TDS Amount</span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="Description"
                                                        name="Description"
                                                        placeholder="Description"
                                                        className='inputscheme'
                                                        readOnly
                                                        value={`₹ ${viewDividendData.tdsDeducted.toLocaleString('en-IN')}`}
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Allotment Date</span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="date"
                                                        id="durationyears"
                                                        name="durationyears"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={viewDividendData.dividend.actualDividendDate}
                                                    />
                                                </div>
                                            </div> */}
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Fixed Dividend Date</span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="date"
                                                        id="Description"
                                                        name="Description"
                                                        placeholder="Disbursed Amount"
                                                        className='inputscheme'
                                                        readOnly
                                                        value={viewDividendData.dividend.fixedDividendDate}
                                                    />
                                                </div>
                                            </div>

                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Allotment Amount</span>

                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="Description"
                                                        name="Description"
                                                        placeholder="Disbursed Amount"
                                                        className='inputscheme'
                                                        readOnly
                                                        value={`₹ ${viewDividendData.allotedAmount.toLocaleString('en-IN')}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: "20px" }}>
                                        <div className="welcome_text" style={{ paddingBottom: "15px" }}>
                                            <span>Payout Details</span>
                                        </div>
                                        <div className="row">

                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Amount To Pay (₹)</span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="projectname"
                                                        name="projectname"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={`₹ ${viewDividendData.totalAmountToPay.toLocaleString('en-IN')}`}
                                                    />
                                                </div>
                                            </div>
                                            {viewDividendData.userBondDetails.currencyOfTransfer === "USD" &&
                                                <>
                                                    <div className='col-lg-6 col-12'>
                                                        <span className="adminscheme_font">Amount To Pay ($)</span>
                                                        <div className='input_contanier'>
                                                            <input
                                                                type="text"
                                                                id="projectname"
                                                                name="projectname"
                                                                className="inputscheme"
                                                                readOnly
                                                                value={`$ ${viewDividendData.totalAmountToPayInUsd.toLocaleString('en-IN')}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-6 col-12'>
                                                        <span className="adminscheme_font">Conversion Rate (INR to USD)</span>
                                                        <div className='input_contanier'>
                                                            <input
                                                                type="text"
                                                                id="projectname"
                                                                name="projectname"
                                                                className="inputscheme"
                                                                readOnly
                                                                value={viewDividendData.conversionRate || "-"}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Dividend Date</span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="date"
                                                        id="projectname"
                                                        name="projectname"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={viewDividendData.payoutDate}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 col-12'>
                                                <span className="adminscheme_font">Dividend Status</span>
                                                <div className='input_contanier'>
                                                    <input
                                                        type="text"
                                                        id="projectname"
                                                        name="projectname"
                                                        className="inputscheme"
                                                        readOnly
                                                        value={viewDividendData.dividend.dividendStatus.status}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {userAlert && (
                    <Alert
                        title={"Alert"}
                        msg={userAlertMsg}
                        open={true}
                        type={userAlertType}
                        onClose={userAlertClose}
                        onConfirm={userAlertConfirm}
                    />
                )}
            </div>

            {modalOpen &&
                <Modal dialogClassName='modal-dialog modal-lg' centered show={true}>
                    <Modal.Header>
                        <div className='modal_subhead'>
                            <span className='modal_head_txt'>Add Disbursement</span>
                            <AiOutlineClose className="moda_closel_icon" onClick={() => disbursedModalClose()} />
                        </div>
                    </Modal.Header>
                    <Modal.Body >
                        <div className="col-12 row" style={{ padding: "10px" }}>
                            <div className='col-lg-4 col-12 admin_inputcontainer ' >
                                <span className="adminscheme_font">Dividend Year</span>
                            </div>
                            <div className='col-lg-8 col-12'>
                                <div className='admin_inputcontainer'>
                                    <input
                                        type="text"
                                        id="ProjectName"
                                        name="Project Name"
                                        className='inputscheme'
                                        placeholder="Project Name"
                                        readOnly
                                        value={dividendYear}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 col-12 admin_inputcontainer'>
                                <span className="adminscheme_font">Fixed Dividend Date</span>
                            </div>
                            <div className='col-lg-8 col-12'>
                                <div className='admin_inputcontainer'>
                                    <input
                                        type="date"
                                        id="SchemeType"
                                        name="Scheme Type"
                                        className='inputscheme'
                                        placeholder="Scheme Type"
                                        readOnly
                                        value={fixedDividendDate}
                                    />
                                </div>
                            </div>

                            <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                <span className="adminscheme_font">Amount To Pay</span>
                            </div>
                            <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                <div className='admin_inputcontainer'>
                                    <input
                                        type="number"
                                        id="Description"
                                        name="Description"
                                        placeholder="Amount to Pay"
                                        className='inputscheme'
                                        readOnly
                                        value={amountToPay}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                <span className="adminscheme_font">Dividend Date</span>
                            </div>
                            <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                <div className='admin_inputcontainer'>
                                    {/* <input
                                    type="date"
                                    id="Description"
                                    name="Description"
                                    placeholder="Description"
                                    className='inputscheme'
                                    min={minDate}
                                    max={currentDate}
                                    value={actualDividendDate}
                                    onChange={(e) => {
                                        setActualDividendDate(e.target.value)
                                        onChangeValidation(e, 'actualDividendDate');
                                    }}
                                    onBlur={() => focusOutValidation("actualDividendDate")}
                                /> */}
                                    <DatePicker
                                        showIcon
                                        showYearDropdown
                                        scrollableYearDropdown
                                        selected={actualDividendDate ? new Date(actualDividendDate) : null}
                                        onChange={(date) => {
                                            setActualDividendDate(moment(date).format("YYYY-MM-DD"))
                                            onChangeValidation(date, 'actualDividendDate');
                                        }}
                                        className='inputscheme'
                                        placeholderText='dd-mm-yyyy'
                                        dateFormat="dd-MM-yyyy"
                                        minDate={minDate}
                                        maxDate={currentDate}
                                        onKeyDown={(e) => {
                                            e.preventDefault()
                                        }}
                                        onBlur={() => focusOutValidation("actualDividendDate")}
                                        shouldCloseOnSelect={true}
                                    />
                                    {formError.actualDividendDate && <div className="field_form_alert">
                                        <span>{formError.actualDividendDate}</span>
                                    </div>}
                                </div>
                            </div>
                            <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                <span className="adminscheme_font">Mode Of Payment</span>
                            </div>
                            <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                <div className='admin_inputcontainer'>
                                    <select
                                        id="ModeofPayment"
                                        className={`inputscheme`}
                                        value={modeOfPayment}
                                        onChange={(e) => {
                                            setModeofPayment(e.target.value)
                                            onChangeValidation(e, 'modeOfPayment');
                                        }}
                                        onBlur={() => focusOutValidation("modeOfPayment")}
                                    >
                                        <option value="" disabled>Select Mode Of Payment</option>
                                        {modeOfPaymentList.map((paymentMethod, i) => (
                                            <option key={i} value={paymentMethod}>{paymentMethod}</option>
                                        ))}
                                    </select>
                                    {formError.modeOfPayment && <div className="field_form_alert">
                                        <span>{formError.modeOfPayment}</span>
                                    </div>}
                                </div>
                            </div>
                            <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                <span className="adminscheme_font">Dividend Status</span>
                            </div>
                            <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                <div className='admin_inputcontainer'>
                                    <Select
                                        options={dividendStatusList}
                                        onChange={handleDividendStatus}
                                        placeholder="Select Dividend Status"
                                        value={dividendStatus}
                                    />
                                    {formError.dividendStatus && <div className="field_form_alert">
                                        <span>{formError.dividendStatus}</span>
                                    </div>}
                                </div>
                            </div>
                            {usdFlag === true &&
                                <>
                                    <div className='col-lg-4 col-12' style={{ marginTop: "0px" }}>
                                        <span className="adminscheme_font">Conversion Rate <br /> (INR to USD) :</span>
                                    </div>
                                    <div className='col-lg-8 col-12' style={{ marginTop: "0px" }}>
                                        <div className='admin_inputcontainer'>
                                            <input
                                                type="text"
                                                id="Description"
                                                name="Description"
                                                placeholder="Enter rate in INR"
                                                className='inputscheme'
                                                value={conversionRate}
                                                min={2}
                                                onChange={(e) => {
                                                    setConversionRate(e.target.value)
                                                    onChangeValidation(e, 'conversionRate');
                                                }}
                                                onKeyPress={(e) => {
                                                    const charCode = e.charCode || e.keyCode;
                                                    const charStr = String.fromCharCode(charCode);

                                                    // Allow numbers and a single dot
                                                    if (!/^[0-9.]$/.test(charStr) || (charStr === '.' && e.target.value.includes('.'))) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onBlur={() => focusOutValidation("conversionRate")}
                                            />
                                            {formError.conversionRate && <div className="field_form_alert">
                                                <span>{formError.conversionRate}</span>
                                            </div>}
                                        </div>
                                    </div>
                                </>
                            }
                            <div className='col-12 col-lg-12 login_btn_container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "3%" }}>
                                <div className="col-4 col-lg-4">
                                    <button type="button" onClick={() => submitValidation()} className="approve_btn">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </div>
    )
}

export default DividendMaster