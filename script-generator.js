// SCRIPT GENERATOR ENGINE v1.1
// Génère des scripts vidéo via Claude API

const Anthropic = require("@anthropic-ai/sdk");

class ScriptGenerator {
  constructor(apiKey) {
    console.log(`[SCRIPT-GEN] Constructor called with apiKey: ${apiKey ? 'EXISTS' : 'MISSING'}`);
    this.apiKey = apiKey;
    this.client = new Anthropic({ apiKey });
    this.model = 'claude-opus-4-8';
    this.generatedScripts = [];
    console.log(`[SCRIPT-GEN] Anthropic client initialized with model: ${this.model}`);
  }

  async generateScript(topic, style = 'engaging', duration = 60) {
    console.log(`\n✍️  [SCRIPT GENERATOR] Generating script for: "${topic}"`);
    console.log(`   Style: ${style}, Duration: ${duration}s`);
    console.log(`   Model: ${this.model}, API Key: ${this.apiKey ? 'SET' : 'MISSING'}`);

    const prompt = `Generate a viral short-form video script (${duration} seconds) about "${topic}".

Style: ${style}
Tone: Professional but entertaining
Target: TikTok/Instagram Reels

Requirements:
- Hook in first 3 seconds
- 3-4 main points
- Call to action at end
- Include 2-3 emojis
- All caps for emphasis on key phrases

Format:
[0-3s] HOOK: ...
[3-15s] POINT 1: ...
[15-30s] POINT 2: ...
[30-45s] POINT 3: ...
[45-60s] CTA: ...`;

    try {
      console.log(`   [API-CALL] Sending request to Claude API...`);
      const startTime = Date.now();

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const elapsed = Date.now() - startTime;
      console.log(`   [API-CALL] ✅ Response received in ${elapsed}ms`);
      console.log(`   [API-CALL] Response type: ${response.content ? 'HAS CONTENT' : 'NO CONTENT'}`);

      if (response.content && response.content[0]) {
        const script = response.content[0].text;

        const scriptObj = {
          id: Date.now(),
          topic,
          style,
          duration,
          script,
          createdAt: new Date(),
          status: 'generated'
        };

        this.generatedScripts.push(scriptObj);

        console.log('✅ Script generated successfully!');
        console.log(`   Script ID: ${scriptObj.id}`);
        console.log(`   Length: ${script.length} characters`);
        console.log(`\n📝 SCRIPT:\n${script}\n`);

        return scriptObj;
      } else {
        this.lastError = 'No content in API response';
        console.error('❌ API error:', this.lastError);
        console.error('   Response:', JSON.stringify(response, null, 2));
        return null;
      }
    } catch (error) {
      console.error('❌ Error generating script:', error.message);
      console.error('   Error type:', error.constructor.name);
      console.error('   Full error:', error);
      this.lastError = error.message;
      return null;
    }
  }

  async generateBatchScripts(topics, style = 'engaging') {
    console.log(`\n📚 [SCRIPT GENERATOR] Generating ${topics.length} scripts...`);
    
    const scripts = [];
    for (const topic of topics) {
      const script = await this.generateScript(topic, style);
      if (script) scripts.push(script);
      // Petit délai entre les appels API
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`✅ Generated ${scripts.length} scripts`);
    return scripts;
  }

  getScriptById(id) {
    return this.generatedScripts.find(s => s.id === id);
  }

  getAllScripts() {
    return this.generatedScripts;
  }

  async improveScript(scriptId, feedback) {
    const script = this.getScriptById(scriptId);
    if (!script) {
      console.error('Script not found');
      return null;
    }

    console.log(`\n🔧 [SCRIPT GENERATOR] Improving script based on feedback...`);

    const prompt = `Here's a video script:

${script.script}

Feedback: ${feedback}

Please improve the script based on this feedback. Keep the same format and duration.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        script.script = data.content[0].text;
        script.status = 'improved';
        console.log('✅ Script improved!');
        return script;
      }
    } catch (error) {
      console.error('❌ Error improving script:', error.message);
    }

    return null;
  }
}

module.exports = ScriptGenerator;