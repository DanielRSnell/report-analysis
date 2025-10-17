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
