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

let tasks = [
    {
        id: 1,
        title: "今晚跟王董開會",
        content: "今晚跟王董有關於收購案的會議",
        priority: "high",
        tag: "meeting",
        status: "todo"
    },
    {
        id: 2,
        title: "修復登入頁面 Bug",
        content: "部分用戶反映三方登入時會出現 500 錯誤，需要緊急排查",
        priority: "high",
        tag: "bug",
        status: "inprogress"
    },
    {
        id: 3,
        title: "設計首頁 UI 視覺稿",
        content: "完成第二版首頁 RWD 視覺設計，並提交給產品經理審查",
        priority: "medium",
        tag: "design",
        status: "todo"
    },
    {
        id: 4,
        title: "撰寫 Q3 季度行銷企劃",
        content: "針對新功能上線擬定社群與廣告投放策略",
        priority: "medium",
        tag: "marketing",
        status: "done"
    },
    {
        id: 5,
        title: "與開發團隊進行 Sprint 規劃",
        content: "確認下一個雙週衝刺的任務分配與點數估算",
        priority: "high",
        tag: "meeting",
        status: "todo"
    },
    {
        id: 6,
        title: "開發購物車結帳功能",
        content: "實作 LINE Pay 與信用卡金流串接 API",
        priority: "high",
        tag: "feature",
        status: "inprogress"
    },
    {
        id: 7,
        title: "優化資料庫查詢效能",
        content: "針對商品搜尋頁面的 SQL 進行 Index 優化，降低延遲",
        priority: "medium",
        tag: "feature",
        status: "todo"
    },
    {
        id: 8,
        title: "修正購物車數量歸零 Bug",
        content: "使用者連續點擊減少數量時，偶爾會變成負數",
        priority: "high",
        tag: "bug",
        status: "done"
    },
    {
        id: 9,
        title: "撰寫 API 規格文件",
        content: "將使用者模組與權限控管的 API 規格更新至 Swagger",
        priority: "low",
        tag: "design",
        status: "done"
    },
    {
        id: 10,
        title: "每週跨部門進度同步會",
        content: "與營運團隊、設計團隊同步目前專案開發進度",
        priority: "low",
        tag: "meeting",
        status: "todo"
    },
    {
        id: 11,
        title: "準備 A/B 測試數據報告",
        content: "分析上週按鈕顏色調整後的轉化率變化",
        priority: "medium",
        tag: "marketing",
        status: "inprogress"
    },
    {
        id: 12,
        title: "新增暗黑模式 (Dark Mode)",
        content: "根據設計規範，實作全站切換暗黑模式的 CSS 樣式",
        priority: "low",
        tag: "feature",
        status: "todo"
    },
    {
        id: 13,
        title: "處理客服回報的圖片上傳失敗",
        content: "iOS App 用戶在上傳大於 5MB 的大頭貼時會閃退",
        priority: "high",
        tag: "bug",
        status: "inprogress"
    },
    {
        id: 14,
        title: "設計使用者問卷調研",
        content: "規劃新版介面的滿意度調查問卷題目",
        priority: "low",
        tag: "design",
        status: "todo"
    },
    {
        id: 15,
        title: "K8s 叢集例行性維護",
        content: "安排在離峰時間進行伺服器節點升級與重啟測試",
        priority: "high",
        tag: "feature",
        status: "done"
    },
    {
        id: 16,
        title: "確認 KOL 合作合約內容",
        content: "與法務確認下個月網紅業配的合作條款與授權範圍",
        priority: "medium",
        tag: "meeting",
        status: "inprogress"
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

function createTaskCard(task) {
    return `
            <div class="task-card" data-id="${task.id}" draggable="true">
                <div class="task-card-title">
                    ${task.title}
                </div>
                <div class="task-card-content">
                    ${task.content}
                </div>
                <div class="task-card-priority priority-${task.priority}">
                    ${task.priority}
                </div>
                <div class="task-card-tags">
                    <span class="task-card-tag">${task.tag}</span>
                </div>
            </div>
            `;
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
        "status": $("#task-status-input").val()
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
        let focusTasks = this.getPriorityFocus(tasks);
        $(".priority-focus-container").empty();

        if (focusTasks.length === 0) {
            $(".priority-focus-container").append(`<p>目前沒有待處理的高優先度任務！</p>`);
            return;
        }
        //防止XSS
        $.each(focusTasks, (index, element) => {
            $(".priority-focus-container").append(
                $("<h3></h3>").text(element.title)
            );
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

        let rate = this.completionRateCount(tasks);
        $("#dashboard-completion-rate").text(rate + "%");
        $(".completion-progress-fill").css("width", rate + "%");
        this.renderPriorityFocus(tasks);
    }
};

