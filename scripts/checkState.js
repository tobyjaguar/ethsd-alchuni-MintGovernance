const { ethers } = require("hardhat");

const govAddress = '0xA07fccb602C3826f27A4153CA8724F56d83A786B';
const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);
    // proposal calculated from proposal hash parameters
    // let callData = token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")]);
    // let descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Give the owner more tokens!"));
    // let callData = governor.interface.encodeFunctionData("setVotingPeriod", [50404]);
    // let descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Update voting period to 1 week."));
    let callData = token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")]);
    let descriptionHash = 
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Give the me moar tokens!"));
    let proposalHash = await governor.hashProposal(
        [token.address],
        ["0"],
        [callData],
        descriptionHash
    );
    console.log(`proposal id hash: ${proposalHash}`);
    const propState = await governor.state(proposalHash); 
    
    console.log(propState);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
