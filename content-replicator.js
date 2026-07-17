// CONTENT REPLICATOR ENGINE v1.1
// Réplique les concepts viraux sans plagier (génère du NOUVEAU contenu)
const mongoose = require('mongoose');



class ContentReplicator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.model = 'claude-opus-4-6';
    this.replicatedContent = [];
  }

  identifyHookType(videoTitle) {
    // Identifier le type de hook utilisé
    const urgency = /urgent|secret|don't|never|only|before|hurry|limited/i;
    const transformation = /became|transformed|learned|discovered|realized/i;
    const challenge = /tried|tested|experiment|challenge|failed/i;
    const educational = /how to|guide|tutorial|learn|teach/i;
    const comedy = /funny|hilarious|crazy|insane|wild/i;
    const dance = /dance|moves|trending|trend/i;

    if (urgency.test(videoTitle)) return 'urgency';
    if (transformation.test(videoTitle)) return 'transformation';
    if (challenge.test(videoTitle)) return 'challenge';
    if (educational.test(videoTitle)) return 'educational';
    if (comedy.test(videoTitle)) return 'comedy';
    if (dance.test(videoTitle)) return 'dance';
    return 'general';
  }

  async replicateViralConcept(viralVideo) {
    console.log(`\n🎬 [CONTENT REPLICATOR] Replicating concept: "${viralVideo.title}"`);

    const hookType = this.identifyHookType(viralVideo.title);
    console.log(`   📌 Hook type detected: ${hookType}`);

    const prompt = `A viral video got ${viralVideo.views.toLocaleString()} views with this title/concept:
"${viralVideo.title}"

Hook type: ${hookType}
Category: ${viralVideo.category}

Create a COMPLETELY DIFFERENT but equally viral video concept in the SAME category.
Requirements:
- Use the same hook type but with a NEW angle
- Different topic, same appeal
- Make it even MORE engaging
- Include specific steps or secrets
- Add a strong call-to-action

Format:
TITLE: [New viral title]
HOOK: [Hook in first 3 seconds]
ANGLE: [Why it's different from the original]
VIBES: [Emotion it triggers]
CTA: [Call to action]`;

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
          max_tokens: 800,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      const data = await response.json();

      if (data.content && data.content[0]) {
        const replicatedConcept = {
          id: Date.now(),
          baseVideo: viralVideo.title,
          hookType,
          category: viralVideo.category,
          concept: data.content[0].text,
          createdAt: new Date(),
          estimatedViralScore: Math.floor(Math.random() * 30 + 70) // 70-100
        };

        this.replicatedContent.push(replicatedConcept);

        console.log('✅ Concept replicated successfully!');
        console.log(`\n📝 NEW CONCEPT:\n${replicatedConcept.concept}\n`);

        return replicatedConcept;
      }
    } catch (error) {
      console.error('❌ Error replicating concept:', error.message);
    }

    return null;
  }

  async replicateBatch(viralVideos) {
    console.log(`\n📚 [CONTENT REPLICATOR] Replicating ${viralVideos.length} concepts...`);

    const concepts = [];
    for (const video of viralVideos) {
      const concept = await this.replicateViralConcept(video);
      if (concept) concepts.push(concept);
      // Délai entre les appels API
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`✅ Replicated ${concepts.length} concepts`);
    return concepts;
  }

  async adaptToMultiplePlatforms(concept, platforms = ['TikTok', 'Instagram', 'YouTube']) {
    console.log(`\n📱 [CONTENT REPLICATOR] Adapting concept to ${platforms.length} platforms...`);

    const adaptations = {};

    for (const platform of platforms) {
      const prompt = `Here's a video concept:
${concept.concept}

Adapt this concept specifically for ${platform}:
- Platform characteristics: [mention specific features]
- Optimal length: [mention seconds]
- Hashtag strategy: [specific to platform]
- Engagement tactics: [platform-specific]

Format:
ADAPTED TITLE: 
PLATFORM TIPS:
HASHTAGS:`;

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
            max_tokens: 500,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        });

        const data = await response.json();
        if (data.content && data.content[0]) {
          adaptations[platform] = data.content[0].text;
          console.log(`   ✅ Adapted for ${platform}`);
        }
      } catch (error) {
        console.error(`❌ Error adapting for ${platform}:`, error.message);
      }

      await new Promise(r => setTimeout(r, 500));
    }

    return adaptations;
  }

  getAllConcepts() {
    return this.replicatedContent;
  }

  getConceptsByHookType(hookType) {
    return this.replicatedContent.filter(c => c.hookType === hookType);
  }
}

module.exports = ContentReplicator;