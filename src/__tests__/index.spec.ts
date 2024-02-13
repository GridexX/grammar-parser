import { RuleSchema, checkRules, ruleSchema } from "../lib/checkRules";
import { readInputFile } from "../lib/isLanguageCorrect2";

describe("Check the rules", () => {
  it("Correct rules should be parsed", () => {
    const { data } = readInputFile("src/__tests__/rules.json");
    const res = checkRules(data + "");
    expect(res.success).toBeTruthy();

    expect(res.data && typeof res.data === "object").toBe(true);
    expect(res.error).toBeFalsy();
  });

  it("Wrong rules should return an error", () => {
    const { data } = readInputFile("src/__tests__/wrong_rules.json");
    const res = checkRules(data + "");
    expect(res.error).toBeTruthy();
    expect(res.success).toBeFalsy();
    expect(res.data).toBeUndefined();
  });
});
