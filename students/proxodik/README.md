# Student Task Tracker

## Опис проєкту

Student Task Tracker — це простий REST API застосунок, розроблений на Node.js для керування навчальними завданнями. Проєкт демонструє використання Docker, GitHub Actions, Terraform та AWS для автоматизації тестування, збирання і розгортання застосунку.

## Основні можливості

- Перегляд списку навчальних завдань.
- Додавання нових завдань.
- Позначення завдань як виконаних.
- Перевірка стану застосунку.

Дані зберігаються в оперативній пам'яті та скидаються після перезапуску застосунку.

## Використані технології

- Node.js 22 для розробки REST API.
- Docker для контейнеризації застосунку.
- GitHub Actions для автоматизації CI/CD.
- Docker Hub для зберігання Docker-образів.
- Terraform для керування інфраструктурою.
- AWS EC2 для запуску застосунку.
- AWS Systems Manager для віддаленого розгортання.
- Amazon S3 для зберігання Terraform State.

## API-маршрути

| Метод | Маршрут | Призначення |
|-------|---------|-------------|
| GET | / | Перевірка стану застосунку |
| GET | /tasks | Отримання списку завдань |
| POST | /tasks | Створення нового завдання |
| PATCH | /tasks/:id/complete | Позначення завдання як виконаного |

## Локальний запуск

Для запуску потрібен Node.js версії 22 або новішої.

Встановлення залежностей:

```bash
npm ci
```

Запуск застосунку:

```bash
npm start
```

Після запуску API доступний за адресою:

http://localhost:3000/tasks

Запуск автоматичних тестів:

```bash
npm test
```

## Запуск через Docker

Збирання Docker-образу:

```bash
docker build -t student-task-tracker .
```

Запуск контейнера:

```bash
docker run -d --name student-task-tracker -p 3000:3000 student-task-tracker
```

Docker-образ також доступний у Docker Hub:

https://hub.docker.com/r/illiadevops/student-task-tracker

## Інфраструктура Terraform

Файли конфігурації розташовані в папці `infra/`.

Terraform автоматично створює:

- EC2-інстанс для запуску застосунку.
- Security Group для доступу до API.
- IAM-ролі для AWS Systems Manager.
- IAM-роль для GitHub Actions з авторизацією через OIDC.

Стан інфраструктури зберігається в Amazon S3.

Ініціалізація Terraform:

```bash
cd infra
terraform init
terraform validate
terraform plan
```

Створення інфраструктури:

```bash
terraform apply
```

Видалення інфраструктури:

```bash
terraform destroy
```

Для виконання команд потрібен налаштований AWS CLI та відповідні дозволи IAM.

## Автоматизація CI/CD

У проєкті налаштовано три GitHub Actions workflows.

1. Node.js CI автоматично запускає тести після змін у репозиторії.
2. Docker Build and Push перевіряє застосунок, створює Docker-образ і публікує його в Docker Hub.
3. Deploy to EC2 via SSM автоматично оновлює Docker-контейнер на AWS EC2 після успішної публікації образу.

Для авторизації GitHub Actions в AWS використовується OIDC без зберігання постійних AWS Access Keys.

## Архітектура проєкту

```text
GitHub Repository
       |
       v
GitHub Actions CI
       |
       v
Docker Build and Push
       |
       v
Docker Hub
       |
       v
AWS Systems Manager
       |
       v
AWS EC2
       |
       v
Docker Container
       |
       v
Student Task Tracker API
```

## Безпека

- Застосунок у Docker працює від непривілейованого користувача.
- GitHub Actions використовує OIDC для доступу до AWS.
- AWS Systems Manager дозволяє керувати EC2 без постійного SSH-доступу.
- Секрети та Terraform State не зберігаються в GitHub.
- Файл `.gitignore` виключає тимчасові та конфіденційні файли.

## Автор

Illia Horilyi
