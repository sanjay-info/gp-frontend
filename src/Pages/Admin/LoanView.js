import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import "./LoanView.css";

/* ================= UTIL ================= */
const formatCurrency = (value) =>
    value !== null && value !== undefined
        ? `₹ ${Number(value).toLocaleString("en-IN")}`
        : "—";

const LoanView = () => {
    const { sideBarCollapse } = useSidebar();
    const { PostApi } = useAppContext();
    const navigate = useNavigate();
    const { loanId } = useParams();

    const [activeTab, setActiveTab] = useState("summary");
    const [data, setData] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [loadingPay, setLoadingPay] = useState(false);
    const [disbursements, setDisbursements] = useState([]);


    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    /* ---------- FETCH LOAN DETAILS ---------- */
    useEffect(() => {
        if (!loanId) return;

        const fetchLoanDetails = async () => {
            try {
                const res = await PostApi(
                    "GET",
                    `/user/getLoanDetailsById/${loanId}`,
                    null,
                    headers
                );
                setData(res?.data?.loan);
                setInstallments(res?.data?.installments || []);
                setDisbursements(res?.data?.disbursements || []);

            } catch (err) {
                console.error(err);
            }
        };

        fetchLoanDetails();
    }, [loanId]);

    /* ---------- SORT INSTALLMENTS ---------- */
    const sortedInstallments = [...installments].sort((a, b) => {
        if (a.paymentStatus === "SUCCESS" && b.paymentStatus !== "SUCCESS") return -1;
        if (a.paymentStatus !== "SUCCESS" && b.paymentStatus === "SUCCESS") return 1;
        return a.installmentNumber - b.installmentNumber;
    });

    /* ---------- PAYMENT HANDLERS ---------- */
    const openConfirmModal = (emi) => {
        setSelectedInstallment(emi);
        setShowConfirmModal(true);
    };

    const confirmMarkPaid = async () => {
        if (!selectedInstallment) return;

        const payload = {
            paymentDate: selectedInstallment.paymentDate,
            transactionNumber: selectedInstallment.transactionNumber,
            modeOfPayment: selectedInstallment.modeOfPayment,
            notes: selectedInstallment.notes,
        };

        try {
            setLoadingPay(true);

            await PostApi(
                "POST",
                `/user/installment/${selectedInstallment.scheduleId}/success`,
                payload, // ✅ derived from selectedInstallment
                headers
            );

            setInstallments((prev) =>
                prev.map((i) =>
                    i.scheduleId === selectedInstallment.scheduleId
                        ? {
                            ...i,
                            paymentStatus: "SUCCESS",
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
                            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                ← Back
                            </button>
                        </div>

                        {/* ---------- TABS ---------- */}
                        <div className="LV_tabs">
                            {["summary", "loaner", "repayment", "disbursement", "intent"].map((tab) => (
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
                        {activeTab === "repayment" && (
                            <div className="LV_tab_content">

                                <div className="LV_card" style={{ marginBottom: 20 }}>
                                    <h4>Repayment Details</h4>

                                    <div className="LV_horizontal">
                                        <div className="LV_h_item"><span>EMI</span><p>{formatCurrency(data.emiAmount)}</p></div>
                                        <div className="LV_h_item"><span>Total Paid</span><p>{formatCurrency(data.totalPaidTillDate)}</p></div>
                                        <div className="LV_h_item"><span>Outstanding</span><p>{formatCurrency(data.outstandingPrincipal)}</p></div>
                                        <div className="LV_h_item"><span>Next Due</span><p>{data.nextDueDate}</p></div>
                                    </div>
                                </div>

                                <div className="LV_card">
                                    <h4>Repayment Schedule</h4>

                                    <table className="LV_table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Due Date</th>
                                                <th>Principal</th>
                                                <th>Interest</th>
                                                <th>TDS</th>
                                                <th>Interest After TDS</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {sortedInstallments.map((emi) => (
                                                <tr key={emi.scheduleId}>
                                                    <td>{emi.installmentNumber}</td>
                                                    <td>{emi.dueDate}</td>

                                                    <td>{formatCurrency(emi.principalComponent)}</td>
                                                    <td>{formatCurrency(emi.interestComponent)}</td>

                                                    {/* Backend values */}
                                                    <td>{formatCurrency(emi.tdsAmount)}</td>
                                                    <td>{formatCurrency(emi.interestAfterTds)}</td>

                                                    <td>{formatCurrency(emi.totalDue)}</td>

                                                    <td>
                                                        <span
                                                            className={
                                                                emi.paymentStatus === "SUCCESS"
                                                                    ? "status-success"
                                                                    : "status-pending"
                                                            }
                                                        >
                                                            {emi.paymentStatus}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {emi.paymentStatus === "SUCCESS" ? (
                                                            <button className="btn btn-sm btn-success" disabled>
                                                                Paid
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => openConfirmModal(emi)}
                                                            >
                                                                Mark as Paid
                                                            </button>
                                                        )}
                                                    </td>
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


        </>
    );
};

export default LoanView;
