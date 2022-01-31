import Card from "./Card";
import Moralis from "moralis";
import contract from "./contract.json";
import { useMoralisQuery } from "react-moralis";

const VotingForm = (props) => {

    const projectName = props.projectName;
    const { data, error, isLoading } = useMoralisQuery("Proposal", query => 
        query
            .equalTo("projectName", projectName),
        [projectName]
    );
    
    const mapImageLink = data[0] ? data[0].get("mapImageLink") : "";
    const proposalId = props.proposalId;
        
    const voteOnProposal = async (vote) => {
        const { abi, address } = contract;

        await Moralis.enableWeb3()


        const options = {
        contractAddress: address,
        functionName: "voteOnProposal",
        abi: abi,
        params: {
            _proposalId: proposalId,
            _vote: vote
        },
        }        
        await Moralis.executeFunction(options);
    };


    const entityData = [
        ["Website", data[0] ? data[0].get("website") : ""],
        ["Owner", data[0] ? data[0].get("ownerName") : ""],
        ["Proposal ID", proposalId],
        ["Type", data[0] ? data[0].get("type") : ""],
        ["Email", data[0] ? data[0].get("email") : ""],
        ["Owner Address", data[0] ? data[0].get("ownerAddress") : ""],
        ["File",  data[0] ? data[0].get("fileLink") : ""],
        ["Entity Legal Name", data[0] ? data[0].get("entityLegalName") : ""],
        ["Registration Number", data[0] ? data[0].get("registrationNumber") : ""],
        ["Entity Address", data[0] ? data[0].get("entityAddress") : ""],
        ["Tax Number", data[0] ? data[0].get("taxNumber") : ""]
    ]

    
    return(
        <Card>
            <img src = {mapImageLink} alt="Map"></img>
            <ul className = "descriptionContainer">
                {entityData.map(a => {
                    return(a[1] ?
                        <li key={a[0]}>
                        <div className="keyItem">{a[0]}</div>
                        <div className="valueItem">{a[1]}</div>
                        </li> : ""
                    )
                })}
            </ul>
            <div className="btnContainer">
                <button className="mainButton" onClick={() => voteOnProposal(proposalId, true)}>Yes</button>
                <button className="mainButton" onClick={() => voteOnProposal(proposalId, false)}>No</button>
            </div>
            <button className="arrowButton" onClick={() => props.nextProposal()}>{">"}</button>

        </Card>
    )
}

export default VotingForm;