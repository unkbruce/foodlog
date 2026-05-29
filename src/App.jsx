import { useEffect, useState } from 'react'
import {
  createFood,
  deleteFood,
  fetchFeedback,
  fetchFoodById,
  fetchFoods,
  updateFood,
} from './api/foods'
import './App.css'

const emptyForm = {
  name: '',
  category: '',
  calories: '',
  memo: '',
}

function App() {
  const [screen, setScreen] = useState('list')
  const [foods, setFoods] = useState([])
  const [selectedFoodId, setSelectedFoodId] = useState(null)
  const [selectedFood, setSelectedFood] = useState(null)
  const [isListLoading, setIsListLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [listError, setListError] = useState('')
  const [detailError, setDetailError] = useState('')

  const loadFoods = async () => {
    setIsListLoading(true)
    setListError('')

    try {
      const foodList = await fetchFoods()
      setFoods(foodList)
    } catch (error) {
      setListError(error.message)
    } finally {
      setIsListLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    fetchFoods()
      .then((foodList) => {
        if (isActive) setFoods(foodList)
      })
      .catch((error) => {
        if (isActive) setListError(error.message)
      })
      .finally(() => {
        if (isActive) setIsListLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  const goToList = () => {
    setScreen('list')
    setSelectedFoodId(null)
    setSelectedFood(null)
    setDetailError('')
  }

  const openDetail = async (foodId) => {
    setScreen('detail')
    setSelectedFoodId(foodId)
    setSelectedFood(null)
    setDetailError('')
    setIsDetailLoading(true)

    try {
      const food = await fetchFoodById(foodId)
      setSelectedFood(food)
    } catch (error) {
      setDetailError(error.message)
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleCreateFood = async (foodData) => {
    setIsSaving(true)

    try {
      await createFood(foodData)
      await loadFoods()
      goToList()
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateFood = async (foodData) => {
    setIsSaving(true)

    try {
      const updatedFood = await updateFood(selectedFoodId, foodData)
      setSelectedFood(updatedFood)
      await loadFoods()
      return updatedFood
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteFood = async () => {
    setIsSaving(true)

    try {
      await deleteFood(selectedFoodId)
      await loadFoods()
      goToList()
    } finally {
      setIsSaving(false)
    }
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
          isLoading={isListLoading}
          error={listError}
          onRetry={loadFoods}
          onAdd={() => setScreen('add')}
          onFeedback={() => setScreen('feedback')}
          onSelect={openDetail}
        />
      )}

      {screen === 'add' && (
        <FoodAdd
          isSaving={isSaving}
          onCancel={goToList}
          onCreate={handleCreateFood}
        />
      )}

      {screen === 'detail' && (
        <FoodDetail
          food={selectedFood}
          isLoading={isDetailLoading}
          isSaving={isSaving}
          error={detailError}
          onBack={goToList}
          onSave={handleUpdateFood}
          onDelete={handleDeleteFood}
        />
      )}

      {screen === 'feedback' && <FoodFeedback onBack={goToList} />}
    </main>
  )
}

function FoodList({ foods, isLoading, error, onRetry, onAdd, onFeedback, onSelect }) {
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

      {isLoading && <StatusMessage message="음식 기록을 불러오는 중입니다." />}
      {error && <StatusMessage type="error" message={error} onRetry={onRetry} />}

      {!isLoading && !error && (
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
                <span className="food-card-date">{formatFoodDate(food.createdAt)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </section>
  )
}

function FoodAdd({ isSaving, onCancel, onCreate }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // 서버에도 검증이 있지만, 사용자가 바로 알 수 있도록 화면에서 먼저 확인합니다.
    if (!form.name.trim() || !form.category.trim() || !form.calories) {
      setError('음식 이름, 카테고리, 칼로리는 꼭 입력해주세요.')
      return
    }

    try {
      await onCreate({
        name: form.name.trim(),
        category: form.category.trim(),
        calories: Number(form.calories),
        memo: form.memo.trim(),
      })
    } catch (apiError) {
      setError(apiError.message)
    }
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
        submitLabel={isSaving ? '저장 중...' : '저장하기'}
        disabled={isSaving}
        onChange={updateForm}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </section>
  )
}

function FoodDetail({ food, isLoading, isSaving, error, onBack, onSave, onDelete }) {
  if (isLoading) {
    return (
      <section className="screen-section">
        <ScreenTitle title="음식 기록 상세" description="선택한 기록을 불러오고 있습니다." />
        <StatusMessage message="상세 정보를 불러오는 중입니다." />
      </section>
    )
  }

  if (error || !food) {
    return (
      <section className="screen-section">
        <ScreenTitle title="음식 기록 상세" description="선택한 기록을 확인할 수 없습니다." />
        <StatusMessage type="error" message={error || '선택한 기록을 찾을 수 없습니다.'} />
        <button type="button" className="secondary-button full-button" onClick={onBack}>
          목록으로
        </button>
      </section>
    )
  }

  return (
    <FoodDetailForm
      key={food.id}
      food={food}
      isSaving={isSaving}
      onBack={onBack}
      onSave={onSave}
      onDelete={onDelete}
    />
  )
}

function FoodDetailForm({ food, isSaving, onBack, onSave, onDelete }) {
  const [form, setForm] = useState({
    name: food.name,
    category: food.category,
    calories: String(food.calories),
    memo: food.memo || '',
  })
  const [formError, setFormError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setFormError('')
    setSavedMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.category.trim() || !form.calories) {
      setFormError('음식 이름, 카테고리, 칼로리는 꼭 입력해주세요.')
      return
    }

    try {
      await onSave({
        name: form.name.trim(),
        category: form.category.trim(),
        calories: Number(form.calories),
        memo: form.memo.trim(),
      })
      setSavedMessage('수정 내용이 서버 데이터에 반영되었습니다.')
    } catch (apiError) {
      setFormError(apiError.message)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete()
    } catch (apiError) {
      setFormError(apiError.message)
    }
  }

  return (
    <section className="screen-section">
      <ScreenTitle
        title="음식 기록 상세"
        description="기록 내용을 확인하고 필요한 항목을 수정합니다."
      />
      <div className="detail-meta">
        <span>ID {food.id}</span>
        <span>기록 일시 {formatFoodDate(food.createdAt)}</span>
      </div>
      <FoodForm
        form={form}
        error={formError || savedMessage}
        submitLabel={isSaving ? '저장 중...' : '저장하기'}
        disabled={isSaving}
        onChange={updateForm}
        onSubmit={handleSubmit}
        onCancel={onBack}
        cancelLabel="목록으로"
      />
      <button
        type="button"
        className="danger-button full-button"
        disabled={isSaving}
        onClick={handleDelete}
      >
        {isSaving ? '처리 중...' : '삭제'}
      </button>
    </section>
  )
}

function FoodFeedback({ onBack }) {
  const [feedback, setFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFeedback = async () => {
    setIsLoading(true)
    setError('')

    try {
      const feedbackData = await fetchFeedback()
      setFeedback(feedbackData)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    fetchFeedback()
      .then((feedbackData) => {
        if (isActive) setFeedback(feedbackData)
      })
      .catch((apiError) => {
        if (isActive) setError(apiError.message)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  const categorySummary = Object.entries(feedback?.categorySummary || {})

  return (
    <section className="screen-section">
      <ScreenTitle
        title="식단 피드백"
        description="서버의 규칙 기반 피드백을 보여줍니다."
      />

      {isLoading && <StatusMessage message="식단 피드백을 불러오는 중입니다." />}
      {error && <StatusMessage type="error" message={error} onRetry={loadFeedback} />}

      {!isLoading && !error && feedback && (
        <>
          <div className="summary-grid">
            <SummaryBox label="총 기록 수" value={String(feedback.totalCount)} unit="개" />
            <SummaryBox label="총 칼로리" value={String(feedback.totalCalories)} unit="kcal" />
          </div>

          <div className="panel-block">
            <h2>카테고리 요약</h2>
            {categorySummary.length === 0 ? (
              <p>아직 카테고리 기록이 없습니다.</p>
            ) : (
              <div className="category-list">
                {categorySummary.map(([category, count]) => (
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
        </>
      )}

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
  disabled = false,
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
          disabled={disabled}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="예: 사과"
        />
      </label>
      <label>
        카테고리
        <input
          value={form.category}
          disabled={disabled}
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
          disabled={disabled}
          onChange={(event) => onChange('calories', event.target.value)}
          placeholder="예: 95"
        />
      </label>
      <label>
        메모
        <textarea
          value={form.memo}
          disabled={disabled}
          onChange={(event) => onChange('memo', event.target.value)}
          placeholder="식사 상황이나 간단한 메모"
          rows="4"
        />
      </label>

      {error && <p className="form-message">{error}</p>}

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={disabled}>
          {submitLabel}
        </button>
        <button type="button" className="secondary-button" disabled={disabled} onClick={onCancel}>
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

function StatusMessage({ type = 'info', message, onRetry }) {
  return (
    <div className={`status-message ${type}`}>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="secondary-button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  )
}

function formatFoodDate(value) {
  if (!value) return '-'

  return value.replace('T', ' ').slice(0, 16)
}

export default App
