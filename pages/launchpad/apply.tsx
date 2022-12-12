import { FORM_INPUT_TEXT, FORM_RADIO } from "helpers/core-constants";
import React, { useEffect, useState } from "react";
import { launchpadDynamicFromAction } from "state/actions/launchpad";

const Apply = () => {
  const [launchpadForm, setLaunchpadForm] = useState([]);
  useEffect(() => {
    launchpadDynamicFromAction(setLaunchpadForm);
  }, []);
  return (
    <div className="container">
      {JSON.stringify(launchpadForm)}
      <div className="appy-form">

        <div className="form-div">
          <label htmlFor="">
            There are many variations of passages of Lorem Ipsum available, but
            the majority
          </label>
          <input type="number" className="form-control apply-input" id="" />
        </div>

        <div className="form-div">
          <label htmlFor="">
            There are many variations of passages of Lorem Ipsum available, but
            the majority
          </label>
          <select className="form-control apply-select-field" name="" id="">
            <option value="">A</option>
            <option value="">B</option>
            <option value="">C</option>
            <option value="">D</option>
          </select>
        </div>

        <div className="form-div">
          <label htmlFor="">
            There are many variations of passages of Lorem Ipsum available, but
            the majority
          </label>
          <input
            className="form-control apply-checkbox-input"
            type="checkbox"
          />
        </div>

        <div className="form-div">
          <label htmlFor="">
            There are many variations of passages of Lorem Ipsum available, but
            the majority
          </label>
          <input className="form-control apply-radio-input" type="radio" />
        </div>

        <div className="form-div">
          <label htmlFor="">
            There are many variations of passages of Lorem Ipsum available, but
            the majority
          </label>
          <input className="apply-file-input" type="file" />
        </div>


      </div>

      {/* {launchpadForm?.map(
        (item: any) =>
          item.type === FORM_INPUT_TEXT && (
            <input type="number" className="form-control" id="amount-one" />
          )
      )} */}
    </div>
  );
};

export default Apply;
