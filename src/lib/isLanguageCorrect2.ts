import * as fs from "fs";

// The type of the token
// id is a string
// num is a number
// linebreak is a newline
type TokenType = "id" | "num" | "linebreak";

// Store the token type and the data
type Token2 = {
  type: TokenType;
  data: string;
};

/**
 * Tokenize the input sequence
 * This function use the type Token2 with a type and a data
 * @param inputSequence - The input sequence to tokenize
 * @returns An array of tokens
 */
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

/**
 * Check if the language is correct
 * This function use the type Token2 with a type and a data
 * @param tokens The array of tokens
 * @param rules the rules to check
 * @param currentRule the current rule to check
 * @returns A boolean indicating if the language is correct
 */
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

type Sucess = { success: boolean; error?: unknown; data?: string };
type ReturnInputFile =
  | (Sucess & {
      success: true;
      data: string;
    })
  | (Sucess & {
      success: false;
    });

export function readInputFile(inputPath: string): ReturnInputFile {
  try {
    const data = fs.readFileSync(inputPath, "utf-8").toString();
    return { success: true, data };
  } catch (error) {
    console.error(`Error reading language file: ${error}`);
    return { success: false, error };
  }
}
