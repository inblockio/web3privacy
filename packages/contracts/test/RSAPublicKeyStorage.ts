import { expect } from "chai";
import hre from "hardhat";

describe("RSAPublicKeyStorage", function () {
  let rsaContract: any;
  let owner: any;
  let otherUser: any;

  beforeEach(async () => {
    [owner, otherUser] = await hre.ethers.getSigners();
  
    const RSAPublicKeyStorage = await hre.ethers.getContractFactory("RSAPublicKeyStorage");
    rsaContract = await RSAPublicKeyStorage.deploy(); // Already deployed
  });

  it("should store and retrieve RSA public key for the sender", async () => {
    const testKey = "-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkq...\\n-----END PUBLIC KEY-----";

    const tx = await rsaContract.connect(owner).storeRSAPublicKey(testKey);
    await expect(tx)
      .to.emit(rsaContract, "RSAPublicKeyStored")
      .withArgs(owner.address, testKey);

    const storedKey = await rsaContract.getRSAPublicKey(owner.address);
    expect(storedKey).to.equal(testKey);
  });

  it("should return an empty string if no key is set", async () => {
    const key = await rsaContract.getRSAPublicKey(otherUser.address);
    expect(key).to.equal("");
  });

  it("should allow different users to store their own RSA public keys", async () => {
    const key1 = "user1-key";
    const key2 = "user2-key";

    await rsaContract.connect(owner).storeRSAPublicKey(key1);
    await rsaContract.connect(otherUser).storeRSAPublicKey(key2);

    expect(await rsaContract.getRSAPublicKey(owner.address)).to.equal(key1);
    expect(await rsaContract.getRSAPublicKey(otherUser.address)).to.equal(key2);
  });
});
