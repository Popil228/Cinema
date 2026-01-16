# Правила роботи з проектом Cinema

##  Початок роботи

### Перше клонування проекту

1. **Клонуйте репозиторій:**
   ```bash
   git clone <url-репозиторія>
   cd CinemaProject


2. **Налаштуйте Backend (.NET):**
   ```bash
   cd CinemaProject.Server
   dotnet restore


3. **Налаштуйте Frontend (React + Vite):**
   ```bash
   cd cinemaproject.client
   npm install
  

4. **Створіть особисті налаштування:**
   - Створіть файл `CinemaProject.Server/appsettings.Development.json` (він в .gitignore)
   - Додайте ваш connection string до бази даних:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CinemaDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     },
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning"
       }
     }
   }


5. **Застосуйте міграції бази даних:**
   ```bash
   cd CinemaProject.Server
   dotnet ef database update
   ```



## Обов'язкові правила для всіх

### 1. **НІКОЛИ не комітьте:**
-  `node_modules/` - залежності встановлюються локально
-  `bin/`, `obj/` - результати збірки .NET
-  `dist/` - білд фронтенду
-  `.env`, `appsettings.Development.json` - особисті налаштування
- `.vs/`, `.idea/` - налаштування IDE
-  `*.user` - персональні налаштування Visual Studio
-  Файли баз даних (`*.db`, `*.sqlite`, `*.mdf`, `*.ldf`)

### 2. **Створіть особисті файли налаштувань:**
Кожен розробник повинен створити свої локальні файли:

**Backend:** `CinemaProject.Server/appsettings.Development.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING_HERE"
  }
}


**Frontend:** `cinemaproject.client/.env.local` (якщо потрібно)

VITE_API_URL=https://localhost:7xxx


### 3. **Робота з базою даних:**
- Завжди створюйте міграції з описовими назвами:
  ```bash
  dotnet ef migrations add DescriptiveNameHere

- Перед push обов'язково перевірте, що міграція працює:
  ```bash
  dotnet ef database update

- Не видаляйте старі міграції, якщо вони вже в main/master
- Комітьте тільки файли міграцій, не базу даних!

###4. **Git workflow:**
```bash
# Перед початком роботи
git pull origin main

# Створіть нову гілку для фічі
git checkout -b feature/your-feature-name

# Після змін
git add .
git commit -m "feat: опис змін"
git push origin feature/your-feature-name

# Створіть Pull Request


### 5. **Формат commit messages:**
- `feat:` - нова функціональність
- `fix:` - виправлення бага
- `refactor:` - рефакторинг коду
- `style:` - зміни стилів/форматування
- `docs:` - зміни в документації
- `test:` - додавання тестів
- `chore:` - інші зміни (оновлення залежностей тощо)

Приклад:

feat: додано сторінку бронювання квитків
fix: виправлено помилку з відображенням сеансів
refactor: оптимізовано запити до БД



##Запуск проекту

### Backend:
```bash
cd CinemaProject.Server
dotnet run

Або через Visual Studio/Rider - F5

### Frontend:
```bash
cd cinemaproject.client
npm run dev


###Разом (якщо налаштовано):
Відкрийте solution в Visual Studio і запустіть обидва проекти.



##Перед Pull Request

**Checklist:**
- [ ] Код компілюється без помилок
- [ ] Міграції застосовані і працюють
- [ ] Не комічу особисті налаштування
- [ ] Перевірив .gitignore
- [ ] Видалив console.log() та debug код
- [ ] Написав зрозумілий commit message
- [ ] Перевірив, що не ламаю існуючий функціонал



##Поширені проблеми

### "Cannot connect to database"
- Перевірте `appsettings.Development.json`
- Переконайтеся, що SQL Server запущений
- Застосуйте міграції: `dotnet ef database update`

### "node_modules not found"
```bash
cd cinemaproject.client
npm install


### "Migration already exists"
```bash
git pull origin main
dotnet ef database update


###Конфлікт міграцій
1. Видаліть вашу останню локальну міграцію
2. Pull зміни з main
3. Застосуйте міграції з main
4. Створіть нову міграцію

