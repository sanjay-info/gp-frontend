import React, { useEffect, useState } from 'react';
import { RiMailLine, RiLockLine } from 'react-icons/ri';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { gp_logo } from './components/imageUrl';
import { useAppContext } from './components/AppProvider';
import './Login.css';
import Alert from './components/Alert';
import { toast } from 'react-toastify';


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { PostApi } = useAppContext();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        localStorage.clear();
    }, []);

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!email.trim()) {
            errors.email = "Username is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email address is invalid";
            isValid = false;
        }

        if (!password.trim()) {
            errors.password = "Password is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleEmailChange = (value) => {
        setEmail(value);
        validateEmail(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        validatePassword(value);
    };

    const validateEmail = (value) => {
        if (!value.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Username is required' }));
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Please Enter the Valid Username.' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, email: '' }));
        }
    };

    const validatePassword = (value) => {
        if (!value.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, password: '' }));
        }
    };

    // const handleLogin = (event) => {
    //     event.preventDefault();
    //     if (validateForm()) {
    //         const url = "/user/login";
    //         const data = {
    //             userName: email,
    //             password: password,
    //         };
    //         PostApi('POST', url, data)
    //             .then((response) => {
    //                 if (response.data.status === 200) {
    //                     localStorage.setItem('user_id', response.data.data.id);
    //                     const jsonString = JSON.stringify(response.data.data.role);
    //                     localStorage.setItem('Role_id', jsonString);
    //                     localStorage.setItem('Firstlogin', response.data.data.firstLogin);
    //                     localStorage.setItem('kycverified', response.data.data.kycVerified)
    //                     localStorage.setItem('UserName', response.data.data.firstName)
    //                     localStorage.setItem('token', response.data.token);
    //                     if (response.data.data.firstLogin === true) {
    //                         toast.success('Please Change Your Password');
    //                         navigate('/changePassword');
    //                     }
    //                     else {
    //                         if (response.data.data.role[0].id === 1) {
    //                             toast.success('Login Successful');
    //                             navigate('/userList');
    //                         }
    //                         if (response.data.data.role[0].id === 2) {
    //                             if (response.data.data.kycVerified === true) {
    //                                 navigate('/Homepage');
    //                                 toast.success('Login Successful');
    //                             } else {
    //                                 navigate('/Myprofilekyc');
    //                                 toast.success('Login Successful');
    //                             }
    //                             localStorage.setItem('UserType', response.data.data.userType.id)
    //                         }
    //                         if (response.data.data.role[0].id === 3) {
    //                             toast.success('Login Successful');
    //                             navigate('/ApproverReport');
    //                             localStorage.setItem('UserType', response.data.data.userType.id)
    //                         }
    //                         if (response.data.data.role[0].id === 4) {
    //                             toast.success('Login Successful');
    //                             navigate('/FinanceReport');
    //                             localStorage.setItem('UserType', response.data.data.userType.id)
    //                         }
    //                         if (response.data.data.role[0].id === 6) {
    //                             toast.success('Login Successful');
    //                             navigate('/DividendDeclaration');
    //                             localStorage.setItem('UserType', response.data.data.userType.id)
    //                         }
    //                     }
    //                 } else if (response.data.status === 409) {
    //                     setAlertMessage(response.data.message);
    //                     setShowAlert(true);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //             });
    //     }
    // };

    const handleLogin = (event) => {        //sanjay geolocation login 06-11-2025
        event.preventDefault();

        if (!validateForm()) return;


        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Step 2: Get public IP
                fetch("https://api.ipify.org?format=json")
                    .then(res => res.json())
                    .then(data => {
                        const ipAddress = data.ip;


                        // Step 2: Now call Login API
                        // loginUser();
                        loginUser(latitude, longitude, ipAddress);
                    })
                    .catch(err => {
                        console.warn("Unable to get IP address:", err);
                        loginUser(latitude, longitude, ""); // fallback without IP
                    });
            },
            (error) => {
                alert("Please enable location access to continue with login.");
            }
        );


        const loginUser = (latitude, longitude, ipAddress) => {                   //sanjay geolocation login 06-11-2025
            const url = "/user/login";
            const data = {
                userName: email,
                password: password,
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                ipAddress: ipAddress
            };

            PostApi('POST', url, data)
                .then((response) => {
                    if (response.data.status === 200) {
                        localStorage.setItem('user_id', response.data.data.id);
                        const jsonString = JSON.stringify(response.data.data.role);
                        localStorage.setItem('Role_id', jsonString);
                        localStorage.setItem('Firstlogin', response.data.data.firstLogin);
                        localStorage.setItem('kycverified', response.data.data.kycVerified)
                        localStorage.setItem('UserName', response.data.data.firstName)
                        localStorage.setItem('token', response.data.token);

                        if (response.data.data.firstLogin === true) {
                            toast.success('Please Change Your Password');
                            navigate('/changePassword');
                        } else {
                            if (response.data.data.role[0].id === 1) {
                                toast.success('Login Successful');
                                navigate('/Investors');
                            }
                            if (response.data.data.role[0].id === 2) {
                                if (response.data.data.kycVerified === true) {
                                    navigate('/Homepage');
                                    toast.success('Login Successful');
                                } else {
                                    navigate('/Myprofilekyc');
                                    toast.success('Login Successful');
                                }
                                localStorage.setItem('UserType', response.data.data.userType.id)
                            }
                            if (response.data.data.role[0].id === 3) {
                                toast.success('Login Successful');
                                navigate('/ApproverReport');
                                localStorage.setItem('UserType', response.data.data.userType.id)
                            }
                            if (response.data.data.role[0].id === 4) {
                                toast.success('Login Successful');
                                navigate('/FinanceReport');
                                localStorage.setItem('UserType', response.data.data.userType.id)
                            }
                            if (response.data.data.role[0].id === 6) {
                                toast.success('Login Successful');
                                navigate('/DividendDeclaration');
                                localStorage.setItem('UserType', response.data.data.userType.id)
                            }
                        }
                    } else if (response.data.status === 409) {
                        setAlertMessage(response.data.message);
                        setShowAlert(true);
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        };

    }


    return (
        <div>
            <div className="login_container2_bg">
                <div className='login_card_brds'>
                    <div className='logflx'>
                        <img src={gp_logo} alt='no' className='logoimg'></img>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className='input_container'>
                            <label className='login_label'>Username<span className="required_star">*</span></label>
                            <div className='input_contanier'>
                                <div className="input_icons">
                                    <RiMailLine />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className='input_box'
                                    placeholder="Username"
                                    onChange={(e) =>
                                        handleEmailChange(e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <div className="field_form_alert">
                                        <span className='signup_alert_container'>{errors.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='input_container'>
                            <label className='login_label'>Password <span className="required_star">*</span></label>
                            <div className='input_contanier'>
                                <div className="input_icons">
                                    <RiLockLine />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className='input_box'
                                    placeholder="Password"
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                />
                                {showPassword ? <AiOutlineEye onClick={() => togglePasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => togglePasswordVisibility()} className="eye-icon_login" />}
                                {errors.password && (
                                    <div className="field_form_alert">
                                        <span className='signup_alert_container'>{errors.password}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='remember_container'>
                            <Link to="/ForgotUsername" className="forgot_pass_text">Forgot Username</Link>
                            <span className="forgot_pass_text">|</span>
                            <Link to="/ForgetPassword" className="forgot_pass_text">Forgot Password</Link>
                        </div>
                        <div className='login_btn_container'>
                            <button className="login_btn" type="submit" style={{ fontWeight: "bold" }}>Login</button>
                        </div>
                        {showAlert && (
                            <Alert
                                title={"Alert"}
                                msg={alertMessage}
                                open={true}
                                type={"info"}
                                onClose={handleCloseAlert}
                            />
                        )}
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login;