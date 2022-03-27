const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function tokensToWei(number, from) {
    return web3.utils.toWei(number, from);
  }

  before(async () => {
    // load contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // check if we transfered the tokens
    await rwd.transfer(decentralBank.address, tokensToWei("1000000", "Ether"));

    // check 100tether transfer
    await tether.transfer(customer, tokensToWei("100", "Ether"), {
      from: owner,
    });
  });

  describe("Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
  });

  describe("RWD Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      const balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokensToWei("1000000", "Ether"));
    });
  });

  describe("Yield Farming", async () => {
    it("rewards tokens for staking", async () => {
      let result;

      // Check Investor Balance
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokensToWei("100", "Ether"),
        "customer mock tether wallet balance"
      );

      // Check staking for customer
      await tether.approve(decentralBank.address, tokensToWei("100", "Ether"), {
        from: customer,
      });
      await decentralBank.depositTokens(tokensToWei("100", "Ether"), {
        from: customer,
      });

      // check updated balance of customer
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokensToWei("0", "Ether"),
        "customer mock tether wallet balance after staking"
      );

      // check updated balance of decentral bank
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokensToWei("100", "Ether"),
        "decentraBank mock tether wallet balance after staking from customer"
      );

      // is staking balance
      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        "true",
        "customer staking status after staking"
      );

      // issue tokens
      await decentralBank.issueTokens({ from: owner });

      // ensure only the owner can issue tokens
      await decentralBank.issueTokens({ from: customer }).should.be.rejected;

      // unstaking tokens
      await decentralBank.unstakeTokens({ from: customer });

      // check balance after unstake
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokensToWei("100", "Ether"),
        "customer mock tether wallet balance after unstaking"
      );

      // check updated balance of decentral bank after unstake
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokensToWei("0", "Ether"),
        "decentraBank mock tether wallet balance after unstaking from customer"
      );

      // is staking balance after unstake
      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        "false",
        "customer staking status after unstaking"
      );
    });
  });
});
