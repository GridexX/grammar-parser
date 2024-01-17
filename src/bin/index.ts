import { Command } from "commander";
import { checkRules } from "../lib/checkRules";
import {
  isLanguageCorrect,
  readInputFile,
  tokenize,
} from "../lib/isLanguageCorrect";

const program = new Command();

program
  .name("rules-checker")
  .description("Check if a input file is correct amoung a Grammar file")
  .version("1.0.0")
  .requiredOption("-i, --input <path>", "Path to the input file.")
  .requiredOption(
    "-r, --rules <path>",
    "Path to the rules file. Must be a JSON formated rules file, see the example directory"
  )
  .action((options) => {
    const { input, rules } = options;
    console.log(`${input}, ${rules}`);

    const { data: parsedRules } = checkRules(rules);
    const { data: inputString } = readInputFile(input);
    console.log(`rules: ${parsedRules}, input: ${inputString}`);
    if (typeof parsedRules !== "undefined" && inputString) {
      const startRule = "S";
      const tokens = tokenize(inputString);
      console.log("Tokens:", JSON.stringify(tokens));
      console.log("Rules:", JSON.stringify(parsedRules));

      try {
        const result = isLanguageCorrect(tokens, parsedRules, startRule);
        console.log("RESULT: ", result);
      } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
      }
    }
  })
  .parse();
