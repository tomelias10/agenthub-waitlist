/* eslint-disable react-refresh/only-export-components */
import {
  SiGmail,
  SiGooglecalendar,
  SiGooglesheets,
  SiGoogledrive,
  SiGoogledocs,
  SiNotion,
  SiSlack,
  SiHubspot,
  SiAirtable,
  SiJira,
  SiLinear,
  SiSupabase,
  SiYoutube,
  SiDiscord,
  SiFigma,
  SiAsana,
  SiGithub,
} from 'react-icons/si'

/* Microsoft brand marks aren't in Simple Icons — clean inline fallbacks
   that render exactly like the others (1em, currentColor). */
const OutlookIcon = (props) => (
  <svg viewBox="0 0 24 24" height="1em" width="1em" fill="currentColor" {...props}>
    <path d="M21 5h-8a1 1 0 0 0-1 1v1.6H4a2 2 0 0 0-2 2v8.8a2 2 0 0 0 2 2h8a1 1 0 0 0 1-1v-1.6h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Zm-1 2v2.1l-5 3V7h5ZM8 16.6A2.6 2.6 0 1 1 10.6 14 2.6 2.6 0 0 1 8 16.6Z" />
  </svg>
)

const TeamsIcon = (props) => (
  <svg viewBox="0 0 24 24" height="1em" width="1em" fill="currentColor" {...props}>
    <path d="M15 8a2.75 2.75 0 1 0-2.75-2.75A2.75 2.75 0 0 0 15 8Zm-7.5.5A2.25 2.25 0 1 0 5.25 6.25 2.25 2.25 0 0 0 7.5 8.5ZM9 11c-2.2 0-6.5 1.15-6.5 3.4V18H9Zm6.4.05A4 4 0 0 1 13.7 11H13v8h8.5v-4.2c0-1.95-3.4-3.05-6.1-3.75Z" />
  </svg>
)

/* key → { name, Icon, color }. Icons are colored via the parent's `color`. */
export const TOOL = {
  gmail: { name: 'Gmail', Icon: SiGmail, color: '#EA4335' },
  gcal: { name: 'Calendar', Icon: SiGooglecalendar, color: '#4285F4' },
  sheets: { name: 'Sheets', Icon: SiGooglesheets, color: '#0F9D58' },
  drive: { name: 'Drive', Icon: SiGoogledrive, color: '#4F86EC' },
  docs: { name: 'Docs', Icon: SiGoogledocs, color: '#4285F4' },
  notion: { name: 'Notion', Icon: SiNotion, color: '#F5F5F7' },
  slack: { name: 'Slack', Icon: SiSlack, color: '#E8527E' },
  hubspot: { name: 'HubSpot', Icon: SiHubspot, color: '#FF7A59' },
  airtable: { name: 'Airtable', Icon: SiAirtable, color: '#FCB400' },
  outlook: { name: 'Outlook', Icon: OutlookIcon, color: '#2B7CD3' },
  teams: { name: 'Teams', Icon: TeamsIcon, color: '#7B7FCF' },
  jira: { name: 'Jira', Icon: SiJira, color: '#2684FF' },
  linear: { name: 'Linear', Icon: SiLinear, color: '#8A91F2' },
  supabase: { name: 'Supabase', Icon: SiSupabase, color: '#3ECF8E' },
  youtube: { name: 'YouTube', Icon: SiYoutube, color: '#FF3D3D' },
  discord: { name: 'Discord', Icon: SiDiscord, color: '#5865F2' },
  figma: { name: 'Figma', Icon: SiFigma, color: '#E0633F' },
  asana: { name: 'Asana', Icon: SiAsana, color: '#F06A6A' },
  github: { name: 'GitHub', Icon: SiGithub, color: '#F5F5F7' },
}

/* Ordered list shown in the hero integration cloud */
export const INTEGRATIONS = [
  'gmail', 'gcal', 'sheets', 'drive', 'docs', 'notion', 'slack', 'hubspot',
  'airtable', 'outlook', 'teams', 'jira', 'linear', 'supabase', 'youtube',
  'discord', 'figma', 'asana', 'github',
]

/* Small reusable logo chip */
export function ToolIcon({ k, size = 18 }) {
  const t = TOOL[k]
  if (!t) return null
  const Icon = t.Icon
  return (
    <span
      className="toolico"
      style={{ color: t.color, fontSize: size }}
      aria-hidden="true"
    >
      <Icon />
    </span>
  )
}
