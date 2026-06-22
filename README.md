# Fitness x Wellness

Статический сайт фитнес/wellness-клуба с формами заявок, Telegram-уведомлениями и отправкой заявок в 1C через webhook.

## Структура

- `index.html` - разметка сайта.
- `styles.css` - визуальный стиль, адаптация и анимации.
- `script.js` - интерактив, слайдеры, попапы и отправка форм.
- `api/lead.js` - backend-функция для заявок.
- `assets/` - изображения и видео.

## Проверка

```bash
npm run check
```

## Деплой

Рекомендуемый вариант: GitHub + Vercel.

GitHub нужен как репозиторий с кодом. Vercel нужен как хостинг, потому что сайту требуется backend-функция `/api/lead` для Telegram и 1C. GitHub Pages для этого проекта не подходит без отдельного backend.

### 1. Загрузить в GitHub

```bash
git init
git add .
git commit -m "Initial fitness wellness site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

### 2. Подключить Vercel

1. Зайти в Vercel.
2. Создать новый проект из GitHub-репозитория.
3. Framework Preset оставить `Other`.
4. Build Command оставить пустым.
5. Output Directory оставить пустым.
6. Deploy.

### 3. Добавить переменные окружения в Vercel

В проекте Vercel открыть `Settings` -> `Environment Variables` и добавить:

```text
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
ONEC_WEBHOOK_URL=
ONEC_WEBHOOK_TOKEN=
ONEC_WEBHOOK_HEADER_NAME=
ONEC_WEBHOOK_HEADER_VALUE=
```

Для 1C обязательна только `ONEC_WEBHOOK_URL`. Остальные переменные нужны, если 1C webhook защищен токеном или кастомным заголовком.

### 4. Подключить домен в REG.RU

1. В Vercel открыть проект -> `Settings` -> `Domains`.
2. Добавить домен, например `example.ru` и `www.example.ru`.
3. Vercel покажет нужные DNS-записи.
4. В REG.RU открыть домен -> управление DNS-зоной.
5. Удалить конфликтующие записи для `@` и `www`, если они есть.
6. Добавить записи, которые показывает Vercel. Обычно это:

```text
@     A       76.76.21.21
www   CNAME   cname.vercel-dns.com
```

Если Vercel показывает другие значения, использовать значения из Vercel.

### 5. Проверить заявки

После деплоя отправить тестовую заявку с сайта. Успешный ответ `/api/lead` должен вернуть JSON с `ok: true` и списком доставок.
