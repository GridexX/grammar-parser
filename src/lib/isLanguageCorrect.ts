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

/**
 * Tokenize the input sequence
 *
 * @param inputSequence - The input sequence to tokenize
 * @returns An array of tokens
 */
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

/**
 * @param tokens The array of tokens
 * @param rules the rules to check
 * @param currentRule the current rule to check
 * @returns A boolean indicating if the language is correct
 */
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
