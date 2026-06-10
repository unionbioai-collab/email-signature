# UNION biometrics Email Signature Builder

GitHub Pages용 정적 이메일 서명 생성기. 서버 불필요.

## 구성
| 파일 | 용도 |
|---|---|
| `index.html` | 직원용 — 이름·직책·연락처 입력, 주소(국문/영문/병기)·배너(국문/영문/없음) 선택 |
| `admin.html` | 관리자용 — 회사 공통값 편집 후 config.json 생성 |
| `config.json` | 회사 공통 설정 (로고·배너·주소·SNS·아이콘 URL) |
| `sig-core.js` | 서명 HTML 생성 공통 로직 |
| `icons/` | 연락처 아이콘 폴백 (tel/mobile/email/home/addr) |

## 배포
1. 이 폴더 전체를 리포지토리에 업로드 (Public)
2. Settings → Pages → Source: Deploy from a branch / Branch: main / (root) → Save
3. 직원 공유 주소: `https://unionbioai-collab.github.io/email-signature/`
4. 관리자 주소: `https://unionbioai-collab.github.io/email-signature/admin.html`

## 회사 공통값 변경 (관리자)
admin.html 열기 → 값 수정 → "config.json 다운로드" →
리포지토리에 Add file → Upload files로 config.json 덮어쓰기 커밋 → 1~2분 내 전 직원 반영

## 서명 템플릿 사양
- 이름(국문+영문 병기) 18pt bold / 부서 | 직책 (#003da6)
- 헤더 하단 구분선: 브랜드 블루 #003da6
- 연락처: T / M / E / 홈페이지(고정) / A — 자사 호스팅 아이콘
- 주소: 국문 · 영문 · 병기 선택
- 하단 배너: 국문(email_kor.gif) · 영문(email-eng.gif) · 미사용 선택
- 로고: 수직 중앙 정렬, 110px

## 아이콘/이미지 교체
모든 아이콘과 로고는 config.json의 https URL로 지정됩니다.
주의: sftp:// 경로는 업로드용일 뿐 이메일·브라우저에서 열리지 않으므로 반드시 https URL 사용.
