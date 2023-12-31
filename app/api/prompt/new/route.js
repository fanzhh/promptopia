import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req) => {
    const { userId, prompt, tag } = await req.json();

    try {
        console.log('in POST, will call connectToDB...')
        await connectToDB();
        const newPrompt = new Prompt({
            creator: userId,
            prompt: prompt,
            tag
        });
        console.log('will save...');
        await newPrompt.save();
        console.log('saved.');
        return new Response(JSON.stringify(newPrompt),{status:201});
    } catch (error) {
        return new Response("Failed to create a new prompt",{status:500})
    }
}


