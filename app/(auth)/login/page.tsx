export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium tracking-[0.2em] text-[var(--color-accent-500)] uppercase">
          Focus Mode
        </p>
        <div className="space-y-2">
          <h1 className="font-display text-4xl leading-tight text-[var(--color-neutral-950)]">
            다시 흐름 안으로
          </h1>
          <p className="text-sm leading-6 text-[var(--color-neutral-600)]">
            인증 기능은 다음 단계에서 연결됩니다. 현재는 공통 인증 레이아웃과
            간격, 카드 밀도, typography 기준만 맞춘 상태입니다.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-3">
          <p className="text-xs font-medium text-[var(--color-neutral-500)]">
            Email
          </p>
          <p className="mt-1 text-base text-[var(--color-neutral-800)]">
            preview@orbit.app
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-3">
          <p className="text-xs font-medium text-[var(--color-neutral-500)]">
            Password
          </p>
          <p className="mt-1 text-base text-[var(--color-neutral-800)]">
            ••••••••
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-primary-900)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-700)]"
        >
          로그인 UI 자리
        </button>
        <p className="text-center text-sm text-[var(--color-neutral-500)]">
          회원가입 흐름은 <span className="font-medium text-[var(--color-neutral-800)]">/signup</span>
          에서 이어집니다.
        </p>
      </div>
    </div>
  );
}
