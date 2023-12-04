import { z } from "zod";

// interface S {
//   productionType: "C";
//   C: C;
// }

// interface C {
//   productionType: "contact";
//   id1: string;
//   id2: string;
//   num1: number;
//   num2: number;
//   next: "D" | "R" | "None";
//   D?: D;
//   R?: R;
// }

// interface R {
//   productionType: "rate";
//   num1: number;
//   num2: number;
//   num3: number;
//   next: "R" | "D" | "C";
//   R?: R;
//   D?: D;
//   C?: C;
// }
// interface D {
//   productionType: "delay";
//   num1: number;
//   num2: number;
//   num3: number;
//   next: "R" | "D" | "C";
//   R?: R;
//   D?: D;
//   C?: C;
// }

const baseCSchema = z.object({
  productionType: z.literal("contact"),
  id1: z.string(),
  id2: z.string(),
  num1: z.number(),
  num2: z.number(),
  next: z.enum(["D", "R", "None"]),
});

const baseDSchema = z.object({
  productionType: z.literal("delay"),
  num1: z.number(),
  num2: z.number(),
  num3: z.number(),
  next: z.enum(["R", "D", "C"]),
});

const baseRSchema = z.object({
  productionType: z.literal("rate"),
  num1: z.number(),
  num2: z.number(),
  num3: z.number(),
  next: z.enum(["R", "D", "C"]),
});

type C = z.infer<typeof baseCSchema> & {
  D: D;
  R: R;
};

type D = z.infer<typeof baseDSchema> & {
  R: R;
  D: D;
  C: C;
};

type R = z.infer<typeof baseRSchema> & {
  R: R;
  D: D;
  C: C;
};

const CSchema: z.ZodType<C> = baseCSchema.extend({
  R: z.lazy(() => RSchema),
  D: z.lazy(() => DSchema),
});

const RSchema: z.ZodType<R> = baseRSchema.extend({
  R: z.lazy(() => RSchema),
  D: z.lazy(() => DSchema),
  C: z.lazy(() => CSchema),
});

const DSchema: z.ZodType<D> = baseDSchema.extend({
  R: z.lazy(() => RSchema),
  D: z.lazy(() => DSchema),
  C: z.lazy(() => CSchema),
});

const baseCategorySchema = z.object({
  name: z.string(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

// const CSchema = z.lazy(() =>
//   z.object({
//     productionType: z.literal("contact"),
//     id1: z.string(),
//     id2: z.string(),
//     num1: z.number(),
//     num2: z.number(),
//     next: z.enum(["D", "R", "None"]),
//     D: DSchema,
//     R: RSchema,
//   })
// );

export const SSchema = z.object({
  productionType: z.literal("C"),
  C: CSchema,
});

export type S = z.infer<typeof SSchema>;

export type TypeWord = "int" | "string" | "keyword";
