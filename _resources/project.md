```markdown
# KB Recommendation Report Generator

A clean, modern web application for viewing and managing Knowledge Base recommendations generated from support ticket analysis.

## 🎯 Project Overview

This application displays KB recommendations by slug category, allowing you to:
- View all slugs with their analysis status
- See detailed recommendations for each slug
- Export recommendations as formatted reports
- Track analysis progress and priorities

## 🛠️ Tech Stack

- **Astro** - Static site generation
- **Supabase** - PostgreSQL database
- **Vanilla CSS + JS** - Clean, minimal styling (Vercel/shadcn inspired)
- **TypeScript** - Type safety

## 📁 Project Structure

```
src/
├── components/
│   ├── SlugCard.astro          # Individual slug display card
│   ├── RecommendationCard.astro # Recommendation detail card
│   ├── SectionList.astro        # Section content display
│   ├── ProgressBar.astro        # Analysis progress indicator
│   └── Header.astro             # Page header/nav
├── layouts/
│   └── Layout.astro             # Base layout with global styles
├── pages/
│   ├── index.astro              # All slugs overview
│   └── slug/
│       └── [slug].astro         # Individual slug recommendations
├── styles/
│   └── global.css               # Global styles
└── lib/
    ├── supabase.ts              # Supabase client
    └── types.ts                 # TypeScript types
```

## 🚀 Setup Instructions

### 1. Environment Variables

Ensure your `.env` file has:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 3. Create Project Files

Follow the file structure below, creating each file as specified.

---

## 📄 File Contents

### `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### `src/lib/types.ts`

```typescript
export interface Slug {
  slug: string;
  ticket_count: number;
  match: boolean | null;
  matched_documents: any;
  matched_search: string | null;
  last_matched: string | null;
  first_seen: string;
  last_seen: string;
}

export interface SlugWithStats extends Slug {
  recommendation_count: number;
  high_priority_count: number;
  medium_priority_count: number;
  low_priority_count: number;
  total_sections: number;
  total_tickets_analyzed: number;
  analysis_status: string | null;
  avg_confidence: number | null;
}

export interface Recommendation {
  recommendation_id: number;
  slug: string;
  title: string;
  status: string;
  priority: string;
  confidence_score: number;
  ticket_pattern: string | null;
  frequency_data: {
    ticket_count?: number;
    tickets_per_month?: number;
    trend?: string;
  } | null;
  affected_user_groups: string[] | null;
  keywords: string[] | null;
  related_slugs: string[] | null;
  success_criteria: any;
  analyst_notes: string | null;
  created_at: string;
  last_analyzed: string | null;
}

export interface Section {
  section_id: number;
  section_number: number;
  section_title: string;
  section_type: string | null;
  content_outline: string;
  source_info: string | null;
  estimated_time: string | null;
}

export interface SourceTicket {
  ticket_id: number;
  contribution_type: string | null;
  relevance_score: number | null;
  notes: string | null;
}

export interface RecommendationDetail extends Recommendation {
  sections: Section[];
  source_tickets: SourceTicket[];
}

export interface AnalysisProgress {
  slug: string;
  total_tickets: number | null;
  tickets_analyzed: number;
  last_ticket_id: number | null;
  kb_searches_performed: number;
  status: string;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}
```

### `src/styles/global.css`

```css
/* Clean, modern design inspired by Vercel/shadcn */

:root {
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-muted: #fafafa;
  --color-muted-foreground: #737373;
  --color-border: #e5e5e5;
  --color-accent: #0070f3;
  --color-accent-foreground: #ffffff;
  --color-success: #0070f3;
  --color-warning: #f5a623;
  --color-danger: #ff0000;
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-background);
  color: var(--color-foreground);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 0.875rem;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

h4 {
  font-size: 1.25rem;
  margin-bottom: 0.625rem;
}

p {
  margin-bottom: 1rem;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.container-narrow {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.header {
  border-bottom: 1px solid var(--color-border);
  padding: 1.5rem 0;
  margin-bottom: 3rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-foreground);
  text-decoration: none;
}

.header-nav {
  display: flex;
  gap: 1.5rem;
}

.header-link {
  color: var(--color-muted-foreground);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.header-link:hover {
  color: var(--color-foreground);
}

/* Cards */
.card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all 0.2s;
}

.card:hover {
  border-color: var(--color-muted-foreground);
  box-shadow: var(--shadow-md);
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-description {
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.card-content {
  margin-bottom: 1rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

/* Grid */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, 1fr);
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

.badge-high {
  background-color: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.badge-medium {
  background-color: rgba(245, 166, 35, 0.1);
  color: #d97706;
}

.badge-low {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.badge-success {
  background-color: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.badge-default {
  background-color: var(--color-muted);
  color: var(--color-muted-foreground);
}

/* Buttons */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.button-primary {
  background-color: var(--color-foreground);
  color: var(--color-background);
  border-color: var(--color-foreground);
}

.button-primary:hover {
  opacity: 0.8;
}

.button-secondary {
  background-color: var(--color-background);
  color: var(--color-foreground);
  border-color: var(--color-border);
}

.button-secondary:hover {
  background-color: var(--color-muted);
}

.button-ghost {
  background-color: transparent;
  color: var(--color-foreground);
}

.button-ghost:hover {
  background-color: var(--color-muted);
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: var(--color-muted);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-accent);
  transition: width 0.3s;
}

/* Stats */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  padding: 1rem;
  background: var(--color-muted);
  border-radius: var(--radius-md);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-foreground);
}

/* Section List */
.section-list {
  list-style: none;
  counter-reset: section-counter;
}

.section-item {
  counter-increment: section-counter;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.section-item:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.section-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
}

.section-number::before {
  content: counter(section-counter) ". ";
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.section-type {
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: auto;
}

.section-content {
  color: var(--color-muted-foreground);
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 0.9375rem;
}

.section-meta {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-muted-foreground);
}

/* Source Tickets */
.ticket-list {
  list-style: none;
}

.ticket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--color-muted);
  border-radius: var(--radius-sm);
}

.ticket-id {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
}

.ticket-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state-description {
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

/* Loading */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-muted);
  border-top-color: var(--color-foreground);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Utility Classes */
.text-muted {
  color: var(--color-muted-foreground);
}

.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.font-mono {
  font-family: var(--font-mono);
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-8 {
  margin-top: 2rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}
```

### `src/layouts/Layout.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'KB Recommendation Report Generator' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### `src/components/Header.astro`

```astro
---
const { current = 'home' } = Astro.props;
---

<header class="header">
  <div class="container">
    <div class="header-content">
      <a href="/" class="header-title">KB Recommendations</a>
      <nav class="header-nav">
        <a 
          href="/" 
          class:list={['header-link', { active: current === 'home' }]}
        >
          All Slugs
        </a>
      </nav>
    </div>
  </div>
</header>

<style>
  .header-link.active {
    color: var(--color-foreground);
    font-weight: 500;
  }
</style>
```

### `src/components/ProgressBar.astro`

```astro
---
interface Props {
  current: number;
  total: number;
}

const { current, total } = Astro.props;
const percentage = total > 0 ? (current / total) * 100 : 0;
---

<div class="progress-container">
  <div class="progress-info">
    <span class="text-sm text-muted">{current} of {total} tickets analyzed</span>
    <span class="text-sm font-mono">{percentage.toFixed(1)}%</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style={`width: ${percentage}%`}></div>
  </div>
</div>

<style>
  .progress-container {
    margin-bottom: 1rem;
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
</style>
```

### `src/components/SlugCard.astro`

```astro
---
import type { SlugWithStats } from '../lib/types';

interface Props {
  slug: SlugWithStats;
}

const { slug } = Astro.props;

const getPriorityColor = (priority: string) => {
  if (priority === 'high') return 'badge-high';
  if (priority === 'medium') return 'badge-medium';
  if (priority === 'low') return 'badge-low';
  return 'badge-default';
};

const getStatusColor = (status: string | null) => {
  if (status === 'completed') return 'badge-success';
  if (status === 'in_progress') return 'badge-medium';
  if (status === 'failed') return 'badge-high';
  return 'badge-default';
};
---

<a href={`/slug/${slug.slug}`} class="card slug-card">
  <div class="card-header">
    <div class="flex items-center justify-between mb-4">
      <h3 class="card-title">{slug.slug}</h3>
      {slug.match && <span class="badge badge-success">Has KB Docs</span>}
      {!slug.match && slug.recommendation_count > 0 && (
        <span class="badge badge-high">Needs KB Article</span>
      )}
    </div>
  </div>

  <div class="card-content">
    <div class="stat-grid">
      <div class="stat-item">
        <div class="stat-label">Tickets</div>
        <div class="stat-value">{slug.ticket_count}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Recommendations</div>
        <div class="stat-value">{slug.recommendation_count || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Sections</div>
        <div class="stat-value">{slug.total_sections || 0}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Analyzed</div>
        <div class="stat-value">{slug.total_tickets_analyzed || 0}</div>
      </div>
    </div>

    {!slug.match && slug.recommendation_count > 0 && (
      <div class="priority-badges">
        {slug.high_priority_count > 0 && (
          <span class="badge badge-high">{slug.high_priority_count} High Priority</span>
        )}
        {slug.medium_priority_count > 0 && (
          <span class="badge badge-medium">{slug.medium_priority_count} Medium</span>
        )}
        {slug.low_priority_count > 0 && (
          <span class="badge badge-low">{slug.low_priority_count} Low</span>
        )}
      </div>
    )}

    {slug.avg_confidence && (
      <div class="mt-4">
        <span class="text-sm text-muted">Avg Confidence: </span>
        <span class="text-sm font-mono">{slug.avg_confidence.toFixed(1)}/10</span>
      </div>
    )}
  </div>

  <div class="card-footer">
    {slug.analysis_status && (
      <span class={`badge ${getStatusColor(slug.analysis_status)}`}>
        {slug.analysis_status.replace('_', ' ')}
      </span>
    )}
    <span class="text-sm text-muted">View Details →</span>
  </div>
</a>

<style>
  .slug-card {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .priority-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
```

### `src/components/RecommendationCard.astro`

```astro
---
import type { RecommendationDetail } from '../lib/types';

interface Props {
  recommendation: RecommendationDetail;
}

const { recommendation } = Astro.props;

const getPriorityClass = (priority: string) => {
  if (priority === 'high') return 'badge-high';
  if (priority === 'medium') return 'badge-medium';
  if (priority === 'low') return 'badge-low';
  return 'badge-default';
};
---

<div class="card recommendation-card">
  <div class="card-header">
    <div class="flex items-center justify-between mb-4">
      <h3 class="card-title">{recommendation.title}</h3>
      <span class={`badge ${getPriorityClass(recommendation.priority)}`}>
        {recommendation.priority.toUpperCase()}
      </span>
    </div>
    
    {recommendation.ticket_pattern && (
      <p class="card-description">{recommendation.ticket_pattern}</p>
    )}
  </div>

  <div class="card-content">
    <!-- Stats -->
    <div class="stat-grid mb-6">
      <div class="stat-item">
        <div class="stat-label">Confidence</div>
        <div class="stat-value">{recommendation.confidence_score}/10</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Sections</div>
        <div class="stat-value">{recommendation.sections.length}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Source Tickets</div>
        <div class="stat-value">{recommendation.source_tickets.length}</div>
      </div>
      {recommendation.frequency_data?.ticket_count && (
        <div class="stat-item">
          <div class="stat-label">Ticket Count</div>
          <div class="stat-value">{recommendation.frequency_data.ticket_count}</div>
        </div>
      )}
    </div>

    <!-- Frequency Data -->
    {recommendation.frequency_data && (
      <div class="info-section mb-6">
        <h4 class="info-title">Impact</h4>
        <div class="info-grid">
          {recommendation.frequency_data.tickets_per_month && (
            <div>
              <span class="text-sm text-muted">Monthly Volume: </span>
              <span class="text-sm font-mono">{recommendation.frequency_data.tickets_per_month}/month</span>
            </div>
          )}
          {recommendation.frequency_data.trend && (
            <div>
              <span class="text-sm text-muted">Trend: </span>
              <span class="text-sm">{recommendation.frequency_data.trend}</span>
            </div>
          )}
        </div>
      </div>
    )}

    <!-- Keywords -->
    {recommendation.keywords && recommendation.keywords.length > 0 && (
      <div class="info-section mb-6">
        <h4 class="info-title">Keywords</h4>
        <div class="keyword-list">
          {recommendation.keywords.map((keyword) => (
            <span class="badge badge-default">{keyword}</span>
          ))}
        </div>
      </div>
    )}

    <!-- Affected User Groups -->
    {recommendation.affected_user_groups && recommendation.affected_user_groups.length > 0 && (
      <div class="info-section mb-6">
        <h4 class="info-title">Affected User Groups</h4>
        <div class="keyword-list">
          {recommendation.affected_user_groups.map((group) => (
            <span class="badge badge-default">{group}</span>
          ))}
        </div>
      </div>
    )}

    <!-- Sections -->
    <div class="info-section mb-6">
      <h4 class="info-title">Content Sections ({recommendation.sections.length})</h4>
      <ol class="section-list">
        {recommendation.sections
          .sort((a, b) => a.section_number - b.section_number)
          .map((section) => (
            <li class="section-item">
              <div class="section-header">
                <span class="section-number" data-number={section.section_number}></span>
                <span class="section-title">{section.section_title}</span>
                {section.section_type && (
                  <span class="section-type">{section.section_type}</span>
                )}
              </div>
              <div class="section-content">{section.content_outline}</div>
              <div class="section-meta">
                {section.source_info && (
                  <div>
                    <strong>Source:</strong> {section.source_info}
                  </div>
                )}
                {section.estimated_time && (
                  <div>
                    <strong>Est. Time:</strong> {section.estimated_time}
                  </div>
                )}
              </div>
            </li>
          ))}
      </ol>
    </div>

    <!-- Source Tickets -->
    <div class="info-section mb-6">
      <h4 class="info-title">Source Tickets ({recommendation.source_tickets.length})</h4>
      <ul class="ticket-list">
        {recommendation.source_tickets
          .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
          .map((ticket) => (
            <li class="ticket-item">
              <span class="ticket-id">#{ticket.ticket_id}</span>
              <div class="ticket-meta">
                {ticket.contribution_type && (
                  <span>{ticket.contribution_type}</span>
                )}
                {ticket.relevance_score && (
                  <span>Relevance: {ticket.relevance_score}/10</span>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>

    <!-- Analyst Notes -->
    {recommendation.analyst_notes && (
      <div class="info-section">
        <h4 class="info-title">Analyst Notes</h4>
        <div class="analyst-notes">{recommendation.analyst_notes}</div>
      </div>
    )}

    <!-- Related Slugs -->
    {recommendation.related_slugs && recommendation.related_slugs.length > 0 && (
      <div class="info-section mt-6">
        <h4 class="info-title">Related Slugs</h4>
        <div class="related-slugs">
          {recommendation.related_slugs.map((relatedSlug) => (
            <a href={`/slug/${relatedSlug}`} class="button button-ghost">
              {relatedSlug}
            </a>
          ))}
        </div>
      </div>
    )}
  </div>

  <div class="card-footer">
    <div class="text-xs text-muted">
      Created: {new Date(recommendation.created_at).toLocaleDateString()}
    </div>
    <div class="text-xs text-muted">
      Status: {recommendation.status}
    </div>
  </div>
</div>

<style>
  .recommendation-card {
    margin-bottom: 2rem;
  }

  .info-section {
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
  }

  .info-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .keyword-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .analyst-notes {
    padding: 1rem;
    background: var(--color-muted);
    border-radius: var(--radius-md);
    white-space: pre-wrap;
    line-height: 1.8;
    font-size: 0.9375rem;
  }

  .related-slugs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
```

### `src/pages/index.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import SlugCard from '../components/SlugCard.astro';
import { supabase } from '../lib/supabase';
import type { SlugWithStats } from '../lib/types';

// Fetch all slugs with their stats
const { data: slugsData, error } = await supabase.rpc('get_slugs_with_stats');

if (error) {
  console.error('Error fetching slugs:', error);
}

const slugs: SlugWithStats[] = slugsData || [];

// Separate slugs by status
const slugsWithRecommendations = slugs.filter(s => !s.match && s.recommendation_count > 0);
const slugsWithDocs = slugs.filter(s => s.match);
const slugsInProgress = slugs.filter(s => s.analysis_status === 'in_progress');
const slugsPending = slugs.filter(s => !s.match && s.recommendation_count === 0 && s.analysis_status !== 'in_progress');

// Stats
const totalSlugs = slugs.length;
const totalRecommendations = slugs.reduce((acc, s) => acc + (s.recommendation_count || 0), 0);
const highPriorityCount = slugs.reduce((acc, s) => acc + (s.high_priority_count || 0), 0);
---

<Layout title="KB Recommendations - All Slugs">
  <Header current="home" />
  
  <main class="container">
    <!-- Page Header -->
    <div class="mb-8">
      <h1>Knowledge Base Recommendations</h1>
      <p class="text-muted">
        Overview of all ticket categories and their KB documentation status
      </p>
    </div>

    <!-- Summary Stats -->
    <div class="stat-grid mb-8">
      <div class="stat-item">
        <div class="stat-label">Total Slugs</div>
        <div class="stat-value">{totalSlugs}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Recommendations</div>
        <div class="stat-value">{totalRecommendations}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">High Priority</div>
        <div class="stat-value">{highPriorityCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">With KB Docs</div>
        <div class="stat-value">{slugsWithDocs.length}</div>
      </div>
    </div>

    <!-- Needs KB Articles (Priority) -->
    {slugsWithRecommendations.length > 0 && (
      <section class="mb-8">
        <h2 class="mb-6">🔴 Needs KB Articles ({slugsWithRecommendations.length})</h2>
        <div class="grid grid-cols-2">
          {slugsWithRecommendations
            .sort((a, b) => (b.high_priority_count || 0) - (a.high_priority_count || 0))
            .map((slug) => (
              <SlugCard slug={slug} />
            ))}
        </div>
      </section>
    )}

    <!-- In Progress -->
    {slugsInProgress.length > 0 && (
      <section class="mb-8">
        <h2 class="mb-6">⏳ Analysis In Progress ({slugsInProgress.length})</h2>
        <div class="grid grid-cols-2">
          {slugsInProgress.map((slug) => (
            <SlugCard slug={slug} />
          ))}
        </div>
      </section>
    )}

    <!-- Has KB Documentation -->
    {slugsWithDocs.length > 0 && (
      <section class="mb-8">
        <h2 class="mb-6">✅ Has KB Documentation ({slugsWithDocs.length})</h2>
        <div class="grid grid-cols-2">
          {slugsWithDocs.map((slug) => (
            <SlugCard slug={slug} />
          ))}
        </div>
      </section>
    )}

    <!-- Pending Analysis -->
    {slugsPending.length > 0 && (
      <section class="mb-8">
        <h2 class="mb-6">⏸️ Pending Analysis ({slugsPending.length})</h2>
        <div class="grid grid-cols-2">
          {slugsPending.map((slug) => (
            <SlugCard slug={slug} />
          ))}
        </div>
      </section>
    )}

    <!-- Empty State -->
    {slugs.length === 0 && (
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h3 class="empty-state-title">No slugs found</h3>
        <p class="empty-state-description">
          Start analyzing tickets to generate recommendations
        </p>
      </div>
    )}
  </main>
</Layout>
```

### `src/pages/slug/[slug].astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header.astro';
import RecommendationCard from '../../components/RecommendationCard.astro';
import ProgressBar from '../../components/ProgressBar.astro';
import { supabase } from '../../lib/supabase';
import type { Slug, RecommendationDetail, AnalysisProgress } from '../../lib/types';

const { slug } = Astro.params;

if (!slug) {
  return Astro.redirect('/');
}

// Fetch slug info
const { data: slugData, error: slugError } = await supabase
  .from('Slugs')
  .select('*')
  .eq('slug', slug)
  .single();

if (slugError || !slugData) {
  return Astro.redirect('/');
}

const slugInfo: Slug = slugData;

// Fetch recommendations with sections and tickets
const { data: recommendations, error: recError } = await supabase
  .from('kb_recommendations')
  .select(`
    *,
    sections:kb_recommendation_sections(*),
    source_tickets:kb_recommendation_tickets(*)
  `)
  .eq('slug', slug)
  .order('priority', { ascending: false });

const recommendationDetails: RecommendationDetail[] = (recommendations || []).map((rec: any) => ({
  ...rec,
  sections: rec.sections || [],
  source_tickets: rec.source_tickets || []
}));

// Fetch analysis progress
const { data: progressData } = await supabase
  .from('slug_analysis_progress')
  .select('*')
  .eq('slug', slug)
  .single();

const progress: AnalysisProgress | null = progressData;

// Calculate stats
const totalRecommendations = recommendationDetails.length;
const highPriority = recommendationDetails.filter(r => r.priority === 'high').length;
const totalSections = recommendationDetails.reduce((acc, r) => acc + r.sections.length, 0);
const totalTickets = recommendationDetails.reduce((acc, r) => acc + r.source_tickets.length, 0);
---

<Layout title={`${slug} - KB Recommendations`}>
  <Header />
  
  <main class="container-narrow">
    <!-- Back Button -->
    <div class="mb-6">
      <a href="/" class="button button-ghost">
        ← Back to All Slugs
      </a>
    </div>

    <!-- Slug Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <h1>{slug}</h1>
        {slugInfo.match && <span class="badge badge-success">Has KB Docs</span>}
        {!slugInfo.match && totalRecommendations > 0 && (
          <span class="badge badge-high">Needs KB Article</span>
        )}
      </div>
      
      {slugInfo.matched_search && (
        <div class="mb-4">
          <span class="text-sm text-muted">KB Searches: </span>
          <span class="text-sm font-mono">{slugInfo.matched_search}</span>
        </div>
      )}

      <!-- Summary Stats -->
      <div class="stat-grid mb-6">
        <div class="stat-item">
          <div class="stat-label">Total Tickets</div>
          <div class="stat-value">{slugInfo.ticket_count}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Recommendations</div>
          <div class="stat-value">{totalRecommendations}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">High Priority</div>
          <div class="stat-value">{highPriority}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Sections</div>
          <div class="stat-value">{totalSections}</div>
        </div>
      </div>

      <!-- Progress -->
      {progress && (
        <div class="card mb-6">
          <h3 class="text-sm font-medium mb-4">Analysis Progress</h3>
          <ProgressBar 
            current={progress.tickets_analyzed} 
            total={progress.total_tickets || 0} 
          />
          <div class="flex items-center justify-between mt-4 text-sm text-muted">
            <span>Status: {progress.status.replace('_', ' ')}</span>
            <span>KB Searches: {progress.kb_searches_performed}</span>
          </div>
          {progress.error_message && (
            <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {progress.error_message}
            </div>
          )}
        </div>
      )}
    </div>

    <!-- Matched KB Documents -->
    {slugInfo.match && slugInfo.matched_documents && (
      <section class="mb-8">
        <h2 class="mb-6">✅ Existing KB Documentation</h2>
        <div class="card">
          {Array.isArray(slugInfo.matched_documents) && slugInfo.matched_documents.map((doc: any) => (
            <div class="mb-6 pb-6 border-b border-gray-200 last:border-0">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium">{doc.name}</h4>
                <span class={`badge ${doc.relevance === 'high' ? 'badge-success' : 'badge-default'}`}>
                  {doc.relevance}
                </span>
              </div>
              {doc.url && (
                <a href={doc.url} class="text-sm text-blue-600 hover:underline mb-2 block" target="_blank" rel="noopener">
                  View Document →
                </a>
              )}
              <p class="text-sm text-muted mb-2">{doc.reason}</p>
              {doc.coverage_score && (
                <div class="text-xs text-muted">Coverage: {doc.coverage_score}/10</div>
              )}
              {doc.gaps && (
                <div class="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div class="text-xs font-medium text-yellow-800 mb-1">Gaps Identified:</div>
                  <div class="text-xs text-yellow-700">{doc.gaps}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    <!-- Recommendations -->
    {totalRecommendations > 0 && (
      <section>
        <h2 class="mb-6">📝 Recommendations ({totalRecommendations})</h2>
        {recommendationDetails
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                   (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
          })
          .map((rec) => (
            <RecommendationCard recommendation={rec} />
          ))}
      </section>
    )}

    <!-- Empty State -->
    {!slugInfo.match && totalRecommendations === 0 && (
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No recommendations yet</h3>
        <p class="empty-state-description">
          Analysis is pending or in progress for this slug
        </p>
      </div>
    )}
  </main>
</Layout>
```

### Create Database Function (Run in Supabase SQL Editor)

```sql
-- Create a function to get slugs with stats (makes querying easier)
CREATE OR REPLACE FUNCTION get_slugs_with_stats()
RETURNS TABLE (
  slug text,
  ticket_count integer,
  match boolean,
  matched_documents jsonb,
  matched_search text,
  last_matched timestamp with time zone,
  first_seen timestamp with time zone,
  last_seen timestamp with time zone,
  recommendation_count bigint,
  high_priority_count bigint,
  medium_priority_count bigint,
  low_priority_count bigint,
  total_sections bigint,
  total_tickets_analyzed bigint,
  analysis_status text,
  avg_confidence numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.slug,
    s.ticket_count,
    s.match,
    s.matched_documents,
    s.matched_search,
    s.last_matched,
    s.first_seen,
    s.last_seen,
    COUNT(DISTINCT r.recommendation_id) as recommendation_count,
    COUNT(DISTINCT CASE WHEN r.priority = 'high' THEN r.recommendation_id END) as high_priority_count,
    COUNT(DISTINCT CASE WHEN r.priority = 'medium' THEN r.recommendation_id END) as medium_priority_count,
    COUNT(DISTINCT CASE WHEN r.priority = 'low' THEN r.recommendation_id END) as low_priority_count,
    COUNT(DISTINCT rs.section_id) as total_sections,
    COUNT(DISTINCT rt.ticket_id) as total_tickets_analyzed,
    p.status as analysis_status,
    ROUND(AVG(r.confidence_score), 1) as avg_confidence
  FROM "Slugs" s
  LEFT JOIN kb_recommendations r ON s.slug = r.slug
  LEFT JOIN kb_recommendation_sections rs ON r.recommendation_id = rs.recommendation_id
  LEFT JOIN kb_recommendation_tickets rt ON r.recommendation_id = rt.recommendation_id
  LEFT JOIN slug_analysis_progress p ON s.slug = p.slug
  GROUP BY 
    s.slug, s.ticket_count, s.match, s.matched_documents, s.matched_search,
    s.last_matched, s.first_seen, s.last_seen, p.status
  ORDER BY 
    CASE WHEN s.match = false AND COUNT(DISTINCT r.recommendation_id) > 0 THEN 1 ELSE 2 END,
    s.ticket_count DESC;
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Features

### Home Page (`/`)
- Overview of all slugs
- Categorized by status:
  - 🔴 Needs KB Articles (priority)
  - ⏳ Analysis in Progress
  - ✅ Has KB Documentation
  - ⏸️ Pending Analysis
- Quick stats and badges
- Sortable by priority and ticket count

### Slug Detail Page (`/slug/[slug]`)
- Complete recommendation details
- All sections with content outlines
- Source ticket attribution
- Analysis progress tracking
- Matched KB documents (if any)
- Export-ready format

---

## 🎨 Design System

The project uses a clean, minimal design inspired by Vercel and shadcn/ui:
- **Typography**: System fonts, clear hierarchy
- **Colors**: Black & white base, subtle grays
- **Spacing**: 8px grid system
- **Components**: Cards, badges, buttons
- **Responsive**: Mobile-first, works on all screens

---

## 🔄 Next Steps

1. Add export functionality (PDF, Markdown)
2. Add filtering and search
3. Add bulk actions (mark as reviewed, change priority)
4. Add authentication (if needed)
5. Add real-time updates with Supabase subscriptions
6. Add comments/notes on recommendations

---

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Design](https://vercel.com/design)
- [shadcn/ui](https://ui.shadcn.com)
```

This `project.md` provides complete setup instructions with a clean, modern design that matches Vercel/shadcn aesthetics! 🎨