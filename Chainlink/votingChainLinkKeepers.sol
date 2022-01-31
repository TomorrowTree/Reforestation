// SPDX-License-Identifier: MIT

/*
----------------------------------------------------------------------------------------------------
Tomorrow Tree Project Voting - Test 2
----------------------------------------------------------------------------------------------------
*/

pragma solidity ^0.8.0;

import "./ITTTT2.sol";
import "./ITreasury.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

contract Voting is KeeperCompatibleInterface{


    /*---------------------------------------------------------------------------------------
    State variables, constructor, modifiers, events
    ---------------------------------------------------------------------------------------*/

    uint endedProposalId = 0;

    address TomorrowTree; // Owner and admin
    address payable TomorrowTreeDestroy; //for destroying the Test Token contract
    address TestTokenContractAddress; // Address of the Tomorrow Tree Test Token Smart Contract
    address TreasuryContractAddress; // Address of Tomorrow Tree's Treasury Smart Contract

    uint VotingTime;

    modifier onlyOwner(){
        require(msg.sender == TomorrowTree, "Only Tomorrow Tree can call this function");
        _;
    }

    modifier isVoterModifier(address voterAddress) {
        require(voterRegister[voterAddress].isVoter == true,"This address is a voter");
        _;
    }

// Maybe we add a function that sets the length of timer ? Added
    modifier timer(uint startTime, uint timeInSeconds){
        require(block.timestamp < startTime + timeInSeconds, "Time is up.");
        _;
    }

    modifier isProposerModifier(address proposerAddress){
        require(proposerRegister[proposerAddress].isProposer == true,"This address is a proposer");
        _;
    }

    modifier oneActiveProposal(address proposerAddress){
        require(proposerRegister[proposerAddress].activeProposal == false,"This address is already runing a proposal" );
        _;
    }


    event OwnershipTransferred(address indexed _oldOwner, address indexed _newOwner);
    event voterRegistered(uint64 indexed voterId, address voterAddress);
    event voterSuspended(uint64 indexed voterId);
    event voterRestored(uint64 indexed voterId);
    event voterDeleted(uint64 indexed voterId);
    event newProposalProposed(string projectName, uint proposalStartTime, uint indexed proposalId);
    event projectNameUpdated(uint indexed proposalId, string projectName);
    event proposalVotingEnded(bool indexed proposalPassed, uint128 proposalYesVote, uint128 proposalTotalVote);
    event voterVoted(uint64 indexed voterId, uint indexed proposalId, bool choice);
    event voterRewarded(uint indexed voterId, address voterAddress);
    event proposerRegistered(uint64 indexed proposerID, address proposerAddress);
    event proposerSuspended(uint64 indexed proposerID);
    event proposerRestored(uint64 indexed proposerID);
    
    constructor() {
        TomorrowTree = msg.sender;
    }

    function changeOwner(address _newOwner) external onlyOwner {
        address _oldOwner = TomorrowTree;
        TomorrowTree = _newOwner;
        emit OwnershipTransferred(_oldOwner, _newOwner);
    }

    function setTestTokenContractAddress(address _TestTokenContractAddress) onlyOwner external {
        TestTokenContractAddress = _TestTokenContractAddress;
    }

    function setTreasuryContractAddress(address _TreasuryContractAddress) onlyOwner external {
        TreasuryContractAddress = _TreasuryContractAddress;
    }

    function setDestroyAddress(address payable _DestroyAddress) onlyOwner external {
        TomorrowTreeDestroy = _DestroyAddress;
    }

    function setVotingTime(uint newVotingTime) onlyOwner external{
        votingTime = newVotingTime;
    }

    /*---------------------------------------------------------------------------------------
    Voter
    ---------------------------------------------------------------------------------------*/


    struct Voter {
        uint64 voterID;
        uint64 totalVoterVotes;
        uint64 totalTTTEarned;
        bool isVoter;
    }

    mapping(address => Voter) public voterRegister;
    address[] public voterList;

    function isVoter(address voterAddress) public view returns(bool isVoterIndeed) {
        if(voterList.length == 0){
            return false;
        }
        return (voterList[voterRegister[voterAddress].voterID] == voterAddress);
        //what about if voter is suspended ? This function enables us to see if voter has already been registered
    }

    function getNumberOfVoters() public view returns(uint numberOfVoters) {
        return voterList.length;
    }    

    function registerVoter(address voterAddress) public onlyOwner returns(bool success) {
        if(isVoter(voterAddress)) revert(); 
        voterRegister[voterAddress].isVoter = true;
        voterList.push(voterAddress);
        voterRegister[voterAddress].voterID = uint64(voterList.length - 1);

        emit voterRegistered(uint64(voterList.length - 1), voterAddress);

        return true; 
    }

    function suspendVoter(address voterAddress) public isVoterModifier(voterAddress) onlyOwner returns(bool success) {
        voterRegister[voterAddress].isVoter = false;

        emit voterSuspended(voterRegister[voterAddress].voterID);

        return true;
    }

    function restoreVoter(address voterAddress) public onlyOwner returns(bool success) {
        voterRegister[voterAddress].isVoter = true;

        emit voterRestored(voterRegister[voterAddress].voterID);

        return true;
    }

    function deleteVoter(address voterAddress) public onlyOwner returns(bool success) {
        voterRegister[voterAddress].isVoter = false;
        uint voterToDelete = voterRegister[voterAddress].voterID;
        address voterToMove   = voterList[voterList.length-1];
        voterList[voterToDelete] = voterToMove;
        voterRegister[voterToMove].voterID = uint64 (voterToDelete);
        voterList.pop();
        delete voterRegister[voterAddress];

        emit voterDeleted(voterRegister[voterAddress].voterID);

        return true;
    }

    function getVoterData(address voterAddress) public view returns(uint64, uint64,uint64, bool) {
        return(voterRegister[voterAddress].voterID, voterRegister[voterAddress].totalVoterVotes,voterRegister[voterAddress].totalTTTEarned, voterRegister[voterAddress].isVoter);
    }

    /*---------------------------------------------------------------------------------------
    Proposals creators
    ---------------------------------------------------------------------------------------*/

    struct Proposer {
        uint64 proposerID;
        uint64 totalProposalsCreated;
        bool activeProposal;
        bool isProposer;
    }

    mapping(address => Proposer) public proposerRegister;
    address[] public proposerList;

    //ProposerID to array with proposalIDs that he created
    mapping(uint => uint[]) public proposersProposals;

    function isProposer(address proposerAddress) public view returns(bool isProposerIndeed) {
        if(proposerList.length == 0){
            return false;
        }
        return (proposerList[proposerRegister[proposerAddress].proposerID] == proposerAddress);
        //what about if proposer is suspended ? This function enables us to see if proposer has already been registered
    }

    function getNumberOfProposers() public view returns(uint numberOfProposers) {
        return proposerList.length;
    }    

    function registerProposer(address proposerAddress) public onlyOwner returns(bool success) {
        if(isProposer(proposerAddress)) revert(); 
        proposerRegister[proposerAddress].isProposer = true;
        proposerList.push(proposerAddress);
        proposerRegister[proposerAddress].proposerID = uint64(proposerList.length - 1);

        emit proposerRegistered(uint64(proposerList.length - 1), proposerAddress);

        return true; 
    }

    function suspendProposer(address proposerAddress) public isProposerModifier(proposerAddress) onlyOwner returns(bool success) {
        proposerRegister[proposerAddress].isProposer = false;

        emit proposerSuspended(proposerRegister[proposerAddress].proposerID);

        return true;
    }

    function restoreProposer(address proposerAddress) public onlyOwner returns(bool success) {
        proposerRegister[proposerAddress].isProposer = true;

        emit proposerRestored(proposerRegister[proposerAddress].proposerID);

        return true;
    }

    function getProposersProposals(address proposerAddress) public view returns(uint[] memory){
        return proposersProposals[proposerRegister[proposerAddress].proposerID];
    }

    function getProposerData(address proposerAddress) public view returns(uint64, uint64,bool, bool) {
        return(proposerRegister[proposerAddress].proposerID, proposerRegister[proposerAddress].totalProposalsCreated,proposerRegister[proposerAddress].activeProposal ,proposerRegister[proposerAddress].isProposer);
    }

    /*---------------------------------------------------------------------------------------
    Project Proposals
    ---------------------------------------------------------------------------------------*/


    struct ProjectProposal {
        string projectName;
        uint128 proposalYesVote;
        uint128 proposalTotalVote;
        uint proposalStartTime;
        uint tokensToBeMinted;
        address proposerAddress; // proposer that submitted the project 
        bool votingEnded;
        bool proposalPassed;// passes if more than 50% of the votes were YES
    }

    ProjectProposal[] public proposalList;

    function getNumberOfProposals() public view returns(uint numberOfProposals) {
        return proposalList.length;
    }

    //Only the frontend should be able to call this function; we will register project submitters beforehand
    //To keep things simple and concise during initial testing, we are leaving the function open
    function newProposal(string memory _projectName, uint _tokensToBeMinted) public isProposerModifier(msg.sender) oneActiveProposal(msg.sender) returns(uint) {
        ProjectProposal memory p;
        p.projectName = _projectName;
        p.proposerAddress = msg.sender;
        p.tokensToBeMinted = _tokensToBeMinted;
        p.proposalStartTime = block.timestamp;
        proposalList.push(p);

        //adds proposalID to the mapping so we can find what proposals did proposer create
        proposersProposals[proposerRegister[msg.sender].proposerID].push(proposalList.length-1);
        proposerRegister[msg.sender].totalProposalsCreated++;

        emit newProposalProposed(_projectName, block.timestamp, proposalList.length-1);

        return proposalList.length-1;
    }

    function updateProjectName(uint _proposalId, string memory _proposalName) external onlyOwner returns(bool success) {
        if((proposalList.length-1) > _proposalId) revert();
        proposalList[_proposalId].projectName = _proposalName;

        emit projectNameUpdated(_proposalId, _proposalName);

        return true;
    }

    function getProposalData(uint _proposalId) public view returns(string memory, uint128, uint128,uint,address, bool, bool) {
        return(proposalList[_proposalId].projectName, proposalList[_proposalId].proposalYesVote, proposalList[_proposalId].proposalTotalVote,proposalList[_proposalId].proposalStartTime, proposalList[_proposalId].proposerAddress,proposalList[_proposalId].votingEnded, proposalList[_proposalId].proposalPassed);
    }


    /*---------------------------------------------------------------------------------------
    Voting
    ---------------------------------------------------------------------------------------*/


    struct Vote {
        bool didVote;
        bool choice; 
    }

    mapping(address => mapping(uint => Vote)) public didVoterVote; 
    mapping(uint => address[]) public proposalVoters;

    function voteOnProposal(uint _proposalId, bool _vote) public timer(proposalList[_proposalId].proposalStartTime,votingTime){
        //next three lines could be modifiers!
        require(isVoter(msg.sender) == true, "Only registered voters can vote!");
        require(didVoterVote[msg.sender][_proposalId].didVote == false); //only one vote per voter
        require(proposalList[_proposalId].votingEnded == false);

        proposalVoters[_proposalId].push(msg.sender); // adds the address to proposalVoters mapping
        voterRegister[msg.sender].totalVoterVotes++;
        proposalList[_proposalId].proposalTotalVote++; 
        didVoterVote[msg.sender][_proposalId].choice = _vote; // saves what the voter voted
        if(_vote == true) {
            proposalList[_proposalId].proposalYesVote++;
        }
        didVoterVote[msg.sender][_proposalId].didVote = true;
        // Rewarding voters from treasury contract:
        TomorrowTreeTreasury treasury = TomorrowTreeTreasury(TreasuryContractAddress);
        treasury.rewardVoter(msg.sender);

        emit voterVoted(voterRegister[msg.sender].voterID, _proposalId, _vote);

    }


    function endVote(uint _proposalId, uint percentageToTresuary) public  onlyOwner {
        require(proposalList[_proposalId].votingEnded == false);
        proposalList[_proposalId].votingEnded = true;

        proposalList[_proposalId].proposalPassed = calculateVote(proposalList[_proposalId].proposalYesVote, proposalList[_proposalId].proposalTotalVote);
        
        if(proposalList[_proposalId].proposalPassed == true){
            mintTokens(proposalList[_proposalId].proposerAddress,proposalList[_proposalId].tokensToBeMinted, percentageToTresuary);
        }
        
        emit proposalVotingEnded(proposalList[_proposalId].proposalPassed, proposalList[_proposalId].proposalYesVote, proposalList[_proposalId].proposalTotalVote);

    }

    function calculateVote(uint _votesYes, uint _totalVotes) internal pure returns(bool) {
        return (_votesYes*10 / _totalVotes >= 5);
    }

    function mintTokens(address _creatorAddress, uint _tokensToBeMinted, uint percentageToTresuary) private { //onlyContract mod
        TomorrowTreeTestToken2 token = TomorrowTreeTestToken2(TestTokenContractAddress);

        uint tokensToTresuary = (_tokensToBeMinted*percentageToTresuary)/100;
        token.mint(_creatorAddress, (_tokensToBeMinted - tokensToTresuary));
        token.mint(/*tresurayAddress*/, tokensToTresuary);
    }

/*---------------------------------------------------------------------------------------
    ChainLink Keepers
---------------------------------------------------------------------------------------*/


    function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {

        upkeepNeeded = false;

        for(uint i = 1; i<= proposalList.length; i++){

            if(!(proposalList[i].ended) && proposalList[i].startTime + voteLength < block.timestamp){
                upkeepNeeded = true;
                break;
            }

        }

        performData = checkData;
    }

    function performUpkeep(bytes calldata performData) external override {

        proposalList[endedProposalId].votingEnded = true;
        endedProposalId++;

        performData;
    }

/*---------------------------------------------------------------------------------------
    Destroy Contract
---------------------------------------------------------------------------------------*/


    //must transfer ownership to TomorrowTreeDestroy before evoking
    function destroyContract() public onlyOwner { 
    selfdestruct(TomorrowTreeDestroy);
    }

}