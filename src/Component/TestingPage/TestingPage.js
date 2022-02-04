import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { Prompt } from 'react-router-dom';
import '../../Css/TestingPage.css'
import ContentTestingPage from './ContentTestingPage';
import SideBarTestingPage from './SideBarTestingPage'
import ResultPage from '../Popup/ResultTestPage/ResultTestPage';

import { questions } from '../../resrouces/MockupData';

function TestingPage() {

    const [tests, setTests] = useState([]);
    const [test, setTest] = useState(questions[0]);
    const [index, setIndex] = useState(1);
    const [choosedCount, setChoosedCount] = useState(0);
    const [showResultPage, setShowResultPage] = useState(false);

    let idStore = useRef([]);
    let idStore2 = useRef([]);
    let idAnswerChoiceFalse = useRef([]);

    useEffect(() => {
        setTests(questions);
        let ms = new Date();
        console.log(ms);
    }, [])

    const getIDListQuestion = (value) => {
        for (var i = 0; i < tests.length; i++) {
            if (tests[i].idQuestion === value) {
                setTest(tests[i]);
                setIndex(i + 1);
            }
        }
    }

    const submit = () => {
        console.log(tests);

        setShowResultPage(true);
    }

    const getChecked = (id, question_choice) => {
        if (!idStore.current.includes(id)) {
            idStore.current = [...(idStore.current || []), id];
        }

        if (test.typeQuestion === 1) {
            idAnswerChoiceFalse.current = question_choice.filter(item => item.your_choice === true);
            if (idAnswerChoiceFalse.current.length === 0 && !idStore2.current.includes(id)) {
                idStore.current = idStore.current.filter(item => item !== id);
            }
        }

        setChoosedCount(idStore.current.length);
    }

    return (
        showResultPage ? <ResultPage /> :
            <React.Fragment>
                <Prompt
                    when={true}
                    message='The system will automatically submit your test if you leave this page!'
                />
                <div className="App_withSidebar">
                    <div className="App_sidebarWrap">
                        <SideBarTestingPage listQuestions={tests} getIndex={getIDListQuestion} countCheck={choosedCount} idCss={idStore.current} indexCss={index} submit={submit} />
                        <div className="App_withSidebarContent">
                            <section className="Section_content">
                                <ContentTestingPage question={test} index={index} checked={getChecked} />
                            </section>
                        </div>
                    </div>
                </div>
            </React.Fragment>
    )
}

export default TestingPage;