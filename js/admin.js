document.addEventListener('DOMContentLoaded', () => {
    // Theme logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('academy-theme') || 'light-mode';
    body.className = currentTheme;

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('academy-theme', 'dark-mode');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('academy-theme', 'light-mode');
        }
        updateChartsTheme();
    });

    // Direction Logic (RTL/LTR)
    const directionToggle = document.getElementById('direction-toggle');
    const html = document.documentElement;
    const currentDir = localStorage.getItem('academy-direction') || 'ltr';
    html.setAttribute('dir', currentDir);

    directionToggle.addEventListener('click', () => {
        const newDir = html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
        html.setAttribute('dir', newDir);
        localStorage.setItem('academy-direction', newDir);
    });

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    sidebarToggle.addEventListener('click', () => {
        if (window.innerWidth < 992) {
            sidebar.classList.add('open');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // Profile Dropdown
    const profileBtn = document.getElementById('profileDropdownBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
    });

    // Modal logic
    const addStudentModal = document.getElementById('add-student-modal');
    const addStudentBtn = document.getElementById('add-student-btn');
    const addCoachModal = document.getElementById('add-coach-modal');
    const addCoachBtn = document.getElementById('add-coach-btn');
    const addProgramModal = document.getElementById('add-program-modal');
    const addProgramBtn = document.getElementById('add-program-btn');
    const closeBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    const addStudentForm = document.getElementById('add-student-form');
    const addCoachForm = document.getElementById('add-coach-form');
    const addProgramForm = document.getElementById('add-program-form');

    if(addStudentBtn && addStudentModal) {
        addStudentBtn.addEventListener('click', () => {
            addStudentModal.classList.add('active');
        });
    }

    if(addCoachBtn && addCoachModal) {
        addCoachBtn.addEventListener('click', () => {
            addCoachModal.classList.add('active');
        });
    }
    
    if(addProgramBtn && addProgramModal) {
        addProgramBtn.addEventListener('click', () => {
            addProgramModal.classList.add('active');
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(addStudentModal) addStudentModal.classList.remove('active');
            if(addCoachModal) addCoachModal.classList.remove('active');
            if(addProgramModal) addProgramModal.classList.remove('active');
        });
    });

    if(addStudentForm) {
        addStudentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('student-name').value;
            const email = document.getElementById('student-email').value;
            const level = document.getElementById('student-level').value;
            const program = document.getElementById('student-program').value;
            
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            
            const tbody = document.getElementById('students-list-body');
            if (tbody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="table-user">
                            <div class="avatar-initials bg-primary-light">${initials}</div>
                            <div>
                                <div class="user-name">${name}</div>
                                <div class="user-email">${email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${program}</td>
                    <td>${level}</td>
                    <td>Pending Assignment</td>
                    <td>${date}</td>
                    <td><span class="badge status-pending">Pending</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="icon-btn-sm" title="View"><i class='bx bx-show'></i></button>
                            <button class="icon-btn-sm" title="Edit"><i class='bx bx-edit-alt'></i></button>
                        </div>
                    </td>
                `;
                tbody.prepend(tr);
            }
            
            addStudentModal.classList.remove('active');
            addStudentForm.reset();
        });
    }

    if(addCoachForm) {
        addCoachForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('coach-name').value;
            const email = document.getElementById('coach-email').value;
            const title = document.getElementById('coach-title').value;
            const specialty = document.getElementById('coach-specialty').value;
            
            // Handle image upload if a file was selected, else use placeholder or initials
            const fileInput = document.getElementById('coach-media');
            let imgHtml = '';
            
            if (fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    addCoachToTable(name, email, title, specialty, `<img src="${e.target.result}" alt="${name}">`);
                }
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                imgHtml = `<div class="avatar-initials bg-success-light">${initials}</div>`;
                addCoachToTable(name, email, title, specialty, imgHtml);
            }
            
            addCoachModal.classList.remove('active');
            addCoachForm.reset();
        });
    }

    function addCoachToTable(name, email, title, specialty, avatarHtml) {
        // Find the tbody in coaches.html (we should give it an id, but for now we find it within .table)
        const table = document.querySelector('.data-card .table');
        if (table) {
            const tbody = table.querySelector('tbody');
            if (tbody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="table-user">
                            ${avatarHtml}
                            <div>
                                <div class="user-name">${name}</div>
                                <div class="user-email">${email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${title}</td>
                    <td>${specialty}</td>
                    <td>0 Batches</td>
                    <td><span class="badge status-active">Active</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="icon-btn-sm" title="View"><i class='bx bx-show'></i></button>
                            <button class="icon-btn-sm" title="Edit"><i class='bx bx-edit-alt'></i></button>
                        </div>
                    </td>
                `;
                tbody.prepend(tr);
            }
        }
    }
    
    if(addProgramForm) {
        addProgramForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Since this is a demo without a real backend, we just close the modal
            addProgramModal.classList.remove('active');
            addProgramForm.reset();
            alert('Program saved successfully!');
        });
    }

    // Charts (Chart.js)
    initCharts();
});

let growthChartInstance, distributionChartInstance;

function initCharts() {
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Growth Chart (Line/Area)
    const growthCtx = document.getElementById('growthChart');
    if(growthCtx) {
        const ctx = growthCtx.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        growthChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Active Students',
                    data: [650, 780, 890, 950, 1100, 1180, 1248],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3b82f6',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        titleColor: isDark ? '#f8fafc' : '#1e293b',
                        bodyColor: isDark ? '#cbd5e1' : '#475569',
                        borderColor: gridColor,
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    },
                    y: {
                        grid: { color: gridColor, drawBorder: false },
                        border: { display: false },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Distribution Chart (Doughnut)
    const distCtx = document.getElementById('distributionChart');
    if (distCtx) {
        const ctx = distCtx.getContext('2d');
        distributionChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        '#3b82f6', // blue
                        '#10b981', // green
                        '#f59e0b', // yellow
                        '#8b5cf6'  // purple
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                }
            }
        });
    }
}

function updateChartsTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    Chart.defaults.color = textColor;

    if (growthChartInstance) {
        growthChartInstance.options.plugins.tooltip.backgroundColor = isDark ? '#1e293b' : '#ffffff';
        growthChartInstance.options.plugins.tooltip.titleColor = isDark ? '#f8fafc' : '#1e293b';
        growthChartInstance.options.plugins.tooltip.bodyColor = isDark ? '#cbd5e1' : '#475569';
        growthChartInstance.options.plugins.tooltip.borderColor = gridColor;
        growthChartInstance.options.scales.y.grid.color = gridColor;
        growthChartInstance.update();
    }
    
    if (distributionChartInstance) {
        distributionChartInstance.update();
    }
}
