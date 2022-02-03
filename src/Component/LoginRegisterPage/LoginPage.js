import React, { useEffect, useRef, useState } from 'react';
import '../../Css/LoginPage.css';
import { NavbarLogo } from '../../resrouces/Img';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import NotiPopup from '../Popup/NotiPopup/NotiPopup';
import ErrorPopup from '../Popup/ErrorPopup/ErrorPopup';
import logApi from '../../API/logApi';
import NotiSuccessPopup from '../Popup/NotiPopup/NotiSuccessPopup';
import APP_CONSTANTS from '../../Constants/appConstants';

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [checkedRoleLogin, setCheckedRoleLogin] = useState(["student"]);

    const [triggerNotiPopup, setTriggerNotiPopup] = useState(false);
    const [triggerErrorPopup, setTriggerErrorPopup] = useState(false);
    const [triggerSuccessPopup, setTriggerSuccessPopup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("us") && localStorage.getItem("ps")) {
            setUsername(localStorage.getItem("us"));
            setPassword(localStorage.getItem("ps"));
        }
    },[]);

    let history = useHistory();

    const handleLogIn = async () => {
        if (isEmpty(username) && isEmpty(password)) {
            localStorage.clear();
            localStorage.setItem("rl", checkedRoleLogin);

            const params = {
                "username": username,
                "password": password
                // "role": checkedRoleLogin[0]
            }

            try {
                const response = await logApi.login(params);
                if (response.data && response.data.code === 0) {
                    localStorage.setItem(APP_CONSTANTS.USER_TOKEN, response.data.jwt);
                    setTriggerSuccessPopup(true);
                    setTimeout(() => {
                        setTriggerSuccessPopup(false);
                        history.replace('/');
                    }, 1200);
                } else {
                    setTriggerErrorPopup(true);
                }
                return await logApi.login(params).then(res => console.log(res.data));
            } catch (error) {
                console.log('error login: ', error);
            }
        } else {
            setTriggerNotiPopup(true);
        }
    }

    const handleCheckRole = (value) => {
        setCheckedRoleLogin(prev => {
            const isSelected = checkedRoleLogin.includes(value);
            console.log(isSelected);
            if (isSelected) {
                return checkedRoleLogin.filter(item => item !== value);
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
            <NotiPopup trigger={triggerNotiPopup} setTrigger={setTriggerNotiPopup}>
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
                    }}>Thông báo</h1>
                </div>
                <p style={{ 'fontSize': 19 }}>Vui lòng điền đầy đủ thông tin đăng nhập.</p>
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
                    }}>Lỗi</h1>
                </div>
                <p style={{ 'fontSize': 19 }}>Lỗi đăng nhập hệ thống QUIZ, vui lòng đăng nhập lại.</p>
            </ErrorPopup>
            <NotiSuccessPopup trigger={triggerSuccessPopup} setTrigger={setTriggerSuccessPopup}>
                <div style={{
                    'display': 'flex',
                    'alignItems': 'center'
                }}>
                    <span className="material-icons" style={{
                        'color': '#1AAD8A',
                        'fontSize': 38
                    }}> verified </span>
                    <h1 style={{
                        'fontSize': 24,
                        'marginLeft': 10,
                        'marginTop': 2.5
                    }}>Thành công</h1>
                </div>
                <p style={{ 'fontSize': 19 }}>Đăng nhập hệ thống QUIZ thành công.</p>
            </NotiSuccessPopup>
            <div className="auth-form2">
                <div className="auth-form-broad2">
                    <div className="auth-form-header2">
                        <a href="/">
                            <img src={NavbarLogo} alt='........' />
                        </a>
                        <h1 className="auth-form-heading2">Đăng nhập vào QUIZ</h1>
                    </div>
                    <div className="auth-form-form2">
                        <div className="auth-form-group2">
                            <div className="auth-form-input2">
                                <span className="material-icons icon-login2"> person </span>
                                <input
                                    type="text"
                                    className="Login-input2"
                                    spellCheck="false"
                                    placeholder="Tên đăng nhập"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div className="auth-form-group2">
                            <div className="auth-form-input2">
                                <span className="material-icons icon-login2"> lock </span>
                                <input
                                    type="password"
                                    className="Login-input2"
                                    spellCheck="false"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div className="inputRadio2">
                            <div className="inputRadio2_wrapper">
                                <input
                                    type="checkbox"
                                    checked={checkedRoleLogin[0] === "lecture"}
                                    onChange={() => { handleCheckRole("lecture") }}
                                /><label>Đăng nhập với tư cách giảng viên</label>
                            </div>
                        </div>
                        <button type="submit" className="form-submit2" onClick={handleLogIn}>Đăng nhập</button>
                    </div>
                    <div className="auth-form-aside2">
                        <h5 className="auth-form-policy-text2">
                            Bạn chưa có tài khoản?&ensp;
                            <Link to="/register" className="auth-form-policy-link2">Đăng ký</Link>
                        </h5>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LoginPage
