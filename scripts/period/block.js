const { ethers } = require("hardhat");

const govAddress = '0xA07fccb602C3826f27A4153CA8724F56d83A786B';
const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function main() {
    const [owner] = await ethers.getSigners();
    const governor = await ethers.getContractAt("TobyGovernor", govAddress);
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);

    proposeBlkNum = await owner.provider.getBlockNumber();
    proposeBlkNum += 2;
    let currentBlkNum;
    console.log(`target block: ${proposeBlkNum}`);
    do {
        currentBlkNum = await owner.provider.getBlockNumber();
        console.log(`running loop with current: ${currentBlkNum}`);
    } while(currentBlkNum <= proposeBlkNum)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });