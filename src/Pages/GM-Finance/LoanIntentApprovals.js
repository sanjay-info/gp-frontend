import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
} from "react-icons/fa";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

const STATUS_MAP = {
    pending: "INREVIEW",
    approved: "APPROVED",
    rejected: "REJECTED",
};

const LoanIntentApprovals = () => {
    const { GetApi, PutApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const { status } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const tableRef = useRef(null);

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const apiStatus = STATUS_MAP[status];

    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        tableRef.current?.onQueryChange();
    }, [location.pathname]);

    /* ---------------- FETCH DATA ---------------- */
    const fetchTableData = () =>
        new Promise(async (resolve) => {
            try {
                const res = await GetApi(
                    "GET",
                    `/user/loanintent/status/${apiStatus}`,
                    null,
                    headers
                );

                if (res?.status === 200) {
                    resolve({
                        data: res.data || [],
                        page: 0,
                        totalCount: res.data?.length || 0,
                    });
                } else {
                    resolve({ data: [], page: 0, totalCount: 0 });
                }
            } catch (err) {
                console.error("Loan Intent fetch failed", err);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });

    /* ---------------- APPROVE / REJECT ---------------- */
    const handleActionSubmit = async () => {
        if (!selectedRow) return;

        if (actionType === "REJECT" && !remarks.trim()) return;

        try {
            setActionLoading(true);

            let apiUrl = "";

            if (actionType === "APPROVE") {
                apiUrl = `/user/loanintent/approve/${selectedRow.loanIntentId}`;
            } else {
                apiUrl = `/user/loanintent/reject/${selectedRow.loanIntentId}?reason=${encodeURIComponent(remarks)}`;
            }

            const res = await PutApi(
                "PUT",
                apiUrl,
                null,
                headers
            );

            if (res?.status === 200) {
                closeActionModal();
                tableRef.current?.onQueryChange();
            }

        } catch (err) {
            console.error(`${actionType} failed`, err);
        } finally {
            setActionLoading(false);
        }
    };


    const closeActionModal = () => {
        setActionModalOpen(false);
        setActionType(null);
        setSelectedRow(null);
        setRemarks("");
    };

    /* ---------------- TABLE COLUMNS ---------------- */
    const columns = [
        {
            title: "Intent ID",
            field: "loanIntentId",
        },
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Required Amount",
            render: (row) =>
                row.requiredAmount
                    ? `₹ ${row.requiredAmount.toLocaleString()}`
                    : "—",
        },
        {
            title: "Generated Amount",
            render: (row) =>
                row.generatedAmount
                    ? `₹ ${row.generatedAmount.toLocaleString()}`
                    : "—",
        },
        {
            title: "Pending Amount",
            render: (row) =>
                row.pendingAmount
                    ? `₹ ${row.pendingAmount.toLocaleString()}`
                    : "—",
        },
        {
            title: "Requested By",
            render: (row) => row.requestedBy || "—",
        },
        {
            title: "Reviewed By",
            render: (row) => row.reviewedBy || "—",
        },
        {
            title: "Status",
            render: (row) => (
                <span
                    className={`LPA_status_chip ${row.intentStatus?.intentStatus?.toLowerCase() || ""
                        }`}
                >
                    {row.intentStatus?.intentStatus || "—"}
                </span>
            ),
        },
        {
            title: "Action",
            sorting: false,
            render: (row) => {
                const currentStatus = row.intentStatus?.intentStatus;

                return (
                    <div className="LPA_action_wrap">
                        {/* APPROVE */}
                        <FaCheckCircle
                            className={`LPA_action_icon approve ${currentStatus === "INREVIEW" ? "active" : "disabled"
                                }`}
                            title="Approve"
                            onClick={() => {
                                if (currentStatus !== "INREVIEW") return;
                                setSelectedRow(row);
                                setActionType("APPROVE");
                                setActionModalOpen(true);
                            }}
                        />

                        {/* REJECT */}
                        <FaTimesCircle
                            className={`LPA_action_icon reject ${currentStatus === "INREVIEW" ? "active" : "disabled"
                                }`}
                            title="Reject"
                            onClick={() => {
                                if (currentStatus !== "INREVIEW") return;
                                setSelectedRow(row);
                                setActionType("REJECT");
                                setActionModalOpen(true);
                            }}
                        />

                        {/* VIEW */}
                        {/* <FaEye
                            className="LPA_action_icon view"
                            title="View"
                            onClick={() =>
                                navigate(`/LoanIntentView/${row.loanIntentId}`)
                            }
                        /> */}
                    </div>
                );
            },
        },
    ];


    const pageTitle =
        status === "pending"
            ? "Loan Intent Approvals – Pending"
            : status === "approved"
                ? "Loan Intent Approvals – Approved"
                : "Loan Intent Approvals – Rejected";

    return (
        <div className="LPA_page">
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
                    <div className="Summary_card LPA_card">

                        <Box className="LPA_header">
                            <h2>{pageTitle}</h2>
                        </Box>

                        <MaterialTable
                            title=""
                            tableRef={tableRef}
                            columns={columns}
                            data={fetchTableData}
                            options={{
                                ...TableOptions(),
                                paging: false,
                                search: true,
                                toolbar: true,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ACTION MODAL */}
            <Dialog open={actionModalOpen} onClose={closeActionModal} fullWidth maxWidth="sm">
                <DialogTitle>
                    {actionType === "APPROVE"
                        ? "Approve Loan Intent"
                        : "Reject Loan Intent"}
                </DialogTitle>

                <DialogContent>
                    {actionType === "APPROVE" && (
                        <p>Are you sure you want to approve this loan intent?</p>
                    )}

                    {actionType === "REJECT" && (
                        <TextField
                            label="Rejection Remarks"
                            fullWidth
                            required
                            multiline
                            rows={3}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeActionModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        color={actionType === "APPROVE" ? "success" : "error"}
                        onClick={handleActionSubmit}
                        disabled={
                            actionLoading ||
                            (actionType === "REJECT" && !remarks.trim())
                        }
                    >
                        {actionLoading ? "Processing..." : actionType}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoanIntentApprovals;
