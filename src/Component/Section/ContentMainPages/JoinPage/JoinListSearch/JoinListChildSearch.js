import React, { useEffect, useState } from 'react';
import ExamApi from '../../../../../API/examApi';
import { useHistory } from 'react-router-dom';
import ErrorPopup from '../../../../Popup/ErrorPopup/ErrorPopup';
import NotiSuccessPopup from '../../../../Popup/NotiPopup/NotiSuccessPopup';
import PopupLoading from '../../../../Popup/PopupLoading/PopupLoading';

function JoinListChildSearch({ exam }) {

    const [joinedCss, setJoinedCss] = useState('joined');

    const [triggerErrorPopup, setTriggerErrorPopup] = useState(false);
    const [triggerSuccessPopup, setTriggerSuccessPopup] = useState(false);
    const [triggerLoadingPopup, setTriggerLoadingPopup] = useState(false);

    let history = useHistory();

    useEffect(() => {

        const checkJoined = () => {
            if (exam.status === 'not_yet') {
                setJoinedCss('not_joined_yet');
            } else {
                setJoinedCss('joined');
            }
        }

        checkJoined();
    }, [exam]);

    const joinExam = async () => {
        setTriggerLoadingPopup(true);
        try {
            const response = await ExamApi.joinExam(exam.examCode);
            if (response && response.code === 0) {
                setTriggerLoadingPopup(false);
                setTriggerSuccessPopup(true);
                setTimeout(() => {
                    setTriggerSuccessPopup(false);
                    history.replace('/join');
                }, 1200);
            } else {
                setTriggerLoadingPopup(false);
                setTriggerErrorPopup(true);
            }
        } catch (error) {
            console.log('error join: ', error);
            setTriggerLoadingPopup(false);
            setTriggerErrorPopup(true);
        }
    }


    return (
        <React.Fragment>
            <PopupLoading trigger={triggerLoadingPopup}/>
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
                <p style={{ 'fontSize': 19 }}>L???i tham gia v??o k?? thi, vui l??ng th??? l???i.</p>
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
                    }}>Th??nh c??ng</h1>
                </div>
                <p style={{ 'fontSize': 19 }}>Tham gia k?? thi th??nh c??ng.</p>
            </NotiSuccessPopup>
            <section className="Exam_examItem5">
                <div className="examItem_wrapper5">
                    <div className="green_retangle5"></div>
                    <div className="item_label-red5">
                        <label>M?? k?? thi:&ensp;<span>{exam.examCode}</span></label>
                        <h1>{exam.title}</h1>
                    </div>
                    <div className="item_infomation5">
                        <div className='item_infomation5-professor'>
                            <span className="material-icons icon_teacher5"> account_box </span>
                            <p>Gi???ng vi??n:&nbsp;</p><h5>{exam.professor}</h5>
                        </div>
                    </div>
                    <button className={`item_join ${joinedCss}`} onClick={joinExam}>Tham gia</button>
                </div>
            </section>
        </React.Fragment>
    )
}

export default JoinListChildSearch