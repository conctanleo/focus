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
  orange: 'bg-orange-500', blue: 'bg-blue-500', green: 'bg-green-500',
  yellow: 'bg-yellow-500', purple: 'bg-purple-500', pink: 'bg-pink-500', gray: 'bg-slate-500',
}

interface Memo { id: string; title: string; content: string; color: string; pinned: boolean; updatedAt: string }

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
    mutationFn: (data: { id: string; title?: string; content?: string; color?: string; pinned?: boolean }) => api.patch(`/memos/${data.id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['memos'] }); setEditingMemo(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/memos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['memos'] }),
  })

  return (
    <div style={{ padding: 'var(--content-pad)' }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 'var(--section-gap)' }}>
        <input
          type="text" value={search} placeholder="Search memos..."
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-white/8 bg-white/5 text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
          style={{ borderRadius: 'var(--radius)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
        />
      </div>

      <div className="border border-dashed border-white/10 bg-white/[0.02]" style={{ borderRadius: 'var(--radius)', padding: 'var(--item-pad-y) var(--item-pad-x)', marginBottom: 'var(--section-gap)' }}>
        <input type="text" value={newTitle} placeholder="Memo title" onChange={(e) => setNewTitle(e.target.value)}
          className="mb-2 w-full bg-transparent font-medium text-slate-200 outline-none placeholder:text-slate-500" style={{ fontSize: 'var(--body-font)' }} />
        <textarea value={newContent} placeholder="Write something..." onChange={(e) => setNewContent(e.target.value)}
          className="mb-3 w-full resize-none bg-transparent text-slate-400 outline-none placeholder:text-slate-500" style={{ fontSize: 'var(--body-font)' }} rows={2} />
        <div className="flex items-center justify-between">
          <div className="flex" style={{ gap: 'clamp(4px, 0.3vw, 6px)' }}>
            {Object.keys(COLORS).map((c) => (
              <button key={c} onClick={() => setNewColor(c)}
                className={`rounded-full border-2 transition-all ${c === newColor ? 'border-white scale-110' : 'border-transparent'} ${DOT_COLORS[c]}`}
                style={{ width: 'clamp(14px, 1.2vw, 18px)', height: 'clamp(14px, 1.2vw, 18px)' }} />
            ))}
          </div>
          <button onClick={() => newTitle && createMutation.mutate({ title: newTitle, content: newContent, color: newColor })}
            className="bg-indigo-500 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--small-font)' }}>Save</button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-slate-400" style={{ fontSize: 'var(--body-font)' }}>Loading...</p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(var(--memo-card-min), 1fr))', gap: 'var(--section-gap)' }}>
          {data?.map((memo: Memo) => (
            <div key={memo.id} className={`border ${COLORS[memo.color] || COLORS.orange}`}
              style={{ borderRadius: 'var(--radius)', padding: 'var(--item-pad-y) var(--item-pad-x)' }}>
              {editingMemo?.id === memo.id ? (
                <div>
                  <input type="text" value={editingMemo.title} onChange={(e) => setEditingMemo({ ...editingMemo, title: e.target.value })}
                    className="mb-1 w-full bg-transparent font-medium text-slate-200 outline-none" style={{ fontSize: 'var(--body-font)' }} autoFocus />
                  <textarea value={editingMemo.content} onChange={(e) => setEditingMemo({ ...editingMemo, content: e.target.value })}
                    className="mb-2 w-full resize-none bg-transparent text-slate-400 outline-none" style={{ fontSize: 'var(--body-font)' }} rows={3} />
                  <div className="flex" style={{ gap: 'var(--item-gap)' }}>
                    <button onClick={() => updateMutation.mutate({ id: memo.id, title: editingMemo.title, content: editingMemo.content })}
                      className="bg-indigo-500 text-white" style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--btn-pad-y) var(--btn-pad-x)', fontSize: 'var(--small-font)' }}>Save</button>
                    <button onClick={() => setEditingMemo(null)} className="border border-white/8 text-slate-400"
                      style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--btn-pad-y) var(--btn-pad-x)', fontSize: 'var(--small-font)' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-slate-200" style={{ fontSize: 'var(--body-font)' }}>{memo.title}</h3>
                    {memo.pinned && <Pin style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} className="text-slate-400" />}
                  </div>
                  {memo.content && <p className="mt-1 text-slate-400 whitespace-pre-wrap" style={{ fontSize: 'var(--small-font)' }}>{memo.content}</p>}
                  <div className="mt-3 flex items-center" style={{ gap: 'var(--item-gap)' }}>
                    <span className="text-slate-500" style={{ fontSize: 'clamp(8px, 0.6vw, 10px)' }}>{new Date(memo.updatedAt).toLocaleDateString()}</span>
                    <div className="flex-1" />
                    <button onClick={() => updateMutation.mutate({ id: memo.id, pinned: !memo.pinned })} className="text-slate-500 transition-colors hover:text-slate-300">
                      <Pin style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} />
                    </button>
                    <button onClick={() => setEditingMemo(memo)} className="text-slate-500 transition-colors hover:text-slate-300">
                      <Pencil style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(memo.id)} className="text-slate-500 transition-colors hover:text-red-400">
                      <Trash2 style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {data?.length === 0 && !isLoading && (
        <p className="py-16 text-center text-slate-500" style={{ fontSize: 'var(--body-font)' }}>No memos yet. Create one above.</p>
      )}
    </div>
  )
}
