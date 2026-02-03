import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import Select from "react-select";
import { Row, Col, Button } from "react-bootstrap";
import TableOptions from "../components/TableOptions";

const LoanPayout = () => {
    const { sideBarCollapse } = useSidebar();
    const { PostApi } = useAppContext();

    const token = localStorage.getItem("token");

    const jsonHeaders = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const formHeaders = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    /* ---------------- Filters ---------------- */
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [accountType, setAccountType] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    /* ---------------- Table ---------------- */
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ---------------- Selection ---------------- */
    const [selectedIds, setSelectedIds] = useState([]);

    /* ---------------- Inline form ---------------- */
    const [rowForms, setRowForms] = useState({});
    const [paymentModeOptions, setPaymentModeOptions] = useState([]);

    const isApproved = paymentStatus?.value === "APPROVED";
    const isNotPaid = paymentStatus?.value === "NOT PAID";
    const isInReview = paymentStatus?.value === "IN REVIEW"; // ✅ Correct for API

    /* ---------------- Dropdown options ---------------- */
    const paymentStatusOptions = useMemo(
        () => [
            { value: "PAID", label: "PAID" },
            { value: "IN REVIEW", label: "IN REVIEW" }, // ✅ space matches API
            { value: "APPROVED", label: "APPROVED" },
            { value: "NOT PAID", label: "NOT PAID" },
            { value: "REJECTED", label: "REJECTED" },
        ],
        []
    );

    const accountTypeOptions = useMemo(
        () => [
            { value: "COMPANY", label: "COMPANY" },
            { value: "INDIVIDUAL", label: "INDIVIDUAL" },
            { value: "BANK", label: "BANK" },
        ],
        []
    );

    /* ---------------- Fetch payment modes ---------------- */
    useEffect(() => {
        PostApi("POST", "/userbond/modeOfPayment", {}, jsonHeaders)
            .then((res) => {
                setPaymentModeOptions(
                    (res?.data || []).map((m) => ({
                        value: m.name || m,
                        label: m.name || m,
                    }))
                );
            })
            .catch(() => {
                setPaymentModeOptions([
                    { value: "UPI", label: "UPI" },
                    { value: "NEFT", label: "NEFT" },
                    { value: "IMPS", label: "IMPS" },
                ]);
            });
    }, []);

    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        setFromDate(formatDate(firstDayOfMonth)); // this month first date
        setToDate(formatDate(today));             // today date

        setPaymentStatus({ value: "NOT PAID", label: "NOT PAID" });
        setAccountType({ value: "INDIVIDUAL", label: "INDIVIDUAL" });
    }, []);


    /* ---------------- Fetch payouts ---------------- */
    useEffect(() => {
        if (!paymentStatus || !accountType || !fromDate || !toDate) return;

        setLoading(true);

        const payload = new URLSearchParams();
        payload.append("fromDate", fromDate);
        payload.append("toDate", toDate);
        payload.append("paymentStatus", paymentStatus.value);
        payload.append("accountType", accountType.value);

        PostApi("POST", "/user/repayment-schedules", payload, formHeaders)
            .then((res) => {
                console.log("API response:", res?.data); // ✅ debug
                const content = res?.data?.content || [];
                setData(content);
                setSelectedIds([]);

                // Initialize inline forms only for approved
                if (isApproved) {
                    setRowForms((prev) => {
                        const updated = { ...prev };
                        content.forEach((row) => {
                            if (!updated[row.scheduleId]) {
                                updated[row.scheduleId] = {
                                    transactionNumber: "",
                                    paymentMode: null,
                                    paymentDate: "",
                                    notes: "",
                                };
                            }
                        });
                        return updated;
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [paymentStatus, accountType, fromDate, toDate]);

    /* ---------------- Columns ---------------- */
    const columns = useMemo(
        () => [
            {
                title: "",
                render: (row) => {
                    if (isApproved || isNotPaid) {
                        return (
                            <input
                                type="checkbox"
                                checked={selectedIds.some(r => r.scheduleId === row.scheduleId)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                    setSelectedIds((prev) =>
                                        e.target.checked
                                            ? [...prev, row]
                                            : prev.filter(r => r.scheduleId !== row.scheduleId)
                                    )
                                }
                            />

                        );
                    }
                    return null; // ✅ no checkbox for IN REVIEW
                },
            },
            { title: "Loaner Name", field: "loanerName" },
            { title: "Loan Number", field: "loanNumber" },
            { title: "Installment ID", field: "installmentId" },
            { title: "Due Date", field: "dueDate" },
            {
                title: "Status",
                render: (row) => (
                    <strong style={{ color: isInReview ? "blue" : "orange" }}>
                        {row.paymentStatus}
                    </strong>
                ),
            },
        ],
        [isApproved, isNotPaid, isInReview, selectedIds]
    );

    /* ---------------- Detail panel for approved only ---------------- */
    const detailPanel = useCallback(
        (row) => {
            if (!isApproved) return null;
            const r = row.rowData;
            return (
                <div className="p-3 bg-light">
                    <Row className="g-3 mb-3">
                        <Col md={3}>
                            <input
                                className="form-control"
                                placeholder="Transaction No"
                                value={rowForms[r.scheduleId]?.transactionNumber || ""}
                                onChange={(e) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.scheduleId]: {
                                            ...p[r.scheduleId],
                                            transactionNumber: e.target.value,
                                        },
                                    }))
                                }
                            />
                        </Col>
                        <Col md={3}>
                            <Select
                                options={paymentModeOptions}
                                value={rowForms[r.scheduleId]?.paymentMode || null}
                                onChange={(v) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.scheduleId]: {
                                            ...p[r.scheduleId],
                                            paymentMode: v,
                                        },
                                    }))
                                }
                            />
                        </Col>
                        <Col md={3}>
                            <input
                                type="date"
                                className="form-control"
                                value={rowForms[r.scheduleId]?.paymentDate || ""}
                                onChange={(e) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.scheduleId]: {
                                            ...p[r.scheduleId],
                                            paymentDate: e.target.value,
                                        },
                                    }))
                                }
                            />
                        </Col>
                        <Col md={3}>
                            <input
                                className="form-control"
                                placeholder="Notes"
                                value={rowForms[r.scheduleId]?.notes || ""}
                                onChange={(e) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.scheduleId]: {
                                            ...p[r.scheduleId],
                                            notes: e.target.value,
                                        },
                                    }))
                                }
                            />
                        </Col>
                    </Row>
                </div>
            );
        },
        [rowForms, paymentModeOptions, isApproved]
    );

    /* ---------------- Bulk payout for approved only ---------------- */
    const handleBulkPayout = async (latestRowForms) => {
        const rowsToPayout = data.filter((row) =>
            selectedIds.includes(row.scheduleId)
        );

        for (let row of rowsToPayout) {
            const form = latestRowForms[row.scheduleId];
            if (!form || !form.transactionNumber || !form.paymentMode?.value || !form.paymentDate) {
                alert(`Please fill all fields for Loan Number: ${row.loanNumber}`);
                return;
            }
        }

        const paymentsPayload = rowsToPayout.map((row) => {
            const form = latestRowForms[row.scheduleId];
            return {
                scheduleId: row.scheduleId,
                transactionNumber: form.transactionNumber,
                modeOfPayment: form.paymentMode.value,
                paymentDate: form.paymentDate,
                notes: form.notes || "",
            };
        });

        await PostApi("POST", "/user/installments/success", { payments: paymentsPayload }, jsonHeaders);

        setData((prev) => prev.filter((row) => !selectedIds.includes(row.scheduleId)));
        setSelectedIds([]);
    };

    /* ---------------- Submit for approval for not paid only ---------------- */
    const handleSubmitForApproval = async () => {
        if (selectedIds.length === 0) return;
        console.log(selectedIds)
        const isInstallment =
            selectedIds.loanPaymentType === "INSTALLMENT";

        const apiUrl = isInstallment
            ? `/user/installments/submit`
            : `/user/payments/bulk-submit`;

        await PostApi(
            "POST",
            apiUrl,
            selectedIds.map(row => row.scheduleId),
            jsonHeaders
        );

        setData((prev) =>
            prev.filter(
                (row) => !selectedIds.some(r => r.scheduleId === row.scheduleId)
            )
        );

        setSelectedIds([]);
    };

    const tableOptions = useMemo(
        () => ({
            ...TableOptions(),
            detailPanelType: "single",
            selection: false,
        }),
        []
    );

    return (
        <>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <span className="welcome_text">Loan Payout</span>

                        <Row className="mt-4 g-3">
                            <Col md={3}>
                                <Select
                                    placeholder="Payment Status"
                                    options={paymentStatusOptions}
                                    value={paymentStatus}
                                    onChange={setPaymentStatus}
                                />
                            </Col>

                            <Col md={3}>
                                <Select
                                    placeholder="Account Type"
                                    options={accountTypeOptions}
                                    value={accountType}
                                    onChange={setAccountType}
                                />
                            </Col>

                            <Col md={3}>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </Col>

                            <Col md={3}>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </Col>
                        </Row>

                        <MaterialTable
                            columns={columns}
                            data={data}
                            title=""
                            isLoading={loading}
                            options={tableOptions}
                            detailPanel={isApproved ? detailPanel : undefined}
                        />


                        {isApproved && selectedIds.length > 0 && (
                            <div className="mt-3">
                                <Button
                                    variant="primary"
                                    className="px-4 fw-semibold"
                                    onClick={() => handleBulkPayout(JSON.parse(JSON.stringify(rowForms)))}
                                >
                                    Payout Loan
                                </Button>
                            </div>
                        )}

                        {isNotPaid && selectedIds.length > 0 && (
                            <div className="mt-3">
                                <Button
                                    variant="primary"
                                    className="px-4 fw-semibold"
                                    onClick={handleSubmitForApproval}
                                >
                                    Submit for Approval
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoanPayout;