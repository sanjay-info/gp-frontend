import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useSidebar } from "../components/SidebarContext";
import { useAppContext } from "../components/AppProvider";
import { useLocation } from "react-router-dom";
import "./ViewLoanerByAdmin.css";
import decryptData from "../components/Decrypt";

/* ---------- Reusable Field ---------- */
const FormField = ({
    label,
    value,
    editable = false,
    type = "text",
    disabled = false,
}) => (
    <div className="form_field">
        <label>{label}</label>
        <input
            type={type}
            value={value ?? "—"}
            readOnly={!editable}
            disabled={disabled}
            className={!editable ? "readonly" : ""}
        />
    </div>
);

/* ---------- File Upload ---------- */
const FileField = ({ label, file, editable, onPreview }) => (
    <div className="file_field">
        <label>{label}</label>

        {file ? (
            <button
                type="button"
                className="preview_btn"
                onClick={() => onPreview(file)}
            >
                Preview
            </button>
        ) : (
            <span className="muted">No file</span>
        )}

        {editable && <input type="file" />}
    </div>
);


const ViewUserAdminNew = () => {
    const { sideBarCollapse } = useSidebar();
    const { PostApi } = useAppContext();
    const location = useLocation();
    const userId = location.state?.id;

    const [data, setData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [sameAsPermanent, setSameAsPermanent] = useState(false);

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const [previewFile, setPreviewFile] = useState(null);

    const maskPAN = (pan) =>
        pan ? pan.replace(/.(?=.{4})/g, "X") : "—";



    useEffect(() => {
        const fetchUser = async () => {
            const res = await PostApi("POST", `/user/id?id=${userId}`, {}, headers);
            const user = res?.data?.data;

            const decryptedPan = decryptData(user.pan, user.key);
            const decryptedAadhaar = decryptData(user.aadhaar, user.key);

            setData({
                ...user,
                pan: decryptedPan,
                aadhaar: decryptedAadhaar,
            });


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

    const FilePreviewModal = ({ fileUrl, onClose }) => {
        if (!fileUrl) return null;

        const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

        return (
            <div className="preview_backdrop">
                <div className="preview_modal">
                    <button className="close_btn" onClick={onClose}>✕</button>

                    {isPdf ? (
                        <iframe
                            src={fileUrl}
                            title="Document Preview"
                            className="preview_iframe"
                        />
                    ) : (
                        <img
                            src={fileUrl}
                            alt="Preview"
                            className="preview_image"
                        />
                    )}
                </div>
            </div>
        );
    };

    if (!data) return null;

    const isIndividual = data.accountTypeName === "Individual";
    const isNRI = data.userType?.id === 2 || data.userType?.id === 3;
    const isMinor = data.userCategory === "MINOR";
    const isBankAccount =
        data.accountTypeName === "Bank" ||
        data.accountTypeName === "NBFC";

    return (
        <>
            <Header />
            <SidePanel />

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <form className="VU_form">

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
                                onClick={() => setEditMode(!editMode)}
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
                                        <FormField label="First Name" value={data.firstName} editable={editMode} />
                                        <FormField label="Last Name" value={data.lastName} editable={editMode} />
                                        <FormField label="Date of Birth" value={data.dateOfBirth} type="date" editable={editMode} />
                                    </>
                                ) : (
                                    <>
                                        <FormField label="Loaner Name" value={data.accountName} editable={editMode} />
                                        <FormField
                                            label="Authorised Signatory"
                                            value={data.authorisedSignatoryName}
                                        />
                                    </>
                                )}

                                <FormField label="Email" value={data.emailId} />
                                <FormField label="Mobile" value={`${data.countryCode} ${data.mobileNo}`} />
                                <FormField label="Account Type" value={data.accountTypeName} />
                                {/* <FormField label="Applicant Type" value={data.applicantStatus?.applicantStatus} />
                                <FormField label="User Type" value={data.userType?.userType} /> */}
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
                                    <FormField label="Nationality" value={data.nationality} />
                                </div>
                            </div>
                        )}

                        {!isIndividual && (
                            <div className="VU_card">
                                <h4>Corporate & Regulatory Details</h4>

                                <div className="grid">
                                    <FormField label="PAN Number" value={maskPAN(data.pan)} />
                                    <FormField label="CIN" value={data.cin} />
                                    <FormField
                                        label="Incorporation Date"
                                        value={data.inCorporationDate}
                                        type="date"
                                    />
                                    <FormField label="GST Number" value={data.gstNumber} />
                                    <FormField label="Registered Address" value={data.registeredAddress} />
                                    <FormField label="Corporate Address" value={data.corporateAddress} />
                                    <FormField
                                        label="Authorised Signatory"
                                        value={data.authorisedSignatoryName}
                                    />
                                    <FormField
                                        label="Designation"
                                        value={data.authorisedSignatoryDesignation}
                                    />
                                </div>


                            </div>
                        )}


                        {/* ---------- PERMANENT ADDRESS ---------- */}
                        <div className="VU_card">
                            <h4>{isIndividual ? "Permanent Address" : "Contact Address"}</h4>
                            <div className="grid">
                                <FormField label="Address" value={data.addressLine1} editable={editMode} />
                                <FormField label="City" value={data.city1} editable={editMode} />
                                <FormField label="State" value={data.state1} editable={editMode} />
                                <FormField label="Country" value={data.country1} />
                                <FormField label="Postal Code" value={data.pincode1} editable={editMode} />
                            </div>
                        </div>

                        {/* ---------- CORRESPONDENCE ADDRESS ---------- */}
                        {isIndividual && <div className="VU_card">
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
                                <FormField label="Address" value={sameAsPermanent ? data.addressLine1 : data.addressLine11} editable={editMode} disabled={sameAsPermanent} />
                                <FormField label="City" value={sameAsPermanent ? data.city1 : data.city2} editable={editMode} disabled={sameAsPermanent} />
                                <FormField label="State" value={sameAsPermanent ? data.state1 : data.state2} editable={editMode} disabled={sameAsPermanent} />
                                <FormField label="Country" value={sameAsPermanent ? data.country1 : data.country2} disabled />
                                <FormField label="Postal Code" value={sameAsPermanent ? data.pincode1 : data.pincode2} editable={editMode} disabled={sameAsPermanent} />
                            </div>
                        </div>}

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
                                        <FormField
                                            label="Licence Validity Date"
                                            value={data.licenceValidityDate}
                                            type="date"
                                        />
                                    </>
                                )}

                            </div>
                        </div>

                        <div className="VU_card">
                            <h4>User Details</h4>
                            <div className="grid">
                                <FormField label="Role" value={"USER"} />
                                {/* <FormField label="Opportunity Types" value={data.opportunityRecordTypes?.map(o => o.opportunityRecordType).join(", ")} /> */}
                                <FormField label="Salesforce ID" value={data.sfId} />
                                <FormField label="SF User Details ID" value={data.sfUserDetailsId} />
                            </div>
                        </div>


                        {/* ---------- KYC & DOCUMENTS ---------- */}
                        <div className="VU_card">
                            <h4>KYC & Documents</h4>
                            <div className="file_grid">
                                <FileField
                                    label="PAN Document"
                                    file={data.panImage}
                                    editable={editMode}
                                    onPreview={setPreviewFile}
                                />

                                {isIndividual && <><FileField
                                    label="Aadhaar Document"
                                    file={data.aadhaarImage}
                                    editable={editMode}
                                    onPreview={setPreviewFile}
                                />                                <FileField label="Profile Photo" file={data.profileImage} editable={editMode} />
                                </>}
                                {!isIndividual && <FileField
                                    label="Certificate of Incorporation"
                                    file={data.certificateOfIncorporation}
                                    editable={editMode}
                                    onPreview={setPreviewFile}
                                />}
                                {isNRI && <FileField label="Passport" file={data.passportImage} editable={editMode} />}
                                {data.ociCard && <FileField label="OCI Card" file={data.ociImage} editable={editMode} />}
                            </div>
                        </div>

                        {/* ---------- GUARDIAN (MINOR) ---------- */}
                        {isMinor && (
                            <div className="VU_card">
                                <h4>Guardian Details</h4>
                                <div className="grid">
                                    <FormField label="Guardian Name" value={data.guardianName} editable={editMode} />
                                    <FormField label="Guardian DOB" value={data.guardianDob} type="date" editable={editMode} />
                                    <FormField label="Relation" value={data.guardianRelation} editable={editMode} />
                                </div>

                                <div className="file_grid">
                                    <FileField label="Guardian PAN" file={data.guardianPanImage} editable={editMode} />
                                    <FileField label="Guardian Aadhaar" file={data.guardianAadhaarImage} editable={editMode} />
                                </div>
                            </div>
                        )}

                        {/* ---------- ACTION ---------- */}
                        {editMode && (
                            <div className="VU_actions">
                                <button type="submit" className="save_btn">Save Changes</button>
                            </div>
                        )}

                    </form>
                </div>
            </div>
            {previewFile && (
                <FilePreviewModal
                    fileUrl={previewFile}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </>
    );
};

export default ViewUserAdminNew;
