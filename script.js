$(document).ready(() => {
    // 側邊欄切換頁面
    $(".sidebar-object").on("click", function (e) {
        // 阻止預設行為，不然點擊時瀏覽器可能會跳到頁面頂部，或讓網址多一個 #
        e.preventDefault();

        $(".sidebar-object").removeClass("active");
        $(".page-section").removeClass("active");

        $(this).addClass("active");

        const targetPageId = $(this).data("page-section");
        $("#" + targetPageId).addClass("active");
    })

    refreshUI();
    dragAndDrop.init();
    taskModal.init();
    confirmPopover.init();
})

function dynamicDate(daysOffset) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const yy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yy}-${mm}-${dd}`;
}

let tasks = [
    {
        id: 1,
        title: "修復登入頁面 500 錯誤",
        content: "第三方登入偶爾回傳 500，需要確認 API 回應與錯誤處理流程",
        priority: "high",
        tag: "bug",
        status: "todo",
        dueDate: dynamicDate(-2)
    },
    {
        id: 2,
        title: "今日完成專題簡報初稿",
        content: "整理功能亮點、技術架構、操作流程與未來展望",
        priority: "high",
        tag: "presentation",
        status: "inprogress",
        dueDate: dynamicDate(0)
    },
    {
        id: 3,
        title: "補上任務截止日期功能測試",
        content: "測試新增、編輯、清空日期、重置範例資料後是否正確顯示",
        priority: "high",
        tag: "qa",
        status: "todo",
        dueDate: dynamicDate(1)
    },
    {
        id: 4,
        title: "調整 Dashboard due date 統計",
        content: "確認今日到期、即將到期、尚未到期、無截止日期的統計數字",
        priority: "medium",
        tag: "dashboard",
        status: "inprogress",
        dueDate: dynamicDate(2)
    },
    {
        id: 5,
        title: "重構 Dashboard 統計邏輯",
        content: "將重複 filter 的統計方法整理成更集中的 stats function",
        priority: "medium",
        tag: "refactor",
        status: "todo",
        dueDate: dynamicDate(3)
    },
    {
        id: 6,
        title: "完成表單欄位樣式微調",
        content: "檢查 date input、select、textarea 在 modal 中的間距是否一致",
        priority: "low",
        tag: "ui",
        status: "todo",
        dueDate: dynamicDate(5)
    },
    {
        id: 7,
        title: "整理 README 操作說明",
        content: "補充如何新增任務、拖曳任務、清除資料、重置範例資料",
        priority: "medium",
        tag: "docs",
        status: "todo",
        dueDate: dynamicDate(7)
    },
    {
        id: 8,
        title: "設計篩選功能草稿",
        content: "先規劃 priority、tag、keyword search 的資料流，不急著實作",
        priority: "low",
        tag: "feature",
        status: "todo",
        dueDate: dynamicDate(14)
    },
    {
        id: 9,
        title: "檢查拖曳任務後 Dashboard 是否同步",
        content: "把任務從 todo 拖到 done，確認完成率與各統計數字正確更新",
        priority: "high",
        tag: "qa",
        status: "inprogress",
        dueDate: dynamicDate(4)
    },
    {
        id: 10,
        title: "無截止日期的高優先任務",
        content: "用來測試 Priority Focus 排序時，無日期任務是否排在最後",
        priority: "high",
        tag: "test",
        status: "todo",
        dueDate: ""
    },
    {
        id: 11,
        title: "普通無截止日期任務",
        content: "測試 task card 是否顯示「無截止日期」，dashboard 是否計入 no-date",
        priority: "medium",
        tag: "test",
        status: "inprogress",
        dueDate: ""
    },
    {
        id: 12,
        title: "低優先度無截止日期任務",
        content: "測試 low priority 且無截止日期的未完成任務統計",
        priority: "low",
        tag: "test",
        status: "todo",
        dueDate: ""
    },
    {
        id: 13,
        title: "已完成但逾期的任務",
        content: "這筆任務已完成，所以不應該被算進未完成任務截止日期統計",
        priority: "high",
        tag: "done",
        status: "done",
        dueDate: dynamicDate(-5)
    },
    {
        id: 14,
        title: "已完成且今日到期的任務",
        content: "測試 done 任務即使 dueDate 是今天，也不應進入未完成截止統計",
        priority: "medium",
        tag: "done",
        status: "done",
        dueDate: dynamicDate(0)
    },
    {
        id: 15,
        title: "已完成且無截止日期任務",
        content: "測試 done + no-date 不應影響未完成任務的 no-date 統計",
        priority: "low",
        tag: "done",
        status: "done",
        dueDate: ""
    },
    {
        id: 16,
        title: "優化 task card 文字截斷",
        content: "這是一段比較長的描述，用來測試 task card content 是否可以正常兩行截斷，不會把卡片高度撐爆或破壞排版",
        priority: "medium",
        tag: "ui",
        status: "todo",
        dueDate: dynamicDate(10)
    },
    {
        id: 17,
        title: "<h1>XSS 測試標題</h1>",
        content: "<script>alert('test')</script> 這段應該被當作純文字顯示，而不是被瀏覽器執行",
        priority: "high",
        tag: "security",
        status: "todo",
        dueDate: dynamicDate(2)
    },
    {
        id: 18,
        title: "確認 reset demo data 行為",
        content: "清除所有資料後，再按重置範例資料，應該恢復這組測試資料",
        priority: "medium",
        tag: "settings",
        status: "todo",
        dueDate: dynamicDate(6)
    }
];

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks === null) {
        saveTasksToLocalStorage([]);
        return [];
    }

    return JSON.parse(savedTasks);
}

function refreshUI() {
    renderTasks();
    dashboard.renderDashboard();
}

function renderTasks() {
    $(".task-list").empty();

    const tasks = loadTasksFromLocalStorage();
    $.each(tasks, function (index, element) {
        $("#" + element.status + "-list").append(createTaskCard(element));
    })
}

//防止XSS
function createTaskCard(task) {
    const divTaskCard = $("<div></div>").addClass("task-card").data("id", task.id).attr("draggable", true);
    const divTaskCardTitle = $("<div></div>").addClass("task-card-title").text(task.title);
    const divTaskCardContent = $("<div></div>").addClass("task-card-content").text(task.content);
    const divTaskCardPriority = $("<div></div>").addClass("task-card-priority").addClass("priority-" + task.priority).text(task.priority);
    const divTaskCardTags = $("<div></div>").addClass("task-card-tags");
    const spanTaskCardTag = $("<span></span>").addClass("task-card-tag").text(task.tag);
    const divTaskDueDate = $("<div></div>").addClass("task-due-date").addClass(getDueStatus(task.dueDate)).text((task.dueDate) ? task.dueDate : "無截止日期");

    divTaskCardTags.append(spanTaskCardTag);
    divTaskCard.append(divTaskCardTitle, divTaskCardContent, divTaskCardPriority, divTaskCardTags, divTaskDueDate);

    return divTaskCard;
}

function getDueStatus(dueDate) {
    if (!dueDate) {
        return "no-date";
    }
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const date2 = Date.parse(dueDate);
    const diffTime = date2 - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return "overdue";
    } else if (diffDays <= 3) {
        return "due-soon";
    } else {
        return "normal";
    }
}

let editingTaskId = -1;

// Task Modal
const taskModal = {

    fieldsMap: {
        "title": "#task-title-input",
        "content": "#task-description-input",
        "tag": "#task-tag-input",
        "priority": "#task-priority-input",
        "status": "#task-status-input",
        "dueDate": "#due-date-input"
    },

    defaultFormValues: {
        title: "",
        content: "",
        tag: "",
        priority: "medium",
        status: "todo",
        dueDate: ""
    },

    setFormValues(data) {
        $.each(data, (index, element) => {
            if (!(index in this.fieldsMap)) {
                return;
            }
            $(this.fieldsMap[index]).val(element);
        })
    },

    getTaskFromForm() {
        const task = {
            "id": (editingTaskId < 0) ? new Date().getTime() : editingTaskId
        };
        $.each(this.fieldsMap, (index, element) => {
            task[index] = $(element).val().trim();
        })
        if (!task.tag) {
            task.tag = "general";
        }
        return task;
    },

    reset() {
        editingTaskId = -1;
        $(".task-modal-header h2").text("新增任務");
        $("#delete-task-btn").hide();

        this.setFormValues(this.defaultFormValues);
    },

    open() {
        $(".task-modal").addClass("active");
    },

    close() {
        this.reset();
        $(".task-modal").removeClass("active");
    },

    bindEvents() {
        $("#add-task-btn").on("click", () => {
            this.reset();
            this.open();
        });

        $("#close-modal-btn").on("click", () => {
            this.close();
        })

        $("#task-modal").on("click", function (e) {
            if (e.target === this) {
                taskModal.close();
            }
        })

        $(document).on("click", ".task-card", function () {
            const taskId = Number($(this).data("id"));
            const tasks = loadTasksFromLocalStorage();
            const task = tasks.find(item => item.id === taskId);
            if (!task) {
                return;
            }
            editingTaskId = taskId;

            taskModal.setFormValues(task);

            $(".task-modal-header h2").text("編輯任務");
            $("#delete-task-btn").show();

            taskModal.open();
        })

        $("#task-form").on("submit", function (e) {
            e.preventDefault();
            const tasks = loadTasksFromLocalStorage();
            const task = taskModal.getTaskFromForm();

            if (editingTaskId < 0) {
                tasks.push(task);
            } else {
                const tasksIndex = tasks.findIndex(item => item.id === editingTaskId);
                if (tasksIndex === -1) {
                    alert("發生錯誤，請重試一次!");
                    return;
                }
                tasks.splice(tasksIndex, 1, task);
            }
            saveTasksToLocalStorage(tasks);
            refreshUI();
            taskModal.close();
        })
    },

    init() {
        this.bindEvents();
    }
};

// Confirm Popover
const confirmPopover = {
    popoverElement: $("#confirm-popover")[0],

    currentAction: "",

    actionMap: {
        "clear-task": () => {
            saveTasksToLocalStorage([]);
            return true;
        },

        "reset-task": () => {
            saveTasksToLocalStorage(tasks);
            return true;
        },

        "delete-task": () => {
            if (editingTaskId < 0) {
                return false;
            }
            const tasks = loadTasksFromLocalStorage();
            const tasksIndex = tasks.findIndex(item => item.id === editingTaskId);

            if (tasksIndex === -1) {
                alert("發生錯誤，請重試一次!");
                return false;
            }
            tasks.splice(tasksIndex, 1);
            saveTasksToLocalStorage(tasks);
            taskModal.close();
            return true;
        }
    },

    open(action, msg) {
        this.currentAction = action;
        $("#confirm-popover-message").text(msg);
        this.popoverElement.showPopover();
    },

    confirm() {
        const action = this.actionMap[this.currentAction];
        if (!action) {
            return;
        }
        const result = action();
        if (!result) {
            return;
        }
        refreshUI();
        this.popoverElement.hidePopover();
        this.currentAction = "";
    },

    cancel() {
        this.popoverElement.hidePopover();
        this.currentAction = "";
    },

    bindEvents() {
        $("#delete-task-btn").on("click", () => {
            if (editingTaskId < 0) {
                return;
            }
            this.open("delete-task", "此操作無法復原，確認要刪除此任務嗎？");
        })

        $("#clear-tasks-btn").on("click", () => {
            this.open("clear-task", "確認要清除所有任務資料嗎？");
        })

        $("#reset-demo-tasks-btn").on("click", () => {
            this.open("reset-task", "目前資料會被覆蓋，確認要重置為範例資料嗎？");
        })

        $("#confirm-action-btn").on("click", () => {
            this.confirm();
        })

        $("#close-popover-btn").on("click", () => {
            this.cancel();
        })
    },
    init() {
        this.bindEvents();
    }
};

// Task Cards Drag & Drop
const dragAndDrop = {
    bindEvents() {
        $(document).on("dragstart", ".task-card", function (e) {
            const taskId = $(this).data("id");

            e.originalEvent.dataTransfer.setData("text/plain", taskId);
            $(this).addClass("dragging");
        });

        $(document).on("dragend", ".task-card", function () {
            $(this).removeClass("dragging");
            $(".task-list").removeClass("drag-over");
        });

        $(document).on("dragover", ".task-list", function (e) {
            e.preventDefault();
            $(".task-list").removeClass("drag-over");
            $(this).addClass("drag-over");
        });

        $(document).on("drop", ".task-list", function (e) {
            e.preventDefault();
            $(".task-list").removeClass("drag-over");

            const taskId = Number(e.originalEvent.dataTransfer.getData("text/plain"));
            const targetStatus = this.id.replace("-list", "");
            const tasks = loadTasksFromLocalStorage();

            const task = tasks.find(function (task) {
                return task.id === taskId;
            });
            if (!task) {
                return;
            }
            task.status = targetStatus;
            saveTasksToLocalStorage(tasks);
            refreshUI();
        });
    },

    init() {
        this.bindEvents();
    }
};

// Dashboard
const dashboard = {
    dueStatusKeyMap: {
        "overdue": "overdue",
        "due-soon": "dueSoon",
        "normal": "normal",
        "no-date": "noDate"
    },

    calculateDashboardStats(tasks) {
        const stats = {
            total: tasks.length,
            todo: 0,
            inprogress: 0,
            done: 0,

            high: 0,
            medium: 0,
            low: 0,

            overdue: 0,
            dueSoon: 0,
            normal: 0,
            noDate: 0,

            completionRate: 0
        }

        $.each(tasks, (index, task) => {
            stats[task.status] += 1;
            if (task.status !== "done") {
                stats[task.priority] += 1;
                const dueStatus = getDueStatus(task.dueDate);
                stats[this.dueStatusKeyMap[dueStatus]] += 1;
            }
        })
        stats.completionRate = ((stats.total === 0) ? 0 : Math.round(stats.done / stats.total * 100));

        return stats;
    },

    renderPriorityFocus(tasks) {
        $(".priority-focus-container").empty();

        const focusTasks = tasks.filter(task =>
            task.priority === "high" &&
            task.status !== "done"
        );

        if (focusTasks.length === 0) {
            const p = $("<p></p>");
            p.append("目前沒有待處理的高優先度任務！");
            $(".priority-focus-container").append(p);
            return;
        }

        focusTasks.sort(function (a, b) {
            const aHasDate = !!a.dueDate;
            const bHasDate = !!b.dueDate;

            if ((aHasDate) && (!bHasDate)) {
                return -1;
            }
            if ((!aHasDate) && (bHasDate)) {
                return 1;
            }
            if ((!aHasDate) && (!bHasDate)) {
                return 0;
            }
            return Date.parse(a.dueDate) - Date.parse(b.dueDate);
        });

        //防止XSS
        $.each(focusTasks, (index, element) => {
            const taskDiv = $("<div></div>").addClass("priority-focus-task");
            const titleElement = $("<h3></h3>")
                .addClass("priority-focus-task-title")
                .text(element.title);
            const dueDateElement = $("<h3></h3>")
                .addClass("priority-focus-task-due-date")
                .text(element.dueDate ? element.dueDate : "無截止日期");

            taskDiv.append(titleElement);
            taskDiv.append(dueDateElement);
            $(".priority-focus-container").append(taskDiv);
        });
    },

    renderDashboard() {
        const tasks = loadTasksFromLocalStorage();
        const dashboardStats = this.calculateDashboardStats(tasks);

        $.each(dashboardStats, (index, value) => {
            if (index === "completionRate") {
                return;
            }

            let key = index;
            if (key === "dueSoon") {
                key = "due-soon";
            } else if (key === "noDate") {
                key = "no-date";
            }

            $("#dashboard-" + key + "-count").text(value);
        })

        const rate = dashboardStats.completionRate;
        $("#dashboard-completion-rate").text(rate + "%");
        $(".completion-progress-fill").css("width", rate + "%");
        this.renderPriorityFocus(tasks);
    }
};


$(".column-filter-btn").on("click", function (e) {
    e.stopPropagation();

    const currentPanel = $(this)
        .closest(".column-filter")
        .find(".column-filter-panel");

    $(".column-filter-panel").not(currentPanel).removeClass("active");

    currentPanel.toggleClass("active");
});

$(document).on("click", function () {
    $(".column-filter-panel").removeClass("active");
});

$(".column-filter-panel").on("click", function (e) {
    e.stopPropagation();
});