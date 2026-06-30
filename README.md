# YOSSA Women's Fitness

Статический сайт YOSSA для GitHub Pages. Форма заявки отправляет данные на Railway API, а Railway пересылает уведомление в Telegram.

## Где что работает

```text
yossafitness.ru -> GitHub Pages
yossa-production.up.railway.app/api/lead -> Railway API
Railway -> Telegram
```

## Настройки Railway

```text
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=1581774364,964317402
LEAD_SOURCE=YOSSA GitHub Pages
ALLOWED_ORIGINS=https://yossafitness.ru,http://yossafitness.ru,https://www.yossafitness.ru,http://www.yossafitness.ru,https://isrmtnkv.github.io
```

## Проверка

```bash
npm run check
```

Подробная инструкция лежит в `RAILWAY_DEPLOY.md`.
