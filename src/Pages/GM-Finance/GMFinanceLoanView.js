import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import MaterialTable from "@material-table/core";

const GMFinanceLoanView = () => {
    const { PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const { loanId } = useParams();
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [disbursements, setDisbursements] = useState([]);
    const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        if (loanId) fetchLoanDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loanId]);

    // ---------------- FETCH LOAN DETAILS ----------------
    const fetchLoanDetails = async () => {
        try {
            setLoading(true);

            const response = await PostApi(
                "GET",
                `/gmfinance/getLoanDetailsById/${loanId}`,
                null,
                headers
            );

            if (response?.data?.loan) {
                setLoan(response.data.loan);
                setDisbursements(response.data.disbursements || []);
                setInstallments(response.data.installments || []);
                setErrorMsg("");
            } else {
                setErrorMsg("Loan details not found");
            }
        } catch (error) {
            console.error("GM Finance Loan View API Error:", error);
            setErrorMsg("Failed to fetch loan details");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div className="page_container">
                <Header />
                <SidePanel />
                <div className="main_content">
                    <div className="Summary_card">Loading...</div>
                </div>
            </div>
        );
    }

    // ---------------- ERROR ----------------
    if (errorMsg) {
        return (
            <Alert
                title="Error"
                msg={errorMsg}
                open={true}
                type="error"
                onClose={() => navigate(-1)}
            />
        );
    }

    return (
        <div>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div
                    className={
                        sideBarCollapse
                            ? "main_content"
                            : "main_content collapsed"
                    }
                >
                    <div className="Summary_card">
                        <div className="d-flex justify-content-between mb-3">
                            <h3>GM Finance – Loan Details</h3>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                        </div>

                        {/* ================= BASIC INFO ================= */}
                        <Section title="Basic Information">
                            <Detail label="Loan Number" value={loan.loanNumber} />
                            <Detail label="Application No" value={loan.applicationNumber} />
                            <Detail label="Loan Name" value={loan.loanName} />
                            <Detail label="Loaner Name" value={loan.loanerName} />
                            <Detail label="Status" value={loan.loanStatus} />
                        </Section>

                        {/* ================= FINANCIAL ================= */}
                        <Section title="Financial Summary">
                            <Detail label="Sanctioned Amount" value={formatMoney(loan.sanctionedAmount)} />
                            <Detail label="Disbursed Amount" value={formatMoney(loan.disbursedAmount)} />
                            <Detail label="Outstanding Principal" value={formatMoney(loan.outstandingPrincipal)} />
                            <Detail label="EMI Amount" value={formatMoney(loan.emiAmount)} />
                        </Section>

                        {/* ================= LOAN TERMS ================= */}
                        <Section title="Loan Terms">
                            <Detail label="Interest Rate" value={`${loan.interestRate}%`} />
                            <Detail label="Interest Type" value={loan.interestType} />
                            <Detail label="Tenure" value={`${loan.tenureMonths} months`} />
                            <Detail label="Repayment Frequency" value={loan.repaymentFrequency} />
                        </Section>

                        {/* ================= DISBURSEMENTS ================= */}
                        <Section title="Disbursements">
                            <MaterialTable
                                title=""
                                columns={[
                                    { title: "Tranche", field: "trancheNumber" },
                                    { title: "Amount", render: r => formatMoney(r.disbursementAmount) },
                                    { title: "Date", render: r => formatDate(r.disbursementDate) },
                                    { title: "UTR", field: "utrNumber" },
                                    { title: "Bank", field: "lenderBankName" },
                                ]}
                                data={disbursements}
                                options={{ paging: false, search: false }}
                            />
                        </Section>

                        {/* ================= EMI SCHEDULE ================= */}
                        <Section title="EMI Schedule">
                            <MaterialTable
                                title=""
                                columns={[
                                    { title: "EMI No", field: "installmentNumber" },
                                    { title: "Due Date", render: r => formatDate(r.dueDate) },
                                    { title: "Amount", render: r => formatMoney(r.installmentAmount) },
                                    { title: "Principal", render: r => formatMoney(r.principalComponent) },
                                    { title: "Interest", render: r => formatMoney(r.interestComponent) },
                                    { title: "Status", field: "paymentStatus" },
                                ]}
                                data={installments}
                                options={{ pageSize: 10 }}
                            />
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
    <>
        <h5 className="mt-4 mb-3">{title}</h5>
        <div className="row">{children}</div>
        <hr />
    </>
);

const Detail = ({ label, value }) => (
    <div className="col-md-4 mb-3">
        <small className="text-muted">{label}</small>
        <div className="fw-semibold">{value || "—"}</div>
    </div>
);

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "—";

const formatMoney = (amount) =>
    amount !== null && amount !== undefined
        ? `₹ ${amount.toLocaleString("en-IN")}`
        : "—";

export default GMFinanceLoanView;
