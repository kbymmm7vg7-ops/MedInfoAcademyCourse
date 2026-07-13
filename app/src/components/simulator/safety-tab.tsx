import {
  SERIOUSNESS_CRITERIA,
  SPECIAL_SITUATIONS,
  type PatientGender,
  type SafetyData,
  type SeriousnessCriterion,
  type SpecialSituation,
} from "@/lib/simulator/types";
import { Checkbox, Field, RadioGroup, Select, TextArea, TextInput } from "@/components/simulator/field";

function toggleInArray<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const GENDER_OPTIONS: { value: PatientGender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Unknown" },
];

// Safety-tab redesign (Nathan, 2026-07-11): four-element checkboxes removed —
// identifiability is captured through the patient fields below; routing moved
// to the Closure tab.
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
            Adverse event details
          </p>

          <div className="mt-3 space-y-4">
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

            <div className="border-t border-amber-200 pt-4">
              <p className="text-xs font-medium text-slate-700">Patient details</p>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <Field label="Patient initials">
                  <TextInput
                    disabled={disabled}
                    value={safety.patient_initials}
                    onChange={(e) => onChange({ patient_initials: e.target.value })}
                  />
                </Field>
                <Field label="Date of birth">
                  <TextInput
                    type="date"
                    disabled={disabled}
                    value={safety.patient_dob}
                    onChange={(e) => onChange({ patient_dob: e.target.value })}
                  />
                </Field>
                <Field label="Gender">
                  <Select
                    disabled={disabled}
                    value={safety.patient_gender}
                    onChange={(e) =>
                      onChange({ patient_gender: e.target.value as SafetyData["patient_gender"] })
                    }
                  >
                    <option value="">Select…</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Concomitant medications">
                  <TextArea
                    disabled={disabled}
                    rows={2}
                    value={safety.concomitant_meds}
                    onChange={(e) => onChange({ concomitant_meds: e.target.value })}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Consent for HCP follow-up?">
                  <RadioGroup
                    name="hcp_followup_consent"
                    disabled={disabled}
                    value={safety.hcp_followup_consent}
                    onChange={(v) => onChange({ hcp_followup_consent: v })}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                  />
                </Field>
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

      <p className="text-xs text-slate-400">
        Routing is recorded on the Closure tab before submission.
      </p>
    </div>
  );
}
