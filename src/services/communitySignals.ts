import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CommunitySignalData {
  id: string;
  platform: string;
  source: string;
  title: string;
  content: string;
  url: string;
  engagement: {
    upvotes?: number;
    comments?: number;
    likes?: number;
    shares?: number;
    views?: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  signalStrength: number; // 1-10 scale
  extractedProblems: string[];
  keywords: string[];
  createdAt: Date;
}

export interface PlatformConfig {
  enabled: boolean;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  rateLimitPerHour: number;
}

export class CommunitySignalsService {
  private platforms: Record<string, PlatformConfig> = {
    reddit: {
      enabled: true,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      rateLimitPerHour: 3600 // Reddit allows 60/min = 3600/hour
    },
    youtube: {
      enabled: true,
      apiKey: process.env.YOUTUBE_API_KEY,
      rateLimitPerHour: 10000 // YouTube quota units
    },
    hackernews: {
      enabled: true,
      rateLimitPerHour: 10000 // HN is pretty generous
    },
    producthunt: {
      enabled: true,
      rateLimitPerHour: 1000
    }
  };

  async collectSignalsForKeywords(keywords: string[]): Promise<CommunitySignalData[]> {
    const allSignals: CommunitySignalData[] = [];

    for (const keyword of keywords) {
      // Collect from each platform
      if (this.platforms.reddit.enabled) {
        const redditSignals = await this.collectRedditSignals(keyword);
        allSignals.push(...redditSignals);
      }

      if (this.platforms.hackernews.enabled) {
        const hnSignals = await this.collectHackerNewsSignals(keyword);
        allSignals.push(...hnSignals);
      }

      if (this.platforms.youtube.enabled) {
        const youtubeSignals = await this.collectYouTubeSignals(keyword);
        allSignals.push(...youtubeSignals);
      }

      // Add small delay to respect rate limits
      await this.sleep(1000);
    }

    return allSignals.sort((a, b) => b.signalStrength - a.signalStrength);
  }

  private async collectRedditSignals(keyword: string): Promise<CommunitySignalData[]> {
    try {
      // Use Reddit's public JSON API (no auth needed for public posts)
      const subreddits = ['startups', 'entrepreneur', 'SaaS', 'smallbusiness', 'business', 'productivity'];
      const signals: CommunitySignalData[] = [];

      for (const subreddit of subreddits) {
        const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(keyword)}&restrict_sr=1&sort=relevance&limit=10`;

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'UpStart:v1.0 (by /u/upstartapp)'
          }
        });

        if (!response.ok) continue;

        const data = await response.json();

        for (const post of data.data?.children || []) {
          const postData = post.data;

          signals.push({
            id: `reddit_${postData.id}`,
            platform: 'reddit',
            source: `r/${subreddit}`,
            title: postData.title,
            content: postData.selftext || '',
            url: `https://reddit.com${postData.permalink}`,
            engagement: {
              upvotes: postData.ups,
              comments: postData.num_comments
            },
            sentiment: this.analyzeSentiment(postData.title + ' ' + postData.selftext),
            signalStrength: this.calculateRedditSignalStrength(postData),
            extractedProblems: this.extractProblems(postData.title + ' ' + postData.selftext),
            keywords: this.extractKeywords(postData.title + ' ' + postData.selftext),
            createdAt: new Date(postData.created_utc * 1000)
          });
        }
      }

      return signals;
    } catch (error) {
      console.error('Error collecting Reddit signals:', error);
      return this.generateMockRedditSignals(keyword);
    }
  }

  private async collectHackerNewsSignals(keyword: string): Promise<CommunitySignalData[]> {
    try {
      // Use HN's Algolia API
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(keyword)}&tags=ask_hn&hitsPerPage=20`;
      const response = await fetch(url);

      if (!response.ok) {
        return this.generateMockHNSignals(keyword);
      }

      const data = await response.json();
      const signals: CommunitySignalData[] = [];

      for (const hit of data.hits || []) {
        signals.push({
          id: `hn_${hit.objectID}`,
          platform: 'hackernews',
          source: 'Ask HN',
          title: hit.title,
          content: hit.story_text || '',
          url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          engagement: {
            upvotes: hit.points,
            comments: hit.num_comments
          },
          sentiment: this.analyzeSentiment(hit.title + ' ' + (hit.story_text || '')),
          signalStrength: this.calculateHNSignalStrength(hit),
          extractedProblems: this.extractProblems(hit.title + ' ' + (hit.story_text || '')),
          keywords: this.extractKeywords(hit.title + ' ' + (hit.story_text || '')),
          createdAt: new Date(hit.created_at)
        });
      }

      return signals;
    } catch (error) {
      console.error('Error collecting HN signals:', error);
      return this.generateMockHNSignals(keyword);
    }
  }

  private async collectYouTubeSignals(keyword: string): Promise<CommunitySignalData[]> {
    try {
      // For now, return mock data since YouTube API requires setup
      return this.generateMockYouTubeSignals(keyword);
    } catch (error) {
      console.error('Error collecting YouTube signals:', error);
      return this.generateMockYouTubeSignals(keyword);
    }
  }

  // Helper methods
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['love', 'great', 'amazing', 'excellent', 'perfect', 'awesome', 'fantastic'];
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'worst', 'horrible', 'frustrating', 'annoying'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  private calculateRedditSignalStrength(postData: any): number {
    const upvotes = postData.ups || 0;
    const comments = postData.num_comments || 0;
    const score = Math.min(10, Math.max(1, Math.log10(upvotes + comments * 2 + 1) * 2));
    return Math.round(score);
  }

  private calculateHNSignalStrength(hit: any): number {
    const points = hit.points || 0;
    const comments = hit.num_comments || 0;
    const score = Math.min(10, Math.max(1, Math.log10(points + comments + 1) * 2.5));
    return Math.round(score);
  }

  private extractProblems(text: string): string[] {
    const problemIndicators = [
      'problem', 'issue', 'struggle', 'difficult', 'hard to', 'cant', 'impossible',
      'frustrating', 'annoying', 'waste of time', 'inefficient', 'slow', 'broken'
    ];

    const sentences = text.split(/[.!?]+/).filter(s => s.length > 10);
    return sentences.filter(sentence =>
      problemIndicators.some(indicator =>
        sentence.toLowerCase().includes(indicator)
      )
    ).slice(0, 3);
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'have', 'been', 'they', 'were', 'said'].includes(word));

    const wordCounts: Record<string, number> = {};
    words.forEach(word => wordCounts[word] = (wordCounts[word] || 0) + 1);

    return Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock data generators for when APIs aren't configured
  private generateMockRedditSignals(keyword: string): CommunitySignalData[] {
    const mockData = [
      {
        id: `reddit_mock_${Date.now()}_1`,
        platform: 'reddit',
        source: 'r/startups',
        title: `Struggling with ${keyword} - any advice?`,
        content: `I've been trying to solve this ${keyword} problem for months. Current solutions are either too expensive or don't work well. Anyone else facing this?`,
        url: 'https://reddit.com/r/startups/mock1',
        engagement: { upvotes: 47, comments: 23 },
        sentiment: 'negative' as const,
        signalStrength: 7,
        extractedProblems: [`Expensive solutions for ${keyword}`, `Current tools don't work well`],
        keywords: [keyword, 'expensive', 'solutions', 'problem'],
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: `reddit_mock_${Date.now()}_2`,
        platform: 'reddit',
        source: 'r/entrepreneur',
        title: `Market opportunity in ${keyword}?`,
        content: `Seeing a lot of discussion around ${keyword} lately. Seems like there's a gap in the market. Thoughts?`,
        url: 'https://reddit.com/r/entrepreneur/mock2',
        engagement: { upvotes: 31, comments: 15 },
        sentiment: 'positive' as const,
        signalStrength: 6,
        extractedProblems: [`Gap in ${keyword} market`],
        keywords: [keyword, 'market', 'opportunity', 'gap'],
        createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
      }
    ];

    return mockData;
  }

  private generateMockHNSignals(keyword: string): CommunitySignalData[] {
    return [
      {
        id: `hn_mock_${Date.now()}_1`,
        platform: 'hackernews',
        source: 'Ask HN',
        title: `Ask HN: Best practices for ${keyword}?`,
        content: `I'm building a product that needs to handle ${keyword} efficiently. What are the current best practices?`,
        url: 'https://news.ycombinator.com/item?id=mock1',
        engagement: { upvotes: 89, comments: 34 },
        sentiment: 'neutral' as const,
        signalStrength: 8,
        extractedProblems: [`Need efficient ${keyword} handling`],
        keywords: [keyword, 'practices', 'efficient', 'product'],
        createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  private generateMockYouTubeSignals(keyword: string): CommunitySignalData[] {
    return [
      {
        id: `youtube_mock_${Date.now()}_1`,
        platform: 'youtube',
        source: 'Tech Review Channel',
        title: `Why ${keyword} tools are failing users in 2024`,
        content: `Analysis of current ${keyword} solutions and why they're not meeting user needs`,
        url: 'https://youtube.com/watch?v=mock1',
        engagement: { views: 15420, comments: 89, likes: 234 },
        sentiment: 'negative' as const,
        signalStrength: 9,
        extractedProblems: [`${keyword} tools failing users`, `Not meeting user needs`],
        keywords: [keyword, 'tools', 'failing', 'users'],
        createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000)
      }
    ];
  }
}