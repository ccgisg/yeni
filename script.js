// Genel Değişkenler
let currentWorkplace = null;
let workplaces = JSON.parse(localStorage.getItem('workplaces')) || [];
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let doctorInfo = JSON.parse(localStorage.getItem('doctorInfo')) || {};
let password = "hekim123"; // Basit şifre

// DOM Elementleri
const loginModal = document.getElementById('loginModal');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');

const monthlyTasksBtn = document.getElementById('monthlyTasksBtn');
const monthlyTasksDropdown = document.getElementById('monthlyTasksDropdown');
const workplacesList = document.getElementById('workplacesList');
const addWorkplaceBtn = document.getElementById('addWorkplaceBtn');
const settingsBtn = document.getElementById('settingsBtn');
const logoutBtn = document.getElementById('logoutBtn');
const contentArea = document.getElementById('contentArea');

const workplaceModal = document.getElementById('workplaceModal');
const workplaceName = document.getElementById('workplaceName');
const workplaceSgkNo = document.getElementById('workplaceSgkNo');
const workplaceAddress = document.getElementById('workplaceAddress');
const workplacePhone = document.getElementById('workplacePhone');
const workplaceEmail = document.getElementById('workplaceEmail');
const saveWorkplaceBtn = document.getElementById('saveWorkplaceBtn');
const cancelWorkplaceBtn = document.getElementById('cancelWorkplaceBtn');

const employeeModal = document.getElementById('employeeModal');
const employeeTcNo = document.getElementById('employeeTcNo');
const employeeName = document.getElementById('employeeName');
const employeeBirthInfo = document.getElementById('employeeBirthInfo');
const employeeGender = document.getElementById('employeeGender');
const employeeLastExam = document.getElementById('employeeLastExam');
const employeeNextExam = document.getElementById('employeeNextExam');
const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
const cancelEmployeeBtn = document.getElementById('cancelEmployeeBtn');

const settingsModal = document.getElementById('settingsModal');
const doctorName = document.getElementById('doctorName');
const diplomaNo = document.getElementById('diplomaNo');
const diplomaDate = document.getElementById('diplomaDate');
const registrationNo = document.getElementById('registrationNo');
const registrationDate = document.getElementById('registrationDate');
const certificateNo = document.getElementById('certificateNo');
const certificateDate = document.getElementById('certificateDate');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Şifre kontrolü için login modalını göster
    loginModal.style.display = 'block';
    
    // Doktor bilgilerini yükle
    loadDoctorInfo();
    
    // Aylık klasörleri oluştur
    setupMonthlyFolders();
    
    // İşyeri listesini yükle
    loadWorkplaces();
});

// Giriş Butonu
loginBtn.addEventListener('click', () => {
    if (passwordInput.value === password) {
        loginModal.style.display = 'none';
    } else {
        alert('Hatalı şifre!');
    }
});

// Aylık İşler Butonu
monthlyTasksBtn.addEventListener('click', () => {
    monthlyTasksDropdown.style.display = monthlyTasksDropdown.style.display === 'block' ? 'none' : 'block';
});

// İşyeri Ekle Butonu
addWorkplaceBtn.addEventListener('click', () => {
    workplaceModalTitle.textContent = 'İşyeri Ekle';
    workplaceName.value = '';
    workplaceSgkNo.value = '';
    workplaceAddress.value = '';
    workplacePhone.value = '';
    workplaceEmail.value = '';
    workplaceModal.style.display = 'block';
});

// Ayarlar Butonu
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

// Çıkış Butonu
logoutBtn.addEventListener('click', () => {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        window.location.reload();
    }
});

// İşyeri Kaydet Butonu
saveWorkplaceBtn.addEventListener('click', () => {
    const newWorkplace = {
        id: Date.now(),
        name: workplaceName.value,
        sgkNo: workplaceSgkNo.value,
        address: workplaceAddress.value,
        phone: workplacePhone.value,
        email: workplaceEmail.value
    };
    
    workplaces.push(newWorkplace);
    saveWorkplaces();
    loadWorkplaces();
    workplaceModal.style.display = 'none';
});

// İşyeri İptal Butonu
cancelWorkplaceBtn.addEventListener('click', () => {
    workplaceModal.style.display = 'none';
});

// Çalışan Kaydet Butonu
saveEmployeeBtn.addEventListener('click', () => {
    const newEmployee = {
        workplaceId: currentWorkplace,
        tcNo: employeeTcNo.value,
        name: employeeName.value,
        birthInfo: employeeBirthInfo.value,
        gender: employeeGender.value,
        lastExam: employeeLastExam.value,
        nextExam: employeeNextExam.value,
        ek2Data: null
    };
    
    employees.push(newEmployee);
    saveEmployees();
    loadEmployees(currentWorkplace);
    employeeModal.style.display = 'none';
});

// Çalışan İptal Butonu
cancelEmployeeBtn.addEventListener('click', () => {
    employeeModal.style.display = 'none';
});

// Ayarları Kaydet Butonu
saveSettingsBtn.addEventListener('click', () => {
    doctorInfo = {
        name: doctorName.value,
        diplomaNo: diplomaNo.value,
        diplomaDate: diplomaDate.value,
        registrationNo: registrationNo.value,
        registrationDate: registrationDate.value,
        certificateNo: certificateNo.value,
        certificateDate: certificateDate.value
    };
    
    localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
    settingsModal.style.display = 'none';
});

// Ayarları İptal Butonu
cancelSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Aylık Klasörleri Oluştur
function setupMonthlyFolders() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Eğer ayın 15'inden sonraysa bir sonraki ayın klasörünü de ekle
    const monthsToShow = now.getDate() > 15 ? 
        [currentMonth, (currentMonth + 1) % 12] : 
        [currentMonth];
    
    monthlyTasksDropdown.innerHTML = '';
    
    monthsToShow.forEach(month => {
        const monthName = getMonthName(month);
        const year = month < currentMonth || (now.getDate() > 15 && month === (currentMonth + 1) % 12) ? 
            currentYear + 1 : 
            currentYear;
            
        const monthItem = document.createElement('a');
        monthItem.href = '#';
        monthItem.textContent = `${year} ${monthName}`;
        monthItem.addEventListener('click', () => {
            alert(`${year} ${monthName} ayı seçildi`);
        });
        
        monthlyTasksDropdown.appendChild(monthItem);
    });
}

// Ay ismini al
function getMonthName(monthIndex) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[monthIndex];
}

// İşyerlerini Yükle
function loadWorkplaces() {
    workplacesList.innerHTML = '';
    
    workplaces.forEach(workplace => {
        const workplaceItem = document.createElement('div');
        workplaceItem.className = 'workplace-item';
        workplaceItem.textContent = workplace.name;
        workplaceItem.addEventListener('click', () => {
            currentWorkplace = workplace.id;
            showWorkplace(workplace);
        });
        
        workplacesList.appendChild(workplaceItem);
    });
}

// İşyeri Detaylarını Göster
function showWorkplace(workplace) {
    contentArea.innerHTML = `
        <div class="workplace-header">
            <h2>${workplace.name}</h2>
            <div class="workplace-actions">
                <button id="importExcelBtn" class="action-btn">Excel'den Al</button>
                <button id="exportExcelBtn" class="action-btn">Excel'e Ver</button>
                <button id="backupBtn" class="action-btn">Yedek Al</button>
                <button id="restoreBtn" class="action-btn">Yedekten Dön</button>
                <button id="addEmployeeBtn" class="action-btn">Çalışan Ekle</button>
                <button id="backToMainBtn" class="action-btn">Geri</button>
            </div>
        </div>
        <div id="employeesTableContainer"></div>
    `;
    
    // Buton event listener'larını ekle
    document.getElementById('addEmployeeBtn').addEventListener('click', () => {
        employeeModalTitle.textContent = 'Çalışan Ekle';
        employeeTcNo.value = '';
        employeeName.value = '';
        employeeBirthInfo.value = '';
        employeeGender.value = '';
        employeeLastExam.value = '';
        employeeNextExam.value = '';
        employeeModal.style.display = 'block';
    });
    
    document.getElementById('backToMainBtn').addEventListener('click', () => {
        currentWorkplace = null;
        contentArea.innerHTML = `
            <h1>Hoş Geldiniz</h1>
            <p>Soldaki menüden işyerlerinizi seçebilir veya yeni işyeri ekleyebilirsiniz.</p>
        `;
    });
    
    document.getElementById('importExcelBtn').addEventListener('click', importFromExcel);
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
    document.getElementById('backupBtn').addEventListener('click', createBackup);
    document.getElementById('restoreBtn').addEventListener('click', restoreFromBackup);
    
    // Çalışan listesini yükle
    loadEmployees(workplace.id);
}

// Çalışanları Yükle
function loadEmployees(workplaceId) {
    const container = document.getElementById('employeesTableContainer');
    if (!container) return;
    
    const workplaceEmployees = employees.filter(emp => emp.workplaceId === workplaceId);
    
    let tableHTML = `
        <table class="employee-table">
            <thead>
                <tr>
                    <th>Sıra No</th>
                    <th>TC Kimlik No</th>
                    <th>Ad Soyad</th>
                    <th>Mevcut Muayene Tarihi</th>
                    <th>Sonraki Muayene Tarihi</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    workplaceEmployees.forEach((emp, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${emp.tcNo}</td>
                <td>${emp.name}</td>
                <td>${emp.lastExam || '-'}</td>
                <td>${emp.nextExam || '-'}</td>
                <td>
                    <button class="table-btn btn-ek2" onclick="showEk2Form(${emp.tcNo})">EK-2</button>
                    <button class="table-btn btn-show" onclick="showEmployee(${emp.tcNo})">Göster</button>
                    <button class="table-btn btn-edit" onclick="editEmployee(${emp.tcNo})">Düzenle</button>
                    <button class="table-btn btn-delete" onclick="deleteEmployee(${emp.tcNo})">Sil</button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// Çalışan Göster
function showEmployee(tcNo) {
    const employee = employees.find(emp => emp.tcNo === tcNo.toString());
    if (employee) {
        alert(`Çalışan Bilgileri:\nTC: ${employee.tcNo}\nAd Soyad: ${employee.name}\nDoğum: ${employee.birthInfo}\nCinsiyet: ${employee.gender}\nSon Muayene: ${employee.lastExam}\nSonraki Muayene: ${employee.nextExam}`);
    }
}

// Çalışan Düzenle
function editEmployee(tcNo) {
    const employee = employees.find(emp => emp.tcNo === tcNo.toString());
    if (employee) {
        employeeModalTitle.textContent = 'Çalışan Düzenle';
        employeeTcNo.value = employee.tcNo;
        employeeName.value = employee.name;
        employeeBirthInfo.value = employee.birthInfo;
        employeeGender.value = employee.gender;
        employeeLastExam.value = employee.lastExam;
        employeeNextExam.value = employee.nextExam;
        employeeModal.style.display = 'block';
    }
}

// Çalışan Sil
function deleteEmployee(tcNo) {
    if (confirm('Bu çalışanı silmek istediğinize emin misiniz?')) {
        employees = employees.filter(emp => emp.tcNo !== tcNo.toString());
        saveEmployees();
        loadEmployees(currentWorkplace);
    }
}

// EK-2 Formunu Göster
function showEk2Form(tcNo) {
    const employee = employees.find(emp => emp.tcNo === tcNo.toString());
    if (employee) {
        // Burada EK-2 formunu doldurup gösterebilirsiniz
        // Örnek olarak basit bir alert gösteriyoruz
        alert(`EK-2 Formu:\nÇalışan: ${employee.name}\nTC: ${employee.tcNo}\n\nBurada EK-2 formu gösterilecek.`);
    }
}

// Excel'den İçe Aktar
function importFromExcel() {
    alert('Excel verisi içe aktarılacak. Bu işlev tam olarak uygulanmadı.');
}

// Excel'e Dışa Aktar
function exportToExcel() {
    alert('Excel verisi dışa aktarılacak. Bu işlev tam olarak uygulanmadı.');
}

// Yedek Oluştur
function createBackup() {
    const backupData = {
        workplaces: workplaces,
        employees: employees,
        doctorInfo: doctorInfo
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `isyeri_hekimligi_yedek_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}

// Yedekten Geri Yükle
function restoreFromBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const backupData = JSON.parse(event.target.result);
                
                if (backupData.workplaces && backupData.employees && backupData.doctorInfo) {
                    if (confirm('Yedekten geri yükleme yapılacak. Mevcut verileriniz silinecek. Devam etmek istiyor musunuz?')) {
                        workplaces = backupData.workplaces;
                        employees = backupData.employees;
                        doctorInfo = backupData.doctorInfo;
                        
                        localStorage.setItem('workplaces', JSON.stringify(workplaces));
                        localStorage.setItem('employees', JSON.stringify(employees));
                        localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
                        
                        loadWorkplaces();
                        loadDoctorInfo();
                        alert('Yedek başarıyla geri yüklendi.');
                    }
                } else {
                    alert('Geçersiz yedek dosyası!');
                }
            } catch (error) {
                alert('Yedek dosyası okunurken hata oluştu: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Doktor Bilgilerini Yükle
function loadDoctorInfo() {
    if (doctorInfo.name) doctorName.value = doctorInfo.name;
    if (doctorInfo.diplomaNo) diplomaNo.value = doctorInfo.diplomaNo;
    if (doctorInfo.diplomaDate) diplomaDate.value = doctorInfo.diplomaDate;
    if (doctorInfo.registrationNo) registrationNo.value = doctorInfo.registrationNo;
    if (doctorInfo.registrationDate) registrationDate.value = doctorInfo.registrationDate;
    if (doctorInfo.certificateNo) certificateNo.value = doctorInfo.certificateNo;
    if (doctorInfo.certificateDate) certificateDate.value = doctorInfo.certificateDate;
}

// Verileri Kaydet
function saveWorkplaces() {
    localStorage.setItem('workplaces', JSON.stringify(workplaces));
}

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}
