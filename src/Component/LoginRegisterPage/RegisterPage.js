import React, { useState } from 'react';
import '../../Css/RegisterPage.css';
import { NavbarLogo } from '../../resrouces/Img';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import NotiPopup from '../Popup/NotiPopup/NotiPopup';
import ErrorPopup from '../Popup/ErrorPopup/ErrorPopup';
import logApi from '../../API/logApi';
import NotiSuccessPopup from '../Popup/NotiPopup/NotiSuccessPopup';
import APP_CONSTANTS from '../../Constants/appConstants';
import PopupLoading from '../Popup/PopupLoading/PopupLoading';

function RegisterPage() {

    const [fullName, setFullName] = useState("");
    const [studentCode, setStudentCode] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [checkedGender, setCheckedGender] = useState(1);
    const [checkedRoleRegister, setCheckedRoleRegister] = useState(["student"]);

    const [triggerPopup, setTriggerPopup] = useState(false);
    const [triggerErrorPopup, setTriggerErrorPopup] = useState(false);
    const [triggerSuccessPopup, setTriggerSuccessPopup] = useState(false);
    const [triggerLoadingPopup, setTriggerLoadingPopup] = useState(false);

    const [inputDate, setInputDate] = useState("text")

    let history = useHistory();

    const loginAfterRegister = async (params) => {
        try {
            const responseLog = await logApi.login(params);
            if (responseLog && responseLog.code === 0) {
                localStorage.setItem(APP_CONSTANTS.USER_TOKEN, responseLog.jwt);
            } else {
                setTriggerErrorPopup(true);
            }
        } catch (error) {
            console.log('error login: ', error);
        }
    }

    const handleRegister = async () => {
        if (isEmpty(fullName) && isEmpty(studentCode) && isEmpty(dateOfBirth) && isEmpty(address) && isEmpty(email) && isEmpty(newUsername) && isEmpty(newPassword)) {

            localStorage.clear();
            localStorage.setItem("rl", checkedRoleRegister[0]);

            const paramRegister = {
                "studentCode": studentCode,
                "fullname": fullName,
                "dob": `${dateOfBirth}T17:00:00.000+00:00`,
                "address": address,
                "gender": checkedGender,
                "email": email,
                "username": newUsername,
                "password": newPassword,
                "role": checkedRoleRegister[0]
            }

            const paramLogin = {
                "username": newUsername,
                "password": newPassword
            }

            setTriggerLoadingPopup(true);
            try {
                const response = await logApi.register(paramRegister);
                if (response && response.code === 0) {
                    setTriggerLoadingPopup(false);
                    setTriggerSuccessPopup(true);
                    loginAfterRegister(paramLogin);
                    setTimeout(() => {
                        setTriggerSuccessPopup(false);
                        history.replace('/');
                    }, 1200);
                } else {
                    setTriggerLoadingPopup(false);
                    setTriggerErrorPopup(true);
                }
            } catch (error) {
                setTriggerLoadingPopup(false);
                setTriggerErrorPopup(true);
                console.log('error login: ', error);
            }
        } else {
            setTriggerPopup(true);
        }
    }

    const handleCheckRole = (value) => {
        setCheckedRoleRegister(prev => {
            const isSelected = checkedRoleRegister.includes(value);
            if (isSelected) {
                return checkedRoleRegister.filter(item => item !== value);
            } else {
                return [...prev, value]
            }
        });
    }

    const isEmpty = (needCheck) => {
        return (needCheck !== '' && needCheck.length !== 0) ? true : false
    }

    return (
        <React.Fragment>
            <PopupLoading trigger={triggerLoadingPopup}/>
            <NotiPopup trigger={triggerPopup} setTrigger={setTriggerPopup}>
                <div style={{
                    'display': 'flex',
                    'alignItems': 'center'
                }}>
                    <span className="material-icons" style={{
                        'color': '#77ACF1',
                        'fontSize': 38
                    }}> info</span>
                    <h1 style={{
                        'fontSize': 24,
                        'marginLeft': 10,
                        'marginTop': 2.5
                    }}>Th??ng b??o</h1>
                </div>
                <p style={{ 'fontSize': 19 }}>Vui l??ng ??i???n ?????y ????? th??ng tin ????ng k??.</p>
            </NotiPopup>
            <ErrorPopup trigger={triggerErrorPopup} setTrigger={setTriggerErrorPopup}>
                <div style={{
                    'display': 'flex',
                    'alignItems': 'center'
                }}>
                    <span className="material-icons" style={{
                        'color': '#FC4F4F',
                        'fontSize': 38
                    }}> error </span>
                    <h1 style={{
                        'fontSize': 24,
                        'marginLeft': 10,
                        'marginTop': 2.5
                    }}>L???i</h1>
                </div>
                <p style={{ 'fontSize': 19 }}>L???i ????ng k?? t??i kho???n QUIZ, vui l??ng th??? l???i.</p>
            </ErrorPopup>
            <NotiSuccessPopup trigger={triggerSuccessPopup} setTrigger={setTriggerSuccessPopup}>
                <div style={{
                    'display': 'flex',
                    'alignItems': 'center'
                }}>
                    <span className="material-icons" style={{
                        'color': '#91C483',
                        'fontSize': 38
                    }}> verified </span>
                    <h1 style={{
                        'fontSize': 24,
                        'marginLeft': 10,
                        'marginTop': 2.5
                    }}>Th??nh c??ng</h1>
                </div>
                <p style={{ 'fontSize': 19 }}>????ng k?? t??i kho???n QUIZ th??nh c??ng.</p>
            </NotiSuccessPopup>
            <div className="auth-form3">
                <div className="auth-form-broad3">
                    <div className="auth-form-header3">
                        <a href="/">
                            <img src={NavbarLogo} alt='............' />
                        </a>
                        <h1 className="auth-form-heading3">????ng k?? t??i kho???n QUIZ</h1>
                    </div>
                    <div className="auth-form-form3">
                        <div className="auth-form-group3">
                            <div className="auth-form-label3">
                                <label>Th??ng tin sinh vi??n</label>
                            </div>
                            <div className="auth-form-input3">
                                <span className="material-icons icon-register3"> person </span>
                                <input
                                    type="text"
                                    className="Register_input3"
                                    spellCheck="false"
                                    placeholder="H??? t??n sinh vi??n"
                                    onChange={(e) => { setFullName(e.target.value) }}
                                />
                            </div>
                            <div className="auth-form-input3">
                                <span className="material-icons icon-register3"> vpn_key </span>
                                <input
                                    type="text"
                                    className="Register-input3"
                                    spellCheck="false"
                                    placeholder="M?? s??? sinh vi??n"
                                    onChange={(e) => { setStudentCode(e.target.value) }}
                                />
                            </div>
                            <div className="auth-form-input3">
                                <span className="material-icons icon-register3"> event </span>
                                <input
                                    type={inputDate}
                                    className="Register-input3"
                                    spellCheck="false"
                                    placeholder="Ng??y sinh"
                                    onFocus={() => { setInputDate("date") }}
                                    onBlur={() => { setInputDate("text") }}
                                    onChange={(e) => { setDateOfBirth(e.target.value) }}
                                />
                            </div>
                            <div className="auth-form-input3">
                                <span className="material-icons icon-register3"> home </span>
                                <input
                                    type="text"
                                    className="Register-input3"
                                    spellCheck="false"
                                    placeholder="?????a ch???"
                                    onChange={(e) => { setAddress(e.target.value) }}
                                />
                            </div>
                            <div className="inputRadio">
                                <div className="inputRadio_wrapper">
                                    <input
                                        type="radio"
                                        checked={checkedGender === 1}
                                        onChange={() => { setCheckedGender(1) }}
                                    /><label>Gi???i t??nh nam</label>
                                </div>
                                <div className="inputRadio_wrapper">
                                    <input
                                        type="radio"
                                        checked={checkedGender === 0}
                                        onChange={() => { setCheckedGender(0) }}
                                    /><label>Gi???i t??nh n???</label>
                                </div>
                            </div>
                        </div>
                        <div className="auth-form-group3">
                            <div className="auth-form-label3">
                                <label>Th??ng tin ????ng nh???p</label>
                            </div>
                            <div className="auth-form-input3">
                                <span className="material-icons icon-register3"> alternate_email </span>
                                <input
                                    type="text"
                                    className="Register-input3"
                                    spellCheck="false"
                                    placeholder="Email"
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                            </div>
                            <div className="auth-form-input3">
                                <span className="material-icons icon-register3"> person </span>
                                <input
                                    type="text"
                                    className="Register-input3"
                                    spellCheck="false"
                                    placeholder="T??n ????ng nh???p m???i"
                                    onChange={(e) => { setNewUsername(e.target.value) }}
                                />
                            </div>
                            <div className="auth-form-input3">
                                <span className="material-icons icon-register3"> lock </span>
                                <input
                                    type="password"
                                    className="Register-input3"
                                    spellCheck="false"
                                    placeholder="M???t kh???u"
                                    onChange={(e) => { setNewPassword(e.target.value) }}
                                />
                            </div>
                            <div className="inputRadio">
                                <div className="inputRadio_wrapper">
                                    <input
                                        type="checkbox"
                                        checked={checkedRoleRegister.includes("lecture")}
                                        onChange={() => { handleCheckRole("lecture") }}
                                    /><label>????ng k?? v???i t?? c??ch gi???ng vi??n</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="form-submit3" onClick={handleRegister}>????ng k??</button>
                    </div>
                    <div className="auth-form-aside3">
                        <h5 className="auth-form-policy-text3">
                            B???n ???? c?? t??i kho???n?&ensp;
                            <Link to="/login" className="auth-form-policy-link3">????ng nh???p</Link>
                        </h5>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default RegisterPage
