# KANBAN Lite

KANBAN Lite 是一個使用 **HTML、CSS、JavaScript** 製作的小型任務流程管理工具。
作品以 Kanban 看板為核心，讓使用者可以透過 **To Do、In Progress、Done** 三個欄位管理任務狀態，並搭配 Dashboard 查看任務統計與進度。

---

## 專案介紹

本專案是一個純前端的 Kanban 任務管理系統，主要功能包含任務新增、編輯、刪除、拖曳狀態切換，以及任務統計總覽。

使用者可以建立任務卡片，並為每個任務設定：

* 任務標題
* 任務描述
* 優先度
* 標籤
* 任務狀態
* 截止日期

任務資料會儲存在瀏覽器的 `localStorage` 中，因此重新整理頁面後仍可保留資料。

---

## 主要功能

### Dashboard 總覽

Dashboard 頁面提供任務整體狀態統計，包含：

* 任務總數
* To Do / In Progress / Done 各狀態數量
* 任務完成率
* 未完成任務的截止日期統計
* 未完成任務的優先度統計
* 高優先度任務列表

---

### Kanban 看板

My Board 頁面以三欄式看板呈現任務：

* To Do
* In Progress
* Done

使用者可以透過拖曳任務卡片，快速調整任務目前的進度狀態。

---

### 任務管理

系統支援基本 CRUD 操作：

* 新增任務
* 編輯任務
* 刪除任務
* 修改任務狀態
* 設定優先度與標籤
* 設定截止日期

---

### 資料管理

Settings 頁面提供資料管理功能：

* 清除所有任務資料
* 重置範例資料

方便測試與展示時快速恢復預設狀態。

---

## 使用技術

* HTML
* CSS
* JavaScript
* jQuery
* localStorage
* Git / GitHub

---

## 專案結構

```text
KANBAN-Lite/
├── index.html
├── style.css
├── script.js
├── img/
│   ├── avatar.png
│   └── logo.ico
└── README.md
```

---

## 專案定位

KANBAN Lite 目前是一個純前端任務管理系統原型，主要用來展示前端頁面互動、DOM 操作、資料儲存、拖曳操作與 Dashboard 統計等功能。
