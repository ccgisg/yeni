// Uygulama durumu
const state = {
    password: "1234", // Basit şifre
    isAuthenticated: false,
    currentView: 'home',
    currentWorkplace: null,
    doctorInfo: {
        name: '',
        surname: '',
        license: '',
        phone: '',
        email: ''
    },
    workplaces: [],
    selectedMonth: null,
    months: []
};

// DOM Elementleri
const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');
const logoutButton = document.getElementById('logoutButton');
const settingsButton = document.getElementById('settingsButton');
const monthlyJobsButton = document.getElementById('monthlyJobsButton');
const monthlyJobsDropdown = document.getElementById('monthlyJobsDropdown');
const workplacesList = document.getElementById('workplacesList');
const addWorkplaceButton = document.getElementById('addWorkplaceButton');
const editWorkplaceButton = document.getElementById('editWorkplaceButton');
const deleteWorkplaceButton = document.getElementById('deleteWorkplaceButton');
const homeScreen = document.getElementById('homeScreen');
const workplaceScreen = document.getElementById('workplaceScreen');
const workplaceTitle = document.getElementById('workplaceTitle');
const backButton = document.getElementById('backButton');
const employeeTableBody = document.getElementById('employeeTableBody');
const addEmployeeButton = document.getElementById('addEmployeeButton');
const exportExcelButton = document.getElementById('exportExcelButton');
const importExcelButton = document.getElementById('importExcelButton');
const backupButton = document.getElementById('backupButton');
const restoreButton = document.getElementById('restoreButton');
const settingsScreen = document.getElementById('settingsScreen');
const doctorInfoForm = document.getElementById('doctorInfoForm');
const addWorkplaceModal = document.getElementById('addWorkplaceModal');
const editWorkplaceModal = document.getElementById('editWorkplaceModal');
const addEmployeeModal = document.getElementById('addEmployeeModal');
const editEmployeeModal = document.getElementById('editEmployeeModal');
const ek2ViewerModal = document.getElementById('ek2ViewerModal');
const closeButtons = document.querySelectorAll('.close');

// Modal formları
const addWorkplaceForm = document.getElementById('addWorkplaceForm');
const editWorkplaceForm = document.getElementById('editWorkplaceForm');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const editEmployeeForm = document.getElementById('editEmployeeForm');
const uploadEk2Btn = document.getElementById('uploadEk2Btn');
const viewEk2Btn = document.getElementById('viewEk2Btn');
const editEk2File = document.getElementById('editEk2File');

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    initializeMonths();
    loadData();
    setupEventListeners();
});

// Kimlik doğrulama kontrolü
function checkAuthentication() {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
        state.isAuthenticated = true;
        loginScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }
}

// Ayları başlat
function initializeMonths() {
    // DOM elementinin yüklendiğinden emin ol
    if (!monthlyJobsDropdown) {
        setTimeout(initializeMonths, 100);
        return;
    }

    const now = new Date();
    const currentDate = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Eğer ayın 15'inden sonraysa bir sonraki ayı da ekle
    const totalMonths = currentDate > 15 ? 13 : 12;

    for (let i = 0; i < totalMonths; i++) {
        const month = (currentMonth + i) % 12;
        const year = currentYear + Math.floor((currentMonth + i) / 12);
        const monthName = getMonthName(month);
        state.months.push({ name: monthName, year: year });
    }

    renderMonthsDropdown();
}

// Ay ismini al
function getMonthName(monthIndex) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[monthIndex];
}

// Aylar dropdown'unu render et
function renderMonthsDropdown() {
    monthlyJobsDropdown.innerHTML = '';
    state.months.forEach(month => {
        const monthElement = document.createElement('a');
        monthElement.href = '#';
        monthElement.textContent = `${month.year} ${month.name}`;
        monthElement.addEventListener('click', () => {
            state.selectedMonth = `${month.year} ${month.name}`;
            // Burada aya özel işlemler yapılabilir
        });
        monthlyJobsDropdown.appendChild(monthElement);
    });
}

// Verileri yükle
function loadData() {
    const savedDoctorInfo = localStorage.getItem('doctorInfo');
    if (savedDoctorInfo) {
        state.doctorInfo = JSON.parse(savedDoctorInfo);
        populateDoctorInfoForm();
    }

    const savedWorkplaces = localStorage.getItem('workplaces');
    if (savedWorkplaces) {
        state.workplaces = JSON.parse(savedWorkplaces);
        renderWorkplacesList();
    }
}

// Doktor bilgileri formunu doldur
function populateDoctorInfoForm() {
    document.getElementById('doctorName').value = state.doctorInfo.name || '';
    document.getElementById('doctorSurname').value = state.doctorInfo.surname || '';
    document.getElementById('doctorLicense').value = state.doctorInfo.license || '';
    document.getElementById('doctorPhone').value = state.doctorInfo.phone || '';
    document.getElementById('doctorEmail').value = state.doctorInfo.email || '';
}

// İşyerleri listesini render et
function renderWorkplacesList() {
    workplacesList.innerHTML = '';
    state.workplaces.forEach((workplace, index) => {
        const workplaceElement = document.createElement('div');
        workplaceElement.className = 'workplace-item';
        workplaceElement.textContent = workplace.name;
        workplaceElement.dataset.id = workplace.id;
        
        workplaceElement.addEventListener('dblclick', () => {
            openWorkplace(workplace.id);
        });
        
        workplaceElement.addEventListener('click', () => {
            // Seçili işyerini vurgula
            document.querySelectorAll('.workplace-item').forEach(item => {
                item.classList.remove('selected');
            });
            workplaceElement.classList.add('selected');
            state.currentWorkplace = workplace.id;
        });
        
        workplacesList.appendChild(workplaceElement);
    });
}

// İşyeri aç
function openWorkplace(workplaceId) {
    const workplace = state.workplaces.find(wp => wp.id === workplaceId);
    if (!workplace) return;

    state.currentWorkplace = workplaceId;
    workplaceTitle.textContent = workplace.name;
    homeScreen.classList.add('hidden');
    workplaceScreen.classList.remove('hidden');
    settingsScreen.classList.add('hidden');
    state.currentView = 'workplace';

    renderEmployeesTable(workplace.employees || []);
}

// Çalışanlar tablosunu render et
function renderEmployeesTable(employees) {
    employeeTableBody.innerHTML = '';
    
    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        
        // Sıra No
        const serialCell = document.createElement('td');
        serialCell.textContent = index + 1;
        row.appendChild(serialCell);
        
        // TC Kimlik No
        const tcCell = document.createElement('td');
        tcCell.textContent = employee.tc;
        row.appendChild(tcCell);
        
        // Ad Soyad
        const nameCell = document.createElement('td');
        nameCell.textContent = `${employee.name} ${employee.surname}`;
        row.appendChild(nameCell);
        
        // Mevcut Muayene Tarihi
        const currentExamCell = document.createElement('td');
        currentExamCell.textContent = formatDate(employee.currentExamDate);
        row.appendChild(currentExamCell);
        
        // Sonraki Muayene Tarihi
        const nextExamCell = document.createElement('td');
        nextExamCell.textContent = formatDate(employee.nextExamDate);
        row.appendChild(nextExamCell);
        
        // EK-2 Butonları
        const ek2Cell = document.createElement('td');
        const ek2UploadBtn = document.createElement('button');
        ek2UploadBtn.className = 'action-btn view';
        ek2UploadBtn.textContent = 'Yükle';
        ek2UploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadEk2(employee.id);
        });
        
        const ek2ViewBtn = document.createElement('button');
        ek2ViewBtn.className = 'action-btn view';
        ek2ViewBtn.textContent = 'Göster';
        ek2ViewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewEk2(employee.ek2);
        });
        
        ek2Cell.appendChild(ek2UploadBtn);
        ek2Cell.appendChild(ek2ViewBtn);
        row.appendChild(ek2Cell);
        
        // İşlemler
        const actionsCell = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit';
        editBtn.textContent = 'Düzenle';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditEmployeeModal(employee.id);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.textContent = 'Sil';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteEmployee(employee.id);
        });
        
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        employeeTableBody.appendChild(row);
    });
}

// Tarih formatı gg.aa.yyyy
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Geçersiz tarihse orijinalini döndür
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// EK-2 yükle
function uploadEk2(employeeId) {
    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace) return;

    const employee = (workplace.employees || []).find(emp => emp.id === employeeId);
    if (!employee) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            employee.ek2 = {
                fileName: file.name,
                fileType: file.type,
                data: event.target.result
            };
            saveWorkplaces();
            renderEmployeesTable(workplace.employees || []);
        };
        reader.readAsDataURL(file);
    });
    
    fileInput.click();
}

// EK-2 göster
function viewEk2(ek2Data) {
    if (!ek2Data) {
        alert('EK-2 belgesi bulunamadı.');
        return;
    }

    const ek2ViewerContent = document.getElementById('ek2ViewerContent');
    ek2ViewerContent.innerHTML = '';

    if (ek2Data.fileType === 'application/pdf') {
        // PDF görüntüleme
        const embed = document.createElement('embed');
        embed.src = ek2Data.data;
        embed.type = 'application/pdf';
        embed.width = '100%';
        embed.height = '500px';
        ek2ViewerContent.appendChild(embed);
    } else if (ek2Data.fileType.startsWith('image/')) {
        // Resim görüntüleme
        const img = document.createElement('img');
        img.src = ek2Data.data;
        img.style.maxWidth = '100%';
        ek2ViewerContent.appendChild(img);
    } else {
        // Diğer dosya türleri için indirme bağlantısı
        const downloadLink = document.createElement('a');
        downloadLink.href = ek2Data.data;
        downloadLink.download = ek2Data.fileName;
        downloadLink.textContent = `İndir: ${ek2Data.fileName}`;
        downloadLink.className = 'download-link';
        ek2ViewerContent.appendChild(downloadLink);
    }

    ek2ViewerModal.classList.remove('hidden');
}

// Çalışan düzenleme modalını aç
function openEditEmployeeModal(employeeId) {
    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace) return;

    const employee = (workplace.employees || []).find(emp => emp.id === employeeId);
    if (!employee) return;

    document.getElementById('editEmployeeId').value = employee.id;
    document.getElementById('editEmployeeTc').value = employee.tc;
    document.getElementById('editEmployeeName').value = employee.name;
    document.getElementById('editEmployeeSurname').value = employee.surname;
    document.getElementById('editCurrentExamDate').value = formatDate(employee.currentExamDate);
    document.getElementById('editNextExamDate').value = formatDate(employee.nextExamDate);

    editEmployeeModal.classList.remove('hidden');
}

// Çalışan sil
function deleteEmployee(employeeId) {
    if (!confirm('Bu çalışanı silmek istediğinize emin misiniz?')) return;

    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace) return;

    if (!workplace.employees) workplace.employees = [];
    workplace.employees = workplace.employees.filter(emp => emp.id !== employeeId);
    
    saveWorkplaces();
    renderEmployeesTable(workplace.employees || []);
}

// Event listener'ları kur
function setupEventListeners() {
    // Giriş butonu
    loginButton.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Çıkış butonu
    logoutButton.addEventListener('click', handleLogout);

    // Ayarlar butonu
    settingsButton.addEventListener('click', () => {
        homeScreen.classList.add('hidden');
        workplaceScreen.classList.add('hidden');
        settingsScreen.classList.remove('hidden');
        state.currentView = 'settings';
    });

    // Aylık işler dropdown
    monthlyJobsButton.addEventListener('click', () => {
        monthlyJobsDropdown.style.display = monthlyJobsDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // İşyeri ekle butonu
    addWorkplaceButton.addEventListener('click', () => {
        addWorkplaceForm.reset();
        addWorkplaceModal.classList.remove('hidden');
    });

    // İşyeri düzenle butonu
    editWorkplaceButton.addEventListener('click', () => {
        if (!state.currentWorkplace) {
            alert('Lütfen düzenlemek istediğiniz işyerini seçin.');
            return;
        }
        
        const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
        if (!workplace) return;

        document.getElementById('editWorkplaceId').value = workplace.id;
        document.getElementById('editWorkplaceName').value = workplace.name;
        document.getElementById('editWorkplaceAddress').value = workplace.address || '';
        document.getElementById('editWorkplacePhone').value = workplace.phone || '';
        
        editWorkplaceModal.classList.remove('hidden');
    });

    // İşyeri sil butonu
    deleteWorkplaceButton.addEventListener('click', () => {
        if (!state.currentWorkplace) {
            alert('Lütfen silmek istediğiniz işyerini seçin.');
            return;
        }
        
        if (!confirm('Bu işyerini ve tüm çalışan verilerini silmek istediğinize emin misiniz?')) return;

        state.workplaces = state.workplaces.filter(wp => wp.id !== state.currentWorkplace);
        state.currentWorkplace = null;
        saveWorkplaces();
        renderWorkplacesList();
        
        homeScreen.classList.remove('hidden');
        workplaceScreen.classList.add('hidden');
    });

    // Geri butonu
    backButton.addEventListener('click', () => {
        workplaceScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        state.currentView = 'home';
    });

    // Yeni çalışan ekle butonu
    addEmployeeButton.addEventListener('click', () => {
        addEmployeeForm.reset();
        addEmployeeModal.classList.remove('hidden');
    });

    // Excel'e ver butonu
    exportExcelButton.addEventListener('click', exportToExcel);

    // Excel'den al butonu
    importExcelButton.addEventListener('click', importFromExcel);

    // Yedek al butonu
    backupButton.addEventListener('click', createBackup);

    // Yedekten dön butonu
    restoreButton.addEventListener('click', restoreFromBackup);

    // Doktor bilgileri formu
    doctorInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveDoctorInfo();
    });

    // İşyeri ekle formu
    addWorkplaceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewWorkplace();
    });

    // İşyeri düzenle formu
    editWorkplaceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateWorkplace();
    });

    // Çalışan ekle formu
    addEmployeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewEmployee();
    });

    // Çalışan düzenle formu
    editEmployeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateEmployee();
    });

    // EK-2 yükle butonu
    uploadEk2Btn.addEventListener('click', () => {
        editEk2File.click();
    });

    editEk2File.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const employeeId = document.getElementById('editEmployeeId').value;
            const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
            if (!workplace) return;

            const employee = (workplace.employees || []).find(emp => emp.id === employeeId);
            if (!employee) return;

            employee.ek2 = {
                fileName: file.name,
                fileType: file.type,
                data: event.target.result
            };
            
            saveWorkplaces();
            renderEmployeesTable(workplace.employees || []);
        };
        reader.readAsDataURL(file);
    });

    // EK-2 göster butonu
    viewEk2Btn.addEventListener('click', () => {
        const employeeId = document.getElementById('editEmployeeId').value;
        const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
        if (!workplace) return;

        const employee = (workplace.employees || []).find(emp => emp.id === employeeId);
        if (!employee || !employee.ek2) {
            alert('EK-2 belgesi bulunamadı.');
            return;
        }

        viewEk2(employee.ek2);
    });

    // Çalışan sil butonu (modal içinde)
    document.getElementById('deleteEmployeeBtn').addEventListener('click', () => {
        const employeeId = document.getElementById('editEmployeeId').value;
        editEmployeeModal.classList.add('hidden');
        deleteEmployee(employeeId);
    });

    // Modal kapatma butonları
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.add('hidden');
        });
    });

    // Modal dışına tıklayarak kapatma
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
}

// Giriş işlemi
function handleLogin() {
    if (passwordInput.value === state.password) {
        state.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
        loginScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        loginError.textContent = '';
    } else {
        loginError.textContent = 'Hatalı şifre! Lütfen tekrar deneyin.';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Çıkış işlemi
function handleLogout() {
    state.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    appContainer.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    passwordInput.value = '';
    passwordInput.focus();
}

// Doktor bilgilerini kaydet
function saveDoctorInfo() {
    state.doctorInfo = {
        name: document.getElementById('doctorName').value,
        surname: document.getElementById('doctorSurname').value,
        license: document.getElementById('doctorLicense').value,
        phone: document.getElementById('doctorPhone').value,
        email: document.getElementById('doctorEmail').value
    };
    
    localStorage.setItem('doctorInfo', JSON.stringify(state.doctorInfo));
    alert('Doktor bilgileri kaydedildi.');
}

// Yeni işyeri ekle
function addNewWorkplace() {
    const name = document.getElementById('workplaceName').value.trim();
    if (!name) {
        alert('İşyeri adı boş olamaz!');
        return;
    }

    const newWorkplace = {
        id: generateId(),
        name: name,
        address: document.getElementById('workplaceAddress').value.trim(),
        phone: document.getElementById('workplacePhone').value.trim(),
        employees: []
    };

    state.workplaces.push(newWorkplace);
    saveWorkplaces();
    renderWorkplacesList();
    addWorkplaceModal.classList.add('hidden');
}

// İşyeri güncelle
function updateWorkplace() {
    const id = document.getElementById('editWorkplaceId').value;
    const name = document.getElementById('editWorkplaceName').value.trim();
    if (!name) {
        alert('İşyeri adı boş olamaz!');
        return;
    }

    const workplace = state.workplaces.find(wp => wp.id === id);
    if (!workplace) return;

    workplace.name = name;
    workplace.address = document.getElementById('editWorkplaceAddress').value.trim();
    workplace.phone = document.getElementById('editWorkplacePhone').value.trim();
    
    saveWorkplaces();
    renderWorkplacesList();
    editWorkplaceModal.classList.add('hidden');
    
    if (state.currentView === 'workplace' && state.currentWorkplace === id) {
        workplaceTitle.textContent = name;
    }
}

// Yeni çalışan ekle
function addNewEmployee() {
    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace) return;

    const tc = document.getElementById('employeeTc').value.trim();
    const name = document.getElementById('employeeName').value.trim();
    const surname = document.getElementById('employeeSurname').value.trim();
    const currentExamDate = document.getElementById('currentExamDate').value.trim();
    const nextExamDate = document.getElementById('nextExamDate').value.trim();
    
    if (!tc || !name || !surname || !currentExamDate || !nextExamDate) {
        alert('Tüm alanlar doldurulmalıdır!');
        return;
    }

    const fileInput = document.getElementById('ek2File');
    let ek2Data = null;
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            ek2Data = {
                fileName: file.name,
                fileType: file.type,
                data: event.target.result
            };
            
            addEmployeeToWorkplace(tc, name, surname, currentExamDate, nextExamDate, ek2Data);
        };
        reader.readAsDataURL(file);
    } else {
        addEmployeeToWorkplace(tc, name, surname, currentExamDate, nextExamDate, null);
    }
}

function addEmployeeToWorkplace(tc, name, surname, currentExamDate, nextExamDate, ek2Data) {
    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace) return;

    if (!workplace.employees) workplace.employees = [];
    
    const newEmployee = {
        id: generateId(),
        tc: tc,
        name: name,
        surname: surname,
        currentExamDate: currentExamDate,
        nextExamDate: nextExamDate,
        ek2: ek2Data
    };
    
    workplace.employees.push(newEmployee);
    saveWorkplaces();
    renderEmployeesTable(workplace.employees);
    addEmployeeModal.classList.add('hidden');
}

// Çalışan güncelle
function updateEmployee() {
    const employeeId = document.getElementById('editEmployeeId').value;
    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace) return;

    const employee = (workplace.employees || []).find(emp => emp.id === employeeId);
    if (!employee) return;

    employee.tc = document.getElementById('editEmployeeTc').value.trim();
    employee.name = document.getElementById('editEmployeeName').value.trim();
    employee.surname = document.getElementById('editEmployeeSurname').value.trim();
    employee.currentExamDate = document.getElementById('editCurrentExamDate').value.trim();
    employee.nextExamDate = document.getElementById('editNextExamDate').value.trim();
    
    saveWorkplaces();
    renderEmployeesTable(workplace.employees || []);
    editEmployeeModal.classList.add('hidden');
}

// Excel'e ver
function exportToExcel() {
    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace || !workplace.employees || workplace.employees.length === 0) {
        alert('Dışa aktarılacak veri bulunamadı!');
        return;
    }

    let csvContent = "S.No,TC Kimlik No,Ad Soyad,Mevcut Muayene Tarihi,Sonraki Muayene Tarihi\n";
    
    workplace.employees.forEach((employee, index) => {
        const row = [
            index + 1,
            employee.tc,
            `${employee.name} ${employee.surname}`,
            formatDate(employee.currentExamDate),
            formatDate(employee.nextExamDate)
        ].join(',');
        csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${workplace.name}_calisan_listesi.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Excel'den al
function importFromExcel() {
    const workplace = state.workplaces.find(wp => wp.id === state.currentWorkplace);
    if (!workplace) {
        alert('Önce bir işyeri seçmelisiniz!');
        return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx,.xls';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target.result;
                const lines = data.split('\n');
                const newEmployees = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    
                    const columns = lines[i].split(',');
                    if (columns.length < 5) continue;
                    
                    newEmployees.push({
                        id: generateId(),
                        tc: columns[1]?.trim() || '',
                        name: columns[2]?.split(' ')[0]?.trim() || '',
                        surname: columns[2]?.split(' ').slice(1).join(' ')?.trim() || '',
                        currentExamDate: columns[3]?.trim() || '',
                        nextExamDate: columns[4]?.trim() || '',
                        ek2: null
                    });
                }
                
                if (!workplace.employees) workplace.employees = [];
                workplace.employees = [...workplace.employees, ...newEmployees];
                saveWorkplaces();
                renderEmployeesTable(workplace.employees);
                alert(`${newEmployees.length} çalışan başarıyla içe aktarıldı.`);
            } catch (error) {
                console.error('Excel import error:', error);
                alert('Dosya okunurken bir hata oluştu. Lütfen formatı kontrol edin.');
            }
        };
        
        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            // Basit CSV işleme - gerçek bir Excel dosyası için daha karmaşık bir parser gerekir
            alert('Lütfen CSV formatında dosya yükleyin. Excel dosyaları desteklenmiyor.');
        }
    });
    
    fileInput.click();
}

// Yedek al
function createBackup() {
    const backupData = {
        doctorInfo: state.doctorInfo,
        workplaces: state.workplaces,
        backupDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `isyeri_hekimligi_yedek_${new Date().toISOString().slice(0,10)}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Yedekten dön
function restoreFromBackup() {
    if (!confirm('Mevcut tüm verileriniz yedekle değiştirilecek. Devam etmek istiyor musunuz?')) return;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backupData = JSON.parse(event.target.result);
                
                if (backupData.doctorInfo) {
                    state.doctorInfo = backupData.doctorInfo;
                    localStorage.setItem('doctorInfo', JSON.stringify(state.doctorInfo));
                    populateDoctorInfoForm();
                }
                
                if (backupData.workplaces) {
                    state.workplaces = backupData.workplaces;
                    localStorage.setItem('workplaces', JSON.stringify(state.workplaces));
                    renderWorkplacesList();
                }
                
                alert('Yedek başarıyla geri yüklendi.');
            } catch (error) {
                console.error('Backup restore error:', error);
                alert('Yedek dosyası okunurken bir hata oluştu. Lütfen dosyayı kontrol edin.');
            }
        };
        reader.readAsText(file);
    });
    
    fileInput.click();
}

// İşyerlerini kaydet
function saveWorkplaces() {
    localStorage.setItem('workplaces', JSON.stringify(state.workplaces));
}

// Benzersiz ID oluştur
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
