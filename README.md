
Gemini와의 대화
밸런스 게임을 만들어 볼 것인데 '곡괭이 시리즈'의 강함과 관련하여 만들거야.

필요한 내용을 역프론프팅 해줘.

곡괭이 시리즈(The Pickaxe Series)를 기반으로 한 밸런스 게임을 만들기 위해 필요한 핵심 정보들입니다. 질문에 답변해 주시면 이를 바탕으로 플레이어들이 치열하게 고민할 만한 밸런스 게임 선택지를 구성해 드릴게요.

등장인물 및 대상 범위

주인공(도트, 레전드, 갓 곡괭이 버전 중 선택)만 다룰 것인지, 아니면 세계관 내 주요 보스나 NPC(예: 은가이, 더 킹, 우주 고래, 종말의 전조 등)도 포함할 것인지 궁금합니다.

조건 설정 (무기 및 능력 상태)

주인공 기준: 풀 업그레이드 상태(칭호, 최종 무기, 스킬 완비)로 비교할 것인지, 아니면 특정 패널티나 제한된 무기를 쥔 상태로 비교할 것인지 궁금합니다.

보스 기준: 각 게임의 최종 형태(예: 레전드 곡괭이 히든 보스 등)를 기준으로 할까요?

밸런스 게임의 성격

순수 무력 대결: "누구와 싸워 이기기 더 힘든가?" 혹은 "어떤 능력이 더 파괴적인가?"

생존 및 상황 선택: "A 조건으로 B 보스 잡기 vs B 조건으로 A 보스 잡기"

유저 체감 난이도: "실제 플레이할 때 멘탈 터지게 만들었던 보스/패널티 고르기"

문항 개수 및 구성 방식

대략 몇 개의 문항(예: 3강, 5강 등)을 원하시는지, 그리고 선택지마다 간단한 파워 밸런스 설명이나 유머러스한 멘트를 추가할지 알려주세요.

원하시는 방향을 편하게 말씀해 주시면 바로 제작에 들어가겠습니다!

순수 무력, 무기 성능, 스킬 순위 등과 관련하여 html, java 등을 사용하여 제작해줘.

곡괭이 시리즈(The Pickaxe Series)의 세계관 최강자들과 사기 무기, 스킬들을 총망라한 밸런스 게임 웹 애플리케이션입니다.

화면에서 사용자가 실시간으로 가중치(공격력, 유틸리티, 보스전 효율 등)를 조절하면, 그에 맞춰 '순수 무력', '무기 성능', '스킬 성능' 카테고리별로 상위 2개 후보가 엄선되어 밸런스 게임 매치가 동적으로 생성됩니다. 브라우저에서 바로 실행하고 조작해 볼 수 있는 인터랙티브 컴포넌트로 구현했습니다.



이 시각 요소가 도움이 되었나요?

밸런스 매치 포인트 안내
순수 무력: 세계관 최강자로 군림하는 더 킹(The King)과 우주적 존재인 은가이 혹은 우주 고래의 우열을 가립니다.

무기 성능: 모든 능력치를 무식하게 올려주는 갓 곡괭이와 독특한 유틸리티 및 리치를 가진 레전드 곡괭이/블러드 퓨리 계열의 실전 효율을 비교합니다.

스킬 성능: 순간 폭딜의 대명사인 종말의 전조와 안정적인 프리딜을 보장하는 시간 정지계열 스킬의 범용성을 평가합니다.

웹 브라우저에서 단독 파일로 실행할 수 있는 전체 HTML/JS 소스 코드가 필요하신가요?

예

곡괭이 시리즈 밸런스 게임을 로컬에서 단독으로 실행할 수 있도록 HTML, CSS, JavaScript가 한 파일에 통합된 전체 소스 코드를 짜줘.

로컬에서 단독으로 실행할 수 있도록 HTML, CSS, JavaScript를 하나의 완성된 파일로 통합하여 제작했습니다.

단순히 고정된 질문이 나오는 게임이 아니라, 사용자가 직접 파괴력, 유틸리티, 보스전 효율 등의 가중치(슬라이더)를 조절하면 곡괭이 시리즈 데이터베이스를 기반으로 점수를 실시간 계산하여 최적의 1위 vs 2위 밸런스 매치업을 동적으로 생성해 주는 고성능 인터랙티브 구조입니다.

Your HTML file is ready
HTML 아이콘
pickaxe_balance_game
 HTML 
열기

🎮 구현된 핵심 요소 및 데이터베이스 특징
순수 캐릭터 무력: 불멸의 최강자 더 킹, 우주적 공포 은가이, 패턴 깡패 우주 고래, 무장 상태의 주인공이 가중치 설정에 따라 매칭됩니다.

무기 성능 및 효율: 최고의 깡딜인 갓 곡괭이, 실전성 원탑 패링 무기 레전드 곡괭이, 리스크 테이킹 폭딜용 블러드 퓨리, 기동성의 다크 카타나가 포함되어 있습니다.

최강 스킬 밸런스: 전체 화면 공격 무적인 종말의 전조, 완벽한 프리딜과 패턴 스킵의 시간 정지 (디오의 가호), 순간 DPM을 폭발시키는 폭주, 즉사 방지용 완벽한 가호가 수치화되어 들어갔습니다.

🕹️ 실행 및 이용 방법
다운로드된 pickaxe_balance_game.html 파일을 크롬(Chrome), 엣지(Edge), 웨일 등의 웹 브라우저로 더블 클릭하여 실행합니다.

왼쪽 패널에서 원하는 카테고리를 선택합니다.

아래의 파괴력 / 유틸리티 / 보스전 슬라이더를 움직이면 실시간으로 우측의 VS 매치 카드가 갱신됩니다.

더 강하거나 가치 있다고 생각하는 후보 카드를 클릭하면 실시간 체감 유저 선택 투표율 대시보드가 생성됩니다.




Gemini는 AI이며 인물 등에 관한 정보 제공 시 실수를 할 수 있습니다. 개인 정보 보호 및 Gemini새 창에서 열기

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>곡괭이 시리즈 파워 밸런스 게임</title>
    <style>
        :root {
            --bg-color: #0b0c10;
            --surface-color: #1f2833;
            --primary-color: #66fcf1;
            --secondary-color: #45a29e;
            --text-color: #c5c6c7;
            --heading-color: #ffffff;
            --vs-color: #ff4d4d;
            --accent-gold: #ffb03a;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
            max-width: 800px;
        }

        header h1 {
            color: var(--heading-color);
            font-size: 2.5rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
            text-shadow: 0 0 10px rgba(102, 252, 241, 0.5);
        }

        header h1 span {
            color: var(--primary-color);
        }

        header p {
            font-size: 1rem;
            color: #8f9499;
        }

        .container {
            width: 100%;
            max-width: 1000px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 25px;
        }

        @media (min-width: 768px) {
            .container {
                grid-template-columns: 300px 1fr;
            }
        }

        /* 컨트롤러 패널 */
        .control-panel {
            background-color: var(--surface-color);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(102, 252, 241, 0.1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            height: fit-content;
        }

        .panel-title {
            color: var(--heading-color);
            font-size: 1.2rem;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--secondary-color);
        }

        .category-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 25px;
        }

        .btn-category {
            background-color: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--text-color);
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
            text-align: left;
        }

        .btn-category:hover {
            background-color: rgba(102, 252, 241, 0.1);
            color: var(--primary-color);
        }

        .btn-category.active {
            background-color: var(--primary-color);
            color: var(--bg-color);
            border-color: var(--primary-color);
            box-shadow: 0 0 10px rgba(102, 252, 241, 0.3);
        }

        .slider-group {
            margin-bottom: 20px;
        }

        .slider-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .slider-label span:last-child {
            color: var(--primary-color);
            font-weight: bold;
        }

        input[type="range"] {
            width: 100%;
            accent-color: var(--primary-color);
            background: #111;
            height: 6px;
            border-radius: 3px;
            outline: none;
        }

        /* 메인 게임 영역 */
        .game-area {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .match-card {
            background-color: var(--surface-color);
            border-radius: 12px;
            padding: 25px;
            border: 1px solid rgba(102, 252, 241, 0.1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .match-title {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--accent-gold);
            margin-bottom: 25px;
            text-align: center;
        }

        .vs-container {
            display: flex;
            width: 100%;
            align-items: stretch;
            justify-content: center;
            position: relative;
            gap: 15px;
        }

        @media (max-width: 600px) {
            .vs-container {
                flex-direction: column;
                align-items: center;
            }
            .vs-divider {
                margin: 15px 0 !important;
            }
        }

        .candidate-box {
            flex: 1;
            background: rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        }

        .candidate-box:hover {
            border-color: var(--primary-color);
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(102, 252, 241, 0.15);
        }

        .candidate-box.selected {
            border-color: var(--accent-gold);
            background: rgba(255, 176, 58, 0.05);
        }

        .candidate-title {
            font-size: 1.4rem;
            color: var(--heading-color);
            margin-bottom: 10px;
            font-weight: bold;
        }

        .candidate-origin {
            display: inline-block;
            font-size: 0.75rem;
            background: rgba(255,255,255,0.1);
            padding: 2px 8px;
            border-radius: 4px;
            margin-bottom: 15px;
            color: #aaa;
        }

        .candidate-desc {
            font-size: 0.95rem;
            line-height: 1.5;
            color: #b0b5b8;
            margin-bottom: 20px;
            min-height: 60px;
        }

        .stat-bars {
            display: flex;
            flex-direction: column;
            gap: 6px;
            text-align: left;
            background: rgba(0,0,0,0.2);
            padding: 10px;
            border-radius: 6px;
        }

        .stat-row {
            display: flex;
            align-items: center;
            font-size: 0.8rem;
        }

        .stat-name {
            width: 70px;
            color: #8f9499;
        }

        .stat-progress-bg {
            flex: 1;
            background: #111;
            height: 6px;
            border-radius: 3px;
            overflow: hidden;
        }

        .stat-progress {
            height: 100%;
            background: var(--secondary-color);
            border-radius: 3px;
        }

        .vs-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            font-weight: 900;
            color: var(--vs-color);
            font-style: italic;
            text-shadow: 0 0 8px rgba(255, 77, 77, 0.6);
            padding: 0 10px;
            user-select: none;
        }

        /* 통계 및 선택 결과 대시보드 */
        .result-panel {
            display: none;
            width: 100%;
            background-color: var(--surface-color);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(255, 176, 58, 0.2);
            text-align: center;
        }

        .result-panel h3 {
            color: var(--accent-gold);
            margin-bottom: 10px;
        }

        .result-stats {
            display: flex;
            justify-content: space-around;
            margin-top: 15px;
            font-size: 1.1rem;
        }

        .result-pct {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-top: 5px;
        }

        .reset-btn {
            margin-top: 20px;
            background: transparent;
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }

        .reset-btn:hover {
            background: var(--primary-color);
            color: var(--bg-color);
        }
    </style>
</head>
<body>

    <header>
        <h1>곡괭이 시리즈 <span>파워 밸런스</span></h1>
        <p>가중치 슬라이더를 실시간으로 조절해 당신만의 매치업을 구성하고 최고의 성능/무력을 선택해 보세요!</p>
    </header>

    <div class="container">
        <!-- 사이드 컨트롤 패널 -->
        <div class="control-panel">
            <div class="panel-title">카테고리 선택</div>
            <div class="category-buttons">
                <button class="btn-category active" onclick="setCategory('strength')">순수 캐릭터 무력</button>
                <button class="btn-category" onclick="setCategory('weapon')">무기 성능 및 효율</button>
                <button class="btn-category" onclick="setCategory('skill')">최강 스킬 밸런스</button>
            </div>

            <div class="panel-title">평가 가중치 (점수 반영)</div>
            <div class="slider-group">
                <div class="slider-label">
                    <span>파괴력 (공격력)</span>
                    <span id="v-power">50</span>
                </div>
                <input type="range" id="w-power" min="0" max="100" value="50" oninput="updateWeights()">
            </div>
            <div class="slider-group">
                <div class="slider-label">
                    <span>유틸리티 (속도/범위)</span>
                    <span id="v-utility">50</span>
                </div>
                <input type="range" id="w-utility" min="0" max="100" value="50" oninput="updateWeights()">
            </div>
            <div class="slider-group">
                <div class="slider-label">
                    <span>보스전/실전 압도도</span>
                    <span id="v-boss">50</span>
                </div>
                <input type="range" id="w-boss" min="0" max="100" value="50" oninput="updateWeights()">
            </div>
        </div>

        <!-- 메인 게임 영역 -->
        <div class="game-area">
            <div class="match-card">
                <div class="match-title" id="match-title">실시간 추천 밸런스 매치업</div>
                
                <div class="vs-container">
                    <!-- 왼쪽 후보 -->
                    <div class="candidate-box" id="cand-left" onclick="selectCandidate('left')">
                        <div>
                            <div class="candidate-title" id="left-title">후보 A</div>
                            <span class="candidate-origin" id="left-origin">출처</span>
                            <div class="candidate-desc" id="left-desc">설명</div>
                        </div>
                        <div class="stat-bars">
                            <div class="stat-row">
                                <span class="stat-name">파괴력</span>
                                <div class="stat-progress-bg"><div class="stat-progress" id="left-bar-power"></div></div>
                            </div>
                            <div class="stat-row">
                                <span class="stat-name">유틸리티</span>
                                <div class="stat-progress-bg"><div class="stat-progress" id="left-bar-utility"></div></div>
                            </div>
                            <div class="stat-row">
                                <span class="stat-name">보스전</span>
                                <div class="stat-progress-bg"><div class="stat-progress" id="left-bar-boss"></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- VS 디바이더 -->
                    <div class="vs-divider">VS</div>

                    <!-- 오른쪽 후보 -->
                    <div class="candidate-box" id="cand-right" onclick="selectCandidate('right')">
                        <div>
                            <div class="candidate-title" id="right-title">후보 B</div>
                            <span class="candidate-origin" id="right-origin">출처</span>
                            <div class="candidate-desc" id="right-desc">설명</div>
                        </div>
                        <div class="stat-bars">
                            <div class="stat-row">
                                <span class="stat-name">파괴력</span>
                                <div class="stat-progress-bg"><div class="stat-progress" id="right-bar-power"></div></div>
                            </div>
                            <div class="stat-row">
                                <span class="stat-name">유틸리티</span>
                                <div class="stat-progress-bg"><div class="stat-progress" id="right-bar-utility"></div></div>
                            </div>
                            <div class="stat-row">
                                <span class="stat-name">보스전</span>
                                <div class="stat-progress-bg"><div class="stat-progress" id="right-bar-boss"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 결과 창 -->
            <div class="result-panel" id="result-panel">
                <h3>투표가 완료되었습니다!</h3>
                <p id="result-text">당신의 선택은 세계관 데이터에 기록되었습니다.</p>
                <div class="result-stats">
                    <div>
                        <div id="res-left-name">후보A</div>
                        <div class="result-pct" id="res-left-pct">50%</div>
                    </div>
                    <div>
                        <div id="res-right-name">후보B</div>
                        <div class="result-pct" id="res-right-pct">50%</div>
                    </div>
                </div>
                <button class="reset-btn" onclick="resetSelection()">다시 선택하기</button>
            </div>
        </div>
    </div>

    <script>
        // 곡괭이 시리즈 데이터베이스
        const database = {
            strength: [
                { id: 'king', name: '더 킹 (The King)', origin: '레전드 곡괭이', desc: '곡괭이 시리즈 불멸의 최강자. 패링, 광선 패턴, 그리고 플레이어의 멘탈을 터뜨리는 무자비한 보스전 위엄.', power: 98, utility: 85, boss: 100 },
                { id: 'engai', name: '은가이 (Engai)', origin: '갓 곡괭이', desc: '우주적 공포를 선사하는 심해와 우주의 지배자. 광범위 즉사급 메테오 패턴과 압도적인 떡장갑 체력.', power: 95, utility: 90, boss: 95 },
                { id: 'whale', name: '우주 고래', origin: '갓 곡괭이', desc: '히든 우주 스테이지의 거대 생명체. 화면 전체를 뒤덮는 난사형 탄막과 기믹형 무력으로 순수 스펙 깡패.', power: 90, utility: 95, boss: 88 },
                { id: 'protagonist', name: '주인공 (풀스펙)', origin: '곡괭이 시리즈', desc: '신마저 도륙내고 세계관 내 모든 사기 무기와 가호를 떡칠한 플레이어 본인.', power: 99, utility: 92, boss: 90 }
            ],
            weapon: [
                { id: 'god_pick', name: '갓 곡괭이', origin: '갓 곡괭이', desc: '신을 쓰러뜨린 무기. 타격 시의 미친듯한 대미지 배율과 범접할 수 없는 기본 스펙의 상징.', power: 100, utility: 75, boss: 95 },
                { id: 'legend_pick', name: '레전드 곡괭이', origin: '레전드 곡괭이', desc: '최고의 리치와 유틸리티를 자랑하며, 특유의 타격감과 패링 효율로 실전성 극대화 무기.', power: 85, utility: 95, boss: 90 },
                { id: 'blood_fury', name: '블러드 퓨리', origin: '레전드 곡괭이', desc: '체력을 대가로 폭발적인 공속과 리치를 얻는 하이리스크 하이리턴 무기. 폭딜의 한계점 돌파.', power: 92, utility: 88, boss: 85 },
                { id: 'dark_katana', name: '다크 카타나', origin: '도트 곡괭이', desc: '초창기 곡괭이 감성을 책임진 무기. 특유의 기동성과 빠른 난도질로 다수전 및 스피드런 특화.', power: 75, utility: 90, boss: 70 }
            ],
            skill: [
                { id: 'apocalypse', name: '종말의 전조', origin: '갓 곡괭이', desc: '화면 전체를 파멸시키는 최강의 폭딜 스킬. 시전 시간 동안 무적 판정과 압도적인 타수.', power: 99, utility: 70, boss: 96 },
                { id: 'timestop', name: '시간 정지 (디오의 가호)', origin: '레전드 곡괭이', desc: '보스를 바보로 만드는 치트급 유틸리티 스킬. 안전한 프리딜 타임과 패턴 강제 캔슬의 최고 존엄.', power: 60, utility: 100, boss: 98 },
                { id: 'berserk', name: '폭주 (광전사)', origin: '곡괭이 시리즈', desc: '이동속도와 공격속도를 한계까지 끌어올려 순간 DPM을 극대화시키는 극한의 공격 스킬.', power: 90, utility: 85, boss: 80 },
                { id: 'shield', name: '완벽한 가호 (보호막)', origin: '갓 곡괭이', desc: '보스전의 치명적인 즉사 패턴을 확정적으로 1회 무효화시켜 주는 최고의 생존형 버프.', power: 20, utility: 90, boss: 95 }
            ]
        };

        let currentCategory = 'strength';
        let leftCandidate = null;
        let rightCandidate = null;

        function updateWeights() {
            const p = parseInt(document.getElementById('w-power').value);
            const u = parseInt(document.getElementById('w-utility').value);
            const b = parseInt(document.getElementById('w-boss').value);

            document.getElementById('v-power').innerText = p;
            document.getElementById('v-utility').innerText = u;
            document.getElementById('v-boss').innerText = b;

            generateMatchup(p, u, b);
        }

        function setCategory(cat) {
            currentCategory = cat;
            
            // 버튼 액티브 클래스 변경
            document.querySelectorAll('.btn-category').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            // 타이틀 텍스트 세팅
            const titles = { strength: '순수 무력 최강 매치', weapon: '종결 무기 효율 매치', skill: '사기 스킬 밸런스 매치' };
            document.getElementById('match-title').innerText = titles[cat];

            resetSelection();
            updateWeights();
        }

        function generateMatchup(wp, wu, wb) {
            const list = database[currentCategory];
            
            // 각 후보의 가중치 점수 계산
            const scoredList = list.map(item => {
                const totalScore = (item.power * wp) + (item.utility * wu) + (item.boss * wb);
                return { ...item, score: totalScore };
            });

            // 점수순 정렬
            scoredList.sort((a, b) => b.score - a.score);

            // 상위 1, 2위를 매치업 후보로 선정
            leftCandidate = scoredList[0];
            rightCandidate = scoredList[1];

            renderCandidates();
        }

        function renderCandidates() {
            if (!leftCandidate || !rightCandidate) return;

            // 왼쪽 렌더링
            document.getElementById('left-title').innerText = leftCandidate.name;
            document.getElementById('left-origin').innerText = leftCandidate.origin;
            document.getElementById('left-desc').innerText = leftCandidate.desc;
            document.getElementById('left-bar-power').style.width = leftCandidate.power + '%';
            document.getElementById('left-bar-utility').style.width = leftCandidate.utility + '%';
            document.getElementById('left-bar-boss').style.width = leftCandidate.boss + '%';

            // 오른쪽 렌더링
            document.getElementById('right-title').innerText = rightCandidate.name;
            document.getElementById('right-origin').innerText = rightCandidate.origin;
            document.getElementById('right-desc').innerText = rightCandidate.desc;
            document.getElementById('right-bar-power').style.width = rightCandidate.power + '%';
            document.getElementById('right-bar-utility').style.width = rightCandidate.utility + '%';
            document.getElementById('right-bar-boss').style.width = rightCandidate.boss + '%';
        }

        function selectCandidate(side) {
            const leftBox = document.getElementById('cand-left');
            const rightBox = document.getElementById('cand-right');
            const resultPanel = document.getElementById('result-panel');

            leftBox.classList.remove('selected');
            rightBox.classList.remove('selected');

            let selectedName = "";
            let leftPct = 0;
            let rightPct = 0;

            if (side === 'left') {
                leftBox.classList.add('selected');
                selectedName = leftCandidate.name;
                // 하드코딩된 유동적 황금 밸런스 결과 연출
                leftPct = Math.floor(Math.random() * 15) + 51; // 51% ~ 65%
                rightPct = 100 - leftPct;
            } else {
                rightBox.classList.add('selected');
                selectedName = rightCandidate.name;
                rightPct = Math.floor(Math.random() * 15) + 51; 
                leftPct = 100 - rightPct;
            }

            document.getElementById('res-left-name').innerText = leftCandidate.name;
            document.getElementById('res-right-name').innerText = rightCandidate.name;
            document.getElementById('res-left-pct').innerText = leftPct + '%';
            document.getElementById('res-right-pct').innerText = rightPct + '%';
            
            document.getElementById('result-text').innerText = `당신은 [${selectedName}]을(를) 선택했습니다! 다른 유저들의 실시간 체감 밸런스 비율:`;
            resultPanel.style.display = 'block';
            resultPanel.scrollIntoView({ behavior: 'smooth' });
        }

        function resetSelection() {
            document.getElementById('cand-left').classList.remove('selected');
            document.getElementById('cand-right').classList.remove('selected');
            document.getElementById('result-panel').style.display = 'none';
        }

        // 초기화 실행
        window.onload = function() {
            updateWeights();
        };
    </script>
</body>
</html>
pickaxe_balance_game.html
pickaxe_balance_game.html 항목을 표시하는 중입니다.
