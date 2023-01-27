const { ethers } = require("hardhat");

const govAddress = '0xA77B27E281C0309D8CDC701A243509598Ec2e28C';
const tokenAddress = '0x01591f45209C8a2e091337dE8bB09b8E4e90D375';

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);
    // proposal calculated from proposal hash parameters
    let callData = token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")]);
    let descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Give the owner more tokens!"));
    let proposalHash = await governor.hashProposal(
        [token.address],
        [0],
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
