const fs = require('fs');

async function getHoroscope() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined.");
    process.exit(1);
  }

  const prompt = `اكتب توقعات الأبراج اليومية الـ 12 باللغة العربية المشوقة واللطيفة.
ضع التوقعات في صيغة JSON حصرية وبدون أي مقدمات أو علامات مقتبسة، فقط النتيجة JSON الصافية.
التركيب المطلوب:
{
  "aries": "توقعات الحمل...",
  "taurus": "توقعات الثور...",
  "gemini": "توقعات الجوزاء...",
  "cancer": "توقعات السرطان...",
  "leo": "توقعات الأسد...",
  "virgo": "توقعات العذراء...",
  "libra": "توقعات الميزان...",
  "scorpio": "توقعات العقرب...",
  "sagittarius": "توقعات القوس...",
  "capricorn": "توقعات الجدي...",
  "aquarius": "توقعات الدلو...",
  "pisces": "توقعات الحوت..."
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    fs.writeFileSync('data.json', text);
    console.log('Successfully generated data.json!');
  } catch (err) {
    console.error('Error generating horoscope:', err);
    process.exit(1);
  }
}

getHoroscope();
