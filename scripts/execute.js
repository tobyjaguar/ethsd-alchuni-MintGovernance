const { ethers } = require("hardhat");

const govAddress = '0xA07fccb602C3826f27A4153CA8724F56d83A786B';
const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);

    console.log(`executing proposal on gov address: ${governor.address}`);
    let callData = token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")]);
    let descriptionHash = 
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Give the me moar tokens!"));
    const tx = await governor.execute(
        [token.address],
        [0],
        [callData],
        descriptionHash
    );

    console.log(`sent tx: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`received reciept: ${receipt.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
