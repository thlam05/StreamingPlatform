# Frontend Screen Plan

Status: Draft  
Last updated: 2026-09-06

## 1. Mục tiêu

Tài liệu này liệt kê các màn hình cần xây dựng cho `frontend-client` của Web Streaming Platform và sắp xếp theo thứ tự ưu tiên triển khai.

`frontend-client` tập trung phục vụ Visitor, Viewer, Streamer và Group member. Các màn hình quản trị và moderation nên được triển khai trong `frontend-admin` riêng theo kiến trúc hiện tại.

## 2. Phạm vi sản phẩm

Các nhóm chức năng chính:

- Khám phá và xem livestream.
- Follow, like và ghi nhận lượt xem.
- Livestream chat theo thời gian thực.
- Tạo và quản lý livestream cho Streamer.
- Public posts, group posts, likes và comments.
- Group chat theo thời gian thực.
- Gifts là tính năng provisional; payment, wallet, refund và revenue sharing vẫn là `TBD`.

## 3. Danh sách màn hình theo phase

### Phase 1 — Nền tảng và livestream MVP

| Màn hình           | Route đề xuất               | Người dùng      | Ưu tiên |
| ------------------ | --------------------------- | --------------- | ------- |
| Landing / Home     | `/`                         | Visitor, Viewer | P0      |
| Login              | `/login`                    | Visitor         | P0      |
| Register           | `/register`                 | Visitor         | P0      |
| Stream discovery   | `/streams`                  | Visitor, Viewer | P0      |
| Watch livestream   | `/streams/:streamId`        | Viewer          | P0      |
| Stream unavailable | Trạng thái trong watch page | Viewer          | P0      |
| Not found          | `*`                         | Tất cả          | P0      |
| Forbidden          | `/403`                      | Tất cả          | P0      |

Watch livestream là màn hình cốt lõi, cần bao gồm:

- HLS video player và playback state.
- Stream title, creator, status và category.
- Current viewer count.
- Follow/unfollow streamer.
- Like/unlike livestream.
- Livestream chat.
- Loading, playback error, ended và unavailable states.

### Phase 2 — Streamer workflow

| Màn hình              | Route đề xuất                           | Người dùng | Ưu tiên |
| --------------------- | --------------------------------------- | ---------- | ------- |
| Streamer dashboard    | `/studio`                               | Streamer   | P0      |
| Create stream         | `/studio/streams/new`                   | Streamer   | P0      |
| Stream setup          | `/studio/streams/:streamId/setup`       | Streamer   | P0      |
| Live control room     | `/studio/streams/:streamId/live`        | Streamer   | P0      |
| Stream ended summary  | `/studio/streams/:streamId/summary`     | Streamer   | P1      |
| Stream statistics     | `/studio/streams/:streamId/statistics`  | Streamer   | P1      |
| Credential management | `/studio/streams/:streamId/credentials` | Streamer   | P1      |

Stream setup và live control room cần hỗ trợ:

- Title, description, thumbnail và category.
- Lifecycle states: `scheduled`, `live`, `ended`, `cancelled`.
- RTMP/RTMPS URL và stream key được tạo bởi server.
- Copy controls và cảnh báo stream key là secret.
- Start, stop, rotate credential và revoke credential.
- Không cho client tự đặt stream thành `live`.

### Phase 3 — Community

| Màn hình           | Route đề xuất            | Người dùng         | Ưu tiên |
| ------------------ | ------------------------ | ------------------ | ------- |
| Public feed        | `/feed`                  | Authenticated user | P1      |
| Create public post | `/posts/new` hoặc modal  | Authenticated user | P1      |
| Post detail        | `/posts/:postId`         | Authenticated user | P1      |
| Groups list        | `/groups`                | Group member       | P1      |
| Group detail       | `/groups/:groupId`       | Group member       | P1      |
| Group posts        | `/groups/:groupId/posts` | Group member       | P1      |
| Group chat         | `/groups/:groupId/chat`  | Group member       | P1      |

Post detail cần bao gồm:

- Author, content, visibility và timestamp.
- Like/unlike.
- Comment list và create comment.
- Loading, empty, error và moderation states.

### Phase 4 — Profile và user experience

| Màn hình             | Route đề xuất        | Người dùng         | Ưu tiên |
| -------------------- | -------------------- | ------------------ | ------- |
| User profile         | `/profile/:userId`   | Viewer, Streamer   | P2      |
| My profile           | `/profile`           | Authenticated user | P2      |
| Following streams    | `/following`         | Viewer             | P2      |
| Notifications        | `/notifications`     | Authenticated user | P2      |
| Settings             | `/settings`          | Authenticated user | P2      |
| Account and security | `/settings/security` | Authenticated user | P2      |

Các màn hình này giúp hoàn thiện follow, account và notification experience nhưng chưa thuộc acceptance criteria MVP.

### Phase 5 — Moderator và Administrator

Các màn hình dưới đây nên thuộc `frontend-admin`, không phải scope chính của `frontend-client`:

- Admin dashboard.
- User management.
- Role and permission management.
- Stream moderation và forced termination.
- Flagged livestream chat queue.
- Moderation decision detail.
- Group và post moderation.
- Category management.
- System configuration.
- Audit và security activity.

### Phase 6 — Gifts

Gift UI chỉ nên bật khi các business rules được phê duyệt:

- Gift catalog trong watch livestream page.
- Gift confirmation modal.
- Gift transaction result.
- Stream gift activity.
- Creator gift statistics.

Cho đến khi payment, wallet, currency, refund, fraud control và revenue sharing được xác định, UI phải hiển thị feature ở trạng thái disabled hoặc `Coming soon`.

## 4. Layout và route groups

### Public layout

- Landing / Home.
- Stream discovery.
- Public stream detail khi không yêu cầu đăng nhập.
- Login và Register dùng `AuthLayout`.

### Main application layout

- `Header`.
- `Sidebar`.
- Main content area với `Outlet`.
- Navigation dùng `Link`, `NavLink` và centralized route paths.

### Streamer layout

- Dashboard navigation.
- Stream management pages.
- Statistics và credential management.
- Protected bởi authentication và ownership checks.

### Community layout

- Feed navigation.
- Group navigation.
- Post và comment surfaces.
- Group chat panel hoặc dedicated chat screen.

## 5. Thứ tự triển khai

1. Hoàn thiện shared layout, route configuration, responsive navigation và error boundaries.
2. Hoàn thiện authentication flow gồm Login, Register, session state và protected actions.
3. Xây dựng stream discovery và watch livestream.
4. Thêm follow, like, view session và livestream chat.
5. Xây dựng Streamer Studio và stream lifecycle.
6. Thêm stream statistics, credential rotation và credential revocation.
7. Xây dựng public posts, comments và groups.
8. Thêm group chat theo thời gian thực.
9. Xây dựng `frontend-admin` cho moderation và administration.
10. Chỉ triển khai gifts sau khi các quyết định nghiệp vụ được chốt.

## 6. Trạng thái cần có trên mỗi màn hình

Mỗi màn hình có asynchronous operation phải xác định rõ:

- Loading state.
- Success state.
- Empty state nếu không có dữ liệu.
- Error state và retry action khi phù hợp.
- Forbidden state khi người dùng không đủ quyền.
- Not-found hoặc unavailable state khi resource không tồn tại hoặc không còn khả dụng.

## 7. Tiêu chí hoàn thành MVP

- Visitor có thể xem danh sách livestream công khai.
- Viewer có thể mở livestream đang `live` và nhận `playback_url` sau khi được authorize.
- Viewer không bao giờ nhận RTMP URL hoặc stream key.
- Viewer có thể follow, like và chat trong livestream.
- View session không bị tạo trùng khi client retry.
- Streamer có thể tạo stream ở trạng thái `scheduled`.
- Stream chỉ chuyển sang `live` sau khi ingest service xác nhận media feed.
- Streamer có thể xem trạng thái và statistics của stream thuộc quyền sở hữu.
- Stream ended hoặc cancelled không cho phép live interaction mới.
- Các màn hình có loading, error, forbidden và not-found states phù hợp.

## 8. Open decisions

- Thống nhất React Router version: design document ghi React Router 8, trong khi project hiện dùng `react-router-dom` 7.18.3.
- Xác định playback player và HLS library.
- Xác định authentication UI, token refresh và session expiration behavior.
- Xác định chat WebSocket protocol, moderation fallback và message ordering.
- Xác định feed pagination, post editing, deletion, reporting và attachments.
- Xác định group lifecycle, membership roles, privacy và invitations.
- Chốt toàn bộ gift catalog, currency, payment, refund, fraud và creator revenue rules.
- Xác định target browsers, mobile behavior, latency, availability và retention.

## 9. Tài liệu nguồn

- [Requirements](../docs/requirement.md)
- [System Requirements Document](../docs/srd.md)
- [System Architecture and Technology Design](../docs/design.md)
- [Database Design](../docs/database-design.md)
- [Livestream Specification](../docs/specs/livestream.md)
- [Chat Specification](../docs/specs/chat.md)
- [Communication Specification](../docs/specs/communication.md)
- [Gift Specification](../docs/specs/gift.md)
