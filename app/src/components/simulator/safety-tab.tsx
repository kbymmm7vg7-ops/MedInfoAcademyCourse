import {
  ROUTING_TARGETS,
  SERIOUSNESS_CRITERIA,
  SPECIAL_SITUATIONS,
  type RoutingTarget,
  type SafetyData,
  type SeriousnessCriterion,
  type SpecialSituation,
} from "@/lib/simulator/types";
import { Checkbox, Field, RadioGroup, TextArea, TextInput } from "@/components/simulator/field";

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function SafetyTab({
  safety,
  onChange,
  disabled,
}: {
  safety: SafetyData;
  onChange: (patch: Partial<SafetyData>) => void;
  disabled?: boolean;
}) {
  const aePresent = safety.ae_present === "yes";
  const pcPresent = safety.pc_present === "yes";
  const dualRoutingRequired = aePresent && pcPresent;

  return (
    <div className="space-y-6">
      <Field label="Any adverse event mentioned?" required>
        <RadioGroup
          name="ae_present"
          disabled={disabled}
          value={safety.ae_present}
          onChange={(v) => onChange({ ae_present: v })}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </Field>

      {aePresent && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Four-element test
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Checkbox
              disabled={disabled}
              checked={safety.four_element_test.identifiable_patient}
              onChange={(v) =>
                onChange({
                  four_element_test: { ...safety.four_element_test, identifiable_patient: v },
                })
              }
              label="Identifiable patient"
            />
            <Checkbox
              disabled={disabled}
              checked={safety.four_element_test.identifiable_reporter}
              onChange={(v) =>
                onChange({
                  four_element_test: { ...safety.four_element_test, identifiable_reporter: v },
                })
              }
              label="Identifiable reporter"
            />
            <Checkbox
              disabled={disabled}
              checked={safety.four_element_test.suspect_product}
              onChange={(v) =>
                onChange({
                  four_element_test: { ...safety.four_element_test, suspect_product: v },
                })
              }
              label="Suspect product"
            />
            <Checkbox
              disabled={disabled}
              checked={safety.four_element_test.event}
              onChange={(v) =>
                onChange({ four_element_test: { ...safety.four_element_test, event: v } })
              }
              label="Event"
            />
          </div>

          <div className="mt-4 space-y-4">
            <Field label="AE description" required>
              <TextArea
                disabled={disabled}
                rows={3}
                value={safety.ae_description}
                onChange={(e) => onChange({ ae_description: e.target.value })}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Onset date">
                <TextInput
                  type="date"
                  disabled={disabled}
                  value={safety.onset_date}
                  onChange={(e) => onChange({ onset_date: e.target.value })}
                />
              </Field>
              <Field label="Ongoing?">
                <RadioGroup
                  name="ongoing"
                  disabled={disabled}
                  value={safety.ongoing}
                  onChange={(v) => onChange({ ongoing: v })}
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                />
              </Field>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700">Seriousness</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SERIOUSNESS_CRITERIA.map((c) => (
                  <Checkbox
                    key={c.value}
                    disabled={disabled}
                    checked={safety.seriousness.includes(c.value)}
                    onChange={() =>
                      onChange({
                        seriousness: toggleInArray<SeriousnessCriterion>(
                          safety.seriousness,
                          c.value
                        ),
                      })
                    }
                    label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Field label="Product complaint?" required>
        <RadioGroup
          name="pc_present"
          disabled={disabled}
          value={safety.pc_present}
          onChange={(v) => onChange({ pc_present: v })}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </Field>

      {pcPresent && (
        <div className="rounded-md border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Product complaint details
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <Field label="Lot number">
              <TextInput
                disabled={disabled}
                value={safety.pc_lot_number}
                onChange={(e) => onChange({ pc_lot_number: e.target.value })}
              />
            </Field>
            <Field label="Expiration date">
              <TextInput
                type="date"
                disabled={disabled}
                value={safety.pc_expiration_date}
                onChange={(e) => onChange({ pc_expiration_date: e.target.value })}
              />
            </Field>
            <Field label="NDC">
              <TextInput
                disabled={disabled}
                value={safety.pc_ndc}
                onChange={(e) => onChange({ pc_ndc: e.target.value })}
              />
            </Field>
            <Field label="Sample available / retrieval offered?">
              <RadioGroup
                name="pc_sample_available"
                disabled={disabled}
                value={safety.pc_sample_available}
                onChange={(v) => onChange({ pc_sample_available: v })}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </Field>
          </div>
        </div>
      )}

      <Checkbox
        disabled={disabled}
        checked={safety.pregnancy_or_lactation}
        onChange={(v) => onChange({ pregnancy_or_lactation: v })}
        label="Pregnancy / lactation flag"
      />

      <div>
        <p className="text-xs font-medium text-slate-700">Special situations</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SPECIAL_SITUATIONS.map((s) => (
            <Checkbox
              key={s.value}
              disabled={disabled}
              checked={safety.special_situations.includes(s.value)}
              onChange={() =>
                onChange({
                  special_situations: toggleInArray<SpecialSituation>(
                    safety.special_situations,
                    s.value
                  ),
                })
              }
              label={s.label}
            />
          ))}
        </div>
      </div>

      <div className="rounded-md border border-slate-200 p-4">
        {dualRoutingRequired ? (
          <>
            <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
              Dual routing required — both AE and product complaint are present
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                disabled={disabled}
                checked={safety.routing_dual.route_to_pv}
                onChange={(v) =>
                  onChange({ routing_dual: { ...safety.routing_dual, route_to_pv: v } })
                }
                label="Route to PV (required)"
              />
              <Checkbox
                disabled={disabled}
                checked={safety.routing_dual.route_to_quality}
                onChange={(v) =>
                  onChange({ routing_dual: { ...safety.routing_dual, route_to_quality: v } })
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
                  checked={safety.routing_single.includes(r)}
                  onChange={() =>
                    onChange({
                      routing_single: toggleInArray<RoutingTarget>(safety.routing_single, r),
                    })
                  }
                  label={r}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Field label="Routed within timeframe (date)">
            <TextInput
              type="date"
              disabled={disabled}
              value={safety.routed_within_timeframe_date}
              onChange={(e) => onChange({ routed_within_timeframe_date: e.target.value })}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
