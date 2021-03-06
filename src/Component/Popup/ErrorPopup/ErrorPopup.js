import React from 'react';
import '../../../Css/NotiPopup.css'

function ErrorPopup(props) {
    return (props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <span className="material-icons close-noti" onClick={() => props.setTrigger(false)}> close </span>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default ErrorPopup;
