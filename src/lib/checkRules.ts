import { ZodError, z } from "zod";
import * as fs from "fs";

const RuleSchema = z.array(z.array(z.string()));

// This functions takes an rule file and check if it match the intended object
export const checkRules = (rulesFile: string) => {
  try {
    const rulesString = fs.readFileSync(rulesFile).toString();
    const rules = JSON.parse(rulesString);

    if (typeof rules !== "object") {
      console.error(`Rule must be of type object, ${typeof rules} received`);
    }

    // Dynamically generate Zod schema based on keys of the rules object
    const dynamicSchema = z.object(
      Object.fromEntries(
        Object.entries(rules).map(([key]) => [key, RuleSchema])
      )
    );

    // Validate the input against the dynamically generated schema
    const res = dynamicSchema.safeParse(rules);
    if (res.success) {
      return {
        success: true,
        data: res.data,
      };
    }
    console.error("Invalid rules:", res.error);
    return { error: res.error };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Invalid rules:", error.errors);
      return {
        success: false,
        error,
      };
    } else {
      console.error("Unexpected error:", error);
      return {
        success: false,
        error,
      };
    }
  }
};
