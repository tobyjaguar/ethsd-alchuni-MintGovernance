const { ethers } = require("hardhat");

const govAddress = '0xA07fccb602C3826f27A4153CA8724F56d83A786B';
const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);

    const votingPeriod = 50404
    let proposalHash = await governor.hashProposal(
        [token.address],
        [0],
        [governor.interface.encodeFunctionData("setVotingPeriod", [votingPeriod])],
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Update voting period to 1 week."))
    );
    console.log(`executing proposal using id hash: ${proposalHash}`);
    
    const tx = await governor.execute(
        [token.address],
        [0],
        [governor.interface.encodeFunctionData("setVotingPeriod", [votingPeriod])],
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Update voting period to 1 week."))
    );

    console.log(`sent tx: ${JSON.stringify(tx, null, 2)}`);
    const receipt = await tx.wait();
    console.log(`received reciept: `);
    console.log(receipt);
    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
