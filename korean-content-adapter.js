// KOREAN CONTENT ADAPTER ENGINE v1.1
// Détecte et adapte le contenu coréen en FR + EN

const Anthropic = require("@anthropic-ai/sdk");

class KoreanContentAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = new Anthropic({ apiKey });
    this.model = 'claude-haiku-4-5-20251001';
    this.koreanCategories = [
      'K-dramas',
      'K-beauty',
      'K-food',
      'K-pop',
      'Mukbang',
      'ASMR',
      'Korean Fashion',
      'Korean Culture'
    ];
    this.adaptedContent = [];
  }

  detectKoreanContent(videoTitle, description = '') {
    const koreanKeywords = [
      'korean', 'k-drama', 'kdrama', 'kpop', 'k-pop', 'korean beauty',
      'korean food', 'korean culture', 'mukbang', 'asmr', 'korea', 'seoul',
      'hangul', 'k-beauty', 'korean makeup', 'korean fashion'
    ];

    const text = (videoTitle + ' ' + description).toLowerCase();
    const detected = koreanKeywords.some(keyword => text.includes(keyword));

    if (detected) {
      // Identifier la sous-catégorie
      for (const category of this.koreanCategories) {
        const categoryLower = category.toLowerCase();
        if (text.includes(categoryLower)) {
          return { detected: true, category };
        }
      }
      return { detected: true, category: 'Korean Culture' };
    }

    return { detected: false };
  }

  async adaptToFrench(koreanContent) {
    console.log(`\n🇫🇷 [KOREAN ADAPTER] Adapting to French...`);

    const prompt = `Adapt this Korean content to a French audience:

Original: "${koreanContent.title}"

Create a French version that:
1. Uses French cultural references that resonate with Koreans content
2. Keeps the essence but makes it relatable for French speakers
3. Includes French expressions and humor
4. Maintains the viral appeal

Format:
FRENCH TITLE: [New title in French]
FRENCH DESCRIPTION: [Description in French]
CULTURAL BRIDGE: [How Korean/French cultures connect]
HASHTAGS: #Korean #France #Culturel`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      if (response.content && response.content[0]) {
        console.log('✅ Adapted to French');
        return response.content[0].text;
      }
    } catch (error) {
      console.error('❌ Error adapting to French:', error.message);
    }

    return null;
  }

  async adaptToEnglish(koreanContent) {
    console.log(`\n🇬🇧 [KOREAN ADAPTER] Adapting to English...`);

    const prompt = `Adapt this Korean content to an English-speaking audience:

Original: "${koreanContent.title}"

Create an English version that:
1. Uses global cultural references
2. Explains Korean concepts for international audience
3. Makes it universally appealing
4. Uses engaging English expressions
5. Keeps viral potential

Format:
ENGLISH TITLE: [New title in English]
ENGLISH DESCRIPTION: [Description in English]
EXPLANATION: [Why this matters globally]
HASHTAGS: #Korean #Global #Culture`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      if (response.content && response.content[0]) {
        console.log('✅ Adapted to English');
        return response.content[0].text;
      }
    } catch (error) {
      console.error('❌ Error adapting to English:', error.message);
    }

    return null;
  }

  async fullAdaptationPipeline(koreanVideo) {
    console.log(`\n🎬 [KOREAN ADAPTER] Full adaptation pipeline for: "${koreanVideo.title}"`);

    const detection = this.detectKoreanContent(koreanVideo.title, koreanVideo.description);

    if (!detection.detected) {
      console.log('ℹ️  Not Korean content detected');
      return null;
    }

    console.log(`✅ Detected Korean content: ${detection.category}`);

    const frenchAdaptation = await this.adaptToFrench(koreanVideo);
    await new Promise(r => setTimeout(r, 500));
    
    const englishAdaptation = await this.adaptToEnglish(koreanVideo);
    await new Promise(r => setTimeout(r, 500));

    const adaptation = {
      id: Date.now(),
      originalTitle: koreanVideo.title,
      category: detection.category,
      original: koreanVideo,
      french: frenchAdaptation,
      english: englishAdaptation,
      createdAt: new Date(),
      platforms: {
        french: ['TikTok France', 'Instagram FR', 'YouTube FR'],
        english: ['TikTok Global', 'Instagram Global', 'YouTube Global']
      }
    };

    this.adaptedContent.push(adaptation);

    console.log(`\n✅ Full pipeline complete!`);
    console.log(`   🇫🇷 French version ready`);
    console.log(`   🇬🇧 English version ready`);

    return adaptation;
  }

  findKoreanContent(videosList) {
    console.log(`\n🔍 [KOREAN ADAPTER] Scanning ${videosList.length} videos for Korean content...`);

    const koreanVideos = [];
    for (const video of videosList) {
      const detection = this.detectKoreanContent(video.title, video.description || '');
      if (detection.detected) {
        koreanVideos.push({
          ...video,
          detectedCategory: detection.category
        });
      }
    }

    console.log(`✅ Found ${koreanVideos.length} Korean content videos`);
    return koreanVideos;
  }

  getAllAdaptations() {
    return this.adaptedContent;
  }

  getAdaptationsByCategory(category) {
    return this.adaptedContent.filter(a => a.category === category);
  }
}

module.exports = KoreanContentAdapter;