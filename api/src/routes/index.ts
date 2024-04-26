import { Router, Request, Response } from 'express';

const router: Router = Router();

interface Template {
    html: string;
    css: string;
}

// Стандартные значения
const template: Template = {
    html: '',
    css: ''
};

// Текущие значения
const values: Template = {
    html: template.html,
    css: template.css
};

// Переменных
const data = {
    title: 'Card title',
    image: 'https://random.imagecdn.app/226/125',
    text: 'Some quick example text to build on the card title and male up the bulk of the card’s content.'
};

// Получение шаблона и стилей
router.get('/template', (req: Request, res: Response) => {
    res.json(values);
});

// Обновление шаблона и стилей
router.post('/template', (req: Request, res: Response) => {
    values.html = req.body.html || template.html;
    values.css = req.body.css || template.css;
    res.status(200).send({ message: "Template updated successfully." });
});

// Получение данных
router.get('/data', (req: Request, res: Response) => {
    res.json(data);
});

export default router;
