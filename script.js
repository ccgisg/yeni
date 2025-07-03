// Global variables
let currentWorkplace = null;
let employees = [];
let workplaces = [];
let doctorInfo = {};
let currentMonth = '';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize monthly folders
    initializeMonths();
    
    // Load data from localStorage
    loadData();
    
    // Setup event listeners
    setupEventListeners();
});

// Initialize months
function initializeMonths() {
    const now = new Date();
    const currentDay = now.getDate();
    let year = now.getFullYear();
    let month = now.getMonth();
    
    // If after the 15th, show next month
    if (currentDay > 15) {
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
    }
    
    currentMonth = `${year} ${getMonthName(month)}`;
    
    // Generate months for the submenu
    const monthSubmenu = document.getElementById('month-submenu');
    monthSubmenu.innerHTML = '';
    
    // Show current and next 3 months
    for (let i = 0; i < 4; i++) {
        const monthName = `${year} ${getMonthName(month)}`;
        const monthItem = document.createElement('div');
        monthItem.className = 'month-item';
        monthItem.textContent = monthName;
        monthItem.onclick = function() {
            // You can add functionality here for month selection
            alert(`${monthName} seçildi`);
        };
        monthSubmenu.appendChild(monthItem);
        
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
    }
}

// Get month name
function getMonthName(monthIndex) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[monthIndex];
}

// Load data from localStorage
function loadData() {
    const savedWorkplaces = localStorage.getItem('workplaces');
    if (savedWorkplaces) {
        workplaces = JSON.parse(savedWorkplaces);
        updateWorkplaceList();
    }
    
    const savedDoctorInfo = localStorage.getItem('doctorInfo');
    if (savedDoctorInfo) {
        doctorInfo = JSON.parse(savedDoctorInfo);
        document.getElementById('doctor-name').value = doctorInfo.name || '';
        document.getElementById('diploma-date').value = doctorInfo.diplomaDate || '';
        document.getElementById('diploma-reg-date').value = doctorInfo.diplomaRegDate || '';
        document.getElementById('workplace-certificate').value = doctorInfo.workplaceCertificate || '';
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('workplaces', JSON.stringify(workplaces));
    localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
}

// Setup event listeners
function setupEventListeners() {
    // Monthly jobs menu toggle
    document.getElementById('monthly-jobs').addEventListener('click', function() {
        const submenu = document.getElementById('month-submenu');
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Workplaces menu toggle
    document.getElementById('workplaces').addEventListener('click', function() {
        const submenu = document.getElementById('workplace-submenu');
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Doctor settings form
    document.getElementById('doctor-settings').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDoctorInfo();
    });
    
    // Employee form
    document.getElementById('employee-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEmployee();
    });
}

// Login function
function login() {
    const password = document.getElementById('password').value;
    // Default password is 1234
    if (password === '1234' || password === '') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'flex';
    } else {
        alert('Hatalı şifre! Varsayılan şifre: 1234');
    }
}

// Logout function
function logout() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('password').value = '';
}

// Show settings
function showSettings() {
    document.getElementById('dashboard-content').style.display = 'none';
    document.getElementById('workplace-content').style.display = 'none';
    document.getElementById('employee-form-container').style.display = 'none';
    document.getElementById('settings-content').style.display = 'block';
}

// Back to main
function backToMain() {
    document.getElementById('dashboard-content').style.display = 'block';
    document.getElementById('workplace-content').style.display = 'none';
    document.getElementById('employee-form-container').style.display = 'none';
    document.getElementById('settings-content').style.display = 'none';
}

// Back to workplace
function backToWorkplace() {
    document.getElementById('employee-form-container').style.display = 'none';
    document.getElementById('workplace-content').style.display = 'block';
}

// Save doctor info
function saveDoctorInfo() {
    doctorInfo = {
        name: document.getElementById('doctor-name').value,
        diplomaDate: document.getElementById('diploma-date').value,
        diplomaRegDate: document.getElementById('diploma-reg-date').value,
        workplaceCertificate: document.getElementById('workplace-certificate').value
    };
    
    saveData();
    alert('Doktor bilgileri kaydedildi!');
}

// Add workplace
function addWorkplace() {
    const workplaceName = prompt('İşyeri adını girin:');
    if (workplaceName) {
        const newWorkplace = {
            id: Date.now(),
            name: workplaceName,
            employees: []
        };
        
        workplaces.push(newWorkplace);
        saveData();
        updateWorkplaceList();
    }
}

// Update workplace list
function updateWorkplaceList() {
    const workplaceSubmenu = document.getElementById('workplace-submenu');
    // Clear existing items except the "Add Workplace" button
    workplaceSubmenu.innerHTML = '<button onclick="addWorkplace()">İşyeri Ekle</button>';
    
    // Add edit and delete buttons for each workplace
    workplaces.forEach(workplace => {
        const workplaceItem = document.createElement('div');
        workplaceItem.className = 'workplace-item';
        workplaceItem.textContent = workplace.name;
        workplaceItem.onclick = function() {
            openWorkplace(workplace);
        };
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Düzenle';
        editBtn.onclick = function(e) {
            e.stopPropagation();
            editWorkplace(workplace);
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Sil';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            deleteWorkplace(workplace);
        };
        
        workplaceItem.appendChild(editBtn);
        workplaceItem.appendChild(deleteBtn);
        workplaceSubmenu.appendChild(workplaceItem);
    });
}

// Edit workplace
function editWorkplace(workplace) {
    const newName = prompt('Yeni işyeri adını girin:', workplace.name);
    if (newName) {
        workplace.name = newName;
        saveData();
        updateWorkplaceList();
    }
}

// Delete workplace
function deleteWorkplace(workplace) {
    if (confirm(`"${workplace.name}" işyerini silmek istediğinize emin misiniz?`)) {
        workplaces = workplaces.filter(w => w.id !== workplace.id);
        saveData();
        updateWorkplaceList();
        
        if (currentWorkplace && currentWorkplace.id === workplace.id) {
            backToMain();
        }
    }
}

// Open workplace
function openWorkplace(workplace) {
    currentWorkplace = workplace;
    employees = workplace.employees;
    
    document.getElementById('workplace-title').textContent = workplace.name;
    document.getElementById('dashboard-content').style.display = 'none';
    document.getElementById('workplace-content').style.display = 'block';
    document.getElementById('settings-content').style.display = 'none';
    document.getElementById('employee-form-container').style.display = 'none';
    
    updateEmployeeList();
}

// Update employee list
function updateEmployeeList() {
    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = '';
    
    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${employee.tc}</td>
            <td>${employee.name}</td>
            <td>${formatDate(employee.currentExam)}</td>
            <td>${formatDate(employee.nextExam)}</td>
            <td>
                <button class="ek2-btn" onclick="viewEk2(${employee.id})">Göster</button>
                <button class="ek2-btn" onclick="uploadEk2(${employee.id})">Yükle</button>
            </td>
            <td>
                <button class="edit-btn" onclick="editEmployee(${employee.id})">Düzenle</button>
                <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Sil</button>
            </td>
        `;
        
        employeeList.appendChild(row);
    });
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

// Add employee
function addEmployee() {
    document.getElementById('employee-form-title').textContent = 'Yeni Kişi Ekle';
    document.getElementById('employee-id').value = '';
    document.getElementById('employee-tc').value = '';
    document.getElementById('employee-name').value = '';
    document.getElementById('current-exam').value = '';
    document.getElementById('next-exam').value = '';
    document.getElementById('ek2-file').value = '';
    
    document.getElementById('workplace-content').style.display = 'none';
    document.getElementById('employee-form-container').style.display = 'block';
}

// Edit employee
function editEmployee(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
        document.getElementById('employee-form-title').textContent = 'Kişiyi Düzenle';
        document.getElementById('employee-id').value = employee.id;
        document.getElementById('employee-tc').value = employee.tc;
        document.getElementById('employee-name').value = employee.name;
        document.getElementById('current-exam').value = employee.currentExam;
        document.getElementById('next-exam').value = employee.nextExam;
        
        document.getElementById('workplace-content').style.display = 'none';
        document.getElementById('employee-form-container').style.display = 'block';
    }
}

// Save employee
function saveEmployee() {
    const id = document.getElementById('employee-id').value;
    const tc = document.getElementById('employee-tc').value;
    const name = document.getElementById('employee-name').value;
    const currentExam = document.getElementById('current-exam').value;
    const nextExam = document.getElementById('next-exam').value;
    const ek2File = document.getElementById('ek2-file').files[0];
    
    if (id) {
        // Update existing employee
        const employee = employees.find(e => e.id === parseInt(id));
        if (employee) {
            employee.tc = tc;
            employee.name = name;
            employee.currentExam = currentExam;
            employee.nextExam = nextExam;
        }
    } else {
        // Add new employee
        const newEmployee = {
            id: Date.now(),
            tc,
            name,
            currentExam,
            nextExam
        };
        employees.push(newEmployee);
    }
    
    // Handle file upload (in a real app, you would save this to a server)
    if (ek2File) {
        alert(`Ek-2 dosyası yüklendi: ${ek2File.name}`);
        // In a real app, you would save the file and store the reference
    }
    
    // Update workplace data
    if (currentWorkplace) {
        currentWorkplace.employees = employees;
        saveData();
    }
    
    updateEmployeeList();
    backToWorkplace();
}

// Delete employee
function deleteEmployee(employeeId) {
    if (confirm('Bu kişiyi silmek istediğinize emin misiniz?')) {
        employees = employees.filter(e => e.id !== employeeId);
        
        if (currentWorkplace) {
            currentWorkplace.employees = employees;
            saveData();
        }
        
        updateEmployeeList();
    }
}

// View Ek-2
function viewEk2(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
        alert(`Ek-2 formu gösteriliyor: ${employee.name}`);
        // In a real app, you would display the actual Ek-2 form
    }
}

// Upload Ek-2
function uploadEk2(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.docx,.pdf';
        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                alert(`Ek-2 dosyası yüklendi: ${file.name} (${employee.name})`);
                // In a real app, you would save the file and store the reference
            }
        };
        fileInput.click();
    }
}

// Export to Excel
function exportToExcel() {
    if (!currentWorkplace) return;
    
    // Create CSV content
    let csvContent = "S.No,TC Kimlik No,Ad Soyad,Mevcut Muayene,Sonraki Muayene\n";
    
    employees.forEach((employee, index) => {
        csvContent += `${index + 1},${employee.tc},"${employee.name}",${employee.currentExam},${employee.nextExam}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentWorkplace.name}_calisan_listesi.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Import from Excel
function importFromExcel() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx,.xls';
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you would parse the Excel/CSV file
            alert(`Excel dosyası yüklendi: ${file.name}\n(Bu örnekte gerçek içe aktarma işlemi yapılmamaktadır)`);
        }
    };
    fileInput.click();
}

// Backup data
function backupData() {
    const data = {
        workplaces,
        doctorInfo
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `isyeri_hekimligi_yedek_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Restore from backup
function restoreFromBackup() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    workplaces = data.workplaces || [];
                    doctorInfo = data.doctorInfo || {};
                    
                    saveData();
                    updateWorkplaceList();
                    
                    // Update doctor info form
                    document.getElementById('doctor-name').value = doctorInfo.name || '';
                    document.getElementById('diploma-date').value = doctorInfo.diplomaDate || '';
                    document.getElementById('diploma-reg-date').value = doctorInfo.diplomaRegDate || '';
                    document.getElementById('workplace-certificate').value = doctorInfo.workplaceCertificate || '';
                    
                    alert('Yedek başarıyla geri yüklendi!');
                } catch (error) {
                    alert('Yedek dosyası okunurken hata oluştu: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
}
