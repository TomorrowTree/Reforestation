const logger = Moralis.Cloud.getLogger();

Moralis.Cloud.beforeSave("NewProposals", (request) => {

    const confirmed = request.object.get("confirmed");
    const projectName = request.object.get("projectName");
    const proposalId = request.object.get("proposalId");
    const proposalStartTime = request.object.get("proposalStartTime");

    request.object.set("proposalStartTime", parseInt(proposalStartTime));
  
  	let emailSubject = `A new Project Proposal has been submitted`;
  	let emailBody = `${projectName} has the ID: ${proposalId} \n\n\n`;
    


    //send email if confirmed
    if(confirmed){
      
        let dataEmail = {
            app_id: "95e2bb13-b2be-471d-9e63-92368ad880e0",
            contents: {"en": "Notification"},
            included_segments: ["bucar"], //OneSignal Segements
            name: "Email",
            email_body: emailBody,
            email_subject: emailSubject
        };
            
        Moralis.Cloud.httpRequest({
              method: "POST",
              url: "https://onesignal.com/api/v1/notifications",
              body: dataEmail,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic MWYzMmUwOGYtYTAzYS00MTEwLWE4MWYtMTRhZGQ2MjkxNGI4' // Rest API Key from OneSignal
              }
            });
    };
      
});

// Moralis.Cloud.beforeSave("ProposalPassed", (request) => {

//     const confirmed = request.object.get("confirmed");
//     const proposalId = request.object.get("_proposalId");
//     const proposalYesVote = request.object.get("proposalYesVote");
//     const proposalTotalVote = request.object.get("proposalTotalVote");
//     const precentageFor = Math.round(( proposalYesVote / proposalTotalVote ) * 10000)/100;

//     logger.info("confirmed" + confirmed + "\nproposalId: " + proposalId + "\nproposalTotalVote: " + proposalTotalVote + "\nproposalYesVote: " + proposalYesVote + "\nprecentageFor: " + precentageFor)

//   	let emailSubject = `Proposal Passed`;
//   	let emailBody = `Proposal with the ID: ${proposalId} passed with ${precentageFor}% votes for.\n\n`;
    

//     //send email if confirmed (For later)
//     // if(confirmed){
      
//     //     let dataEmail = {
//     //         app_id: "95e2bb13-b2be-471d-9e63-92368ad880e0",
//     //         contents: {"en": "Notification"},
//     //         included_segments: ["bucar"], //OneSignal Segements
//     //         name: "Email",
//     //         email_body: emailBody,
//     //         email_subject: emailSubject
//     //     };
            
//     //     Moralis.Cloud.httpRequest({
//     //           method: "POST",
//     //           url: "https://onesignal.com/api/v1/notifications",
//     //           body: dataEmail,
//     //           headers: {
//     //               'Content-Type': 'application/json',
//     //               'Authorization': 'Basic MWYzMmUwOGYtYTAzYS00MTEwLWE4MWYtMTRhZGQ2MjkxNGI4' // Rest API Key from OneSignal
//     //           }
//     //         });
      
//     // };
      
// });

// Moralis.Cloud.beforeSave("ProposalRejected", (request) => {
    

//     const confirmed = request.object.get("confirmed");
//     const proposalId = request.object.get("_proposalId");
//     const proposalYesVote = request.object.get("proposalYesVote");
//     const proposalTotalVote = request.object.get("proposalTotalVote");
//     const precentageFor = Math.round(( proposalYesVote / proposalTotalVote ) * 10000)/100;
    
//     logger.info("confirmed" + confirmed + "\nproposalId: " + proposalId + "\nproposalTotalVote: " + proposalTotalVote + "\nproposalYesVote: " + proposalYesVote + "\nprecentageFor: " + precentageFor)
  	
//     let emailSubject = `Proposal rejected`;
//   	let emailBody = `Proposal with the ID: ${proposalId} was rejected with ${precentageFor}% votes for.\n\n`;
    
//     //send email if confirmed (For later)
//     // if(confirmed){
      
//     //     let dataEmail = {
//     //         app_id: "95e2bb13-b2be-471d-9e63-92368ad880e0",
//     //         contents: {"en": "Notification"},
//     //         included_segments: ["bucar"], //OneSignal Segements
//     //         name: "Email",
//     //         email_body: emailBody,
//     //         email_subject: emailSubject
//     //     };
            
//     //     Moralis.Cloud.httpRequest({
//     //           method: "POST",
//     //           url: "https://onesignal.com/api/v1/notifications",
//     //           body: dataEmail,
//     //           headers: {
//     //               'Content-Type': 'application/json',
//     //               'Authorization': 'Basic MWYzMmUwOGYtYTAzYS00MTEwLWE4MWYtMTRhZGQ2MjkxNGI4' // Rest API Key from OneSignal
//     //           }
//     //         });
      
//     // };
      
// });

// Moralis.Cloud.beforeSave("ProposalsVotingEnded", (request) => {
//     logger.info("Voting ended!"); 
// });

// Moralis.Cloud.beforeSave("User", async (request) => {

//     logger.info(request.object.get("mapImageLink"));

//     // const projectName = request.object.get("projectName");
//     // const mapImageLink = request.object.get("mapImageLink");
//     // const type = request.object.get("type");
//     // const ethAddress = request.object.get("ethAddress");
//     // const email = request.object.get("email");
//     // const ownerName = request.object.get("ownerName");

//     // const ActiveProposal = Moralis.Object.extend("ActiveProposal")

//     // const query = new Moralis.Query(ActiveProposal);

//     // query.equalTo("ethAddress", ethAddress);

//     // const activeProposal = await query.first();

//     // if (!activeProposal){
//     //     activeProposal = new ActiveProposal();
//     // }

//     // activeProposal.set("mapImageLink", mapImageLink);

//     // activeProposal.save()
//     //     .then( activeProposal => {
//     //         logger.info(activeProposal.get("ethAddress"));
//     //     }, error => {
//     //         logger.error("Failed to create new activeProposal: " + error)
//     //     });

// });