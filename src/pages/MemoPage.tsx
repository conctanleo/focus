import { useState } from 'react'
import { Pin, Pencil, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

const COLORS: Record<string, string> = {
  orange: 'bg-orange-500/10 border-orange-500/20',
  blue: 'bg-blue-500/10 border-blue-500/20',
  green: 'bg-green-500/10 border-green-500/20',
  yellow: 'bg-yellow-500/10 border-yellow-500/20',
  purple: 'bg-purple-500/10 border-purple-500/20',
  pink: 'bg-pink-500/10 border-pink-500/20',
  gray: 'bg-white/5 border-white/8',
}

const DOT_COLORS: Record<string, string> = {
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  gray: 'bg-slate-500',
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
          className="flex-1 rounded-lg border border-white/8 bg-white/5 px-4 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
        />
      </div>

      {/* Create card */}
      <div className="mb-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
        <input
          type="text" value={newTitle} placeholder="Memo title"
          onChange={(e) => setNewTitle(e.target.value)}
          className="mb-2 w-full bg-transparent text-sm font-medium text-slate-200 outline-none placeholder:text-slate-500"
        />
        <textarea
          value={newContent} placeholder="Write something..."
          onChange={(e) => setNewContent(e.target.value)}
          className="mb-3 w-full resize-none bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-500"
          rows={2}
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {Object.keys(COLORS).map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={`h-5 w-5 rounded-full border-2 transition-all ${
                  c === newColor ? 'border-white scale-110' : 'border-transparent'
                } ${DOT_COLORS[c]}`}
              />
            ))}
          </div>
          <button
            onClick={() => newTitle && createMutation.mutate({ title: newTitle, content: newContent, color: newColor })}
            className="rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
          >
            Save
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading...</p>
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
                    className="mb-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none"
                    autoFocus
                  />
                  <textarea
                    value={editingMemo.content}
                    onChange={(e) => setEditingMemo({ ...editingMemo, content: e.target.value })}
                    className="mb-2 w-full resize-none bg-transparent text-sm text-slate-400 outline-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateMutation.mutate({ id: memo.id, title: editingMemo.title, content: editingMemo.content })}
                      className="rounded bg-indigo-500 px-2 py-0.5 text-xs text-white"
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingMemo(null)} className="rounded border border-white/8 px-2 py-0.5 text-xs text-slate-400">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-slate-200">{memo.title}</h3>
                    <div className="flex gap-1">
                      {memo.pinned && <Pin size={12} className="text-slate-400" />}
                    </div>
                  </div>
                  {memo.content && <p className="mt-1 text-sm text-slate-400 whitespace-pre-wrap">{memo.content}</p>}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      {new Date(memo.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex-1" />
                    <button
                      onClick={() => updateMutation.mutate({ id: memo.id, pinned: !memo.pinned })}
                      className="text-slate-500 transition-colors hover:text-slate-300"
                    >
                      <Pin size={12} />
                    </button>
                    <button onClick={() => setEditingMemo(memo)} className="text-slate-500 transition-colors hover:text-slate-300">
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(memo.id)}
                      className="text-slate-500 transition-colors hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {data?.length === 0 && !isLoading && (
        <p className="py-16 text-center text-sm text-slate-500">No memos yet. Create one above.</p>
      )}
    </div>
  )
}
