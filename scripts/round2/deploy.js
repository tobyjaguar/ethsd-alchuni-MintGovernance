const { ethers } = require("hardhat");

// Gov: 0xA77B27E281C0309D8CDC701A243509598Ec2e28C
// Tob: 0x01591f45209C8a2e091337dE8bB09b8E4e90D375

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
