const fs = require('fs');

async function getHoroscope() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("خطأ: لم يتم العثور على المفتاح GEMINI_API_KEY!");
    process.exit(1);
  }

  const prompt = `اكتب توقعات الأبراج اليومية الـ 12 باللغة العربية المشوقة.
ضع التوقعات في صيغة JSON حصرية بدون مقدمات أو علامات مقتبسة:
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

  // استخدام الرابط المباشر للنسخة v1 المستقرة
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      console.error("Response error:", JSON.stringify(data));
      process.exit(1);
    }

    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    fs.writeFileSync('data.json', text);
    console.log('تم إنشاء data.json بنجاح!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

getHoroscope();
