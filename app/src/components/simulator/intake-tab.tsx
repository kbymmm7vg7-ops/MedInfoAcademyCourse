import {
  CONTACT_CHANNELS,
  INQUIRY_CATEGORIES,
  REQUESTER_TYPES,
  type IntakeData,
  type SafetyData,
} from "@/lib/simulator/types";
import { FICTIONAL_PRODUCTS } from "@/lib/simulator/products";
import { Field, RadioGroup, Select, TextInput } from "@/components/simulator/field";

// Contact fields adapt: hcp/pharmacist, or any case where Safety has AE or PC
// marked present, get the full set (name, background, phone, street, city,
// state, zip). Otherwise (patient/caregiver/consumer, no AE/PC) get a
// lighter set (name, background, phone, city + state).
function needsFullContactSet(requesterType: string, safety: SafetyData): boolean {
  if (requesterType === "hcp" || requesterType === "pharmacist") return true;
  return safety.ae_present === "yes" || safety.pc_present === "yes";
}

export function IntakeTab({
  intake,
  safety,
  onChange,
  disabled,
}: {
  intake: IntakeData;
  safety: SafetyData;
  onChange: (patch: Partial<IntakeData>) => void;
  disabled?: boolean;
}) {
  const fullContact = needsFullContactSet(intake.requester_type, safety);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Requester type" required>
          <Select
            disabled={disabled}
            value={intake.requester_type}
            onChange={(e) =>
              onChange({ requester_type: e.target.value as IntakeData["requester_type"] })
            }
          >
            <option value="">Select…</option>
            {REQUESTER_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Contact channel" required>
          <Select
            disabled={disabled}
            value={intake.contact_channel}
            onChange={(e) =>
              onChange({ contact_channel: e.target.value as IntakeData["contact_channel"] })
            }
          >
            <option value="">Select…</option>
            {CONTACT_CHANNELS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Solicited or unsolicited" required>
        <RadioGroup
          name="solicited"
          disabled={disabled}
          value={intake.solicited}
          onChange={(v) => onChange({ solicited: v })}
          options={[
            { value: "solicited", label: "Solicited" },
            { value: "unsolicited", label: "Unsolicited" },
          ]}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Product" required>
          <Select
            disabled={disabled}
            value={intake.product}
            onChange={(e) => onChange({ product: e.target.value })}
          >
            <option value="">Select…</option>
            {FICTIONAL_PRODUCTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Inquiry category" required>
          <Select
            disabled={disabled}
            value={intake.inquiry_category}
            onChange={(e) =>
              onChange({ inquiry_category: e.target.value as IntakeData["inquiry_category"] })
            }
          >
            <option value="">Select…</option>
            {INQUIRY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="rounded-md border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Contact information
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {fullContact
            ? "Full contact set required (HCP/pharmacist, or an AE/PC has been marked present on the Safety tab)."
            : "Lighter contact set (patient/caregiver, no AE/PC marked present)."}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <TextInput
              disabled={disabled}
              value={intake.contact.name}
              onChange={(e) => onChange({ contact: { ...intake.contact, name: e.target.value } })}
            />
          </Field>
          <Field label="Background / credential" required>
            <TextInput
              disabled={disabled}
              value={intake.contact.background}
              onChange={(e) =>
                onChange({ contact: { ...intake.contact, background: e.target.value } })
              }
            />
          </Field>
          <Field label="Phone" required>
            <TextInput
              disabled={disabled}
              value={intake.contact.phone}
              onChange={(e) => onChange({ contact: { ...intake.contact, phone: e.target.value } })}
            />
          </Field>

          {fullContact ? (
            <>
              <Field label="Street address" required>
                <TextInput
                  disabled={disabled}
                  value={intake.contact.street_address}
                  onChange={(e) =>
                    onChange({ contact: { ...intake.contact, street_address: e.target.value } })
                  }
                />
              </Field>
              <Field label="City" required>
                <TextInput
                  disabled={disabled}
                  value={intake.contact.city}
                  onChange={(e) => onChange({ contact: { ...intake.contact, city: e.target.value } })}
                />
              </Field>
              <Field label="State" required>
                <TextInput
                  disabled={disabled}
                  value={intake.contact.state}
                  onChange={(e) => onChange({ contact: { ...intake.contact, state: e.target.value } })}
                />
              </Field>
              <Field label="ZIP" required>
                <TextInput
                  disabled={disabled}
                  value={intake.contact.zip}
                  onChange={(e) => onChange({ contact: { ...intake.contact, zip: e.target.value } })}
                />
              </Field>
            </>
          ) : (
            <>
              <Field label="City" required>
                <TextInput
                  disabled={disabled}
                  value={intake.contact.city}
                  onChange={(e) => onChange({ contact: { ...intake.contact, city: e.target.value } })}
                />
              </Field>
              <Field label="State / postal code" required>
                <TextInput
                  disabled={disabled}
                  value={intake.contact.state}
                  onChange={(e) => onChange({ contact: { ...intake.contact, state: e.target.value } })}
                />
              </Field>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
