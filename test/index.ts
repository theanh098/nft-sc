import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Tho } from "../typechain-types";

describe("Tho", async () => {
  let owner: SignerWithAddress,
    _addr1: SignerWithAddress,
    _addr2: SignerWithAddress,
    tho: Tho;

  beforeEach(async () => {
    [owner, _addr1, _addr2] = await ethers.getSigners();
    const sc = await ethers.getContractFactory("Tho");
    tho = await sc.connect(owner).deploy();

    await tho
      .connect(owner)
      .safeMint(
        _addr1.address,
        `/${tho.address}/${Number(await tho.tokenIdCounter())}`
      );

    await tho
      .connect(owner)
      .safeMint(
        _addr1.address,
        `/${tho.address}/${Number(await tho.tokenIdCounter())}`
      );
  });

  it("should be correct uri", async () => {
    expect(await tho.balanceOf(_addr1.address)).to.equal(2);
    expect(await tho.tokenURI(0)).to.equal(
      `http://localhost:8080/${tho.address}/0`
    );
  });

  it("_addr1 transfer nft with id 1 to _addr2", async () => {
    await tho.connect(_addr1).transferFrom(_addr1.address, _addr2.address, 1);
    expect(await tho.balanceOf(_addr2.address)).to.equal(1);
  });
});
