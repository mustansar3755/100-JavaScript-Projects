// Elements
const ta = document.getElementById("text");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const spaceCount = document.getElementById("spaceCount");
const maxLenEl = document.getElementById("maxLen");
const excludeSpacesEl = document.getElementById("excludeSpaces");
const remainingBadge = document.getElementById("remainingBadge");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const sampleBtn = document.getElementById("sampleBtn");
const showRemainingEl = document.getElementById("showRemaining");
const downloadBtn = document.getElementById("downloadBtn");

// Utility: trim, compute words
function countWords(s) {
  // split on whitespace, filter out empty entries
  const arr = s.trim().split(/\s+/).filter(Boolean);
  return arr.length === 1 && arr[0] === "" ? 0 : arr.length;
}

function updateCounts() {
  const text = ta.value;
  const spaces = (text.match(/ /g) || []).length;
  const charsTotal = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const maxLen = Math.max(1, Number(maxLenEl.value || 1));
  const excludeSpaces = excludeSpacesEl.checked;
  const charsCounted = excludeSpaces ? charsNoSpaces : charsTotal;
  const words = countWords(text);

  charCount.textContent = charsCounted;
  wordCount.textContent = words;
  spaceCount.textContent = spaces;

  // Remaining logic
  if (showRemainingEl.checked) {
    const remaining = maxLen - charsCounted;
    remainingBadge.style.display = "";
    remainingBadge.textContent =
      remaining >= 0 ? `Remaining: ${remaining}` : `Over by: ${-remaining}`;
    remainingBadge.classList.remove("ok", "warn", "over");
    if (remaining < 0) remainingBadge.classList.add("over");
    else if (remaining <= Math.ceil(maxLen * 0.15))
      remainingBadge.classList.add("warn");
    else remainingBadge.classList.add("ok");
  } else {
    remainingBadge.style.display = "none";
  }

  // Simple visual enforcement: if over max and clipboard/copy should warn,
  // we do not prevent typing — we only mark the badge red.
  // Optionally: auto-truncate when user pastes large text.
}

ta.addEventListener("paste", (e) => {
  const maxLen = Math.max(1, Number(maxLenEl.value || 1));
  const excludeSpaces = excludeSpacesEl.checked;
  const pasteText = (e.clipboardData || window.clipboardData).getData("text");
  const before = ta.value;
  const selectionStart = ta.selectionStart;
  const selectionEnd = ta.selectionEnd;
  const newText =
    before.slice(0, selectionStart) + pasteText + before.slice(selectionEnd);
  const countedLength = excludeSpaces
    ? newText.replace(/\s/g, "").length
    : newText.length;
  if (countedLength > maxLen) {
    e.preventDefault();
    // compute how many chars we can still accept (counted)
    const currentCounted = excludeSpaces
      ? before.replace(/\s/g, "").length
      : before.length - (selectionEnd - selectionStart);
    let allowed = Math.max(0, maxLen - currentCounted);
    if (allowed <= 0) return; // nothing allowed
    if (!excludeSpaces) {
      const truncated = pasteText.slice(0, allowed);
      const updated =
        before.slice(0, selectionStart) +
        truncated +
        before.slice(selectionEnd);
      ta.value = updated;
    
      const pos = selectionStart + truncated.length;
      ta.setSelectionRange(pos, pos);
    } else {
     
      let taken = "";
      let count = 0;
      for (const ch of pasteText) {
        if (/\s/.test(ch)) {
          taken += ch; // include spaces as they don't count
        } else {
          if (count < allowed) {
            taken += ch;
            count++;
          } else break;
        }
      }
      const updated =
        before.slice(0, selectionStart) + taken + before.slice(selectionEnd);
      ta.value = updated;
      const pos = selectionStart + taken.length;
      ta.setSelectionRange(pos, pos);
    }
    updateCounts();
  }
});

// live update
ta.addEventListener("input", updateCounts);
maxLenEl.addEventListener("input", updateCounts);
excludeSpacesEl.addEventListener("change", updateCounts);
showRemainingEl.addEventListener("change", updateCounts);

// Buttons
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(ta.value);
    copyBtn.textContent = "Copied ✓";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  } catch (err) {
    ta.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied ✓";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  }
});

clearBtn.addEventListener("click", () => {
  ta.value = "";
  updateCounts();
  ta.focus();
});

sampleBtn.addEventListener("click", () => {
  ta.value =
    "This is a sample paragraph to test the character counter. Change settings: toggle 'Exclude spaces' or set a different max length.";
  updateCounts();
  ta.focus();
  ta.setSelectionRange(0, 0);
});

downloadBtn.addEventListener("click", () => {
  const text = ta.value;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "text.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  downloadBtn.textContent = "Downloaded ✓";
  setTimeout(() => (downloadBtn.textContent = "Download"), 1500);
});

updateCounts();
