import { ROUTING_TARGETS, type ClosureData, type RoutingTarget, type SafetyData } from "@/lib/simulator/types";
import { Checkbox, Field, RadioGroup, TextArea, TextInput } from "@/components/simulator/field";

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function ClosureTab({
  closure,
  safety,
  onChange,
  disabled,
}: {
  closure: ClosureData;
  /** read-only context: AE+PC both present ⇒ dual-routing banner */
  safety: SafetyData;
  onChange: (patch: Partial<ClosureData>) => void;
  disabled?: boolean;
}) {
  const followUpNeeded = closure.follow_up_needed === "yes";
  const dualRoutingRequired = safety.ae_present === "yes" && safety.pc_present === "yes";

  return (
    <div className="space-y-6">
      {/* Routing moved here from the Safety tab (Nathan, 2026-07-11). */}
      <div className="rounded-md border border-slate-200 p-4">
        {dualRoutingRequired ? (
          <>
            <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
              Dual routing required — both AE and product complaint are present
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                disabled={disabled}
                checked={closure.routing_dual.route_to_pv}
                onChange={(v) =>
                  onChange({ routing_dual: { ...closure.routing_dual, route_to_pv: v } })
                }
                label="Route to PV (required)"
              />
              <Checkbox
                disabled={disabled}
                checked={closure.routing_dual.route_to_quality}
                onChange={(v) =>
                  onChange({ routing_dual: { ...closure.routing_dual, route_to_quality: v } })
                }
                label="Route to Quality (required)"
              />
            </div>
          </>
        ) : (
          <div>
            <p className="text-xs font-medium text-slate-700">Routing</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ROUTING_TARGETS.map((r) => (
                <Checkbox
                  key={r}
                  disabled={disabled}
                  checked={closure.routing_single.includes(r)}
                  onChange={() =>
                    onChange({
                      routing_single: toggleInArray<RoutingTarget>(closure.routing_single, r),
                    })
                  }
                  label={r}
                />
              ))}
            </div>
          </div>
        )}
      </div>

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
