const { ethers } = require("hardhat");

const tokenAddress = '0xfCAb6c4B96de9c76C7a11725BA081292677a28b4';

async function main() {
    const [owner] = await ethers.getSigners();
    const token = await ethers.getContractAt("TobyGovy", tokenAddress);

    console.log(`connecting to token address: ${token.address}`);
    console.log(`delegating tokens to owner...`);
    let tx = await token.delegate(owner.address);
    console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
