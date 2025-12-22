import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { useNavigate, useParams } from "react-router-dom";

/* ---------- UTIL ---------- */
const formatCurrency = (value) =>
    value !== null && value !== undefined
        ? `₹ ${Number(value).toLocaleString("en-IN")}`
        : "—";

const getStatusColor = (status) => {
    if (status === "DISBURSED") return "green";
    if (status === "APPROVED") return "#2563eb";
    if (status === "REJECTED") return "red";
    return "#374151";
};

const LoanApplicationView = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const { loanApplicationId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState("summary");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const [loans, setLoans] = useState([]);
    const [loadingLoans, setLoadingLoans] = useState(false);


    /* ---------- FETCH DETAILS ---------- */
    useEffect(() => {
        if (!loanApplicationId) return;

        const fetchDetails = async () => {
            try {
                const res = await PostApi(
                    "GET",
                    `/user/loanApplication/${loanApplicationId}`,
                    null,
                    headers
                );

                if (res?.status === 200) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch loan application", error);
            }
        };

        fetchDetails();
    }, [loanApplicationId]);

    useEffect(() => {
        if (activeTab !== "loans") return;

        const fetchLoans = async () => {
            try {
                setLoadingLoans(true);

                const res = await PostApi(
                    "GET",
                    `/user/loanApplication/${loanApplicationId}/loans`,
                    null,
                    headers
                );

                if (res?.status === 200) {
                    setLoans(res.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch loans", err);
                setLoans([]);
            } finally {
                setLoadingLoans(false);
            }
        };

        fetchLoans();
    }, [activeTab, loanApplicationId]);


    if (!data) {
        return (
            <div className="p-5 text-center">
                <h4>No Loan Application Details Found</h4>
                <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
                    ← Back
                </button>
            </div>
        );
    }

    return (
        <>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="LoanViewContainer">

                        {/* ---------- HEADER ---------- */}
                        <div className="LV_title_header">
                            <h2>Loan Application Details</h2>
                            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                ← Back
                            </button>
                        </div>

                        {/* ---------- TABS ---------- */}
                        <div className="LV_tabs">
                            {[
                                { id: "summary", label: "Summary" },
                                { id: "loans", label: "Loans" },
                            ]
                                .map((tab) => (
                                    <div
                                        key={tab.id}
                                        className={`LV_tab ${activeTab === tab.id ? "active" : ""}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.label}
                                    </div>
                                ))}
                        </div>

                        {/* ---------- TAB CONTENT ---------- */}
                        <div className="LV_tab_content">
                            <div className="LV_card">

                                {/* ================= SUMMARY ================= */}
                                {activeTab === "summary" && (
                                    <>
                                        <h4>Application Summary</h4>

                                        {/* ===== BASIC DETAILS ===== */}
                                        <div className="LV_grid">
                                            <div className="LV_row">
                                                <span>Application ID</span>
                                                <p>{data.loanApplicationId}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Application Date</span>
                                                <p>{data.applicationDate || "—"}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Loaner Name</span>
                                                <p>{data.loanerName}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Loan Intent</span>
                                                <p>{data.loanIntent}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Loan Type</span>
                                                <p>{data.loanType || "—"}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Status</span>
                                                <p
                                                    style={{
                                                        color: getStatusColor(data.applicationStatus),
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {data.applicationStatus || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ===== AMOUNT DETAILS ===== */}
                                        <h4 style={{ marginTop: "24px" }}>Amount Details</h4>

                                        <div className="LV_grid">
                                            {/* Requested */}
                                            <div className="LV_row">
                                                <span>Requested Amount</span>
                                                <p>{formatCurrency(data.amountRequested)}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Application Date</span>
                                                <p>{data.applicationDate || "—"}</p>
                                            </div>

                                            {/* Sanctioned */}
                                            <div className="LV_row">
                                                <span>Sanctioned Amount</span>
                                                <p>{formatCurrency(data.amountSanctioned)}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Sanctioned Date</span>
                                                <p>{data.sanctionDate || "—"}</p>
                                            </div>

                                            {/* Disbursed */}
                                            <div className="LV_row">
                                                <span>Disbursed Amount</span>
                                                <p>{formatCurrency(data.amountDisbursed)}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Disbursement Date</span>
                                                <p>{data.disbursementDate || "—"}</p>
                                            </div>

                                            {/* EMI & Charges */}
                                            <div className="LV_row">
                                                <span>EMI Amount</span>
                                                <p>{formatCurrency(data.emiAmount)}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Processing Fee</span>
                                                <p>{formatCurrency(data.processingFee)}</p>
                                            </div>

                                            <div className="LV_row">
                                                <span>Other Charges</span>
                                                <p>{formatCurrency(data.otherCharges)}</p>
                                            </div>
                                        </div>


                                        {/* ===== LOAN TERMS ===== */}
                                        <h4 style={{ marginTop: "24px" }}>Loan Terms</h4>

                                        <div className="LV_grid">
                                            <div className="LV_row"><span>Interest Rate</span><p>{data.interestRate ? `${data.interestRate}%` : "—"}</p></div>
                                            <div className="LV_row"><span>Interest Type</span><p>{data.interestType || "—"}</p></div>
                                            <div className="LV_row"><span>Tenure</span><p>{data.tenureMonths} Months</p></div>
                                            <div className="LV_row"><span>Repayment Frequency</span><p>{data.repaymentFrequency || "—"}</p></div>
                                        </div>

                                        {/* ===== SECURITY DETAILS ===== */}
                                        <h4 style={{ marginTop: "24px" }}>Security Details</h4>

                                        <div className="LV_grid">
                                            <div className="LV_row"><span>Security Required</span><p>{data.securityRequired || "—"}</p></div>
                                            <div className="LV_row"><span>Security Type</span><p>{data.securityType || "—"}</p></div>
                                            <div className="LV_row"><span>Collateral Value</span><p>{formatCurrency(data.collateralValue)}</p></div>
                                            <div className="LV_row"><span>Credit Rating</span><p>{data.creditRating || "—"}</p></div>
                                        </div>

                                        {/* ===== REMARKS ===== */}
                                        <h4 style={{ marginTop: "24px" }}>Remarks</h4>
                                        <div className="LV_row" style={{ borderBottom: "none" }}>
                                            <span>Comments</span>
                                            <p>{data.remarks || "—"}</p>
                                        </div>
                                    </>
                                )}

                                {/* ================= LOANS ================= */}
                                {activeTab === "loans" && (
                                    <>
                                        <h4>Loans Created from this Application</h4>

                                        {loadingLoans ? (
                                            <p>Loading loans...</p>
                                        ) : loans.length > 0 ? (
                                            <div className="LV_table_wrapper">
                                                <table className="LV_table">
                                                    <thead>
                                                        <tr>
                                                            <th>Loan Number</th>
                                                            <th>Loan Name</th>
                                                            <th>Sanctioned Amount</th>
                                                            <th>Disbursed Amount</th>
                                                            <th>EMI Amount</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {loans.map((loan) => (
                                                            <tr key={loan.loanId}>
                                                                <td>{loan.loanNumber}</td>
                                                                <td>{loan.loanName}</td>
                                                                <td>{formatCurrency(loan.sanctionedAmount)}</td>
                                                                <td>{formatCurrency(loan.disbursedAmount)}</td>
                                                                <td>{formatCurrency(loan.emiAmount)}</td>
                                                                <td
                                                                    style={{
                                                                        color: loan.loanStatus === "Active" ? "green" : "red",
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {loan.loanStatus}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => navigate(`/LoanView/${loan.loanId}`)}
                                                                    >
                                                                        View
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p>No loans created for this application.</p>
                                        )}
                                    </>
                                )}


                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default LoanApplicationView;
