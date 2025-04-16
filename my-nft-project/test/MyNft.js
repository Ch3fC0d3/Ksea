const { expect } = require("chai");

describe("MyNFT", function () {
  let MyNFT, myNFT, owner, addr1;

  beforeEach(async function () {
    MyNFT = await ethers.getContractFactory("MyNFT");
    [owner, addr1] = await ethers.getSigners();
    myNFT = await MyNFT.deploy();
    await myNFT.deployed();
  });

  it("Should mint NFT to address", async function () {
    await myNFT.safeMint(addr1.address, "ipfs://QmExample");
    expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
  });

  it("Should only allow owner to mint", async function () {
    await expect(
      myNFT.connect(addr1).safeMint(addr1.address, "ipfs://QmExample")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});