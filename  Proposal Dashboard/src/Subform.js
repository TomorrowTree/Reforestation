import React, { useState } from "react"
import { useMoralis, useMoralisFile, useNewMoralisObject } from "react-moralis"
import emailValidator from "./emailValidator"
import Moralis from "moralis"
import contract from "./contract.json"

const Subform = (props) => {
  const { setUserData } = useMoralis()
  const initialFormData = {}
  const { saveFile } = useMoralisFile()
  const [formData, setFormData] = useState(initialFormData)
  const [selectedFile, setSelectedFile] = useState()
  const [emailWarning, setEmailWarning] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    })
  }

  const fileUploadHandler = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const submitFile = async () => {
    const file = selectedFile
    const name = selectedFile.name
    let fileIpfs = await saveFile(name, file, { saveIPFS: true })
    setUserData({ fileLink: fileIpfs.toJSON().url })
    saveProposal({ fileLink: fileIpfs.toJSON().url })
  }

  const { isSaving, error, save } = useNewMoralisObject("Proposal")

  const saveProposal = save

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (formData.email) {
      if (emailValidator(formData.email)) {
        const random = Math.floor(Math.random() * 10 ** 6)
        setUserData({
          type: props.formType,
          mapImageLink: props.mapImage,
          ...formData,
          projectName: formData.projectName + "_" + random,
        })

        saveProposal({
          type: props.formType,
          mapImageLink: props.mapImage,
          ...formData,
          projectName: formData.projectName + "_" + random,
        })

        if (selectedFile) {
          submitFile()
        }
        setEmailWarning(false)

        const projectName = formData.projectName + "_" + random
        const tokensToBeMinted = Math.floor(props.polygonArea * 0.1065)

        await submitNewProposal(projectName, tokensToBeMinted)
      } else {
        setEmailWarning(true)
      }
    }
  }

  const submitNewProposal = async (projectName, tokensToBeMinted) => {
    await Moralis.enableWeb3()

    const options = {
      contractAddress: contract.address,
      functionName: "newProposal",
      abi: contract.abi,
      params: {
        _projectName: projectName,
        _tokensToBeMinted: tokensToBeMinted,
      },
    }

    const receipt = await Moralis.executeFunction(options)
    setUserData({ proposaltime: Date() })
    saveProposal({ proposaltime: Date() })
    return receipt
  }

  if (props.formType === "land") {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="projectName">Project name</label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          placeholder="Required"
          onChange={handleChange}
        ></input>
        <label htmlFor="email">e-mail</label>
        <input
          style={emailWarning ? { border: "solid red" } : {}}
          id="email"
          type="text"
          name="email"
          placeholder="Required"
          onChange={handleChange}
        ></input>
        <label htmlFor="ownerName">Owner name</label>
        <input
          id="ownerName"
          type="text"
          name="ownerName"
          onChange={handleChange}
        ></input>
        <label htmlFor="ownerAddress">Owner address</label>
        <input
          id="ownerAddress"
          type="text"
          name="ownerAddress"
          onChange={handleChange}
        ></input>
        <input
          type="file"
          name="file"
          id="file"
          onChange={fileUploadHandler}
        ></input>
        <input type="submit"></input>
        <p>
          Only registerd users can submit a proposal. Click{" "}
          <a href="https://tomorrowtree.org/hero/dapp/register">here</a> to
          register.
        </p>
      </form>
    )
  } else {
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="projectName">Project name</label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          placeholder="Required"
          onChange={handleChange}
        ></input>
        <label htmlFor="email">e-mail</label>
        <input
          style={emailWarning ? { border: "solid red" } : {}}
          id="email"
          type="text"
          name="email"
          placeholder="Required"
          onChange={handleChange}
        ></input>
        <label htmlFor="name">Entity legal name</label>
        <input
          type="text"
          id="name"
          name="entityLegalName"
          onChange={handleChange}
        ></input>
        <label htmlFor="address">Entity address</label>
        <input
          type="text"
          id="address"
          name="entityAddress"
          onChange={handleChange}
        ></input>
        <label htmlFor="rnum">Registration number</label>
        <input
          type="number"
          id="rnum"
          name="registrationNumber"
          onChange={handleChange}
        ></input>
        <label htmlFor="tnum">Tax number</label>
        <input
          type="number"
          id="tnum"
          name="taxNumber"
          onChange={handleChange}
        ></input>
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          onChange={handleChange}
        ></input>
        <label htmlFor="smedia">Social media</label>
        <input
          type="text"
          id="smedia"
          name="socialMedia"
          onChange={handleChange}
        ></input>
        <input type="file" name="file" onChange={fileUploadHandler}></input>
        <input type="submit"></input>
        <p>
          Only registerd users can submit a proposal. Click{" "}
          <a href="https:\\tomorrowtree.org">here</a> to register.
        </p>
      </form>
    )
  }
}

export default Subform
