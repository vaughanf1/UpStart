-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ideas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "problem" TEXT,
    "solution" TEXT,
    "targetMarket" TEXT,
    "revenueModel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analyses" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "opportunityScore" INTEGER NOT NULL,
    "problemScore" INTEGER NOT NULL,
    "feasibilityScore" INTEGER NOT NULL,
    "timingScore" INTEGER NOT NULL,
    "revenueRange" TEXT,
    "executionDifficulty" INTEGER,
    "marketSize" BIGINT,
    "competitionLevel" TEXT,
    "analysisData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."keywords" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "searchVolume" INTEGER,
    "competition" TEXT,
    "growthRate" DOUBLE PRECISION,
    "trendData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_signals" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "communityName" TEXT NOT NULL,
    "memberCount" INTEGER,
    "engagementScore" INTEGER,
    "signalStrength" INTEGER,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."ideas" ADD CONSTRAINT "ideas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analyses" ADD CONSTRAINT "analyses_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."keywords" ADD CONSTRAINT "keywords_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_signals" ADD CONSTRAINT "community_signals_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
