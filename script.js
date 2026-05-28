$(document).ready(() => {
    // 側邊欄切換頁面
    $(".sidebar-object").on("click", function (e) {
        // 阻止預設行為，不然點擊時瀏覽器可能會跳到頁面頂部，或讓網址多一個 #
        e.preventDefault();

        $(".sidebar-object").removeClass("active");
        $(".page-section").removeClass("active");

        $(this).addClass("active");

        let targetPageId = $(this).data("page-section");
        $("#" + targetPageId).addClass("active");
    })

    refreshUI();
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

    let tasks = loadTasksFromLocalStorage();
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

function resetTaskForm() {
    editingTaskId = -1;
    $(".task-modal-header h2").text("新增任務");
    $("#delete-task-btn").hide();
    $("#task-title-input").val("");
    $("#task-description-input").val("");
    $("#task-tag-input").val("");
    $("#task-priority-input").val("medium");
    $("#task-status-input").val("todo");
    $("#due-date-input").val("");
}

function closeAndResetTaskModal() {
    resetTaskForm();
    $(".task-modal").removeClass("active");
}

$("#add-task-btn").on("click", () => {
    resetTaskForm();
    $(".task-modal").addClass("active");
});

$(document).on("click", ".task-card", function () {
    const taskId = Number($(this).data("id"));
    let tasks = loadTasksFromLocalStorage();
    const task = tasks.find(item => item.id === taskId);
    if (!task) {
        return;
    }
    editingTaskId = taskId;
    $("#task-title-input").val(task.title);
    $("#task-description-input").val(task.content);
    $("#task-tag-input").val(task.tag);
    $("#task-priority-input").val(task.priority);
    $("#task-status-input").val(task.status);
    $("#due-date-input").val(task.dueDate);
    $(".task-modal-header h2").text("編輯任務");
    $("#delete-task-btn").show();

    $(".task-modal").addClass("active");
})

$("#task-form").on("submit", function (e) {
    e.preventDefault();
    let tasks = loadTasksFromLocalStorage();
    let task = {
        "id": (editingTaskId < 0) ? new Date().getTime() : editingTaskId,
        "title": $("#task-title-input").val().trim(),
        "content": $("#task-description-input").val().trim(),
        "priority": $("#task-priority-input").val(),
        "tag": $("#task-tag-input").val().trim(),
        "status": $("#task-status-input").val(),
        "dueDate": $("#due-date-input").val()
    };
    if (task.tag === "") {
        task.tag = "general";
    }
    if (editingTaskId < 0) {
        tasks.push(task);
    } else {
        let tasksIndex = tasks.findIndex(item => item.id === editingTaskId);
        if (tasksIndex === -1) {
            alert("發生錯誤，請重試一次!");
            return;
        }
        tasks.splice(tasksIndex, 1, task);
    }
    saveTasksToLocalStorage(tasks);
    refreshUI();
    closeAndResetTaskModal();
})

$("#close-modal-btn").on("click", () => {
    closeAndResetTaskModal();
})

$("#task-modal").on("click", function (e) {
    if (e.target === this) {
        closeAndResetTaskModal();
    }
});


// popover
const actionPopover = $("#confirm-popover")[0];
let confirmAction = "";

$("#delete-task-btn").on("click", () => {
    if (editingTaskId < 0) {
        return;
    }
    popoverAction("delete-task", "此操作無法復原，確認要刪除此任務嗎？");
})

$("#clear-tasks-btn").on("click", () => {
    popoverAction("clear-task", "確認要清除所有任務資料嗎？");
})

$("#reset-demo-tasks-btn").on("click", () => {
    popoverAction("reset-task", "目前資料會被覆蓋，確認要重置為範例資料嗎？");
})

function popoverAction(action, msg) {
    confirmAction = action;
    $("#confirm-popover-message").text(msg);
    actionPopover.showPopover();
}

$("#confirm-action-btn").on("click", () => {
    if (confirmAction === "clear-task") {
        saveTasksToLocalStorage([]);
    } else if (confirmAction === "reset-task") {
        saveTasksToLocalStorage(tasks);
    } else if (confirmAction === "delete-task") {
        if (editingTaskId < 0) {
            return;
        }
        let tasks = loadTasksFromLocalStorage();
        let tasksIndex = tasks.findIndex(item => item.id === editingTaskId);

        if (tasksIndex === -1) {
            alert("發生錯誤，請重試一次!");
            return;
        }
        tasks.splice(tasksIndex, 1);
        saveTasksToLocalStorage(tasks);
        closeAndResetTaskModal();
    } else {
        return;
    }

    refreshUI();
    actionPopover.hidePopover();
    confirmAction = "";
})

$("#close-popover-btn").on("click", () => {
    actionPopover.hidePopover();
    confirmAction = "";
})


// Task Cards Drag & Drop
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
    let tasks = loadTasksFromLocalStorage();

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


//dashboard
const dashboard = {

    totalCount(tasks) {
        return tasks.length;
    },

    todoCount(tasks) {
        return tasks.filter(task => task.status === "todo").length;
    },

    inprogressCount(tasks) {
        return tasks.filter(task => task.status === "inprogress").length;
    },

    doneCount(tasks) {
        return tasks.filter(task => task.status === "done").length;
    },

    highCount(tasks) {
        return tasks.filter(task =>
            task.priority === "high" &&
            task.status !== "done").length;
    },

    mediumCount(tasks) {
        return tasks.filter(task =>
            task.priority === "medium" &&
            task.status !== "done").length;
    },

    lowCount(tasks) {
        return tasks.filter(task =>
            task.priority === "low" &&
            task.status !== "done").length;
    },

    overDueCount(tasks) {
        return tasks.filter(task =>
            getDueStatus(task.dueDate) === "overdue" &&
            task.status !== "done").length;
    },

    dueSoonCount(tasks) {
        return tasks.filter(task =>
            getDueStatus(task.dueDate) === "due-soon" &&
            task.status !== "done").length;
    },

    normalCount(tasks) {
        return tasks.filter(task =>
            getDueStatus(task.dueDate) === "normal" &&
            task.status !== "done").length;
    },

    noDateCount(tasks) {
        return tasks.filter(task =>
            getDueStatus(task.dueDate) === "no-date" &&
            task.status !== "done").length;
    },

    completionRateCount(tasks) {
        if (this.totalCount(tasks) === 0) {
            return 0;
        }
        return Math.round(this.doneCount(tasks) / this.totalCount(tasks) * 100);
    },

    getPriorityFocus(tasks) {
        return tasks.filter(task =>
            task.priority === "high" &&
            task.status !== "done"
        );
    },

    renderPriorityFocus(tasks) {
        $(".priority-focus-container").empty();
        let focusTasks = this.getPriorityFocus(tasks);

        if (focusTasks.length === 0) {
            $(".priority-focus-container").append(`<p>目前沒有待處理的高優先度任務！</p>`);
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
        let tasks = loadTasksFromLocalStorage();

        $("#dashboard-total-count").text(this.totalCount(tasks));
        $("#dashboard-todo-count").text(this.todoCount(tasks));
        $("#dashboard-inprogress-count").text(this.inprogressCount(tasks));
        $("#dashboard-done-count").text(this.doneCount(tasks));
        $("#dashboard-high-count").text(this.highCount(tasks));
        $("#dashboard-medium-count").text(this.mediumCount(tasks));
        $("#dashboard-low-count").text(this.lowCount(tasks));
        $("#dashboard-overdue-count").text(this.overDueCount(tasks));
        $("#dashboard-due-soon-count").text(this.dueSoonCount(tasks));
        $("#dashboard-normal-count").text(this.normalCount(tasks));
        $("#dashboard-no-date-count").text(this.noDateCount(tasks));


        let rate = this.completionRateCount(tasks);
        $("#dashboard-completion-rate").text(rate + "%");
        $(".completion-progress-fill").css("width", rate + "%");
        this.renderPriorityFocus(tasks);
    }
};

