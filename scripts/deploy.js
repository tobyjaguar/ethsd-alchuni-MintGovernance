const { ethers } = require("hardhat");

// Gov: 0xA07fccb602C3826f27A4153CA8724F56d83A786B
// Tob: 0xfCAb6c4B96de9c76C7a11725BA081292677a28b4

async function main() {
  const [owner] = await ethers.getSigners();
  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  });

  const TobyGovernor = await ethers.getContractFactory("TobyGovernor");
  const governor = await TobyGovernor.deploy(futureAddress);

  const TobyGovy = await ethers.getContractFactory("TobyGovy");
  const token = await TobyGovy.deploy(governor.address);

  console.log(`TobyGovernor deployed to ${governor.address}`);
  console.log(`TobyGovy Token deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
