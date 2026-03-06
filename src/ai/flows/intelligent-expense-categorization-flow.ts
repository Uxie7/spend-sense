'use server';
/**
 * @fileOverview An AI agent that intelligently suggests a spending category for an expense.
 *
 * - intelligentExpenseCategorization - A function that handles the expense categorization process.
 * - IntelligentExpenseCategorizationInput - The input type for the intelligentExpenseCategorization function.
 * - IntelligentExpenseCategorizationOutput - The return type for the intelligentExpenseCategorization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentExpenseCategorizationInputSchema = z.object({
  description: z
    .string()
    .describe(
      'The description of the expense, e.g., "Coffee at Starbucks", "Groceries at Whole Foods", "Monthly Spotify subscription".'
    ),
});
export type IntelligentExpenseCategorizationInput = z.infer<
  typeof IntelligentExpenseCategorizationInputSchema
>;

const IntelligentExpenseCategorizationOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe(
      'The most relevant spending category for the expense, e.g., "Food & Dining", "Groceries", "Entertainment", "Utilities", "Transportation".'
    ),
});
export type IntelligentExpenseCategorizationOutput = z.infer<
  typeof IntelligentExpenseCategorizationOutputSchema
>;

export async function intelligentExpenseCategorization(
  input: IntelligentExpenseCategorizationInput
): Promise<IntelligentExpenseCategorizationOutput> {
  return intelligentExpenseCategorizationFlow(input);
}

const intelligentCategorizationPrompt = ai.definePrompt({
  name: 'intelligentCategorizationPrompt',
  input: {schema: IntelligentExpenseCategorizationInputSchema},
  output: {schema: IntelligentExpenseCategorizationOutputSchema},
  prompt: `You are an intelligent expense categorization assistant.
Given the following expense description, identify the most relevant spending category.
The category should be common, concise, and fit typical personal finance budgeting.

Expense Description: "{{{description}}}"`,
});

const intelligentExpenseCategorizationFlow = ai.defineFlow(
  {
    name: 'intelligentExpenseCategorizationFlow',
    inputSchema: IntelligentExpenseCategorizationInputSchema,
    outputSchema: IntelligentExpenseCategorizationOutputSchema,
  },
  async input => {
    const {output} = await intelligentCategorizationPrompt(input);
    return output!;
  }
);
