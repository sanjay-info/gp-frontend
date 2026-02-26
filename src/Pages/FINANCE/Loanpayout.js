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
    const isInReview = paymentStatus?.value === "INREVIEW"; // ✅ Correct for API
    const [loanPaymentType, setLoanPaymentType] = useState(null);
    const loanPaymentTypeOptions = useMemo(
        () => [
            { value: "INSTALLMENT", label: "Installment" },
            { value: "PartPayment", label: "Part Payment" },
            { value: "Foreclosure", label: "Foreclosure" },
        ],
        []
    );




    /* ---------------- Dropdown options ---------------- */
    const paymentStatusOptions = useMemo(
        () => [
            { value: "PAID", label: "PAID" },
            { value: "INREVIEW", label: "IN REVIEW" }, // ✅ space matches API
            { value: "APPROVED", label: "APPROVED" },
            { value: "NOT PAID", label: "NOT PAID" },
            { value: "REJECTED", label: "REJECTED" },
        ],
        []
    );

    const accountTypeOptions = useMemo(
        () => [
            { value: "Company", label: "COMPANY" },
            { value: "Individual", label: "INDIVIDUAL" },
            { value: "Bank", label: "Bank" },
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

        setFromDate(formatDate(firstDayOfMonth));
        setToDate(formatDate(today));

        setPaymentStatus({ value: "NOT PAID", label: "NOT PAID" });
        setAccountType({ value: "Individual", label: "INDIVIDUAL" });
        setLoanPaymentType({ value: "INSTALLMENT", label: "INSTALLMENT" });
    }, []);


    useEffect(() => {
        if (!paymentStatus || !accountType || !loanPaymentType || !fromDate || !toDate) return;

        setLoading(true);

        const body = new URLSearchParams();
        body.append("fromDate", fromDate);
        body.append("toDate", toDate);
        body.append("paymentStatus", paymentStatus.value);       // "NOT PAID"
        body.append("loanPaymentType", loanPaymentType.value);   // INSTALLMENT / PART_PAYMENT / etc.
        body.append("accountType", accountType.value);
        body.append("page", 0);
        body.append("size", 5);

        PostApi(
            "POST",
            "/user/loan-paymentdetails",
            body,
            {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            }
        )
            .then((res) => {
                console.log("API response:", res?.data);

                const content = res?.data?.content || [];
                setData(content);
                setSelectedIds([]);

                if (isApproved) {
                    setRowForms((prev) => {
                        const updated = { ...prev };
                        content.forEach((row) => {
                            if (!updated[row.paymentId]) {
                                updated[row.paymentId] = {
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
    }, [paymentStatus, accountType, loanPaymentType, fromDate, toDate]);


    const getVisibleColumns = (columns, data) => {
        return columns.filter(col => {
            if (!col.field) return true; // keep action/render-only columns

            return data.some(row =>
                row[col.field] !== null &&
                row[col.field] !== undefined &&
                row[col.field] !== ""
            );
        });
    };

    /* ---------------- Columns ---------------- */
    const columns = useMemo(
        () => [
            {
                title: "",
                width: "44px",
                sorting: false,
                searchable: false,
                cellStyle: {
                    padding: "0 6px",
                    textAlign: "center",
                },
                headerStyle: {
                    padding: "0 6px",
                },
                render: (row) =>
                    (isApproved || isNotPaid) && (
                        <input
                            type="checkbox"
                            style={{ transform: "scale(0.85)" }}
                            checked={selectedIds.some(
                                (r) => r.paymentId === row.paymentId
                            )}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                                setSelectedIds((prev) =>
                                    e.target.checked
                                        ? [...prev, row] // ✅ store whole row
                                        : prev.filter(
                                            (r) => r.paymentId !== row.paymentId
                                        )
                                )
                            }
                        />
                    ),

            },

            { title: "Installment ID", field: "installmentId" },

            {
                title: "Installment Type",
                field: "loanPaymentType", // INSTALLMENT
            },

            {
                title: "Due Date",
                field: "dueDate",
                render: (row) => new Date(row.dueDate).toLocaleDateString(),
            },

            {
                title: "Installment Amount",
                field: "installmentAmount",
                render: (row) =>
                    row.installmentAmount.toLocaleString("en-IN"),
            },

            {
                title: "Actual Amount To Pay",
                field: "actualAmountToPay",
                render: (row) => (
                    <strong>
                        {row.actualAmountToPay?.toLocaleString("en-IN")}
                    </strong>
                ),
            },

            {
                title: "Status",
                render: (row) => (
                    <strong
                        style={{
                            color:
                                row.paymentStatus === "NOT PAID"
                                    ? "orange"
                                    : row.paymentStatus === "PAID"
                                        ? "green"
                                        : "blue",
                        }}
                    >
                        {row.paymentStatus}
                    </strong>
                ),
            },
        ],
        [isApproved, isNotPaid, selectedIds]
    );
    const visibleColumns = useMemo(() => {
        return getVisibleColumns(columns, data);
    }, [columns, data]);


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
                                value={rowForms[r.paymentId]?.transactionNumber || ""}
                                onChange={(e) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.paymentId]: {
                                            ...p[r.paymentId],
                                            transactionNumber: e.target.value,
                                        },
                                    }))
                                }
                            />
                        </Col>
                        <Col md={3}>
                            <Select
                                options={paymentModeOptions}
                                value={rowForms[r.paymentId]?.paymentMode || null}
                                onChange={(v) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.paymentId]: {
                                            ...p[r.paymentId],
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
                                value={rowForms[r.paymentId]?.paymentDate || ""}
                                onChange={(e) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.paymentId]: {
                                            ...p[r.paymentId],
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
                                value={rowForms[r.paymentId]?.notes || ""}
                                onChange={(e) =>
                                    setRowForms((p) => ({
                                        ...p,
                                        [r.paymentId]: {
                                            ...p[r.paymentId],
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
            selectedIds.some((item) => item.paymentId === row.paymentId)
        );

        if (!rowsToPayout.length) {
            alert("Please select at least one record");
            return;
        }

        // Validate all rows before API call
        for (let row of rowsToPayout) {
            const form = latestRowForms[row.paymentId];

            if (
                !form ||
                !form.transactionNumber ||
                !form.paymentMode?.value ||
                !form.paymentDate
            ) {
                alert(`Please fill all fields for Loan Number: ${row.loanNumber}`);
                return;
            }
        }

        try {
            const isInstallment =
                selectedIds[0]?.loanPaymentType === "INSTALLMENT"; // ✅ fixed

            const apiUrl = isInstallment
                ? `/user/installments/success`
                : `/user/payments/bulk-success`;

            const paymentsPayload = rowsToPayout.map((row) => {
                const form = latestRowForms[row.paymentId];

                return {
                    paymentId: row.paymentId,
                    transactionNumber: form.transactionNumber,
                    modeOfPayment: form.paymentMode.value,
                    paymentDate: form.paymentDate,
                    notes: form.notes || "",
                };
            });

            const response = await PostApi(
                "POST",
                apiUrl,
                { payments: paymentsPayload },
                jsonHeaders
            );

            // ✅ If status is 200
            if (response?.status === 200) {
                alert("Bulk payout completed successfully");

                setData((prev) =>
                    prev.filter(
                        (row) =>
                            !selectedIds.some(
                                (item) => item.paymentId === row.paymentId
                            )
                    )
                );

                setSelectedIds([]);
            } else {
                alert(response?.data?.message || "Bulk payout failed");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong while processing payout");
        }
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
            selectedIds.map(row => row.paymentId),
            jsonHeaders
        );

        setData((prev) =>
            prev.filter(
                (row) => !selectedIds.some(r => r.paymentId === row.paymentId)
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

                        <Row className="mt-4 g-3" style={{ justifyContent: "end", padding: "10px" }}>
                            <Col md={2}>
                                <Select
                                    placeholder="Payment Status"
                                    options={paymentStatusOptions}
                                    value={paymentStatus}
                                    onChange={setPaymentStatus}
                                />
                            </Col>

                            <Col md={2}>
                                <Select
                                    placeholder="Account Type"
                                    options={accountTypeOptions}
                                    value={accountType}
                                    onChange={setAccountType}
                                />
                            </Col>

                            <Col md={2}>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </Col>

                            <Col md={2}>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </Col>
                            <Col md={2}>
                                <Select
                                    placeholder="Loan Payment Type"
                                    options={loanPaymentTypeOptions}
                                    value={loanPaymentType}
                                    onChange={setLoanPaymentType}
                                />
                            </Col>
                        </Row>

                        <MaterialTable
                            columns={visibleColumns}
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