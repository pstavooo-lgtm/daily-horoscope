import json
import random

horoscopes = {
    "aries": "برج الحمل", "taurus": "برج الثور", "gemini": "برج الجوزاء",
    "cancer": "برج السرطان", "leo": "برج الأسد", "virgo": "برج العذراء",
    "libra": "برج الميزان", "scorpio": "برج العقرب", "sagittarius": "برج القوس",
    "capricorn": "برج الجدي", "aquarius": "برج الدلو", "pisces": "برج الحوت"
}

zodiac_list = list(horoscopes.values())

predictions = {}

for key, name in horoscopes.items():
    compatible = random.choice(zodiac_list)
    lucky_num = random.randint(1, 99)
    love_rate = random.randint(50, 99)
    
    predictions[key] = {
        "name": name,
        "general": f"اليوم يحمل لك طاقة إيجابية ممتازة لترتيب أمورك. تجنب الانفعال وكن صبوراً في اتخاذ القرارات المهمة.",
        "financial": "فرصة مالية أو مكافأة بسيطة في الطريق إليك، استغلها بذكاء.",
        "emotional": "الشريك يحتاج منك اهتماماً إضافياً اليوم، الحوار الهادئ يحل كل الخلافات.",
        "lucky_num": str(lucky_num),
        "compatible": compatible,
        "love_rate": f"{love_rate}%"
    }

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(predictions, f, ensure-ascii=False, indent=2)

print("Data generated successfully!")
