import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://planning-with-ai-f6aa8.web.app',
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// FoodLog MVP stores data in memory. Data resets when the server restarts.
let foodList = [
  {
    id: 1,
    name: '사과',
    category: '과일',
    calories: 95,
    memo: '오후 간식으로 먹음',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: '밥',
    category: '주식',
    calories: 310,
    memo: '점심 식사로 먹음',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: '달걀',
    category: '단백질',
    calories: 80,
    memo: '아침에 삶은 달걀로 먹음',
    createdAt: new Date().toISOString(),
  },
];

let nextId = 4;

// Keep error responses consistent across every API route.
const sendError = (res, status, message) => {
  res.status(status).json({ error: { message } });
};

const isBlank = (value) => typeof value !== 'string' || value.trim() === '';

const toValidCalories = (value) => {
  const calories = Number(value);
  return Number.isFinite(calories) ? calories : null;
};

const parseFoodId = (idParam) => {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const findFoodById = (id) => foodList.find((item) => item.id === id);

const validateCreateFood = ({ name, category, calories }) => {
  if (isBlank(name)) return '음식 이름을 입력해주세요.';
  if (isBlank(category)) return '카테고리를 입력해주세요.';
  if (calories === undefined || calories === null || calories === '') {
    return '칼로리를 입력해주세요.';
  }
  if (toValidCalories(calories) === null) return '칼로리는 숫자로 입력해주세요.';
  return null;
};

const validateUpdateFood = ({ name, category, calories, memo }) => {
  if (name !== undefined && isBlank(name)) return '음식 이름은 비워둘 수 없습니다.';
  if (category !== undefined && isBlank(category)) return '카테고리는 비워둘 수 없습니다.';
  if (calories !== undefined && toValidCalories(calories) === null) {
    return '칼로리는 숫자로 입력해주세요.';
  }
  if (memo !== undefined && typeof memo !== 'string') return '메모는 문자로 입력해주세요.';
  return null;
};

const buildCategorySummary = (foods) => foods.reduce((summary, food) => {
  summary[food.category] = (summary[food.category] || 0) + 1;
  return summary;
}, {});

const buildFeedbackMessage = ({ totalCount, totalCalories, categorySummary }) => {
  if (totalCount === 0) {
    return '아직 기록된 음식이 없습니다. 식사 후 음식을 기록해보세요.';
  }

  if (totalCalories >= 1500) {
    return '오늘 섭취 칼로리가 높은 편입니다. 다음 식사는 가볍게 조절해보세요.';
  }

  if (Object.keys(categorySummary).length === 1) {
    return '식단이 한 종류에 치우칠 수 있습니다. 다양한 음식을 기록해보세요.';
  }

  return '다양한 음식 기록이 잘 관리되고 있습니다. 꾸준히 기록해보세요.';
};

// GET /foods returns every food record.
app.get('/foods', (req, res) => {
  res.json(foodList);
});

// GET /foods/:id returns one food record by id.
app.get('/foods/:id', (req, res) => {
  const id = parseFoodId(req.params.id);
  const food = id ? findFoodById(id) : null;

  if (!food) {
    return sendError(res, 404, '음식 기록을 찾을 수 없습니다.');
  }

  res.json(food);
});

// POST /foods creates a new food record after required input validation.
app.post('/foods', (req, res) => {
  const { name, category, calories, memo } = req.body;
  const validationError = validateCreateFood(req.body);

  if (validationError) {
    return sendError(res, 400, validationError);
  }

  const newFood = {
    id: nextId,
    name: name.trim(),
    category: category.trim(),
    calories: toValidCalories(calories),
    memo: typeof memo === 'string' ? memo : '',
    createdAt: new Date().toISOString(),
  };

  foodList.push(newFood);
  nextId += 1;

  res.status(201).json(newFood);
});

// PUT /foods/:id updates only editable fields sent in the request body.
app.put('/foods/:id', (req, res) => {
  const id = parseFoodId(req.params.id);
  const food = id ? findFoodById(id) : null;

  if (!food) {
    return sendError(res, 404, '음식 기록을 찾을 수 없습니다.');
  }

  const { name, category, calories, memo } = req.body;
  const validationError = validateUpdateFood(req.body);

  if (validationError) {
    return sendError(res, 400, validationError);
  }

  if (name !== undefined) food.name = name.trim();
  if (category !== undefined) food.category = category.trim();
  if (calories !== undefined) food.calories = toValidCalories(calories);
  if (memo !== undefined) food.memo = memo;

  res.json(food);
});

// DELETE /foods/:id removes one food record by id.
app.delete('/foods/:id', (req, res) => {
  const id = parseFoodId(req.params.id);
  const foodIndex = id ? foodList.findIndex((item) => item.id === id) : -1;

  if (foodIndex === -1) {
    return sendError(res, 404, '음식 기록을 찾을 수 없습니다.');
  }

  const [deletedFood] = foodList.splice(foodIndex, 1);

  res.json({
    message: '음식 기록이 삭제되었습니다.',
    food: deletedFood,
  });
});

// GET /feedback returns a simple rule-based diet summary for the current records.
app.get('/feedback', (req, res) => {
  const totalCount = foodList.length;
  const totalCalories = foodList.reduce((sum, food) => sum + food.calories, 0);
  const categorySummary = buildCategorySummary(foodList);
  const message = buildFeedbackMessage({ totalCount, totalCalories, categorySummary });

  res.json({
    totalCount,
    totalCalories,
    categorySummary,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`FoodLog API server is running on http://localhost:${PORT}`);
});
