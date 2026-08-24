import fs from 'fs';

const horoscopes = {
  aries: "برج الحمل", taurus: "برج الثور", gemini: "برج الجوزاء",
  cancer: "برج السرطان", leo: "برج الأسد", virgo: "برج العذراء",
  libra: "برج الميزان", scorpio: "برج العقرب", sagittarius: "برج القوس",
  capricorn: "برج الجدي", aquarius: "برج الدلو", pisces: "برج الحوت"
};

const zodiac_list = Object.values(horoscopes);
const predictions = {};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (const [key, name] of Object.entries(horoscopes)) {
  const compatible = zodiac_list[getRandomInt(0, zodiac_list.length - 1)];
  const lucky_num = getRandomInt(1, 99);
  const love_rate = getRandomInt(50, 99);
  
  predictions[key] = {
    name: name,
    general: "يوم ممتاز مليء بالطاقة الإيجابية. حاول استغلال الفرص المتاحة ولا تتردد في اتخاذ قرارات جريئة.",
    financial: "قد تتلقى أخباراً سارة بخصوص مشروع أو فرصة لزيادة الدخل، ابقَ متيقظاً.",
    emotional: "الوقت مناسب جداً لتعزيز علاقتك مع من تحب وتوضيح بعض الأمور العالقة.",
    lucky_num: lucky_num.toString(),
    compatible: compatible,
    love_rate: `${love_rate}%`
  };
}

fs.writeFileSync('data.json', JSON.stringify(predictions, null, 2), 'utf-8');
console.log("Data generated successfully!");
