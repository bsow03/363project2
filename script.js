// script.js

// Global variable to store the currently selected team
let currentTeam = null;

// Theme toggle functionality
function setTheme(mode) {
  document.body.className = mode;
  localStorage.setItem("theme", mode);
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const currentTheme = document.body.className;
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  // Reapply team colors if a team is loaded
  if (currentTeam) applyTeamColors(currentTeam);
});

window.addEventListener("DOMContentLoaded", async () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  const team = await fetchRandomNBATeam();
  if (team) {
    console.log(team);  // <-- Log the team object to verify its structure
    currentTeam = team;
    console.log("Team object:", team);
    fetchConferenceStandings(team.leagues?.standard?.conference.toLowerCase());
  }
});

const teamColors = {
  ATL: { primary: "#E03A3E", secondary: "#C1D32F" }, // Atlanta Hawks
  BOS: { primary: "#007A33", secondary: "#BA9653" }, // Boston Celtics
  BKN: { primary: "#000000", secondary: "#FFFFFF" }, // Brooklyn Nets
  CHA: { primary: "#1D1160", secondary: "#00788C" }, // Charlotte Hornets
  CHI: { primary: "#CE1141", secondary: "#000000" }, // Chicago Bulls
  CLE: { primary: "#6F263D", secondary: "#FFB81C" }, // Cleveland Cavaliers
  DAL: { primary: "#00538C", secondary: "#B8C4CA" }, // Dallas Mavericks
  DEN: { primary: "#0E2240", secondary: "#FEC524" }, // Denver Nuggets
  DET: { primary: "#C8102E", secondary: "#1D42BA" }, // Detroit Pistons
  GSW: { primary: "#1D428A", secondary: "#FFC72C" }, // Golden State Warriors
  HOU: { primary: "#CE1141", secondary: "#C4CED4" }, // Houston Rockets
  IND: { primary: "#002D62", secondary: "#FDBB30" }, // Indiana Pacers
  LAC: { primary: "#C8102E", secondary: "#1D428A" }, // Los Angeles Clippers
  LAL: { primary: "#552583", secondary: "#FDB927" }, // Los Angeles Lakers
  MEM: { primary: "#5D76A9", secondary: "#12173F" }, // Memphis Grizzlies
  MIA: { primary: "#98002E", secondary: "#F9A01B" }, // Miami Heat
  MIL: { primary: "#00471B", secondary: "#EEE1C6" }, // Milwaukee Bucks
  MIN: { primary: "#0C2340", secondary: "#236192" }, // Minnesota Timberwolves
  NOP: { primary: "#0C2340", secondary: "#C8102E" }, // New Orleans Pelicans
  NYK: { primary: "#006BB6", secondary: "#F58426" }, // New York Knicks
  OKC: { primary: "#007AC1", secondary: "#EF3B24" }, // Oklahoma City Thunder
  ORL: { primary: "#0077C0", secondary: "#C4CED4" }, // Orlando Magic
  PHI: { primary: "#006BB6", secondary: "#ED174C" }, // Philadelphia 76ers
  PHX: { primary: "#1D1160", secondary: "#E56020" }, // Phoenix Suns
  POR: { primary: "#E03A3E", secondary: "#000000" }, // Portland Trail Blazers
  SAC: { primary: "#5A2D81", secondary: "#63727A" }, // Sacramento Kings
  SAS: { primary: "#C4CED4", secondary: "#000000" }, // San Antonio Spurs
  TOR: { primary: "#CE1141", secondary: "#000000" }, // Toronto Raptors
  UTA: { primary: "#002B5C", secondary: "#F9A01B" }, // Utah Jazz
  WAS: { primary: "#002B5C", secondary: "#E31837" }  // Washington Wizards
};

// Apply team colors (using the team's primary and secondary colors) 
function applyTeamColors(team) {
  // Log to check if team code is passed correctly
  console.log('Team received:', team);

  // Use the predefined teamColors object to get the team's colors based on the team code
  const colors = teamColors[team.code];

  // Check if the colors exist for the given team code
  if (!colors) {
    console.log(`Error: No colors found for team code: ${team.code}`);
    return;  // Exit if team code is not found in teamColors
  }

  // Apply colors
  const primaryColor = colors.primary;
  const secondaryColor = colors.secondary;

  // Apply background and text color based on theme
  if (document.body.classList.contains('dark')) {
    document.body.style.backgroundColor = secondaryColor;
    document.body.style.color = primaryColor;
  } else {
    document.body.style.backgroundColor = primaryColor;
    document.body.style.color = secondaryColor;
  }

  // Update the theme toggle button color
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.style.color = secondaryColor;
  })
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.style.color = secondaryColor;
  });
}

// Example API response (team data)
const apiTeamData = {
  code: 'ATL', // This is the team code returned from your API (Example: Atlanta Hawks)
  name: 'Atlanta Hawks'
};

// Call applyTeamColors with the API data
applyTeamColors(apiTeamData);


// Fetch random NBA team (only Standard league teams)
async function fetchRandomNBATeam() {
    try {
      const url = 'https://api-nba-v1.p.rapidapi.com/teams?league=standard';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '93a6c5ee91mshfc5756cc0394122p17b5f3jsnfa34b39525f9',
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
      };
  
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
  
      if (!data.response || data.response.length === 0) {
        throw new Error('No teams found in API response');
      }

      console.log(data.response.filter(team => team.nbaFranchise === true && team.id !== 37)) //nba teams filter
  
      // Filter out non-NBA teams: only keep teams with nbaFranchise === true
      const nbaTeams = data.response.filter(team => team.nbaFranchise === true && team.id !== 37);
      const nbaEast = data.response.filter(team => team.nbaFranchise === true && team.id !== 37 && team.conference == "East");
      const nbaWest = data.response.filter(team => team.nbaFranchise === true && team.id !== 37 && team.conference == "West");
      if (nbaTeams.length === 0) throw new Error('No NBA teams found');
  
      // Pick a random team from the filtered list
      const team = nbaTeams[Math.floor(Math.random() * nbaTeams.length)];
      const Eastteam = nbaEast[Math.floor(Math.random() * nbaTeams.length)];
      const Westteam = nbaWest[Math.floor(Math.random() * nbaTeams.length)];
      console.log('Random NBA Team:', team);
  
      // Use a fallback image if the logo is null
      const logoUrl = team.logo; // Make sure you have a default image at this path
  
      document.getElementById("teamLogo").src = logoUrl;
      // Use team.name to display team name and team code to display team initials
      document.getElementById("teamName").innerText = team.name + " (" + team.code + ")";
      fetchStandings(team.id); // Call the standings fetcher
      applyTeamColors(team);
      fetchTeamHighlights(team.name);
        // Event listener for East and West links
      document.getElementById('eastLink').addEventListener('click', () => {
        const randomEastTeam = getRandomTeam(eastTeams);
        console.log(randomEastTeam.name);  // Display team name or update UI
      });

      document.getElementById('westLink').addEventListener('click', () => {
        const randomWestTeam = getRandomTeam(westTeams);
        console.log(randomWestTeam.name);  // Display team name or update UI
      });

      return team;
    } catch (error) {
      console.error("Team fetch error:", error);
    }
  }
async function fetchStandings(teamId) {
    try {
      const url = 'https://api-nba-v1.p.rapidapi.com/standings?season=2024&league=standard';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '93a6c5ee91mshfc5756cc0394122p17b5f3jsnfa34b39525f9',
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
      };
  
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Network response was not ok");
  
      const data = await response.json();
      console.log("Standings response:", data);
  
      const standing = data.response.find(entry => entry.team.id === teamId);
      console.log("Matched standing:", standing);
  
      if (standing) {
        // Get rank and suffix
        const rank = standing.conference?.rank ?? "N/A";
        const conferenceName = standing.conference?.name ?? "Unknown";
  
        let suffix = "th";
        if (rank == 1) suffix = "st";
        else if (rank == 2) suffix = "nd";
        else if (rank == 3) suffix = "rd";
  
        // Display conference rank
        document.getElementById("teamStanding").innerText =
          `Conference Rank: ${rank}${suffix} in the ${conferenceName[0].toUpperCase() + conferenceName.slice(1)}ern Conference`;
  
        // Display record
        const totalWins = standing.win?.total ?? "N/A";
        const totalLosses = standing.loss?.total ?? "N/A";
        const winPct = parseFloat(standing.win?.percentage ?? 0);
  
        document.getElementById("teamRecord").innerText =
          `Record: ${totalWins}-${totalLosses} (${(winPct * 100).toFixed(1)}%)`;
  
      } else {
        document.getElementById("teamStanding").innerText = "Conference Rank: Not found";
        document.getElementById("teamRecord").innerText = "Record: Not found";
      }
  
    } catch (error) {
      console.error("Standings fetch error:", error);
      document.getElementById("teamStanding").innerText = "Standing: Error";
      document.getElementById("teamRecord").innerText = "Record: Error";
    }
  }  

async function fetchConferenceStandings(conference, season = 2024) {
    try {
      const url = 'https://api-nba-v1.p.rapidapi.com/standings?season=2024&league=standard';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '93a6c5ee91mshfc5756cc0394122p17b5f3jsnfa34b39525f9',
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
      };
  
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch standings");
  
      const data = await response.json();
      const teams = data.response.filter(team => team.conference.name.toLowerCase() === conference);
  
      // Update the <h3> title dynamically
      const titleElement = document.querySelector("#conferenceStandings h3");
      titleElement.textContent = `${conference[0].toUpperCase() + conference.slice(1)}ern Conference Standings`;
  
      // Sort by conference rank
      teams.sort((a, b) => a.conference.rank - b.conference.rank);
  
      const standingsDiv = document.getElementById("standingsInfo");
      standingsDiv.innerHTML = `
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Win %</th>
            </tr>
          </thead>
          <tbody>
            ${teams.map(team => {
              const isCurrent = currentTeam && team.team.id === currentTeam.id;
              return `
                <tr class="${isCurrent ? 'highlighted-row' : ''}">
                  <td>${team.conference.rank}</td>
                  <td>${team.team.name}</td>
                  <td>${team.win.total}</td>
                  <td>${team.loss.total}</td>
                  <td>${(parseFloat(team.win.percentage) * 100).toFixed(1)}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      console.error('Error fetching conference standings:', error);
    }
  }

const YOUTUBE_API_KEY = 'AIzaSyBN-fMWjkv4D4J3mreoQkb32oFqpo-3iCA';

async function fetchTeamHighlights(teamName) {
  try {
    const query = `nba ${teamName} highlights`
    const maxResults = 3;
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&videoEmbeddable=true&maxResults=${maxResults}&q=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Youtube API request failed");

    const data = await response.json();
    displayTeamHighlights(data.items);
  } catch (error) {
    console.error("Youtube fetch error", error);
  }
}

function displayTeamHighlights(videos) {
  const highlightsContainer = document.getElementById("teamHighlights");
  highlightsContainer.innerHTML = ""; // Clear previous videos

  videos.forEach(video => {
    const videoId = video.id.videoId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.width = "100%";
    iframe.height = "200";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    // Remove any extra JS-based styling; Bulma will handle responsiveness via classes

    // Wrap the iframe in a div for the 16-by-9 ratio using Bulma's .video class
    const iframeWrapper = document.createElement("div");
    iframeWrapper.className = "video is-16by9";
    iframeWrapper.appendChild(iframe);

    // Create a column wrapper for responsive layout (mobile: full width, tablet: half, desktop: one-third)
    const column = document.createElement("div");
    column.className = "column is-12-mobile is-6-tablet is-4-desktop";

    column.appendChild(iframeWrapper);
    highlightsContainer.appendChild(column);
  });
}


