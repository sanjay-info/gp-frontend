import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { useLocation, useNavigate } from "react-router-dom";
import "./IntentView.css";

/* ---------- UTIL ---------- */
const formatCurrency = (value) =>
    value !== null && value !== undefined
        ? `₹ ${Number(value).toLocaleString("en-IN")}`
        : "—";

const getStatusColor = (status) => {
    if (status === "APPROVED") return "green";
    if (status === "REJECTED") return "red";
    if (status === "NEEDS REVIEW") return "orange";
    return "#374151";
};

const IntentView = () => {
    const { sideBarCollapse } = useSidebar();
    const { PostApi } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const intentId = location.state?.id;
    const [intent, setIntent] = useState(null);
    const [activeTab, setActiveTab] = useState("summary");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    /* ---------- FETCH INTENT DETAILS ---------- */
    useEffect(() => {
        if (!intentId) return;

        const fetchIntentDetails = async () => {
            try {
                const res = await PostApi(
                    "POST",
                    `/user/loanintent/id?id=${intentId}`,
                    null,
                    headers
                );

                if (res?.status === 200) {
                    setIntent(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching intent details:", error);
            }
        };

        fetchIntentDetails();
    }, [intentId]);

    if (!intent) {
        return (
            <div className="p-5 text-center">
                <h4>No Intent Details Found</h4>
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
                    <div className="IntentViewContainer">

                        {/* ---------- HEADER ---------- */}
                        <div className="IV_header">
                            <h2>Loan Intent Details</h2>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                ← Back
                            </button>
                        </div>

                        {/* ---------- TABS ---------- */}
                        <div className="LV_tabs">
                            {[
                                { id: "summary", label: "Summary" },
                                { id: "applications", label: "Applications" },
                            ].map((tab) => (
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
                            <div className="IV_card">

                                {/* ================= SUMMARY ================= */}
                                {activeTab === "summary" && (
                                    <>
                                        <h4>Intent Summary</h4>

                                        <div className="IV_row">
                                            <span>Intent Name</span>
                                            <p>{intent.name}</p>
                                        </div>

                                        <div className="IV_row">
                                            <span>Status</span>
                                            <p
                                                style={{
                                                    color: getStatusColor(intent.intentStatus?.intentStatus),
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {intent.intentStatus?.intentStatus || "—"}
                                            </p>
                                        </div>

                                        <div className="IV_row">
                                            <span>Required Amount</span>
                                            <p>{formatCurrency(intent.requiredAmount)}</p>
                                        </div>

                                        {/* <div className="IV_row">
                                            <span>Generated Amount</span>
                                            <p>{formatCurrency(intent.generatedAmount)}</p>
                                        </div>

                                        <div className="IV_row">
                                            <span>Pending Amount</span>
                                            <p>{formatCurrency(intent.pendingAmount)}</p>
                                        </div> */}

                                        <div className="IV_row">
                                            <span>Active</span>
                                            <p
                                                style={{
                                                    color: intent.status ? "green" : "red",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {intent.status ? "Yes" : "No"}
                                            </p>
                                        </div>

                                        {/* ---------- DESCRIPTION ---------- */}
                                        <div className="IV_row" style={{ borderBottom: "none" }}>
                                            <span>Description</span>
                                            <p>{intent.description || "No description provided"}</p>
                                        </div>
                                    </>
                                )}

                                {/* ================= APPLICATIONS ================= */}
                                {activeTab === "applications" && (
                                    <>
                                        <h4>Linked Applications</h4>

                                        {intent.applications?.length > 0 ? (
                                            <table className="IV_table">
                                                <thead>
                                                    <tr>
                                                        <th>Loan Application ID</th>
                                                        <th>Loaner Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {intent.applications.map((app, index) => (
                                                        <tr key={index}>
                                                            <td>{app.loanApplicationId}</td>
                                                            <td>{app.loanerName}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/LoanApplicationView/${app.loanApplicationId}`
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="IV_empty">
                                                No applications linked to this intent.
                                            </p>
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

export default IntentView;
