import fs from "fs";
import { S, SSchema } from "./model";
import { ZodError } from "zod";

// const keywords =

// This part code the grammar

// This function takes a grammar file as argument and return a list of word
const tokenizer = (text: string): string[] => {
  const lazyTokens: string[] = [];

  let lines = text.split("\n");

  for (let l of lines) {
    if (l.length < 1) {
      continue;
    }

    let lineWords = l.trim().split(" ");
    lazyTokens.push(...lineWords);
    lazyTokens.push("\n");
  }

  for (let idx = 0; idx < lazyTokens.length; idx++) {
    let word = lazyTokens[idx];
    if (word === "\n") {
      word = "\\n";
    }
    console.log(`(${idx}, ${word})`);
  }

  return lazyTokens;
};

const validateTokens = (tokens: string[]): S[] => {
  const parsedTokens: S[] = [];

  // Assuming each token is a JSON string representing a grammar rule
  for (const token of tokens) {
    try {
      const parsedToken = SSchema.parse(JSON.parse(token));
      parsedTokens.push(parsedToken);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(error.errors);
      } else {
        console.error("Unexpected error during parsing:", error);
      }
    }
  }

  return parsedTokens;
};

const fileContent = "contact abc def 123 456\nrate 1 2 3\n";
const tokens = tokenizer(fileContent);
const parsedTokens = validateTokens(tokens);
console.log(parsedTokens);

// const readGrammarFile = (path: string): string => {
//   const file = fs.readFileSync(__dirname + "/" + path);
//   return file.toString();
// };

// const grammar = readGrammarFile("grammar.txt");
// const words = tokenizer(grammar);

// console.log(grammar);
