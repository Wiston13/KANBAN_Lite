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
})

let tasks = [
    {
        id: 1,
        title: "今天要帶狗狗去散步",
        content: "今天天氣真好，我要餵狗",
        priority: "high",
        tag: "good",
        status: "todo"
    },
    {
        id: 2,
        title: "明天要帶狗狗去散步",
        content: "明天天氣真好，狗要餵我",
        priority: "low",
        tag: "play",
        status: "done"
    },
    {
        id: 3,
        title: "後天狗狗要帶我去散步",
        content: "後天天氣真好，我要餵狗",
        priority: "medium",
        tag: "play",
        status: "inprogress"
    },
    {
        id: 4,
        title: "明天要帶狗狗去散步",
        content: "明天天氣真好，狗要餵我",
        priority: "low",
        tag: "play",
        status: "todo"
    }
];


function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks"));
}

if (loadTasksFromLocalStorage() === null) {
    saveTasksToLocalStorage(tasks);
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

renderTasks();

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
    renderTasks();
    dashboard.renderDashboard();
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
const deletePopover = $("#delete-task-popover")[0];

$("#delete-task-btn").on("click", () => {
    if (editingTaskId < 0) {
        return;
    }
    deletePopover.showPopover();
})

$("#popover-delete-task-btn").on("click", () => {
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
    renderTasks();
    dashboard.renderDashboard();

    deletePopover.hidePopover();
    closeAndResetTaskModal();
})

$("#close-popover-btn").on("click", () => {
    deletePopover.hidePopover();
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
    renderTasks();
    dashboard.renderDashboard();
});

//dashboard
const dashboard = {
    getTasks() {
        return loadTasksFromLocalStorage();
    },

    totalCount() {
        return this.getTasks().length;
    },

    todoCount() {
        return this.getTasks().filter(task => task.status === "todo").length;
    },

    inprogressCount() {
        return this.getTasks().filter(task => task.status === "inprogress").length;
    },

    doneCount() {
        return this.getTasks().filter(task => task.status === "done").length;
    },

    highCount() {
        return this.getTasks().filter(task =>
            task.priority === "high" &&
            task.status !== "done").length;
    },

    mediumCount() {
        return this.getTasks().filter(task =>
            task.priority === "medium" &&
            task.status !== "done").length;
    },

    lowCount() {
        return this.getTasks().filter(task =>
            task.priority === "low" &&
            task.status !== "done").length;
    },

    completionRateCount() {
        if (this.totalCount() === 0) {
            return 0;
        }
        return Math.round(this.doneCount() / this.totalCount() * 100);
    },

    getPriorityFocus() {
        return this.getTasks().filter(task =>
            task.priority === "high" &&
            task.status !== "done"
        );
    },

    renderPriorityFocus() {
        let focusTasks = this.getPriorityFocus();
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
        $("#dashboard-total-count").text(this.totalCount());
        $("#dashboard-todo-count").text(this.todoCount());
        $("#dashboard-inprogress-count").text(this.inprogressCount());
        $("#dashboard-done-count").text(this.doneCount());
        $("#dashboard-high-count").text(this.highCount());
        $("#dashboard-medium-count").text(this.mediumCount());
        $("#dashboard-low-count").text(this.lowCount());
        let rate = this.completionRateCount();
        $("#dashboard-completion-rate").text(rate + "%");
        $(".completion-progress-fill").css("width", rate + "%");
        this.renderPriorityFocus();
    }
};
dashboard.renderDashboard();
