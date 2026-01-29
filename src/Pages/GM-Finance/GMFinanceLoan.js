import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Chip, Box } from "@mui/material";
import "./LoanPaymentApprovals.css";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaEllipsisV,
    FaEye,
    FaMoneyCheckAlt
} from "react-icons/fa";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";




const STATUS_MAP = {
    pending: "INREVIEW",
    approved: "APPROVED",
    rejected: "REJECTED",
};

const LoanPaymentApprovals = () => {
    const { GetApi, PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();
    const { status } = useParams();
    const location = useLocation();
    const tableRef = useRef(null);

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const apiStatus = STATUS_MAP[status];
    const navigate = useNavigate();


    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // "APPROVE" | "REJECT"
    const [selectedEmi, setSelectedEmi] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [activeMoreEmiId, setActiveMoreEmiId] = useState(null);

    const [markPaidOpen, setMarkPaidOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loadingPay, setLoadingPay] = useState(false);

    const [selectedInstallment, setSelectedInstallment] = useState({
        paymentId: null,
        paymentDate: "",
        transactionNumber: "",
        modeOfPayment: "",
        notes: "",
    });




    /* ---------- REFRESH TABLE ON ROUTE CHANGE ---------- */
    useEffect(() => {
        tableRef.current?.onQueryChange();
    }, [location.pathname]);

    /* ---------- FETCH DATA ---------- */
    const fetchTableData = () =>
        new Promise(async (resolve) => {
            try {
                const res = await GetApi(
                    "GET",
                    `/gmfinance/loan-payment-details?statuses=${apiStatus}&page=0&size=500`,
                    null,
                    headers
                );

                if (res?.status === 200) {
                    resolve({
                        data: res.data?.content || [],
                        page: res.data?.number || 0,
                        totalCount: res.data?.totalElements || 0,
                    });
                } else {
                    resolve({ data: [], page: 0, totalCount: 0 });
                }
            } catch (err) {
                console.error("Payment approvals fetch failed", err);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });

    const handleActionSubmit = async () => {
        if (!selectedEmi) return;
        if (actionType === "REJECT" && !remarks.trim()) return;

        try {
            setActionLoading(true);

            const isInstallment =
                selectedEmi.loanPaymentType === "INSTALLMENT";

            // -------- API URL DECISION --------
            let apiUrl = "";

            if (actionType === "APPROVE") {
                apiUrl = isInstallment
                    ? `/gmfinance/installment/${selectedEmi.paymentId}/approve`
                    : `/gmfinance/payment/${selectedEmi.paymentId}/approve`;
            } else {
                apiUrl = isInstallment
                    ? `/gmfinance/installment/${selectedEmi.paymentId}/reject`
                    : `/gmfinance/payment/${selectedEmi.paymentId}/reject`;
            }

            // -------- PAYLOAD --------
            const payload =
                actionType === "REJECT"
                    ? { remarks }
                    : null;

            const res = await PostApi(
                "POST",
                apiUrl,
                payload,
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
        setSelectedEmi(null);
        setRemarks("");
    };


    /* ---------- TABLE COLUMNS ---------- */
    const columns = [
        {
            title: "Loan ID",
            field: "loanId",
        },
        {
            title: "Payment Type",
            field: "loanPaymentType",
        },
        {
            title: "Installment Amount",
            render: (row) =>
                row.installmentAmount
                    ? `₹ ${row.installmentAmount.toLocaleString()}`
                    : "—",
        },
        {
            title: "Status",
            render: (row) => (
                <span className={`LPA_status_chip ${row.paymentStatus.toLowerCase()}`}>
                    {row.paymentStatus}
                </span>
            ),
        },
        {
            title: "Action",
            sorting: false,
            width: "180px",
            render: (row) => (
                <div className="LPA_action_wrap">

                    {/* APPROVE */}
                    <FaCheckCircle
                        className={`LPA_action_icon approve ${row.paymentStatus === "INREVIEW" ? "active" : "disabled"
                            }`}
                        title="Approve"
                        onClick={() => {
                            if (row.paymentStatus !== "INREVIEW") return;
                            setSelectedEmi(row);
                            setActionType("APPROVE");
                            setActionModalOpen(true);
                        }}
                    />

                    {/* REJECT */}
                    <FaTimesCircle
                        className={`LPA_action_icon reject ${row.paymentStatus === "INREVIEW" ? "active" : "disabled"
                            }`}
                        title="Reject"
                        onClick={() => {
                            if (row.paymentStatus !== "INREVIEW") return;
                            setSelectedEmi(row);
                            setActionType("REJECT");
                            setActionModalOpen(true);
                        }}
                    />

                    <FaEye
                        className="LPA_action_icon view"
                        title="View Details"
                        onClick={() => navigate(`/GMFinanceLoanView/${row.loanId}`)}


                    />


                    {/* MORE */}
                    <FaMoneyCheckAlt
                        className="LPA_action_icon markpaid"
                        title="Mark as Paid"
                        onClick={() => {
                            setSelectedInstallment({
                                paymentId: row.paymentId,
                                paymentDate: "",
                                transactionNumber: "",
                                modeOfPayment: "",
                                notes: "",
                            });
                            setMarkPaidOpen(true);
                        }}
                    />

                    {/* MARK AS PAID (INLINE ICON) */}
                    {activeMoreEmiId === row.paymentId && (
                        <FaMoneyCheckAlt
                            className="LPA_action_icon markpaid"
                            title="Mark as Paid"
                            onClick={() => {
                                setSelectedInstallment({
                                    paymentId: row.paymentId,
                                    paymentDate: "",
                                    transactionNumber: "",
                                    modeOfPayment: "",
                                    notes: "",
                                });
                                setMarkPaidOpen(true);
                            }}
                        />

                    )}
                </div>
            ),
        }

    ];

    const handleMarkAsPaid = async () => {
        if (!selectedInstallment) return;

        const payload = {
            paymentDate: selectedInstallment.paymentDate,
            transactionNumber: selectedInstallment.transactionNumber,
            modeOfPayment: selectedInstallment.modeOfPayment,
            notes: selectedInstallment.notes,
        };

        try {
            setLoadingPay(true);

            const isInstallment =
                selectedInstallment.loanPaymentType === "INSTALLMENT";

            const apiUrl = isInstallment
                ? `/user/installment/${selectedInstallment.paymentId}/success`
                : `/user/payment/${selectedInstallment.paymentId}/success`;

            await PostApi(
                "POST",
                apiUrl,
                payload,
                headers
            );

            setConfirmOpen(false);
            setMarkPaidOpen(false);
            tableRef.current?.onQueryChange();
        } catch (err) {
            console.error("Mark as Paid failed", err);
        } finally {
            setLoadingPay(false);
        }
    };



    const pageTitle =
        status === "pending"
            ? "Loan Payment Approvals – Pending"
            : status === "approved"
                ? "Loan Payment Approvals – Approved"
                : "Loan Payment Approvals – Rejected";



    return (
        <div className="LPA_page">
            <Header />
            <SidePanel />

            <div className="page_container">
                <div
                    className={sideBarCollapse ? "main_content" : "main_content collapsed"}
                >
                    <div className="Summary_card LPA_card">

                        {/* HEADER */}
                        <Box className="LPA_header">
                            <div>
                                <h2>{pageTitle}</h2>
                            </div>
                        </Box>

                        {/* TABLE */}
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
                                headerStyle: {
                                    backgroundColor: "#f9fafb",   // light gray
                                    color: "#111827",              // dark text
                                    fontWeight: 600,
                                    fontSize: "13px",
                                },
                            }}
                        />

                    </div>
                </div>
            </div>
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirm Payment</DialogTitle>

                <DialogContent>
                    Are you sure you want to mark this installment as <b>PAID</b>?
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleMarkAsPaid}
                        disabled={loadingPay}
                    >
                        {loadingPay ? "Processing..." : "Yes, Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={markPaidOpen}
                onClose={() => setMarkPaidOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Mark Installment as Paid</DialogTitle>

                <DialogContent>

                    <TextField
                        label="Payment Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={selectedInstallment.paymentDate}
                        onChange={(e) =>
                            setSelectedInstallment({
                                ...selectedInstallment,
                                paymentDate: e.target.value,
                            })
                        }
                    />

                    <TextField
                        label="Transaction Number"
                        fullWidth
                        margin="normal"
                        value={selectedInstallment.transactionNumber}
                        onChange={(e) =>
                            setSelectedInstallment({
                                ...selectedInstallment,
                                transactionNumber: e.target.value,
                            })
                        }
                    />

                    {/* ✅ MODE OF PAYMENT DROPDOWN */}
                    <TextField
                        select
                        label="Mode of Payment"
                        fullWidth
                        required
                        margin="normal"
                        value={selectedInstallment.modeOfPayment}
                        onChange={(e) =>
                            setSelectedInstallment({
                                ...selectedInstallment,
                                modeOfPayment: e.target.value,
                            })
                        }
                    >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="NEFT">NEFT</MenuItem>
                        <MenuItem value="IMPS">IMPS</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                        <MenuItem value="CASH">Cash</MenuItem>
                        <MenuItem value="CHEQUE">Cheque</MenuItem>
                    </TextField>

                    <TextField
                        label="Notes"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={selectedInstallment.notes}
                        onChange={(e) =>
                            setSelectedInstallment({
                                ...selectedInstallment,
                                notes: e.target.value,
                            })
                        }
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setMarkPaidOpen(false)}>Cancel</Button>

                    <Button
                        variant="contained"
                        onClick={() => setConfirmOpen(true)}
                        disabled={
                            !selectedInstallment.paymentDate ||
                            !selectedInstallment.modeOfPayment
                        }
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={actionModalOpen} onClose={closeActionModal} fullWidth maxWidth="sm">
                <DialogTitle>
                    {actionType === "APPROVE" ? "Approve Payment" : "Reject Payment"}
                </DialogTitle>

                <DialogContent>
                    {actionType === "APPROVE" && (
                        <p>Are you sure you want to approve this payment?</p>
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
                        disabled={actionLoading || (actionType === "REJECT" && !remarks.trim())}
                    >
                        {actionLoading ? "Processing..." : actionType}
                    </Button>
                </DialogActions>
            </Dialog>



        </div>
    );
};

export default LoanPaymentApprovals;
