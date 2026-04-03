import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { useLocation } from "react-router-dom";
import "./ViewLoanerByAdmin.css";
import decryptData from "../components/Decrypt";

/* ---------- Reusable Field ---------- */
const FormField = ({ label, value, editable = false, type = "text", disabled = false, onChange }) => (
    <div className="form_field">
        <label>{label}</label>
        <input
            type={type}
            value={value ?? ""}
            readOnly={!editable}
            disabled={disabled}
            className={!editable ? "readonly" : ""}
            onChange={editable ? (e) => onChange?.(e.target.value) : undefined}
        />
    </div>
);

/* ---------- File Upload ---------- */
const FileField = ({ label, file, editable, onPreview, onFileChange, fieldKey }) => (
    <div className="file_field">
        <label>{label}</label>

        {file && typeof file === "string" ? (
            <button type="button" className="preview_btn" onClick={() => onPreview(file)}>
                Preview
            </button>
        ) : file instanceof File ? (
            <span className="muted">{file.name}</span>
        ) : (
            <span className="muted">No file</span>
        )}

        {editable && (
            <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileChange?.(fieldKey, e.target.files[0])}
            />
        )}
    </div>
);

/* ---------- File Preview Modal ---------- */
const FilePreviewModal = ({ fileUrl, onClose }) => {
    if (!fileUrl) return null;
    const isPdf = typeof fileUrl === "string" && fileUrl.toLowerCase().endsWith(".pdf");
    return (
        <div className="preview_backdrop">
            <div className="preview_modal">
                <button className="close_btn" onClick={onClose}>✕</button>
                {isPdf ? (
                    <iframe src={fileUrl} title="Document Preview" className="preview_iframe" />
                ) : (
                    <img src={fileUrl} alt="Preview" className="preview_image" />
                )}
            </div>
        </div>
    );
};

const ViewUserAdminNew = () => {
    const { sideBarCollapse } = useSidebar();
    const { PostApi } = useAppContext();
    const location = useLocation();
    const userId = location.state?.id;

    const [data, setData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [sameAsPermanent, setSameAsPermanent] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [saving, setSaving] = useState(false);

    // Tracks new file selections: { panImage: File, aadhaarImage: File, ... }
    const [newFiles, setNewFiles] = useState({});

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const maskPAN = (pan) => (pan ? pan.replace(/.(?=.{4})/g, "X") : "—");

    useEffect(() => {
        const fetchUser = async () => {
            const res = await PostApi("POST", `/user/id?id=${userId}`, {}, headers);
            const user = res?.data?.data;

            const decryptedPan = decryptData(user.pan, user.key);
            const decryptedAadhaar = decryptData(user.aadhaar, user.key);
            const decryptedpassportNo = decryptData(user.passportNo, user.key);


            setData({ ...user, pan: decryptedPan, aadhaar: decryptedAadhaar,passportNo:decryptedpassportNo });

            if (
                user?.addressLine1 === user?.addressLine11 &&
                user?.city1 === user?.city2 &&
                user?.state1 === user?.state2 &&
                user?.pincode1 === user?.pincode2
            ) {
                setSameAsPermanent(true);
            }
        };
        fetchUser();
    }, [userId]);

    /* ---------- Field change handler ---------- */
    const handleChange = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    /* ---------- File change handler ---------- */
    const handleFileChange = (fieldKey, file) => {
        setNewFiles((prev) => ({ ...prev, [fieldKey]: file }));
    };

    /* ---------- Save / Update ---------- */
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();

            // ── Core identity fields ──
            formData.append("id", data.id ?? userId);
            formData.append("customerId", data.customerId ?? "");
            formData.append("userTypeId", data.userType?.id ?? "1");
            formData.append("applicantStatusId", data.applicantStatus?.id ?? "1");

            // ── Role IDs ──
            if (Array.isArray(data.roles) && data.roles.length > 0) {
                data.roles.forEach((role, idx) => {
                    formData.append(`roleId[${idx}]`, role.id);
                });
            }

            // ── Individual fields ──
            if (data.accountTypeName === "Individual") {
                formData.append("firstName", data.firstName ?? "");
                formData.append("lastName", data.lastName ?? "");
                formData.append("dateOfBirth", data.dateOfBirth ?? "");
                formData.append("pan", data.pan ?? "");
                formData.append("aadhaar", data.aadhaar ?? "");
                formData.append("passportNo", data.passportNo ?? "");
                formData.append("nationality", data.nationality ?? "");
            } else {
                // ── Corporate / Bank / NBFC fields ──
                formData.append("accountName", data.accountName ?? "");
                formData.append("authorisedSignatoryName", data.authorisedSignatoryName ?? "");
                formData.append("authorisedSignatoryDesignation", data.authorisedSignatoryDesignation ?? "");
                formData.append("cin", data.cin ?? "");
                formData.append("inCorporationDate", data.inCorporationDate ?? "");
                formData.append("gstNumber", data.gstNumber ?? "");
                formData.append("registeredAddress", data.registeredAddress ?? "");
                formData.append("corporateAddress", data.corporateAddress ?? "");
                formData.append("pan", data.pan ?? "");
            }

            // ── Contact ──
            formData.append("emailId", data.emailId ?? "");
            formData.append("mobileNo", data.mobileNo ?? "");
            formData.append("countryCode", data.countryCode ?? "");

            // ── Permanent / Contact address ──
            formData.append("addressLine1", data.addressLine1 ?? "");
            formData.append("city1", data.city1 ?? "");
            formData.append("state1", data.state1 ?? "");
            formData.append("country1", data.country1 ?? "");
            formData.append("pincode1", data.pincode1 ?? "");

            // ── Correspondence address ──
            const corrAddr = sameAsPermanent ? data.addressLine1 : data.addressLine11;
            const corrCity = sameAsPermanent ? data.city1 : data.city2;
            const corrState = sameAsPermanent ? data.state1 : data.state2;
            const corrCountry = sameAsPermanent ? data.country1 : data.country2;
            const corrPin = sameAsPermanent ? data.pincode1 : data.pincode2;

            // formData.append("currentAddress", corrAddr ?? "");
            // formData.append("currentCity", corrCity ?? "");
            // formData.append("currentState", corrState ?? "");
            // formData.append("currentCountry", corrCountry ?? "");
            // formData.append("currentPincode", corrPin ?? "");

             formData.append("addressLine11", corrAddr ?? "");
            formData.append("city2", corrCity ?? "");
            formData.append("state2", corrState ?? "");
            formData.append("country2", corrCountry ?? "");
            formData.append("pincode2", corrPin ?? "");

            // ── Bank details ──
            formData.append("bankName", data.bankName ?? "");
            formData.append("accountNo", data.accountNo ?? "");
            formData.append("ifscCode", data.ifscCode ?? "");
            formData.append("branchName", data.branchName ?? "");
            formData.append("bankCode", data.bankCode ?? "");
            formData.append("micrCode", data.micrCode ?? "");

            // ── Bank/NBFC extra fields ──
            const isBankAccount = data.accountTypeName === "Bank" || data.accountTypeName === "NBFC";
            if (isBankAccount) {
                formData.append("branchCode", data.branchCode ?? "");
                formData.append("regulatedBy", data.regulatedBy ?? "");
                formData.append("nbfcRegistrationNo", data.nbfcRegistrationNo ?? "");
                formData.append("nbfcCategory", data.nbfcCategory ?? "");
                formData.append("headOfficeAddress", data.headOfficeAddress ?? "");
                formData.append("licenceValidityDate", data.licenceValidityDate ?? "");
            }

            // ── Salesforce IDs ──
            formData.append("sfId", data.sfId ?? "");
            formData.append("sfUserDetailsId", data.sfUserDetailsId ?? "");

            // ── Guardian (minor) ──
            if (data.userCategory === "MINOR") {
                formData.append("guardianName", data.guardianName ?? "");
                formData.append("guardianDob", data.guardianDob ?? "");
                formData.append("guardianRelation", data.guardianRelation ?? "");
            }

            // ── File uploads (only attach if a new file was selected) ──
            const fileFieldMap = {
                panImage: "panImg",
                aadhaarImage: "aadhaarImg",
                profileImage: "profileImg",
                certificateOfIncorporation: "certificateOfIncorporation",
                passportImage: "passportImg",
                ociImage: "ociImg",
                guardianPanImage: "guardianPanImg",
                guardianAadhaarImage: "guardianAadhaarImg",
            };

            Object.entries(fileFieldMap).forEach(([stateKey, apiKey]) => {
                if (newFiles[stateKey]) {
                    formData.append(apiKey, newFiles[stateKey]);
                }
            });

            // ── Call API ──
            const res = await PostApi(
                "POST",
                "/user/admin/register",
                formData,
                {
                    ...headers,
                    "Content-Type": "multipart/form-data",
                }
            );

            if (res?.data?.success || res?.status === 200) {
                alert("User updated successfully!");
                setEditMode(false);
                setNewFiles({});
            } else {
                alert(res?.data?.message ?? "Update failed. Please try again.");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    if (!data) return null;

    const isIndividual = data.accountTypeName === "Individual";
    const isNRI = data.userType?.id === 2 || data.userType?.id === 3;
    const isMinor = data.userCategory === "MINOR";
    const isBankAccount = data.accountTypeName === "Bank" || data.accountTypeName === "NBFC";

    return (
        <>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <form className="VU_form" onSubmit={handleSave}>

                        {/* ---------- HEADER ---------- */}
                        <div className="VU_header">
                            <div>
                                <h2>
                                    {isIndividual
                                        ? `${data.firstName ?? ""} ${data.lastName ?? ""}`
                                        : data.accountName || "Loaner"}
                                </h2>
                                <span className="customer_id">{data.customerId}</span>
                            </div>

                            <button
                                type="button"
                                className="edit_btn"
                                onClick={() => { setEditMode(!editMode); setNewFiles({}); }}
                            >
                                {editMode ? "Cancel Edit" : "Edit"}
                            </button>
                        </div>

                        {/* ---------- BASIC PROFILE ---------- */}
                        <div className="VU_card">
                            <h4>Profile Information</h4>
                            <div className="grid">
                                {isIndividual ? (
                                    <>
                                        <FormField label="First Name" value={data.firstName} editable={editMode} onChange={(v) => handleChange("firstName", v)} />
                                        <FormField label="Last Name" value={data.lastName} editable={editMode} onChange={(v) => handleChange("lastName", v)} />
                                        <FormField label="Date of Birth" value={data.dateOfBirth} type="date" editable={editMode} onChange={(v) => handleChange("dateOfBirth", v)} />
                                    </>
                                ) : (
                                    <>
                                        <FormField label="Loaner Name" value={data.accountName} editable={editMode} onChange={(v) => handleChange("accountName", v)} />
                                        <FormField label="Authorised Signatory" value={data.authorisedSignatoryName} />
                                    </>
                                )}
                                <FormField label="Email" value={data.emailId} />
                                <FormField label="Mobile" value={`${data.countryCode} ${data.mobileNo}`} />
                                <FormField label="Account Type" value={data.accountTypeName} />
                            </div>
                        </div>

                        {/* ---------- IDENTITY DETAILS ---------- */}
                        {isIndividual && (
                            <div className="VU_card">
                                <h4>Identity Details</h4>
                                <div className="grid">
                                    <FormField label="PAN Number" value={maskPAN(data.pan)} />
                                    <FormField label="Aadhaar Number" value={data.aadhaar} />
                                    <FormField label="Passport Number" value={data.passportNo} />
                                    <FormField label="Nationality" value={data.nationality} editable={editMode} onChange={(v) => handleChange("nationality", v)} />
                                </div>
                            </div>
                        )}

                        {!isIndividual && (
                            <div className="VU_card">
                                <h4>Corporate & Regulatory Details</h4>
                                <div className="grid">
                                    <FormField label="PAN Number" value={maskPAN(data.pan)} />
                                    <FormField label="CIN" value={data.cin} editable={editMode} onChange={(v) => handleChange("cin", v)} />
                                    <FormField label="Incorporation Date" value={data.inCorporationDate} type="date" editable={editMode} onChange={(v) => handleChange("inCorporationDate", v)} />
                                    <FormField label="GST Number" value={data.gstNumber} editable={editMode} onChange={(v) => handleChange("gstNumber", v)} />
                                    <FormField label="Registered Address" value={data.registeredAddress} editable={editMode} onChange={(v) => handleChange("registeredAddress", v)} />
                                    <FormField label="Corporate Address" value={data.corporateAddress} editable={editMode} onChange={(v) => handleChange("corporateAddress", v)} />
                                    <FormField label="Authorised Signatory" value={data.authorisedSignatoryName} editable={editMode} onChange={(v) => handleChange("authorisedSignatoryName", v)} />
                                    <FormField label="Designation" value={data.authorisedSignatoryDesignation} editable={editMode} onChange={(v) => handleChange("authorisedSignatoryDesignation", v)} />
                                </div>
                            </div>
                        )}

                        {/* ---------- PERMANENT ADDRESS ---------- */}
                        <div className="VU_card">
                            <h4>{isIndividual ? "Permanent Address" : "Contact Address"}</h4>
                            <div className="grid">
                                <FormField label="Address" value={data.addressLine1} editable={editMode} onChange={(v) => handleChange("addressLine1", v)} />
                                <FormField label="City" value={data.city1} editable={editMode} onChange={(v) => handleChange("city1", v)} />
                                <FormField label="State" value={data.state1} editable={editMode} onChange={(v) => handleChange("state1", v)} />
                                <FormField label="Country" value={data.country1} />
                                <FormField label="Postal Code" value={data.pincode1} editable={editMode} onChange={(v) => handleChange("pincode1", v)} />
                            </div>
                        </div>

                        {/* ---------- CORRESPONDENCE ADDRESS ---------- */}
                        {isIndividual && (
                            <div className="VU_card">
                                <div className="VU_card_header">
                                    <h4>Correspondence Address</h4>
                                    <label className="same_address">
                                        <input
                                            type="checkbox"
                                            checked={sameAsPermanent}
                                            disabled={!editMode}
                                            onChange={(e) => setSameAsPermanent(e.target.checked)}
                                        />
                                        Same as Permanent Address
                                    </label>
                                </div>
                                <div className="grid">
                                    <FormField label="Address" value={sameAsPermanent ? data.addressLine1 : data.addressLine11} editable={editMode} disabled={sameAsPermanent} onChange={(v) => handleChange("addressLine11", v)} />
                                    <FormField label="City" value={sameAsPermanent ? data.city1 : data.city2} editable={editMode} disabled={sameAsPermanent} onChange={(v) => handleChange("city2", v)} />
                                    <FormField label="State" value={sameAsPermanent ? data.state1 : data.state2} editable={editMode} disabled={sameAsPermanent} onChange={(v) => handleChange("state2", v)} />
                                    <FormField label="Country" value={sameAsPermanent ? data.country1 : data.country2} disabled />
                                    <FormField label="Postal Code" value={sameAsPermanent ? data.pincode1 : data.pincode2} editable={editMode} disabled={sameAsPermanent} onChange={(v) => handleChange("pincode2", v)} />
                                </div>
                            </div>
                        )}

                        {/* ---------- BANK DETAILS ---------- */}
                        <div className="VU_card">
                            <h4>{isBankAccount ? "Bank & NBFC Regulatory Info" : "Bank Details"}</h4>
                            <div className="grid">
                                <FormField label="Bank Name" value={data.bankName} />
                                <FormField label="Account Number" value={data.accountNo} />
                                <FormField label="IFSC Code" value={data.ifscCode} />
                                <FormField label="Branch Name" value={data.branchName} />
                                <FormField label="Bank Code" value={data.bankCode} />
                                <FormField label="MICR Code" value={data.micrCode} />
                                {isBankAccount && (
                                    <>
                                        <FormField label="Branch Code" value={data.branchCode} />
                                        <FormField label="Regulated By" value={data.regulatedBy} />
                                        <FormField label="NBFC Registration No" value={data.nbfcRegistrationNo} />
                                        <FormField label="NBFC Category" value={data.nbfcCategory} />
                                        <FormField label="Head Office Address" value={data.headOfficeAddress} />
                                        <FormField label="Licence Validity Date" value={data.licenceValidityDate} type="date" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ---------- USER DETAILS ---------- */}
                        <div className="VU_card">
                            <h4>User Details</h4>
                            <div className="grid">
                                <FormField label="Role" value={"USER"} />
                                <FormField label="Salesforce ID" value={data.sfId} />
                                <FormField label="SF User Details ID" value={data.sfUserDetailsId} />
                            </div>
                        </div>

                        {/* ---------- KYC & DOCUMENTS ---------- */}
                        <div className="VU_card">
                            <h4>KYC & Documents</h4>
                            <div className="file_grid">
                                <FileField label="PAN Document" file={newFiles.panImage || data.panImage} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="panImage" />
                                {isIndividual && (
                                    <>
                                        <FileField label="Aadhaar Document" file={newFiles.aadhaarImage || data.aadhaarImage} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="aadhaarImage" />
                                        <FileField label="Profile Photo" file={newFiles.profileImage || data.profileImage} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="profileImage" />
                                    </>
                                )}
                                {!isIndividual && (
                                    <FileField label="Certificate of Incorporation" file={newFiles.certificateOfIncorporation || data.certificateOfIncorporation} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="certificateOfIncorporation" />
                                )}
                                {isNRI && <FileField label="Passport" file={newFiles.passportImage || data.passportImage} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="passportImage" />}
                                {data.ociCard && <FileField label="OCI Card" file={newFiles.ociImage || data.ociImage} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="ociImage" />}
                            </div>
                        </div>

                        {/* ---------- GUARDIAN (MINOR) ---------- */}
                        {isMinor && (
                            <div className="VU_card">
                                <h4>Guardian Details</h4>
                                <div className="grid">
                                    <FormField label="Guardian Name" value={data.guardianName} editable={editMode} onChange={(v) => handleChange("guardianName", v)} />
                                    <FormField label="Guardian DOB" value={data.guardianDob} type="date" editable={editMode} onChange={(v) => handleChange("guardianDob", v)} />
                                    <FormField label="Relation" value={data.guardianRelation} editable={editMode} onChange={(v) => handleChange("guardianRelation", v)} />
                                </div>
                                <div className="file_grid">
                                    <FileField label="Guardian PAN" file={newFiles.guardianPanImage || data.guardianPanImage} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="guardianPanImage" />
                                    <FileField label="Guardian Aadhaar" file={newFiles.guardianAadhaarImage || data.guardianAadhaarImage} editable={editMode} onPreview={setPreviewFile} onFileChange={handleFileChange} fieldKey="guardianAadhaarImage" />
                                </div>
                            </div>
                        )}

                        {/* ---------- ACTION ---------- */}
                        {editMode && (
                            <div className="VU_actions">
                                <button type="submit" className="save_btn" disabled={saving}>
                                    {saving ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {previewFile && (
                <FilePreviewModal fileUrl={previewFile} onClose={() => setPreviewFile(null)} />
            )}
        </>
    );
};

export default ViewUserAdminNew;