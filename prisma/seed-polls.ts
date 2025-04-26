import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed polls...');

  // Find an admin user to associate with the polls
  const admin = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (!admin) {
    console.error('No admin user found. Please create an admin user first.');
    return;
  }

  console.log(`Using admin user: ${admin.email} (${admin.name || 'Unnamed'})`);

  // Define poll topics relevant to Nepal's governance
  const pollTopics = [
    {
      title: "Digital Identity Integration",
      description: "Should Nepal integrate digital identity with public services for improved access?"
    },
    {
      title: "Provincial Governance Structure",
      description: "Do you support the current 7-province governance structure implemented after the 2015 constitution?"
    },
    {
      title: "Renewable Energy Investment",
      description: "Should the government increase investment in renewable energy sources like solar and hydropower?"
    },
    {
      title: "Road Infrastructure Improvement",
      description: "Should priority be given to improving existing roads versus building new highway connections?"
    },
    {
      title: "Educational Curriculum Reform",
      description: "Do you support updating school curricula to include more technology and practical skills?"
    },
    {
      title: "Healthcare Access in Rural Areas",
      description: "Should mobile healthcare units be deployed to improve healthcare access in remote regions?"
    },
    {
      title: "Tourism Tax Allocation",
      description: "Should a higher percentage of tourism taxes be allocated directly to local communities?"
    },
    {
      title: "Digital Voting Systems",
      description: "Would you support a gradual transition to digital voting systems for national elections?"
    },
    {
      title: "Public Transportation Expansion",
      description: "Should government prioritize expanding public transportation in urban centers to reduce traffic?"
    },
    {
      title: "Land Rights Registry",
      description: "Do you support digitizing the national land registry to improve transparency and reduce disputes?"
    },
    {
      title: "Waste Management Solutions",
      description: "Should municipalities implement strict waste separation and recycling programs?"
    },
    {
      title: "Agricultural Subsidies",
      description: "Should the government increase subsidies for organic farming practices?"
    },
    {
      title: "Internet Access as Basic Right",
      description: "Should the constitution be amended to include internet access as a basic right?"
    },
    {
      title: "Local Election Frequency",
      description: "Should local elections be held more frequently than the current five-year cycle?"
    },
    {
      title: "Foreign Investment Regulations",
      description: "Should regulations on foreign investment in local businesses be relaxed?"
    },
    {
      title: "Remote Work for Government Employees",
      description: "Should government employees be allowed to work remotely when their job duties permit?"
    },
    {
      title: "Water Resource Management",
      description: "Do you agree with developing more inter-provincial water sharing agreements?"
    },
    {
      title: "Cultural Heritage Preservation",
      description: "Should a higher percentage of the national budget be allocated to preserving cultural heritage sites?"
    },
    {
      title: "Public Services Digitalization",
      description: "Do you support making all government services available online within the next five years?"
    },
    {
      title: "Air Quality Monitoring",
      description: "Should the government install air quality monitoring stations in all major urban centers?"
    }
  ];

  // Create polls with different statuses
  const statuses = ['draft', 'started', 'finished'];
  const now = new Date();

  // Delete existing polls to avoid duplicates
  await prisma.vote.deleteMany({});
  await prisma.poll.deleteMany({});
  
  console.log('Deleted existing polls and votes');

  for (let i = 0; i < 20; i++) {
    const topicIndex = i % pollTopics.length;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Create date variables based on poll status
    let startedAt = null;
    let finishedAt = null;
    let finishDuration = null;
    
    if (status === 'started' || status === 'finished') {
      // Started sometime in the past (between 1-30 days ago)
      const startDaysAgo = Math.floor(Math.random() * 30) + 1;
      startedAt = new Date(now);
      startedAt.setDate(startedAt.getDate() - startDaysAgo);
      
      if (status === 'finished') {
        // Finished polls ended between 1-10 days ago
        const endDaysAgo = Math.floor(Math.random() * 10) + 1;
        finishedAt = new Date(now);
        finishedAt.setDate(finishedAt.getDate() - endDaysAgo);
        
        // Make sure finishedAt is after startedAt
        if (startedAt && finishedAt < startedAt) {
          finishedAt = new Date(startedAt);
          finishedAt.setDate(startedAt.getDate() + 1);
        }
      } else {
        // Active polls will finish in the future (1-14 days from now)
        const finishInDays = Math.floor(Math.random() * 14) + 1;
        finishedAt = new Date(now);
        finishedAt.setDate(finishedAt.getDate() + finishInDays);
        finishDuration = finishInDays;
      }
    }

    // Create poll
    const poll = await prisma.poll.create({
      data: {
        title: pollTopics[topicIndex].title,
        description: pollTopics[topicIndex].description,
        userId: admin.id,
        status: status,
        startedAt: startedAt,
        finishedAt: finishedAt,
        finishDuration: finishDuration,
      },
    });

    // Add random votes for active and finished polls
    if (status !== 'draft') {
      const voteCount = Math.floor(Math.random() * 50) + 10; // 10-60 votes per poll
      
      // Find 'user' type accounts for votes
      const users = await prisma.user.findMany({
        where: { role: 'user' },
        take: voteCount, // Limit to the number of votes we'll create
      });
      
      if (users.length > 0) {
        for (let j = 0; j < Math.min(voteCount, users.length); j++) {
          // Create a vote with random type (positive or negative)
          await prisma.vote.create({
            data: {
              pollId: poll.id,
              userId: users[j].id,
              voteType: Math.random() > 0.5 ? 'positive' : 'negative',
            },
          });
        }
      }
    }

    console.log(`Created poll: ${poll.title} (${poll.status})`);
  }

  console.log('\nPoll seeding completed successfully!');
  console.log('-------------------------');
  console.log(`Created 20 polls from admin user: ${admin.email}`);
  console.log('Polls have a mix of draft, active, and finished statuses with appropriate votes');
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });