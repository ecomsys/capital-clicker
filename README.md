# Схема фронт-енда "Capital Clicker" от Веблегко

```bash
game/
├── .scripts/
│   ├── fonts.js            # конвертер шрифтов
│   ├── svg.js              # создание спрайтов 
│   └── webp.js             # конвертер картинок
│
├── node_modules           # зависимости npm
│     └── ...
│
├── public/
│   ├── data            # временные данные json
│   ├── fonts           # шрифты
│   ├── icons           # иконки
│   ├── images          # изображения
│   ├── sounds          # звуки
│   ├── videos          # видео
│   ├── .htaccess       # настройки для apache
│   ├── favicon.ico     # фавикон
│   └── ...             # другие иконки
│
├── src/              
│   ├── app              # провайдер, роутер 
│   ├── components       # layouts, sections
│   ├── audio            # менеджер звуков
│   ├── pages            # страницы
│   ├── hooks            # хуки
│   ├── stores           # хук для взаимодействия с воркером
│   ├── styles           # стили
│   ├── layouts          # лейауты
│   ├── services         # разные сервисы (классы и т.д.)
│   ├── constants        # какие то константы
│   ├── lib              # вспомогательные функции
│   ├── ui               # компоненты интерфейса
│   ├── main.jsx         # точка входа
│   └── ...
│
├── .gitignore           # игнор для git
├── index.html           # главный файл 
├── tailwind.config.js   # настройки tailwind
├── package.json         # зависимости
├── convert.php          # конвертер rem/px всех файлов проекта
├── vite.config.js       # конфиг для vite  
├── components.json      # компоненты shadcn/ui
└── jsconfig.json        # настройка alias и др.
```

# Запуск в дев режиме

```bash
npm i
npm run dev
```