import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";

describe("Token", function () {
  let accounts: Signer[];

  beforeEach(async function () {

  });

  it("Should have no grants after deployment", async function () {
    accounts = await ethers.getSigners();
    const Greeter = await ethers.getContractFactory("ElectronicHealthLink");
    const greeter = await Greeter.deploy();
    await greeter.deployed();
    expect(await greeter.checkAccess(accounts[0].getAddress(),1)).to.equal(false);
  });
});
