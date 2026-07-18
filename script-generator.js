// SCRIPT GENERATOR ENGINE v1.1
// Génère des scripts vidéo via Claude API



class ScriptGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    // Haiku suffit pour des scripts courts formatés (~5x moins cher qu'Opus)
    this.model = 'claude-haiku-4-5';
    // Sonnet pour l'amélioration finale, où la nuance compte davantage
    this.improveModel = 'claude-sonnet-4-6';
    this.generatedScripts = [];
  }

  // Réhydrate les scripts persistés (évite de régénérer après un redémarrage)
  loadScripts(scripts) {
    for (const s of scripts) {
      this.generatedScripts.push({
        id: s.id || Date.now() + Math.random(),
        topic: s.topic,
        style: s.style,
        duration: s.duration,
        script: s.script,
        createdAt: s.createdAt,
        status: s.status || 'generated'
      });
    }
    console.log(`💾 [SCRIPT GENERATOR] ${scripts.length} scripts rechargés depuis la base`);
  }

  findExistingScript(topic, style, duration) {
    const norm = v => String(v).trim().toLowerCase();
    return this.generatedScripts.find(s =>
      norm(s.topic) === norm(topic) &&
      norm(s.style) === norm(style) &&
      Number(s.duration) === Number(duration)
    );
  }

  async generateScript(topic, style = 'engaging', duration = 60) {
    // Déduplication : même sujet/style/durée → réutiliser sans appel API
    const existing = this.findExistingScript(topic, style, duration);
    if (existing) {
      console.log(`\n♻️  [SCRIPT GENERATOR] Script déjà généré pour "${topic}" — réutilisation (0 crédit)`);
      return { ...existing, fromCache: true };
    }

    console.log(`\n✍️  [SCRIPT GENERATOR] Generating script for: "${topic}"`);

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

      if (!response.ok) {
        this.lastError = response.status === 429
          ? 'Limite de débit API atteinte — réessayez dans quelques instants (ne relancez pas en boucle)'
          : `API ${response.status}: ${data.error?.message || 'erreur inconnue'}`;
        console.error('❌ API error:', this.lastError);
        return null;
      }

      if (data.content && data.content[0]) {
        const script = data.content[0].text;

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
        console.log(`\n📝 SCRIPT:\n${script}\n`);

        return scriptObj;
      } else {
        this.lastError = data.error?.message || 'No content in API response';
        console.error('❌ API error:', this.lastError);
        return null;
      }
    } catch (error) {
      console.error('❌ Error generating script:', error.message);
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
          model: this.improveModel,
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        this.lastError = `API ${response.status}: ${data.error?.message || 'erreur inconnue'}`;
        console.error('❌ API error:', this.lastError);
        return null;
      }
      if (data.content && data.content[0]) {
        // Conserver la version précédente : si l'amélioration déçoit,
        // pas besoin de regénérer (et donc de re-payer)
        script.previousVersions = script.previousVersions || [];
        script.previousVersions.push(script.script);
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