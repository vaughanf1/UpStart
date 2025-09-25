import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const startupIdeas = [
  {
    title: "AI-Powered Code Review Assistant",
    description: "An AI assistant that automatically reviews code commits, identifies bugs, security vulnerabilities, and suggests improvements. Integrates with GitHub, GitLab, and other version control systems to provide real-time feedback.",
    problem: "Manual code reviews are time-consuming, inconsistent, and often miss critical issues. Development teams struggle to maintain code quality while meeting tight deadlines.",
    solution: "AI-powered analysis of code changes with contextual suggestions, automated security scanning, and integration with existing developer workflows.",
    targetMarket: "Software development teams, DevOps engineers, and technology companies",
    revenueModel: "SaaS subscription per developer seat"
  },
  {
    title: "Smart Home Energy Optimization Platform",
    description: "IoT-based platform that learns household energy consumption patterns and automatically adjusts smart devices to minimize energy costs while maintaining comfort preferences.",
    problem: "Rising energy costs and inefficient home energy usage lead to high utility bills. Homeowners lack visibility into energy consumption patterns.",
    solution: "Machine learning algorithms analyze usage patterns and automatically optimize heating, cooling, and appliance usage for maximum efficiency.",
    targetMarket: "Smart home owners, energy-conscious consumers, and property managers",
    revenueModel: "Monthly subscription plus hardware sales"
  },
  {
    title: "Micro-Learning Platform for Professional Skills",
    description: "Mobile-first learning platform delivering 5-minute skill-building modules during commute time, break periods, or downtime. AI personalizes content based on career goals.",
    problem: "Professionals struggle to find time for skill development. Traditional courses are too long and don't fit into busy schedules.",
    solution: "Bite-sized, personalized learning modules that adapt to individual schedules and learning preferences.",
    targetMarket: "Working professionals, career changers, and corporate training departments",
    revenueModel: "Freemium model with premium subscriptions"
  },
  {
    title: "Local Food Waste Marketplace",
    description: "Platform connecting restaurants, grocery stores, and food producers with consumers to sell surplus food at discounted prices before it expires.",
    problem: "40% of food is wasted while millions face food insecurity. Businesses lose money on unsold inventory.",
    solution: "Real-time marketplace for discounted surplus food with pickup scheduling and inventory management.",
    targetMarket: "Budget-conscious consumers, restaurants, grocery stores, and food producers",
    revenueModel: "Commission on transactions plus subscription for businesses"
  },
  {
    title: "AI Mental Health Companion",
    description: "AI-powered mental health app providing 24/7 emotional support, mood tracking, personalized coping strategies, and crisis intervention with human therapist backup.",
    problem: "Mental health support is expensive, has long wait times, and isn't available when people need it most. Stigma prevents many from seeking help.",
    solution: "Accessible, private AI companion with evidence-based therapeutic techniques and seamless human therapist integration.",
    targetMarket: "Individuals seeking mental health support, employees, and healthcare systems",
    revenueModel: "Subscription model with insurance billing options"
  },
  {
    title: "Carbon Footprint Tracking & Offsetting App",
    description: "Personal carbon footprint tracker that monitors daily activities, purchases, and travel to calculate environmental impact and facilitate carbon offsetting.",
    problem: "People want to reduce their environmental impact but lack awareness of their carbon footprint and actionable steps to improve.",
    solution: "Automated tracking through bank transactions and smartphone sensors with personalized reduction recommendations.",
    targetMarket: "Environmentally conscious consumers, corporations, and sustainability-focused organizations",
    revenueModel: "Freemium with premium features and carbon offset marketplace commissions"
  },
  {
    title: "Virtual Reality Fitness Platform",
    description: "VR fitness platform offering immersive workout experiences in exotic locations with AI personal trainers and social multiplayer fitness challenges.",
    problem: "Traditional fitness routines become boring, leading to poor adherence. Gym memberships are expensive and time-consuming.",
    solution: "Gamified VR workouts that make exercise engaging while tracking real fitness metrics and progress.",
    targetMarket: "Fitness enthusiasts, VR adopters, and people seeking convenient home workouts",
    revenueModel: "Monthly subscription plus VR hardware partnerships"
  },
  {
    title: "Senior Care Coordination Platform",
    description: "Digital platform coordinating care for elderly individuals, connecting family members, caregivers, healthcare providers, and service providers.",
    problem: "Families struggle to coordinate care for aging parents. Communication gaps lead to medical errors and reduced quality of life.",
    solution: "Centralized care management with medication reminders, appointment scheduling, and family communication tools.",
    targetMarket: "Adult children of aging parents, senior care facilities, and healthcare providers",
    revenueModel: "Monthly subscription per senior with premium family features"
  },
  {
    title: "AI-Powered Personal Finance Coach",
    description: "AI financial advisor providing personalized budgeting, investment advice, debt management, and financial goal planning based on individual spending patterns.",
    problem: "Financial advisors are expensive and not accessible to average consumers. People struggle with budgeting and making informed financial decisions.",
    solution: "AI-driven personalized financial advice with automated savings, investment recommendations, and spending insights.",
    targetMarket: "Young professionals, middle-class families, and financially underserved populations",
    revenueModel: "Freemium model with premium advisory services"
  },
  {
    title: "Sustainable Fashion Rental Platform",
    description: "Clothing rental service for special occasions and everyday wear, focusing on sustainable fashion brands with cleaning and maintenance included.",
    problem: "Fast fashion contributes to environmental damage. People buy expensive clothes they rarely wear, especially for special events.",
    solution: "High-quality fashion rental with sustainable brands, professional cleaning, and convenient delivery/pickup services.",
    targetMarket: "Fashion-conscious millennials, special event attendees, and sustainability advocates",
    revenueModel: "Rental fees plus subscription for unlimited access"
  },
  {
    title: "Remote Work Productivity Analytics",
    description: "Analytics platform helping remote teams and individuals optimize productivity by tracking work patterns, identifying distractions, and suggesting improvements.",
    problem: "Remote workers struggle with productivity, work-life balance, and managers lack visibility into team performance and wellbeing.",
    solution: "Privacy-first analytics dashboard with personalized productivity insights and team collaboration metrics.",
    targetMarket: "Remote workers, distributed teams, and HR departments",
    revenueModel: "SaaS subscription per user with enterprise features"
  },
  {
    title: "AI-Powered Pet Health Monitor",
    description: "Smart collar and app that monitors pet health metrics, detects early signs of illness, and provides veterinary recommendations and telemedicine consultations.",
    problem: "Pet owners struggle to detect health issues early, leading to expensive emergency treatments. Veterinary care is costly and often reactive.",
    solution: "Continuous health monitoring with AI-powered illness detection and preventive care recommendations.",
    targetMarket: "Pet owners, veterinary clinics, and pet insurance companies",
    revenueModel: "Hardware sales plus subscription for health monitoring and telemedicine"
  },
  {
    title: "Hyper-Local Weather Prediction Service",
    description: "AI-powered weather service providing street-level weather predictions using IoT sensors, satellite data, and machine learning for precise local forecasts.",
    problem: "Current weather services lack precision for local conditions, affecting outdoor activities, agriculture, and logistics planning.",
    solution: "Hyper-local weather intelligence with IoT sensor networks and advanced prediction algorithms.",
    targetMarket: "Agricultural businesses, logistics companies, event planners, and outdoor enthusiasts",
    revenueModel: "API subscriptions and premium forecast features"
  },
  {
    title: "Virtual Interior Design Consultation",
    description: "AR-powered interior design app allowing users to visualize furniture and decor in their space with AI design recommendations and professional designer consultations.",
    problem: "Interior design services are expensive and inaccessible. People struggle to visualize how furniture will look in their space before purchasing.",
    solution: "AR visualization with AI design suggestions and on-demand professional consultations at affordable prices.",
    targetMarket: "Homeowners, renters, real estate agents, and furniture retailers",
    revenueModel: "Freemium app with consultation fees and furniture affiliate commissions"
  },
  {
    title: "Automated Legal Document Generator",
    description: "AI-powered platform generating legal documents like contracts, wills, and business formation papers with lawyer review options for complex cases.",
    problem: "Legal services are expensive and time-consuming for routine documents. Small businesses and individuals delay important legal tasks due to cost.",
    solution: "Automated document generation with plain-language guidance and optional professional review.",
    targetMarket: "Small businesses, entrepreneurs, individuals, and legal professionals",
    revenueModel: "Per-document pricing with subscription for unlimited access"
  },
  {
    title: "Personalized Nutrition Planning AI",
    description: "AI nutritionist that creates personalized meal plans based on health goals, dietary restrictions, genetic data, and food preferences with grocery integration.",
    problem: "Generic nutrition advice doesn't account for individual differences. People struggle to maintain healthy eating habits without personalized guidance.",
    solution: "AI-powered nutrition planning with genetic analysis, health tracking, and automated grocery ordering.",
    targetMarket: "Health-conscious individuals, people with dietary restrictions, and wellness programs",
    revenueModel: "Monthly subscription with premium genetic testing add-on"
  },
  {
    title: "Smart Parking Solution for Urban Areas",
    description: "IoT-based parking management system using sensors to track space availability, dynamic pricing, and mobile app for reservation and payment.",
    problem: "Urban parking is inefficient, causes traffic congestion, and frustrates drivers. Cities lose revenue from poor parking management.",
    solution: "Real-time parking availability with dynamic pricing and seamless mobile payment integration.",
    targetMarket: "City governments, parking authorities, commercial properties, and urban drivers",
    revenueModel: "SaaS licensing to cities plus transaction fees"
  },
  {
    title: "AI-Powered Recruitment Matching",
    description: "Recruitment platform using AI to match candidates with job opportunities based on skills, personality, culture fit, and career trajectory predictions.",
    problem: "Traditional recruiting is biased, time-consuming, and ineffective. Good candidates are overlooked while poor matches waste company resources.",
    solution: "AI-driven matching with bias reduction, personality assessment, and predictive success scoring.",
    targetMarket: "HR departments, recruiting agencies, job seekers, and growing companies",
    revenueModel: "Subscription for recruiters plus success-based fees"
  },
  {
    title: "Elderly Medication Management System",
    description: "Smart pillbox with app integration providing medication reminders, dosage tracking, family notifications, and pharmacy coordination.",
    problem: "Medication non-adherence among elderly leads to hospitalizations and health complications. Families worry about proper medication management.",
    solution: "Automated medication dispensing with smart reminders, adherence tracking, and caregiver alerts.",
    targetMarket: "Elderly individuals, adult children of aging parents, and healthcare providers",
    revenueModel: "Hardware sales plus monthly subscription for monitoring and coordination"
  },
  {
    title: "Sustainable Supply Chain Tracker",
    description: "Blockchain-based platform tracking products from source to consumer, verifying sustainability claims and providing transparency for conscious consumers.",
    problem: "Consumers can't verify sustainability claims. Companies lack visibility into their supply chain's environmental and social impact.",
    solution: "Transparent supply chain tracking with verified sustainability metrics and consumer-facing transparency tools.",
    targetMarket: "Conscious consumers, sustainable brands, and retail companies",
    revenueModel: "SaaS subscription for brands plus consumer app with premium features"
  },
  {
    title: "AI-Powered Language Learning Tutor",
    description: "Personalized language learning app using AI to adapt to individual learning styles, provide conversational practice, and track progress with real-time feedback.",
    problem: "Language learning apps are generic and boring. Traditional tutoring is expensive and scheduling is difficult.",
    solution: "AI tutor providing personalized lessons, conversation practice, and cultural context with engaging gamification.",
    targetMarket: "Language learners, business professionals, students, and immigrants",
    revenueModel: "Freemium model with premium AI tutoring features"
  },
  {
    title: "Smart Agriculture Monitoring Platform",
    description: "IoT platform for farmers using sensors to monitor soil conditions, weather, crop health, and pest activity with AI-powered farming recommendations.",
    problem: "Traditional farming relies on guesswork and experience. Climate change and resource scarcity require more precise agricultural methods.",
    solution: "Data-driven farming with IoT sensors, satellite imagery, and AI recommendations for optimal crop management.",
    targetMarket: "Farmers, agricultural cooperatives, and agribusiness companies",
    revenueModel: "Hardware sales plus SaaS subscription for analytics and recommendations"
  },
  {
    title: "Virtual Event Networking Platform",
    description: "AI-powered networking platform for virtual events that matches attendees based on interests, facilitates meaningful connections, and tracks relationship building.",
    problem: "Virtual events lack meaningful networking opportunities. Attendees struggle to make valuable professional connections online.",
    solution: "Smart attendee matching with facilitated introductions, interest-based grouping, and follow-up relationship tracking.",
    targetMarket: "Event organizers, professional associations, and conference attendees",
    revenueModel: "Per-event licensing plus premium networking features"
  },
  {
    title: "Personalized Sleep Optimization Service",
    description: "Sleep optimization platform using wearable data, environmental sensors, and AI to provide personalized recommendations for better sleep quality.",
    problem: "Sleep disorders affect millions but solutions are generic. People struggle to identify factors affecting their sleep quality.",
    solution: "Comprehensive sleep analysis with personalized optimization recommendations and environmental control integration.",
    targetMarket: "Sleep-deprived individuals, health-conscious consumers, and wellness programs",
    revenueModel: "Monthly subscription with premium coaching and hardware partnerships"
  },
  {
    title: "AI-Driven Customer Service Automation",
    description: "AI customer service platform that handles complex inquiries, learns from interactions, and seamlessly escalates to humans when needed.",
    problem: "Customer service is expensive to scale and often provides inconsistent experiences. Customers want quick resolution but companies need cost control.",
    solution: "Advanced AI that handles complex queries with natural language processing and seamless human handoff.",
    targetMarket: "E-commerce businesses, SaaS companies, and service providers",
    revenueModel: "SaaS subscription based on interaction volume"
  },
  {
    title: "Freelancer Skill Verification Platform",
    description: "Platform providing verified skill assessments and portfolios for freelancers, helping clients hire with confidence and freelancers showcase abilities.",
    problem: "Clients struggle to verify freelancer skills before hiring, leading to poor project outcomes. Freelancers have difficulty proving their expertise.",
    solution: "Comprehensive skill testing with verified portfolios, client reviews, and performance tracking.",
    targetMarket: "Freelancers, hiring companies, and project managers",
    revenueModel: "Certification fees plus premium profile features"
  },
  {
    title: "Smart Water Management System",
    description: "IoT-based water monitoring and conservation system for homes and businesses, detecting leaks, optimizing usage, and reducing waste.",
    problem: "Water waste is costly and environmentally damaging. Leaks often go undetected until significant damage occurs.",
    solution: "Smart water monitoring with leak detection, usage optimization, and conservation recommendations.",
    targetMarket: "Homeowners, property managers, and municipalities",
    revenueModel: "Hardware sales plus subscription for monitoring and alerts"
  },
  {
    title: "Virtual Reality Therapy Platform",
    description: "VR therapy platform for treating phobias, PTSD, anxiety, and other mental health conditions with guided exposure therapy and relaxation exercises.",
    problem: "Traditional therapy is expensive and not always accessible. Some conditions benefit from controlled exposure that's difficult to achieve in office settings.",
    solution: "Immersive VR therapy with licensed therapist guidance and progress tracking for various mental health conditions.",
    targetMarket: "Mental health professionals, healthcare systems, and individuals seeking therapy",
    revenueModel: "Software licensing to therapists plus direct-to-consumer subscriptions"
  },
  {
    title: "AI-Powered Investment Research",
    description: "AI platform analyzing market data, news, financial reports, and social sentiment to provide investment research and portfolio recommendations.",
    problem: "Investment research is time-consuming and expensive. Individual investors lack access to professional-grade analysis and insights.",
    solution: "AI-powered analysis of multiple data sources providing actionable investment insights and risk assessment.",
    targetMarket: "Individual investors, financial advisors, and investment firms",
    revenueModel: "Subscription tiers based on features and data access"
  },
  {
    title: "Smart Waste Management Solution",
    description: "IoT-enabled waste bins with sensors monitoring fill levels, optimizing collection routes, and providing analytics for waste reduction strategies.",
    problem: "Waste collection is inefficient with fixed schedules. Cities overspend on unnecessary collections while some bins overflow.",
    solution: "Smart waste monitoring with optimized collection routing and waste reduction analytics.",
    targetMarket: "Municipalities, waste management companies, and commercial properties",
    revenueModel: "Hardware leasing plus SaaS subscription for route optimization"
  },
  {
    title: "Personalized Learning Path Generator",
    description: "AI platform creating customized learning paths for students based on learning style, pace, knowledge gaps, and career goals with adaptive content.",
    problem: "One-size-fits-all education doesn't accommodate different learning styles and paces. Students struggle with standardized curricula.",
    solution: "Adaptive learning platform with personalized content delivery and progress tracking.",
    targetMarket: "Students, educational institutions, and corporate training programs",
    revenueModel: "Subscription for institutions plus premium features for individuals"
  },
  {
    title: "AI-Enhanced Video Editing Assistant",
    description: "AI-powered video editing tool that automatically cuts, enhances, and optimizes videos for different platforms with style transfer and content analysis.",
    problem: "Video editing is time-consuming and requires technical skills. Content creators need platform-specific optimization for maximum engagement.",
    solution: "Automated video editing with AI-powered style transfer, platform optimization, and content enhancement.",
    targetMarket: "Content creators, marketing agencies, and small businesses",
    revenueModel: "Freemium model with usage-based pricing for advanced features"
  },
  {
    title: "Smart Building Energy Management",
    description: "AI-powered building management system optimizing energy consumption, predicting maintenance needs, and improving occupant comfort in commercial buildings.",
    problem: "Commercial buildings waste energy due to inefficient systems and lack of optimization. Maintenance is reactive rather than predictive.",
    solution: "Intelligent building management with predictive maintenance, energy optimization, and occupant comfort automation.",
    targetMarket: "Commercial property owners, facility managers, and real estate companies",
    revenueModel: "Installation fees plus monthly SaaS subscription"
  },
  {
    title: "Digital Identity Verification Service",
    description: "Blockchain-based digital identity platform providing secure, decentralized identity verification for online services while protecting user privacy.",
    problem: "Identity verification is cumbersome, insecure, and privacy-invasive. Users have no control over their personal data.",
    solution: "Decentralized identity verification with user-controlled data sharing and blockchain security.",
    targetMarket: "Online service providers, financial institutions, and privacy-conscious users",
    revenueModel: "Per-verification fees plus premium enterprise features"
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@upstart.com' },
    update: {},
    create: {
      email: 'demo@upstart.com',
      name: 'UpStart Team',
    },
  });

  console.log('👤 Demo user created');

  // Create all startup ideas
  for (const [index, ideaData] of startupIdeas.entries()) {
    console.log(`📝 Creating idea ${index + 1}/34: ${ideaData.title}`);

    const idea = await prisma.idea.create({
      data: {
        ...ideaData,
        userId: demoUser.id,
        status: 'published',
      },
    });

    // Add some sample keywords for each idea
    const keywords = extractKeywords(ideaData.description, ideaData.title);
    for (const keyword of keywords) {
      await prisma.keyword.create({
        data: {
          ideaId: idea.id,
          keyword: keyword,
          searchVolume: Math.floor(Math.random() * 10000) + 1000,
          competition: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
          growthRate: (Math.random() - 0.5) * 100, // -50% to +50%
        },
      });
    }

    // Add sample community signals
    const platforms = ['reddit', 'twitter', 'linkedin', 'discord'];
    for (const platform of platforms.slice(0, 2)) { // Add 2 platforms per idea
      await prisma.communitySignal.create({
        data: {
          ideaId: idea.id,
          platform: platform,
          communityName: `${keywords[0]}${Math.floor(Math.random() * 100)}`,
          memberCount: Math.floor(Math.random() * 100000) + 1000,
          engagementScore: Math.floor(Math.random() * 10) + 1,
          signalStrength: Math.floor(Math.random() * 10) + 1,
          sourceUrl: `https://${platform}.com/r/${keywords[0]}`,
        },
      });
    }
  }

  console.log('🎉 Database seeded with 34 startup ideas');
  console.log('📊 Added keywords and community signals for all ideas');
}

function extractKeywords(description: string, title: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'cannot', 'using', 'that', 'this', 'these', 'those', 'from', 'into', 'over', 'under', 'above', 'below'];

  const words = text
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));

  // Get unique words and return top 5
  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, 5);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });