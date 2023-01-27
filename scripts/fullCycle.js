const { ethers } = require("hardhat");

const govAddress = '0xA07fccb602C3826f27A4153CA8724F56d83A786B';
const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);

    /** PROPOSE VOTING PERIOD UPDATE **/
    console.log(`creating a new proposal on gov address: ${governor.address}`);
    let callData = token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")]);
    let descriptionHash = 
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Give the me moar tokens!"));

    let proposalHash = await governor.hashProposal(
        [token.address],
        [0],
        [callData],
        descriptionHash
    );
    console.log(`using proposal id of: ${proposalHash}`);

    let tx = await governor.propose(
        [token.address],
        [0],
        [callData],
        "Give the me moar tokens!"
    );
    console.log(`sent tx: ${tx.hash}`);

    let receipt = await tx.wait();
    console.log(`received reciept: `);
    console.log(receipt.transactionHash);
    let proposeBlkNum = receipt.blockNumber;
    const event = receipt.events.find(x => x.event === 'ProposalCreated');
    const { proposalId } = event.args;
    console.log(`new proposal created with id: ${proposalId}`);

    console.log(`holding until we are one past block: ${proposeBlkNum}`);
    let currentBlkNum;
    do {
        currentBlkNum = await owner.provider.getBlockNumber();
        sleep(1000);
    } while(currentBlkNum <= (proposeBlkNum + 1))

    /** VOTE ON PROPOSAL **/
    const VoteType = {
        Against: 0,
        For: 1,
        Abstain: 2
    }
    // enum VoteType {
    //     Against,
    //     For,
    //     Abstain
    // }
    console.log(`voting on proposal: ${proposalId} with a vote of: ${VoteType.For}`);
    // console.log(`voting on proposal: ${proposalHash} with a vote of: ${VoteType.For}`);
    tx = await governor.castVote(proposalHash, VoteType.For); 
    
    console.log(`sent tx: ${tx.hash}`);
    receipt = await tx.wait();
    console.log(`received reciept: `);
    console.log(receipt.transactionHash);
    proposeBlkNum = receipt.blockNumber;

    console.log(`holding until we are one past block: ${proposeBlkNum}`);
    do {
        currentBlkNum = await owner.provider.getBlockNumber();
        sleep(1000);
    } while(currentBlkNum <= (proposeBlkNum + 1))

    /** EXECUTE PROPOSAL **/
    console.log(`attempting to execute the proposal id: ${proposalId}`);
    tx = await governor.execute(
        [token.address],
        [0],
        [callData],
        descriptionHash
    );

    console.log(`sent tx: ${JSON.stringify(tx, null, 2)}`);
    receipt = await tx.wait();
    console.log(`received reciept: `);
    console.log(receipt.transactionHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
