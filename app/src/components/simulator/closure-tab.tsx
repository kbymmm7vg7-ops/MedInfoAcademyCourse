import type { ClosureData } from "@/lib/simulator/types";
import { Checkbox, Field, RadioGroup, TextArea, TextInput } from "@/components/simulator/field";

export function ClosureTab({
  closure,
  onChange,
  disabled,
}: {
  closure: ClosureData;
  onChange: (patch: Partial<ClosureData>) => void;
  disabled?: boolean;
}) {
  const followUpNeeded = closure.follow_up_needed === "yes";

  return (
    <div className="space-y-6">
      <Field label="Follow-up needed?" required>
        <RadioGroup
          name="follow_up_needed"
          disabled={disabled}
          value={closure.follow_up_needed}
          onChange={(v) => onChange({ follow_up_needed: v })}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </Field>

      {followUpNeeded && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Scheduled date">
            <TextInput
              type="date"
              disabled={disabled}
              value={closure.follow_up_scheduled_date}
              onChange={(e) => onChange({ follow_up_scheduled_date: e.target.value })}
            />
          </Field>
        </div>
      )}

      <Field label="Outstanding info">
        <TextArea
          disabled={disabled}
          rows={3}
          value={closure.outstanding_info}
          onChange={(e) => onChange({ outstanding_info: e.target.value })}
        />
      </Field>

      <div>
        <p className="text-xs font-medium text-slate-700">Closure checklist</p>
        <div className="mt-2 space-y-2">
          <Checkbox
            disabled={disabled}
            checked={closure.checklist.inquiry_answered}
            onChange={(v) => onChange({ checklist: { ...closure.checklist, inquiry_answered: v } })}
            label="Inquiry answered"
          />
          <Checkbox
            disabled={disabled}
            checked={closure.checklist.safety_captured_routed}
            onChange={(v) =>
              onChange({ checklist: { ...closure.checklist, safety_captured_routed: v } })
            }
            label="Safety captured & routed"
          />
          <Checkbox
            disabled={disabled}
            checked={closure.checklist.contact_info_complete}
            onChange={(v) =>
              onChange({ checklist: { ...closure.checklist, contact_info_complete: v } })
            }
            label="Contact info complete"
          />
          <Checkbox
            disabled={disabled}
            checked={closure.checklist.no_medical_advice_given}
            onChange={(v) =>
              onChange({ checklist: { ...closure.checklist, no_medical_advice_given: v } })
            }
            label="No medical advice given"
          />
          <Checkbox
            disabled={disabled}
            checked={closure.checklist.category_confirmed}
            onChange={(v) => onChange({ checklist: { ...closure.checklist, category_confirmed: v } })}
            label="Category confirmed"
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-300 bg-slate-50 p-4">
        <Checkbox
          disabled={disabled}
          checked={closure.qc_self_check}
          onChange={(v) => onChange({ qc_self_check: v })}
          label="QC self-check confirmation — I have reviewed this record for accuracy and completeness"
        />
      </div>
    </div>
  );
}
