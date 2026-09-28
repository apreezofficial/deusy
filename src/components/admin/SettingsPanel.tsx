"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { saveSiteSettings, saveHomeSettings } from "@/lib/actions/settings";
import { formAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/result";
import type { HomeSettings, SiteSettings } from "@/lib/content/settings";
import type { MediaRow } from "@/lib/database.types";

type TabId = "site" | "home";

export function SettingsPanel({
  site,
  home,
  media,
  initialTab = "site",
}: {
  site: SiteSettings;
  home: HomeSettings;
  media: MediaRow[];
  initialTab?: TabId;
}) {
  const [tab, setTab] = useState<TabId>(initialTab);

  const tabs: { id: TabId; label: string }[] = [
    { id: "site", label: "Site" },
    { id: "home", label: "Home page" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Settings sections" className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={`border-2 border-ink px-5 py-2.5 ${
              tab === item.id ? "bg-signal" : "bg-paper hover:bg-drafting"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "site" ? (
        <div role="tabpanel" id="panel-site" aria-labelledby="tab-site">
          <SiteSettingsForm settings={site} media={media} />
        </div>
      ) : (
        <div role="tabpanel" id="panel-home" aria-labelledby="tab-home">
          <HomeSettingsForm settings={home} />
        </div>
      )}
    </div>
  );
}

function SiteSettingsForm({
  settings,
  media,
}: {
  settings: SiteSettings;
  media: MediaRow[];
}) {
  const [state, formActionHandler] = useActionState(
    formAction(saveSiteSettings),
    null as ActionResult<SiteSettings> | null,
  );
  const { notify } = useToast();
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addressLines, setAddressLines] = useState<string[]>(
    settings.addressLines.length ? settings.addressLines : [""],
  );
  const [socials, setSocials] = useState(settings.socials);
  const lastResult = useRef(state);

  useEffect(() => {
    if (!state || state === lastResult.current) return;
    lastResult.current = state;

    if (state.ok) notify("Settings saved");
  }, [state, notify]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formActionHandler} className="edge flex flex-col gap-5">
      <input type="hidden" name="logoUrl" value={logoUrl} />

      {state && !state.ok ? (
        <p role="alert" className="border-2 border-ink bg-signal px-4 py-3">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Business name"
          name="name"
          required
          defaultValue={settings.name}
          error={fieldErrors?.name}
        />
        <Input
          label="Tagline"
          name="tagline"
          defaultValue={settings.tagline}
          error={fieldErrors?.tagline}
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={settings.phone}
          hint="Leave empty to hide the phone number everywhere."
          error={fieldErrors?.phone}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={settings.email}
          hint="Leave empty to hide the email address."
          error={fieldErrors?.email}
        />
        <Input
          label="WhatsApp"
          name="whatsapp"
          defaultValue={settings.whatsapp}
          hint="Leave empty to hide it."
          error={fieldErrors?.whatsapp}
        />
        <Input
          label="Opening hours"
          name="hours"
          defaultValue={settings.hours}
          hint="Leave empty to hide."
          error={fieldErrors?.hours}
        />
      </div>

      <fieldset className="flex flex-col gap-3 border-2 border-ink bg-paper p-5">
        <legend className="drawing-label px-2 text-sm">Logo</legend>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Current logo"
            width={240}
            height={64}
            className="h-12 w-auto border-2 border-ink"
            unoptimized
          />
        ) : (
          <p className="text-sm text-ink-muted">
            No logo uploaded. The site shows the wordmark instead.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            {logoUrl ? "Change logo" : "Choose logo"}
          </Button>
          {logoUrl ? (
            <Button variant="quiet" size="sm" onClick={() => setLogoUrl("")}>
              Remove logo
            </Button>
          ) : null}
        </div>
        {fieldErrors?.logoUrl ? (
          <p className="text-sm text-signal-dark">{fieldErrors.logoUrl}</p>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-3 border-2 border-ink bg-paper p-5">
        <legend className="drawing-label px-2 text-sm">Address lines</legend>
        {addressLines.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              name="addressLine"
              value={line}
              aria-label={`Address line ${index + 1}`}
              onChange={(event) => {
                const next = [...addressLines];
                next[index] = event.target.value;
                setAddressLines(next);
              }}
              className="w-full border-2 border-ink bg-paper px-3 py-2"
            />
            <Button
              type="button"
              variant="quiet"
              size="sm"
              aria-label={`Remove address line ${index + 1}`}
              onClick={() =>
                setAddressLines(addressLines.filter((_, position) => position !== index))
              }
            >
              <Trash2 size={16} aria-hidden="true" />
            </Button>
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAddressLines([...addressLines, ""])}
          >
            Add address line
          </Button>
        </div>
        {fieldErrors?.addressLines ? (
          <p className="text-sm text-signal-dark">{fieldErrors.addressLines}</p>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-3 border-2 border-ink bg-paper p-5">
        <legend className="drawing-label px-2 text-sm">Social links</legend>
        {socials.map((social, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto]">
            <input
              name="socialLabel"
              value={social.label}
              aria-label={`Social link ${index + 1} label`}
              placeholder="Label"
              onChange={(event) => {
                const next = [...socials];
                next[index] = { ...next[index], label: event.target.value };
                setSocials(next);
              }}
              className="w-full border-2 border-ink bg-paper px-3 py-2"
            />
            <input
              name="socialUrl"
              value={social.url}
              aria-label={`Social link ${index + 1} address`}
              placeholder="https://"
              onChange={(event) => {
                const next = [...socials];
                next[index] = { ...next[index], url: event.target.value };
                setSocials(next);
              }}
              className="w-full border-2 border-ink bg-paper px-3 py-2"
            />
            <Button
              type="button"
              variant="quiet"
              size="sm"
              aria-label={`Remove social link ${index + 1}`}
              onClick={() => setSocials(socials.filter((_, position) => position !== index))}
            >
              <Trash2 size={16} aria-hidden="true" />
            </Button>
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSocials([...socials, { label: "", url: "" }])}
          >
            Add social link
          </Button>
        </div>
        {fieldErrors?.socials ? (
          <p className="text-sm text-signal-dark">{fieldErrors.socials}</p>
        ) : null}
      </fieldset>

      <div>
        <SubmitButton pendingLabel="Saving settings" size="lg">
          Save settings
        </SubmitButton>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        media={media}
        onSelect={(item) => {
          setLogoUrl(item.url);
          setPickerOpen(false);
        }}
      />
    </form>
  );
}

function HomeSettingsForm({ settings }: { settings: HomeSettings }) {
  const [state, formActionHandler] = useActionState(
    formAction(saveHomeSettings),
    null as ActionResult<HomeSettings> | null,
  );
  const { notify } = useToast();
  const [steps, setSteps] = useState(settings.processSteps);
  const lastResult = useRef(state);

  useEffect(() => {
    if (!state || state === lastResult.current) return;
    lastResult.current = state;

    if (state.ok) notify("Home page text saved");
  }, [state, notify]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formActionHandler} className="flex flex-col gap-4">
      {state && !state.ok ? (
        <p role="alert" className="border-2 border-ink bg-signal px-4 py-3">
          {state.error}
        </p>
      ) : null}

      <Input
        label="Hero title"
        name="heroTitle"
        defaultValue={settings.heroTitle}
        error={fieldErrors?.heroTitle}
      />
      <Textarea
        label="Hero intro"
        name="heroIntro"
        rows={3}
        defaultValue={settings.heroIntro}
        error={fieldErrors?.heroIntro}
      />
      <Input
        label="Services heading"
        name="servicesHeading"
        defaultValue={settings.servicesHeading}
        error={fieldErrors?.servicesHeading}
      />
      <Input
        label="Agency heading"
        name="agencyHeading"
        defaultValue={settings.agencyHeading}
        error={fieldErrors?.agencyHeading}
      />
      <Input
        label="Closing heading"
        name="closingHeading"
        defaultValue={settings.closingHeading}
        error={fieldErrors?.closingHeading}
      />

      <fieldset className="edge-sm flex flex-col gap-4 border-2 border-ink bg-paper p-5">
        <legend className="drawing-label px-2 text-sm">How we work section</legend>
        <Input
          label="Heading"
          name="processHeading"
          defaultValue={settings.processHeading}
          error={fieldErrors?.processHeading}
        />
        <Textarea
          label="Intro"
          name="processIntro"
          rows={2}
          defaultValue={settings.processIntro}
          error={fieldErrors?.processIntro}
        />

        <div className="flex flex-col gap-3">
          <span className="drawing-label text-sm">Steps</span>
          {steps.map((step, index) => (
            <div key={index} className="grid gap-2 border-2 border-ink p-3">
              <input
                name="processStepTitle"
                value={step.title}
                aria-label={`Step ${index + 1} title`}
                placeholder="Step title"
                onChange={(event) => {
                  const next = [...steps];
                  next[index] = { ...next[index], title: event.target.value };
                  setSteps(next);
                }}
                className="w-full border-2 border-ink bg-paper px-3 py-2"
              />
              <textarea
                name="processStepText"
                value={step.text}
                rows={2}
                aria-label={`Step ${index + 1} text`}
                placeholder="One short sentence"
                onChange={(event) => {
                  const next = [...steps];
                  next[index] = { ...next[index], text: event.target.value };
                  setSteps(next);
                }}
                className="w-full border-2 border-ink bg-paper px-3 py-2"
              />
              <div>
                <Button
                  type="button"
                  variant="quiet"
                  size="sm"
                  aria-label={`Remove step ${index + 1}`}
                  onClick={() => setSteps(steps.filter((_, position) => position !== index))}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Remove step
                </Button>
              </div>
            </div>
          ))}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={steps.length >= 6}
              onClick={() => setSteps([...steps, { title: "", text: "" }])}
            >
              Add step
            </Button>
          </div>
          {fieldErrors?.processSteps ? (
            <p className="text-sm text-signal-dark">{fieldErrors.processSteps}</p>
          ) : null}
        </div>
      </fieldset>

      <div>
        <SubmitButton pendingLabel="Saving home page text" size="lg">
          Save home page text
        </SubmitButton>
      </div>
    </form>
  );
}
