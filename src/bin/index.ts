import { Command } from "commander";
import { checkRules } from "../lib/checkRules";
import {
  isLanguageCorrect,
  isLanguageCorrect2,
  readInputFile,
  tokenize,
  tokenize2,
} from "../lib/isLanguageCorrect";

const program = new Command();

program
  .name("rules-checker")
  .description("Check if a input file is correct amoung a rule file")
  .version("1.0.0")
  .requiredOption("-i, --input <path>", "Path to the input file.")
  .requiredOption(
    "-r, --rules <path>",
    "Path to the rules file. Must be a JSON formated rules file, see the example directory"
  )
  .action((options) => {
    const { input, rules } = options;

    const res = readInputFile(rules);

    const data = res.data;

    const { data: inputString, error } = readInputFile(input);

    if (res.error || error) {
      process.exit(1);
    }

    const { data: parsedRules } = checkRules(data + "");

    if (parsedRules && inputString) {
      const startRule = "S";
      const tokens = tokenize2(inputString);
      console.log("Tokens:", JSON.stringify(tokens));
      console.log("Rules:", JSON.stringify(parsedRules));

      try {
        const result = isLanguageCorrect2(tokens, parsedRules, startRule);
        console.log("RESULT: ", result);
      } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
      }
    }
  })
  .parse();
