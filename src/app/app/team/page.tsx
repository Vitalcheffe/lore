'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Shield,
  Pencil,
  Eye,
  Check,
  X,
  Copy,
  TrendingUp,
  Circle,
  Mail,
  Zap,
  ExternalLink,
  Loader2,
  Heart,
  Activity,
  GitBranch,
  Link2,
  Network,
  Clock,
  ArrowRight,
  Sparkles,
  Crown,
  Star,
  Target,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { LoreEmptyState } from '@/components/app/empty-states';

// ═══════════════════════════════════════════════════════════════
// LORE — Enhanced Team Management Page (Dark Mode Support)
// ═══════════════════════════════════════════════════════════════

type Role = 'admin' | 'editor' | 'viewer';
type Status = 'online' | 'away' | 'offline';

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  facts: number;
  queries: number;
  lastActive: string;
  status: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  sentDate: string;
}

interface Activity {
  text: string;
  time: string;
  type: string;
}

// ─── Helpers ────────────────────────────────────────────────
function roleBadgeConfig(role: string) {
  if (role === 'admin') return { bg: 'rgba(5,150,105,0.08)', bgDark: 'rgba(5,150,105,0.12)', text: '#059669', textDark: '#34D399', border: 'rgba(5,150,105,0.15)', borderDark: 'rgba(5,150,105,0.25)', icon: Crown };
  if (role === 'editor') return { bg: 'rgba(13,148,136,0.08)', bgDark: 'rgba(13,148,136,0.12)', text: '#0D9488', textDark: '#5EEAD4', border: 'rgba(13,148,136,0.15)', borderDark: 'rgba(13,148,136,0.25)', icon: Pencil };
  return { bg: 'rgba(113,113,122,0.08)', bgDark: 'rgba(113,113,122,0.12)', text: '#71717A', textDark: '#A1A1AA', border: 'rgba(113,113,122,0.15)', borderDark: 'rgba(113,113,122,0.25)', icon: Eye };
}

function statusDot(status: string) {
  if (status === 'online') return '#22C55E';
  if (status === 'away') return '#F59E0B';
  return '#94A3B8';
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const memberColors = ['#059669', '#0D9488', '#0891B2', '#F59E0B', '#EC4899', '#7C3AED', '#047857', '#F43F5E', '#06B6D4', '#84CC16'];

// ─── Team Health Score Calculation ──────────────────────────
interface TeamHealthBreakdown {
  members: number;
  activity: number;
  contributions: number;
  engagement: number;
  total: number;
}

function calculateTeamHealth(
  totalMembers: number,
  activeToday: number,
  totalFacts: number,
  avgQueries: number,
): TeamHealthBreakdown {
  // Members score (0-25): 1=5, 3=15, 5+=20, 10+=25
  let membersScore = 0;
  if (totalMembers >= 10) membersScore = 25;
  else if (totalMembers >= 5) membersScore = 20;
  else if (totalMembers >= 3) membersScore = 15;
  else if (totalMembers >= 1) membersScore = 8;

  // Activity score (0-25): based on active today ratio
  let activityScore = 0;
  if (totalMembers > 0) {
    const ratio = activeToday / totalMembers;
    if (ratio >= 0.8) activityScore = 25;
    else if (ratio >= 0.5) activityScore = 20;
    else if (ratio >= 0.25) activityScore = 15;
    else if (ratio > 0) activityScore = 8;
  }

  // Contributions score (0-25): total facts
  let contributionsScore = 0;
  if (totalFacts >= 50) contributionsScore = 25;
  else if (totalFacts >= 20) contributionsScore = 20;
  else if (totalFacts >= 10) contributionsScore = 15;
  else if (totalFacts >= 1) contributionsScore = 8;

  // Engagement score (0-25): avg queries per day
  let engagementScore = 0;
  if (avgQueries >= 10) engagementScore = 25;
  else if (avgQueries >= 5) engagementScore = 20;
  else if (avgQueries >= 2) engagementScore = 15;
  else if (avgQueries >= 1) engagementScore = 8;

  return {
    members: membersScore,
    activity: activityScore,
    contributions: contributionsScore,
    engagement: engagementScore,
    total: membersScore + activityScore + contributionsScore + engagementScore,
  };
}

function getHealthLabel(score: number): string {
  if (score >= 81) return 'Excellent';
  if (score >= 61) return 'Good';
  if (score >= 41) return 'Needs Work';
  return 'Getting Started';
}

function getHealthColor(score: number): string {
  if (score >= 81) return '#10B981';
  if (score >= 61) return '#059669';
  if (score >= 41) return '#F59E0B';
  return '#EF4444';
}

function getHealthGlow(score: number): string {
  if (score >= 81) return '0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.2)';
  if (score >= 61) return '0 0 10px rgba(5,150,105,0.3)';
  return 'none';
}

// ─── Animation Variants ─────────────────────────────────────
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
} as const;

const cardHover = {
  whileHover: { scale: 1.01, y: -2 },
  transition: { type: 'spring' as const, stiffness: 300 },
};

// ─── Health Score Ring Component ────────────────────────────
function TeamHealthRing({ score, color, glow }: { score: number; color: string; glow: string }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(0);
  const radius = 50;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const targetOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.floor(score / 40));
      const counter = setInterval(() => {
        current += step;
        if (current >= score) {
          current = score;
          clearInterval(counter);
        }
        setAnimatedScore(current);
      }, 25);
      setAnimatedOffset(targetOffset);
    }, 400);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative" style={{ filter: glow }}>
      <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className="stroke-[rgba(0,0,0,0.06)] dark:stroke-[rgba(255,255,255,0.06)]"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color, fontVariantNumeric: 'tabular-nums' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {animatedScore}
        </motion.span>
        <span
          className="text-[9px] font-semibold uppercase tracking-wider mt-0.5"
          style={{ color, opacity: 0.8 }}
        >
          {getHealthLabel(score)}
        </span>
      </div>
    </div>
  );
}

// ─── Mini Progress Bar ──────────────────────────────────────
function MiniProgressBar({
  label,
  value,
  maxValue,
  color,
  icon,
}: {
  label: string
  value: number
  maxValue: number
  color: string
  icon: React.ReactNode
}) {
  const percentage = Math.min(100, (value / maxValue) * 100)
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-[#52525B] dark:text-[#D4D4D8]">{label}</span>
          <span className="text-[10px] font-semibold" style={{ color }}>{value}/{maxValue}</span>
        </div>
        <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Activity Icon ──────────────────────────────────────────
function getActivityIcon(type: string) {
  switch (type) {
    case 'add': return <Network className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
    case 'link': return <GitBranch className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />;
    case 'invite': return <UserPlus className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />;
    case 'query': return <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />;
    default: return <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
  }
}

function getActivityBg(type: string) {
  switch (type) {
    case 'add': return 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.08)]';
    case 'link': return 'bg-teal-50 dark:bg-[rgba(13,148,136,0.08)]';
    case 'invite': return 'bg-violet-50 dark:bg-[rgba(124,58,237,0.08)]';
    case 'query': return 'bg-amber-50 dark:bg-[rgba(245,158,11,0.08)]';
    default: return 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.08)]';
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN TEAM PAGE
// ═══════════════════════════════════════════════════════════════
export default function TeamPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(false);
  const [team, setTeam] = useState<{ id: string; name: string; slug: string; plan: string } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ totalMembers: 0, activeToday: 0, totalFacts: 0, avgQueriesPerDay: 0 });
  const [roleCounts, setRoleCounts] = useState({ admin: 0, editor: 0, viewer: 0 });
  const [currentUserRole, setCurrentUserRole] = useState('viewer');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('editor');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteSending, setInviteSending] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Fetch team data
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch('/api/team');
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();

        setHasTeam(data.hasTeam);
        if (data.hasTeam) {
          setTeam(data.team);
          setMembers(data.members);
          setInvitations(data.invitations);
          setActivities(data.activities);
          setStats(data.stats);
          setRoleCounts(data.roleCounts);
          setCurrentUserRole(data.currentUserRole);
        }
      } catch (err) {
        console.error('Failed to fetch team:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeam();
  }, []);

  // Compute team health
  const teamHealth = useMemo(
    () => calculateTeamHealth(stats.totalMembers, stats.activeToday, stats.totalFacts, stats.avgQueriesPerDay),
    [stats]
  );

  const handleCreateTeam = async () => {
    if (!teamNameInput.trim()) return;
    setCreatingTeam(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', teamName: teamNameInput.trim() }),
      });
      if (!res.ok) throw new Error('Failed to create team');
      const teamRes = await fetch('/api/team');
      const data = await teamRes.json();
      setHasTeam(data.hasTeam);
      if (data.hasTeam) {
        setTeam(data.team);
        setMembers(data.members);
        setInvitations(data.invitations);
        setActivities(data.activities);
        setStats(data.stats);
        setRoleCounts(data.roleCounts);
        setCurrentUserRole(data.currentUserRole);
      }
    } catch (err) {
      console.error('Failed to create team:', err);
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteSending(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          inviteEmail: inviteEmail.trim(),
          inviteRole,
          inviteMessage: inviteMessage.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to send invitation');
      const teamRes = await fetch('/api/team');
      const data = await teamRes.json();
      if (data.hasTeam) {
        setInvitations(data.invitations);
      }
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteModal(false);
    } catch (err) {
      console.error('Failed to send invitation:', err);
    } finally {
      setInviteSending(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(team?.slug ? `${team.slug}.getlore.dev` : 'lore.getlore.dev');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full bg-[#F9FAFB] dark:bg-[#0F0F12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-8 w-8 text-emerald-500" />
          </motion.div>
          <span className="text-sm text-[#71717A] dark:text-[#A1A1AA]">Loading team...</span>
        </div>
      </div>
    );
  }

  // No team yet — show create team form
  if (!hasTeam) {
    return (
      <div className="h-full bg-[#F9FAFB] dark:bg-[#0F0F12] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto p-8 flex flex-col items-center justify-center min-h-[80vh]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'backOut' }}
            className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[rgba(16,185,129,0.12)] dark:to-[rgba(13,148,136,0.08)] border border-emerald-100 dark:border-[rgba(16,185,129,0.20)] flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10"
          >
            <Users className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2 text-center">Create Your Team</h1>
          <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] text-center mb-8 leading-relaxed">
            Start collaborating with your team on a shared knowledge graph. Invite members, share insights, and build collective memory.
          </p>
          <div className="w-full space-y-4">
            <div>
              <Label className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA] mb-1.5 block">Team Name</Label>
              <Input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                placeholder="e.g., Lore Engineering"
                className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 dark:focus-visible:border-emerald-600"
              />
            </div>
            <Button
              onClick={handleCreateTeam}
              disabled={!teamNameInput.trim() || creatingTeam}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 gap-2 h-10"
            >
              {creatingTeam ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {creatingTeam ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
          {/* Decorative floating elements */}
          <div className="flex items-center gap-3 mt-10">
            {memberColors.slice(0, 5).map((color, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: color, opacity: 0.4 + i * 0.1 }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
                {String.fromCharCode(65 + i)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F9FAFB] dark:bg-[#0F0F12] overflow-y-auto">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="max-w-[1280px] mx-auto space-y-6 p-4 md:p-6"
      >
        {/* ═══ TOP SECTION ═══════════════════════════════════════ */}
        <motion.div variants={staggerItem} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-2">[ TEAM ]</p>
                <Badge className="bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] text-[11px] font-semibold gap-1.5">
                  <Users className="w-3 h-3" />
                  {stats.totalMembers} member{stats.totalMembers !== 1 ? 's' : ''}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#18181B] dark:text-[#FAFAFA] mt-2">
                Team Management
              </h1>
              <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1">
                Manage your team members, roles, and permissions.
              </p>
            </div>
            {currentUserRole === 'admin' && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 gap-2 shrink-0"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite Member
                </Button>
              </motion.div>
            )}
          </div>

          {/* ── Stats Row ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Members', value: String(stats.totalMembers), icon: <Users className="h-4 w-4" />, color: '#059669' },
              { label: 'Active Today', value: String(stats.activeToday), icon: <Circle className="h-2.5 w-2.5 fill-[#22C55E] text-[#22C55E]" />, color: '#22C55E' },
              { label: 'Facts Contributed', value: stats.totalFacts.toLocaleString(), icon: <Zap className="h-4 w-4" />, color: '#EA580C' },
              { label: 'Avg. Queries/Day', value: String(stats.avgQueriesPerDay), icon: <TrendingUp className="h-4 w-4" />, color: '#0D9488' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={staggerItem} {...cardHover}>
                <Card className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${stat.color} 10%, transparent)` }}>
                        <span style={{ color: stat.color }}>{stat.icon}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
                    <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">{stat.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ TEAM HEALTH SCORE ═══════════════════════════════════ */}
        <motion.div variants={staggerItem}>
          <Card className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 dark:from-[rgba(16,185,129,0.12)] to-teal-100 dark:to-[rgba(13,148,136,0.08)] flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Team Health Score</h3>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold border-emerald-200 dark:border-[rgba(16,185,129,0.20)] bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)]"
                  style={{ color: getHealthColor(teamHealth.total) }}
                >
                  {getHealthLabel(teamHealth.total).toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* Circular gauge */}
                <TeamHealthRing
                  score={teamHealth.total}
                  color={getHealthColor(teamHealth.total)}
                  glow={getHealthGlow(teamHealth.total)}
                />
                {/* Component breakdown */}
                <div className="flex-1 w-full space-y-3.5">
                  <MiniProgressBar
                    label="Members"
                    value={teamHealth.members}
                    maxValue={25}
                    color="#059669"
                    icon={<Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                  />
                  <MiniProgressBar
                    label="Activity"
                    value={teamHealth.activity}
                    maxValue={25}
                    color="#22C55E"
                    icon={<Activity className="w-3 h-3 text-green-500 dark:text-green-400" />}
                  />
                  <MiniProgressBar
                    label="Contributions"
                    value={teamHealth.contributions}
                    maxValue={25}
                    color="#EA580C"
                    icon={<Zap className="w-3 h-3 text-orange-600 dark:text-orange-400" />}
                  />
                  <MiniProgressBar
                    label="Engagement"
                    value={teamHealth.engagement}
                    maxValue={25}
                    color="#0D9488"
                    icon={<Target className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ═══ MAIN CONTENT — TWO COLUMNS ═══════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ─── LEFT COLUMN (2/3) ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* ── Members Grid ──────────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] !p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Members</h3>
                  <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]" style={{ fontVariantNumeric: 'tabular-nums' }}>{members.length} total</span>
                </div>
                {members.length === 0 ? (
                  <LoreEmptyState
                    icon={Users}
                    title="Build your team"
                    description="Invite team members to collaborate on your knowledge graph"
                    actionLabel="Invite Members"
                    onAction={() => setShowInviteModal(true)}
                  />
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {members.map((member, i) => {
                        const badgeConfig = roleBadgeConfig(member.role);
                        const RoleIcon = badgeConfig.icon;
                        return (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="group p-4 rounded-xl bg-[#F9FAFB] dark:bg-[#0F0F12] border border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)] hover:border-emerald-200 dark:hover:border-emerald-600/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all cursor-default"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm"
                                style={{ background: `color-mix(in srgb, ${memberColors[i % memberColors.length]} 12%, transparent)` }}
                              >
                                <span className="text-xs font-bold" style={{ color: memberColors[i % memberColors.length] }}>
                                  {getInitials(member.name)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                                    {member.name}
                                  </p>
                                  {/* Status indicator */}
                                  <span
                                    className="h-2 w-2 rounded-full shrink-0 ring-2 ring-white dark:ring-[#0F0F12]"
                                    style={{ background: statusDot(member.status) }}
                                  />
                                </div>
                                <p className="text-[10px] text-[#A1A1AA] dark:text-[#52525B] truncate">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-lg font-medium capitalize flex items-center gap-1"
                                style={{
                                  background: `color-mix(in srgb, ${badgeConfig.text} 8%, transparent)`,
                                  color: badgeConfig.text,
                                  border: `1px solid color-mix(in srgb, ${badgeConfig.text} 15%, transparent)`,
                                }}
                              >
                                <RoleIcon className="w-2.5 h-2.5" />
                                {member.role}
                              </span>
                              <div className="flex items-center gap-3 text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                                <span className="flex items-center gap-1">
                                  <Network className="w-2.5 h-2.5" />
                                  {member.facts}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Zap className="w-2.5 h-2.5" />
                                  {member.queries}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* ── Pending Invitations ────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] !p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Pending Invitations</h3>
                  <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]" style={{ fontVariantNumeric: 'tabular-nums' }}>{invitations.length} pending</span>
                </div>
                {invitations.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Mail className="h-8 w-8 text-[#D4D4D8] dark:text-[#3F3F46] mx-auto mb-2" />
                    <p className="text-sm text-[#71717A] dark:text-[#A1A1AA]">No pending invitations</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F3F4F6] dark:divide-[rgba(255,255,255,0.06)]">
                    {invitations.map((inv, i) => {
                      const badgeConfig = roleBadgeConfig(inv.role);
                      return (
                        <motion.div
                          key={inv.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[#F9FAFB] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                        >
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 dark:bg-[rgba(245,158,11,0.08)] border border-amber-100 dark:border-[rgba(245,158,11,0.15)]">
                            <Mail className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#52525B] dark:text-[#D4D4D8] truncate">{inv.email}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded font-medium capitalize"
                                style={{
                                  background: `color-mix(in srgb, ${badgeConfig.text} 8%, transparent)`,
                                  color: badgeConfig.text,
                                  border: `1px solid color-mix(in srgb, ${badgeConfig.text} 15%, transparent)`,
                                }}
                              >
                                {inv.role}
                              </span>
                              <span className="text-[10px] text-[#A1A1AA] dark:text-[#52525B]">{inv.sentDate}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN (1/3) ─────────────────────────────── */}
          <div className="space-y-4">
            {/* ── Team Settings ──────────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-4">Team Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Team Name</p>
                        <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA] mt-0.5">{team?.name || 'My Team'}</p>
                      </div>
                    </div>
                    <div className="h-px bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.06)]" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Team URL</p>
                        <p className="text-sm font-mono text-[#52525B] dark:text-[#A1A1AA] mt-0.5">{team?.slug || 'team'}.getlore.dev</p>
                      </div>
                      <button
                        onClick={handleCopyUrl}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-[#A1A1AA] dark:text-[#52525B] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] transition-colors"
                      >
                        {copiedUrl ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="h-px bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.06)]" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Plan</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA] capitalize">{team?.plan || 'Free'}</span>
                          <Badge className="bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] text-[9px]">Current</Badge>
                        </div>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-2 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)]">
                      <ExternalLink className="h-3 w-3" />
                      Manage Subscription
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Roles & Permissions ────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-4">Roles & Permissions</h3>
                  <div className="space-y-3">
                    {[
                      {
                        role: 'admin' as Role,
                        icon: <Crown className="h-4 w-4" />,
                        color: '#059669',
                        members: roleCounts.admin,
                        permissions: [
                          { name: 'Manage members', allowed: true },
                          { name: 'Edit all content', allowed: true },
                          { name: 'Delete facts & decisions', allowed: true },
                          { name: 'Manage billing', allowed: true },
                        ],
                      },
                      {
                        role: 'editor' as Role,
                        icon: <Pencil className="h-4 w-4" />,
                        color: '#0D9488',
                        members: roleCounts.editor,
                        permissions: [
                          { name: 'Create facts & decisions', allowed: true },
                          { name: 'Edit own content', allowed: true },
                          { name: 'Delete own content', allowed: true },
                          { name: 'Manage members', allowed: false },
                        ],
                      },
                      {
                        role: 'viewer' as Role,
                        icon: <Eye className="h-4 w-4" />,
                        color: '#71717A',
                        members: roleCounts.viewer,
                        permissions: [
                          { name: 'View all content', allowed: true },
                          { name: 'Query knowledge', allowed: true },
                          { name: 'Create facts', allowed: false },
                          { name: 'Edit content', allowed: false },
                        ],
                      },
                    ].map((roleItem) => (
                      <div
                        key={roleItem.role}
                        className="bg-[#F9FAFB] dark:bg-[#0F0F12] border border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)] rounded-xl p-3"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `color-mix(in srgb, ${roleItem.color} 10%, transparent)` }}
                          >
                            <span style={{ color: roleItem.color }}>{roleItem.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-[#18181B] dark:text-[#FAFAFA] capitalize">{roleItem.role}</p>
                            <p className="text-[10px] text-[#A1A1AA] dark:text-[#52525B]">
                              {roleItem.members} member{roleItem.members !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1.5 mt-2">
                          {roleItem.permissions.map((perm) => (
                            <div key={perm.name} className="flex items-center gap-2">
                              {perm.allowed ? (
                                <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                              ) : (
                                <X className="h-3 w-3 text-[#D4D4D8] dark:text-[#3F3F46] shrink-0" />
                              )}
                              <span className={`text-[11px] ${perm.allowed ? 'text-[#52525B] dark:text-[#D4D4D8]' : 'text-[#A1A1AA] dark:text-[#52525B]'}`}>
                                {perm.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Activity Feed ──────────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Activity Feed</h3>
                    <Badge className="bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-[rgba(16,185,129,0.20)] text-[9px] font-bold">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      LIVE
                    </Badge>
                  </div>
                  {activities.length === 0 ? (
                    <div className="py-6 text-center">
                      <Zap className="h-6 w-6 text-[#D4D4D8] dark:text-[#3F3F46] mx-auto mb-2" />
                      <p className="text-xs text-[#A1A1AA] dark:text-[#52525B]">No team activity yet</p>
                    </div>
                  ) : (
                    <div className="space-y-0 max-h-80 overflow-y-auto">
                      {activities.map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 py-2.5 group"
                          style={{
                            borderBottom: i < activities.length - 1 ? '1px solid' : 'none',
                            borderColor: 'var(--border-subtle, #F3F4F6)',
                          }}
                        >
                          <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${getActivityBg(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#52525B] dark:text-[#D4D4D8] group-hover:text-[#18181B] dark:group-hover:text-[#FAFAFA] transition-colors truncate">
                              {activity.text}
                            </p>
                          </div>
                          <span className="text-[10px] text-[#A1A1AA] dark:text-[#52525B] shrink-0 whitespace-nowrap flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {activity.time}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* ═══ INVITE MEMBER MODAL ═══════════════════════════════ */}
        <AnimatePresence>
          {showInviteModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={() => setShowInviteModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] rounded-2xl w-full max-w-md p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[rgba(16,185,129,0.12)] dark:to-[rgba(13,148,136,0.08)] flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-[#18181B] dark:text-[#FAFAFA]">Invite Team Member</h3>
                    </div>
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="p-1.5 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[rgba(255,255,255,0.06)] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#FAFAFA] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA] mb-1.5 block">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      aria-label="Invitee email"
                      className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 dark:focus-visible:border-emerald-600"
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA] mb-2 block">
                      Role
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['admin', 'editor', 'viewer'] as Role[]).map((role) => {
                        const isSelected = inviteRole === role;
                        const config = roleBadgeConfig(role);
                        const RoleIcon = config.icon;
                        return (
                          <button
                            key={role}
                            onClick={() => setInviteRole(role)}
                            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border capitalize ${
                              isSelected
                                ? 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] border-emerald-200 dark:border-[rgba(16,185,129,0.20)] text-emerald-700 dark:text-emerald-400'
                                : 'bg-[#F9FAFB] dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] text-[#71717A] dark:text-[#A1A1AA] hover:border-emerald-200 dark:hover:border-emerald-600/40 hover:text-[#18181B] dark:hover:text-[#FAFAFA]'
                            }`}
                          >
                            <RoleIcon className="h-4 w-4" style={{ color: isSelected ? config.text : '#A1A1AA' }} />
                            <span>{role}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-5">
                    <Label className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA] mb-1.5 block">
                      Personal Message <span className="text-[#A1A1AA] dark:text-[#52525B]">(optional)</span>
                    </Label>
                    <Textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Add a personal note to your invitation..."
                      aria-label="Personal message"
                      rows={3}
                      className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 dark:focus-visible:border-emerald-600 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowInviteModal(false)}
                      className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] text-sm text-[#52525B] dark:text-[#D4D4D8]"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInvite}
                      disabled={!inviteEmail.trim() || inviteSending}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 text-sm gap-1.5 disabled:opacity-50"
                    >
                      {inviteSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
                      {inviteSending ? 'Sending...' : 'Send Invitation'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
