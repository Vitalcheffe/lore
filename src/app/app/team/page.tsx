'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';

// ═══════════════════════════════════════════════════════════════
// LORE — Team Management Page (Light Mode)
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

function roleBadgeColor(role: string) {
  if (role === 'admin') return { bg: 'rgba(5,150,105,0.08)', text: '#059669', border: 'rgba(5,150,105,0.15)' };
  if (role === 'editor') return { bg: 'rgba(13,148,136,0.08)', text: '#0D9488', border: 'rgba(13,148,136,0.15)' };
  return { bg: 'rgba(113,113,122,0.08)', text: '#71717A', border: 'rgba(113,113,122,0.15)' };
}

function statusDot(status: string) {
  if (status === 'online') return '#22C55E';
  if (status === 'away') return '#F59E0B';
  return '#94A3B8';
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const memberColors = ['#059669', '#0D9488', '#3B82F6', '#F59E0B', '#EC4899', '#7C3AED', '#047857', '#F43F5E', '#06B6D4', '#84CC16'];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

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
      // Re-fetch team data
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
      // Re-fetch team data
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
      <div className="h-full bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // No team yet — show create team form
  if (!hasTeam) {
    return (
      <div className="h-full bg-[#F9FAFB] overflow-y-auto">
        <div className="max-w-lg mx-auto p-8 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#18181B] mb-2">Create Your Team</h1>
          <p className="text-sm text-[#71717A] text-center mb-8">
            Start collaborating with your team on a shared knowledge graph. Invite members, share insights, and build collective memory.
          </p>
          <div className="w-full space-y-4">
            <div>
              <Label className="text-xs font-medium text-[#71717A] mb-1.5 block">Team Name</Label>
              <Input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                placeholder="e.g., Lore Engineering"
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
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
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F9FAFB] overflow-y-auto">
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
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2">[ TEAM ]</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#18181B] mt-2">
                Team Management
              </h1>
              <p className="text-sm text-[#71717A] mt-1">
                Manage your team members, roles, and permissions.
              </p>
            </div>
            {currentUserRole === 'admin' && (
              <Button
                onClick={() => setShowInviteModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 gap-2 shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
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
              <motion.div key={stat.label} variants={staggerItem}>
                <Card className="bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}10` }}>
                        <span style={{ color: stat.color }}>{stat.icon}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
                    <span className="text-[11px] text-[#71717A]">{stat.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ MAIN CONTENT — TWO COLUMNS ═══════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ─── LEFT COLUMN (2/3) ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* ── Members Table ──────────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white border-[#E5E7EB] !p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18181B]">Members</h3>
                  <span className="text-[11px] text-[#71717A]" style={{ fontVariantNumeric: 'tabular-nums' }}>{members.length} total</span>
                </div>
                {members.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Users className="h-8 w-8 text-[#D4D4D8] mx-auto mb-2" />
                    <p className="text-sm text-[#71717A]">No team members yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#F3F4F6]">
                          <th className="text-left text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-5 py-2.5">Member</th>
                          <th className="text-left text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-3 py-2.5">Role</th>
                          <th className="text-left text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-3 py-2.5">Facts</th>
                          <th className="text-left text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-3 py-2.5">Queries</th>
                          <th className="text-left text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-3 py-2.5">Last Active</th>
                          <th className="text-left text-[10px] font-semibold text-[#71717A] uppercase tracking-wider px-3 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, i) => {
                          const badge = roleBadgeColor(member.role);
                          return (
                            <tr key={member.id} className="cursor-pointer group hover:bg-[#F9FAFB] transition-colors border-b border-[#F3F4F6] last:border-b-0">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                                    style={{ background: `${memberColors[i % memberColors.length]}12` }}
                                  >
                                    <span className="text-xs font-bold" style={{ color: memberColors[i % memberColors.length] }}>
                                      {getInitials(member.name)}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#18181B] group-hover:text-emerald-700 transition-colors truncate">
                                      {member.name}
                                    </p>
                                    <p className="text-[10px] text-[#A1A1AA] truncate">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className="text-[10px] px-2.5 py-1 rounded-lg font-medium capitalize"
                                  style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}
                                >
                                  {member.role}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span className="text-sm text-[#18181B]" style={{ fontVariantNumeric: 'tabular-nums' }}>{member.facts}</span>
                              </td>
                              <td className="px-3 py-3">
                                <span className="text-sm text-[#18181B]" style={{ fontVariantNumeric: 'tabular-nums' }}>{member.queries}</span>
                              </td>
                              <td className="px-3 py-3">
                                <span className="text-xs text-[#71717A]">{member.lastActive}</span>
                              </td>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="h-2 w-2 rounded-full shrink-0"
                                    style={{ background: statusDot(member.status) }}
                                  />
                                  <span className="text-[10px] text-[#71717A] capitalize">
                                    {member.status}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* ── Pending Invitations ────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white border-[#E5E7EB] !p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18181B]">Pending Invitations</h3>
                  <span className="text-[11px] text-[#71717A]" style={{ fontVariantNumeric: 'tabular-nums' }}>{invitations.length} pending</span>
                </div>
                {invitations.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <Mail className="h-8 w-8 text-[#D4D4D8] mx-auto mb-2" />
                    <p className="text-sm text-[#71717A]">No pending invitations</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F3F4F6]">
                    {invitations.map((inv) => {
                      const badge = roleBadgeColor(inv.role);
                      return (
                        <div
                          key={inv.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[#F9FAFB] transition-colors"
                        >
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-[#F9FAFB] border border-[#E5E7EB]">
                            <Mail className="h-3.5 w-3.5 text-[#71717A]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#52525B] truncate">{inv.email}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded font-medium capitalize"
                                style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}
                              >
                                {inv.role}
                              </span>
                              <span className="text-[10px] text-[#A1A1AA]">{inv.sentDate}</span>
                            </div>
                          </div>
                        </div>
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
              <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-[#18181B] mb-4">Team Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#71717A]">Team Name</p>
                        <p className="text-sm font-semibold text-[#18181B] mt-0.5">{team?.name || 'My Team'}</p>
                      </div>
                    </div>
                    <div className="h-px bg-[#F3F4F6]" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#71717A]">Team URL</p>
                        <p className="text-sm font-mono text-[#52525B] mt-0.5">{team?.slug || 'team'}.getlore.dev</p>
                      </div>
                      <button
                        onClick={handleCopyUrl}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        {copiedUrl ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="h-px bg-[#F3F4F6]" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#71717A]">Plan</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-[#18181B] capitalize">{team?.plan || 'Free'}</span>
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[9px]">Current</Badge>
                        </div>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors mt-2 py-2 rounded-lg hover:bg-emerald-50">
                      <ExternalLink className="h-3 w-3" />
                      Manage Subscription
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Roles & Permissions ────────────────────────────── */}
            <motion.div variants={staggerItem}>
              <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-[#18181B] mb-4">Roles & Permissions</h3>
                  <div className="space-y-3">
                    {[
                      {
                        role: 'admin' as Role,
                        icon: <Shield className="h-4 w-4" />,
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
                        color: '#3B82F6',
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
                        className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl p-3"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${roleItem.color}10` }}
                          >
                            <span style={{ color: roleItem.color }}>{roleItem.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-[#18181B] capitalize">{roleItem.role}</p>
                            <p className="text-[10px] text-[#A1A1AA]">
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
                                <X className="h-3 w-3 text-[#D4D4D8] shrink-0" />
                              )}
                              <span className={`text-[11px] ${perm.allowed ? 'text-[#52525B]' : 'text-[#A1A1AA]'}`}>
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
              <Card className="bg-white border-[#E5E7EB]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#18181B]">Activity Feed</h3>
                  </div>
                  {activities.length === 0 ? (
                    <div className="py-6 text-center">
                      <Zap className="h-6 w-6 text-[#D4D4D8] mx-auto mb-2" />
                      <p className="text-xs text-[#A1A1AA]">No team activity yet</p>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {activities.map((activity, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 py-2.5 group"
                          style={{
                            borderBottom: i < activities.length - 1 ? '1px solid #F3F4F6' : 'none',
                          }}
                        >
                          <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50">
                            <Zap className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#52525B] group-hover:text-[#18181B] transition-colors truncate">
                              {activity.text}
                            </p>
                          </div>
                          <span className="text-[10px] text-[#A1A1AA] shrink-0 whitespace-nowrap">
                            {activity.time}
                          </span>
                        </div>
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
                  className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-md p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-bold text-[#18181B]">Invite Team Member</h3>
                    </div>
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="p-1.5 rounded-lg hover:bg-[#F9FAFB] text-[#71717A] hover:text-[#18181B] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-[#71717A] mb-1.5 block">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      aria-label="Invitee email"
                      className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs font-medium text-[#71717A] mb-2 block">
                      Role
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['admin', 'editor', 'viewer'] as Role[]).map((role) => {
                        const isSelected = inviteRole === role;
                        return (
                          <button
                            key={role}
                            onClick={() => setInviteRole(role)}
                            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border capitalize ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#71717A] hover:border-emerald-200 hover:text-[#18181B]'
                            }`}
                          >
                            {role === 'admin' && <Shield className="h-4 w-4" style={{ color: isSelected ? '#059669' : '#A1A1AA' }} />}
                            {role === 'editor' && <Pencil className="h-4 w-4" style={{ color: isSelected ? '#0D9488' : '#A1A1AA' }} />}
                            {role === 'viewer' && <Eye className="h-4 w-4" style={{ color: isSelected ? '#3B82F6' : '#A1A1AA' }} />}
                            <span>{role}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-5">
                    <Label className="text-xs font-medium text-[#71717A] mb-1.5 block">
                      Personal Message <span className="text-[#A1A1AA]">(optional)</span>
                    </Label>
                    <Textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Add a personal note to your invitation..."
                      aria-label="Personal message"
                      rows={3}
                      className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowInviteModal(false)}
                      className="border-[#E5E7EB] text-sm"
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
