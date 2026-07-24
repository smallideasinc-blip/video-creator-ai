// DATABASE MANAGER v1.1
// Gère MongoDB pour sauvegarder tous les contenus générés

const mongoose = require('mongoose');

class DatabaseManager {
  constructor() {
    this.connected = false;
    this.dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/video-creator-ai';
    
    // Définir les schémas
    this.defineSchemas();
  }

  defineSchemas() {
    // Schema pour les scripts générés
    this.ScriptSchema = new mongoose.Schema({
      id: Number,
      topic: String,
      style: String,
      duration: Number,
      script: String,
      generatedBy: String,
      createdAt: { type: Date, default: Date.now },
      status: { type: String, default: 'generated' },
      viralScore: Number,
      published: { type: Boolean, default: false }
    });

    // Schema pour les vidéos virales trouvées
    this.ViralVideoSchema = new mongoose.Schema({
      title: String,
      source: String,
      creator: String,
      views: Number,
      likes: Number,
      comments: Number,
      shares: Number,
      category: String,
      url: String,
      viralScore: Number,
      uploadedHoursAgo: Number,
      scrapedAt: { type: Date, default: Date.now },
      analyzed: { type: Boolean, default: false }
    });

    // Schema pour les tendances
    this.TrendSchema = new mongoose.Schema({
      category: String,
      keywords: [String],
      engagement: Number,
      growth: String,
      virality: Number,
      analyzedAt: { type: Date, default: Date.now },
      relevance: { type: String, default: 'high' }
    });

    // Schema pour les publications
    this.PublicationSchema = new mongoose.Schema({
      scriptId: mongoose.Schema.Types.ObjectId,
      content: String,
      platforms: [String],
      status: String,
      publishedAt: Date,
      engagement: {
        likes: Number,
        comments: Number,
        shares: Number
      },
      createdAt: { type: Date, default: Date.now }
    });

    // Schema pour les concepts répliqués
    this.ConceptSchema = new mongoose.Schema({
      baseVideoId: mongoose.Schema.Types.ObjectId,
      hookType: String,
      category: String,
      concept: String,
      estimatedViralScore: Number,
      platforms: [String],
      createdAt: { type: Date, default: Date.now },
      published: { type: Boolean, default: false }
    });

    // Schema pour le contenu coréen adapté
    this.KoreanAdaptationSchema = new mongoose.Schema({
      originalTitle: String,
      category: String,
      original: String,
      french: String,
      english: String,
      frenchPlatforms: [String],
      englishPlatforms: [String],
      createdAt: { type: Date, default: Date.now },
      published: { type: Boolean, default: false }
    });

    // Schema pour les statistiques
    this.StatsSchema = new mongoose.Schema({
      date: Date,
      totalScriptsGenerated: Number,
      totalVideosFound: Number,
      totalContentPublished: Number,
      totalConceptsReplicated: Number,
      totalKoreanAdaptations: Number,
      averageEngagement: Number,
      topCategory: String,
      createdAt: { type: Date, default: Date.now }
    });
  }

  async connect() {
    try {
      console.log('\n🔌 [DATABASE] Connecting to MongoDB...');
      
      // Connexion à MongoDB
      await mongoose.connect(this.dbUri, {
        serverSelectionTimeoutMS: 5000
      });

      console.log('✅ Connected to MongoDB!');
      this.connected = true;

      // Créer les modèles
      this.Script = mongoose.model('Script', this.ScriptSchema);
      this.ViralVideo = mongoose.model('ViralVideo', this.ViralVideoSchema);
      this.Trend = mongoose.model('Trend', this.TrendSchema);
      this.Publication = mongoose.model('Publication', this.PublicationSchema);
      this.Concept = mongoose.model('Concept', this.ConceptSchema);
      this.KoreanAdaptation = mongoose.model('KoreanAdaptation', this.KoreanAdaptationSchema);
      this.Stats = mongoose.model('Stats', this.StatsSchema);

      return true;
    } catch (error) {
      console.log('⚠️  MongoDB not available (using in-memory storage)');
      console.log('   💡 To enable MongoDB: Install MongoDB Community Edition');
      console.log('   📖 https://docs.mongodb.com/manual/installation/');
      
      // Fallback: utiliser un stockage en mémoire
      this.useInMemoryStorage();
      return false;
    }
  }

  useInMemoryStorage() {
    console.log('\n📦 [DATABASE] Using in-memory storage (non-persistent)');
    this.inMemory = {
      scripts: [],
      viralVideos: [],
      trends: [],
      publications: [],
      concepts: [],
      koreanAdaptations: [],
      stats: []
    };
  }

  async saveScript(scriptData) {
    if (this.connected) {
      try {
        const script = new this.Script(scriptData);
        await script.save();
        console.log('✅ Script saved to database');
        return script;
      } catch (error) {
        console.error('❌ Error saving script:', error.message);
      }
    } else if (this.inMemory) {
      this.inMemory.scripts.push(scriptData);
      console.log('💾 Script saved to memory');
    }
  }

  async updateScript(script) {
    if (this.connected) {
      try {
        await this.Script.updateOne(
          { id: script.id },
          { $set: { script: script.script, status: script.status } }
        );
        console.log('✅ Script updated in database');
      } catch (error) {
        console.error('❌ Error updating script:', error.message);
      }
    }
    // Fallback mémoire : saveScript stocke la même référence d'objet,
    // les modifications en place sont donc déjà visibles
  }

  async getScripts() {
    if (this.connected) {
      try {
        return await this.Script.find().sort({ createdAt: 1 }).lean();
      } catch (error) {
        console.error('❌ Error loading scripts:', error.message);
        return [];
      }
    } else if (this.inMemory) {
      return this.inMemory.scripts;
    }
    return [];
  }

  async saveViralVideo(videoData) {
    if (this.connected) {
      try {
        const video = new this.ViralVideo(videoData);
        await video.save();
        console.log('✅ Viral video saved to database');
        return video;
      } catch (error) {
        console.error('❌ Error saving viral video:', error.message);
      }
    } else if (this.inMemory) {
      this.inMemory.viralVideos.push(videoData);
      console.log('💾 Viral video saved to memory');
    }
  }

  async saveTrend(trendData) {
    if (this.connected) {
      try {
        const trend = new this.Trend(trendData);
        await trend.save();
        console.log('✅ Trend saved to database');
        return trend;
      } catch (error) {
        console.error('❌ Error saving trend:', error.message);
      }
    } else if (this.inMemory) {
      this.inMemory.trends.push(trendData);
      console.log('💾 Trend saved to memory');
    }
  }

  async savePublication(pubData) {
    if (this.connected) {
      try {
        const pub = new this.Publication(pubData);
        await pub.save();
        console.log('✅ Publication saved to database');
        return pub;
      } catch (error) {
        console.error('❌ Error saving publication:', error.message);
      }
    } else if (this.inMemory) {
      this.inMemory.publications.push(pubData);
      console.log('💾 Publication saved to memory');
    }
  }

  async getStats() {
    if (this.connected) {
      try {
        const stats = {
          totalScripts: await this.Script.countDocuments(),
          totalViralVideos: await this.ViralVideo.countDocuments(),
          totalTrends: await this.Trend.countDocuments(),
          totalPublications: await this.Publication.countDocuments(),
          totalConcepts: await this.Concept.countDocuments(),
          totalKoreanAdaptations: await this.KoreanAdaptation.countDocuments()
        };
        return stats;
      } catch (error) {
        console.error('❌ Error getting stats:', error.message);
      }
    } else if (this.inMemory) {
      return {
        totalScripts: this.inMemory.scripts.length,
        totalViralVideos: this.inMemory.viralVideos.length,
        totalTrends: this.inMemory.trends.length,
        totalPublications: this.inMemory.publications.length,
        totalConcepts: this.inMemory.concepts.length,
        totalKoreanAdaptations: this.inMemory.koreanAdaptations.length
      };
    }
  }

  async disconnect() {
    if (this.connected) {
      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB');
    }
  }
}

module.exports = DatabaseManager;