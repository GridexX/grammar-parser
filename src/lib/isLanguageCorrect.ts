import * as fs from "fs";

const TERMINAL = 0;
const NON_TERMINAL = 1;

// Keywords
const CONTACT: [number, string] = [TERMINAL, "contact"];
const RATE: [number, string] = [TERMINAL, "rate"];
const DELAY: [number, string] = [TERMINAL, "delay"];
const NEWLINE: [number, string] = [TERMINAL, "linebreak"];

// Literals
const NUMBER: [number, string] = [TERMINAL, "num"];
const IDENTIFIER: [number, string] = [TERMINAL, "id"];

type Token = [number, string];

export function tokenize(inputSequence: string): Token[] {
  const tokens: Token[] = [];

  const lines = inputSequence.split("\n");
  for (const line of lines) {
    const tokensByLine = line.split(" ");

    for (const token of tokensByLine) {
      // Keywords
      if (token === "contact") {
        tokens.push(CONTACT);
      } else if (token === "rate") {
        tokens.push(RATE);
      } else if (token === "delay") {
        tokens.push(DELAY);
      }

      // Number
      else if (!isNaN(Number(token))) {
        tokens.push(NUMBER);
      }

      // Identifier
      else {
        tokens.push(IDENTIFIER);
      }
    }

    // Add newline token separately if the line is not empty
    if (line.trim()) {
      tokens.push(NEWLINE);
    }
  }

  return tokens.slice(0, -1); // Remove the extra newline at the end
}

export function isLanguageCorrect(
  tokens: Token[],
  rules: {[x: string]: string[][]},
  currentRule: string
): boolean {
  console.log(`Tokens: ${JSON.stringify(tokens)}, length: ${tokens.length}`);
  console.log(`Current Rule: ${currentRule}`);

  if (tokens.length == 0) {
    return true;
  }

  if (!rules[currentRule]) {
    return false;
  }

  for (const alternative of rules[currentRule]) {
    const tokensCopy = [...tokens];

    for (const symbol of alternative) {
      if (tokensCopy.length > 0 && symbol === tokensCopy[0][1]) {
        tokensCopy.shift();
      } else if (symbol === "null") {
        continue;
      } else {
        if (!isLanguageCorrect(tokensCopy, rules, symbol)) {
          break;
        }
        return true;
      }
    }
  }

  return false;
}

export function readInputFile(inputPath: string) {
  try {
    const data = fs.readFileSync(inputPath, "utf-8").toString();
    return { success: true, data };
  } catch (error) {
    console.error(`Error reading language file: ${error}`);
    return { success: false, error };
  }
}

function main() {
  if (process.argv.length !== 4) {
    console.log(
      "Usage: ts-node undetermined-grammar-parser.ts rules_file_path language_file_path"
    );
    process.exit(1);
  }

  let rules = "";
  const rulesFilePath = process.argv[2];
  try {
    rules = fs.readFileSync(rulesFilePath, "utf-8");
  } catch (error) {
    console.error(`Error reading rules file: ${error}`);
    process.exit(1);
  }

  let inputSequence = "";
  const languageFilePath = process.argv[3];
  try {
    inputSequence = fs.readFileSync(languageFilePath, "utf-8");
  } catch (error) {
    console.error(`Error reading language file: ${error}`);
    process.exit(1);
  }

  const parsedRules = JSON.parse(rules);

  const tokens = tokenize(inputSequence);
  console.log("Tokens: ", tokens, "\n\n");

  try {
    const startRule = "S";
    const result = isLanguageCorrect(tokens, parsedRules, startRule);
    console.log("RESULT: ", result);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}
