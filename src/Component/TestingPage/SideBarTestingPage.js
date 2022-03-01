import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TestApi from '../../API/testApi';
import APP_CONSTANTS from '../../Constants/appConstants';

function SideBarTestingPage({ listQuestions, getIndex, countCheck, idCss, indexCss, submit }) {

    const [submitActive, setSubmitActive] = useState('unfinish');

    const [timerHours, setTimerHours] = useState('0');
    const [timerMinutes, setTimerMinutes] = useState('0');
    const [timerSeconds, setTimerSeconds] = useState('0');

    let interval = useRef();

    let location = useLocation();

    useEffect(() => {

        let query = new URLSearchParams(location.search);

        const startTimer = (object) => {
            // let distanceTime = new Date(object.submissionTime).getTime() - new Date(object.realTime).getTime();

            let distanceTime = new Date(object.startTime).getTime() + new Date(object.time).getTime() - new Date(object.realTime).getTime();
            if (interval.current) {
                clearInterval(interval.current);
            };
            interval.current = setInterval(() => {
                distanceTime = distanceTime - 1000;

                const hours = Math.floor((distanceTime % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
                const minutes = Math.floor((distanceTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distanceTime % (1000 * 60) / 1000));

                if (distanceTime < 0) {
                    submit();
                    clearInterval(interval.current);
                } else {
                    setTimerSeconds(seconds);
                    setTimerMinutes(minutes);
                    setTimerHours(hours);
                }
            }, 1000);
        }

        const getTestInf = async () => {
            try {
                const response = await TestApi.getTestByTestID(query.get("id"));
                if (response) {
                    startTimer(response);
                }
            } catch (error) {
                console.log('error fetch inf test: ', error);
            }
        }

        const finsishSubmit = () => {
            if (listQuestions.length === 0) {
                setSubmitActive('unfinish');
            } else if (countCheck === listQuestions.length) {
                setSubmitActive('finish');
            } else {
                setSubmitActive('unfinish');
            }
        }

        getTestInf();
        finsishSubmit();
    }, [countCheck, listQuestions.length]);


    const handleOnClickOrdinalNumQuestion = (idQuestionSelected) => {
        getIndex(idQuestionSelected);
    }

    const handleSubmit = () => {
        if (submitActive === 'finish') {
            clearInterval(interval.current);
            submit();
        }
    }

    return (
        <div className="Sidebar_wrapperTest">
            <div className="Sidebar_ListTest">
                <div className="Testing_infor">
                    <div className="Infor_wrapper">
                        <label>Mã bài thi:&ensp;<span className="IDTest">{JSON.parse(localStorage.getItem(APP_CONSTANTS.INF_TESTING_TITLE)).idTest}</span></label>
                        <h3>{JSON.parse(localStorage.getItem(APP_CONSTANTS.INF_TESTING_TITLE)).title} - {JSON.parse(localStorage.getItem(APP_CONSTANTS.INF_TESTING_TITLE)).class}</h3>
                        <div>
                            <span className="material-icons icon_teacher"> account_box </span>
                            <p>Giảng viên:&ensp;<span className="TeacherTest">{JSON.parse(localStorage.getItem(APP_CONSTANTS.INF_TESTING_TITLE)).professor}</span></p>
                        </div>
                    </div>
                </div>

                <div className="Testing_time_actions">
                    <div className="Time_Actions_wrapper">
                        <div className="time_wrapper">
                            <div className="time_wrapper-static">
                                <span><div>{timerHours < 10 ? `0${timerHours}` : `${timerHours}`}</div></span>
                                <h4>:</h4><span><div>{timerMinutes < 10 ? `0${timerMinutes}` : `${timerMinutes}`}</div></span>
                                <h4>:</h4><span><div>{timerSeconds < 10 ? `0${timerSeconds}` : `${timerSeconds}`}</div></span>
                            </div>
                        </div>
                        <div className="actions_wrapper">
                            <button className={`status_${submitActive}`} onClick={handleSubmit}>Nộp bài</button>
                        </div>
                    </div>
                </div>

                <div className="Testing_questionList">
                    <div className="QuestionList_wrapper">
                        <h4>Danh sách câu hỏi</h4>
                        <div className="ordinalNumQuestion_wrapper">
                            {
                                listQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        className={`ordinalNumQuestion_square ${(idCss.includes(question.questionId)) ? "status_choosed" : "status_unchoose"} ${(index === indexCss - 1) ? "status_select" : ""}`}
                                        onClick={() => { handleOnClickOrdinalNumQuestion(question.questionId) }}
                                    >{index + 1}</button>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className="Testing_countQuestion">
                    <div className="countQuestion_wrapper">
                        <h4>Tổng số câu:&ensp;<span className="sumQuestion">{listQuestions.length}</span></h4>
                        <h4>Số câu đã chọn:&ensp;<span className="choosedQuestion">{countCheck}</span></h4>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SideBarTestingPage