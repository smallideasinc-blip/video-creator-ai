// VIRAL VIDEO SCRAPER ENGINE v1.1
// Trouve les 5 vidéos les plus virales chaque jour

class ViralVideoScraper {
  constructor() {
    this.viralVideos = [];
    this.lastScrapeTime = null;
  }

  calculateViralScore(views, engagement, shares, recency) {
    // Score viral = (views * 0.3) + (engagement * 0.4) + (shares * 0.3)
    const engagementRate = engagement / Math.max(views, 1);
    const shareRate = shares / Math.max(views, 1);
    
    const score = (engagementRate * 40) + (shareRate * 30) + (recency * 30);
    return Math.min(100, Math.round(score));
  }

  async findFiveMostViral() {
    console.log('\n🔥 [VIRAL SCRAPER] Finding 5 most viral videos today...');

    // Simuler le scraping de 5 sources
    const viralData = [
      {
        title: "3 AI Hacks That Save 10 Hours Per Week",
        source: "TikTok",
        creator: "@tech_guru",
        views: 2500000,
        likes: 450000,
        comments: 85000,
        shares: 125000,
        category: "AI & Technology",
        url: "https://tiktok.com/video/1",
        uploadedHoursAgo: 4
      },
      {
        title: "How to Make Money with Automation",
        source: "YouTube Shorts",
        creator: "Money Moves",
        views: 1800000,
        likes: 380000,
        comments: 62000,
        shares: 98000,
        category: "Business",
        url: "https://youtube.com/short/1",
        uploadedHoursAgo: 6
      },
      {
        title: "African Diaspora Connects Across Continents",
        source: "Instagram Reels",
        creator: "@diaspora.hub",
        views: 920000,
        likes: 185000,
        comments: 45000,
        shares: 67000,
        category: "Culture",
        url: "https://instagram.com/reel/1",
        uploadedHoursAgo: 8
      },
      {
        title: "Productivity Routine That Changed My Life",
        source: "Twitter/X",
        creator: "@productivity",
        views: 1250000,
        likes: 245000,
        comments: 38000,
        shares: 52000,
        category: "Lifestyle",
        url: "https://twitter.com/video/1",
        uploadedHoursAgo: 5
      },
      {
        title: "Secret Learning Hack Universities Don't Want You To Know",
        source: "TikTok",
        creator: "@study_hacks",
        views: 1600000,
        likes: 320000,
        comments: 55000,
        shares: 78000,
        category: "Education",
        url: "https://tiktok.com/video/2",
        uploadedHoursAgo: 3
      }
    ];

    // Calculer le viral score pour chaque vidéo
    viralData.forEach(video => {
      const recency = (24 - video.uploadedHoursAgo) / 24 * 100;
      video.viralScore = this.calculateViralScore(
        video.views,
        video.likes + video.comments,
        video.shares,
        recency
      );
    });

    // Trier par viral score
    viralData.sort((a, b) => b.viralScore - a.viralScore);

    this.viralVideos = viralData.slice(0, 5);
    this.lastScrapeTime = new Date();

    console.log('✅ Found 5 viral videos:');
    this.viralVideos.forEach((v, i) => {
      console.log(`   #${i + 1} (${v.viralScore}/100) ${v.title}`);
      console.log(`       📱 ${v.source} | 👁️ ${v.views.toLocaleString()} views`);
    });

    return this.viralVideos;
  }

  getDailyStats() {
    if (this.viralVideos.length === 0) return null;

    const totalViews = this.viralVideos.reduce((sum, v) => sum + v.views, 0);
    const totalEngagement = this.viralVideos.reduce((sum, v) => sum + v.likes + v.comments, 0);
    const averageViralScore = Math.round(
      this.viralVideos.reduce((sum, v) => sum + v.viralScore, 0) / this.viralVideos.length
    );

    return {
      date: new Date().toLocaleDateString(),
      videosFound: this.viralVideos.length,
      totalViews: totalViews.toLocaleString(),
      totalEngagement: totalEngagement.toLocaleString(),
      averageViralScore,
      topCategory: this.viralVideos[0]?.category
    };
  }

  getVideosByCategory(category) {
    return this.viralVideos.filter(v => v.category === category);
  }

  getTopVideo() {
    return this.viralVideos[0] || null;
  }
}

module.exports = ViralVideoScraper;