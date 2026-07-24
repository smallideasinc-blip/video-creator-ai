// Create TikTok App Icon - 1024x1024px with gradient
const fs = require('fs');

// Create a simple PNG icon using SVG embedded as data
// This creates a professional gradient icon with AI branding

const createIcon = async () => {
  try {
    // Try to use canvas library if available
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
    gradient.addColorStop(0, '#8338EC');    // Purple
    gradient.addColorStop(0.5, '#FF006E');  // Pink
    gradient.addColorStop(1, '#FB5607');    // Orange

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Add circle overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(512, 512, 350, 0, Math.PI * 2);
    ctx.fill();

    // Add play button symbol
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(400, 350);
    ctx.lineTo(400, 550);
    ctx.lineTo(600, 450);
    ctx.fill();

    // Add "AI" text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 200px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI', 512, 700);

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('app-icon.png', buffer);
    console.log('✅ App icon created: app-icon.png (1024x1024)');
    console.log('📱 Ready for TikTok upload!');
  } catch (err) {
    console.error('❌ Canvas not available, creating SVG instead...');
    createIconSVG();
  }
};

const createIconSVG = () => {
  // Fallback: Create as SVG (can be converted to PNG later)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8338EC;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FF006E;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FB5607;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#grad1)"/>
  <!-- Circle overlay -->
  <circle cx="512" cy="512" r="350" fill="rgba(255,255,255,0.15)"/>
  <!-- Play button -->
  <polygon points="400,350 400,550 600,450" fill="rgba(255,255,255,0.3)"/>
  <!-- AI Text -->
  <text x="512" y="700" font-size="200" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial, sans-serif">AI</text>
</svg>`;

  fs.writeFileSync('app-icon.svg', svg);
  console.log('✅ App icon created as SVG: app-icon.svg');
  console.log('⚠️  Convert to PNG using online tool: https://convertio.co/svg-png/');
};

createIcon();
