import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import Alert from "../components/Alert";
import "./Payment.css"

const Payments = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const [token] = useState(localStorage.getItem("token"));
    const tableRef = useRef(null);
    const location = useLocation();

    const headers = { Authorization: `Bearer ${token}` };

    // ---------------- PAYMENT MODAL STATES ----------------
    const [loanModalOpen, setLoanModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [paymentType, setPaymentType] = useState("");
    const [adjustmentType, setAdjustmentType] = useState("");
    const [amount, setAmount] = useState("");

    // ---------------- ALERT STATES ----------------
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("info");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMsg, setAlertMsg] = useState("");
    const [onConfirmAction, setOnConfirmAction] = useState(null);

    useEffect(() => {
        if (tableRef.current) tableRef.current.onQueryChange();
    }, [location.pathname]);

    // ---------------- FETCH LOANS ----------------
    const fetchTableData = () => {
        return new Promise(async (resolve) => {
            try {
                const response = await PostApi(
                    "GET",
                    "/user/getAllLoans",
                    null,
                    headers
                );

                resolve({
                    data: response?.data || [],
                    page: 0,
                    totalCount: response?.data?.length || 0,
                });
            } catch (error) {
                console.log("Error fetching loans:", error);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });
    };

    // ---------------- MODAL HANDLERS ----------------
    const openLoanModal = (loan) => {
        setSelectedLoan(loan);
        setPaymentType("");
        setAdjustmentType("");
        setAmount("");
        setLoanModalOpen(true);
    };

    const closeLoanModal = () => {
        setLoanModalOpen(false);
    };

    // ---------------- SUBMIT PAYMENT (CONFIRM FIRST) ----------------
    const confirmPayment = () => {
        if (!paymentType) {
            showAlert("info", "Missing Data", "Please select payment type");
            return;
        }

        if (paymentType === "PartPayment" && (!adjustmentType || !amount)) {
            showAlert(
                "info",
                "Missing Data",
                "Please select adjustment type and enter amount"
            );
            return;
        }

        showAlert(
            "yesorno",
            "Confirm Payment",
            `Are you sure you want to proceed with this payment for Loan ${selectedLoan.loanNumber}?`,
            savePayment
        );
    };

    // ---------------- API CALL ----------------
    const savePayment = async () => {
        try {
            let payload = {};

            if (paymentType === "FORECLOSURE") {
                payload = { paymentType: "FORECLOSURE" };
            } else {
                payload = {
                    paymentType: "PartPayment",
                    adjustmentType,
                    partPaymentAmount: Number(amount),
                };
            }

            await PostApi(
                "POST",
                `/user/payment/${selectedLoan.loanId}/submit-payment`,
                payload,
                headers
            );

            setLoanModalOpen(false);
            showAlert("success", "Success", "Payment completed successfully");
            tableRef.current.onQueryChange();
        } catch (error) {
            const errorMsg =
                error?.response?.data?.message ||
                error?.data?.message ||
                "Payment failed. Please try again.";

            showAlert("error", "Payment Failed", errorMsg);
        }
    };

    // ---------------- ALERT HELPER ----------------
    const showAlert = (type, title, msg, confirmAction = null) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMsg(msg);
        setOnConfirmAction(() => confirmAction);
        setAlertOpen(true);
    };

    const closeAlert = () => {
        setAlertOpen(false);
        setOnConfirmAction(null);
    };

    // ---------------- TABLE COLUMNS ----------------
    const columns = [
        { title: "Loan No", field: "loanNumber" },
        { title: "Loaner Name", field: "loanerName" },

        {
            title: "Outstanding",
            field: "outstandingPrincipal",
            render: (row) => `₹ ${row.outstandingPrincipal?.toLocaleString()}`,
        },

        {
            title: "EMI",
            field: "emiAmount",
            render: (row) => `₹ ${row.emiAmount?.toLocaleString()}`,
        },

        {
            title: "Status",
            field: "loanStatus",
            render: (row) => (
                <span
                    style={{
                        color: row.loanStatus === "Active" ? "green" : "gray",
                        fontWeight: 600,
                    }}
                >
                    {row.loanStatus}
                </span>
            ),
        },

        {
            title: "Action",
            render: (row) => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openLoanModal(row)}
                >
                    Pay
                </button>
            ),
        },
    ];

    return (
        <div>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div className="welcome_text">
                            <span>Payments</span>
                        </div>

                        <MaterialTable
                            title=""
                            columns={columns}
                            tableRef={tableRef}
                            data={() => fetchTableData()}
                            options={{
                                ...TableOptions(),
                                search: true,
                                toolbar: true,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ---------------- PAYMENT MODAL ---------------- */}
            <Modal
                centered
                show={loanModalOpen}
                onHide={closeLoanModal}
                dialogClassName="confirmModal"
            >
                <div className="confirmModalContainer">
                    <div className="confirmHeader">
                        <span>Confirm Payment</span>
                        <AiOutlineClose onClick={closeLoanModal} />
                    </div>

                    <div className="confirmBody">
                        <p className="confirmTitle">
                            Proceed with loan payment?
                        </p>

                        <p className="confirmDesc">
                            Loan No: <strong>{selectedLoan?.loanNumber}</strong>
                        </p>

                        <label>Payment Type</label>
                        <select
                            className="form-control"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="PartPayment">Part Payment</option>
                            <option value="FORECLOSURE">Foreclosure</option>
                        </select>

                        {paymentType === "PartPayment" && (
                            <>
                                <label>Adjustment Type</label>
                                <select
                                    className="form-control"
                                    value={adjustmentType}
                                    onChange={(e) => setAdjustmentType(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="REDUCE TENURE">Reduce Tenure</option>
                                    <option value="REDUCE EMI">Reduce EMI</option>
                                </select>

                                <label>Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </>
                        )}
                    </div>

                    <div className="confirmFooter">
                        <button className="btnCancel" onClick={closeLoanModal}>
                            Cancel
                        </button>
                        <button className="btnConfirm" onClick={confirmPayment}>
                            Yes, Proceed
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ---------------- ALERT COMPONENT ---------------- */}
            <Alert
                open={alertOpen}
                type={alertType}
                title={alertTitle}
                msg={alertMsg}
                onClose={closeAlert}
                onConfirm={() => {
                    closeAlert();
                    onConfirmAction && onConfirmAction();
                }}
            />
        </div>
    );
};

export default Payments;
