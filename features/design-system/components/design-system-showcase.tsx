"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Grid2X2,
  Heart,
  MessageCircleMore,
  Palette,
  Search,
  Send,
  Sparkles,
  Type,
} from "lucide-react";

import { AuthShell } from "@/components/layout/auth-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { FormField } from "@/components/ui/form-field";
import { IconButton } from "@/components/ui/icon-button";
import { ImageFallback } from "@/components/ui/image-fallback";
import { InlineMessage } from "@/components/ui/inline-message";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupForm } from "@/features/auth/components/signup-form";

const sectionTabs = [
  { value: "foundations", label: "Foundations", icon: <Palette className="size-4" /> },
  { value: "forms", label: "Forms", icon: <Type className="size-4" /> },
  { value: "states", label: "States", icon: <Sparkles className="size-4" /> },
] as const;

const authTabs = [
  { value: "login", label: "Login" },
  { value: "signup", label: "Signup" },
] as const;

export function DesignSystemShowcase() {
  const [activeSection, setActiveSection] =
    useState<(typeof sectionTabs)[number]["value"]>("foundations");
  const [activeAuthForm, setActiveAuthForm] =
    useState<(typeof authTabs)[number]["value"]>("login");
  const [bio, setBio] = useState(
    "에디토리얼 감각으로 오늘의 피드와 저장 탭을 큐레이션합니다."
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[var(--ds-content-wide)] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <Card
          padding="lg"
          radius="xl"
          bordered
          elevated
          className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.7))]"
        >
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="solid" tone="neutral">
                Orbit
              </Badge>
              <Badge variant="soft" tone="accent">
                Clean Social
              </Badge>
              <Badge variant="soft" tone="warning">
                Shell design deferred
              </Badge>
            </div>
            <div className="space-y-3">
              <h1 className="max-w-3xl font-display text-[40px] leading-[1.02] tracking-[-0.06em] text-[var(--ds-color-primary-900)] sm:text-[56px]">
                미디어 우선형 SNS를 위한 디자인 시스템 베이스를 정리했습니다.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--ds-color-neutral-700)] sm:text-lg">
                토큰은 `app/globals.css`에 고정하고, 공통 UI는 props-only 컴포넌트로 분리했습니다.
                `00-common-foundation.md`에 연결되는 메인 셸 시각 설계는 이번 범위에서 제외했습니다.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
              <FormField
                label="탐색 입력 예시"
                description="검색 variant는 얇은 보더와 빠른 스캔에 맞는 라운드 필드를 사용합니다."
              >
                <Input
                  variant="search"
                  placeholder="사람, 태그, 저장한 게시물 검색"
                  leadingIcon={<Search className="size-4" />}
                />
              </FormField>
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <Button leadingIcon={<Sparkles className="size-4" />}>Primary</Button>
                <Button variant="secondary" trailingIcon={<ArrowRight className="size-4" />}>
                  Secondary
                </Button>
              </div>
            </div>
            <Divider />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar alt="Orbit Editor" fallback="OE" size="lg" ring status="online" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                      Orbit Editor
                    </p>
                    <p className="text-sm text-[var(--ds-color-neutral-600)]">
                      Soft editorial tone · 빠른 읽기 · 선명한 액션
                    </p>
                  </div>
                </div>
                <p className="max-w-xl text-sm leading-7 text-[var(--ds-color-neutral-700)]">
                  카드, 폼, 상태 표현은 모두 같은 톤의 화이트 surface와 얇은 보더를 기준으로 맞췄고,
                  과한 그림자 대신 여백과 대비로 위계를 만들었습니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Primary", "bg-[var(--ds-color-primary-900)]"],
                  ["Neutral", "bg-[var(--ds-color-neutral-300)]"],
                  ["Accent", "bg-[var(--ds-color-accent-500)]"],
                  ["Success", "bg-[var(--ds-color-success-500)]"],
                  ["Warning", "bg-[var(--ds-color-warning-500)]"],
                  ["Error", "bg-[var(--ds-color-error-500)]"],
                ].map(([label, color]) => (
                  <div
                    key={label}
                    className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] p-3"
                  >
                    <div className={`h-16 rounded-[var(--ds-radius-md)] ${color}`} />
                    <p className="mt-3 text-sm font-medium text-[var(--ds-color-primary-900)]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card padding="md" bordered elevated className="bg-[var(--ds-color-neutral-0)]">
          <CardHeader>
            <CardTitle>Token Notes</CardTitle>
            <CardDescription>
              폰트는 `Geist + DM Serif Display + JetBrains Mono`, 간격은 4px 스케일, 상태 색은 semantic
              토큰으로 통일했습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ds-color-neutral-500)]">
                Typography
              </p>
              <p className="font-display text-3xl leading-none tracking-[-0.05em] text-[var(--ds-color-primary-900)]">
                Editorial Display
              </p>
              <p className="text-sm leading-6 text-[var(--ds-color-neutral-700)]">
                UI 본문은 가볍게, 브랜드 카피는 명확한 대비와 타이포로 분리합니다.
              </p>
            </div>
            <Divider />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ds-color-neutral-500)]">
                Interaction
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" tone="neutral">
                  hover
                </Badge>
                <Badge variant="soft" tone="accent">
                  active
                </Badge>
                <Badge variant="soft" tone="warning">
                  pending
                </Badge>
                <Badge variant="soft" tone="error">
                  error
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Tabs
        items={sectionTabs.map((item) => ({ ...item }))}
        value={activeSection}
        onChange={(value) => setActiveSection(value as (typeof sectionTabs)[number]["value"])}
      />

      {activeSection === "foundations" ? <FoundationsPanel /> : null}
      {activeSection === "forms" ? (
        <FormsPanel
          activeAuthForm={activeAuthForm}
          bio={bio}
          onAuthChange={(value) =>
            setActiveAuthForm(value as (typeof authTabs)[number]["value"])
          }
          onBioChange={setBio}
        />
      ) : null}
      {activeSection === "states" ? <StatesPanel /> : null}
    </div>
  );
}

function FoundationsPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
        <CardHeader>
          <CardTitle>Button and Action Language</CardTitle>
          <CardDescription>
            색보다 명확한 대비, 터치 영역, 상태 전환으로 액션 우선순위를 만듭니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <IconButton icon={<Heart className="size-4" />} label="좋아요" tone="accent" active />
            <IconButton icon={<Bookmark className="size-4" />} label="저장" />
            <IconButton icon={<Send className="size-4" />} label="공유" />
            <IconButton icon={<MessageCircleMore className="size-4" />} label="댓글" tone="danger" />
          </div>
          <Divider />
          <Card
            padding="sm"
            radius="lg"
            bordered
            className="overflow-hidden bg-[var(--ds-color-neutral-0)]"
          >
            <div className="flex items-center justify-between gap-3 p-2">
              <div className="flex items-center gap-3">
                <Avatar alt="Orbit Team" fallback="OT" ring />
                <div>
                  <p className="text-sm font-semibold text-[var(--ds-color-primary-900)]">
                    Orbit Team
                  </p>
                  <p className="text-xs text-[var(--ds-color-neutral-500)]">2분 전</p>
                </div>
              </div>
              <Badge variant="soft" tone="accent">
                Featured
              </Badge>
            </div>
            <ImageFallback ratio="portrait" label="Feed media block" className="mt-2" />
            <div className="space-y-4 p-2 pt-4">
              <p className="text-sm leading-7 text-[var(--ds-color-neutral-700)]">
                피드 카드는 무거운 장식보다 이미지 비율 안정성과 여백 리듬을 우선합니다.
              </p>
              <div className="flex items-center gap-2">
                <IconButton icon={<Heart className="size-4" />} label="좋아요" tone="accent" />
                <IconButton icon={<MessageCircleMore className="size-4" />} label="댓글" />
                <IconButton icon={<Bookmark className="size-4" />} label="저장" />
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>

      <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
        <CardHeader>
          <CardTitle>Identity and Meta</CardTitle>
          <CardDescription>
            display, sans, mono를 명확히 분리해 헤드라인과 숫자 메타를 빠르게 읽게 합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="font-display text-[34px] leading-[1.05] tracking-[-0.05em] text-[var(--ds-color-primary-900)]">
              Soft editorial, media first.
            </p>
            <p className="max-w-md text-sm leading-7 text-[var(--ds-color-neutral-700)]">
              긴 설명보다 짧은 라벨, 강한 본문 대비, 안정적인 카드 간격으로 스캔 속도를 높였습니다.
            </p>
          </div>
          <Divider />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Followers", value: "12.4K" },
              { label: "Saved", value: "380" },
              { label: "Drafts", value: "07" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-neutral-100)] px-4 py-4"
              >
                <p className="font-mono text-2xl font-semibold text-[var(--ds-color-primary-900)]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--ds-color-neutral-500)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Avatar alt="Archive" fallback="AR" size="sm" />
            <Avatar alt="Discover" fallback="DI" size="md" ring status="online" />
            <Avatar alt="Highlight" fallback="HI" size="lg" />
            <Avatar alt="Alert" fallback="AL" size="xl" ring />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function FormsPanel({
  activeAuthForm,
  onAuthChange,
  bio,
  onBioChange,
}: {
  activeAuthForm: "login" | "signup";
  onAuthChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
      <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle>Auth Pattern Preview</CardTitle>
              <CardDescription>
                인증 화면은 중앙 정렬 단일 카드 레이아웃과 빠르게 읽히는 카피를 유지합니다.
              </CardDescription>
            </div>
            <Tabs
              items={authTabs.map((item) => ({ ...item }))}
              value={activeAuthForm}
              onChange={onAuthChange}
              variant="pill"
              size="sm"
              className="w-auto"
            />
          </div>
        </CardHeader>
        <CardContent>
          <AuthShell mood={activeAuthForm === "signup" ? "focus-dark" : "focus"}>
            {activeAuthForm === "login" ? (
              <LoginForm formError="이메일 또는 비밀번호를 다시 확인해 주세요." />
            ) : (
              <SignupForm />
            )}
          </AuthShell>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
          <CardHeader>
            <CardTitle>Field Composition</CardTitle>
            <CardDescription>
              공통 폼은 `FormField + Input/Textarea + InlineMessage` 조합만으로 구성합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              label="프로필 이름"
              description="프로필 헤더에서 크게 보이는 이름입니다."
              htmlFor="profile-name"
            >
              <Input
                id="profile-name"
                placeholder="Orbit Editor"
                defaultValue="Orbit Editor"
              />
            </FormField>
            <FormField label="Bio" htmlFor="profile-bio">
              <Textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => onBioChange(event.target.value)}
                showCounter
                maxLength={120}
                resize="none"
              />
            </FormField>
            <InlineMessage
              tone="warning"
              message="프로필 편집은 나중에 feature 단계에서 실제 저장 흐름과 연결합니다."
            />
          </CardContent>
        </Card>

        <Card bordered elevated className="bg-[var(--ds-mood-discover-bg)]">
          <CardHeader>
            <CardTitle>Search Variant</CardTitle>
            <CardDescription>
              탐색 입력은 pill 형태와 부드러운 톤으로 피드보다 가볍게 느껴지도록 설계합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              variant="search"
              placeholder="추천 계정과 게시물 찾기"
              leadingIcon={<Search className="size-4" />}
            />
            <Button variant="secondary" fullWidth trailingIcon={<ArrowRight className="size-4" />}>
              탐색 결과 보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function StatesPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <LoadingState variant="card" mediaRatio="portrait" />
      <EmptyState
        title="저장한 게시물이 아직 없습니다"
        description="좋아요만 남기지 말고 저장 탭에 담아두면 다시 읽을 때 더 빠르게 정리됩니다."
        action={<Button variant="secondary">추천 보기</Button>}
      />
      <ErrorState
        title="미디어를 불러오지 못했습니다"
        description="기술 문구 대신 복구 행동을 먼저 보여주는 규칙에 맞춰 다시 시도 버튼을 함께 배치합니다."
      />
      <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
        <CardHeader>
          <CardTitle>Pending and Fallback</CardTitle>
          <CardDescription>
            로딩 중에는 tone을 즉시 바꾸고 중복 액션을 막습니다. 이미지 실패도 같은 시각 언어로 처리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button loading>게시 중</Button>
            <IconButton icon={<Heart className="size-4" />} label="좋아요 처리 중" loading />
            <IconButton icon={<Grid2X2 className="size-4" />} label="그리드 보기" />
          </div>
          <ImageFallback ratio="landscape" label="Image fallback" />
        </CardContent>
      </Card>
    </section>
  );
}
