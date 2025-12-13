import React, { useEffect, useState } from 'react'
import api from '../../../utils/apiClient.js'

export default function ComponentFeaturesManager() {
  const [features, setFeatures] = useState([])
  const [form, setForm] = useState({ id: null, name: '', description: '', isActive: false })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function fetchFeatures() {
    setLoading(true)
    try {
      const res = await api.get('/api/componentfeature')
      setFeatures(res.data || [])
    } catch (err) {
      setError('خطا در دریافت لیست کامپوننت‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatures()
  }, [])

  async function handleSave() {
    try {
      if (!form.name.trim()) {
        setError("نام کامپوننت نباید خالی باشد")
        return
      }

      if (form.id) {
        // ویرایش
        const payload = {
          description: form.description,
          isActive: form.isActive
        }
        await api.put(`/api/componentfeature/${form.id}`, { ...form, ...payload })
      } else {
        // افزودن
        await api.post('/api/componentfeature', form)
      }

      setForm({ id: null, name: '', description: '', isActive: false })
      setError(null)
      fetchFeatures()
    } catch (err) {
      setError('خطا در ذخیره کامپوننت')
    }
  }

  async function handleToggle(id, isActive) {
    try {
      await api.put(`/api/componentfeature/${id}/toggle`, isActive)
      fetchFeatures()
    } catch (err) {
      setError('خطا در تغییر وضعیت کامپوننت')
    }
  }

  function handleEdit(feature) {
    setForm(feature)
  }

  return (
    <div className="container mt-4">
      <h5 className="mb-3">مدیریت کامپوننت‌ها</h5>

      {/* فرم افزودن/ویرایش */}
      <div className="card mb-3">
        <div className="card-body p-3">
          <div className="mb-2">
            <label className="form-label small">نام کامپوننت</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={!form.id} // 👈 فقط هنگام ویرایش غیرقابل تغییر
            />
          </div>
          <div className="mb-2">
            <label className="form-label small">توضیحات</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-check form-check-inline mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
            />
            <label className="form-check-label small">فعال</label>
          </div>

          <div className="mt-2">
            <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
              {form.id ? 'ذخیره تغییرات' : 'افزودن کامپوننت'}
            </button>
            {form.id && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setForm({ id: null, name: '', description: '', isActive: false })}
              >
                انصراف
              </button>
            )}
          </div>
        </div>
      </div>

      {/* لیست کامپوننت‌ها */}
      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered table-hover table-sm align-middle">
          <thead className="table-light">
            <tr>
              <th className="small">نام</th>
              <th className="small">توضیحات</th>
              <th className="small">فعال؟</th>
              <th className="small">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {features.map(f => (
              <tr key={f.id}>
                <td className="small">{f.name}</td>
                <td className="small">{f.description}</td>
                <td className="small">{f.isActive ? '✅' : '❌'}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(f)}>ویرایش</button>
                  <button className="btn btn-sm btn-warning" onClick={() => handleToggle(f.id, !f.isActive)}>
                    {f.isActive ? 'غیرفعال' : 'فعال'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
