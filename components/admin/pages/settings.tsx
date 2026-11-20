import AdminPageFrame from "./AdminPageFrame";

export function SettingsPage() {
  return (
    <AdminPageFrame
      eyebrow="Workspace preferences"
      title="Settings"
      description="Manage studio profile details and prototype preferences. Changes are not persisted in this demo."
    >
      <div className="grid max-w-2xl gap-4">
        {[
          ["Company name", "Zanmed Medical Supplies Ltd."],
          ["Primary region", "Kenya"],
          ["Contact email", "zanmedmedicalsupplies@gmail.com"],
        ].map(([label, value]) => (
          <label
            key={label}
            className="grid gap-2 border border-border bg-[#eee9df] p-5 text-xs uppercase tracking-[.12em]"
          >
            {label}
            <input
              defaultValue={value}
              className="border border-border bg-paper px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-bronze-dark"
            />
          </label>
        ))}
      </div>
    </AdminPageFrame>
  );
}
