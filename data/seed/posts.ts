import type { Post } from "@/types/post-management";

function createPreviewImage(seed: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 900" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#161c24" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="720" height="900" rx="48" fill="url(#bg)" />
      <circle cx="540" cy="180" r="170" fill="rgba(255,255,255,0.12)" />
      <circle cx="210" cy="720" r="210" fill="rgba(255,255,255,0.08)" />
      <text x="72" y="132" fill="rgba(255,255,255,0.72)" font-family="Arial, sans-serif" font-size="28">
        Orbit preview
      </text>
      <text x="72" y="782" fill="white" font-family="Arial, sans-serif" font-size="52" font-weight="700">
        ${seed}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const POST_MANAGEMENT_PREVIEW_POST: Post = {
  id: 301,
  shortcode: "Orbit301",
  caption:
    "봄빛이 들어오는 시간대에 맞춰 촬영한 컷입니다. 이미지 배열과 액션 메뉴, 편집 진입 구조를 함께 확인하는 컴포넌트 프리뷰용 게시글입니다.",
  imageUrls: [
    createPreviewImage("Morning frame", "#ff9570"),
    createPreviewImage("Archive note", "#ff6b6b"),
    createPreviewImage("Soft contrast", "#5fa8ff"),
  ],
  likeCount: 128,
  commentCount: 14,
  createdAt: "2026-04-11T08:00:00.000Z",
  updatedAt: "2026-04-11T10:30:00.000Z",
};

export const POST_MANAGEMENT_EDIT_PREVIEW_POST: Post = {
  ...POST_MANAGEMENT_PREVIEW_POST,
  id: 302,
  shortcode: "Orbit302",
  caption:
    "기존 게시글을 편집하는 상태를 보여주기 위한 초기값입니다. 원격 이미지와 수정된 캡션이 함께 들어간 상태에서 폼이 채워집니다.",
};
