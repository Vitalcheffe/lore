'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface MarkdownRendererProps {
  content: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeString = String(children).replace(/\n$/, '')

          if (match) {
            return (
              <div className="relative group my-3">
                <div className="flex items-center justify-between px-4 py-2 bg-[#282c34] rounded-t-lg border-b border-white/10">
                  <span className="text-xs text-white/50 font-mono">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.5rem 0.5rem',
                    fontSize: '13px',
                    lineHeight: '1.5',
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
                <CopyButton text={codeString} />
              </div>
            )
          }

          return (
            <code
              className="bg-[#F3F4F6] text-emerald-700 px-1.5 py-0.5 rounded text-[13px] font-mono"
              {...props}
            >
              {children}
            </code>
          )
        },
        p({ children }) {
          return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
        },
        ul({ children }) {
          return <ul className="list-disc list-outside mb-3 ml-4 space-y-1">{children}</ul>
        },
        ol({ children }) {
          return <ol className="list-decimal list-outside mb-3 ml-4 space-y-1">{children}</ol>
        },
        li({ children }) {
          return <li className="text-sm leading-relaxed">{children}</li>
        },
        h1({ children }) {
          return <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0">{children}</h1>
        },
        h2({ children }) {
          return <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
        },
        h3({ children }) {
          return <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-3 border-emerald-300 pl-4 py-1 my-3 bg-emerald-50/50 rounded-r-lg italic text-[#52525B]">
              {children}
            </blockquote>
          )
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline hover:text-emerald-700">
              {children}
            </a>
          )
        },
        strong({ children }) {
          return <strong className="font-bold text-[#18181B]">{children}</strong>
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3">
              <table className="w-full text-sm border border-[#E5E7EB] rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          )
        },
        th({ children }) {
          return <th className="bg-gray-50 px-3 py-2 text-left font-semibold border-b border-[#E5E7EB]">{children}</th>
        },
        td({ children }) {
          return <td className="px-3 py-2 border-b border-[#E5E7EB]">{children}</td>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
