export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-[0.2em] text-[var(--color-accent-500)] uppercase">
          Fresh Start
        </p>
        <div className="space-y-2">
          <h1 className="font-display text-4xl leading-tight text-[var(--color-neutral-950)]">
            새 계정은 여기에 연결됩니다
          </h1>
          <p className="text-sm leading-6 text-[var(--color-neutral-600)]">
            공통 기반 단계에서는 인증 전용 레이아웃만 먼저 고정합니다. 실제
            유효성 검사와 서버 액션은 회원가입 기능 문서에서 이어집니다.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-3">
          <p className="text-xs font-medium text-[var(--color-neutral-500)]">
            Display Name
          </p>
          <p className="mt-1 text-base text-[var(--color-neutral-800)]">
            Orbit Starter
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-3">
          <p className="text-xs font-medium text-[var(--color-neutral-500)]">
            Username
          </p>
          <p className="mt-1 text-base text-[var(--color-neutral-800)]">
            orbit-preview
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-primary-900)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-700)]"
        >
          회원가입 UI 자리
        </button>
        <p className="text-center text-sm text-[var(--color-neutral-500)]">
          인증 카드 폭과 간격 규칙은 현재 화면에서 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
