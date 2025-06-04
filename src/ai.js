/*import Anthropic from "@anthropic-ai/sdk"*/
import { HfInference } from '@huggingface/inference'
import Groq from "groq-sdk";
import Instructor from "@instructor-ai/instructor"; // npm install @instructor-ai/instructor
import { z } from "zod"; // npm install zod

import config from '../appsettings.json'
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

// 🚨👉 ALERT: Read message below! You've been warned! 👈🚨
// If you're following along on your local machine instead of
// here on Scrimba, make sure you don't commit your API keys
// to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.

//const anthropic = new Anthropic({
//    // Make sure you set an environment variable in Scrimba 
//    // for ANTHROPIC_API_KEY
//    apiKey: process.env.ANTHROPIC_API_KEY,

//    dangerouslyAllowBrowser: true,
//})

////export async function getRecipeFromChefClaude(ingredientsArr) {
////    const ingredientsString = ingredientsArr.join(", ")

////    const msg = await anthropic.messages.create({
////        model: "claude-3-haiku-20240307",
////        max_tokens: 1024,
////        system: SYSTEM_PROMPT,
////        messages: [
////            { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
////        ],
////    });
////    return msg.content[0].text
////}

// Make sure you set an environment variable in Scrimba 
// for HF_ACCESS_TOKEN
const hf = new HfInference(config.HF_ACCESS_TOKEN)

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
    }
}

//const groq = new Groq({ apiKey: config.GROQ_TOKEN, dangerouslyAllowBrowser: true });
//export async function getGroqChatCompletion() {
//    const chatCompletion = groq.chat.completions.create({
//        messages: [
//            {
//                role: "user",
//                content: "Explain the importance of fast language models",
//            },
//        ],
//        model: "llama-3.3-70b-versatile",
//    });
//    return chatCompletion.choices[0]?.message?.content
//}
const client = new Groq({ apiKey: config.GROQ_TOKEN, dangerouslyAllowBrowser: true });
const instructor = Instructor({
    client,
    mode: "TOOLS"
});

// Define your schema with Zod
const RecipeIngredientSchema = z.object({
    name: z.string(),
    quantity: z.string(),
    unit: z.string().describe("The unit of measurement, like cup, tablespoon, etc."),
});

const RecipeSchema = z.object({
    title: z.string(),
    description: z.string(),
    prep_time_minutes: z.number().int().positive(),
    cook_time_minutes: z.number().int().positive(),
    ingredients: z.array(RecipeIngredientSchema),
    instructions: z.array(z.string()).describe("Step by step cooking instructions"),
});

export async function getRecipeChat(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        // Request structured data with automatic validation
        const recipe = await instructor.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_model: {
                name: "Recipe",
                schema: RecipeSchema,
            },
            messages: [
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make! Add any ingredients needed` },
            ],
            max_retries: 2, // Instructor will retry if validation fails
        });

        // No need for try/catch or manual validation - instructor handles it!
        console.log(`Recipe: ${recipe.title}`);
        console.log(`Prep time: ${recipe.prep_time_minutes} minutes`);
        console.log(`Cook time: ${recipe.cook_time_minutes} minutes`);
        console.log("\nIngredients:");
        recipe.ingredients.forEach((ingredient) => {
            console.log(`- ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`);
        });
        console.log("\nInstructions:");
        recipe.instructions.forEach((step, index) => {
            console.log(`${index + 1}. ${step}`);
        });

        return recipe;
    } catch (error) {
        console.error("Error:", error);
    }
}