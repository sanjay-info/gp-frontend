import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import "./LoanView.css";
import { FaCheckCircle, FaTimesCircle, FaEllipsisV } from "react-icons/fa";
import { set } from "date-fns";
import Alert from "../components/Alert";

/* ================= UTIL ================= */
const formatCurrency = (value) =>
    value !== null && value !== undefined
        ? `₹ ${Number(value).toLocaleString("en-IN")}`
        : "—";

const LoanView = () => {
    const { sideBarCollapse } = useSidebar();
    const { PostApi, GetApi } = useAppContext();
    const navigate = useNavigate();
    const { loanId } = useParams();

    const [activeTab, setActiveTab] = useState("summary");
    const [data, setData] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [loadingPay, setLoadingPay] = useState(false);
    const [disbursements, setDisbursements] = useState([]);
    const [documents, setDocuments] = useState([])


    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [isApprovalConfirmOpen, setIsApprovalConfirmOpen] = useState(false);
    const [approvalEmi, setApprovalEmi] = useState(null);



    const storedRoleId = JSON.parse(localStorage.getItem("Role_id")) || [];
    const roleId = storedRoleId?.[0]?.id;

    const isAdmin = roleId === 1;
    const isGMFinance = roleId === 7

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedEmi, setSelectedEmi] = useState(null);
    const [remarks, setRemarks] = useState("");

    const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
    const [selectedRejectReason, setSelectedRejectReason] = useState("");

    const [actionMenuEmi, setActionMenuEmi] = useState(null);
    const [showMarkPaidConfirm, setShowMarkPaidConfirm] = useState(false);

    const isPaymentsTab = activeTab === "payments";
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Payment Modal States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentType, setPaymentType] = useState("");
    const [partPaymentAmount, setPartPaymentAmount] = useState("");
    const [adjustmentType, setAdjustmentType] = useState("");
    const [submittingPayment, setSubmittingPayment] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [documentIdToUpdate, setDocumentIdToUpdate] = useState(null);


    useEffect(() => {
        if (activeTab !== "payments") return;

        const fetchPaymentDetails = async () => {
            try {
                setLoading(true);

                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const res = await GetApi(
                    "GET",
                    `/user/loan-paymentdetails/${loanId}`,
                    null,
                    headers
                );

                if (res?.status === 200) {
                    setPaymentDetails(res.data || []);
                } else {
                    setPaymentDetails([]);
                }
            } catch (err) {
                console.error("Payment API error", err);
                setPaymentDetails([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [activeTab]);






    const getLoanDetailsUrl = (loanId) => {
        // GM Finance role
        if (roleId === 7) {
            return `/gmfinance/getLoanDetailsById/${loanId}`;
        }

        // Existing (ADMIN / USER) – DO NOT CHANGE
        return `/user/getLoanDetailsById/${loanId}`;
    };


    /* ---------- FETCH LOAN DETAILS ---------- */
    useEffect(() => {
        if (!loanId) return;

        const fetchLoanDetails = async () => {
            try {
                const res = await PostApi(
                    "GET",
                    getLoanDetailsUrl(loanId),
                    null,
                    headers
                );

                setData(res?.data?.loan);
                setInstallments(res?.data?.installments || []);
                setDisbursements(res?.data?.disbursements || []);
                setDocuments(res?.data?.document || []);
            } catch (err) {
                console.error("Loan fetch failed:", err);
            }
        };

        fetchLoanDetails();
    }, [loanId]);


    const statusPriority = {
        "APPROVED": 1,
        "REJECTED": 2,
        "NOT PAID": 3,
        "PAID": 4
    };

    const sourceInstallments =
        activeTab === "payments"
            ? paymentDetails       // from /loan-paymentdetails API
            : installments;        // schedules data (existing)


    /* ---------- SORT INSTALLMENTS ---------- */
    const sortedInstallments = [...sourceInstallments].sort((a, b) => {
        const aPriority = statusPriority[a.paymentStatus] ?? 99;
        const bPriority = statusPriority[b.paymentStatus] ?? 99;

        // Sort by status priority first
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        // Same status → sort by installment number
        return a.installmentNumber - b.installmentNumber;
    });


    /* ---------- PAYMENT HANDLERS ---------- */
    const openConfirmModal = (emi) => {
        setSelectedInstallment(emi);
        setShowConfirmModal(true);
    };

    const openRejectModal = (emi) => {
        setSelectedEmi(emi);
        setRemarks("");
        setShowRejectModal(true);
    };


    const confirmMarkPaid = async () => {
        if (!selectedInstallment) return;

        const payload = {
            paymentDate: selectedInstallment.paymentDate,
            transactionNumber: selectedInstallment.transactionNumber,
            modeOfPayment: selectedInstallment.modeOfPayment,
            notes: selectedInstallment.notes,
        };

        const isInstallment =
            selectedInstallment.loanPaymentType === "INSTALLMENT";

        const apiUrl = isInstallment
            ? `/user/installment/${selectedInstallment.paymentId}/success`
            : `/user/payment/${selectedInstallment.paymentId}/success`;


        try {
            setLoadingPay(true);

            await PostApi(
                "POST",
                apiUrl,
                payload,
                headers
            );

            setInstallments((prev) =>
                prev.map((i) =>
                    i.paymentId === selectedInstallment.paymentId
                        ? {
                            ...i,
                            paymentStatus: "PAID",
                            actualPaymentDate: payload.paymentDate,
                            transactionNumber: payload.transactionNumber,
                            modeOfPayment: payload.modeOfPayment,
                            notes: payload.notes,
                        }
                        : i
                )
            );
            setPaymentDetails((prev) =>
                prev.map((i) =>
                    i.paymentId === selectedInstallment.paymentId
                        ? {
                            ...i,
                            paymentStatus: "PAID",
                            actualPaymentDate: payload.paymentDate,
                            transactionNumber: payload.transactionNumber,
                            modeOfPayment: payload.modeOfPayment,
                            notes: payload.notes,
                        }
                        : i
                )
            );

            setShowConfirmModal(false);
        } catch (error) {
            console.error(error);
            alert("Payment update failed");
        } finally {
            setLoadingPay(false);
        }

    };
    const safeNum = (v) => v ?? 0;
    const safeText = (v) => (v ?? "—");

    const formatDate = (date) => {
        if (!date) return "—";

        const d = new Date(date);
        if (isNaN(d)) return "—";

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const onConfirm = async () => {
        try {
            // URL for the PUT request to update the document's 'received' status
            const apiUrl = `/user/document/${documentIdToUpdate}/received`;

            // Create the payload to toggle the 'received' status
            const payload = { received: true };

            // Make the API call using PostApi
            await PostApi("PUT", apiUrl, payload, headers);

            // Update the local state for the document's received status
            setDocuments(prev =>
                prev.map(doc =>
                    doc.documentId === documentIdToUpdate
                        ? { ...doc, received: true }
                        : doc
                )
            );

            setModalType('success');
            setModalMessage('Document status updated successfully.');
        } catch (err) {
            console.error(err);
            setModalType('error');
            setModalMessage('Failed to update document status.');
        }
        setShowModal(false);
    };

    const onCloseModal = () => {
        setShowModal(false);
    };



    const handleSubmitApproval = async (emi) => {
        const isInstallment =
            emi.loanPaymentType === "INSTALLMENT";
        const apiUrl = isInstallment
            ? `/user/installment/${emi.paymentId}/submit`
            : `/user/payment/${emi.paymentId}/submit`;


        try {
            await PostApi(
                "POST",
                apiUrl,
                null,
                headers
            );

            setPaymentDetails((prev) =>
                prev.map((i) =>
                    i.paymentId === emi.paymentId
                        ? { ...i, paymentStatus: "IN REVIEW" }
                        : i
                )
            );
            setInstallments((prev) =>
                prev.map((i) =>
                    i.paymentId === emi.paymentId
                        ? { ...i, paymentStatus: "IN REVIEW" }
                        : i
                )
            );
        } catch (err) {
            console.error(err);
            alert("Submit approval failed");
        }
    };

    const handleDocumentReceivedChange = async (documentId, currentStatus) => {
        setDocumentIdToUpdate(documentId);
        setModalType('yesorno');
        setModalMessage('Are you sure you want to update the received status?');
        setShowModal(true);
    };

    const handlePaymentSubmit = async () => {
        if (!paymentType) {
            alert("Please select payment type");
            return;
        }

        if (paymentType === "PartPayment" && (!partPaymentAmount || !adjustmentType)) {
            alert("Please fill all required fields for part payment");
            return;
        }

        const payload = paymentType === "PartPayment"
            ? {
                paymentType: "PartPayment",
                adjustmentType,
                partPaymentAmount: Number(partPaymentAmount)
            }
            : {
                paymentType: "FORECLOSURE"
            };

        try {
            setSubmittingPayment(true);

            const response = await PostApi(
                "POST",
                `/user/payment/${loanId}/submit-payment`,
                payload,
                headers
            );

            console.log(response);

            // ✅ SUCCESS CASE (HTTP 200)
            if (response?.status === 200) {
                alert("Payment submitted successfully");

                setShowPaymentModal(false);
                setPaymentType("");
                setPartPaymentAmount("");
                setAdjustmentType("");
            } else {
                alert(response?.data?.message || "Payment submission failed");
            }

        } catch (err) {
            console.error(err);

            // ✅ Backend error message (400/500)
            alert(
                err?.response?.data?.message ||
                "Payment submission failed"
            );
        } finally {
            setSubmittingPayment(false);
        }
    };


    const handleApprove = async (emi) => {
        try {
            await PostApi(
                "POST",
                `/gmfinance/installment/${emi.paymentId}/approve`,
                null,
                headers
            );

            setInstallments((prev) =>
                prev.map((i) =>
                    i.paymentId === emi.paymentId
                        ? { ...i, paymentStatus: "APPROVED" }
                        : i
                )
            );
        } catch (err) {
            console.error(err);
            alert("Approve failed");
        }
    };

    const handleRejectConfirm = async () => {
        if (!remarks.trim()) {
            alert("Remarks are required");
            return;
        }

        try {
            await PostApi(
                "POST",
                `/gmfinance/installment/${selectedEmi.paymentId}/reject`,
                {
                    remarks: remarks
                },
                headers
            );

            setInstallments((prev) =>
                prev.map((i) =>
                    i.paymentId === selectedEmi.paymentId
                        ? { ...i, paymentStatus: "NOT PAID" }
                        : i
                )
            );

            setShowRejectModal(false);
            setSelectedEmi(null);
        } catch (err) {
            console.error(err);
            alert("Reject failed");
        }
    };

    const openRejectReasonModal = (reason) => {
        setSelectedRejectReason(reason);
        setShowRejectReasonModal(true);
    };


    if (!data) return null;

    return (
        <>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="LoanViewContainer">

                        {/* ---------- HEADER ---------- */}
                        <div className="LV_title_header">
                            <h2>Loan Details</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {activeTab === "payments" && roleId === 4 && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowPaymentModal(true)}
                                    >
                                        Payment
                                    </button>
                                )}
                                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                    ← Back
                                </button>
                            </div>
                        </div>

                        {/* ---------- TABS ---------- */}
                        <div className="LV_tabs">
                            {["summary", "loaner", "schedules", "disbursement", "intent", "payments", "document"].map((tab) => (
                                <div
                                    key={tab}
                                    className={`LV_tab ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.toUpperCase()}
                                </div>
                            ))}
                        </div>

                        {/* ================= SUMMARY ================= */}
                        {activeTab === "summary" && (
                            <div className="LV_tab_content">
                                <div className="LV_card">
                                    <h4>Loan Summary</h4>

                                    <div className="LV_row"><span>Loan Number</span><p>{data.loanNumber}</p></div>
                                    <div className="LV_row"><span>Loan Name</span><p>{data.loanName}</p></div>
                                    <div className="LV_row"><span>Loan Amount</span><p>{formatCurrency(data.loanAmount ?? data.sanctionedAmount)}</p></div>
                                    <div className="LV_row"><span>Sanctioned Amount</span><p>{formatCurrency(data.sanctionedAmount)}</p></div>
                                    <div className="LV_row"><span>Disbursed Amount</span><p>{formatCurrency(data.disbursedAmount)}</p></div>
                                    <div className="LV_row"><span>Interest Rate</span><p>{data.interestRate}%</p></div>
                                    <div className="LV_row"><span>Tenure</span><p>{data.tenureMonths} Months</p></div>
                                    <div className="LV_row"><span>Interest Type</span><p>{data.interestType}</p></div>
                                    <div className="LV_row">
                                        <span>Loan Start Date</span>
                                        <p>{formatDate(data.loanStartDate)}</p>
                                    </div>
                                    <div className="LV_row">
                                        <span>Sanctioned Date</span>
                                        <p>{formatDate(data.loanSanctionedDate)}</p>
                                    </div>
                                    {/* ================= REPAYMENT DETAILS ================= */}
                                    <h4 style={{ margin: "28px 0 14px" }}>Repayment Overview</h4>

                                    <div className="LV_summary_grid">

                                        {/* Installments */}
                                        <div className="LV_summary_card">
                                            <h5>Installments</h5>
                                            <div className="LV_summary_row">
                                                <span>Total</span>
                                                <b>{safeNum(data.totalInstallments)}</b>
                                            </div>
                                            <div className="LV_summary_row success">
                                                <span>Paid</span>
                                                <b>{safeNum(data.paidInstallments)}</b>
                                            </div>
                                            <div className="LV_summary_row danger">
                                                <span>Remaining</span>
                                                <b>{safeNum(data.remainingInstallments)}</b>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="LV_summary_card">
                                            <h5>Amount</h5>
                                            <div className="LV_summary_row">
                                                <span>Total Payable</span>
                                                <b>{formatCurrency(safeNum(data.totalToPay))}</b>
                                            </div>
                                            <div className="LV_summary_row success">
                                                <span>Paid</span>
                                                <b>{formatCurrency(safeNum(data.totalPaidTillDate))}</b>
                                            </div>
                                            <div className="LV_summary_row danger">
                                                <span>Outstanding</span>
                                                <b>{formatCurrency(safeNum(data.outstandingAmount))}</b>
                                            </div>
                                        </div>

                                        {/* Principal */}
                                        <div className="LV_summary_card">
                                            <h5>Principal</h5>
                                            <div className="LV_summary_row">
                                                <span>Total</span>
                                                <b>{formatCurrency(safeNum(data.loanAmount ?? data.sanctionedAmount))}</b>
                                            </div>
                                            <div className="LV_summary_row success">
                                                <span>Paid</span>
                                                <b>{formatCurrency(safeNum(data.totalPrincipalPaid))}</b>
                                            </div>
                                            <div className="LV_summary_row danger">
                                                <span>Outstanding</span>
                                                <b>{formatCurrency(safeNum(data.outstandingPrincipal))}</b>
                                            </div>
                                        </div>

                                        {/* Interest */}
                                        <div className="LV_summary_card">
                                            <h5>Interest</h5>
                                            <div className="LV_summary_row">
                                                <span>Total</span>
                                                <b>{formatCurrency(safeNum(data.totalInterest))}</b>
                                            </div>
                                            <div className="LV_summary_row success">
                                                <span>Paid</span>
                                                <b>{formatCurrency(safeNum(data.totalInterestPaid))}</b>
                                            </div>
                                            <div className="LV_summary_row danger">
                                                <span>Outstanding</span>
                                                <b>
                                                    {formatCurrency(
                                                        Math.max(
                                                            safeNum(data.totalInterest) - safeNum(data.totalInterestPaid),
                                                            0
                                                        )
                                                    )}
                                                </b>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Next Due */}
                                    <div className="LV_due_highlight">
                                        <span>Next Due</span>
                                        <span>
                                            {formatDate(data.nextDueDate)} · {formatCurrency(data.nextDueAmount)}
                                        </span>
                                    </div>


                                </div>
                            </div>
                        )}

                        {/* ================= LOANER ================= */}
                        {activeTab === "loaner" && (
                            <div className="LV_tab_content">
                                <div className="LV_card">

                                    {/* ================= LOANER SUMMARY ================= */}
                                    <h4 style={{ marginBottom: "14px" }}>Loaner Summary</h4>

                                    <div className="LV_row">
                                        <span>Loaner Name</span>
                                        <p>{data.loanerName}</p>
                                    </div>

                                    <div className="LV_row">
                                        <span>Loaner ID</span>
                                        <p>{data.loanerID}</p>
                                    </div>

                                    <div className="LV_row">
                                        <span>Loan Number</span>
                                        <p>{data.loanNumber}</p>
                                    </div>

                                    <div className="LV_row">
                                        <span>Loan Status</span>
                                        <p
                                            style={{
                                                color: data.loanStatus === "Active" ? "green" : "red",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {data.loanStatus}
                                        </p>
                                    </div>

                                    {/* ================= CONTACT DETAILS ================= */}
                                    <h4 style={{ margin: "26px 0 14px" }}>Contact Details</h4>

                                    <div className="LV_row">
                                        <span>Email</span>
                                        <p>{data.emailId || "—"}</p>
                                    </div>

                                    <div className="LV_row">
                                        <span>Mobile Number</span>
                                        <p>
                                            {data.countryCode && data.mobileNo
                                                ? `${data.countryCode} ${data.mobileNo}`
                                                : "—"}
                                        </p>
                                    </div>

                                    {/* ================= BANK DETAILS (RESTORED) ================= */}
                                    <h4 style={{ margin: "26px 0 14px" }}>Bank Details</h4>

                                    <div className="LV_row">
                                        <span>Bank Name</span>
                                        <p>{data.bankName || "—"}</p>
                                    </div>

                                    <div className="LV_row">
                                        <span>Account Number</span>
                                        <p>{data.accountNo || "—"}</p>
                                    </div>

                                    <div className="LV_row">
                                        <span>IFSC Code</span>
                                        <p>{data.ifscCode || "—"}</p>
                                    </div>

                                    <div className="LV_row">
                                        <span>Branch Name</span>
                                        <p>{data.branchName || "—"}</p>
                                    </div>

                                    <div className="LV_row" style={{ borderBottom: "none" }}>
                                        <span>Account Type</span>
                                        <p>{data.accountType || "—"}</p>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* ================= REPAYMENT ================= */}
                        {(activeTab === "schedules" || activeTab === "payments") && (
                            <div className="LV_tab_content">

                                {!isPaymentsTab && (
                                    <div className="LV_card" style={{ marginBottom: 20 }}>
                                        <h4>Payment Details</h4>

                                        <div className="LV_horizontal">
                                            <div className="LV_h_item"><span>EMI</span><p>{formatCurrency(data.emiAmount)}</p></div>
                                            <div className="LV_h_item"><span>Total Paid</span><p>{formatCurrency(data.totalPaidTillDate)}</p></div>
                                            <div className="LV_h_item"><span>Outstanding</span><p>{formatCurrency(data.outstandingPrincipal)}</p></div>
                                            <div className="LV_h_item"><span>Next Due</span><p>{data.nextDueDate}</p></div>
                                        </div>
                                    </div>
                                )}
                                <div className="LV_card">
                                    {activeTab === "payments" ? <h4>Payment Details</h4> : <h4>Repayment Schedule</h4>}

                                    <table className="LV_table">
                                        <thead>
                                            <tr>
                                                <th>#</th>

                                                {isPaymentsTab && (
                                                    <>
                                                        <th>Payment ID</th>
                                                        <th>Payment Type</th>
                                                    </>
                                                )}

                                                {!isPaymentsTab && (
                                                    <>
                                                        <th>Due Date</th>
                                                        <th>Principal</th>
                                                        <th>Interest</th>
                                                        <th>TDS</th>
                                                        <th>Interest After TDS</th>
                                                        <th>Total</th>
                                                    </>
                                                )}

                                                {isPaymentsTab && <th>Installment Amount</th>}

                                                <th>Status</th>

                                                {isPaymentsTab && isAdmin && <th>Action</th>}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {sortedInstallments.map((emi) => (
                                                <tr key={emi.paymentId || emi.paymentId}>
                                                    <td>{emi.installmentNumber}</td>

                                                    {/* PAYMENTS TAB EXTRA COLS */}
                                                    {isPaymentsTab && (
                                                        <>
                                                            <td>{emi.paymentId}</td>
                                                            <td>{emi.loanPaymentType}</td>
                                                        </>
                                                    )}

                                                    {/* SCHEDULES TAB */}
                                                    {!isPaymentsTab && (
                                                        <>
                                                            <td>{emi.dueDate}</td>
                                                            <td>{formatCurrency(emi.principalComponent)}</td>
                                                            <td>{formatCurrency(emi.interestComponent)}</td>
                                                            <td>{formatCurrency(emi.tdsAmount)}</td>
                                                            <td>{formatCurrency(emi.interestAfterTds)}</td>
                                                            <td>{formatCurrency(emi.totalDue)}</td>
                                                        </>
                                                    )}

                                                    {/* PAYMENTS TAB AMOUNT */}
                                                    {isPaymentsTab && (
                                                        <td>{formatCurrency(emi.installmentAmount)}</td>
                                                    )}

                                                    {/* STATUS */}
                                                    <td>
                                                        <div className="LV_status_wrap">
                                                            <span
                                                                className={`LV_status_chip ${emi.paymentStatus === "PAID"
                                                                    ? "success"
                                                                    : emi.paymentStatus === "REJECTED"
                                                                        ? "danger"
                                                                        : "pending"
                                                                    }`}
                                                            >
                                                                {emi.paymentStatus}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* ACTION */}
                                                    {isPaymentsTab && isAdmin && (
                                                        <td className="LV_action_td">
                                                            {emi.paymentStatus === "NOT PAID" || emi.paymentStatus === "REJECTED" ? (
                                                                <button
                                                                    className="LV_btn outline"
                                                                    onClick={() => {
                                                                        setApprovalEmi(emi);
                                                                        setIsApprovalConfirmOpen(true);
                                                                    }}                                                                >
                                                                    Submit for Approval
                                                                </button>
                                                            ) : emi.paymentStatus === "IN REVIEW" ? (
                                                                <span className="LV_badge warning">Approval Pending</span>
                                                            ) : emi.paymentStatus === "APPROVED" ? (
                                                                <button
                                                                    className="LV_btn primary"
                                                                    onClick={() => openConfirmModal(emi)}
                                                                >
                                                                    Mark as Paid
                                                                </button>
                                                            ) : (
                                                                <span className="LV_badge" />
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>

                            </div>
                        )}

                        {/* ================= DISBURSEMENT ================= */}
                        {activeTab === "disbursement" && (
                            <div className="LV_tab_content">
                                <div className="LV_card">
                                    <h4>Disbursement Details</h4>

                                    {disbursements.length === 0 ? (
                                        <p style={{ color: "#6b7280" }}>No disbursements available</p>
                                    ) : (
                                        <table className="LV_table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>UTR / Ref</th>
                                                    <th>Lender</th>
                                                    <th>Bank</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {disbursements.map((d, idx) => (
                                                    <tr key={d.disbursementId}>
                                                        <td>{idx + 1}</td>
                                                        <td>{formatDate(d.disbursementDate)}</td>
                                                        <td>{formatCurrency(d.disbursementAmount)}</td>
                                                        <td>{d.utrNumber || "—"}</td>
                                                        <td>{d.lenderName || "—"}</td>
                                                        <td>{d.lenderBankName || "—"}</td>
                                                        <td>{d.remarks || "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "document" && (
                            <div className="LV_tab_content">
                                <div className="LV_card">
                                    <h4>Document Details</h4>

                                    {documents.length === 0 ? (
                                        <p style={{ color: "#6b7280" }}>No documents available</p>
                                    ) : (
                                        <table className="LV_table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Document Name</th>
                                                    <th>Returnable</th>
                                                    <th>Received</th>
                                                    <th>Received Date</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {documents.map((doc, idx) => (
                                                    <tr key={doc.documentId}>
                                                        <td>{idx + 1}</td>
                                                        <td>{doc.documentName}</td>
                                                        <td>{doc.returnable ? "Yes" : "No"}</td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={doc.received}
                                                                disabled={doc.received} // Optionally, disable if already received
                                                                onChange={() => handleDocumentReceivedChange(doc.documentId)}
                                                            />
                                                        </td>
                                                        <td>{doc.receivedDate ? formatDate(doc.receivedDate) : "—"}</td>
                                                        <td>{doc.description || "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}



                        {/* ================= INTENT ================= */}
                        {activeTab === "intent" && (
                            <div className="LV_tab_content">
                                <div className="LV_card">
                                    <h4>Loan Intent</h4>

                                    <div className="LV_row"><span>Intent Name</span><p>{data.loanIntent?.name || "—"}</p></div>
                                    <div className="LV_row"><span>Status</span><p>{data.loanIntent?.intentStatus?.intentStatus || "—"}</p></div>
                                    <div className="LV_row" style={{ borderBottom: "none" }}>
                                        <span>Description</span>
                                        <p>{data.loanIntent?.description || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ---------- CONFIRM MODAL ---------- */}
            {showConfirmModal && (
                <div className="payment-modal-backdrop">
                    <div className="payment-modal">
                        {/* Header */}
                        <div className="payment-modal-header">
                            <h3>Mark EMI as Paid</h3>
                            <span className="emi-badge">
                                EMI {selectedInstallment?.installmentNumber}
                            </span>
                        </div>

                        {/* Body */}
                        <div className="payment-modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Payment Date *</label>
                                    <input
                                        type="date"
                                        value={selectedInstallment?.paymentDate || ""}
                                        onChange={(e) =>
                                            setSelectedInstallment((prev) => ({
                                                ...prev,
                                                paymentDate: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Mode of Payment *</label>
                                    <select
                                        value={selectedInstallment?.modeOfPayment || ""}
                                        onChange={(e) =>
                                            setSelectedInstallment((prev) => ({
                                                ...prev,
                                                modeOfPayment: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="NEFT">NEFT</option>
                                        <option value="IMPS">IMPS</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CHEQUE">Cheque</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Transaction Reference</label>
                                <input
                                    type="text"
                                    placeholder="Eg: NEFT-AXIS-XXXX"
                                    value={selectedInstallment?.transactionNumber || ""}
                                    onChange={(e) =>
                                        setSelectedInstallment((prev) => ({
                                            ...prev,
                                            transactionNumber: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea
                                    rows="3"
                                    placeholder="Optional notes"
                                    value={selectedInstallment?.notes || ""}
                                    onChange={(e) =>
                                        setSelectedInstallment((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="payment-modal-footer">
                            <button
                                className="btn-outline"
                                onClick={() => setShowConfirmModal(false)}
                                disabled={loadingPay}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn-primary"
                                onClick={confirmMarkPaid}
                                disabled={
                                    loadingPay ||
                                    !selectedInstallment?.paymentDate ||
                                    !selectedInstallment?.modeOfPayment
                                }
                            >
                                {loadingPay ? "Processing..." : "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showRejectModal && (
                <div className="modalOverlay">
                    <div className="modalBox">
                        <h3>Reject Installment</h3>

                        <label>Remarks</label>
                        <textarea
                            placeholder="Enter rejection reason"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={4}
                        />

                        <div className="modalActions">
                            <button
                                className="cancelBtn"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="rejectBtn"
                                onClick={handleRejectConfirm}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isApprovalConfirmOpen && (
                <div className="modalOverlay">
                    <div className="modalBox">
                        <h3>Submit for Approval</h3>

                        <p>
                            Are you sure you want to submit
                            <strong> Installment #{approvalEmi?.installmentNumber}</strong>
                            for approval?
                        </p>

                        <div className="modalActions">
                            <button
                                className="cancelBtn"
                                onClick={() => {
                                    setIsApprovalConfirmOpen(false);
                                    setApprovalEmi(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirmBtn"
                                onClick={() => {
                                    handleSubmitApproval(approvalEmi);
                                    setIsApprovalConfirmOpen(false);
                                    setApprovalEmi(null);
                                }}
                            >
                                Confirm Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRejectReasonModal && (
                <div className="LV_modal_overlay">
                    <div className="LV_modal_box">

                        <h3>Rejection Reason</h3>

                        <p className="LV_modal_text">
                            {selectedRejectReason}
                        </p>

                        <div className="LV_modal_actions">
                            <button
                                className="LV_btn primary"
                                onClick={() => setShowRejectReasonModal(false)}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {showMarkPaidConfirm && (
                <div className="confirm-modal-backdrop">
                    <div className="confirm-modal">

                        {/* Header */}
                        <div className="confirm-modal-header">
                            <h3>Confirm Action</h3>
                        </div>

                        {/* Body */}
                        <div className="confirm-modal-body">
                            <p>
                                Are you sure you want to mark
                                <strong> EMI {selectedInstallment?.installmentNumber}</strong>
                                as paid?
                            </p>

                            <p className="confirm-hint">
                                This action cannot be undone.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="confirm-modal-footer">
                            <button
                                className="btn-outline"
                                onClick={() => setShowMarkPaidConfirm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn-primary"
                                onClick={() => {
                                    setShowMarkPaidConfirm(false);
                                    setShowConfirmModal(true); // open payment modal
                                }}
                            >
                                Yes, Continue
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="payment-modal-backdrop">
                    <div className="payment-modal">
                        <div className="payment-modal-header">
                            <h3>Submit Payment</h3>
                        </div>

                        <div className="payment-modal-body">
                            <div className="form-group">
                                <label>Payment Type *</label>
                                <select
                                    value={paymentType}
                                    onChange={(e) => {
                                        setPaymentType(e.target.value);
                                        if (e.target.value !== "PartPayment") {
                                            setPartPaymentAmount("");
                                            setAdjustmentType("");
                                        }
                                    }}
                                >
                                    <option value="">Select Payment Type</option>
                                    <option value="PartPayment">PartPayment</option>
                                    <option value="FORECLOSURE">FORECLOSURE</option>
                                </select>
                            </div>

                            {paymentType === "PartPayment" && (
                                <>
                                    <div className="form-group">
                                        <label>Part Payment Amount *</label>
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={partPaymentAmount}
                                            onChange={(e) => setPartPaymentAmount(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Adjustment Type *</label>
                                        <select
                                            value={adjustmentType}
                                            onChange={(e) => setAdjustmentType(e.target.value)}
                                        >
                                            <option value="">Select Adjustment Type</option>
                                            <option value="REDUCE TENURE">REDUCE TENURE</option>
                                            <option value="REDUCE EMI">REDUCE EMI</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="payment-modal-footer">
                            <button
                                className="btn-outline"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setPaymentType("");
                                    setPartPaymentAmount("");
                                    setAdjustmentType("");
                                }}
                                disabled={submittingPayment}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn-primary"
                                onClick={handlePaymentSubmit}
                                disabled={submittingPayment}
                            >
                                {submittingPayment ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Alert
                title={modalType === 'yesorno' ? 'Confirm Action' : modalType === 'error' ? 'Error' : 'Success'}
                msg={modalMessage}
                open={showModal}
                type={modalType}
                onClose={onCloseModal}
                onConfirm={modalType === 'yesorno' ? onConfirm : undefined}
            />
        </>
    );
};

export default LoanView;
