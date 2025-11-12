import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from '../components/AppProvider';
import Select from 'react-select';
import MaterialTable from '@material-table/core';
import TableOptions from '../components/TableOptions';
import DatePicker from 'react-datepicker';
import './declaration.css'
import moment from 'moment';
import { AiOutlineClose } from 'react-icons/ai';
import { Modal } from "react-bootstrap";
import Alert from '../components/Alert';

const DividendDeclaration = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [userid] = useState(localStorage.getItem("user_id"));
    const [token] = useState(localStorage.getItem("token"));

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const [schemeList, setSchemeList] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState(null);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [dividendData, setDividendData] = useState([]);

    const [dividendIds, setDividendIds] = useState([]);

    const [declareDate, setDeclareDate] = useState(null);

    const [dividendModalOpen, setDividendModalOpen] = useState(false)

    const [userTypeList, setUserTypeList] = useState([])
    const [selectedUserType, setSelectedUserType] = useState(null)


    const [formErrors, setFormErrors] = useState({});

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [tableKey, setTableKey] = useState(0);


    useEffect(() => {
        getProjectList();
        getAllUserListTypes()
    }, []);

    useEffect(() => {
        if (selectedScheme) {
            getDividendList(selectedScheme.value);
        }
    }, [fromDate, toDate, selectedScheme]);

    const getProjectList = () => {
        const method = 'POST';
        const url = "/client/all";
        PostApi(method, url, null, headers)
            .then((response) => {
                const list = response.data.map(item => ({
                    value: item.id,
                    label: item.clientName
                }));
                setProjectList(list);
                if (list.length > 0) {
                    setSelectedProject(list[0]);
                }
            })
            .catch((error) => {
                console.log("Error fetching project list:", error);
            });
    };

    const handleProjectChange = (item) => {
        setSelectedProject(item);
    };

    const handleUserTypeChange = (item) => {
        setSelectedUserType(item)
        setSelectedScheme(null)
        getSchemesList(item.value);
        setDividendData([])
        setTableKey(prevKey => prevKey + 1);
    }

    const getSchemesList = (item) => {
        const method = 'POST';
        const url = `/client/byUserType?userTypeId=${item}&clientId=${selectedProject.value}`;
        PostApi(method, url, null, headers)
            .then((response) => {
                const list = response.data.data.map(item => ({
                    value: item.id,
                    label: item.bondName
                }));
                setSchemeList(list);
            })
            .catch((error) => {
                console.log("Error fetching schemes list:", error);
            });
    };

    const handleSchemeChange = (item) => {
        setSelectedScheme(item);
        setFromDate(null)
        setToDate(null)
        setTableKey(prevKey => prevKey + 1);
    };

    const getAllUserListTypes = () => {
        const url = '/user/type/all';
        PostApi('POST', url)
            .then((response) => {
                const transformedUserTypes = response.data.map(userListType => ({
                    value: userListType.id,
                    label: userListType.userType
                }));
                setUserTypeList(transformedUserTypes);
                // getSchemesList();
            })
            .catch((error) => {
                console.log("Error fetching user types:", error);
            });
    };

    const getDividendList = (schemeId) => {
        const formattedFromDate = fromDate ? moment(fromDate).format("YYYY-MM-DD") : null;
        const formattedToDate = toDate ? moment(toDate).format("YYYY-MM-DD") : null;

        let url = `/dividend/getAllDividends?schemeId=${schemeId}`;

        if (formattedFromDate) {
            url += `&fromDate=${formattedFromDate}`;
        }
        if (formattedToDate) {
            url += `&toDate=${formattedToDate}`;
        }

        const method = 'POST';
        PostApi(method, url, null, headers)
            .then((response) => {
                console.log("Dividend List:", response);
                // Process and display the dividend list here
                if (response.data.status === 200) {
                    setDividendData(response.data.data)
                }
                else {
                    setDividendData([])
                }
            })
            .catch((error) => {
                console.log("Error fetching dividend list:", error);
            });
    };


    const columns = [
        { title: 'Applicant', field: 'userBondDetails.name' },
        { title: 'Application No', field: 'userBondDetails.formNo' },
        {
            title: 'Dividend Date',
            field: 'dividend.fixedDividendDate',
            render: rowData => rowData.dividend.fixedDividendDate
                ? moment(rowData.dividend.fixedDividendDate).format('DD-MM-YYYY')
                : ''
        },
        {
            title: 'Dividend Amount (Before TDS)',
            field: 'dividendAmount',
            render: rowData => rowData.dividendAmount
                ? `₹ ${rowData.dividendAmount.toLocaleString('en-IN')}`
                : ''
        },
        {
            title: 'TDS Amount',
            field: 'tdsDeducted',
            render: rowData => rowData.tdsDeducted
                ? `₹ ${rowData.tdsDeducted.toLocaleString('en-IN')}`
                : ''
        },
        {
            title: 'Dividend Amount (After TDS)',
            field: 'totalAmountToPay',
            render: rowData => rowData.totalAmountToPay
                ? `₹ ${rowData.totalAmountToPay.toLocaleString('en-IN')}`
                : ''
        },
        // {
        //     title: 'Declaration Status',
        //     field: 'declared',
        //     render: rowData => (
        //         rowData.declared
        //             ? 'Declared'
        //             : <span style={{ color: 'orange' }}>Pending</span>
        //     )
        // }
    ];

    const handleSelectionChange = (rows) => {
        // const selectedIdsArray = rows.map(row => row.id);
        const selectedIdsArray = rows.map(row => ({
            id: row.id,
        }));
        setDividendIds(selectedIdsArray);
    };

    const closeDividendModal = () => {
        setDeclareDate(null)
        setFormErrors({})
        setDividendModalOpen(false)
    }

    const saveDividend = () => {
        console.log(dividendIds, "kjjkjk")
        if (declareDate === null) {
            setFormErrors({ ...formErrors, declareDate: "Please Select the Declaration Date" })
            return
        }
        else {
            const method = 'POST';
            const url = `/dividend/addDeclarationDate`;
            const data = {
                "dividendRequestDtoDetails": dividendIds,
                "declarationDate": (moment(declareDate).format("YYYY-MM-DD"))
            }

            PostApi(method, url, data, headers)
                .then((response) => {
                    if (response.data.status === 200) {
                        closeDividendModal()
                        setUserAlert(true);
                        setAlertTitle("Success");
                        setAlertMsg("Dividend Declared Successfully.")
                        setAlertType("success")
                        setAlertClose(() => () => window.location.reload())
                    }
                    else {
                        setUserAlert(true);
                        setAlertTitle("");
                        setAlertMsg("Something went wrong,try again.")
                        setAlertType("error")
                        setAlertClose(() => () => window.location.reload())
                    }
                })
                .catch((error) => {
                    console.log("Error fetching dividend list:", error);
                });
        }
    }

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div className="welcome_text">
                            <span>Dividend Declaration</span>
                        </div>
                        <div style={{ flexDirection: "row", display: "flex", justifyContent: "space-between", width: "100%", marginTop: "15px" }}>
                            <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
                                <div style={{ display: "flex", gap: "10px", }}>
                                    <Select
                                        options={projectList}
                                        value={selectedProject}
                                        onChange={handleProjectChange}
                                        placeholder="Select Project"
                                    />
                                    <Select
                                        options={userTypeList}
                                        value={selectedUserType}
                                        onChange={handleUserTypeChange}
                                        placeholder="Select User Type"
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                                    <Select
                                        options={schemeList}
                                        value={selectedScheme}
                                        onChange={handleSchemeChange}
                                        placeholder="Select Schemes"
                                    />
                                </div>
                            </div>
                            <div style={{ width: "50%", display: "flex", gap: "10px", justifyContent: "end" }}>
                                <div className="input_contanier filtter_container" style={{ margin: "0px", width: "35%" }}>
                                    <label className="login_label">From Date</label>
                                    <DatePicker
                                        showIcon
                                        selected={fromDate}
                                        onChange={date => setFromDate(date)}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        className="input_box"
                                        placeholderText="dd-mm-yyyy"
                                        dateFormat="dd-MM-yyyy"
                                        minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                                        maxDate={new Date()}
                                    />
                                </div>
                                <div className="input_contanier filtter_container" style={{ margin: "0px", width: "35%" }}>
                                    <label className="login_label">To Date</label>
                                    <DatePicker
                                        showIcon
                                        selected={toDate}
                                        onChange={date => setToDate(date)}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        className="input_box"
                                        placeholderText="dd-mm-yyyy"
                                        dateFormat="dd-MM-yyyy"
                                        minDate={new Date(fromDate)}
                                        maxDate={new Date()}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <MaterialTable
                                key={tableKey}
                                style={{ marginTop: "30px" }}
                                title=""
                                columns={columns}
                                data={dividendData}
                                options={{
                                    ...TableOptions(),
                                    search: false,
                                    toolbar: false,
                                    selection: true
                                }}
                                onSelectionChange={handleSelectionChange}
                            />

                            {dividendIds.length != 0 &&
                                <div className='declare_btn_container'>
                                    <button
                                        type="button"
                                        className="declare_btn"
                                        onClick={() => setDividendModalOpen(true)}
                                    >
                                        Declare Dividend
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal size='modal-dialog modal-lg' centered show={dividendModalOpen}>
                <Modal.Header>
                    <div className='modal_subhead'>
                        <span className='modal_head_txt'>Dividend Declaration</span>
                        <AiOutlineClose className="moda_closel_icon" onClick={() => closeDividendModal()} />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal_body_container'>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <div className="input_contanier" style={{ width: "30%" }}>
                                <label
                                    className="login_label"
                                    style={{ paddingBottom: "6px" }}
                                >Declaration Date <span className="required_star">*</span></label>
                                <DatePicker
                                    showIcon
                                    selected={declareDate}
                                    onChange={date => setDeclareDate(date)}
                                    showYearDropdown
                                    scrollableYearDropdown
                                    className="input_box"
                                    placeholderText="dd-mm-yyyy"
                                    dateFormat="dd-MM-yyyy"
                                    minDate={new Date(process.env.REACT_APP_PAYMENT_DATE)}
                                    maxDate={new Date()}
                                />
                                {formErrors.declareDate && <div className="field_form_alert">
                                    <span>{formErrors.declareDate}</span>
                                </div>}
                            </div>

                        </div>
                        <div className='caution_container'>
                            <div style={{ textAlign: "center" }}>
                                <label style={{ fontWeight: "bold" }}>Caution</label>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <span>Once the Declaration Date is submitted, the selected applicants will receive a confirmation email regarding the dividend declaration. Click "Submit" if you wish to proceed.</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='caution_container_footer'>
                    <button type='button' onClick={() => closeDividendModal()} className="modal_close_btn">Cancel</button>
                    <button type='button' onClick={() => saveDividend()} className="modal_btn">Submit</button>
                </Modal.Footer>
            </Modal>
            <Alert
                title={alertTitle}
                msg={alertMsg}
                open={userAlert}
                type={alertType}
                onClose={alertClose}
                onConfirm={alertConfirm}
            />

        </div>
    );
}

export default DividendDeclaration;