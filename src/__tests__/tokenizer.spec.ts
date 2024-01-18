import { checkRules } from "../lib/checkRules";
import {
  isLanguageCorrect2,
  readInputFile,
  tokenize2,
} from "../lib/isLanguageCorrect";

describe("The tokens and the rules", () => {
  it("Regular grammar with correct language", () => {
    const { data } = readInputFile("src/__tests__/input.txt");
    const { data: dataRules } = readInputFile("src/__tests__/rules.json");
    const res = checkRules(dataRules + "");
    if (res.data) {
      const tokens = tokenize2(data + "");
      const result = isLanguageCorrect2(tokens, res.data, "S");
      expect(result).toBeTruthy();
    }
  });

  it("Regular grammar with wrong language", () => {
    const { data } = readInputFile("src/__tests__/wrong_input.txt");
    const { data: dataRules } = readInputFile("src/__tests__/_rules.json");
    const res = checkRules(dataRules + "");
    if (res.data) {
      const tokens = tokenize2(data + "");
      const result = isLanguageCorrect2(tokens, res.data, "S");
      expect(result).toBeFalsy();
    }
  });
});
