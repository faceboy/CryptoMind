import React from 'react'

export default function Toast({ message, type='info' }:{ message:string, type?: 'info'|'error'|'success' }){
  if(!message) return null
  const bg = type==='error' ? '#fee2e2' : type==='success' ? '#dcfce7' : '#e0f2fe'
  const color = type==='error' ? '#991b1b' : type==='success' ? '#166534' : '#0c4a6e'
  return (
    <div style={{position:'fixed', right:16, bottom:16, background:bg, color, padding:'10px 14px', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,.15)'}}>
      {message}
    </div>
  )
}
