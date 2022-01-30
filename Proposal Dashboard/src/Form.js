import React, { useState } from "react"
import Subform from "./Subform"
import styles from "./Form.css"

const Form = (props) => {
  const [formType, setFormType] = useState(props.userType)

  const setFormNGO = () => {
    setFormType("NGO")
  }
  const setFormCompany = () => {
    setFormType("company")
  }

  const setFormLand = () => {
    setFormType("land")
  }

  return (
    <div>
      <form style={styles}>
        <input
          type="radio"
          id="npngo"
          name="type"
          value="Non-Profit / NGO"
          onClick={setFormNGO}
        ></input>
        <label htmlFor="npngo">Non-Profit / NGO</label>
        <input
          type="radio"
          id="company"
          name="type"
          value="Company"
          onClick={setFormCompany}
        ></input>
        <label htmlFor="company">Company</label>
        <input
          type="radio"
          id="fland"
          name="type"
          value="Forest estate / land"
          onClick={setFormLand}
        ></input>
        <label htmlFor="fland">Forest estate / land</label>
      </form>
      {formType && (
        <Subform
          polygonArea={props.polygonArea}
          mapImage={props.mapImage}
          formType={formType}
        />
      )}
    </div>
  )
}

export default Form
