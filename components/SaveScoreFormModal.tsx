"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SaveScoreFormModalProps {
  onClose: () => void
  isMobile: boolean
  currentScore: number
  onSave: (playerName: string, twitterHandle?: string) => void
}

export default function SaveScoreFormModal({ onClose, isMobile, currentScore, onSave }: SaveScoreFormModalProps) {
  const [playerName, setPlayerName] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsSaving(true)

    try {
      // Call the onSave callback with the form data
      onSave(playerName, twitterHandle.trim() || undefined)
      setMessage("分数保存成功！")
      setPlayerName("")
      setTwitterHandle("")
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      setMessage("保存分数失败，请重试。")
    }
    setIsSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2">
      <div
        className={`bg-black/95 ${isMobile ? "p-4 mx-2" : "p-8 mx-4"} rounded-lg border-2 border-white ${isMobile ? "w-full max-w-sm" : "max-w-md w-full"} relative shadow-2xl`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl font-bold">
          ×
        </button>

        <h2
          className={`${isMobile ? "text-lg" : "text-xl"} font-bold mb-6 text-white text-left`}
          style={{
            fontFamily: '"8-BIT WONDER", monospace',
          }}
        >
          保存到排行榜
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="playerName"
              className="text-white text-sm"
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
            >
              玩家姓名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
              className="mt-2 block w-full bg-gray-800 text-white border-gray-600 rounded-md p-3"
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
              placeholder="输入您的姓名"
            />
          </div>

          <div>
            <Label
              htmlFor="twitterHandle"
              className="text-white text-sm"
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
            >
              推特账号（可选）- 用于分享
            </Label>
            <Input
              id="twitterHandle"
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              className="mt-2 block w-full bg-gray-800 text-white border-gray-600 rounded-md p-3"
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
              placeholder="@您的推特用户名（可选）"
            />
            <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: '"8-BIT WONDER", monospace' }}>
              添加推特账号以分享成绩
            </p>
          </div>

          <div>
            <Label htmlFor="score" className="text-white text-sm" style={{ fontFamily: '"8-BIT WONDER", monospace' }}>
              分数：
            </Label>
            <Input
              id="score"
              type="text"
              value={currentScore}
              readOnly
              className="mt-2 block w-full bg-gray-700 text-white border-gray-600 rounded-md p-3"
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
            />
          </div>

          {message && (
            <p
              className={`text-center ${message.includes("成功") ? "text-green-500" : "text-red-500"}`}
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
            >
              {message}
            </p>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
              style={{ fontFamily: '"8-BIT WONDER", monospace' }}
            >
              {isSaving ? "保存中..." : "保存分数"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
