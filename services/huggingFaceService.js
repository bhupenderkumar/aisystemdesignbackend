const { HfInference } = require('@huggingface/inference');

class HuggingFaceService {
    constructor() {
        this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
        this.model = 'Qwen/Qwen2.5-Coder-32B-Instruct';
    }

    async generateSystemDesign(prompt) {
        try {
            const response = await this.hf.textGeneration({
                model: this.model,
                inputs: prompt,
                parameters: {
                    max_new_tokens: 2000,
                    temperature: 0.7,
                    top_p: 0.95,
                    repetition_penalty: 1.1,
                    return_full_text: false,
                }
            });

            return this.parseResponse(response.generated_text);
        } catch (error) {
            console.error('Error generating system design:', error);
            throw error;
        }
    }

    parseResponse(text) {
        try {
            // First try to find JSON content between triple backticks
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }

            // If no JSON found between backticks, try to parse the entire response
            return JSON.parse(text);
        } catch (error) {
            console.error('Error parsing response:', error);
            return {
                error: 'Failed to parse response',
                rawText: text
            };
        }
    }
}

module.exports = new HuggingFaceService();
