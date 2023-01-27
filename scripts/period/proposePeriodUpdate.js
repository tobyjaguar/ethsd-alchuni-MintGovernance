const { ethers } = require("hardhat");

const govAddress = '0xA07fccb602C3826f27A4153CA8724F56d83A786B';
const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);

    console.log(`creating a new proposal on gov address: ${governor.address}`);
    let proposalHash = await governor.hashProposal(
        [token.address],
        [0],
        [governor.interface.encodeFunctionData("setVotingPeriod", [50400])],
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Update voting period to 1 week."))
    );
    console.log(`using proposal id of: ${proposalHash}`);

    const tx = await governor.propose(
        [token.address],
        [0],
        [governor.interface.encodeFunctionData("setVotingPeriod", [50400])],
        "Update voting period to 1 week."
    );
    console.log(`sent tx: ${JSON.stringify(tx, null, 2)}`);
    const receipt = await tx.wait();
    console.log(`received reciept: `);
    console.log(receipt);
    const event = receipt.events.find(x => x.event === 'ProposalCreated');
    const { proposalId } = event.args;

    
    console.log(`new proposal created with id: ${proposalId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
