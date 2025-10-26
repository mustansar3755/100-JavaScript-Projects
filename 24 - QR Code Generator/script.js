// * Elements

const textEL = document.getElementById("text");
const sizeEL = document.getElementById("size");
const sizeValue = document.getElementById("sizeValue");
const fgEL = document.getElementById("fg");
const bgEL = document.getElementById("bg");
const ecEL = document.getElementById("ec");
const generateBTN = document.getElementById("generate");
const downloadBTN = document.getElementById("download");
const clearBTN = document.getElementById("clear");
const qrIMG = document.getElementById("qrImg");
const status = document.getElementById("status");

// * Set initial size label
sizeValue.textContent = sizeEL.value;

function setStatus(msg) {
  status.textContent = msg;
}

async function generateQR() {
  const text = textEL.value.trim();

  if (!text) {
    setStatus("Enter text or URL to generate.");
    qrIMG.src = "";
    return;
  }
  setStatus("Generating......");

  const opts = {
    errorCorrectionLevel: ecEL.value,
    width: parseInt(setStatus.value, 10),
    color: {
      dark: fgEL.value,
      light: bgEL.value,
    },
  };

  // ! Try catch

  try {
    // * Use librayr to create DataURL
    const dataURL = await QRCode.toDataURL(text, opts);
    qrIMG.src = dataURL;
    setStatus("Ready - OR generated");
  } catch (error) {
    console.error(error);
    setStatus("Error Generating QR. Open console for details");
  }
}

//!  Download current QR as PNG

function downloadQR() {
  if (!qrIMG.src) {
    setStatus("No QR to download- generate one first");
    return;
  }
  const a = document.createElement("a");
  a.href = qrIMG.src;
  a.download = "qr-code.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ! Setup Events

generateBTN.addEventListener("click", generateQR);
downloadBTN.addEventListener("click", downloadQR);

clearBTN.addEventListener("click", () => {
  textEL.value = "";
  qrIMG.src = "";
  setStatus("Cleared");
});

//! Live updates for size indicator and optional auto-generation
sizeEL.addEventListener("input", () => {
  sizeValue.textContent = sizeEL.value;
});

// ! Auto Generate on input stop

let typingTimer;
textEL.addEventListener("input", () => {
  setStatus("Typing....");
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    generateQR();
  }, 700);
});

//! Defult QR Sample

window.addEventListener("load", () => {
  generateQR();
});
