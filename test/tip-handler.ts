import {
  Client,
  Provider,
  ProviderRegistry,
  Result,
} from "@blockstack/clarity";
import { assert } from "chai";
describe("Tip calculator contract test suite", () => {
  let tipCalculatorClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    tipCalculatorClient = new Client(
      "SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.tip-calculator",
      "tip-calculator",
      provider
    );
  });
  it("should have a valid syntax", async () => {
    await tipCalculatorClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const queryIntMethod = async (methodName: string) => {
      const query = tipCalculatorClient.createQuery({
        method: { name: methodName, args: [] },
      });
      const receipt = await tipCalculatorClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    };
    const getMealCost = () => {
      return queryIntMethod("get-meal-cost");
    };
    const getRating = () => {
      return queryIntMethod("get-rating");
    };
    const execMethod = async (method: string, args = []) => {
      const tx = tipCalculatorClient.createTransaction({
        method: {
          name: method,
          args,
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await tipCalculatorClient.submitTransaction(tx);
      return receipt;
    };

    const getTipValue = async () => {
      const query = tipCalculatorClient.createQuery({
        method: {
          name: "get-tip-value",
          args: [],
        },
      });
      const receipt = await tipCalculatorClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    };

    const calculateTip = async () => {
      const rating = await getRating();
      const cost = await getMealCost();
      if (rating > 3) {
        return Math.floor(cost * 0.2);
      } else {
        return Math.floor(cost * 0.15);
      }
    };
    before(async () => {
      await tipCalculatorClient.deployContract();
    });
    it("should start at zero", async () => {
      const mealCost = await getMealCost();
      assert.equal(mealCost, 0);
    });
    it("should store the meal cost", async () => {
      await execMethod("reserve-meal-cost", ["100"]);
      const currentCost = await getMealCost();
      assert.equal(currentCost, 100);
    });

    it("should calculate tip amount based on meal cost and rating", async () => {
      const tip = await getTipValue();
      const expectedTip = await calculateTip();
      assert.equal(tip, expectedTip);
    });

    it("should give 20% of the meal value as a tip if the meal was great (4 or 5 rating)", async () => {
      await execMethod("reserve-meal-cost", ["100"]);
      await execMethod("finish-meal", ["5"]);
      const tip = await getTipValue();
      assert.equal(tip, 20);
    });
    it("should give 15% of the meal value as a tip if the meal was not satisfying (3 or less rating)", async () => {
      await execMethod("reserve-meal-cost", ["100"]);
      await execMethod("finish-meal", ["2"]);
      const tip = await getTipValue();
      assert.equal(tip, 15);
    });
  });
  after(async () => {
    await provider.close();
  });
});
