'use server';
/**
 * @fileOverview A Genkit flow for generating personalized spending insights.
 *
 * - personalizedSpendingInsights - A function that generates a natural language summary of monthly spending,
 *   highlighting key categories, potential savings, and personalized financial insights.
 * - PersonalizedSpendingInsightsInput - The input type for the personalizedSpendingInsights function.
 * - PersonalizedSpendingInsightsOutput - The return type for the personalizedSpendingInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpendingCategorySchema = z.object({
  category: z.string().describe('The name of the spending category.'),
  amount: z.number().positive().describe('The total amount spent in this category.'),
  budgetedAmount: z.number().optional().describe('The optional budgeted amount for this category.'),
});

const PersonalizedSpendingInsightsInputSchema = z.object({
  month: z.string().describe('The month for which insights are being generated (e.g., "October 2023").'),
  totalSpending: z.number().positive().describe('The total spending for the month.'),
  totalBudget: z.number().optional().describe('The optional total budget for the month.'),
  categorySpending: z.array(SpendingCategorySchema).describe('An array of spending details per category for the month.'),
});
export type PersonalizedSpendingInsightsInput = z.infer<typeof PersonalizedSpendingInsightsInputSchema>;

const PersonalizedSpendingInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise, natural language summary of monthly spending.'),
  keySpendingCategories: z.array(z.string()).describe('An array of the top 2-3 spending categories.'),
  potentialSavingsAreas: z.array(z.string()).describe('An array of suggestions for potential areas to save money.'),
  personalizedInsights: z.array(z.string()).describe('An array of personalized financial insights and tips.'),
});
export type PersonalizedSpendingInsightsOutput = z.infer<typeof PersonalizedSpendingInsightsOutputSchema>;

export async function personalizedSpendingInsights(input: PersonalizedSpendingInsightsInput): Promise<PersonalizedSpendingInsightsOutput> {
  return personalizedSpendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSpendingInsightsPrompt',
  input: { schema: PersonalizedSpendingInsightsInputSchema },
  output: { schema: PersonalizedSpendingInsightsOutputSchema },
  prompt: `You are a financial advisor named SpendSense AI, specializing in helping users understand their spending and improve their financial health.

Analyze the following monthly spending data for {{month}} and provide a concise, natural language summary.

Spending Data:
Month: {{month}}
Total Spending: ${{totalSpending}}
{{#if totalBudget}}Total Budget: ${{totalBudget}}
{{/if}}

Spending by Category:
{{#each categorySpending}}
- {{category}}: ${{amount}}{{#if budgetedAmount}} (Budgeted: ${{budgetedAmount}}){{/if}}
{{/each}}

Based on this data, generate the following JSON output:
1.  **summary**: A concise, natural language summary of the user's spending for the month. Compare total spending to total budget if available. Highlight overall spending trends.
2.  **keySpendingCategories**: Identify the 2-3 highest spending categories.
3.  **potentialSavingsAreas**: Suggest specific categories or actions where the user could potentially save money, especially if over budget or spending significantly in non-essential areas. Provide actionable advice.
4.  **personalizedInsights**: Offer 1-2 personalized financial insights or tips based on the spending patterns. This could include budgeting advice, saving strategies, or observations about their financial behavior.

Ensure the language is encouraging and informative. Focus on actionable advice.

`,
});

const personalizedSpendingInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedSpendingInsightsFlow',
    inputSchema: PersonalizedSpendingInsightsInputSchema,
    outputSchema: PersonalizedSpendingInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
