import * as fs from "fs";

const TERMINAL = 0;
const NON_TERMINAL = 1;

// Keywords
const CONTACT: [number, string] = [TERMINAL, "contact"];
const RATE: [number, string] = [TERMINAL, "rate"];
const DELAY: [number, string] = [TERMINAL, "delay"];
const NEWLINE: [number, string] = [TERMINAL, "\n"];

// Literals
const NUMBER: [number, string] = [TERMINAL, "num"];
const IDENTIFIER: [number, string] = [TERMINAL, "id"];

type Token = [number, string];

type TokenType = "id" | "num" | "linebreak";

type Token2 = {
  type: TokenType;
  data: string;
};

export function tokenize2(inputSequence: string): Token2[] {
  const tokens: Token2[] = [];
  const lines = inputSequence.split("\n");
  for (const line of lines) {
    const tokensByLine = line.split(" ");

    for (const data of tokensByLine) {
      // Number
      if (!isNaN(Number(data))) {
        tokens.push({ type: "num", data });
      }

      // Keywords
      else if (typeof data === "string") {
        tokens.push({ type: "id", data });
      }
    }
    // Add newline token separately if the line is not empty
    if (line.trim()) {
      tokens.push({ type: "linebreak", data: "\n" });
    }
  }

  return tokens.slice(0, -1); // Remove the extra newline at the end
}

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

export function isLanguageCorrect2(
  tokens: Token2[],
  rules: { [x: string]: string[][] },
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
      // ShouldShift indicates if there was a match
      let shouldShift = false;
      if (tokensCopy.length > 0) {
        // This function check whenever the token correspond to the rule
        // Check the correct types
        const { type, data } = tokensCopy[0];
        // Rules with < > should match a terminal type
        if (type === symbol.match(/<(\w+)>/)?.[1] ?? null) {
          // We match linebreak
          if (type === "linebreak") {
            shouldShift = true;
          }
          // We ensure the good type for id or num
          else if (
            (type === "id" && isNaN(Number(data))) ||
            (type === "num" && !isNaN(Number(data)))
          ) {
            shouldShift = true;
          }
        }
        // Then we match keyword
        // Fist check if the rules is a string and the data match
        // Will match the exact word
        else if (type === "id" && symbol === data) {
          shouldShift = true;
        }
      }

      if (tokensCopy.length > 0 && shouldShift) {
        console.log(
          `The rule ${symbol} matched the data ${tokensCopy[0].data}`
        );
        tokensCopy.shift();
      } else if (symbol === "null") {
        continue;
      } else {
        // Otherwise check the rules with the name
        if (!isLanguageCorrect2(tokensCopy, rules, symbol)) {
          break;
        }
        return true;
      }
    }
  }

  return false;
}

export function isLanguageCorrect(
  tokens: Token[],
  rules: { [x: string]: string[][] },
  currentRule: string
): boolean {
  console.log(`Tokens: ${JSON.stringify(tokens)}, length: ${tokens.length}`);
  console.log(`Current Rule: ${currentRule}`);

  // If there are no more tokens, the language is correct.
  if (tokens.length == 0) {
    return true;
  }

  // If the current rule is not defined, the language is incorrect
  if (!rules[currentRule]) {
    return false;
  }

  for (const alternative of rules[currentRule]) {
    const tokensCopy = [...tokens];

    for (const symbol of alternative) {
      // If the symbol matches the current token, consume the token
      if (tokensCopy.length > 0 && symbol === tokensCopy[0][1]) {
        tokensCopy.shift();
        // If the symbol is "null," skip it without consuming any token.
      } else if (symbol === "null") {
        continue;
      } else {
        // Recursive case: Call isLanguageCorrect for non-terminal symbols.
        // If the recursive call succeeds, return true; otherwise, break the loop.
        if (!isLanguageCorrect(tokensCopy, rules, symbol)) {
          break;
        }
        return true;
      }
    }
  }
  // None of the alternatives matched, return false.
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
