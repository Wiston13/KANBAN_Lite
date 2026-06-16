# Kanban Filter Feature Status

## Current Status

目前篩選功能已經有雛形，但還沒有完成到可以穩定承接 CRUD、拖曳與重新渲染流程的狀態。

目前支援的篩選方向：
- 根據任務截止狀態篩選：`overdue`、`due-soon`、`normal`、`no-date`
- 根據 priority 篩選：`high`、`medium`、`low`
- 根據 tag 篩選：tag checkbox 目前由 `appendTagsToFilter(tasks)` 依照現有 tasks 動態產生

目前實際程式狀態：
- `index.html` 在三個 column 各自放了一組 `.column-filter-panel`
- `renderTasks()` 會清空全部 `.task-list`，從 `localStorage` 讀出全部 tasks，依照 task status 全部渲染，最後呼叫 `appendTagsToFilter(tasks)`
- `appendTagsToFilter(tasks)` 會清空所有 `.filter-tag-options`，再依照全部 tasks 的 tag 重新產生 checkbox
- checkbox click 時，程式會讀取目前 column 中所有 checked checkbox，建立暫時的 `checkedFilterMap`，再重新渲染目前 column
- 清除篩選按鈕目前會取消目前 column 的 checkbox checked 狀態，並手動重畫目前 column 的所有 tasks
- 新增 / 編輯 / 刪除 / 清除全部 / reset demo data / 拖曳任務後，都會呼叫 `refreshUI()`
- `refreshUI()` 目前只呼叫 `renderTasks()` 與 `dashboard.renderDashboard()`
- Dashboard 目前維持統計全部 tasks，沒有套用 board filter

## Known Problems

1. 篩選狀態沒有被保存成獨立 state，目前仍然依賴 DOM checkbox checked 狀態。
2. 篩選功能只在 checkbox click 當下重算目前 column，沒有整合進 `renderTasks()` / `refreshUI()`。
3. `renderTasks()` 每次都會重新產生 tag checkbox，會導致 tag checkbox 的 checked 狀態遺失。
4. 任務拖曳後會呼叫 `refreshUI()`，因此目前任何已套用的篩選畫面都會被重置。
5. 新增 / 編輯 / 刪除任務後同樣會呼叫 `refreshUI()`，目前篩選結果不會被保留。
6. 清除篩選按鈕有一段獨立的「重畫目前 column」邏輯，和 checkbox click 篩選邏輯、`renderTasks()` 邏輯重複。
7. 清除篩選目前只清 DOM checked 狀態，未來加入 `filterState` 後需要同步清除 state。
8. checkbox handler 使用 `click` 事件；建議改用 `change`，語意較準確，也比較適合鍵盤操作與程式同步 checked 狀態。
9. checkbox handler 會先把所有符合篩選條件的 tasks 推進 `currentTasks`，最後 append 時才判斷 status；建議先依 column status 限縮資料，讓 function 責任更清楚。
10. `appendTagsToFilter(tasks)` 會把所有 tag options 一次 append 到全部 `.filter-tag-options`，目前可以運作，但責任不夠清楚，後續若要支援每欄不同可用 tag 會變得難維護。
11. 動態 tag label 目前使用 `.append(\` ${tag}\`)` 插入使用者可輸入的 tag，可能讓 tag 被當成 HTML 注入；應改用 `.text()` 或 `document.createTextNode()`。
12. tag options 目前沒有排序，checkbox 順序會跟 tasks 出現順序綁在一起，新增或 reset 後可能讓 UI 順序不穩定。
13. 沒有 filter active indicator，使用者不容易知道某一欄目前是否套用了篩選。
14. 篩選後若某一欄沒有任務，目前沒有 empty state，使用者可能分不清楚是沒有任務還是被條件篩掉。
15. 目前沒有明確定義 filter state 是否需要跨頁面重新整理保存；建議先完成 in-memory state，再評估是否存入 `localStorage`。
16. Dashboard 是否受篩選影響尚未在程式命名上說清楚；目前行為是統計全部 tasks，這個方向可以保留，但應明確標示。
17. `getDueStatus()` 沒有處理 invalid date；若舊資料或非預期資料出現不合法日期，分類可能不穩定。
18. filter 相關程式碼目前放在全域事件區塊，尚未和既有 `taskModal`、`confirmPopover`、`dashboard` object/module 風格一致。

## Related Functions

- `refreshUI()`
- `renderTasks()`
- `createTaskCard(task)`
- `getDueStatus(dueDate)`
- `taskModal.bindEvents()`
- `confirmPopover.actionMap`
- `confirmPopover.confirm()`
- `dragAndDrop.bindEvents()`
- `dashboard.calculateDashboardStats(tasks)`
- `dashboard.renderDashboard()`
- `appendTagsToFilter(tasks)`
- `.column-filter-btn` click handler
- `.clear-column-filter-btn` click handler
- `.column-filter-panel` delegated checkbox click handler

目前尚未存在，但建議補上的 function / state：
- `filterState`
- `createDefaultFilterState()`
- `renderBoard()`
- `applyFilters(tasks, filterState)`
- `applyColumnFilters(tasks, columnStatus, columnFilterState)`
- `renderFilterOptions(tasks, filterState)`
- `syncFilterControls(filterState)`
- `updateFilterStateFromInput(inputElement)`
- `clearColumnFilter(columnStatus)`
- `hasActiveColumnFilter(columnFilterState)`

## Next Refactor Direction

1. 保留 `localStorage` 內的 tasks 作為唯一任務資料來源。
2. 新增獨立的 `filterState`，不要讓 DOM checkbox checked 狀態成為資料來源。
3. 依照目前 UI，先採用「每個 column 獨立篩選」：

```js
const filterState = {
    todo: {
        dueStatus: [],
        priority: [],
        tag: []
    },
    inprogress: {
        dueStatus: [],
        priority: [],
        tag: []
    },
    done: {
        dueStatus: [],
        priority: [],
        tag: []
    }
};
```

4. 建立統一 board render flow：

```text
loadTasksFromLocalStorage()
-> renderFilterOptions(tasks, filterState)
-> applyFilters(tasks, filterState)
-> renderTasks(filteredTasks)
-> dashboard.renderDashboard()
```

5. 將 `renderTasks()` 改成只負責渲染傳入的 tasks，不要在裡面讀 `localStorage`，也不要在裡面產生 filter options。

```js
function renderTasks(tasksToRender) {
    $(".task-list").empty();

    $.each(tasksToRender, function (index, task) {
        $("#" + task.status + "-list").append(createTaskCard(task));
    });
}
```

6. 將目前 checkbox click handler 中的篩選判斷抽成純 function。
7. 將 `appendTagsToFilter(tasks)` 改名或拆成 `renderFilterOptions(tasks, filterState)`，並在產生 checkbox 時依照 `filterState` 還原 checked 狀態。
8. 產生 tag label 時使用安全文字插入，避免 `.append(string)` 直接吃使用者輸入。
9. `refreshUI()` 改成呼叫 `renderBoard()` 與 `dashboard.renderDashboard()`。
10. checkbox 改綁 `change`，只更新 `filterState`，再呼叫 `refreshUI()`。
11. 清除篩選時清掉該 column 的 `filterState`，同步 checkbox，然後走同一條 `refreshUI()` 流程。
12. 新增 / 編輯 / 刪除 / 拖曳後，只更新 tasks，再呼叫 `refreshUI()`，讓目前篩選條件自然生效。
13. Dashboard 建議維持統計全部 tasks；如果未來要支援「篩選後統計」，應另外命名，不要混在 board render flow 裡。

## Suggested Implementation Checklist

### P0 - Complete Core Filter Flow

- [ ] 新增 `filterState`，以 status 分成 `todo`、`inprogress`、`done`。
- [ ] 新增 `applyColumnFilters(tasks, columnStatus, columnFilterState)`。
- [ ] 新增 `applyFilters(tasks, filterState)`，回傳所有欄位套用篩選後的 tasks。
- [ ] 修改 `renderTasks(tasksToRender)`，不要在 function 內自行讀 `localStorage`。
- [ ] 將 `appendTagsToFilter(tasks)` 從 `renderTasks()` 中移出。
- [ ] 新增 `renderBoard()`，集中處理 load tasks、render filter options、apply filters、render tasks。
- [ ] 修改 `refreshUI()`，讓所有 task list 更新都走同一條 board render flow。
- [ ] 將 checkbox event 從 `click` 改成 `change`。
- [ ] checkbox change 時更新 `filterState`，不要直接手動操作 task list DOM。
- [ ] 修改清除篩選按鈕，讓它清除 state 後呼叫 `refreshUI()`。

### P1 - Make Filter Robust

- [ ] 產生 tag checkbox 時，根據 `filterState` 保留 checked 狀態。
- [ ] tag label 改用 `.text()` 或 `document.createTextNode()` 插入，避免 HTML injection。
- [ ] tag options 排序，例如依字母排序，讓 UI 順序穩定。
- [ ] 決定 tag options 是全 board 共用，還是每個 column 只顯示該 column 內存在的 tags。
- [ ] 定義拖曳後的顯示規則：任務移到新欄位後，依新欄位的 filterState 決定是否顯示。
- [ ] 新增 filter empty state，例如「沒有符合條件的任務」。
- [ ] 替 filter button 加上 active 狀態，讓使用者知道該欄目前有套用篩選。
- [ ] 處理 invalid dueDate，避免 `getDueStatus()` 對異常資料產生不可預期分類。

### P2 - Cleanup After Filter Works

- [ ] 將 filter 相關程式碼整理成 `boardFilter` 或 `taskBoard` object，和既有 object/module 風格一致。
- [ ] 消除 checkbox handler、clear handler、`renderTasks()` 之間重複的 render 邏輯。
- [ ] 明確命名 Dashboard 統計語意，例如維持「全部任務統計」。
- [ ] 評估是否要將 `filterState` 存到 `localStorage`，讓重新整理頁面後仍保留篩選。
- [ ] 補一份手動測試清單或簡單測試腳本，涵蓋新增、編輯、刪除、拖曳、reset 與 filter 組合。

## Manual Test Scenarios

1. 勾選 To Do 欄位的 `priority = high`，只有 To Do 的 high 任務顯示，其他欄位不受影響。
2. 勾選 In Progress 欄位的多個 due status，確認同類型條件是 OR。
3. 同時勾選 due status、priority、tag，確認不同類型條件是 AND。
4. 勾選 tag filter 後，新增一個符合目前 filter 的任務，儲存後應出現在列表。
5. 勾選 tag filter 後，新增一個不符合目前 filter 的任務，儲存後不應出現在列表，但資料仍存在。
6. 編輯任務讓它不再符合目前 filter，儲存後應從目前欄位消失。
7. 刪除任務後，目前 filter checkbox 勾選狀態應保留。
8. 拖曳任務到另一欄後，依目標欄位 filter 決定是否顯示。
9. 清除單一欄位 filter，只影響該欄，不影響其他欄位 filter。
10. reset demo data 後，確認 filterState 要保留或清除；實作前需先決定規則。
11. 新增 tag 值為 `<img src=x onerror=alert(1)>` 的任務，tag filter panel 應只顯示純文字，不應執行 HTML。

## Resume Point

下次回來時，先檢查：

1. `filterState` 是否存在，且是否是 filter 的唯一資料來源。
2. `renderTasks()` 是否已改成只接收 tasks 並負責渲染。
3. `appendTagsToFilter()` 是否已改成安全、可保留 checked 狀態的 filter option render function。
4. checkbox change 是否只更新 state，再走 `refreshUI()` / `renderBoard()`。
5. 新增 / 編輯 / 刪除 / 拖曳後是否都會重新套用目前 `filterState`。
6. tag checkbox 動態產生時是否會從 `filterState` 還原 checked 狀態。
7. 清除篩選是否已移除手動重畫 column 的分支，改走同一條 render flow。
8. 使用者輸入的 tag 是否不會透過 filter panel 被當成 HTML 插入。
9. Dashboard 是否明確維持統計全部 tasks，而不是被 board filter 影響。
