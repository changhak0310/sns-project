import { ImagePlus, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { ImageFallback } from "@/components/ui/image-fallback";
import { InlineMessage } from "@/components/ui/inline-message";
import { Textarea } from "@/components/ui/textarea";
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
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card bordered elevated className="bg-[var(--ds-color-neutral-0)]">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Compose Canvas</CardTitle>
                <CardDescription>
                  양식보다 미리보기 툴처럼 보이도록, 큰 미디어 블록과 가벼운 폼을 먼저 배치합니다.
                </CardDescription>
              </div>
              <Badge variant="soft" tone="accent">
                focus
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <ImageFallback ratio="portrait" label="Post preview media" icon={<ImagePlus className="h-4 w-4" />} />
            <FormField label="캡션">
              <Textarea
                resize="none"
                defaultValue="이미지 선택기, 캡션 입력, 제출 액션은 게시물 작성 기능에서 이어집니다."
                showCounter
                maxLength={140}
              />
            </FormField>
            <div className="flex gap-3">
              <Button leadingIcon={<Send className="h-4 w-4" />} disabled>
                게시
              </Button>
              <Button variant="secondary">임시 저장</Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card
            bordered
            elevated
            className="bg-[linear-gradient(180deg,var(--ds-mood-discover-bg),rgba(255,255,255,0.88))]"
          >
            <CardHeader>
              <CardTitle>Layout Contract</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-6 text-[var(--ds-color-neutral-700)]">
                <li>헤더는 항상 보입니다.</li>
                <li>서브 라우트이므로 뒤로가기 버튼이 활성화됩니다.</li>
                <li>모바일 메뉴와 데스크톱 사이드바는 동일한 정보 구조를 씁니다.</li>
              </ul>
            </CardContent>
          </Card>
          <InlineMessage
            tone="warning"
            message="작성 기능 자체는 다음 단계에서 서버 액션과 연결됩니다. 지금은 셸 위의 폼 밀도와 액션 위치만 고정합니다."
          />
        </div>
      </div>
    </FoundationScreen>
  );
}
