// Uygulama verileri
let appData = {
    doctorInfo: {
        name: "",
        diplomaDate: "",
        diplomaRegDate: "",
        workplaceDoctorCert: ""
    },
    workplaces: [],
    currentWorkplace: null,
    currentEmployee: null,
    password: "1234" // Varsayılan şifre
};

// DOM Elementleri
const passwordScreen = document.getElementById('passwordScreen');
const mainApp = document.getElementById('mainApp');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');
const logoutButton = document.getElementById('logoutButton');
const monthlyWorksBtn = document.getElementById('monthlyWorksBtn');
const monthlyWorksMenu = document.getElementById('monthlyWorksMenu');
const workplacesList = document.getElementById('workplacesList');
const addWorkplaceBtn = document.getElementById('addWorkplaceBtn');
const settingsBtn = document.getElementById('settingsBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const workplaceDetail = document.getElementById('workplaceDetail');
const workplaceTitle = document.getElementById('workplaceTitle');
const backButton = document.getElementById('backButton');
const employeesTable = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const importExcelBtn = document.getElementById('importExcelBtn');
const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const settingsForm = document.getElementById('settingsForm');
const doctorInfoForm = document.getElementById('doctorInfoForm');
const doctorName = document.getElementById('doctorName');
const diplomaDate = document.getElementById('diplomaDate');
const diplomaRegDate = document.getElementById('diplomaRegDate');
const workplaceDoctorCert = document.getElementById('workplaceDoctorCert');
const employeeForm = document.getElementById('employeeForm');
const employeeFormTitle = document.getElementById('employeeFormTitle');
const employeeDataForm = document.getElementById('employeeDataForm');
const employeeId = document.getElementById('employeeId');
const employeeTC = document.getElementById('employeeTC');
const employeeName = document.getElementById('employeeName');
const currentExam = document.getElementById('currentExam');
const nextExam = document.getElementById('nextExam');
const ek2File = document.getElementById('ek2File');
const workplaceForm = document.getElementById('workplaceForm');
const workplaceFormTitle = document.getElementById('workplaceFormTitle');
const workPlaceDataForm = document.getElementById('workplaceDataForm');
const workplaceId = document.getElementById('workplaceId');
const workplaceName = document.getElementById('workplaceName');
const workplaceSGK = document.getElementById('workplaceSGK');
const workplaceAddress = document.getElementById('workplaceAddress');

// Modal kapatma butonları
const closeButtons = document.querySelectorAll('.close-btn');
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Şifre girişi kontrolü
loginButton.addEventListener('click', function() {
    if (passwordInput.value === appData.password) {
        passwordScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        loadData();
        initializeMonths();
    } else {
        loginError.textContent = 'Hatalı şifre! Lütfen tekrar deneyin.';
    }
});

// Çıkış butonu
logoutButton.addEventListener('click', function() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        mainApp.style.display = 'none';
        passwordScreen.style.display = 'flex';
        passwordInput.value = '';
        loginError.textContent = '';
    }
});

// Aylık işler menüsü toggle
monthlyWorksBtn.addEventListener('click', function() {
    monthlyWorksMenu.style.display = monthlyWorksMenu.style.display === 'block' ? 'none' : 'block';
});

// Ayarlar butonu
settingsBtn.addEventListener('click', function() {
    welcomeScreen.style.display = 'none';
    workplaceDetail.style.display = 'none';
    settingsForm.style.display = 'block';
    
    // Formu doldur
    doctorName.value = appData.doctorInfo.name;
    diplomaDate.value = appData.doctorInfo.diplomaDate;
    diplomaRegDate.value = appData.doctorInfo.diplomaRegDate;
    workplaceDoctorCert.value = appData.doctorInfo.workplaceDoctorCert;
});

// Doktor bilgilerini kaydet
doctorInfoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    appData.doctorInfo = {
        name: doctorName.value,
        diplomaDate: diplomaDate.value,
        diplomaRegDate: diplomaRegDate.value,
        workplaceDoctorCert: workplaceDoctorCert.value
    };
    
    saveData();
    alert('Doktor bilgileri kaydedildi!');
    settingsForm.style.display = 'none';
    welcomeScreen.style.display = 'block';
});

// İşyeri ekle butonu
addWorkplaceBtn.addEventListener('click', function() {
    workplaceFormTitle.textContent = 'İşyeri Ekle';
    workplaceId.value = '';
    workplaceName.value = '';
    workplaceSGK.value = '';
    workplaceAddress.value = '';
    workplaceForm.style.display = 'flex';
});

// İşyeri formu gönderimi
workPlaceDataForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const workplaceData = {
        id: workplaceId.value || Date.now().toString(),
        name: workplaceName.value,
        sgkNo: workplaceSGK.value,
        address: workplaceAddress.value,
        employees: workplaceId.value ? 
            appData.workplaces.find(w => w.id === workplaceId.value).employees || [] : []
    };
    
    if (workplaceId.value) {
        // Düzenleme
        const index = appData.workplaces.findIndex(w => w.id === workplaceId.value);
        appData.workplaces[index] = workplaceData;
    } else {
        // Ekleme
        appData.workplaces.push(workplaceData);
    }
    
    saveData();
    workplaceForm.style.display = 'none';
    renderWorkplacesList();
});

// İşyeri detayına git
function openWorkplaceDetail(id) {
    const workplace = appData.workplaces.find(w => w.id === id);
    if (workplace) {
        appData.currentWorkplace = workplace;
        workplaceTitle.textContent = workplace.name;
        welcomeScreen.style.display = 'none';
        settingsForm.style.display = 'none';
        workplaceDetail.style.display = 'block';
        renderEmployeesTable();
    }
}

// Geri butonu
backButton.addEventListener('click', function() {
    workplaceDetail.style.display = 'none';
    welcomeScreen.style.display = 'block';
    appData.currentWorkplace = null;
});

// Çalışan ekle butonu
addEmployeeBtn.addEventListener('click', function() {
    employeeFormTitle.textContent = 'Kişi Ekle';
    employeeId.value = '';
    employeeTC.value = '';
    employeeName.value = '';
    currentExam.value = '';
    nextExam.value = '';
    ek2File.value = '';
    employeeForm.style.display = 'flex';
});

// Çalışan formu gönderimi
employeeDataForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const employeeData = {
        id: employeeId.value || Date.now().toString(),
        tc: employeeTC.value,
        name: employeeName.value,
        currentExam: currentExam.value,
        nextExam: nextExam.value,
        ek2File: employeeId.value ? 
            appData.currentWorkplace.employees.find(e => e.id === employeeId.value).ek2File || null : null
    };
    
    // EK-2 dosyasını işle
    if (ek2File.files.length > 0) {
        const file = ek2File.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            employeeData.ek2File = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result.split(',')[1] // Base64 verisi
            };
            
            saveEmployee(employeeData);
        };
        reader.readAsDataURL(file);
    } else {
        saveEmployee(employeeData);
    }
});

function saveEmployee(employeeData) {
    if (employeeId.value) {
        // Düzenleme
        const index = appData.currentWorkplace.employees.findIndex(e => e.id === employeeId.value);
        appData.currentWorkplace.employees[index] = employeeData;
    } else {
        // Ekleme
        appData.currentWorkplace.employees.push(employeeData);
    }
    
    saveData();
    employeeForm.style.display = 'none';
    renderEmployeesTable();
}

// Çalışan düzenle
function editEmployee(id) {
    const employee = appData.currentWorkplace.employees.find(e => e.id === id);
    if (employee) {
        appData.currentEmployee = employee;
        employeeFormTitle.textContent = 'Kişi Düzenle';
        employeeId.value = employee.id;
        employeeTC.value = employee.tc;
        employeeName.value = employee.name;
        currentExam.value = employee.currentExam;
        nextExam.value = employee.nextExam;
        ek2File.value = '';
        employeeForm.style.display = 'flex';
    }
}

// Çalışan sil
function deleteEmployee(id) {
    if (confirm('Bu kişiyi silmek istediğinize emin misiniz?')) {
        appData.currentWorkplace.employees = appData.currentWorkplace.employees.filter(e => e.id !== id);
        saveData();
        renderEmployeesTable();
    }
}

// EK-2 görüntüle
function viewEk2(id) {
    const employee = appData.currentWorkplace.employees.find(e => e.id === id);
    if (employee && employee.ek2File) {
        // Base64 verisini kullanarak dosyayı aç
        const byteCharacters = atob(employee.ek2File.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: employee.ek2File.type});
        const url = URL.createObjectURL(blob);
        
        // Yeni pencerede aç
        window.open(url, '_blank');
    } else {
        alert('Bu kişi için EK-2 dosyası bulunamadı.');
    }
}

// EK-2 yükle
function uploadEk2(id) {
    const employee = appData.currentWorkplace.employees.find(e => e.id === id);
    if (employee) {
        appData.currentEmployee = employee;
        employeeFormTitle.textContent = 'EK-2 Yükle';
        employeeId.value = employee.id;
        employeeTC.value = employee.tc;
        employeeName.value = employee.name;
        currentExam.value = employee.currentExam;
        nextExam.value = employee.nextExam;
        ek2File.value = '';
        employeeTC.disabled = true;
        employeeName.disabled = true;
        currentExam.disabled = true;
        nextExam.disabled = true;
        employeeForm.style.display = 'flex';
    }
}

// Excel'e ver
exportExcelBtn.addEventListener('click', function() {
    if (!appData.currentWorkplace) return;
    
    let csv = 'S.No,TC Kimlik No,Ad Soyad,Mevcut Muayene,Sonraki Muayene\n';
    
    appData.currentWorkplace.employees.forEach((emp, index) => {
        csv += `${index + 1},${emp.tc},"${emp.name}",${emp.currentExam},${emp.nextExam}\n`;
    });
    
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${appData.currentWorkplace.name}_calisan_listesi.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Excel'den al
importExcelBtn.addEventListener('click', function() {
    if (!appData.currentWorkplace) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, {type: 'binary'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            if (confirm(`${jsonData.length} kayıt bulundu. İçe aktarmak istiyor musunuz?`)) {
                jsonData.forEach(item => {
                    const employee = {
                        id: Date.now().toString(),
                        tc: item['TC Kimlik No'] || '',
                        name: item['Ad Soyad'] || '',
                        currentExam: item['Mevcut Muayene'] || '',
                        nextExam: item['Sonraki Muayene'] || '',
                        ek2File: null
                    };
                    
                    appData.currentWorkplace.employees.push(employee);
                });
                
                saveData();
                renderEmployeesTable();
                alert('Veriler başarıyla içe aktarıldı!');
            }
        };
        
        reader.readAsBinaryString(file);
    };
    
    input.click();
});

// Yedek al
backupBtn.addEventListener('click', function() {
    const dataStr = JSON.stringify(appData);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `isyeri_hekimligi_yedek_${new Date().toLocaleDateString('tr-TR')}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Yedekten dön
restoreBtn.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (confirm('Yedekten dönmek istediğinize emin misiniz? Mevcut verileriniz kaybolacak!')) {
                    appData = data;
                    saveData();
                    loadData();
                    if (appData.currentWorkplace) {
                        openWorkplaceDetail(appData.currentWorkplace.id);
                    }
                    alert('Yedek başarıyla yüklendi!');
                }
            } catch (error) {
                alert('Yedek dosyası okunamadı: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
});

// İşyeri listesini render et
function renderWorkplacesList() {
    workplacesList.innerHTML = '';
    
    appData.workplaces.forEach(workplace => {
        const item = document.createElement('div');
        item.className = 'workplace-item';
        item.innerHTML = `
            <span>${workplace.name}</span>
            <div class="workplace-actions">
                <button class="workplace-edit" onclick="editWorkplace('${workplace.id}', event)">✏️</button>
                <button class="workplace-delete" onclick="deleteWorkplace('${workplace.id}', event)">🗑️</button>
            </div>
        `;
        item.addEventListener('dblclick', () => openWorkplaceDetail(workplace.id));
        workplacesList.appendChild(item);
    });
}

// Çalışan tablosunu render et
function renderEmployeesTable() {
    employeesTable.innerHTML = '';
    
    if (!appData.currentWorkplace) return;
    
    appData.currentWorkplace.employees.forEach((employee, index) => {
        const row = employeesTable.insertRow();
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${employee.tc}</td>
            <td>${employee.name}</td>
            <td>${employee.currentExam}</td>
            <td>${employee.nextExam}</td>
            <td>
                <button class="action-btn upload-btn" onclick="uploadEk2('${employee.id}')">EK-2 Yükle</button>
                ${employee.ek2File ? `<button class="action-btn view-btn" onclick="viewEk2('${employee.id}')">EK-2 Göster</button>` : ''}
                <button class="action-btn edit-btn" onclick="editEmployee('${employee.id}')">Düzenle</button>
                <button class="action-btn delete-btn" onclick="deleteEmployee('${employee.id}')">Sil</button>
            </td>
        `;
    });
}

// İşyeri düzenle
function editWorkplace(id, event) {
    event.stopPropagation();
    const workplace = appData.workplaces.find(w => w.id === id);
    if (workplace) {
        workplaceFormTitle.textContent = 'İşyeri Düzenle';
        workplaceId.value = workplace.id;
        workplaceName.value = workplace.name;
        workplaceSGK.value = workplace.sgkNo || '';
        workplaceAddress.value = workplace.address || '';
        workplaceForm.style.display = 'flex';
    }
}

// İşyeri sil
function deleteWorkplace(id, event) {
    event.stopPropagation();
    if (confirm('Bu işyerini silmek istediğinize emin misiniz? Tüm çalışan verileri de silinecek!')) {
        appData.workplaces = appData.workplaces.filter(w => w.id !== id);
        saveData();
        renderWorkplacesList();
        
        if (appData.currentWorkplace && appData.currentWorkplace.id === id) {
            workplaceDetail.style.display = 'none';
            welcomeScreen.style.display = 'block';
            appData.currentWorkplace = null;
        }
    }
}

// Ayları başlat
function initializeMonths() {
    // DOM'un yüklendiğinden emin ol
    if (!monthlyWorksMenu) {
        setTimeout(initializeMonths, 100);
        return;
    }
    
    monthlyWorksMenu.innerHTML = '';
    
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    
    // Eğer ayın 15'inden sonraysa bir sonraki ayı da ekle
    if (now.getDate() > 15) {
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
    }
    
    // 12 ay ekle
    for (let i = 0; i < 12; i++) {
        const date = new Date(year, month - i, 1);
        const monthName = date.toLocaleDateString('tr-TR', {month: 'long'});
        const yearName = date.getFullYear();
        
        const monthItem = document.createElement('a');
        monthItem.href = '#';
        monthItem.textContent = `${yearName} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
        monthItem.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`${yearName} ${monthName} ayı seçildi`);
        });
        
        monthlyWorksMenu.appendChild(monthItem);
    }
    
    monthlyWorksMenu.style.display = 'none';
}

// Verileri yükle
function loadData() {
    const savedData = localStorage.getItem('isyeriHekimligiData');
    if (savedData) {
        try {
            appData = JSON.parse(savedData);
        } catch (e) {
            console.error('Veri yükleme hatası:', e);
        }
    }
    
    renderWorkplacesList();
    
    // Doktor bilgilerini yükle
    if (appData.doctorInfo) {
        doctorName.value = appData.doctorInfo.name || '';
        diplomaDate.value = appData.doctorInfo.diplomaDate || '';
        diplomaRegDate.value = appData.doctorInfo.diplomaRegDate || '';
        workplaceDoctorCert.value = appData.doctorInfo.workplaceDoctorCert || '';
    }
}

// Verileri kaydet
function saveData() {
    localStorage.setItem('isyeriHekimligiData', JSON.stringify(appData));
}

// Sayfa yüklendiğinde şifre ekranını göster
window.addEventListener('DOMContentLoaded', function() {
    passwordScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    
    // XLSX kütüphanesini yükle
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    document.head.appendChild(script);
});

// Global fonksiyonlar
window.editWorkplace = editWorkplace;
window.deleteWorkplace = deleteWorkplace;
window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;
window.viewEk2 = viewEk2;
window.uploadEk2 = uploadEk2;
