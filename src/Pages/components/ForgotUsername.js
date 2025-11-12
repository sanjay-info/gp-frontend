import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../components/AppProvider";
import Alert from "../components/Alert";
import { gp_logo } from "../components/imageUrl";
import "../Login.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import DatePicker from "react-datepicker";
import moment from "moment";

const ForgotUsername = () => {
  const [dob, setDob] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClose, setAlertClose] = useState(() => null);
  const [countdown, setCountdown] = useState(180);
  const [mobile, setMobile] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(true);
  const navigate = useNavigate();
  const { PostApi } = useAppContext();
  const [dobDisable, setdobDisable] = useState(false);

  const intervalRef = useRef(null);

  const startCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(intervalRef.current);
          return 0;
        } else {
          return prevCountdown - 1;
        }
      });
    }, 1000);
  };

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxDate = eighteenYearsAgo.toISOString().split("T")[0];

  const mobileOtpBtn = (event) => {
    event.preventDefault();
    setdobDisable(true)
    if (countdown === 0) {
      setCountdown(180);
    }
    if (!dob) {
      toast.error("Please Enter Your Date of Birth.");
      return;
    }
    if (!mobile || !mobile.trim()) {
      toast.error("Please Enter Your Mobile Number.");
      return;
    }
    const url = `/user/forgotUsername?dateOfBirth=${dob}&mobileNo=${mobile}`;
    PostApi("POST", url)
      .then((response) => {
        if (response.data.status === 200) {
          setMobileVerified(true);
          startCountdown();
          toast.success("OTP sent to your Mobile Number.");
        } else {
          toast.error(response.data.message);
          setdobDisable(false)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const mobileOtpVerify = (event) => {
    event.preventDefault();
    if (!mobileOtp || !mobileOtp.trim()) {
      toast.error("Please Enter Your OTP");
      return;
    }
    const url = `/user/validateAndSendUsername?mobileNo=${mobile}&otp=${mobileOtp}`;
    PostApi("POST", url)
      .then((response) => {
        if (response.data.status === 200) {
          setMobileOtpVerified(true);
          setShowOtpField(false); // Hide OTP field after verification
          setShowAlert(true);

          setAlertMessage(response.data.message);
          setAlertClose(() => () => navigate("/"));
        } else if (response.data.status === 409) {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleMobileChange = (value, country) => {
    const phoneNumberWithoutCountryCode = value
      .slice(country.dialCode.length)
      .trim();
    setMobile(phoneNumberWithoutCountryCode);
  };

  return (
    <div>
      <div className="login_container2_bg">
        <div className="login_card">
          <div className="logflx">
            <img src={gp_logo} alt="no" className="logoimg"></img>
          </div>
          <div className="login_form_head_container">
            <text className="login_form_head">Forgot Username</text>
          </div>
          <form>
            <div className="col-lg-12 col-md-12">
              <label className="login_label">
                Date of Birth <span className="required">*</span>
              </label>
              <div className="input_contanier">
                {/* <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    className='inputsf'
                                    value={dob}
                                    // onKeyDown={(event) => {
                                    //     event.preventDefault(); // Prevent typing
                                    // }}
                                    max={maxDate}
                                    onChange={(e) => setDob(e.target.value)}
                                /> */}
                <DatePicker
                  showIcon
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  selected={dob ? new Date(dob) : null}
                  onChange={(date) => {
                    setDob(moment(date).format("YYYY-MM-DD"));
                  }}
                  className="inputsf"
                  placeholderText="dd-mm-yyyy"
                  dateFormat="dd-MM-yyyy"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  // minDate={new Date(maxDate)}
                  shouldCloseOnSelect={true}
                  disabled={dobDisable}
                />
              </div>
            </div>
            <div className="input_container">
              <div className="input_container">
                <label className="login_label">
                  Mobile Number <span className="required">*</span>
                </label>
                <div className="phone_input_container">
                  <PhoneInput
                    countryCodeEditable={false}
                    placeholder="Mobile Number"
                    country={"in"}
                    onlyCountries={["us", "in"]}
                    style={{ width: "100%", height: "43px" }}
                    disabled={
                      dob === null || dob === "" || mobileVerified === true
                    }
                    onChange={handleMobileChange}
                    disableDropdown={
                      dob === null || dob === "" || mobileVerified === true
                    }
                  />

                  {dob !== null && dob !== "" && mobileVerified === false && (
                    <button
                      type="button"
                      style={{
                        position: "absolute",
                        right: "4px",
                        top: "3.5px",
                        height: "36px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#4071f4",
                        width: "80px",
                      }}
                      onClick={mobileOtpBtn}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "white",
                          fontWeight: "bold",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        Request OTP
                      </span>
                    </button>
                  )}
                  {mobileOtpVerified && (
                    <MdVerified
                      style={{ color: "green" }}
                      className="phone_eye_icon"
                    />
                  )}
                </div>
              </div>
              {mobileVerified && showOtpField && (
                <div className="input_contanier">
                  <input
                    type="tel"
                    maxLength={6}
                    className="inputsf"
                    placeholder="Enter Otp"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    onKeyPress={(e) => {
                      const charCode = e.charCode || e.keyCode;
                      if (charCode < 48 || charCode > 57) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <button
                    style={{
                      position: "absolute",
                      right: "4px",
                      top: "3.5px",
                      height: "36px",
                      border: "none",
                      borderRadius: "5px",
                      backgroundColor: "#3fd713",
                      width: "80px",
                    }}
                    onClick={mobileOtpVerify}
                    disabled={mobileOtpVerified === true}
                    type="button"
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        color: "white",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Verify
                    </span>
                  </button>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginTop: "5px",
                    }}
                  >
                    {countdown > 0 && (
                      <div>
                        <label
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          Time Remaining {countdown}s
                        </label>
                      </div>
                    )}
                    <div>
                      {countdown === 0 ? (
                        <span className="link-like" onClick={mobileOtpBtn}>
                          Resend OTP
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="signup_ques_container">
              <h6>
                <Link to="/" className="signup_text">
                  Back To Login
                </Link>
              </h6>
            </div>
          </form>
        </div>
        {showAlert && (
          <Alert
            title={""}
            msg={alertMessage}
            open={true}
            type={"success"}
            onClose={alertClose}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotUsername;
