const axios = require('axios');
const fs = require('fs');

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';
const LEETCODE_USERNAME = 'Kashyap_patel26';

async function fetchLeetCodeStats() {
  const query = `
    query userProblemsSolved($username: String!) {
      allQuestionsCount { difficulty count }
      matchedUser(username: $username) {
        submitStats { acSubmissionNum { difficulty count } }
        submissionCalendar
      }
    }
  `;

  const response = await axios.post(LEETCODE_API_ENDPOINT, {
    query,
    variables: { username: LEETCODE_USERNAME }
  });

  return response.data.data;
}

function generateMarkdown(data) {
  const { allQuestionsCount, matchedUser } = data;
  const { submitStats, submissionCalendar } = matchedUser;

  let markdown = '';

  // Overall stats
  const totalSolved = submitStats.acSubmissionNum.reduce((sum, { count }) => sum + count, 0);
  const totalQuestions = allQuestionsCount.reduce((sum, { count }) => sum + count, 0);
  markdown += `Total solved: ${totalSolved} / ${totalQuestions}\n\n`;

  // Problem solving progress
  markdown += '| Difficulty | Solved | Total | Percentage |\n';
  markdown += '|------------|--------|-------|------------|\n';
  ['Easy', 'Medium', 'Hard'].forEach(difficulty => {
    const solved = submitStats.acSubmissionNum.find(stat => stat.difficulty === difficulty).count;
    const total = allQuestionsCount.find(stat => stat.difficulty === difficulty).count;
    const percentage = ((solved / total) * 100).toFixed(2);
    markdown += `| ${difficulty} | ${solved} | ${total} | ${percentage}% |\n`;
  });

  // Recent submissions
  const calendar = JSON.parse(submissionCalendar);
  const recentDays = Object.entries(calendar)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 7);

  markdown += '\n## Recent Activity\n\n';
  recentDays.forEach(([timestamp, count]) => {
    const date = new Date(timestamp * 1000).toISOString().split('T')[0];
    markdown += `${date}: ${count} submission${count > 1 ? 's' : ''}\n`;
  });

  return markdown;
}

async function updateReadme() {
  const stats = await fetchLeetCodeStats();
  const newContent = generateMarkdown(stats);

  let readme = fs.readFileSync('README.md', 'utf8');
  readme = readme.replace(
    /<!-- LEETCODE_STATS:START -->[\s\S]*<!-- LEETCODE_STATS:END -->/,
    `<!-- LEETCODE_STATS:START -->\n${newContent}\n<!-- LEETCODE_STATS:END -->`
  );

  fs.writeFileSync('README.md', readme);
}

updateReadme();
