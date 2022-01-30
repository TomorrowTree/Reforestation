import { useMoralis, useMoralisQuery } from "react-moralis"
import Menu from "./Menu"
import "./App.css"
import logo from "./design/TT logo TT Green.png"
import imageMoralisGreen from "./design/Powered-by-Moralis-Badge-Green.png"
import imageAvalanche from "./design/PoweredbyAvalanche_BlackWhite.png"
import backgroundImg from "./design/backg sky(1).png"
import footerImg from "./design/backg trees.png"
import { useState } from "react"
import VotingForm from "./VotingForm"

const App = () => {
  const { authenticate, isAuthenticated } = useMoralis();
  const [currentProposalId, setcurrentProposalId] = useState(0);

  const votingTime = 86400;
  const { data } = useMoralisQuery("NewProposals");

  const projectNames = data
    .filter(proposal => parseInt(proposal.get("proposalStartTime")) > (new Date() / 1000) - votingTime)
    .map(proposal => proposal.get("projectName"));
  const proposalIds = data
    .filter(proposal => parseInt(proposal.get("proposalStartTime")) > (new Date() / 1000) - votingTime)
    .map(proposal => proposal.get("proposalId"));

  if (!isAuthenticated) {
    return (
      <div className="authBody">
        <div className="header">
          <img src={logo} alt="" />
          <img src={backgroundImg} alt="" />
          <Menu />
        </div>
        <div className="authContainer">
          <button className="authenticateBtn" onClick={() => authenticate()}>
            Authenticate
          </button>
        </div>
        <div className="imgContainer">
          <a href="https:\\www.moralis.io">
            <img src={imageMoralisGreen} alt="Powered by Moralis" />
          </a>
          <a href="https://www.avax.network/">
            <img src={imageAvalanche} alt="Powered by Avalanche" />
          </a>
        </div>
      </div>
    )
  }

  const nextProposal = () => {
    if (currentProposalId + 1 < projectNames.length) {
      setcurrentProposalId(currentProposalId + 1);
      return
    }
    setcurrentProposalId(0);
  }

  return (
    <div>
      <div className="header">
        <img src={logo} alt="" />
        <img src={backgroundImg} alt="" />
      </div>
      <Menu />
      <div className="formContainer">
        <VotingForm
          projectName = {projectNames[currentProposalId]}
          proposalId = {proposalIds[currentProposalId]}
          nextProposal = {nextProposal}
         />
      </div>
      <div className="footer">
        <img src={footerImg} alt="" />
      </div>
      <div className="imgContainer">
        <a href="https:\\www.moralis.io">
          <img src={imageMoralisGreen} alt="Powered by Moralis" />
        </a>
        <a href="https://www.avax.network/">
          <img src={imageAvalanche} alt="Powered by Avalanche" />
        </a>
      </div>
    </div>
  )
}

export default App