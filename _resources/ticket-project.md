# ticket-project.md

## Project: Ticket KB Analysis Dashboard

### Overview
A dashboard system to review ticket analysis, KB hit/miss reports, and manage KB article recommendations with content sections. This helps identify knowledge gaps and track which tickets need KB articles.

### Technology Stack
- **Framework:** Astro
- **Styling:** Tailwind CSS + Shadcn UI components
- **Database:** Supabase (PostgreSQL)
- **Database Client:** @supabase/supabase-js

### Database Tables
The system uses three main tables for ticket analysis:

1. **tickets_reviewed** - Tracks which tickets have been analyzed and their KB hit/miss status
2. **ticket_kb_content_recommendations** - Stores recommendations for KB articles to create
3. **ticket_kb_content_sections** - Contains content sections for each recommendation

### Pages to Create

---

## 1. `/ticket-analysis` (Main Dashboard)
**Purpose:** Overview of all ticket analysis activity

**Components Needed:**
- Statistics cards showing:
  - Total tickets reviewed
  - KB Hit rate (%)
  - KB Miss rate (%)
  - Total recommendations created
  - Recommendations by priority (high/medium/low)
  - Recommendations by status (draft/reviewed/approved/published)

- Recent activity feed:
  - Latest tickets reviewed (last 20)
  - Show ticket ID, slug, hit/miss status, date

- Filter controls:
  - Filter by slug
  - Filter by hit/miss status
  - Date range picker

**Supabase Queries:**
```typescript
// Get overview stats
const { data: stats } = await supabase
  .from('tickets_reviewed')
  .select('kb_hit, created_at')

// Get recent reviews
const { data: recentReviews } = await supabase
  .from('tickets_reviewed')
  .select('*, Tickets(Subject)')
  .order('created_at', { ascending: false })
  .limit(20)

// Get recommendation counts by priority
const { data: priorityCounts } = await supabase
  .from('ticket_kb_content_recommendations')
  .select('priority')
```

---

## 2. `/ticket-analysis/reviewed` (Reviewed Tickets List)
**Purpose:** Browse all reviewed tickets with detailed filtering

**Components Needed:**
- Data table with columns:
  - Ticket ID (clickable)
  - Subject (from Tickets table join)
  - Slug (clickable to filter)
  - Related Tickets Count
  - KB Hit/Miss (badge - green for hit, red for miss)
  - # of Searches Performed
  - Date Reviewed
  - Actions (View Details, View Recommendation if MISS)

- Advanced filters:
  - Slug selector/search
  - Hit/Miss toggle
  - Date range
  - Related ticket count range
  - Search by ticket ID or subject

- Pagination (20 per page)

**Supabase Queries:**
```typescript
// Get all reviewed tickets with filters
const { data: reviews, count } = await supabase
  .from('tickets_reviewed')
  .select('*, Tickets!inner(Subject, Description)', { count: 'exact' })
  .eq('kb_hit', filters.hitMiss) // if filtered
  .ilike('slug', `%${filters.slug}%`) // if slug filtered
  .gte('created_at', filters.dateFrom) // if date filtered
  .range(page * pageSize, (page + 1) * pageSize - 1)
  .order('created_at', { ascending: false })
```

---

## 3. `/ticket-analysis/reviewed/[id]` (Single Review Detail)
**Purpose:** Detailed view of a single ticket review

**Components Needed:**
- Header section:
  - Ticket ID, Subject, Slug
  - Large HIT/MISS badge
  - Date reviewed
  - Link to original ticket

- Related Tickets section:
  - List of related ticket IDs (clickable)
  - Count display
  - Show if any related tickets were also reviewed

- KB Search Results section:
  - List of searches performed (from searches array)
  - Matched documents (display JSONB formatted nicely)
  - Articles found with relevance scores

- Analysis Notes section:
  - Display full notes from reviewer
  - Explanation of HIT or MISS determination

- Actions section:
  - If MISS: "View KB Recommendation" button
  - "Re-analyze Ticket" button (admin only)

**Supabase Queries:**
```typescript
// Get single review with ticket details
const { data: review } = await supabase
  .from('tickets_reviewed')
  .select('*, Tickets(Subject, Description, Resolution Note, conversations)')
  .eq('id', reviewId)
  .single()

// Get related tickets details
const { data: relatedTickets } = await supabase
  .from('Tickets')
  .select('Ticket Id, Subject, Status')
  .in('Ticket Id', review.related_ticket_ids)

// Check if there's a recommendation for this ticket
const { data: recommendation } = await supabase
  .from('ticket_kb_content_recommendations')
  .select('id, recommendation_title, status')
  .eq('ticket_id', review.ticket_id)
  .single()
```

---

## 4. `/ticket-analysis/recommendations` (Recommendations List)
**Purpose:** Browse all KB article recommendations

**Components Needed:**
- Filter tabs by status:
  - Draft (default)
  - Reviewed
  - Approved
  - Published

- Priority filter badges:
  - High (red badge)
  - Medium (yellow badge)
  - Low (gray badge)

- Data table with columns:
  - Recommendation Title (clickable)
  - Slug
  - Type (create_kb_article, update_existing, etc.)
  - Priority (colored badge)
  - Source Tickets Count
  - # of Sections
  - Status
  - Created Date
  - Actions (View, Edit Status)

- Bulk actions:
  - Change status for selected
  - Export selected

**Supabase Queries:**
```typescript
// Get recommendations with section counts
const { data: recommendations } = await supabase
  .from('ticket_kb_content_recommendations')
  .select(`
    *,
    ticket_kb_content_sections(count)
  `)
  .eq('status', statusFilter)
  .order('priority', { ascending: false })
  .order('created_at', { ascending: false })

// Get tags for filter
const { data: allTags } = await supabase
  .from('ticket_kb_content_recommendations')
  .select('tags')
```

---

## 5. `/ticket-analysis/recommendations/[id]` (Recommendation Detail)
**Purpose:** View full KB article recommendation with all content sections

**Components Needed:**
- Header section:
  - Recommendation Title (editable inline)
  - Status dropdown (draft/reviewed/approved/published)
  - Priority badge
  - Type badge
  - Created date
  - Tags (chips)

- Summary section:
  - Display recommendation_summary
  - Editable text area

- Source Tickets section:
  - List all source ticket IDs with links
  - Show ticket subjects
  - Count display

- Content Sections (ordered by section_order):
  - Accordion for each section
  - Section title
  - Section content (formatted as markdown)
  - Source tickets for this section
  - Edit button for each section

- Actions:
  - "Export as Markdown" button
  - "Export as HTML" button
  - "Copy to Clipboard" button
  - "Create KB Article" button (links to KB system)
  - "Change Status" dropdown

- Related Reviews section:
  - Links back to tickets_reviewed records

**Supabase Queries:**
```typescript
// Get recommendation with all sections
const { data: recommendation } = await supabase
  .from('ticket_kb_content_recommendations')
  .select(`
    *,
    ticket_kb_content_sections(*)
  `)
  .eq('id', recommendationId)
  .order('ticket_kb_content_sections.section_order')
  .single()

// Get source ticket details
const { data: sourceTickets } = await supabase
  .from('Tickets')
  .select('Ticket Id, Subject, Status, Resolution Note')
  .in('Ticket Id', recommendation.source_ticket_ids)

// Get the original review
const { data: review } = await supabase
  .from('tickets_reviewed')
  .select('*')
  .eq('ticket_id', recommendation.ticket_id)
  .single()
```

---

## 6. `/ticket-analysis/slugs` (Slug Analysis)
**Purpose:** View analysis grouped by slug to see patterns

**Components Needed:**
- Slug list with metrics:
  - Slug name (clickable)
  - Total tickets in slug
  - Tickets reviewed
  - Hit rate (%)
  - Miss rate (%)
  - Recommendations count
  - Most common issue

- Sort options:
  - By miss rate (highest first)
  - By ticket count
  - Alphabetically
  - By recommendation count

**Supabase Queries:**
```typescript
// Get slug analysis
const { data: slugAnalysis } = await supabase
  .from('tickets_reviewed')
  .select('slug, kb_hit, related_ticket_count')
  .not('slug', 'is', null)

// Group and calculate in JavaScript or use RPC function

// Get recommendations per slug
const { data: recsBySlug } = await supabase
  .from('ticket_kb_content_recommendations')
  .select('slug, priority')
```

---

## 7. `/ticket-analysis/slugs/[slug]` (Slug Detail)
**Purpose:** Deep dive into a specific slug's tickets and recommendations

**Components Needed:**
- Slug header:
  - Slug name
  - Total tickets count
  - Reviewed tickets count
  - Hit/Miss breakdown chart

- Reviewed tickets for this slug:
  - Table similar to main reviewed list
  - Filtered to this slug only

- Recommendations for this slug:
  - All recommendations created for this slug
  - Grouped by status

- Common patterns section:
  - Most common resolution steps
  - Most common issues
  - Suggested actions

**Supabase Queries:**
```typescript
// Get all reviews for slug
const { data: reviews } = await supabase
  .from('tickets_reviewed')
  .select('*, Tickets(Subject, Status)')
  .eq('slug', slugName)
  .order('created_at', { ascending: false })

// Get all recommendations for slug
const { data: recommendations } = await supabase
  .from('ticket_kb_content_recommendations')
  .select('*')
  .eq('slug', slugName)
```

---

## 8. `/ticket-analysis/export` (Export/Reports)
**Purpose:** Generate reports and export data

**Components Needed:**
- Export options:
  - Date range selector
  - Slug filter
  - Status filter
  - Format selector (CSV, JSON, Excel)

- Report types:
  - KB Coverage Report (hit/miss by slug)
  - Recommendations Pipeline Report
  - Agent Performance Report (if applicable)
  - Weekly Summary Report

- Preview section:
  - Show data preview before export

**Supabase Queries:**
```typescript
// Get data for date range
const { data: exportData } = await supabase
  .from('tickets_reviewed')
  .select(`
    *,
    Tickets(Subject, Category, Agent),
    ticket_kb_content_recommendations(*)
  `)
  .gte('created_at', dateFrom)
  .lte('created_at', dateTo)
```

---

## Component Architecture

### Shared Components to Build

1. **TicketAnalysisCard.astro**
   - Reusable card for displaying ticket review summary

2. **RecommendationCard.astro**
   - Reusable card for displaying recommendation summary

3. **HitMissBadge.astro**
   - Styled badge component (green for hit, red for miss)

4. **PriorityBadge.astro**
   - Styled badge for priority levels

5. **StatusBadge.astro**
   - Styled badge for recommendation status

6. **ContentSectionAccordion.astro**
   - Accordion component for displaying content sections

7. **TicketSearchFilter.astro**
   - Reusable filter component for tickets

8. **DataTable.astro**
   - Generic data table with sorting, pagination

9. **StatsCard.astro**
   - Dashboard statistics card component

10. **SlugChip.astro**
    - Clickable chip for slug navigation

---

## Navigation Structure
```
/ticket-analysis
├── /reviewed (list all reviewed tickets)
│   └── /[id] (single review detail)
├── /recommendations (list all recommendations)
│   └── /[id] (recommendation detail with sections)
├── /slugs (slug analysis overview)
│   └── /[slug] (slug detail view)
└── /export (reports and exports)
```

---

## Key Features to Implement

### Search & Filter
- Global search across tickets, recommendations, slugs
- Advanced filters on every list page
- Save filter presets

### Data Visualization
- Hit/Miss rate pie chart
- Timeline of reviews
- Priority distribution bar chart
- Slug coverage heatmap

### Batch Operations
- Bulk status updates for recommendations
- Bulk export
- Bulk approval workflow

### Notifications
- New MISS notifications
- High priority recommendation alerts
- Weekly summary emails

---

## Supabase Setup Notes

### Key Relationships to Reference
```typescript
// tickets_reviewed -> Tickets (for ticket details)
// ticket_kb_content_recommendations -> tickets_reviewed (via ticket_id)
// ticket_kb_content_sections -> ticket_kb_content_recommendations (via recommendation_id)
```

### Useful RPC Functions to Create

1. **get_slug_stats()**
   - Returns aggregated stats per slug

2. **get_hit_miss_rate()**
   - Calculates overall hit/miss percentages

3. **get_recommendations_by_priority()**
   - Groups recommendations by priority with counts

### Row Level Security (RLS) Policies
- Enable RLS on all three tables
- Allow authenticated users to SELECT
- Restrict INSERT/UPDATE/DELETE to admin roles or service role

---

## Additional Context

### Data Flow
1. n8n agent analyzes ticket → creates records in these 3 tables
2. Dashboard reads from these tables (read-only for most users)
3. Admins can update status fields on recommendations
4. Reports are generated from these tables

### Reference Database Tables
All queries should use **@supabase/supabase-js** to interact with:
- `tickets_reviewed`
- `ticket_kb_content_recommendations`
- `ticket_kb_content_sections`
- `Tickets` (for joining ticket details)

### Styling Patterns
- Use Shadcn UI components for consistency
- Tailwind for custom styling
- Color coding:
  - Green: HIT, success, approved
  - Red: MISS, high priority, needs attention
  - Yellow: Medium priority, in review
  - Gray: Low priority, draft
  - Blue: Links, informational

---

## Implementation Priority

### Phase 1 (MVP)
1. Main dashboard (`/ticket-analysis`)
2. Reviewed tickets list (`/ticket-analysis/reviewed`)
3. Single review detail (`/ticket-analysis/reviewed/[id]`)
4. Recommendations list (`/ticket-analysis/recommendations`)
5. Recommendation detail (`/ticket-analysis/recommendations/[id]`)

### Phase 2 (Enhanced)
6. Slug analysis pages
7. Export/reports functionality
8. Batch operations
9. Advanced filters

### Phase 3 (Advanced)
10. Data visualizations
11. Notifications system
12. Workflow automation
13. Integration with KB system

---

This dashboard will provide visibility into the ticket analysis process, help prioritize KB article creation, and track the effectiveness of knowledge base coverage.