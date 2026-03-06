'use server';
/**
 * @fileOverview An AI agent that analyzes spending patterns to identify unusual expenditures or potential overspending trends and suggests budget adjustments.
 *
 * - budgetAnomalyDetection - A function that handles the budget anomaly detection process.
 * - BudgetAnomalyDetectionInput - The input type for the budgetAnomalyDetection function.
 * - BudgetAnomalyDetectionOutput - The return type for the budgetAnomalyDetection function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpendingDataItemSchema = z.object({
  id: z.string().describe('Unique identifier for the expense.'),
  date: z.string().datetime().describe('The date of the expense in ISO 8601 format.'),
  category: z.string().describe('The spending category of the expense (e.g., "Groceries", "Entertainment").'),
  amount: z.number().positive().describe('The amount of the expense.'),
  description: z.string().optional().describe('A brief description of the expense.'),
});

const BudgetGoalItemSchema = z.object({
  category: z.string().describe('The category for which the budget is set (e.g., "Groceries", "Overall").'),
  limit: z.number().positive().describe('The budget limit for the category or overall.'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).describe('The period for which the budget limit applies.'),
});

const BudgetAnomalyDetectionInputSchema = z.object({
  spendingData: z.array(SpendingDataItemSchema).describe('An array of recent spending transactions.'),
  budgetGoals: z.array(BudgetGoalItemSchema).describe('An array of defined budget goals by category or overall.'),
  currency: z.string().optional().default('USD').describe('The currency used for spending and budget goals (e.g., "USD", "EUR").'),
});
export type BudgetAnomalyDetectionInput = z.infer<typeof BudgetAnomalyDetectionInputSchema>;

const AnomalyOutputSchema = z.object({
  type: z.enum(['overspending', 'unusual_expense', 'unbudgeted_spending']).describe('The type of anomaly detected.'),
  category: z.string().optional().describe('The spending category related to the anomaly, if applicable.'),
  amount: z.number().optional().describe('The amount associated with the anomaly.'),
  description: z.string().describe('A detailed explanation of the anomaly.'),
  suggestedAction: z.string().optional().describe('A specific action or consideration for this anomaly.'),
});

const SuggestionOutputSchema = z.object({
  category: z.string().describe('The spending category for which the suggestion is made.'),
  suggestedLimit: z.number().describe('The suggested new budget limit for the category.'),
  reason: z.string().describe('The reason for the suggested budget adjustment.'),
});

const BudgetAnomalyDetectionOutputSchema = z.object({
  summary: z.string().describe('A concise overall summary of the financial analysis and key findings.'),
  anomalies: z.array(AnomalyOutputSchema).describe('A list of detected spending anomalies.'),
  suggestions: z.array(SuggestionOutputSchema).describe('A list of suggested budget adjustments.'),
});
export type BudgetAnomalyDetectionOutput = z.infer<typeof BudgetAnomalyDetectionOutputSchema>;

export async function budgetAnomalyDetection(input: BudgetAnomalyDetectionInput): Promise<BudgetAnomalyDetectionOutput> {
  return budgetAnomalyDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetAnomalyDetectionPrompt',
  input: { schema: BudgetAnomalyDetectionInputSchema },
  output: { schema: BudgetAnomalyDetectionOutputSchema },
  prompt: `You are an expert financial analyst specializing in personal budgeting. Your task is to analyze a user's spending patterns, identify any anomalies or overspending trends, and provide actionable suggestions for budget adjustments.

The currency for all amounts is {{{currency}}}.

Here is the user's recent spending data:
{{#if spendingData}}
  {{#each spendingData}}
    - Date: {{{date}}}, Category: {{{category}}}, Amount: {{{amount}}}, Description: {{{description}}}
  {{/each}}
{{else}}
  No spending data provided.
{{/if}}

Here are the user's current budget goals:
{{#if budgetGoals}}
  {{#each budgetGoals}}
    - Category: {{{category}}}, Limit: {{{limit}}}, Period: {{{period}}}
  {{/each}}
{{else}}
  No budget goals provided.
{{/if}}

Please perform the following analysis and provide the output in the specified JSON format:

1.  **Summary**: Provide a concise overall summary of the user's financial situation based on the provided data. Highlight overall trends (positive or negative).
2.  **Anomalies**:
    *   Identify any categories where current spending significantly exceeds or is on track to exceed the budget goal (type: "overspending").
    *   Identify any individual expenses that appear unusually high compared to typical spending in that category or overall (type: "unusual_expense").
    *   Identify any significant spending in categories that do not have a defined budget goal (type: "unbudgeted_spending").
    *   For each anomaly, provide its 'type', 'category' (if applicable), 'amount' (if relevant), a 'description' explaining why it's an anomaly, and a 'suggestedAction' if appropriate.
3.  **Suggestions**:
    *   Based on the identified anomalies and overall spending, provide concrete, actionable budget adjustments.
    *   For each suggestion, specify the 'category' it applies to, a 'suggestedLimit' (a numeric value for the new budget), and a 'reason' explaining why this adjustment is recommended.
    *   Suggestions should aim to help the user manage their finances better and avoid future overspending.

Ensure your output strictly adheres to the JSON schema provided, including the exact field names and types. If no anomalies or suggestions are found, return empty arrays for those fields.`,
});

const budgetAnomalyDetectionFlow = ai.defineFlow(
  {
    name: 'budgetAnomalyDetectionFlow',
    inputSchema: BudgetAnomalyDetectionInputSchema,
    outputSchema: BudgetAnomalyDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);