const express = require('express')
const os = require('node:os')

const app = express()
app.use(express.json())

const port = Number(process.env.PORT) || 3000

let services = [
	{ id: 1, name: 'Хранение файлов', category: 'storage' },
	{ id: 2, name: 'Виртуальная машина', category: 'compute' },
	{ id: 3, name: 'Среда разработки', category: 'development' },
]

// Главная страница
app.get('/', (req, res) => {
	res.send(`
        <html lang="ru">
        <head>
            <meta charset="utf-8">
            <title>Cloud Lab</title>
        </head>
        <body>
            <h1>Моё первое облачное приложение</h1>
            <p>Приложение работает в GitHub Codespaces на Node.js.</p>
            <p>Сервер успешно запущен!</p>

            <h3>Доступные функции:</h3>
            <ul>
                <li><a href="/api/status">Состояние сервера</a></li>
                <li><a href="/api/services">Список сервисов</a></li>
                <li><a href="/api/hello?name=Artem">Приветствие</a></li>
            </ul>
        </body>
        </html>
    `)
})

// Состояние сервера
app.get('/api/status', (req, res) => {
	res.json({
		app: process.env.APP_NAME || 'Cloud Lab',
		status: 'ok',
		time: new Date().toISOString(),
		hostname: os.hostname(),
	})
})

// Список сервисов
app.get('/api/services', (req, res) => {
	res.json(services)
})

// Получение сервиса по ID
app.get('/api/services/:id', (req, res) => {
	const id = Number(req.params.id)
	const service = services.find(s => s.id === id)

	if (!service) {
		return res.status(404).json({ error: 'Сервис не найден' })
	}

	res.json(service)
})

// Добавление сервиса
app.post('/api/services', (req, res) => {
	const { name, category } = req.body || {}

	if (
		typeof name !== 'string' ||
		!name.trim() ||
		typeof category !== 'string' ||
		!category.trim()
	) {
		return res.status(400).json({ error: 'Заполните name и category' })
	}

	const id = Math.max(0, ...services.map(s => s.id)) + 1

	const service = {
		id,
		name: name.trim(),
		category: category.trim(),
	}

	services.push(service)
	res.status(201).json(service)
})

// Приветствие по имени
app.get('/api/hello', (req, res) => {
	const name = req.query.name || 'Гость'

	res.json({
		message: `Привет, ${name}!`,
	})
})

// Запуск сервера
app.listen(port, '0.0.0.0', () => {
	console.log(`Server: http://localhost:${port}`)
})
