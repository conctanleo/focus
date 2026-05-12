import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

const COLORS: Record<string, string> = {
  orange: 'bg-orange-50 border-orange-200',
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  purple: 'bg-purple-50 border-purple-200',
  pink: 'bg-pink-50 border-pink-200',
  gray: 'bg-neutral-100 border-neutral-200',
}

interface Memo {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  updatedAt: string
}

export default function MemoPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newColor, setNewColor] = useState('orange')

  const { data, isLoading } = useQuery({
    queryKey: ['memos', search],
    queryFn: () => api.get(`/memos?search=${search}`).then((r) => r.data.memos),
  })

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; color: string }) => api.post('/memos', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['memos'] }); setNewTitle(''); setNewContent('') },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; title?: string; content?: string; color?: string; pinned?: boolean }) =>
      api.patch(`/memos/${data.id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['memos'] }); setEditingMemo(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/memos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['memos'] }),
  })

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <input
          type="text" value={search} placeholder="Search memos..."
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-neutral-900"
        />
      </div>

      {/* Create card */}
      <div className="mb-6 rounded-xl border border-dashed border-neutral-300 bg-white p-4">
        <input
          type="text" value={newTitle} placeholder="Memo title"
          onChange={(e) => setNewTitle(e.target.value)}
          className="mb-2 w-full text-sm font-medium outline-none"
        />
        <textarea
          value={newContent} placeholder="Write something..."
          onChange={(e) => setNewContent(e.target.value)}
          className="mb-3 w-full resize-none text-sm text-neutral-500 outline-none"
          rows={2}
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {Object.keys(COLORS).map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={`h-5 w-5 rounded-full border ${c === newColor ? 'ring-1 ring-neutral-900 ring-offset-1' : ''} ${COLORS[c].split(' ')[0]}`}
              />
            ))}
          </div>
          <button
            onClick={() => newTitle && createMutation.mutate({ title: newTitle, content: newContent, color: newColor })}
            className="rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
          >
            Save
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {data?.map((memo: Memo) => (
            <div
              key={memo.id}
              className={`mb-4 break-inside-avoid rounded-xl border p-4 ${COLORS[memo.color] || COLORS.orange}`}
            >
              {editingMemo?.id === memo.id ? (
                <div>
                  <input
                    type="text" value={editingMemo.title}
                    onChange={(e) => setEditingMemo({ ...editingMemo, title: e.target.value })}
                    className="mb-1 w-full bg-transparent text-sm font-medium outline-none"
                    autoFocus
                  />
                  <textarea
                    value={editingMemo.content}
                    onChange={(e) => setEditingMemo({ ...editingMemo, content: e.target.value })}
                    className="mb-2 w-full resize-none bg-transparent text-sm text-neutral-500 outline-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateMutation.mutate({ id: memo.id, title: editingMemo.title, content: editingMemo.content })}
                      className="rounded bg-neutral-900 px-2 py-0.5 text-xs text-white"
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingMemo(null)} className="rounded border px-2 py-0.5 text-xs text-neutral-500">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium">{memo.title}</h3>
                    <div className="flex gap-1">
                      {memo.pinned && <span className="text-xs">📌</span>}
                    </div>
                  </div>
                  {memo.content && <p className="mt-1 text-sm text-neutral-500 whitespace-pre-wrap">{memo.content}</p>}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400">
                      {new Date(memo.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex-1" />
                    <button
                      onClick={() => updateMutation.mutate({ id: memo.id, pinned: !memo.pinned })}
                      className="text-xs text-neutral-400 hover:text-neutral-600"
                    >
                      📌
                    </button>
                    <button onClick={() => setEditingMemo(memo)} className="text-xs text-neutral-400 hover:text-neutral-600">
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(memo.id)}
                      className="text-xs text-neutral-400 hover:text-red-500"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {data?.length === 0 && !isLoading && (
        <p className="py-16 text-center text-sm text-neutral-400">No memos yet. Create one above.</p>
      )}
    </div>
  )
}
