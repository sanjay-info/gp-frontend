import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import Select from "react-select";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import DatePicker from "react-datepicker";
import "./LoanPayout.css";
import moment from "moment";
import { AiOutlineClose } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import Alert from "../components/Alert";

/* ===========================
   HARD CODED FILTER OPTIONS
=========================== */

const accountTypeOptions = [
    { value: "COMPANY", label: "Company" },
    { value: "INDIVIDUAL", label: "Individual" },
    { value: "BANK", label: "Bank" },
    { value: "NBFC", label: "NBFC" },
];

const paymentStatusOptions = [
    { value: "SUCCESS", label: "Success" },
    { value: "PENDING", label: "Pending" },
];

const LoanPayout = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    /* ===========================
       FILTER STATES (REPLACED)
    =========================== */

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [accountType, setAccountType] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

    /* ===========================
       DATA STATES (UNCHANGED)
    =========================== */

    const [loanData, setLoanData] = useState([]);
    const [loanIds, setLoanIds] = useState([]);

    const [payoutDate, setPayoutDate] = useState(null);
    const [modeOfPayment, setModeofPayment] = useState("");
    const [payoutMsg, setPayoutMsg] = useState("");
    const [transactionNumber, setTransactionNumber] = useState("");

    const [loanModalOpen, setLoanModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [tableKey, setTableKey] = useState(0);
    const [modeOfPaymentList, setModeOfPaymentList] = useState([]);

    /* ===========================
       FETCH LOAN DATA (NEW API)
    =========================== */

    useEffect(() => {
        if (!startDate || !endDate || !accountType || !paymentStatus) return;

        const formData = new URLSearchParams();
        formData.append("fromDate", moment(startDate).format("YYYY-MM-DD"));
        formData.append("toDate", moment(endDate).format("YYYY-MM-DD"));
        formData.append("paymentStatus", paymentStatus.value);
        formData.append("accountType", accountType.value);
        formData.append("page", 0);
        formData.append("size", 5);

        PostApi("POST", "/user/repayment-schedules", formData, {
            ...headers,
            "Content-Type": "application/x-www-form-urlencoded",
        })
            .then((res) => {
                setLoanData(
                    (res.data.content || []).map((item) => ({
                        ...item,
                        id: item.scheduleId,
                        utrNo: item.utrNo || "Enter the transaction no",
                    }))
                );
                setTableKey((k) => k + 1);
            })
            .catch(() => setLoanData([]));
    }, [startDate, endDate, accountType, paymentStatus]);

    /* ===========================
       TABLE COLUMNS (KEPT)
    =========================== */

    const columns = [
        { title: "Loaner Name", field: "loanerName", editable: "never" },
        { title: "Loan Number", field: "loanNumber", editable: "never" },
        { title: "Installment ID", field: "installmentId", editable: "never" },
        {
            title: "Due Date",
            render: (row) => moment(row.dueDate).format("DD-MM-YYYY"),
            editable: "never",
        },
        {
            title: "Amount",
            render: (row) =>
                `₹ ${row.actualAmountToPay.toLocaleString("en-IN")}`,
            editable: "never",
        },
        {
            title: (
                <span>
                    Transaction No <span className="required_star">*</span>
                </span>
            ),
            field: "utrNo",
            editComponent: (props) => (
                <input
                    value={
                        props.value !== "Enter the transaction no" ? props.value : ""
                    }
                    onChange={(e) => props.onChange(e.target.value)}
                    placeholder="Enter transaction no"
                />
            ),
        },
    ];

    /* ===========================
       SELECTION (UNCHANGED)
    =========================== */

    const handleSelectionChange = (rows) => {
        setLoanIds(
            rows.map((row) => ({
                scheduleId: row.scheduleId,
                utrNo: row.utrNo,
            }))
        );
    };

    /* ===========================
       OPEN MODAL (UNCHANGED)
    =========================== */

    const openLoanPayout = () => {
        if (loanIds.length === 0) {
            setUserAlert(true);
            setAlertTitle("Info");
            setAlertMsg("Please select at least one record.");
            setAlertType("error");
            setAlertClose(() => () => setUserAlert(false));
            return;
        }

        const invalidIndex = loanIds.findIndex(
            (r) =>
                !r.utrNo ||
                r.utrNo.trim() === "" ||
                r.utrNo === "Enter the transaction no"
        );

        if (invalidIndex !== -1) {
            setUserAlert(true);
            setAlertTitle("Info");
            setAlertMsg(
                `Please enter a valid transaction number for selected row ${invalidIndex + 1}`
            );
            setAlertType("error");
            setAlertClose(() => () => setUserAlert(false));
            return;
        }

        // ✅ All rows valid → open modal
        getModeofPayment();
        setLoanModalOpen(true);
    };

    const closeLoanModal = () => {
        setLoanModalOpen(false);
        setPayoutDate(null);
        setModeofPayment("");
        setTransactionNumber("");
        setFormErrors({});
    };

    /* ===========================
       SUBMIT PAYOUT (NEW API)
    =========================== */

    const saveLoanPayout = () => {
        const errors = {};
        if (!payoutDate) errors.payoutDate = "Select Payment Date";
        if (!modeOfPayment) errors.modeOfPayment = "Select Mode of Payment";
        if (!transactionNumber)
            errors.transactionNumber = "Enter Transaction Number";

        setFormErrors(errors);
        if (Object.keys(errors).length) return;

        const payload = {
            scheduleIds: loanIds.map((i) => i.scheduleId),
            paymentDate: moment(payoutDate).format("YYYY-MM-DD"),
            modeOfPayment,
            transactionNumber,
            notes: payoutMsg,
        };

        PostApi("POST", "/user/installments/success", payload, headers)
            .then(() => {
                setUserAlert(true);
                setAlertTitle("Success");
                setAlertMsg("Loan payout completed successfully");
                setAlertType("success");
                setAlertClose(() => () => window.location.reload());
            })
            .catch(() => {
                setUserAlert(true);
                setAlertTitle("Error");
                setAlertMsg("Loan payout failed");
                setAlertType("error");
            });
    };

    const getModeofPayment = () => {
        PostApi("POST", "/userbond/modeOfPayment", null, headers).then((res) =>
            setModeOfPaymentList(res.data)
        );
    };

    /* ===========================
       JSX (STRUCTURE KEPT)
    =========================== */

    return (
        <div className="loan-payout-page">
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="loan-page">
                        <div className="loan-header">
                            <h2>Loan Payout</h2>
                        </div>

                        {/* FILTERS */}
                        <div className="loan-filter-card">
                            <div className="loan-filter-grid">
                                <div className="filter-field">
                                    <label>From Date</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={setStartDate}
                                        placeholderText="Select start date"
                                        className="filter-input"
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>

                                <div className="filter-field">
                                    <label>To Date</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={setEndDate}
                                        placeholderText="Select end date"
                                        className="filter-input"
                                        minDate={startDate}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>

                                <div className="filter-field">
                                    <label>Account Type</label>
                                    <Select
                                        options={accountTypeOptions}
                                        value={accountType}
                                        onChange={setAccountType}
                                        placeholder="Select account type"
                                        classNamePrefix="react-select"
                                    />
                                </div>

                                <div className="filter-field">
                                    <label>Payment Status</label>
                                    <Select
                                        options={paymentStatusOptions}
                                        value={paymentStatus}
                                        onChange={setPaymentStatus}
                                        placeholder="Select payment status"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>


                        <MaterialTable
                            key={tableKey}
                            style={{ marginTop: "30px" }}
                            columns={columns}
                            data={loanData}
                            options={{
                                ...TableOptions(),
                                search: false,
                                toolbar: false,
                                selection: true,
                            }}
                            onSelectionChange={handleSelectionChange}
                            cellEditable={{
                                isCellEditable: () => true,
                                onCellEditApproved: (newVal, _, row, col) =>
                                    new Promise((resolve) => {
                                        const updated = [...loanData];
                                        const idx = updated.findIndex(
                                            (r) => r.scheduleId === row.scheduleId
                                        );
                                        updated[idx][col.field] = newVal;
                                        setLoanData(updated);
                                        resolve();
                                    }),
                            }}
                        />

                        {loanIds.length > 0 && (
                            <button className="declare_btn" onClick={openLoanPayout}>
                                Payout Loan
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <Modal centered show={loanModalOpen}>
                <Modal.Header>
                    <span>Loan Payout</span>
                    <AiOutlineClose onClick={closeLoanModal} />
                </Modal.Header>
                <Modal.Body>
                    <DatePicker
                        selected={payoutDate}
                        onChange={setPayoutDate}
                        className="input_box"
                        placeholderText="Payment Date"
                    />

                    <select
                        className="input_box"
                        value={modeOfPayment}
                        onChange={(e) => setModeofPayment(e.target.value)}
                    >
                        <option value="">Select Mode Of Payment</option>
                        {modeOfPaymentList.map((m, i) => (
                            <option key={i} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    <input
                        className="input_box"
                        placeholder="Transaction Number"
                        value={transactionNumber}
                        onChange={(e) => setTransactionNumber(e.target.value)}
                    />

                    <textarea
                        className="input_box"
                        placeholder="Notes"
                        onChange={(e) => setPayoutMsg(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={closeLoanModal}>Cancel</button>
                    <button onClick={saveLoanPayout}>Submit</button>
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
};

export default LoanPayout;
