import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import MaterialTable from "@material-table/core";
import TableOptions from "../components/TableOptions";
import { useLocation } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Chip,
    Box,
    MenuItem,
} from "@mui/material";
import "./DocumentTemplate.css";

const DocumentTemplates = () => {
    const { GetApi, PostApi } = useAppContext();
    const { sideBarCollapse } = useSidebar();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const tableRef = useRef(null);
    const location = useLocation();

    /* ---------- STATES ---------- */
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [templateDetails, setTemplateDetails] = useState(null);

    const [masters, setMasters] = useState([]);

    const [form, setForm] = useState({
        documentName: "",
        documentTemplateMasterId: "",
        submissionOnly: false,
        receivableOnly: false,
        returnable: false,
    });
    const [docOpen, setDocOpen] = useState(false);
    const [docLoading, setDocLoading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const [docForm, setDocForm] = useState({
        documentName: "",
        loanApplicationId: "",
        loanId: "",
        submissionOnly: false,
        receivableOnly: false,
        returnable: false,
        description: "",
        documentTemplateId: ""
    });

    const [loanApplications, setLoanApplications] = useState([]);
    const [loans, setLoans] = useState([]);


    const loadLoanApplications = async () => {
        const res = await GetApi(
            "GET",
            "/user/getAllLoanApplications",
            null,
            headers
        );
        if (res?.status === 200) {
            setLoanApplications(res.data || []);
        }
    };

    const loadLoans = async () => {
        const res = await GetApi(
            "GET",
            "/user/getAllLoans",
            null,
            headers
        );
        if (res?.status === 200) {
            setLoans(res.data || []);
        }
    };
    useEffect(() => {
        loadLoanApplications();
        loadLoans();
    }, []);
    const loanMap = loanApplications.map(app => {
        const matchedLoan = loans.find(
            loan => loan.applicationNumber === `APP-${app.loanApplicationId}`
        );

        return {
            loanApplicationId: app.loanApplicationId,
            loanId: matchedLoan?.loanId || null,
            loanerName: app.loanerName,
            loanIntent: app.loanIntent,
            loanStatus: matchedLoan?.loanStatus,
        };
    });




    /* ---------- REFRESH TABLE ---------- */
    useEffect(() => {
        tableRef.current?.onQueryChange();
    }, [location.pathname]);

    /* ---------- LOAD DOCUMENT MASTERS ---------- */
    useEffect(() => {
        loadMasters();
    }, []);

    const loadMasters = async () => {
        try {
            const res = await GetApi(
                "GET",
                "/user/document/master-template",
                null,
                headers
            );
            if (res?.status === 200) {
                setMasters(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load document masters", err);
        }
    };

    /* ---------- FETCH TEMPLATE LIST ---------- */
    const fetchTableData = () =>
        new Promise(async (resolve) => {
            try {
                const res = await GetApi(
                    "GET",
                    "/user/document/document-template",
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
                console.error("Failed to fetch templates", err);
                resolve({ data: [], page: 0, totalCount: 0 });
            }
        });

    /* ---------- FETCH TEMPLATE DETAILS ---------- */
    const fetchTemplateDetails = async (templateId) => {
        try {
            setDetailsOpen(true);
            setDetailsLoading(true);
            setTemplateDetails(null);

            const res = await GetApi(
                "GET",
                `/user/document/document-template/${templateId}`,
                null,
                headers
            );

            if (res?.status === 200) {
                setTemplateDetails(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch template details", err);
        } finally {
            setDetailsLoading(false);
        }
    };

    /* ---------- SAVE TEMPLATE ---------- */
    const handleSave = async () => {
        try {
            setLoading(true);

            const payload = {
                documentName: form.documentName,
                documentTemplateMaster: {
                    id: form.documentTemplateMasterId,
                },
                submissionOnly: form.submissionOnly,
                receivableOnly: form.receivableOnly,
                returnable: form.returnable,
            };

            const res = await PostApi(
                "POST",
                "/user/document/adddocument-template",
                payload,
                headers
            );

            if (res?.status === 200 || res?.status === 201) {
                setOpen(false);
                setForm({
                    documentName: "",
                    documentTemplateMasterId: "",
                    submissionOnly: false,
                    receivableOnly: false,
                    returnable: false,
                });
                tableRef.current?.onQueryChange();
            }
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentSave = async () => {
        try {
            setDocLoading(true);

            const payload = {
                documentName: docForm.documentName,
                documentTemplateId: docForm.documentTemplateId,
                loanApplicationId: Number(docForm.loanApplicationId),
                loanId: Number(docForm.loanId),
                submissionOnly: docForm.submissionOnly,
                receivableOnly: docForm.receivableOnly,
                returnable: docForm.returnable,
                description: docForm.description,
            };


            const res = await PostApi(
                "POST",
                "/user/document/add-document",
                payload,
                headers
            );

            if (res?.status === 200 || res?.status === 201) {
                setDocOpen(false);
                setDocForm({
                    documentName: "",
                    loanApplicationId: "",
                    loanId: "",
                    submissionOnly: false,
                    receivableOnly: false,
                    returnable: false,
                    description: "",
                });

                // optional refresh
                fetchTemplateDetails(selectedTemplate.documentTemplateId);
            }
        } catch (err) {
            console.error("Document save failed", err);
        } finally {
            setDocLoading(false);
        }
    };


    /* ---------- TABLE COLUMNS ---------- */
    const columns = [
        {
            title: "Template Name",
            field: "documentName",
            cellStyle: { fontWeight: 600 },
        },
        {
            title: "Status",
            render: (row) => (
                <Chip
                    label={row.isActive ? "Active" : "Inactive"}
                    color={row.isActive ? "success" : "default"}
                    size="small"
                />
            ),
        },
        {
            title: "Flags",
            render: (row) => (
                <Box display="flex" gap={1}>
                    {row.submissionOnly && <Chip label="Submission" size="small" />}
                    {row.receivableOnly && <Chip label="Receivable" size="small" />}
                    {row.returnable && <Chip label="Returnable" size="small" />}
                </Box>
            ),
        },
        {
            title: "Action",
            render: (row) => (
                <Box display="flex" gap={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => fetchTemplateDetails(row.documentTemplateId)}
                    >
                        View
                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                            setSelectedTemplate(row);

                            setDocForm((prev) => ({
                                ...prev,
                                documentTemplateId: row.documentTemplateId, // 🔥 IMPORTANT
                            }));

                            setDocOpen(true);
                        }}
                    >
                        + Document
                    </Button>

                </Box>
            ),
        }

    ];

    return (
        <div className="document-template-page">
            <Header />
            <SidePanel />

            <div className="page_container">
                <div
                    className={sideBarCollapse ? "main_content" : "main_content collapsed"}
                >
                    <div className="Summary_card document-card">

                        <div className="document-header">
                            <div>
                                <h2>Document Templates</h2>
                            </div>

                            <button
                                className="primary-btn"
                                onClick={() => setOpen(true)}
                            >
                                + Add Document Template
                            </button>
                        </div>

                        <MaterialTable
                            title=""
                            columns={columns}
                            tableRef={tableRef}
                            data={() => fetchTableData()}
                            options={{
                                ...TableOptions(),
                                search: true,
                                paging: false,
                                toolbar: true,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ---------- ADD TEMPLATE MODAL ---------- */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Document Template</DialogTitle>

                <DialogContent>
                    <TextField
                        label="Template Name"
                        fullWidth
                        required
                        margin="normal"
                        value={form.documentName}
                        onChange={(e) =>
                            setForm({ ...form, documentName: e.target.value })
                        }
                    />

                    <TextField
                        select
                        label="Document Master"
                        fullWidth
                        required
                        margin="normal"
                        value={form.documentTemplateMasterId}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                documentTemplateMasterId: e.target.value,
                            })
                        }
                    >
                        {masters.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                                {m.documentName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box mt={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.submissionOnly}
                                    onChange={(e) =>
                                        setForm({ ...form, submissionOnly: e.target.checked })
                                    }
                                />
                            }
                            label="Submission Only"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.receivableOnly}
                                    onChange={(e) =>
                                        setForm({ ...form, receivableOnly: e.target.checked })
                                    }
                                />
                            }
                            label="Receivable Only"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.returnable}
                                    onChange={(e) =>
                                        setForm({ ...form, returnable: e.target.checked })
                                    }
                                />
                            }
                            label="Returnable"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={
                            !form.documentName ||
                            !form.documentTemplateMasterId ||
                            loading
                        }
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------- TEMPLATE DETAILS MODAL ---------- */}
            {/* ---------- TEMPLATE DETAILS MODAL ---------- */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Template Details</DialogTitle>

                <DialogContent>
                    {detailsLoading ? (
                        <p>Loading...</p>
                    ) : templateDetails ? (
                        <Box>

                            {/* ===== TEMPLATE INFO ===== */}
                            <Box className="details-grid">
                                <div className="detail-row">
                                    <span>Template Name</span>
                                    <strong>{templateDetails.documentName}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Master</span>
                                    <strong>{templateDetails.documentTemplateMasterName}</strong>
                                </div>

                                <div className="detail-row">
                                    <span>Status</span>
                                    <Chip
                                        label={templateDetails.isActive ? "Active" : "Inactive"}
                                        color={templateDetails.isActive ? "success" : "default"}
                                        size="small"
                                    />
                                </div>
                            </Box>

                            {/* ===== FLAGS ===== */}
                            <Box mt={2} display="flex" gap={1}>
                                {templateDetails.submissionOnly && (
                                    <Chip label="Submission Only" size="small" />
                                )}
                                {templateDetails.receivableOnly && (
                                    <Chip label="Receivable Only" size="small" />
                                )}
                                {templateDetails.returnable && (
                                    <Chip label="Returnable" size="small" />
                                )}
                            </Box>

                            {/* ===== DOCUMENT LIST ===== */}
                            <Box mt={4}>
                                <h4 style={{ marginBottom: 12 }}>Documents</h4>

                                {templateDetails.documents?.length > 0 ? (
                                    templateDetails.documents.map((doc) => (
                                        <Box key={doc.documentId} className="doc-item">
                                            <div>
                                                <strong>{doc.documentName}</strong>
                                                <p className="doc-sub">
                                                    Loan App ID: {doc.loanApplicationId} • Loan ID: {doc.loanId}
                                                </p>
                                            </div>

                                            <div className="doc-right">
                                                <span>{doc.receivedDate}</span>
                                            </div>
                                        </Box>
                                    ))
                                ) : (
                                    <p>No documents found</p>
                                )}
                            </Box>

                        </Box>
                    ) : (
                        <p>No details found</p>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={docOpen} onClose={() => setDocOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    Add Document
                    {selectedTemplate && (
                        <span style={{ fontSize: 13, marginLeft: 8, opacity: 0.7 }}>
                            ({selectedTemplate.documentName})
                        </span>
                    )}
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Document Name"
                        fullWidth
                        required
                        margin="normal"
                        value={docForm.documentName}
                        onChange={(e) =>
                            setDocForm({ ...docForm, documentName: e.target.value })
                        }
                    />

                    <TextField
                        select
                        label="Loan Application"
                        fullWidth
                        required
                        margin="normal"
                        value={docForm.loanApplicationId}
                        onChange={(e) => {
                            const selected = loanMap.find(
                                l => l.loanApplicationId === Number(e.target.value)
                            );

                            setDocForm({
                                ...docForm,
                                loanApplicationId: selected.loanApplicationId,
                                loanId: selected.loanId, // 🔥 auto set loanId
                            });
                        }}
                    >
                        {loanMap.map(item => (
                            <MenuItem key={item.loanApplicationId} value={item.loanApplicationId}>
                                {item.loanApplicationId} — {item.loanerName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Loan ID"
                        fullWidth
                        margin="normal"
                        value={docForm.loanId || ""}
                        disabled
                    />


                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={docForm.description}
                        onChange={(e) =>
                            setDocForm({ ...docForm, description: e.target.value })
                        }
                    />

                    <Box mt={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={docForm.submissionOnly}
                                    onChange={(e) =>
                                        setDocForm({ ...docForm, submissionOnly: e.target.checked })
                                    }
                                />
                            }
                            label="Submission Only"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={docForm.receivableOnly}
                                    onChange={(e) =>
                                        setDocForm({ ...docForm, receivableOnly: e.target.checked })
                                    }
                                />
                            }
                            label="Receivable Only"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={docForm.returnable}
                                    onChange={(e) =>
                                        setDocForm({ ...docForm, returnable: e.target.checked })
                                    }
                                />
                            }
                            label="Returnable"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDocOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleDocumentSave}
                        disabled={
                            !docForm.documentName ||
                            docForm.loanApplicationId == null ||
                            docForm.loanId == null ||
                            docLoading
                        }
                    >
                        {docLoading ? "Saving..." : "Save"}
                    </Button>

                </DialogActions>
            </Dialog>

        </div>
    );
};

export default DocumentTemplates;
