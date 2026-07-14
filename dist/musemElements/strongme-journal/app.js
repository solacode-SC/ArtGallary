/* StrongMe Digital Journal - Application State & Logic */

// 1. Data Store for Entries & Prompts
const journalEntriesData = [
  {
    id: "2025-07-27",
    sidebarTag: "今天",
    sidebarNum: "27",
    sidebarMonth: "7月",
    dayName: "Tuesday",
    dateFull: "Jul 29, 2025",
    weather: "☀️",
    polaroidImg: "images/flowers_field.png",
    polaroidCaption: "充满鲜花的世界到底在哪里",
    polaroidFilter: "none",
    promptTitle: "Savor the Moment",
    promptTime: "10:00 PM",
    promptText: "I slow down to hear the flowers bloom and feel the gentle touch of the breeze."
  },
  {
    id: "2025-12-26",
    sidebarTag: "周二",
    sidebarNum: "26",
    sidebarMonth: "12月",
    dayName: "Friday",
    dateFull: "Dec 26, 2025",
    weather: "❄️",
    polaroidImg: "images/flowers_field.png",
    polaroidCaption: "зимнее спокойствие и тишина",
    polaroidFilter: "contrast(110%) brightness(95%) hue-rotate(50deg)",
    promptTitle: "Reflect on Peace",
    promptTime: "08:30 PM",
    promptText: "In the depth of winter, I finally learned that within me there lay an invincible summer."
  },
  {
    id: "2025-05-25",
    sidebarTag: "周一",
    sidebarNum: "25",
    sidebarMonth: "5月",
    dayName: "Sunday",
    dateFull: "May 25, 2025",
    weather: "🌦️",
    polaroidImg: "images/flowers_field.png",
    polaroidCaption: "весенние цветы расцветают",
    polaroidFilter: "saturate(130%) sepia(10%)",
    promptTitle: "Growth & Bloom",
    promptTime: "09:00 AM",
    promptText: "The flower that blooms in adversity is the most rare and beautiful of all."
  },
  {
    id: "2025-04-29",
    sidebarTag: "周日",
    sidebarNum: "29",
    sidebarMonth: "4月",
    dayName: "Saturday",
    dateFull: "Apr 29, 2025",
    weather: "💨",
    polaroidImg: "images/flowers_field.png",
    polaroidCaption: "ветер перемен в апреле",
    polaroidFilter: "grayscale(20%) hue-rotate(-30deg)",
    promptTitle: "Embrace Change",
    promptTime: "11:15 AM",
    promptText: "Like the wind, we must learn to bend and flow, letting go of what we cannot hold."
  },
  {
    id: "2025-03-23",
    sidebarTag: "周四",
    sidebarNum: "23",
    sidebarMonth: "3月",
    dayName: "Thursday",
    dateFull: "Mar 23, 2025",
    weather: "🌧️",
    polaroidImg: "images/flowers_field.png",
    polaroidCaption: "капли дождя на окне",
    polaroidFilter: "opacity(90%) hue-rotate(180deg) brightness(90%)",
    promptTitle: "Emotional Release",
    promptTime: "04:45 PM",
    promptText: "Let the rain wash away the dust of yesterday and nourish the seeds of tomorrow."
  },
  {
    id: "2024-12-11",
    sidebarTag: "2024",
    sidebarNum: "11",
    sidebarMonth: "12月",
    dayName: "Wednesday",
    dateFull: "Dec 11, 2024",
    weather: "⛅",
    polaroidImg: "images/flowers_field.png",
    polaroidCaption: "декабрьские размышления",
    polaroidFilter: "sepia(30%) brightness(85%)",
    promptTitle: "Gratitude Review",
    promptTime: "07:00 PM",
    promptText: "Look back on the lessons of the year with gratitude and step forward with hope."
  },
  {
    id: "2024-11-19",
    sidebarTag: "2024",
    sidebarNum: "19",
    sidebarMonth: "11月",
    dayName: "Tuesday",
    dateFull: "Nov 19, 2024",
    weather: "🍂",
    polaroidImg: "images/flowers_field.png",
    polaroidCaption: "осенняя грусть и тепло",
    polaroidFilter: "sepia(50%) saturate(120%)",
    promptTitle: "Internal Warmth",
    promptTime: "10:30 AM",
    promptText: "When the outer world grows cold, kindle the flame of kindness within your heart."
  }
];

// Weekly calendar strip configuration (matching bottom list of left page)
const weeklyDays = [
  { label: "Mon", num: "27", dateId: "2025-07-27" },
  { label: "Tue", num: "28", dateId: "2025-07-28" },
  { label: "Wed", num: "29", dateId: "2025-07-29" },
  { label: "Thu", num: "30", dateId: "2025-07-30" },
  { label: "Fri", num: "31", dateId: "2025-07-31" },
  { label: "Sat", num: "1", dateId: "2025-08-01" },
  { label: "Sun", num: "2", dateId: "2025-08-02" }
];

// 2. Application State Variables
let currentEntry = journalEntriesData[0];
let activeDateId = currentEntry.id;
let isSaving = false;
let saveTimeout = null;

// 3. Element Selectors
const sidebarDatesList = document.getElementById("sidebar-dates-list");
const weeklyDaysStrip = document.getElementById("weekly-days-strip");
const weatherDisplay = document.getElementById("weather-display");
const selectedDayName = document.getElementById("selected-day-name");
const selectedDateFull = document.getElementById("selected-date-full");
const polaroidImg = document.getElementById("polaroid-img");
const polaroidCaption = document.getElementById("polaroid-caption");

const promptTimeTxt = document.getElementById("prompt-time-txt");
const promptContentTxt = document.getElementById("prompt-content-txt");
const btnCopyPrompt = document.getElementById("btn-copy-prompt");
const btnLikePrompt = document.getElementById("btn-like-prompt");
const btnSharePrompt = document.getElementById("btn-share-prompt");
const shareMenu = document.getElementById("share-menu");

const journalTextEditor = document.getElementById("journal-text-editor");
const journalLocationInput = document.getElementById("journal-location-input");
const saveIndicator = document.getElementById("save-indicator");
const streakCountTxt = document.getElementById("streak-count-txt");
const toastNotif = document.getElementById("toast-notif");

// 4. Sidebar Dynamic Generation
function renderSidebar() {
  sidebarDatesList.innerHTML = "";
  
  journalEntriesData.forEach(entry => {
    const node = document.createElement("div");
    node.className = `date-node ${entry.id === activeDateId ? 'active' : ''}`;
    node.setAttribute("data-id", entry.id);
    
    node.innerHTML = `
      <span class="date-node-tag">${entry.sidebarTag}</span>
      <span class="date-node-num">${entry.sidebarNum}</span>
      <span class="date-node-month">${entry.sidebarMonth}</span>
    `;
    
    node.addEventListener("click", () => {
      selectEntry(entry.id);
    });
    
    sidebarDatesList.appendChild(node);
  });
}

// 5. Weekly Calendar Strip Generation
function renderWeeklyStrip() {
  weeklyDaysStrip.innerHTML = "";
  
  weeklyDays.forEach(day => {
    const dayNode = document.createElement("div");
    // If dateId matches current selected activeDateId, highlight it
    const isActive = day.dateId === activeDateId;
    dayNode.className = `week-day ${isActive ? 'active' : ''}`;
    dayNode.setAttribute("data-date-id", day.dateId);
    
    dayNode.innerHTML = `
      <span class="week-lbl">${day.label}</span>
      <span class="week-num">${day.num}</span>
    `;
    
    dayNode.addEventListener("click", () => {
      selectEntry(day.dateId);
    });
    
    weeklyDaysStrip.appendChild(dayNode);
  });
}

// 6. Entry Selection & Data Binding
function selectEntry(dateId) {
  // Save current values first if they were edited
  saveCurrentEntryImmediately();
  
  activeDateId = dateId;
  
  // Find in pre-defined list, or construct a temporary placeholder
  let entry = journalEntriesData.find(e => e.id === dateId);
  
  if (!entry) {
    // If clicked from weekly strip and not in predefined, create a mock template
    const weekConfig = weeklyDays.find(w => w.dateId === dateId);
    const dayLabel = weekConfig ? weekConfig.label : "Day";
    const dateNum = weekConfig ? weekConfig.num : "28";
    
    entry = {
      id: dateId,
      sidebarTag: "周",
      sidebarNum: dateNum,
      sidebarMonth: "7月",
      dayName: getFullDayName(dayLabel),
      dateFull: `Jul ${dateNum}, 2025`,
      weather: "☀️",
      polaroidImg: "images/flowers_field.png",
      polaroidCaption: "Новый летний день",
      polaroidFilter: "hue-rotate(90deg) sepia(20%)",
      promptTitle: "Embrace the Day",
      promptTime: "08:00 AM",
      promptText: "Write down three things you are looking forward to today, no matter how small they seem."
    };
  }
  
  currentEntry = entry;
  
  // Update Left Page
  weatherDisplay.textContent = entry.weather;
  selectedDayName.textContent = entry.dayName;
  selectedDateFull.textContent = entry.dateFull;
  polaroidImg.src = entry.polaroidImg;
  polaroidImg.style.filter = entry.polaroidFilter;
  polaroidCaption.textContent = entry.polaroidCaption;
  
  // Update Right Page prompt
  promptTimeTxt.textContent = entry.promptTime;
  promptContentTxt.textContent = entry.promptText;
  
  // Update Lined Editor Content & Location from LocalStorage
  const savedText = localStorage.getItem(`strongme_journal_text_${dateId}`) || "";
  const savedLocation = localStorage.getItem(`strongme_journal_loc_${dateId}`) || "";
  
  journalTextEditor.value = savedText;
  journalLocationInput.value = savedLocation;
  
  // Check Liked prompt status
  const isLiked = localStorage.getItem(`strongme_prompt_like_${dateId}`) === "true";
  if (isLiked) {
    btnLikePrompt.classList.add("liked");
  } else {
    btnLikePrompt.classList.remove("liked");
  }
  
  // Re-render components to update highlights
  renderSidebar();
  renderWeeklyStrip();
}

function getFullDayName(abbr) {
  const mapping = {
    "Mon": "Monday",
    "Tue": "Tuesday",
    "Wed": "Wednesday",
    "Thu": "Thursday",
    "Fri": "Friday",
    "Sat": "Saturday",
    "Sun": "Sunday"
  };
  return mapping[abbr] || "Day";
}

// 7. Autosave Persistence Logic
function initAutosave() {
  const handler = () => {
    showSaveIndicator("Saving...");
    
    if (saveTimeout) clearTimeout(saveTimeout);
    
    saveTimeout = setTimeout(() => {
      saveCurrentEntryImmediately();
    }, 1000); // Debounce saves by 1 second
  };
  
  journalTextEditor.addEventListener("input", handler);
  journalLocationInput.addEventListener("input", handler);
}

function saveCurrentEntryImmediately() {
  if (saveTimeout) clearTimeout(saveTimeout);
  
  const textVal = journalTextEditor.value;
  const locVal = journalLocationInput.value;
  
  localStorage.setItem(`strongme_journal_text_${activeDateId}`, textVal);
  localStorage.setItem(`strongme_journal_loc_${activeDateId}`, locVal);
  
  showSaveIndicator("Saved locally");
  
  // Evaluate streak increment logic
  checkStreakProgress();
}

function showSaveIndicator(text) {
  saveIndicator.textContent = text;
  saveIndicator.classList.add("visible");
  
  if (text === "Saved locally") {
    setTimeout(() => {
      // Fade out indicator after 2 seconds if saved
      if (saveIndicator.textContent === "Saved locally") {
        saveIndicator.classList.remove("visible");
      }
    }, 2000);
  }
}

// 8. Streak Logic
function checkStreakProgress() {
  const wordCount = journalTextEditor.value.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  // If user writes at least 5 words and hasn't claimed their streak for today, update streak
  const streakClaimedKey = `strongme_streak_claimed_${activeDateId}`;
  const isClaimed = localStorage.getItem(streakClaimedKey) === "true";
  
  if (wordCount >= 5 && !isClaimed) {
    localStorage.setItem(streakClaimedKey, "true");
    let currentStreak = parseInt(localStorage.getItem("strongme_streak") || "1");
    currentStreak += 1;
    localStorage.setItem("strongme_streak", currentStreak);
    
    streakCountTxt.textContent = `${currentStreak} Day Streak`;
    
    // Play spark animation or pop a message
    showToast("🔥 Streak extended! Keep it up!");
  }
}

function initStreak() {
  const streakVal = localStorage.getItem("strongme_streak") || "1";
  streakCountTxt.textContent = `${streakVal} Day Streak`;
}

// 9. Toast Helper
function showToast(message) {
  toastNotif.textContent = message;
  toastNotif.classList.add("show");
  
  setTimeout(() => {
    toastNotif.classList.remove("show");
  }, 2500);
}

// 10. Copy Prompt text Action
btnCopyPrompt.addEventListener("click", () => {
  const textToCopy = promptContentTxt.textContent.trim();
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      showToast("Quote copied to clipboard!");
    })
    .catch(() => {
      showToast("Failed to copy quote.");
    });
});

// 11. Like Prompt Action
btnLikePrompt.addEventListener("click", () => {
  const isLiked = btnLikePrompt.classList.toggle("liked");
  localStorage.setItem(`strongme_prompt_like_${activeDateId}`, isLiked ? "true" : "false");
  
  if (isLiked) {
    showToast("Added to favorited prompts ❤️");
  } else {
    showToast("Removed from favorites");
  }
});

// 12. Share Menu Action
btnSharePrompt.addEventListener("click", (e) => {
  e.stopPropagation();
  shareMenu.classList.toggle("show");
});

document.addEventListener("click", () => {
  shareMenu.classList.remove("show");
});

document.getElementById("share-twitter").addEventListener("click", () => {
  const text = encodeURIComponent(`"${promptContentTxt.textContent.trim()}" - Journaling with StrongMe`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

document.getElementById("share-clipboard").addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href)
    .then(() => showToast("App link copied!"))
    .catch(() => showToast("Copy failed"));
});

// 13. Theme Switching (Light/Dark mode)
const btnThemeToggle = document.getElementById("btn-theme-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

function initTheme() {
  const savedTheme = localStorage.getItem("strongme_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  if (savedTheme === "dark") {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }
}

btnThemeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("strongme_theme", newTheme);
  
  if (newTheme === "dark") {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
    showToast("Dark mode activated 🌙");
  } else {
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
    showToast("Light mode activated ☀️");
  }
});

// 14. Language selection dummy trigger
document.getElementById("btn-language").addEventListener("click", () => {
  showToast("Language options will be available soon!");
});

// 15. Profile dropdown dummy trigger
document.getElementById("profile-menu-trigger").addEventListener("click", () => {
  showToast("Dong's Profile Settings");
});

// 16. Initialize everything on load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initStreak();
  renderSidebar();
  renderWeeklyStrip();
  initAutosave();
  
  // Set initial day selection
  selectEntry(activeDateId);
});
