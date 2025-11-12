import React, { useState, useEffect } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { RiLockLine } from 'react-icons/ri';
import { useAppContext } from '../components/AppProvider';
import { useNavigate } from 'react-router-dom';
import { gp_logo } from '../components/imageUrl';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import SidePanel from '../components/SidePanel';

const ChangePassworduser = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [userid] = useState(localStorage.getItem("user_id"));
    const [token] = useState(localStorage.getItem("token"));
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [formErrors, setFormErrors] = useState({});


    const navigate = useNavigate();
    const { PostApi, } = useAppContext();

    useEffect(() => {
        if (roleId !== null && roleId !== "" && roleId !== undefined) {
        }
        else {
            navigate("/", { replace: true })
        }
    }, [])

    const togglePasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[!@#$%^&*()-+])(?=.*[a-zA-Z]).{8,}$/;
        return regex.test(password);
    };

    const focusOutValidation = async (e, label) => {
        if (label === "currentPassword") {
            if (currentPassword === "") {
                setFormErrors((e) => {
                    return { ...e, currentPassword: "Please Enter the Old Password" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, currentPassword: "" }
                })
            }
        }
        else if (label === "newPassword") {
            if (newPassword === "") {
                setFormErrors((e) => {
                    return { ...e, newPassword: "Please Enter New Password" }
                })
            }

            else {
                setFormErrors((e) => {
                    return { ...e, newPassword: "" }
                })
            }
        }
        else if (label === "confirmNewPassword") {
            if (confirmNewPassword === "") {
                setFormErrors((e) => {
                    return { ...e, confirmNewPassword: "Please Enter New Password" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, confirmNewPassword: "" }
                })
            }
        }
    }

    const onChangeValidation = (e, label) => {
        const value = e.target.value;
        const errors = { ...formErrors };
        if (label === "currentPassword") {
            if (value === "") {
                errors.currentPassword = "Please Enter the Old Password";
            } else {
                errors.currentPassword = "";
            }
        }
        if (label === "newPassword") {
            if (value === "") {
                errors.newPassword = "Please Enter the New Password";
            }
            else if (currentPassword === newPassword) {
                errors.newPassword = "Old password and New Password cannot be same";
            }
            else if (!validatePassword(value)) {
                errors.newPassword = "Password must contain 8 characters with at least one number and one symbol.";
            }
            else {
                errors.newPassword = "";
            }
            if (confirmNewPassword !== "" && confirmNewPassword !== value) {
                errors.confirmNewPassword = "Passwords not match with New password";
            } else if (confirmNewPassword === value) {
                errors.confirmNewPassword = "";
            }
        }
        if (label === "confirmNewPassword") {
            if (value === "") {
                errors.confirmNewPassword = "Please Re-Enter the New Password";
            } else if (value !== newPassword) {
                errors.confirmNewPassword = "Re-Enter New Password not match with New Password";
            } else {
                errors.confirmNewPassword = "";
            }
        }
        setFormErrors(errors);
    };

    const handleChangePassword = (event) => {
        event.preventDefault();
        const errors = {};
        if (currentPassword === "") {
            errors.currentPassword = "Please Enter the Old Password"
        }
        if (newPassword === "") {
            errors.newPassword = "Please Enter the New Password";
        }
        else if (currentPassword === newPassword) {
            errors.newPassword = "Old password and New Password cannot be same";
        }
        else if (!validatePassword(newPassword)) {
            errors.newPassword = "Password must contain 8 characters with at least one number and one symbol.";
        }
        if (confirmNewPassword === "") {
            errors.confirmNewPassword = "Please Re-Enter New Password"
        }
        else if (newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = "Re-Enter New Password not match with New Password";
        }
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            const url = `/user/changePassword?id=${userid}`;
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const data = {
                oldPwd: currentPassword,
                newPwd: newPassword,
                confPwd: confirmNewPassword,
            };
            PostApi('POST', url, data, headers)
                .then((response) => {
                    if (response.data.status === 200) {
                        toast.success('Password Changed Successfully');
                        navigate('/');
                    } else if (response.data.status === 409) {
                        toast.error(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        }

    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmNewPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    return (
        <div>
            <Header />
            <SidePanel />
            <div className="page_container">
                <div className='main_content'>
                    <form onSubmit={handleChangePassword}>
                        <div className="login_container2_bg">
                            <div className='login_form_container'>
                                {/* <div className='logflx'>
                                    <img src={gp_logo} alt='no' className='logoimg'></img>
                                </div> */}
                                <div className="welcome_text">
                                    <span>Change Password</span>
                                </div>
                                <div style={{ paddingTop: '20px' }}>

                                    <label className='login_label'>Old Password <span className="required_star">*</span> </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <RiLockLine />
                                        </div>
                                        <input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            className='chngpwdinput_box'
                                            maxLength={16}
                                            placeholder="Old Password"
                                            onChange={(e) => {
                                                handleCurrentPasswordChange(e);
                                                onChangeValidation(e, 'currentPassword');
                                            }}
                                            onBlur={() => focusOutValidation("currentPassword")}
                                            // onCopy={(e) => e.preventDefault()}
                                        />
                                        {showCurrentPassword ? <AiOutlineEye onClick={() => togglePasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => togglePasswordVisibility()} className="eye-icon_login" />}

                                        {formErrors.currentPassword && <div className="field_form_alert">
                                            <span>{formErrors.currentPassword}</span>
                                        </div>}
                                    </div>

                                    <label className='login_label'>New Password <span className="required_star">*</span> </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <RiLockLine />
                                        </div>
                                        <input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                               className='chngpwdinput_box'
                                            maxLength={16}
                                            placeholder="New Password"
                                            onChange={(e) => {
                                                handleNewPasswordChange(e);
                                                onChangeValidation(e, 'newPassword');
                                            }}
                                            onBlur={() => focusOutValidation("newPassword")}
                                        />

                                        {showNewPassword ? <AiOutlineEye onClick={() => toggleNewPasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => toggleNewPasswordVisibility()} className="eye-icon_login" />}
                                        {formErrors.newPassword && <div className="field_form_alert">
                                            <span>{formErrors.newPassword}</span>
                                        </div>}
                                    </div>
                                    <label className='login_label'>Re-Enter New Password <span className="required_star">*</span> </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                            <RiLockLine />
                                        </div>
                                        <input
                                            id="confirmNewPassword"
                                            type={showConfirmNewPassword ? "text" : "password"}
                                         className='chngpwdinput_box'
                                            maxLength={16}
                                            placeholder="Re-Enter New Password"
                                            onChange={(e) => {
                                                handleConfirmNewPasswordChange(e);
                                                onChangeValidation(e, 'confirmNewPassword');
                                            }}
                                            onBlur={() => focusOutValidation("confirmNewPassword")}
                                        />
                                        {showConfirmNewPassword ? <AiOutlineEye onClick={() => toggleConfirmNewPasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => toggleConfirmNewPasswordVisibility()} className="eye-icon_login" />}
                                        {formErrors.confirmNewPassword && <div className="field_form_alert">
                                            <span>{formErrors.confirmNewPassword}</span>
                                        </div>}
                                    </div>
                                </div>
                                <div className='login_btn_container'>
                                    <button className="login_btn" type="submit">Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassworduser;