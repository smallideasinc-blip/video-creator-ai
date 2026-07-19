// AI DETECTION & HUMANIZATION AGENT v1.0
// Détecte le contenu généré par IA et propose des corrections avant publication

const Anthropic = require("@anthropic-ai/sdk");

class AIDetectionAgent {
  constructor(apiKey) {
    this.client = new Anthropic({ apiKey });
    this.model = "claude-opus-4-8";
  }

  /**
   * Analyse un script pour détecter les marqueurs de contenu généré par IA
   * et propose des corrections avant publication
   */
  async analyzeAndHumanize(scriptText, platform = "general") {
    console.log(`\n🔍 [AI-DETECTION] Analysing content for ${platform}...`);

    const analysisPrompt = `You are an expert at detecting AI-generated content and making it sound more human, authentic, and natural.

Analyze this content and provide:
1. **AI Detection Score** (0-100): How likely this seems to be AI-generated
2. **Suspicious Phrases**: List phrases that sound "too AI" or formulaic
3. **Humanization Suggestions**: How to rewrite specific parts to sound more natural
4. **Rewritten Version**: A fully rewritten version that sounds more authentic
5. **Publication Safety**: Is it safe to publish? (Yes/No/With Caution)

Platform context: ${platform}
Content to analyze:
"""
${scriptText}
"""

Respond in JSON format:
{
  "aiDetectionScore": <0-100>,
  "riskLevel": "<Low|Medium|High>",
  "suspiciousPhrases": [<array of phrases that sound AI-generated>],
  "humanizationSuggestions": [
    {
      "originalPhrase": "...",
      "issue": "...",
      "suggestion": "..."
    }
  ],
  "rewrittenContent": "...",
  "publicationSafe": "<Yes|No|WithCaution>",
  "reasoning": "...",
  "platformSpecificNotes": "..."
}`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
      });

      const analysisText =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Parse JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("❌ Could not parse analysis response");
        return null;
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Display results
      this.displayAnalysisResults(analysis);

      return analysis;
    } catch (error) {
      console.error("❌ Analysis failed:", error.message);
      return null;
    }
  }

  /**
   * Affiche les résultats de l'analyse de manière lisible
   */
  displayAnalysisResults(analysis) {
    console.log("\n" + "=".repeat(70));
    console.log("📊 AI DETECTION ANALYSIS REPORT");
    console.log("=".repeat(70));

    // Score d'IA
    console.log(`\n🤖 AI Detection Score: ${analysis.aiDetectionScore}/100`);
    const scoreBar =
      "█".repeat(Math.floor(analysis.aiDetectionScore / 5)) +
      "░".repeat(20 - Math.floor(analysis.aiDetectionScore / 5));
    console.log(`   ${scoreBar}`);

    // Risk Level
    const riskEmoji =
      {
        Low: "🟢",
        Medium: "🟡",
        High: "🔴",
      }[analysis.riskLevel] || "⚪";
    console.log(`\n${riskEmoji} Risk Level: ${analysis.riskLevel}`);

    // Phrases suspectes
    if (analysis.suspiciousPhrases && analysis.suspiciousPhrases.length > 0) {
      console.log("\n⚠️  Suspicious Phrases:");
      analysis.suspiciousPhrases.forEach((phrase, i) => {
        console.log(`   ${i + 1}. "${phrase}"`);
      });
    } else {
      console.log("\n✅ No suspicious phrases detected");
    }

    // Suggestions de humanization
    if (
      analysis.humanizationSuggestions &&
      analysis.humanizationSuggestions.length > 0
    ) {
      console.log("\n✏️  Humanization Suggestions:");
      analysis.humanizationSuggestions.forEach((suggestion, i) => {
        console.log(`\n   ${i + 1}. Issue: ${suggestion.issue}`);
        console.log(`      Original: "${suggestion.originalPhrase}"`);
        console.log(`      Suggest: "${suggestion.suggestion}"`);
      });
    }

    // Contenu réécrit
    if (analysis.rewrittenContent) {
      console.log("\n📝 Rewritten Version (More Authentic):");
      console.log("   " + analysis.rewrittenContent.replace(/\n/g, "\n   "));
    }

    // Safety pour publication
    console.log(`\n📢 Publication Safety: ${analysis.publicationSafe}`);
    if (analysis.reasoning) {
      console.log(`   Reasoning: ${analysis.reasoning}`);
    }

    // Notes spécifiques à la plateforme
    if (analysis.platformSpecificNotes) {
      console.log(`\n📱 Platform Notes: ${analysis.platformSpecificNotes}`);
    }

    console.log("\n" + "=".repeat(70));
  }

  /**
   * Batch analyse plusieurs scripts
   */
  async analyzeBatch(scripts) {
    console.log(`\n🔄 [AI-DETECTION] Analyzing ${scripts.length} scripts...`);

    const results = [];
    for (const script of scripts) {
      const analysis = await this.analyzeAndHumanize(
        script.content,
        script.platform || "general"
      );
      results.push({
        scriptId: script.id,
        platform: script.platform,
        analysis,
      });

      // Delay between API calls to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Intégration avec le ScriptGenerator pour auto-vérifier chaque script
   */
  async verifyBeforePublication(script, platform) {
    console.log(
      `\n🛡️  [SAFETY-CHECK] Verifying script before ${platform} publication...`
    );

    const analysis = await this.analyzeAndHumanize(script.script, platform);

    if (!analysis) {
      console.warn("⚠️  Could not analyze content - proceeding with caution");
      return { safe: "unknown", analysis: null };
    }

    // Déterminer si c'est sûr de publier
    const isSafe =
      analysis.publicationSafe === "Yes" ||
      (analysis.publicationSafe === "WithCaution" &&
        analysis.aiDetectionScore < 60);

    return {
      safe: isSafe ? "yes" : analysis.publicationSafe,
      score: analysis.aiDetectionScore,
      suggestions: analysis.humanizationSuggestions,
      rewrittenContent: analysis.rewrittenContent,
      analysis,
    };
  }
}

module.exports = AIDetectionAgent;
