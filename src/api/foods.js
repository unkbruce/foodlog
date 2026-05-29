const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function requestJson(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error?.message || 'API 요청 중 오류가 발생했습니다.')
  }

  return data
}

export function fetchFoods() {
  return requestJson('/foods')
}

export function fetchFoodById(id) {
  return requestJson(`/foods/${id}`)
}

export function createFood(foodData) {
  return requestJson('/foods', {
    method: 'POST',
    body: JSON.stringify(foodData),
  })
}

export function updateFood(id, foodData) {
  return requestJson(`/foods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(foodData),
  })
}

export function deleteFood(id) {
  return requestJson(`/foods/${id}`, {
    method: 'DELETE',
  })
}

export function fetchFeedback() {
  return requestJson('/feedback')
}
