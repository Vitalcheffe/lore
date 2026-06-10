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
      className="w-5 h-5 rounded flex items-center justify-center text-[#A1A1AA] hover:text-emerald-600 hover:bg-emerald-50 transition-all shrink-0"
      title="Copy node ID"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
    </button>
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
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false)
  const [editNodeDialogOpen, setEditNodeDialogOpen] = useState(false)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // New node form
  const [newNodeTitle, setNewNodeTitle] = useState('')
  const [newNodeType, setNewNodeType] = useState<GraphNode['type']>('concept')
  const [newNodeContent, setNewNodeContent] = useState('')
  const [newNodeTags, setNewNodeTags] = useState('')

  // Edit node form
  const [editNodeTitle, setEditNodeTitle] = useState('')
  const [editNodeContent, setEditNodeContent] = useState('')

  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
                  { id: `local-${Date.now()}`, source: addEdgeSource, target: nodeId, label: 'connected', type: 'related' },
                ])
              }
            } catch {
              // Fallback: add locally if API fails
              setEdges((prev) => [
                ...prev,
                { id: `local-${Date.now()}`, source: addEdgeSource, target: nodeId, label: 'connected', type: 'related' },
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
    },
    [draggingNodeId, dragOffset, toolMode, screenToSvg, isPanning, panStart]
  )

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null)
    setIsPanning(false)
  }, [])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === svgRef.current || (e.target as Element).tagName === 'rect') {
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
    setZoom((prev) => Math.max(0.2, Math.min(3, prev + delta)))
  }, [])

  const handleZoomIn = () => setZoom((prev) => Math.min(3, prev + 0.2))
  const handleZoomOut = () => setZoom((prev) => Math.max(0.2, prev - 0.2))
  const handleFitToScreen = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
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

  // Compute viewBox
  const viewBoxWidth = 900
  const viewBoxHeight = 600

  // ─── Loading State ──────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full flex flex-col bg-[#F9FAFB]">
        <div className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Network className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#18181B]">Knowledge Graph</h1>
              <p className="text-[10px] text-[#71717A]">Loading...</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#71717A]">Loading graph data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]" ref={containerRef}>
      {/* ─── Top Bar ────────────────────────────────────────── */}
      <div className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Network className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#18181B]">Knowledge Graph</h1>
            <p className="text-[10px] text-[#71717A]">
              {nodes.length} nodes · {edges.length} edges
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-40 sm:w-56 pl-8 pr-3 text-xs rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
            />
          </div>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-28 text-xs border-[#E5E7EB] bg-white">
              <Filter className="w-3 h-3 mr-1 text-[#71717A]" />
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
      </div>

      {/* ─── Main Canvas Area ────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
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

        {/* Left Toolbar */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-xl p-1.5 shadow-lg">
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
                      ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100'
                      : 'text-[#71717A] hover:bg-[#F9FAFB] hover:text-[#18181B]'
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-emerald-50 hover:text-emerald-600 transition-all"
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
                      ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100'
                      : 'text-[#71717A] hover:bg-[#F9FAFB] hover:text-[#18181B]'
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-[#F9FAFB] hover:text-[#18181B] transition-all"
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-[#F9FAFB] hover:text-[#18181B] transition-all"
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-[#F9FAFB] hover:text-[#18181B] transition-all"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Fit to Screen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
            <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="0.8" fill="rgba(0,0,0,0.06)" />
            </pattern>
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
            {/* Background grid */}
            <rect
              x="-2000"
              y="-2000"
              width="6000"
              height="6000"
              fill="url(#dotGrid)"
            />

            {/* Edges */}
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

                // Calculate midpoint for label
                const midX = (source.x + target.x) / 2
                const midY = (source.y + target.y) / 2

                // Calculate angle for label rotation
                const angle = Math.atan2(target.y - source.y, target.x - source.x) * (180 / Math.PI)

                return (
                  <g key={`edge-${edge.id}-${idx}`}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isHighlighted || isConnectedToSelected ? color : '#D1D5DB'}
                      strokeWidth={
                        isHighlighted || isConnectedToSelected ? style.strokeWidth + 1 : style.strokeWidth
                      }
                      strokeDasharray={style.strokeDasharray}
                      opacity={
                        isHighlighted || isConnectedToSelected ? 0.8 : hoveredNodeId && !isHighlighted ? 0.15 : 0.4
                      }
                      markerEnd={
                        isHighlighted || isConnectedToSelected ? `url(#arrow-${sourceType})` : undefined
                      }
                      className="transition-all duration-200"
                    />
                    {/* Edge label */}
                    {(isHighlighted || isConnectedToSelected) && edge.label && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x={-edge.label.length * 3 - 4}
                          y={-8}
                          width={edge.label.length * 6 + 8}
                          height={16}
                          rx={4}
                          fill="white"
                          stroke={color}
                          strokeWidth={0.5}
                          opacity={0.95}
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={color}
                          fontSize={8}
                          fontWeight={500}
                          style={{ transform: `rotate(${Math.abs(angle) > 90 ? angle + 180 : angle}deg)` }}
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId
              const isHovered = node.id === hoveredNodeId
              const isDimmed = hoveredNodeId && !highlightedNodeIds.has(node.id)
              const isAddEdgeSource = node.id === addEdgeSource
              const color = typeColors[node.type] || '#9CA3AF'
              const radius = getNodeRadius(node.type)

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
                  opacity={isDimmed ? 0.2 : 1}
                >
                  {/* Selection ring */}
                  {(isSelected || isAddEdgeSource) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 6}
                      fill="none"
                      stroke={isAddEdgeSource ? '#059669' : color}
                      strokeWidth={2}
                      strokeDasharray={isAddEdgeSource ? '4 2' : 'none'}
                      opacity={0.6}
                    >
                      <animate
                        attributeName="r"
                        values={`${radius + 5};${radius + 8};${radius + 5}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Hover glow */}
                  {isHovered && !isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 4}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                      opacity={0.3}
                    />
                  )}

                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={color}
                    stroke="white"
                    strokeWidth={2}
                    filter={isSelected ? 'none' : undefined}
                    className="transition-all duration-150"
                  />

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
                    >
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
                    >
                      {node.title.length > 6 ? node.title.slice(0, 5) + '…' : node.title}
                    </text>
                  )}

                  {/* Title label below */}
                  <text
                    x={node.x}
                    y={node.y + radius + 14}
                    textAnchor="middle"
                    fill={isSelected ? color : '#52525B'}
                    fontSize={10}
                    fontWeight={isSelected ? 700 : 500}
                  >
                    {node.title}
                  </text>

                  {/* Type badge */}
                  <text
                    x={node.x}
                    y={node.y + radius + 25}
                    textAnchor="middle"
                    fill={color}
                    fontSize={7}
                    fontWeight={600}
                    textTransform="uppercase"
                    opacity={0.7}
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
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F9FAFB]/80 backdrop-blur-sm">
            <GraphEmptyState onAddNode={() => setAddNodeDialogOpen(true)} />
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-[10px] font-mono text-[#71717A]">
          {Math.round(zoom * 100)}%
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-sm border border-[#E5E7EB] rounded-xl p-3 shadow-sm">
          <p className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Legend</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-[9px] text-[#71717A] capitalize">{type}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 pt-2 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t border-[#71717A]" />
              <span className="text-[9px] text-[#71717A]">Related</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t-2 border-dashed border-[#71717A]" />
              <span className="text-[9px] text-[#71717A]">Depends</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t border-dotted border-[#71717A]" />
              <span className="text-[9px] text-[#71717A]">Created by</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0 border-t-2 border-[#71717A]" />
              <span className="text-[9px] text-[#71717A]">References</span>
            </div>
          </div>
        </div>

        {/* ─── Right Info Panel ─────────────────────────────── */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-[#E5E7EB] shadow-xl z-20 flex flex-col overflow-hidden"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-[#18181B]">Node Details</h3>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="w-7 h-7 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[#71717A]" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Title */}
                <div>
                  <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#18181B]">{selectedNode.title}</h2>
                </div>
                {/* Node ID with copy & share buttons */}
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[10px] text-[#A1A1AA] font-mono truncate max-w-[180px]">{selectedNode.id}</p>
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
                    className="w-5 h-5 rounded flex items-center justify-center text-[#A1A1AA] hover:text-emerald-600 hover:bg-emerald-50 transition-all shrink-0"
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
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-[#52525B] leading-relaxed">{selectedNode.content}</p>
                </div>

                {/* Tags */}
                {selectedNode.tags && selectedNode.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] font-medium text-[#71717A] border-[#E5E7EB]"
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
                  <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-2">
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
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors text-left group"
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
                            <p className="text-xs font-semibold text-[#18181B] truncate group-hover:text-emerald-700 transition-colors">
                              {cn.title}
                            </p>
                            {edge && (
                              <p className="text-[10px] text-[#A1A1AA] truncate">{edge.label}</p>
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
                    <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1">Created</p>
                    <p className="text-xs text-[#A1A1AA]">{selectedNode.createdAt}</p>
                  </div>
                )}
              </div>

              {/* Panel Actions */}
              <div className="p-4 border-t border-[#E5E7EB] flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditDialog}
                  className="flex-1 text-xs border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50/30"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteNode}
                  className="flex-1 text-xs border-[#E5E7EB] text-red-500 hover:border-red-200 hover:bg-red-50/30 hover:text-red-600"
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
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
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
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-type">Type</Label>
              <Select value={newNodeType} onValueChange={(v) => setNewNodeType(v as GraphNode['type'])}>
                <SelectTrigger className="border-[#E5E7EB]">
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
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-tags">Tags (comma-separated)</Label>
              <Input
                id="new-tags"
                placeholder="e.g., api, architecture, backend"
                value={newNodeTags}
                onChange={(e) => setNewNodeTags(e.target.value)}
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddNodeDialogOpen(false)}
              className="border-[#E5E7EB]"
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
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
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
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={editNodeContent}
                onChange={(e) => setEditNodeContent(e.target.value)}
                rows={4}
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditNodeDialogOpen(false)}
              className="border-[#E5E7EB]"
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
