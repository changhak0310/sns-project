import { FoundationScreen } from "@/features/app-shell/components/foundation-screen";

export default function CreatePage() {
  return (
    <FoundationScreen
      eyebrow="Compose"
      title="작성 화면이 들어올 자리를 준비했습니다."
      description="상단 헤더와 뒤로가기 동작, 메인 콘텐츠 폭, 여백 규칙이 공통 셸 위에 고정됩니다."
      highlights={[
        { label: "Route", value: "/create" },
        { label: "Mood", value: "focus" },
        { label: "Next Step", value: "post-compose" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[28px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
            Compose Canvas
          </p>
          <div className="mt-4 rounded-[24px] border border-dashed border-[var(--color-neutral-300)] bg-[var(--color-neutral-50)] p-8 text-sm leading-6 text-[var(--color-neutral-500)]">
            이미지 선택기, 캡션 입력, 제출 액션은 게시물 작성 기능에서
            추가됩니다.
          </div>
        </div>
        <div className="rounded-[28px] border border-[var(--color-neutral-200)] bg-[var(--color-highlight-soft)] p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold text-[var(--color-neutral-800)]">
            Layout Contract
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-neutral-600)]">
            <li>헤더는 항상 보입니다.</li>
            <li>서브 라우트이므로 뒤로가기 버튼이 활성화됩니다.</li>
            <li>모바일 메뉴와 데스크톱 사이드바는 동일한 정보 구조를 씁니다.</li>
          </ul>
        </div>
      </div>
    </FoundationScreen>
  );
}
