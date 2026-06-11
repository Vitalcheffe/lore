'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MousePointer2,
  Plus,
  Link2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Search,
  X,
  ChevronRight,
  Pencil,
  Network,
  Filter,
  Copy,
  Check,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { GraphEmptyState } from '@/components/app/empty-states'
import confetti from 'canvas-confetti'

// ─── Types ─────────────────────────────────────────────────
interface GraphNode {
  id: string
  title: string
  type: 'concept' | 'person' | 'project' | 'resource' | 'idea' | 'feature'
  x: number
  y: number
  content: string
  tags?: string[]
  createdAt?: string
}

interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  type: 'related' | 'depends_on' | 'created_by' | 'references' | 'part_of'
  strength: number
}

type ToolMode = 'select' | 'addEdge' | 'delete'

// ─── Color Map ─────────────────────────────────────────────
const typeColors: Record<string, string> = {
  concept: '#059669',
  person: '#3B82F6',
  project: '#7C3AED',
  resource: '#EA580C',
  idea: '#DB2777',
  feature: '#0891B2',
}

const typeBgColors: Record<string, string> = {
  concept: 'rgba(5,150,105,0.10)',
  person: 'rgba(59,130,246,0.10)',
  project: 'rgba(124,58,237,0.10)',
  resource: 'rgba(234,88,12,0.10)',
  idea: 'rgba(219,39,119,0.10)',
  feature: 'rgba(8,145,178,0.10)',
}

const typeBorderColors: Record<string, string> = {
  concept: 'rgba(5,150,105,0.25)',
  person: 'rgba(59,130,246,0.25)',
  project: 'rgba(124,58,237,0.25)',
  resource: 'rgba(234,88,12,0.25)',
  idea: 'rgba(219,39,119,0.25)',
  feature: 'rgba(8,145,178,0.25)',
}

const edgeStyleMap: Record<string, { strokeDasharray: string; strokeWidth: number }> = {
  related: { strokeDasharray: '', strokeWidth: 1.5 },
  depends_on: { strokeDasharray: '6 4', strokeWidth: 1.5 },
  created_by: { strokeDasharray: '2 3', strokeWidth: 1.5 },
  references: { strokeDasharray: '', strokeWidth: 2.5 },
  part_of: { strokeDasharray: '4 2 1 2', strokeWidth: 1.5 },
}

const edgeTypeIcons: Record<string, string> = {
  related: '→',
  depends_on: '⇢',
  created_by: '✦',
  references: '§',
  part_of: '⊕',
}

// ─── API Response Types ─────────────────────────────────────
interface ApiNode {
  id: string
  title: string
  content: string
  type: string
  color: string
  icon: string | null
  source: string | null
  tags: string | null
  isFavorite: boolean
  x: number | null
  y: number | null
  createdAt: string
  updatedAt: string
}

interface ApiEdge {
  id: string
  userId: string
  sourceId: string
  targetId: string
  label: string | null
  type: string
  strength: number
  createdAt: string
}

// ─── API Response Mappers ──────────────────────────────────
function mapApiNodeToGraphNode(apiNode: ApiNode): GraphNode {
  return {
    id: apiNode.id,
    title: apiNode.title,
    type: apiNode.type as GraphNode['type'],
    x: apiNode.x ?? 400 + (Math.random() - 0.5) * 200,
    y: apiNode.y ?? 300 + (Math.random() - 0.5) * 200,
    content: apiNode.content || '',
    tags: apiNode.tags
      ? apiNode.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    createdAt: apiNode.createdAt
      ? new Date(apiNode.createdAt).toISOString().split('T')[0]
      : undefined,
  }
}

function mapApiEdgeToGraphEdge(apiEdge: ApiEdge): GraphEdge {
  return {
    id: apiEdge.id,
    source: apiEdge.sourceId,
    target: apiEdge.targetId,
    label: apiEdge.label || 'connected',
    type: apiEdge.type as GraphEdge['type'],
    strength: apiEdge.strength ?? 5,
  }
}

// ─── Force-Directed Layout Simulation ──────────────────────
function applyForceLayout(nodes: GraphNode[], edges: GraphEdge[], iterations: number = 50): GraphNode[] {
  const newNodes = nodes.map((n) => ({ ...n }))
  const repulsionStrength = 8000
  const attractionStrength = 0.005
  const damping = 0.9
  const minDistance = 80

  const velocities: Record<string, { vx: number; vy: number }> = {}
  newNodes.forEach((n) => (velocities[n.id] = { vx: 0, vy: 0 }))

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion between all pairs
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const dx = newNodes[i].x - newNodes[j].x
        const dy = newNodes[i].y - newNodes[j].y
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), minDistance)
        const force = repulsionStrength / (dist * dist)
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        velocities[newNodes[i].id].vx += fx
        velocities[newNodes[i].id].vy += fy
        velocities[newNodes[j].id].vx -= fx
        velocities[newNodes[j].id].vy -= fy
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const sourceNode = newNodes.find((n) => n.id === edge.source)
      const targetNode = newNodes.find((n) => n.id === edge.target)
      if (!sourceNode || !targetNode) continue
      const dx = targetNode.x - sourceNode.x
      const dy = targetNode.y - sourceNode.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const force = dist * attractionStrength
      const fx = (dx / Math.max(dist, 1)) * force
      const fy = (dy / Math.max(dist, 1)) * force
      velocities[sourceNode.id].vx += fx
      velocities[sourceNode.id].vy += fy
      velocities[targetNode.id].vx -= fx
      velocities[targetNode.id].vy -= fy
    }

    // Center gravity
    const centerX = 400
    const centerY = 300
    for (const node of newNodes) {
      velocities[node.id].vx += (centerX - node.x) * 0.0005
      velocities[node.id].vy += (centerY - node.y) * 0.0005
    }

    // Apply velocities with damping
    const alpha = 1 - iter / iterations
    for (const node of newNodes) {
      velocities[node.id].vx *= damping
      velocities[node.id].vy *= damping
      node.x += velocities[node.id].vx * alpha
      node.y += velocities[node.id].vy * alpha
    }
  }

  return newNodes
}

// ─── Copy ID Button ────────────────────────────────────────
function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="w-5 h-5 rounded flex items-center justify-center text-[#A1A1AA] dark:text-[#71717A] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] transition-all shrink-0"
      title="Copy node ID"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

// ─── Node Hover Preview Card ───────────────────────────────
function NodeHoverPreview({ node, visible }: { node: GraphNode; visible: boolean }) {
  const color = typeColors[node.type] || '#9CA3AF'
  const contentPreview = node.content ? node.content.slice(0, 100) + (node.content.length > 100 ? '...' : '') : 'No description'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="pointer-events-none absolute z-50 w-64 rounded-xl bg-white dark:bg-[#0F0F12] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-xl shadow-black/8 overflow-hidden"
        >
          {/* Colored top accent */}
          <div className="h-1" style={{ background: color }} />

          <div className="p-3 space-y-2">
            {/* Title + Type */}
            <div className="flex items-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: color }}
              >
                <span className="text-white text-[8px] font-bold">
                  {node.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#18181B] dark:text-[#FAFAFA] truncate">{node.title}</p>
                <Badge
                  className="mt-0.5 text-[8px] font-semibold capitalize px-1.5 py-0"
                  style={{
                    background: typeBgColors[node.type],
                    color: color,
                    borderColor: typeBorderColors[node.type],
                    borderWidth: 1,
                  }}
                >
                  {node.type}
                </Badge>
              </div>
            </div>

            {/* Content Preview */}
            <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed line-clamp-3">
              {contentPreview}
            </p>

            {/* Tags */}
            {node.tags && node.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {node.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#27272A] text-[#71717A] dark:text-[#A1A1AA] font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {node.tags.length > 3 && (
                  <span className="text-[8px] px-1.5 py-0.5 text-[#A1A1AA] dark:text-[#71717A]">
                    +{node.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Created Date */}
            {node.createdAt && (
              <p className="text-[8px] text-[#A1A1AA] dark:text-[#71717A]">
                Created {node.createdAt}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Minimap Component ──────────────────────────────────────
function Minimap({
  nodes,
  edges,
  pan,
  zoom,
  viewBoxWidth,
  viewBoxHeight,
  onNavigate,
}: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  pan: { x: number; y: number }
  zoom: number
  viewBoxWidth: number
  viewBoxHeight: number
  onNavigate: (panX: number, panY: number) => void
}) {
  const minimapRef = useRef<SVGSVGElement>(null)

  // Calculate bounds of all nodes
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 900, maxY: 600 }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const n of nodes) {
      minX = Math.min(minX, n.x)
      minY = Math.min(minY, n.y)
      maxX = Math.max(maxX, n.x)
      maxY = Math.max(maxY, n.y)
    }
    const pad = 50
    return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad }
  }, [nodes])

  const bw = bounds.maxX - bounds.minX || 1
  const bh = bounds.maxY - bounds.minY || 1
  const minimapW = 120
  const minimapH = 80

  // Viewport rect in minimap coordinates
  const vpLeft = (-pan.x / zoom) / bw * minimapW
  const vpTop = (-pan.y / zoom) / bh * minimapH
  const vpW = (viewBoxWidth / zoom) / bw * minimapW
  const vpH = (viewBoxHeight / zoom) / bh * minimapH

  const handleMinimapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!minimapRef.current) return
    const rect = minimapRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    // Map back to world coordinates
    const worldX = (clickX / minimapW) * bw + bounds.minX
    const worldY = (clickY / minimapH) * bh + bounds.minY
    // Pan so that worldX is at center of viewport
    const panX = -(worldX * zoom - viewBoxWidth / 2)
    const panY = -(worldY * zoom - viewBoxHeight / 2)
    onNavigate(panX, panY)
  }

  return (
    <svg
      ref={minimapRef}
      width={minimapW}
      height={minimapH}
      className="rounded-lg cursor-pointer bg-white/85 dark:bg-[#18181B]/85 border border-black/[0.08] dark:border-white/[0.08]"
      onClick={handleMinimapClick}
    >
      {/* Edges as thin lines */}
      {edges.map((edge) => {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
        if (!source || !target) return null
        const sx = ((source.x - bounds.minX) / bw) * minimapW
        const sy = ((source.y - bounds.minY) / bh) * minimapH
        const tx = ((target.x - bounds.minX) / bw) * minimapW
        const ty = ((target.y - bounds.minY) / bh) * minimapH
        return (
          <line
            key={`mm-edge-${edge.id}`}
            x1={sx} y1={sy} x2={tx} y2={ty}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={0.5}
          />
        )
      })}
      {/* Nodes as tiny dots */}
      {nodes.map((node) => {
        const nx = ((node.x - bounds.minX) / bw) * minimapW
        const ny = ((node.y - bounds.minY) / bh) * minimapH
        return (
          <circle
            key={`mm-node-${node.id}`}
            cx={nx}
            cy={ny}
            r={2}
            fill={typeColors[node.type] || '#9CA3AF'}
            opacity={0.7}
          />
        )
      })}
      {/* Viewport rectangle */}
      <rect
        x={Math.max(0, vpLeft)}
        y={Math.max(0, vpTop)}
        width={Math.min(minimapW - Math.max(0, vpLeft), vpW)}
        height={Math.min(minimapH - Math.max(0, vpTop), vpH)}
        fill="rgba(5,150,105,0.08)"
        stroke="rgba(5,150,105,0.3)"
        strokeWidth={1}
        rx={2}
      />
    </svg>
  )
}

// ─── Main Component ────────────────────────────────────────
export default function KnowledgeGraphPage() {
  // State
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [toolMode, setToolMode] = useState<ToolMode>('select')
  const [addEdgeSource, setAddEdgeSource] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false)
  const [editNodeDialogOpen, setEditNodeDialogOpen] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // New node form
  const [newNodeTitle, setNewNodeTitle] = useState('')
  const [newNodeType, setNewNodeType] = useState<GraphNode['type']>('concept')
  const [newNodeContent, setNewNodeContent] = useState('')
  const [newNodeTags, setNewNodeTags] = useState('')

  // Edit node form
  const [editNodeTitle, setEditNodeTitle] = useState('')
  const [editNodeContent, setEditNodeContent] = useState('')

  // Track newly created node IDs for pop animation
  const [newlyCreatedIds, setNewlyCreatedIds] = useState<Set<string>>(new Set())
  const [rippleNodes, setRippleNodes] = useState<{ id: string; x: number; y: number; color: string; createdAt: number }[]>([])

  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // ─── Fetch data on mount ──────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        const [nodesRes, edgesRes] = await Promise.all([
          fetch('/api/nodes'),
          fetch('/api/edges'),
        ])

        const nodesData = await nodesRes.json()
        const edgesData = await edgesRes.json()

        const mappedNodes: GraphNode[] = (nodesData.nodes || []).map(mapApiNodeToGraphNode)
        const mappedEdges: GraphEdge[] = (edgesData.edges || []).map(mapApiEdgeToGraphEdge)

        // Apply force layout only to nodes that lack saved positions
        const needsLayout = mappedNodes.some((n) => {
          const apiNode = (nodesData.nodes || []).find(
            (an: ApiNode) => an.id === n.id
          )
          return apiNode?.x == null || apiNode?.y == null
        })

        if (needsLayout || mappedNodes.length > 0) {
          const laidOutNodes = applyForceLayout(mappedNodes, mappedEdges, 60)
          setNodes(laidOutNodes)
        } else {
          setNodes(mappedNodes)
        }

        setEdges(mappedEdges)
      } catch (error) {
        console.error('Failed to fetch graph data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Clean up ripple nodes after animation
  useEffect(() => {
    if (rippleNodes.length === 0) return
    const timer = setTimeout(() => {
      setRippleNodes((prev) => prev.filter((r) => Date.now() - r.createdAt < 2000))
    }, 2100)
    return () => clearTimeout(timer)
  }, [rippleNodes])

  // Clean up newly created IDs after animation completes
  useEffect(() => {
    if (newlyCreatedIds.size === 0) return
    const timer = setTimeout(() => {
      setNewlyCreatedIds(new Set())
    }, 1500)
    return () => clearTimeout(timer)
  }, [newlyCreatedIds])

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId])
  const connectedNodes = useMemo(() => {
    if (!selectedNodeId) return []
    const connected = new Set<string>()
    edges.forEach((e) => {
      if (e.source === selectedNodeId) connected.add(e.target)
      if (e.target === selectedNodeId) connected.add(e.source)
    })
    return nodes.filter((n) => connected.has(n.id))
  }, [selectedNodeId, edges, nodes])

  const highlightedNodeIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>()
    const ids = new Set<string>([hoveredNodeId])
    edges.forEach((e) => {
      if (e.source === hoveredNodeId) ids.add(e.target)
      if (e.target === hoveredNodeId) ids.add(e.source)
    })
    return ids
  }, [hoveredNodeId, edges])

  // Get the hovered node data
  const hoveredNode = useMemo(() => nodes.find((n) => n.id === hoveredNodeId), [nodes, hoveredNodeId])

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesType = typeFilter === 'all' || n.type === typeFilter
      const matchesSearch =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [nodes, typeFilter, searchQuery])

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes])

  // SVG coordinate helpers
  const screenToSvg = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 }
      const rect = svgRef.current.getBoundingClientRect()
      const svgX = (clientX - rect.left - pan.x) / zoom
      const svgY = (clientY - rect.top - pan.y) / zoom
      return { x: svgX, y: svgY }
    },
    [zoom, pan]
  )

  // Convert SVG coordinates to screen coordinates for the preview card
  const svgToScreen = useCallback(
    (svgX: number, svgY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 }
      const rect = svgRef.current.getBoundingClientRect()
      const screenX = svgX * zoom + pan.x + rect.left
      const screenY = svgY * zoom + pan.y + rect.top
      return { x: screenX, y: screenY }
    },
    [zoom, pan]
  )

  // ─── Handlers ───────────────────────────────────────────────

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation()
      if (toolMode === 'addEdge') {
        if (!addEdgeSource) {
          setAddEdgeSource(nodeId)
        } else if (addEdgeSource !== nodeId) {
          // Create edge via API
          const createEdge = async () => {
            try {
              const res = await fetch('/api/edges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  sourceId: addEdgeSource,
                  targetId: nodeId,
                  label: 'connected',
                  type: 'related',
                }),
              })
              if (res.ok) {
                const data = await res.json()
                const newEdge = mapApiEdgeToGraphEdge(data.edge)
                setEdges((prev) => [...prev, newEdge])
              } else {
                // Fallback: add locally if API fails
                setEdges((prev) => [
                  ...prev,
                  { id: `local-${Date.now()}`, source: addEdgeSource, target: nodeId, label: 'connected', type: 'related', strength: 5 },
                ])
              }
            } catch {
              // Fallback: add locally if API fails
              setEdges((prev) => [
                ...prev,
                { id: `local-${Date.now()}`, source: addEdgeSource, target: nodeId, label: 'connected', type: 'related', strength: 5 },
              ])
            }
          }
          createEdge()
          setAddEdgeSource(null)
          setToolMode('select')
          toast.success('Connection created!')
        }
        return
      }
      if (toolMode === 'delete') {
        // Delete node via API
        const deleteNode = async () => {
          try {
            await fetch(`/api/nodes/${nodeId}`, { method: 'DELETE' })
          } catch (error) {
            console.error('Failed to delete node from API:', error)
          }
        }
        deleteNode()
        setNodes((prev) => prev.filter((n) => n.id !== nodeId))
        setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId))
        if (selectedNodeId === nodeId) setSelectedNodeId(null)
        toast.success('Node deleted')
        return
      }

      // Select mode
      setSelectedNodeId(nodeId)
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        const svgPos = screenToSvg(e.clientX, e.clientY)
        setDragOffset({ x: svgPos.x - node.x, y: svgPos.y - node.y })
        setDraggingNodeId(nodeId)
      }
    },
    [toolMode, addEdgeSource, nodes, selectedNodeId, screenToSvg]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingNodeId && toolMode === 'select') {
        const svgPos = screenToSvg(e.clientX, e.clientY)
        setNodes((prev) =>
          prev.map((n) =>
            n.id === draggingNodeId ? { ...n, x: svgPos.x - dragOffset.x, y: svgPos.y - dragOffset.y } : n
          )
        )
      }
      if (isPanning) {
        setPan((prev) => ({
          x: prev.x + (e.clientX - panStart.x),
          y: prev.y + (e.clientY - panStart.y),
        }))
        setPanStart({ x: e.clientX, y: e.clientY })
      }

      // Update hover preview position
      if (hoveredNodeId && hoveredNode && previewRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const nodeRadius = getNodeRadius(hoveredNode.type)
        const screenPos = svgToScreen(hoveredNode.x, hoveredNode.y)
        const previewX = screenPos.x - containerRect.left + (nodeRadius * zoom) + 12
        const previewY = screenPos.y - containerRect.top - 40

        previewRef.current.style.left = `${Math.min(previewX, containerRect.width - 280)}px`
        previewRef.current.style.top = `${Math.max(8, previewY)}px`
      }
    },
    [draggingNodeId, dragOffset, toolMode, screenToSvg, isPanning, panStart, hoveredNodeId, hoveredNode, svgToScreen, zoom]
  )

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null)
    setIsPanning(false)
  }, [])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === svgRef.current || (e.target as Element).tagName === 'rect' || (e.target as Element).tagName === 'circle') {
        if (toolMode === 'select') {
          setSelectedNodeId(null)
        }
      }
    },
    [toolMode]
  )

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as Element).tagName === 'rect' || e.target === svgRef.current) {
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY })
      }
    },
    []
  )

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(0.2, Math.min(3, Math.round((prev + delta) * 100) / 100)))
  }, [])

  const handleZoomIn = () => setZoom((prev) => Math.min(3, Math.round((prev + 0.2) * 100) / 100))
  const handleZoomOut = () => setZoom((prev) => Math.max(0.2, Math.round((prev - 0.2) * 100) / 100))
  const handleFitToScreen = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMinimapNavigate = (panX: number, panY: number) => {
    setPan({ x: panX, y: panY })
  }

  const handleAddNode = async () => {
    if (!newNodeTitle.trim()) return
    const isFirstNode = nodes.length === 0
    const tags = newNodeTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const x = 400 + (Math.random() - 0.5) * 200
    const y = 300 + (Math.random() - 0.5) * 200

    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNodeTitle.trim(),
          type: newNodeType,
          content: newNodeContent.trim(),
          tags: tags.join(','),
          x,
          y,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const createdNode = mapApiNodeToGraphNode(data.node)
        setNodes((prev) => [...prev, createdNode])
        setSelectedNodeId(createdNode.id)
        setNewlyCreatedIds((prev) => new Set(prev).add(createdNode.id))
        setRippleNodes((prev) => [...prev, {
          id: createdNode.id,
          x: createdNode.x,
          y: createdNode.y,
          color: typeColors[createdNode.type] || '#9CA3AF',
          createdAt: Date.now(),
        }])
        if (isFirstNode) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#059669', '#10B981', '#34D399', '#6EE7B7'] })
          toast.success('🎉 First knowledge node created!', { description: "You've started building your knowledge graph!" })
        } else {
          toast.success('Knowledge node created! 🧠')
        }
      } else {
        // Fallback: add locally
        const id = `local-${Date.now()}`
        const newNode: GraphNode = {
          id,
          title: newNodeTitle.trim(),
          type: newNodeType,
          x,
          y,
          content: newNodeContent.trim(),
          tags,
          createdAt: new Date().toISOString().split('T')[0],
        }
        setNodes((prev) => [...prev, newNode])
        setSelectedNodeId(id)
        setNewlyCreatedIds((prev) => new Set(prev).add(id))
        setRippleNodes((prev) => [...prev, {
          id,
          x,
          y,
          color: typeColors[newNodeType] || '#9CA3AF',
          createdAt: Date.now(),
        }])
      }
    } catch {
      // Fallback: add locally
      const id = `local-${Date.now()}`
      const newNode: GraphNode = {
        id,
        title: newNodeTitle.trim(),
        type: newNodeType,
        x,
        y,
        content: newNodeContent.trim(),
        tags,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setNodes((prev) => [...prev, newNode])
      setSelectedNodeId(id)
      setNewlyCreatedIds((prev) => new Set(prev).add(id))
      setRippleNodes((prev) => [...prev, {
        id,
        x,
        y,
        color: typeColors[newNodeType] || '#9CA3AF',
        createdAt: Date.now(),
      }])
    }

    setAddNodeDialogOpen(false)
    setNewNodeTitle('')
    setNewNodeType('concept')
    setNewNodeContent('')
    setNewNodeTags('')
  }

  const handleDeleteNode = async () => {
    if (!selectedNodeId) return
    try {
      await fetch(`/api/nodes/${selectedNodeId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to delete node from API:', error)
    }
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId))
    setEdges((prev) => prev.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId))
    setSelectedNodeId(null)
    toast.success('Node deleted')
  }

  const handleEditNode = async () => {
    if (!selectedNodeId) return
    try {
      const res = await fetch(`/api/nodes/${selectedNodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editNodeTitle,
          content: editNodeContent,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const updatedNode = mapApiNodeToGraphNode(data.node)
        setNodes((prev) =>
          prev.map((n) => (n.id === selectedNodeId ? { ...n, ...updatedNode } : n))
        )
      } else {
        // Fallback: update locally
        setNodes((prev) =>
          prev.map((n) =>
            n.id === selectedNodeId ? { ...n, title: editNodeTitle, content: editNodeContent } : n
          )
        )
      }
    } catch {
      // Fallback: update locally
      setNodes((prev) =>
        prev.map((n) =>
          n.id === selectedNodeId ? { ...n, title: editNodeTitle, content: editNodeContent } : n
        )
      )
    }
    setEditNodeDialogOpen(false)
  }

  const openEditDialog = () => {
    if (!selectedNode) return
    setEditNodeTitle(selectedNode.title)
    setEditNodeContent(selectedNode.content)
    setEditNodeDialogOpen(true)
  }

  // Node size by type
  const getNodeRadius = (type: string) => {
    switch (type) {
      case 'project':
        return 28
      case 'person':
        return 22
      case 'concept':
        return 20
      case 'feature':
        return 18
      case 'idea':
        return 16
      case 'resource':
        return 17
      default:
        return 18
    }
  }

  // Whether labels are always visible for this node type (larger nodes)
  const isLargeNodeType = (type: string) => type === 'project' || type === 'person'

  // Compute viewBox
  const viewBoxWidth = 900
  const viewBoxHeight = 600

  // ─── Loading State ──────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full flex flex-col bg-[#F9FAFB] dark:bg-[#09090B]">
        <div className="h-14 bg-white dark:bg-[#0F0F12] border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
              <Network className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Knowledge Graph</h1>
              <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">Loading...</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Loading graph data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] dark:bg-[#09090B] dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M40%200v40M0%2040h40%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.03)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E')]" ref={containerRef}>
      {/* ─── Top Bar ────────────────────────────────────────── */}
      <div className="h-14 bg-white dark:bg-[#0F0F12] border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between px-3 sm:px-4 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
            <Network className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Knowledge Graph</h1>
            <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
              {nodes.length} nodes · {edges.length} edges
            </p>
          </div>
        </div>

        {/* Desktop search + filter */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A]" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-56 pl-8 pr-3 text-xs rounded-lg border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-[#F9FAFB] dark:bg-[#09090B] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
            />
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-28 text-xs border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12]">
              <Filter className="w-3 h-3 mr-1 text-[#71717A] dark:text-[#A1A1AA]" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="concept">Concept</SelectItem>
              <SelectItem value="person">Person</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="resource">Resource</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile search/filter toggle */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] active:bg-[#F3F4F6] dark:active:bg-[#27272A] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10 w-10 !px-0 !justify-center border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12] rounded-lg">
              <Filter className="w-4 h-4 text-[#71717A] dark:text-[#A1A1AA]" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="concept">Concept</SelectItem>
              <SelectItem value="person">Person</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="resource">Resource</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Search Bar (expandable) */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white dark:bg-[#0F0F12] border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] z-20"
          >
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A]" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="h-10 w-full pl-8 pr-10 text-sm rounded-lg border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-[#F9FAFB] dark:bg-[#09090B] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                />
                <button
                  onClick={() => { setMobileSearchOpen(false); setSearchQuery('') }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center text-[#A1A1AA] dark:text-[#71717A] hover:text-[#18181B] dark:hover:text-[#FAFAFA]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Canvas Area ────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Stats Badge (desktop only) */}
        <div className="hidden md:block absolute top-3 left-16 z-20 bg-emerald-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-md shadow-emerald-500/20 pointer-events-none select-none">
          {nodes.length} nodes · {edges.length} edges
        </div>

        {/* Add Edge Mode Banner */}
        <AnimatePresence>
          {toolMode === 'addEdge' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              {addEdgeSource ? 'Click target node to connect' : 'Click source node to start edge'}
              <button
                onClick={() => {
                  setToolMode('select')
                  setAddEdgeSource(null)
                }}
                className="ml-2 hover:bg-emerald-700 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Toolbar (desktop only) */}
        <div className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 flex-col gap-1.5 bg-white/90 dark:bg-[#0F0F12]/90 backdrop-blur-sm border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-1.5 shadow-lg">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setToolMode('select')
                    setAddEdgeSource(null)
                  }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    toolMode === 'select'
                      ? 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-600 shadow-sm border border-emerald-100 dark:border-[rgba(16,185,129,0.15)]'
                      : 'text-[#71717A] dark:text-[#A1A1AA] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] hover:text-[#18181B] dark:hover:text-[#FAFAFA]'
                  }`}
                >
                  <MousePointer2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Select & Move</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setAddNodeDialogOpen(true)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] hover:text-emerald-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Add Node</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setToolMode('addEdge')
                    setAddEdgeSource(null)
                  }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    toolMode === 'addEdge'
                      ? 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-600 shadow-sm border border-emerald-100 dark:border-[rgba(16,185,129,0.15)]'
                      : 'text-[#71717A] dark:text-[#A1A1AA] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] hover:text-[#18181B] dark:hover:text-[#FAFAFA]'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Add Edge</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDeleteNode}
                  disabled={!selectedNodeId}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    selectedNodeId
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-[#D4D4D8] cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Delete Selected</TooltipContent>
            </Tooltip>

            <Separator className="my-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleZoomIn}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] hover:text-[#18181B] dark:hover:text-[#FAFAFA] transition-all"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Zoom In</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleZoomOut}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] hover:text-[#18181B] dark:hover:text-[#FAFAFA] transition-all"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleFitToScreen}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] hover:text-[#18181B] dark:hover:text-[#FAFAFA] transition-all"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Fit to Screen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Mobile Bottom Toolbar */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-[#0F0F12]/95 backdrop-blur-sm border-t border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.08)] px-2 py-1.5 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => { setToolMode('select'); setAddEdgeSource(null) }}
            className={`min-w-[44px] min-h-[44px] rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
              toolMode === 'select'
                ? 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-600'
                : 'text-[#71717A] dark:text-[#A1A1AA] active:bg-[#F9FAFB] dark:active:bg-[#18181B]'
            }`}
          >
            <MousePointer2 className="w-4 h-4" />
            <span className="text-[9px] font-medium">Select</span>
          </button>
          <button
            onClick={() => setAddNodeDialogOpen(true)}
            className="min-w-[44px] min-h-[44px] rounded-lg flex flex-col items-center justify-center gap-0.5 text-[#71717A] dark:text-[#A1A1AA] active:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] dark:active:bg-[rgba(16,185,129,0.10)] active:text-emerald-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[9px] font-medium">Add</span>
          </button>
          <button
            onClick={() => { setToolMode('addEdge'); setAddEdgeSource(null) }}
            className={`min-w-[44px] min-h-[44px] rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
              toolMode === 'addEdge'
                ? 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-600'
                : 'text-[#71717A] dark:text-[#A1A1AA] active:bg-[#F9FAFB] dark:active:bg-[#18181B]'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span className="text-[9px] font-medium">Link</span>
          </button>
          <button
            onClick={handleDeleteNode}
            disabled={!selectedNodeId}
            className={`min-w-[44px] min-h-[44px] rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
              selectedNodeId
                ? 'text-red-500 active:bg-red-50'
                : 'text-[#D4D4D8] cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[9px] font-medium">Delete</span>
          </button>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleZoomOut}
              className="min-w-[36px] min-h-[44px] rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] active:bg-[#F9FAFB] dark:active:bg-[#18181B] transition-all"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[9px] font-mono text-[#A1A1AA] dark:text-[#71717A] w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="min-w-[36px] min-h-[44px] rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] active:bg-[#F9FAFB] dark:active:bg-[#18181B] transition-all"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Node Hover Preview Card */}
        <div
          ref={previewRef}
          className="absolute z-40 pointer-events-none"
          style={{ display: hoveredNode ? 'block' : 'none' }}
        >
          {hoveredNode && (
            <NodeHoverPreview node={hoveredNode} visible={!!hoveredNodeId} />
          )}
        </div>

        {/* SVG Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            overflow: 'visible',
          }}
        >
          <defs>
            {/* ── Enhanced Background Patterns ── */}
            {/* Small dot grid */}
            <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.6" fill="rgba(0,0,0,0.05)" className="dark:fill-[rgba(255,255,255,0.06)]" />
            </pattern>
            {/* Larger grid lines */}
            <pattern id="lineGrid" width="150" height="150" patternUnits="userSpaceOnUse">
              <line x1="150" y1="0" x2="150" y2="150" stroke="rgba(0,0,0,0.035)" strokeWidth="0.5" className="dark:stroke-[rgba(255,255,255,0.04)]" />
              <line x1="0" y1="150" x2="150" y2="150" stroke="rgba(0,0,0,0.035)" strokeWidth="0.5" className="dark:stroke-[rgba(255,255,255,0.04)]" />
            </pattern>
            {/* Radial gradient for background */}
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(5,150,105,0.015)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* ── Glow Filters ── */}
            {/* Edge glow filter */}
            <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Stronger glow for highlighted edges */}
            <filter id="edgeGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Node shadow/glow filter */}
            <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
            </filter>
            {/* Type-colored glow filters */}
            {Object.entries(typeColors).map(([type, color]) => (
              <filter key={`glow-${type}`} id={`glow-${type}`} x="-80%" y="-80%" width="260%" height="260%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.4" />
              </filter>
            ))}
            {/* Pulse glow for selected nodes */}
            <filter id="pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* ── Edge particle paths ── */}
            {/* We'll generate path data per edge inline */}

            {/* Arrowhead markers for each color */}
            {Object.entries(typeColors).map(([type, color]) => (
              <marker
                key={type}
                id={`arrow-${type}`}
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} opacity="0.6" />
              </marker>
            ))}
          </defs>

          <g transform={`translate(${pan.x / zoom}, ${pan.y / zoom}) scale(${zoom})`}>
            {/* ── Enhanced Background ── */}
            {/* Base fill */}
            <rect x="-2000" y="-2000" width="6000" height="6000" fill="#F9FAFB" className="dark:fill-[#09090B]" />
            {/* Radial gradient overlay */}
            <rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#bgGradient)" />
            {/* Small dot grid */}
            <rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#dotGrid)" />
            {/* Larger line grid */}
            <rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#lineGrid)" />

            {/* ── Edges ── */}
            {edges
              .filter((e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target))
              .map((edge, idx) => {
                const source = nodes.find((n) => n.id === edge.source)
                const target = nodes.find((n) => n.id === edge.target)
                if (!source || !target) return null

                const isHighlighted =
                  highlightedNodeIds.has(edge.source) && highlightedNodeIds.has(edge.target)
                const isConnectedToSelected =
                  selectedNodeId &&
                  (edge.source === selectedNodeId || edge.target === selectedNodeId)
                const style = edgeStyleMap[edge.type] || edgeStyleMap.related
                const sourceType = source.type
                const color = typeColors[sourceType] || '#9CA3AF'

                // Connection strength visual mapping (1-10)
                const strength = edge.strength ?? 5
                const strengthStrokeWidth =
                  strength <= 3 ? Math.max(0.8, style.strokeWidth * 0.6) :
                  strength <= 6 ? style.strokeWidth :
                  Math.min(style.strokeWidth * 1.8, 4.5)
                const strengthOpacity =
                  strength <= 3 ? 0.2 :
                  strength <= 6 ? 0.45 :
                  0.75

                // Edge path for particle animation
                const edgePathId = `edge-path-${edge.id}`
                const pathD = `M ${source.x} ${source.y} L ${target.x} ${target.y}`

                return (
                  <g key={`edge-${edge.id}-${idx}`}>
                    {/* Glow layer (behind the edge) */}
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isHighlighted || isConnectedToSelected ? color : 'transparent'}
                      strokeWidth={
                        isHighlighted || isConnectedToSelected ? strengthStrokeWidth + 4 : 0
                      }
                      strokeDasharray={style.strokeDasharray}
                      opacity={isHighlighted ? 0.15 : isConnectedToSelected ? 0.1 : 0}
                      filter="url(#edgeGlow)"
                      className="transition-all duration-300"
                    />

                    {/* Main edge line */}
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isHighlighted || isConnectedToSelected ? color : '#D1D5DB'}
                      strokeWidth={
                        isHighlighted || isConnectedToSelected ? strengthStrokeWidth + 1 : strengthStrokeWidth
                      }
                      strokeDasharray={style.strokeDasharray}
                      opacity={
                        isHighlighted || isConnectedToSelected ? Math.min(strengthOpacity + 0.25, 0.95) : hoveredNodeId && !isHighlighted ? 0.1 : strengthOpacity
                      }
                      markerEnd={
                        isHighlighted || isConnectedToSelected ? `url(#arrow-${sourceType})` : undefined
                      }
                      className="transition-all duration-200"
                    />

                    {/* Animated particle dots along edges - only for highlighted/selected */}
                    {(isHighlighted || isConnectedToSelected) && (
                      <>
                        <path id={edgePathId} d={pathD} fill="none" stroke="none" />
                        <circle r="2" fill={color} opacity="0.8">
                          <animateMotion dur={`${3 + idx * 0.5}s`} repeatCount="indefinite">
                            <mpath href={`#${edgePathId}`} />
                          </animateMotion>
                        </circle>
                        <circle r="1.5" fill={color} opacity="0.5">
                          <animateMotion dur={`${4 + idx * 0.7}s`} repeatCount="indefinite" begin="1.5s">
                            <mpath href={`#${edgePathId}`} />
                          </animateMotion>
                        </circle>
                      </>
                    )}

                    {/* Edge label on hover (when connected node is hovered) */}
                    {(isHighlighted) && edge.label && (
                      <g transform={`translate(${(source.x + target.x) / 2}, ${(source.y + target.y) / 2})`}>
                        <rect
                          x={-edge.label.length * 3 - 8}
                          y={-10}
                          width={edge.label.length * 6 + 16}
                          height={20}
                          rx={6}
                          fill="white"
                          stroke={color}
                          strokeWidth={0.5}
                          opacity={0.95}
                          filter="url(#nodeShadow)"
                          className="dark:fill-[#18181B]"
                        />
                        <text
                          x={-edge.label.length * 0.5}
                          y={1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={color}
                          fontSize={8}
                          fontWeight={600}
                        >
                          {edgeTypeIcons[edge.type] || '→'} {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

            {/* ── Ripple effects for newly created nodes ── */}
            {rippleNodes.map((ripple) => (
              <circle
                key={`ripple-${ripple.id}-${ripple.createdAt}`}
                cx={ripple.x}
                cy={ripple.y}
                r={0}
                fill="none"
                stroke={ripple.color}
                strokeWidth={2}
                opacity={0.6}
              >
                <animate
                  attributeName="r"
                  from="0"
                  to="60"
                  dur="1.2s"
                  begin="0s"
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="1.2s"
                  begin="0s"
                  fill="freeze"
                />
                <animate
                  attributeName="strokeWidth"
                  from="2"
                  to="0.5"
                  dur="1.2s"
                  begin="0s"
                  fill="freeze"
                />
              </circle>
            ))}

            {/* ── Nodes ── */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId
              const isHovered = node.id === hoveredNodeId
              const isDimmed = hoveredNodeId && !highlightedNodeIds.has(node.id)
              const isAddEdgeSource = node.id === addEdgeSource
              const color = typeColors[node.type] || '#9CA3AF'
              const radius = getNodeRadius(node.type)
              const isNewNode = newlyCreatedIds.has(node.id)
              const showLabels = isLargeNodeType(node.type) || isHovered || isSelected

              return (
                <g
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onDoubleClick={() => {
                    setSelectedNodeId(node.id)
                    openEditDialog()
                  }}
                  className="cursor-pointer"
                  style={{ transition: 'opacity 0.2s ease' }}
                  opacity={isDimmed ? 0.15 : 1}
                >
                  {/* Node shadow/glow based on type color */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 2}
                    fill={color}
                    opacity={0.12}
                    filter={`url(#glow-${node.type})`}
                    className="transition-all duration-200"
                  />

                  {/* Selection ring - double ring with pulsing outer */}
                  {(isSelected || isAddEdgeSource) && (
                    <>
                      {/* Outer pulsing ring */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius + 8}
                        fill="none"
                        stroke={isAddEdgeSource ? '#059669' : color}
                        strokeWidth={1.5}
                        opacity={0.3}
                      >
                        <animate
                          attributeName="r"
                          values={`${radius + 7};${radius + 12};${radius + 7}`}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;0.1;0.3"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Inner selection ring */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius + 5}
                        fill="none"
                        stroke={isAddEdgeSource ? '#059669' : color}
                        strokeWidth={2}
                        strokeDasharray={isAddEdgeSource ? '4 2' : 'none'}
                        opacity={0.6}
                      >
                        <animate
                          attributeName="r"
                          values={`${radius + 4};${radius + 7};${radius + 4}`}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}

                  {/* Hover pulsing emerald glow ring */}
                  {isHovered && !isSelected && (
                    <>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius + 6}
                        fill="none"
                        stroke="#059669"
                        strokeWidth={1.5}
                        opacity={0.4}
                      >
                        <animate
                          attributeName="r"
                          values={`${radius + 5};${radius + 9};${radius + 5}`}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.4;0.15;0.4"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius + 3}
                        fill="none"
                        stroke={color}
                        strokeWidth={1}
                        opacity={0.3}
                      />
                    </>
                  )}

                  {/* Node circle - with pop animation for new nodes */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={color}
                    stroke="white"
                    strokeWidth={2.5}
                    filter="url(#nodeShadow)"
                    className="transition-all duration-150 dark:stroke-[#27272A]"
                  >
                    {/* Pop-in animation for newly created nodes */}
                    {isNewNode && (
                      <>
                        <animate
                          attributeName="r"
                          values={`0;${radius * 1.2};${radius}`}
                          dur="0.5s"
                          begin="0s"
                          fill="freeze"
                          calcMode="spline"
                          keySplines="0.175 0.885 0.32 1.275;0.175 0.885 0.32 1.275"
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;1"
                          dur="0.3s"
                          begin="0s"
                          fill="freeze"
                        />
                      </>
                    )}
                  </circle>

                  {/* Node icon/initial */}
                  {node.type === 'person' ? (
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={10}
                      fontWeight={700}
                      opacity={isNewNode ? 0 : 1}
                    >
                      {isNewNode && (
                        <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.2s" fill="freeze" />
                      )}
                      {node.title.slice(0, 2).toUpperCase()}
                    </text>
                  ) : (
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={7}
                      fontWeight={700}
                      letterSpacing="-0.02em"
                      opacity={isNewNode ? 0 : 1}
                    >
                      {isNewNode && (
                        <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.2s" fill="freeze" />
                      )}
                      {node.title.length > 6 ? node.title.slice(0, 5) + '…' : node.title}
                    </text>
                  )}

                  {/* Title label below - visible for large types or on hover */}
                  <text
                    x={node.x}
                    y={node.y + radius + 14}
                    textAnchor="middle"
                    fill={isSelected ? color : '#52525B'}
                    fontSize={10}
                    fontWeight={isSelected ? 700 : 500}
                    opacity={showLabels ? 1 : 0.5}
                    className="transition-all duration-200 dark:fill-[#D4D4D8]"
                  >
                    {node.title}
                  </text>

                  {/* Type badge - visible for large types or on hover */}
                  <text
                    x={node.x}
                    y={node.y + radius + 25}
                    textAnchor="middle"
                    fill={color}
                    fontSize={7}
                    fontWeight={600}
                    textTransform="uppercase"
                    opacity={showLabels ? 0.7 : 0}
                    className="transition-all duration-200"
                  >
                    {node.type}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Empty State Overlay */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F9FAFB] dark:bg-[#09090B]/80 dark:bg-[#09090B]/80 backdrop-blur-sm">
            <GraphEmptyState onAddNode={() => setAddNodeDialogOpen(true)} />
            <motion.button
              onClick={() => setAddNodeDialogOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.97] transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Plus className="w-4 h-4" />
              Create Your First Node
            </motion.button>
          </div>
        )}

        {/* Zoom indicator (desktop only) - enhanced with badge style */}
        <div className="hidden md:flex absolute bottom-3 left-3 z-20 items-center gap-1.5">
          <div className="bg-white/90 dark:bg-[#0F0F12]/90 backdrop-blur-sm border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-1 text-[10px] font-mono text-[#71717A] dark:text-[#A1A1AA] shadow-sm">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Minimap (desktop only) */}
        <div className="hidden md:block absolute bottom-3 right-3 z-20">
          <Minimap
            nodes={filteredNodes}
            edges={edges.filter((e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target))}
            pan={pan}
            zoom={zoom}
            viewBoxWidth={viewBoxWidth}
            viewBoxHeight={viewBoxHeight}
            onNavigate={handleMinimapNavigate}
          />
        </div>

        {/* Legend (desktop only) - moved above minimap */}
        <div className="hidden md:block absolute bottom-[90px] right-3 z-20 bg-white/90 dark:bg-[#0F0F12]/90 backdrop-blur-sm border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-xl p-3 shadow-sm">
          <p className="text-[9px] font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">Legend</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-[9px] text-[#71717A] dark:text-[#A1A1AA] capitalize">{type}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 pt-2 border-t border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t border-[#71717A]" />
              <span className="text-[9px] text-[#71717A] dark:text-[#A1A1AA]">Related</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t-2 border-dashed border-[#71717A]" />
              <span className="text-[9px] text-[#71717A] dark:text-[#A1A1AA]">Depends</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t border-dotted border-[#71717A]" />
              <span className="text-[9px] text-[#71717A] dark:text-[#A1A1AA]">Created by</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t-2 border-[#71717A]" />
              <span className="text-[9px] text-[#71717A] dark:text-[#A1A1AA]">References</span>
            </div>
          </div>
        </div>

        {/* ─── Right Info Panel (desktop: side panel / mobile: bottom sheet) ── */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 320, opacity: 0, y: 0 }}
              animate={{ x: 0, opacity: 1, y: 0 }}
              exit={{ x: 320, opacity: 0, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-[#0F0F12] border-l border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-xl z-20 flex flex-col overflow-hidden hidden md:flex"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Node Details</h3>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="w-7 h-7 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[#71717A] dark:text-[#A1A1AA]" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#18181B] dark:text-[#FAFAFA]">{selectedNode.title}</h2>
                </div>
                {/* Node ID with copy & share buttons */}
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] font-mono truncate max-w-[180px]">{selectedNode.id}</p>
                  <CopyIdButton id={selectedNode.id} />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(`${window.location.origin}/app/graph?node=${selectedNode.id}`)
                        toast.success('Share link copied to clipboard!')
                      } catch {
                        toast.error('Failed to copy share link')
                      }
                    }}
                    className="w-5 h-5 rounded flex items-center justify-center text-[#A1A1AA] dark:text-[#71717A] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] transition-all shrink-0"
                    title="Share node link"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
                  <Badge
                    className="mt-2 text-[10px] font-semibold capitalize"
                    style={{
                      background: typeBgColors[selectedNode.type],
                      color: typeColors[selectedNode.type],
                      borderColor: typeBorderColors[selectedNode.type],
                      borderWidth: 1,
                    }}
                  >
                    {selectedNode.type}
                  </Badge>
                </div>

                <Separator />

                {/* Content */}
                <div>
                  <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-[#52525B] dark:text-[#D4D4D8] leading-relaxed">{selectedNode.content}</p>
                </div>

                {/* Tags */}
                {selectedNode.tags && selectedNode.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] font-medium text-[#71717A] dark:text-[#A1A1AA] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Connected Nodes */}
                <div>
                  <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">
                    Connected ({connectedNodes.length})
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {connectedNodes.map((cn) => {
                      const edge = edges.find(
                        (e) =>
                          (e.source === selectedNode.id && e.target === cn.id) ||
                          (e.target === selectedNode.id && e.source === cn.id)
                      )
                      return (
                        <button
                          key={cn.id}
                          onClick={() => setSelectedNodeId(cn.id)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] transition-colors text-left group"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: typeBgColors[cn.type] }}
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: typeColors[cn.type] }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#18181B] dark:text-[#FAFAFA] truncate group-hover:text-emerald-700 transition-colors">
                              {cn.title}
                            </p>
                            {edge && (
                              <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] truncate">{edge.label}</p>
                            )}
                          </div>
                          <ChevronRight className="w-3 h-3 text-[#D4D4D8] group-hover:text-emerald-500 transition-colors" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Created Date */}
                {selectedNode.createdAt && (
                  <div>
                    <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">Created</p>
                    <p className="text-xs text-[#A1A1AA] dark:text-[#71717A]">{selectedNode.createdAt}</p>
                  </div>
                )}
              </div>

              {/* Panel Actions */}
              <div className="p-4 border-t border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditDialog}
                  className="flex-1 text-xs border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)]/30"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteNode}
                  className="flex-1 text-xs border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] text-red-500 hover:border-red-200 hover:bg-red-50/30 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Mobile Bottom Sheet Panel ────────────────────── */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden absolute left-0 right-0 bottom-0 z-30 bg-white dark:bg-[#0F0F12] rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
              style={{ maxHeight: '65vh' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-[#D4D4D8] dark:bg-[#52525B]" />
              </div>

              {/* Panel Header */}
              <div className="px-4 pb-2 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Node Details</h3>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="min-w-[44px] min-h-[44px] rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[#71717A] dark:text-[#A1A1AA]" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#18181B] dark:text-[#FAFAFA]">{selectedNode.title}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] font-mono truncate max-w-[200px]">{selectedNode.id}</p>
                    <CopyIdButton id={selectedNode.id} />
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(`${window.location.origin}/app/graph?node=${selectedNode.id}`)
                          toast.success('Share link copied to clipboard!')
                        } catch {
                          toast.error('Failed to copy share link')
                        }
                      }}
                      className="min-w-[44px] min-h-[44px] rounded flex items-center justify-center text-[#A1A1AA] dark:text-[#71717A] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] transition-all shrink-0"
                      title="Share node link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Badge
                    className="mt-2 text-[10px] font-semibold capitalize"
                    style={{
                      background: typeBgColors[selectedNode.type],
                      color: typeColors[selectedNode.type],
                      borderColor: typeBorderColors[selectedNode.type],
                      borderWidth: 1,
                    }}
                  >
                    {selectedNode.type}
                  </Badge>
                </div>

                <Separator />

                {/* Content */}
                <div>
                  <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-[#52525B] dark:text-[#D4D4D8] leading-relaxed">{selectedNode.content}</p>
                </div>

                {/* Tags */}
                {selectedNode.tags && selectedNode.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] font-medium text-[#71717A] dark:text-[#A1A1AA] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Connected Nodes */}
                <div>
                  <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">
                    Connected ({connectedNodes.length})
                  </p>
                  <div className="space-y-1">
                    {connectedNodes.map((cn) => {
                      const edge = edges.find(
                        (e) =>
                          (e.source === selectedNode.id && e.target === cn.id) ||
                          (e.target === selectedNode.id && e.source === cn.id)
                      )
                      return (
                        <button
                          key={cn.id}
                          onClick={() => setSelectedNodeId(cn.id)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg active:bg-[#F9FAFB] dark:active:bg-[#18181B] transition-colors text-left"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: typeBgColors[cn.type] }}
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: typeColors[cn.type] }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#18181B] dark:text-[#FAFAFA] truncate">
                              {cn.title}
                            </p>
                            {edge && (
                              <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] truncate">{edge.label}</p>
                            )}
                          </div>
                          <ChevronRight className="w-3 h-3 text-[#D4D4D8]" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Created Date */}
                {selectedNode.createdAt && (
                  <div>
                    <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mb-1">Created</p>
                    <p className="text-xs text-[#A1A1AA] dark:text-[#71717A]">{selectedNode.createdAt}</p>
                  </div>
                )}
              </div>

              {/* Panel Actions */}
              <div className="p-4 border-t border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex gap-2 shrink-0 safe-area-bottom">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditDialog}
                  className="flex-1 h-11 text-xs border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)]/30"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteNode}
                  className="flex-1 h-11 text-xs border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] text-red-500 hover:border-red-200 hover:bg-red-50/30 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Add Node Dialog ───────────────────────────────── */}
      <Dialog open={addNodeDialogOpen} onOpenChange={setAddNodeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              Add Knowledge Node
            </DialogTitle>
            <DialogDescription>
              Add a new node to your knowledge graph. It will be automatically linked to related entries.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                placeholder="e.g., Payment Gateway Architecture"
                value={newNodeTitle}
                onChange={(e) => setNewNodeTitle(e.target.value)}
                className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-type">Type</Label>
              <Select value={newNodeType} onValueChange={(v) => setNewNodeType(v as GraphNode['type'])}>
                <SelectTrigger className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="person">Person</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-content">Content</Label>
              <Textarea
                id="new-content"
                placeholder="Describe this knowledge node..."
                rows={3}
                value={newNodeContent}
                onChange={(e) => setNewNodeContent(e.target.value)}
                className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-tags">Tags (comma-separated)</Label>
              <Input
                id="new-tags"
                placeholder="e.g., api, architecture, backend"
                value={newNodeTags}
                onChange={(e) => setNewNodeTags(e.target.value)}
                className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddNodeDialogOpen(false)}
              className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNode}
              disabled={!newNodeTitle.trim()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20"
            >
              Create Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Node Dialog ──────────────────────────────── */}
      <Dialog open={editNodeDialogOpen} onOpenChange={setEditNodeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                <Pencil className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              Edit Node
            </DialogTitle>
            <DialogDescription>
              Update the title and description of this knowledge node.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editNodeTitle}
                onChange={(e) => setEditNodeTitle(e.target.value)}
                className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={editNodeContent}
                onChange={(e) => setEditNodeContent(e.target.value)}
                rows={4}
                className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditNodeDialogOpen(false)}
              className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditNode}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
