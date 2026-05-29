import { useMemo, useState } from 'react'
import './App.css'

const initialFoods = [
  {
    id: 1,
    name: '사과',
    category: '과일',
    calories: 95,
    memo: '오후 간식으로 먹음',
    createdAt: '2026-05-29 11:09',
  },
  {
    id: 2,
    name: '밥',
    category: '곡류',
    calories: 206,
    memo: '점심으로 먹음',
    createdAt: '2026-05-29 12:30',
  },
  {
    id: 3,
    name: '달걀',
    category: '단백질',
    calories: 78,
    memo: '아침으로 먹음',
    createdAt: '2026-05-29 08:15',
  },
]

const emptyForm = {
  name: '',
  category: '',
  calories: '',
  memo: '',
}

function App() {
  const [screen, setScreen] = useState('list')
  const [foods, setFoods] = useState(initialFoods)
  const [selectedFoodId, setSelectedFoodId] = useState(null)

  const selectedFood = foods.find((food) => food.id === selectedFoodId)

  const goToList = () => {
    setScreen('list')
    setSelectedFoodId(null)
  }

  const openDetail = (foodId) => {
    setSelectedFoodId(foodId)
    setScreen('detail')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-logo">FoodLog</p>
        <p className="app-subtitle">간단한 음식 기록과 식단 피드백</p>
      </header>

      {screen === 'list' && (
        <FoodList
          foods={foods}
          onAdd={() => setScreen('add')}
          onFeedback={() => setScreen('feedback')}
          onSelect={openDetail}
        />
      )}

      {screen === 'add' && (
        <FoodAdd
          onCancel={goToList}
          onCreate={(food) => {
            setFoods((currentFoods) => [food, ...currentFoods])
            goToList()
          }}
        />
      )}

      {screen === 'detail' && (
        <FoodDetail
          food={selectedFood}
          onBack={goToList}
          onSave={(updatedFood) => {
            setFoods((currentFoods) =>
              currentFoods.map((food) =>
                food.id === updatedFood.id ? updatedFood : food,
              ),
            )
          }}
          onDelete={(foodId) => {
            setFoods((currentFoods) =>
              currentFoods.filter((food) => food.id !== foodId),
            )
            goToList()
          }}
        />
      )}

      {screen === 'feedback' && <FoodFeedback foods={foods} onBack={goToList} />}
    </main>
  )
}

function FoodList({ foods, onAdd, onFeedback, onSelect }) {
  const totalCalories = foods.reduce((sum, food) => sum + Number(food.calories), 0)

  return (
    <section className="screen-section">
      <div className="section-heading">
        <div>
          <h1>오늘의 음식 기록</h1>
          <p>
            {foods.length}개 기록 · {totalCalories} kcal
          </p>
        </div>
        <div className="button-row compact-actions">
          <button type="button" className="primary-button" onClick={onAdd}>
            + 음식 추가
          </button>
          <button type="button" className="secondary-button" onClick={onFeedback}>
            피드백 보기
          </button>
        </div>
      </div>

      <div className="food-list" aria-label="음식 기록 목록">
        {foods.length === 0 ? (
          <div className="empty-state">
            <h2>아직 기록이 없습니다</h2>
            <p>먹은 음식을 추가하면 이곳에 목록이 표시됩니다.</p>
          </div>
        ) : (
          foods.map((food) => (
            <button
              key={food.id}
              type="button"
              className="food-card"
              onClick={() => onSelect(food.id)}
            >
              <span className="food-card-main">
                <strong>{food.name}</strong>
                <span>
                  {food.category} / {food.calories} kcal
                </span>
              </span>
              <span className="food-card-memo">{food.memo || '메모 없음'}</span>
              <span className="food-card-date">{food.createdAt}</span>
            </button>
          ))
        )}
      </div>
    </section>
  )
}

function FoodAdd({ onCancel, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // 실제 API 연동 전까지는 화면에서 최소 입력 검증만 처리합니다.
    if (!form.name.trim() || !form.category.trim() || !form.calories) {
      setError('음식 이름, 카테고리, 칼로리는 꼭 입력해주세요.')
      return
    }

    onCreate({
      id: Date.now(),
      name: form.name.trim(),
      category: form.category.trim(),
      calories: Number(form.calories),
      memo: form.memo.trim(),
      createdAt: formatNow(),
    })
  }

  return (
    <section className="screen-section">
      <ScreenTitle
        title="음식 기록 추가"
        description="먹은 음식을 간단히 입력해 새 기록을 만듭니다."
      />
      <FoodForm
        form={form}
        error={error}
        submitLabel="저장하기"
        onChange={updateForm}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </section>
  )
}

function FoodDetail({ food, onBack, onSave, onDelete }) {
  const [form, setForm] = useState(() =>
    food
      ? {
          name: food.name,
          category: food.category,
          calories: String(food.calories),
          memo: food.memo,
        }
      : emptyForm,
  )
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  if (!food) {
    return (
      <section className="screen-section">
        <ScreenTitle title="음식 기록 상세" description="선택한 기록을 찾을 수 없습니다." />
        <button type="button" className="secondary-button full-button" onClick={onBack}>
          목록으로
        </button>
      </section>
    )
  }

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setSavedMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.category.trim() || !form.calories) {
      setError('음식 이름, 카테고리, 칼로리는 꼭 입력해주세요.')
      return
    }

    onSave({
      ...food,
      name: form.name.trim(),
      category: form.category.trim(),
      calories: Number(form.calories),
      memo: form.memo.trim(),
    })
    setError('')
    setSavedMessage('수정 내용이 mock 데이터에 반영되었습니다.')
  }

  return (
    <section className="screen-section">
      <ScreenTitle
        title="음식 기록 상세"
        description="기록 내용을 확인하고 필요한 항목을 수정합니다."
      />
      <div className="detail-meta">
        <span>ID {food.id}</span>
        <span>기록 일시 {food.createdAt}</span>
      </div>
      <FoodForm
        form={form}
        error={error || savedMessage}
        submitLabel="저장하기"
        onChange={updateForm}
        onSubmit={handleSubmit}
        onCancel={onBack}
        cancelLabel="목록으로"
      />
      <button
        type="button"
        className="danger-button full-button"
        onClick={() => onDelete(food.id)}
      >
        삭제
      </button>
    </section>
  )
}

function FoodFeedback({ foods, onBack }) {
  const feedback = useMemo(() => buildFeedback(foods), [foods])

  return (
    <section className="screen-section">
      <ScreenTitle
        title="식단 피드백"
        description="현재 기록을 기준으로 간단한 규칙 기반 피드백을 보여줍니다."
      />

      <div className="summary-grid">
        <SummaryBox label="총 기록 수" value={String(feedback.totalCount)} unit="개" />
        <SummaryBox label="총 칼로리" value={String(feedback.totalCalories)} unit="kcal" />
      </div>

      <div className="panel-block">
        <h2>카테고리 요약</h2>
        {feedback.categorySummary.length === 0 ? (
          <p>아직 카테고리 기록이 없습니다.</p>
        ) : (
          <div className="category-list">
            {feedback.categorySummary.map(([category, count]) => (
              <span key={category}>
                {category}: {count}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="panel-block feedback-message">
        <h2>피드백</h2>
        <p>{feedback.message}</p>
      </div>

      <button type="button" className="secondary-button full-button" onClick={onBack}>
        목록으로
      </button>
    </section>
  )
}

function FoodForm({
  form,
  error,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
  cancelLabel = '취소',
}) {
  return (
    <form className="food-form" onSubmit={onSubmit}>
      <label>
        음식 이름
        <input
          value={form.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="예: 사과"
        />
      </label>
      <label>
        카테고리
        <input
          value={form.category}
          onChange={(event) => onChange('category', event.target.value)}
          placeholder="예: 과일"
        />
      </label>
      <label>
        칼로리
        <input
          type="number"
          min="0"
          value={form.calories}
          onChange={(event) => onChange('calories', event.target.value)}
          placeholder="예: 95"
        />
      </label>
      <label>
        메모
        <textarea
          value={form.memo}
          onChange={(event) => onChange('memo', event.target.value)}
          placeholder="식사 상황이나 간단한 메모"
          rows="4"
        />
      </label>

      {error && <p className="form-message">{error}</p>}

      <div className="button-row">
        <button type="submit" className="primary-button">
          {submitLabel}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </form>
  )
}

function ScreenTitle({ title, description }) {
  return (
    <div className="screen-title">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

function SummaryBox({ label, value, unit }) {
  return (
    <div className="summary-box">
      <span>{label}</span>
      <strong>
        {value} <small>{unit}</small>
      </strong>
    </div>
  )
}

function buildFeedback(foods) {
  const totalCount = foods.length
  const totalCalories = foods.reduce((sum, food) => sum + Number(food.calories), 0)
  const categoryCounts = foods.reduce((counts, food) => {
    counts[food.category] = (counts[food.category] || 0) + 1
    return counts
  }, {})
  const categorySummary = Object.entries(categoryCounts)
  const mostRepeatedCategory = categorySummary.find(([, count]) => count >= 3)

  let message = '다양한 카테고리의 음식이 기록되어 있습니다. 꾸준히 식사 후 기록해보세요.'

  if (totalCount < 3) {
    message = '아직 기록이 적습니다. 식사 후 꾸준히 기록하면 더 참고하기 좋은 피드백을 볼 수 있습니다.'
  } else if (totalCalories >= 2000) {
    message = '오늘 섭취 칼로리가 높은 편입니다. 다음 식사는 조금 가볍게 구성해보세요.'
  } else if (mostRepeatedCategory) {
    message = `${mostRepeatedCategory[0]} 카테고리에 기록이 집중되어 있습니다. 다양한 음식을 함께 기록해보세요.`
  }

  return { totalCount, totalCalories, categorySummary, message }
}

function formatNow() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export default App
