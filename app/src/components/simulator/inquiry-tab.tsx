"use client";

import type { InquiryData } from "@/lib/simulator/types";
import { Field, TextArea } from "@/components/simulator/field";

// Probing/clarifying-questions logging was removed at Nathan's direction
// (2026-07-11 S5 E2E feedback) — the listen-and-clarify skill is evidenced in
// the transcript itself, not self-reported. The schema field remains (empty)
// so existing drafts and the evaluator contract are untouched.
export function InquiryTab({
  inquiry,
  onChange,
  disabled,
}: {
  inquiry: InquiryData;
  onChange: (patch: Partial<InquiryData>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-6">
      <Field label="Inquiry summary" required>
        <TextArea
          disabled={disabled}
          rows={3}
          value={inquiry.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
        />
      </Field>

      <Field label="Verbatim question" required>
        <TextArea
          disabled={disabled}
          rows={3}
          value={inquiry.verbatim_question}
          placeholder="Capture the requester's question in their own words"
          onChange={(e) => onChange({ verbatim_question: e.target.value })}
        />
      </Field>
    </div>
  );
}
