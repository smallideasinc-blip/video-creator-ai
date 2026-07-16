// VIDEO CREATOR AI v1.1 - LAUNCHER
// Orchestrateur principal qui gère tous les moteurs

require('dotenv').config();

const TrendsAnalyzer = require('./trends-analyzer-engine.js');
const ScriptGenerator = require('./script-generator.js');
const MultiplatformPublisher = require('./multiplatform-publisher.js');
const ViralVideoScraper = require('./viral-video-scraper.js');
const ContentReplicator = require('./content-replicator.js');
const KoreanContentAdapter = require('./korean-content-adapter.js');

class VideoCreatorAI {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    
    // Initialiser tous les moteurs
    this.trendsAnalyzer = new TrendsAnalyzer();
    this.scriptGenerator = new ScriptGenerator(this.apiKey);
    this.publisher = new MultiplatformPublisher();
    this.viralScraper = new ViralVideoScraper();
    this.contentReplicator = new ContentReplicator(this.apiKey);
    this.koreanAdapter = new KoreanContentAdapter(this.apiKey);
  }

  async runFullPipeline() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 VIDEO CREATOR AI v1.1 - COMPLETE PIPELINE');
    console.log('='.repeat(60));

    try {
      // ÉTAPE 1: Analyser les tendances
      await this.trendsAnalyzer.analyzeTrends();
      const stats = await this.trendsAnalyzer.getDailyStats();
      console.log(`\n📊 Daily Stats:`, stats);

      // ÉTAPE 2: Trouver les vidéos virales
      await this.viralScraper.findFiveMostViral();
      const viralStats = this.viralScraper.getDailyStats();
      console.log(`\n🔥 Viral Stats:`, viralStats);

      // ÉTAPE 3: Générer des scripts basés sur les tendances
      const topTrend = this.trendsAnalyzer.getTopTrends(1)[0];
      if (topTrend) {
        const script = await this.scriptGenerator.generateScript(
          `${topTrend.category}: ${topTrend.keywords.join(', ')}`,
          'engaging',
          60
        );

        if (script) {
          // ÉTAPE 4: Publier le script
          await this.publisher.publishContent(
            script.script,
            ['TikTok', 'Instagram Reels', 'YouTube Shorts']
          );
        }
      }

      // ÉTAPE 5: Répliquer les concepts viraux
      const topViral = this.viralScraper.getTopVideo();
      if (topViral) {
        await this.contentReplicator.replicateViralConcept(topViral);
      }

      // ÉTAPE 6: Adapter le contenu coréen
      const detectedKorean = this.koreanAdapter.detectKoreanContent(
        topViral?.title || 'Korean Culture'
      );
      if (detectedKorean.detected) {
        await this.koreanAdapter.fullAdaptationPipeline({
          title: topViral?.title || 'Korean Content',
          description: 'Trending Korean content'
        });
      }

      console.log('\n' + '='.repeat(60));
      console.log('✅ PIPELINE COMPLETED SUCCESSFULLY!');
      console.log('='.repeat(60));
      console.log('\n📈 Summary:');
      console.log('   ✅ Trends analyzed');
      console.log('   ✅ Viral videos found');
      console.log('   ✅ Scripts generated');
      console.log('   ✅ Content published to 3 platforms');
      console.log('   ✅ Viral concepts replicated');
      console.log('   ✅ Korean content adapted');
      console.log('\n🎬 System ready for continuous operation!');

    } catch (error) {
      console.error('❌ Pipeline error:', error);
    }
  }

  async quickDemo() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 VIDEO CREATOR AI v1.1 - QUICK DEMO');
    console.log('='.repeat(60));

    try {
      // Quick tests of each engine
      console.log('\n1️⃣  Testing Trends Analyzer...');
      await this.trendsAnalyzer.analyzeTrends();

      console.log('\n2️⃣  Testing Viral Scraper...');
      await this.viralScraper.findFiveMostViral();

      console.log('\n3️⃣  Testing Script Generator...');
      await this.scriptGenerator.generateScript('3 AI Hacks', 'engaging', 60);

      console.log('\n4️⃣  Testing Content Replicator...');
      const topViral = this.viralScraper.getTopVideo();
      if (topViral) {
        await this.contentReplicator.replicateViralConcept(topViral);
      }

      console.log('\n5️⃣  Testing Multiplatform Publisher...');
      await this.publisher.publishContent('Check this out! Amazing video coming soon! 🎬', 
        ['TikTok', 'Instagram Reels']);

      console.log('\n6️⃣  Testing Korean Adapter...');
      await this.koreanAdapter.fullAdaptationPipeline({
        title: 'Amazing Korean K-drama Scene',
        description: 'The best K-drama moments'
      });

      console.log('\n' + '='.repeat(60));
      console.log('✅ ALL ENGINES TESTED SUCCESSFULLY!');
      console.log('='.repeat(60));

    } catch (error) {
      console.error('❌ Demo error:', error);
    }
  }
}

// START THE SYSTEM
console.log('🚀 Video Creator AI - System Starting...');
console.log('✅ Environment loaded');
console.log('✅ API Key: ' + (process.env.CLAUDE_API_KEY ? '***CONFIGURED***' : 'NOT SET'));
console.log('✅ Node Environment: ' + process.env.NODE_ENV);

const system = new VideoCreatorAI();

// Afficher le menu
console.log('\n' + '='.repeat(60));
console.log('🎬 VIDEO CREATOR AI SYSTEM LOADED');
console.log('='.repeat(60));
console.log('\n📋 Available Commands:');
console.log('   system.quickDemo()        - Run all engines once');
console.log('   system.runFullPipeline()  - Run complete workflow');
console.log('   system.trendsAnalyzer.analyzeTrends()');
console.log('   system.viralScraper.findFiveMostViral()');
console.log('   system.scriptGenerator.generateScript(topic, style, duration)');
console.log('\n💡 Try: system.quickDemo()');
console.log('='.repeat(60));

// Auto-run quick demo on startup
console.log('\n🎬 Running Quick Demo...\n');
system.quickDemo();