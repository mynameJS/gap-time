
<img width="1547" alt="스크린샷 2025-04-27 오후 10 38 10" src="https://github.com/user-attachments/assets/8e7eb1c5-54ba-4bdb-9bad-fbc29c930f81" />



> 프로젝트명 : GAP-TIME (틈새시간)
>
> 프로젝트 소개 : 이용자의 현재위치를 기반으로 일정을 생성해주는 서비스
>
> 개발 기간: 2025. 2. 25 ~ 4. 7 (MVP 모델)
>
> [GAPTIME](https://www.gaptime.online/)
<br />
<br />

## 🎯 주요 기능

### `랜딩페이지 (/)`
#### 랜딩페이지에서는 "이용하기" 버튼을 통해 일정을 생성하기 전 간단한 사전 질문에 대한 답변을 받습니다.
#### `일정시간`, `이동경로`, `출발위치`에 대한 데이터를 입력 해야 일정 생성 단계로 넘어갈 수 있습니다.
#### 이용자는 해당 데이터를 통해 자체 개발 알고리즘으로 만든 추천 일정을 생성할 것인지, 직접 장소를 선택할 것인지 고를 수 있습니다.

![스크린샷 2025-04-07 오전 10 03 57](https://github.com/user-attachments/assets/e2773236-acde-408c-aa59-23159f01138e)


### `플랜페이지 (/plan)`
#### 📝 `추천일정`
#### 추천일정 생성은 선택된 시간대를 분류하여 알맞는 장소의 타입을 결정한 후, 이용자의 주변지역 장소 중 인기도(prominence)를 기반으로 선별하여 생성합니다.
#### 기본적으로 생성된 일정은 설정된 장소들 간 이동거리를 계산하여 체류시간과 이동시간을 계산합니다.
#### 이용자가 사이트 회원일 경우, 일정 저장하기 버튼을 눌러 생성된 일정들을 저장할 수 있으며, 마이페이지에서 관리할 수 있습니다.


![화면 기록 2025-04-07 오전 11 02 49 (1)](https://github.com/user-attachments/assets/55f3de9b-1e75-4b2f-bf61-28ceb85482e5)

#### 🛠️ 일정페이지 UI 개선 (Timeline)
<img width="1670" alt="스크린샷 2025-04-27 오후 10 37 51" src="https://github.com/user-attachments/assets/7d5a7080-6fc8-4604-a6b2-93dea47895dc" />




#### 📝 `직접 장소 선택`
#### 직접 장소 선택의 경우, 선택된 시간대를 계산하여 지정할 수 있는 장소의 갯수가 할당됩니다.
#### 카테고리 탭을 이용하면 이용자의 위치를 기반으로 주변지역에서 선호되는 장소들이 리스트업 됩니다.
#### 검색버튼을 통해 직접 키워드를 입력하여 장소를 선택할 수 있습니다.
#### 설정버튼(⚙️)을 이용하여 사전질문에서 답했던 정보를 수정할 수 있습니다.
#### 원하는 장소를 선택 한 후 일정 생성하기 버튼을 누르면 선택된 장소를 기반으로 일정이 생성됩니다.

![화면 기록 2025-04-07 오전 11 52 17](https://github.com/user-attachments/assets/ddbf9f6c-406e-4c1f-8188-d4b41f675245)

#### 📝 `AI 장소 추천`
#### 플랜페이지 우측 하단의 `AI 추천` 버튼을 통해 AI 채팅을 진행할 수 있습니다.
#### 원하는 장소의 유형이나 특정 장소 키워드를 입력하면 AI 가 추천하는 장소 리스트가 카드 형태로 제시됩니다.
#### 해당 카드를 클릭하여 상세 정보를 열람하거나 + 버튼을 클릭하여 내 일정에 추가할 수 있습니다.


![화면 기록 2025-04-22 오전 3 14 01](https://github.com/user-attachments/assets/a3ac34ca-dc82-4834-83fc-cb41f75bcaaf)

### `마이페이지 (/mypage)`
#### 마이페이지에서는 저장된 일정과 회원정보를 관리할 수 있습니다.
#### 내가 만든 일정 리스트를 통해 이전에 만들었던 일정 내용을 클릭하여 확인할 수 있습니다.
#### 내 정보 모달을 통해 닉네임 변경과 회원탈퇴를 진행할 수 있습니다.

![화면 기록 2025-04-07 오후 1 37 08](https://github.com/user-attachments/assets/6a541a42-2fa7-493b-9ae9-55df70ca5358)



### `회원관리 (/login , /signup)`
#### 회원가입 방법은 총 2가지로, 이메일인증 방법과, 소셜로그인 방법이 있습니다.
#### 이메일인증의 경우 유저 입력 이메일로 인증번호가 전송되며, 해당 인증번호를 입력함으로써 회원가입을 진행할 수 있습니다.
#### 소셜로그인은(현재 구글만 존재) 이메일인증 없이 원하는 소셜서비스에 로그인함으로써 해당 사이트의 인증을 인계받아 회원가입을 진행합니다.
![스크린샷 2025-04-07 오후 1 44 58](https://github.com/user-attachments/assets/393298f9-cd33-4458-bcfd-40e3916d8ad8)

![스크린샷 2025-04-07 오후 1 45 18](https://github.com/user-attachments/assets/1e9d104b-290d-4fbb-a672-e399256de0bc)

<br />


## 🧰 기술 스택

| **FE**         |             | **BE**       |             |
|----------------|-------------|--------------|-------------|
| **분류**       | **기술**    | **분류**     | **기술**    |
| Framework      | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![App Router](https://img.shields.io/badge/App%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white) | Server       | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) |
| Language       | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Email / Mail | ![Nodemailer](https://img.shields.io/badge/Nodemailer-009c3b?style=for-the-badge&logo=nodemailer&logoColor=white) |
| Styles         | ![Chakra UI](https://img.shields.io/badge/ChakraUI-319795?style=for-the-badge&logo=chakraui&logoColor=white) |              |             |
| State Mgmt     | ![Zustand](https://img.shields.io/badge/Zustand-F0BA47?style=for-the-badge&logo=Zustand&logoColor=white) |              |             |
| Data Fetching  | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white) |              |             |
| API / External | ![Google API](https://img.shields.io/badge/Google%20API-4285F4?style=for-the-badge&logo=google&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) |              |             |
| Convention     | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white) |              |             |



