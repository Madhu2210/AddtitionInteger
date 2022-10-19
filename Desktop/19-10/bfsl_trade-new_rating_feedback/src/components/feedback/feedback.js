import React, { useState } from "react";
import "../feedback/feedback.css";
import Poor from "../feedback/poor-face.png";
import Average from "../feedback/average-face.png";
import Good from "../feedback/good-face.png";
import AttachmentIcon from "../feedback/attachmentImage.png";
import SuccessTick from "../feedback/tick.png";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import {storeRatingAndFeedback, storeAppTheme} from "../../state/actions/Actions";
import LangText from '../../common/lang/LangText';


 function Feedback() {
  console.log("Hello")
  const [poor, setPoor] = useState(false);
  const [average, setAverage] = useState(false);
  const [excellent, setExcellent] = useState(false);
  const [leaveComment, setLeaveComment] = useState(false);
  const [successCard, setSuccessCard] = useState(false);
  const [parentHeader, setParentHeader] = useState(true);
  const [ratingFeedback, setRatingFeedback] = useState(true);

  const feedbackModal = localStorage.getItem('feedbackPopupPage')

  if (feedbackModal==="general"){
    console.log("general")
  }else if(feedbackModal==='fundPage'){
    console.log("fundPage")
  }else if(feedbackModal==='Ipo/Ncds'){
    console.log("Ipo/Ncd's")
  }else{
    console.log("")
  }
  
  
  // function ratingFeedbackPopup() {
  //       props.storeShowMenuFlag(true)
  //   }
  return (
    <div className="main">
      <div className="parent-card">
        <div className="parent-header">
          {parentHeader && (
            <>
              <div className="start-txt">
              <LangText module="RATING_FEEDBACK" name="RATING_FEEDBACK_HEADING" />
              </div>
              <div className="quotes">
              <LangText module="RATING_FEEDBACK" name="RATING_MSG" />
              </div>
              <ul className="maintab">
                <div className="emojitab">
                  <button 
                    onClick={() => {
                      setAverage(false);
                      setExcellent(false);
                      setPoor(true);
                    }} 
                  >
                    <img id="emoji" src={Poor}></img>
                  </button>

                  <button
                    onClick={() => {
                      setExcellent(false);
                      setPoor(false);
                      setAverage(true);
                    }}
                  >
                    <img id="emoji" src={Average}></img>
                  </button>

                  <button
                    onClick={() => {
                      setPoor(false);
                      setAverage(false);
                      setExcellent(true);
                    }}
                  >
                    <img id="emoji" src={Good}></img>
                  </button>
                </div>
              </ul>
            </>
          )}
        </div>

        <div>
          <form className="feedback-form" action="">
            {poor && (
              <>
                <div className="tell-us poor-form">
                  <div className="badIcon" style={{marginLeft: "260px", color: "#7E7E7E", fontWeight: "bold"}}>
                  <LangText module="RATING_FEEDBACK" name="BAD" />
            </div>
                  <h3><LangText module="RATING_FEEDBACK" name="IMPROVED" /></h3><br />

                  <div className="feedback-message">
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="BAD_MSG1" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="BAD_MSG2" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="BAD_MSG3" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="BAD_MSG4" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="BAD_MSG5" /></span>
                    </label>
                  </div>
                </div>
                <div className="add-comments">
                  <p
                    className="leave"
                    onClick={() => {
                      setLeaveComment(true);
                    }}
                  >
                    <LangText module="RATING_FEEDBACK" name="COMMENT_SUGGESTION" />
                    
                  </p>
                  {leaveComment && (
                    <>
                      <textarea
                        type="text"
                        className="txt-box" style={{fontWeight: "bold"}}
                        placeholder="Please let us know your concern or upload a photo and we will get back to you"
                      />
                      <div className="upload-btn-wrapper">
                        <button className="btn">
                          <img id="attachImg" src={AttachmentIcon} />
                          <LangText module="RATING_FEEDBACK" name="UPLOAD_IN_COMMENT" />
                        </button>
                        <input type="file" name="myfile" />
                        <span className="pic-extension">
                        <LangText module="RATING_FEEDBACK" name="PIC_EXTENSION" />
                        </span>
                        <span className="character"><LangText module="RATING_FEEDBACK" name="CHAR" />
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="two-button">
                  <input type="submit" className="common-btn1" value="CANCEL" />
                  <input
                    type="submit"
                    className="common-btn2"
                    value="SUBMIT"
                    onClick={() => {
                      setSuccessCard(true);
                      setAverage(false);
                      setExcellent(false);
                      setPoor(false);
                      setParentHeader(false);
                    }}
                  />
                </div>
              </>
            )}
            {average && (
              <>
                <div className="tell-us average-form">
                  <span className="average-h"><LangText module="RATING_FEEDBACK" name="AVERAGE_ICON" /></span>
                  <h3><LangText module="RATING_FEEDBACK" name="AVERAGE_MSG" /></h3><br />

                  <div className="feedback-message">
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="AVERAGE_MSG1" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="AVERAGE_MSG2" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="AVERAGE_MSG3" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="AVERAGE_MSG4" /></span>
                    </label>
                  </div>
                </div>
                <div className="add-comments">
                  <p
                    className="leave"
                    onClick={() => {
                      setLeaveComment(true);
                    }}
                  >
                    <LangText module="RATING_FEEDBACK" name="COMMENT_SUGGESTION" />
                  </p>
                  {leaveComment && (
                    <>
                      <textarea
                        type="text"
                        className="txt-box" style={{fontWeight: "bold"}}
                        placeholder="Please let us know your concern or upload a photo and we will get back to you."
                      />
                      <div className="upload-btn-wrapper">
                        <button className="btn">
                          <img id="attachImg" src={AttachmentIcon} />
                          <LangText module="RATING_FEEDBACK" name="UPLOAD_IN_COMMENT" />
                        </button>
                        <input type="file" name="myfile" />
                        <span className="pic-extension">
                        <LangText module="RATING_FEEDBACK" name="PIC_EXTENSION" />
                        </span>
                        <span className="character"><LangText module="RATING_FEEDBACK" name="CHAR" /> </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="two-button">
                  <input type="submit" className="common-btn1" value="CANCEL" />
                  <input
                    type="submit"
                    className="common-btn2"
                    value="SUBMIT"
                    onClick={() => {
                      setSuccessCard(true);
                      setAverage(false);
                      setExcellent(false);
                      setPoor(false);
                      setParentHeader(false);
                    }}
                  />
                </div>
              </>
            )}
            {excellent && (
              <>
                <div className="tell-us excellent-form">
                  <span className="excellent-h"><LangText module="RATING_FEEDBACK" name="GOOD_TITLE" /></span>
                  <h3><LangText module="RATING_FEEDBACK" name="GOOD_MSG" /></h3><br />

                  <div className="feedback-message">
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="GOOD_MSG1" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="GOOD_MSG2" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="GOOD_MSG3" /></span>
                    </label>
                    <label>
                      <input type="checkbox" className="personal-input" />
                      <span className="form-card"><LangText module="RATING_FEEDBACK" name="GOOD_MSG4" /></span>
                    </label>
                  </div>
                </div>
                <div className="add-comments">
                  <p
                    className="leave"
                    onClick={() => {
                      setLeaveComment(true);
                    }}
                  >
                    <LangText module="RATING_FEEDBACK" name="COMMENT_SUGGESTION" />
                  </p>
                  {leaveComment && (
                    <>
                      <textarea
                        type="text"
                        className="txt-box"
                        placeholder="Help us know in brief what excites you the most about our app"
                      />
                      <div className="upload-btn-wrapper">
                        <button className="btn">
                          <img id="attachImg" src={AttachmentIcon} />
                          <LangText module="RATING_FEEDBACK" name="UPLOAD_IN_COMMENT" />
                        </button>
                        <input type="file" name="myfile" />
                        <span className="pic-extension">
                        <LangText module="RATING_FEEDBACK" name="PIC_EXTENSION" />
                        </span>
                        <span className="character"><LangText module="RATING_FEEDBACK" name="CHAR" /></span>
                      </div>
                    </>
                  )}
                </div>
                <div className="two-button">
                  <input type="submit" className="common-btn1" value="CANCEL" />
                  <input
                    type="submit"
                    className="common-btn2"
                    value="SUBMIT"
                    onClick={() => {
                      setSuccessCard(true);
                      setAverage(false);
                      setExcellent(false);
                      setPoor(false);
                      setParentHeader(false);
                    }}
                  />
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      {successCard && (
        <>
          <center className="success">
            <img id="tick-img" src={SuccessTick} />
            <span className="txt-success"><LangText module="RATING_FEEDBACK" name="SUCCESS_MSG" /></span>
            <p className="submit-msg" style={{color: "rgb(61, 207, 61)", fontWeight: "bold", fontSize: "17px"}}>
              <LangText module="RATING_FEEDBACK" name="FEEDBACK_CONFIRM" />
            </p>
            <div className="successFeedback" style={{color: "gray"}}>
            <h5><LangText module="RATING_FEEDBACK" name="VALUABLE" /></h5><br />
            <h5><LangText module="RATING_FEEDBACK" name="IMPROVE_SERVICE" /></h5>
            </div>
          </center>
        </>
      )}
    </div>
  );
}

const mapStateToProps = ({ successDialog, settings }) => {
  return {
      successDialog: successDialog.dialog,
      selectedTheme: settings.selectedTheme,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      storeSettingsDialogDetails: (s) => { dispatch((s)) },
      storeAppTheme: (s) => { dispatch(storeAppTheme(s)) },
      storeRatingAndFeedback: (s) => { dispatch(storeRatingAndFeedback(s))}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
