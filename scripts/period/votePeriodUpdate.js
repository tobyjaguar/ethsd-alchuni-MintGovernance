const { ethers } = require("hardhat");

const govAddress = '0xA07fccb602C3826f27A4153CA8724F56d83A786B';
const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);
    // proposal calculated from proposal hash parameters
    let proposalHash = await governor.hashProposal(
        [token.address],
        [0],
        [governor.interface.encodeFunctionData("setVotingPeriod", [50400])],
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Update voting period to 1 week."))
    );
    console.log(`executing proposal using id hash: ${proposalHash}`);
    proposalId = proposalHash;

    const VoteType = {
        Against: 0,
        For: 1,
        Abstain: 3
    }
    // enum VoteType {
    //     Against,
    //     For,
    //     Abstain
    // }
    console.log(`voting on proposal: ${proposalId} with a vote of: ${VoteType.For}`);
    const tx = await governor.castVote(proposalId, VoteType.For); 
    
    console.log(`sent tx: ${JSON.stringify(tx, null, 2)}`);
    const receipt = await tx.wait();
    console.log(`received reciept: `);
    console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
