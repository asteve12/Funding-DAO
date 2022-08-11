import { ethers } from "hardhat";

async function main() {
 

  const FundingDAO = await ethers.getContractFactory("FundingDAO");
  const fundingDAO = await FundingDAO.deploy();

  await fundingDAO.deployed();

  console.log("funding contract deployed to:", fundingDAO.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
