// Veri yapısı
let appData = {
    doctor: {
        name: "",
        diplomaInfo: "",
        diplomaRegInfo: "",
        workplaceDoctorCert: ""
    },
    workplaces: []
};

// DOM yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    // Giriş formu
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        // Basit şifre kontrolü (örnek şifre: "hekim123")
        if(password === "hekim123") {
            localStorage.setItem('loggedIn', 'true');
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            loadData();
        } else {
            alert('Hatalı şifre!');
        }
    });

    // Eğer giriş yapılmışsa ana uygulamayı göster
    if(localStorage.getItem('loggedIn')) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        loadData();
    }

    // Menü açma/kapama
    document.getElementById('monthlyTasks').addEventListener('click', function() {
        document.getElementById('monthlySubmenu').classList.toggle('show');
    });

    // Aylık işler menüsü
    document.querySelectorAll('.month-item').forEach(item => {
        item.addEventListener('click', function() {
            const month = this.getAttribute('data-month');
            showMonthlyTasks(month);
        });
    });

    // İşyeri ekleme butonu
    document.getElementById('addWorkplace').addEventListener('click', function() {
        document.getElementById('addWorkplaceModal').classList.remove('hidden');
    });

    // İşyeri kaydetme butonu
    document.getElementById('saveWorkplace').addEventListener('click', function() {
        const workplaceName = document.getElementById('newWorkplaceName').value.trim();
        if (workplaceName) {
            addWorkplace(workplaceName);
            document.getElementById('newWorkplaceName').value = '';
            document.getElementById('addWorkplaceModal').classList.add('hidden');
        } else {
            alert('İşyeri adı boş olamaz!');
        }
    });

    // Ayarlar butonu
    document.getElementById('settings').addEventListener('click', function() {
        showDoctorSettings();
    });

    // Doktor bilgilerini kaydetme
    document.getElementById('doctorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDoctorSettings();
    });

    // Modal kapatma butonları
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });

    // Excel işlemleri
    document.getElementById('importExcel').addEventListener('click', importFromExcel);
    document.getElementById('exportExcel').addEventListener('click', exportToExcel);
    document.getElementById('backup').addEventListener('click', backupData);
    document.getElementById('restore').addEventListener('click', restoreData);
});

// Verileri yükle
function loadData() {
    const savedData = localStorage.getItem('workplaceDoctorData');
    if (savedData) {
        appData = JSON.parse(savedData);
        renderWorkplaces();
        
        // Doktor bilgilerini doldur
        if (appData.doctor) {
            document.getElementById('doctorName').value = appData.doctor.name || '';
            document.getElementById('diplomaInfo').value = appData.doctor.diplomaInfo || '';
            document.getElementById('diplomaRegInfo').value = appData.doctor.diplomaRegInfo || '';
            document.getElementById('workplaceDoctorCert').value = appData.doctor.workplaceDoctorCert || '';
        }
    }
}

// Verileri kaydet
function saveData() {
    localStorage.setItem('workplaceDoctorData', JSON.stringify(appData));
}

// İşyeri ekle
function addWorkplace(name) {
    const newWorkplace = {
        id: Date.now(),
        name: name,
        employees: []
    };
    
    appData.workplaces.push(newWorkplace);
    saveData();
    renderWorkplaces();
}

// İşyerlerini listele
function renderWorkplaces() {
    const workplacesList = document.getElementById('workplacesList');
    workplacesList.innerHTML = '';
    
    appData.workplaces.forEach(workplace => {
        const workplaceItem = document.createElement('div');
        workplaceItem.className = 'menu-item workplace-item';
        workplaceItem.textContent = workplace.name;
        workplaceItem.setAttribute('data-id', workplace.id);
        
        workplaceItem.addEventListener('dblclick', function() {
            showWorkplaceDetails(workplace.id);
        });
        
        workplacesList.appendChild(workplaceItem);
    });
}

// İşyeri detaylarını göster
function showWorkplaceDetails(workplaceId) {
    const workplace = appData.workplaces.find(w => w.id === workplaceId);
    if (!workplace) return;
    
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <h2>${workplace.name} - Çalışan Listesi</h2>
        <table id="employeesTable">
            <thead>
                <tr>
                    <th>Sıra No</th>
                    <th>TC Kimlik No</th>
                    <th>İsim Soyisim</th>
                    <th>Mevcut Muayene Tarihi</th>
                    <th>Sonraki Muayene Tarihi</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
                ${workplace.employees.map((emp, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${emp.tcNo}</td>
                        <td>${emp.fullName}</td>
                        <td>${emp.currentExamDate}</td>
                        <td>${emp.nextExamDate}</td>
                        <td>
                            <button class="action-btn ek2-btn" data-id="${emp.id}">EK-2</button>
                            <button class="action-btn edit-btn" data-id="${emp.id}">Düzenle</button>
                            <button class="action-btn delete-btn" data-id="${emp.id}">Sil</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <button id="addEmployee">Çalışan Ekle</button>
    `;
    
    // Çalışan ekleme butonu
    document.getElementById('addEmployee').addEventListener('click', function() {
        document.getElementById('addEmployeeModal').classList.remove('hidden');
        document.getElementById('employeeForm').reset();
        document.getElementById('employeeForm').dataset.workplaceId = workplaceId;
        document.getElementById('employeeForm').dataset.employeeId = '';
    });
    
    // Çalışan işlem butonları
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const empId = parseInt(this.getAttribute('data-id'));
            editEmployee(workplaceId, empId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const empId = parseInt(this.getAttribute('data-id'));
            deleteEmployee(workplaceId, empId);
        });
    });
    
    document.querySelectorAll('.ek2-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const empId = parseInt(this.getAttribute('data-id'));
            showEk2Form(workplaceId, empId);
        });
    });
}

// Aylık işleri göster
function showMonthlyTasks(month) {
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
                       "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const monthName = monthNames[parseInt(month) - 1];
    
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
        <h2>${monthName} Ayı İşlerim</h2>
        <p>Bu ay yapılacak muayeneler ve diğer işler burada listelenecek.</p>
        <div id="monthlyTasksList"></div>
    `;
}

// Doktor ayarlarını göster
function showDoctorSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
}

// Doktor ayarlarını kaydet
function saveDoctorSettings() {
    appData.doctor = {
        name: document.getElementById('doctorName').value,
        diplomaInfo: document.getElementById('diplomaInfo').value,
        diplomaRegInfo: document.getElementById('diplomaRegInfo').value,
        workplaceDoctorCert: document.getElementById('workplaceDoctorCert').value
    };
    
    saveData();
    document.getElementById('settingsModal').classList.add('hidden');
    alert('Doktor bilgileri kaydedildi');
}

// Çalışan ekleme formunu göster
function showAddEmployeeForm(workplaceId) {
    document.getElementById('addEmployeeModal').classList.remove('hidden');
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeForm').dataset.workplaceId = workplaceId;
    document.getElementById('employeeForm').dataset.employeeId = '';
}

// Çalışan düzenleme formunu göster
function editEmployee(workplaceId, employeeId) {
    const workplace = appData.workplaces.find(w => w.id === workplaceId);
    if (!workplace) return;
    
    const employee = workplace.employees.find(e => e.id === employeeId);
    if (!employee) return;
    
    document.getElementById('addEmployeeModal').classList.remove('hidden');
    document.getElementById('employeeTcNo').value = employee.tcNo;
    document.getElementById('employeeFullName').value = employee.fullName;
    document.getElementById('currentExamDate').value = employee.currentExamDate;
    document.getElementById('nextExamDate').value = employee.nextExamDate;
    
    document.getElementById('employeeForm').dataset.workplaceId = workplaceId;
    document.getElementById('employeeForm').dataset.employeeId = employeeId;
}

// Çalışan kaydet
document.getElementById('employeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const workplaceId = parseInt(this.dataset.workplaceId);
    const employeeId = this.dataset.employeeId ? parseInt(this.dataset.employeeId) : Date.now();
    
    const employeeData = {
        id: employeeId,
        tcNo: document.getElementById('employeeTcNo').value,
        fullName: document.getElementById('employeeFullName').value,
        currentExamDate: document.getElementById('currentExamDate').value,
        nextExamDate: document.getElementById('nextExamDate').value
    };
    
    const workplace = appData.workplaces.find(w => w.id === workplaceId);
    if (!workplace) return;
    
    if (this.dataset.employeeId) {
        // Düzenleme
        const index = workplace.employees.findIndex(e => e.id === employeeId);
        if (index !== -1) {
            workplace.employees[index] = employeeData;
        }
    } else {
        // Yeni ekleme
        workplace.employees.push(employeeData);
    }
    
    saveData();
    document.getElementById('addEmployeeModal').classList.add('hidden');
    showWorkplaceDetails(workplaceId);
});

// Çalışan sil
function deleteEmployee(workplaceId, employeeId) {
    if (!confirm('Bu çalışanı silmek istediğinize emin misiniz?')) return;
    
    const workplace = appData.workplaces.find(w => w.id === workplaceId);
    if (!workplace) return;
    
    workplace.employees = workplace.employees.filter(e => e.id !== employeeId);
    saveData();
    showWorkplaceDetails(workplaceId);
}

// EK-2 formunu göster
function showEk2Form(workplaceId, employeeId) {
    const workplace = appData.workplaces.find(w => w.id === workplaceId);
    if (!workplace) return;
    
    const employee = workplace.employees.find(e => e.id === employeeId);
    if (!employee) return;
    
    // Burada EK-2 formu oluşturulacak
    alert('EK-2 formu oluşturulacak: ' + employee.fullName);
}

// Excel'den veri al
function importFromExcel() {
    alert('Excel\'den veri alma işlemi burada gerçekleştirilecek');
    // Burada SheetJS veya benzeri bir kütüphane kullanılabilir
}

// Excel'e veri aktar
function exportToExcel() {
    alert('Excel\'e veri aktarma işlemi burada gerçekleştirilecek');
    // Burada SheetJS veya benzeri bir kütüphane kullanılabilir
}

// Yedek al
function backupData() {
    const dataStr = JSON.stringify(appData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportName = 'isyeri_hekimligi_yedek_' + new Date().toISOString().slice(0, 10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
}

// Yedekten dön
function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                appData = data;
                saveData();
                loadData();
                alert('Yedek başarıyla yüklendi!');
            } catch (error) {
                alert('Yedek dosyası okunamadı: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}
