// Temel değişkenler
let currentWorkplace = null;
let workplaces = [];
let people = [];
let doctorInfo = {};
let isMonthlyMenuOpen = false;
const DEFAULT_PASSWORD = "1234"; // Basit bir şifre

// DOM yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Şifre ekranı işlemleri
    const passwordScreen = document.getElementById('passwordScreen');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const mainApp = document.getElementById('mainApp');

    // Şifre ekranını göster
    passwordScreen.style.display = 'block';

    // Giriş butonu event listener
    loginBtn.addEventListener('click', function() {
        if (passwordInput.value === DEFAULT_PASSWORD) {
            passwordScreen.style.display = 'none';
            mainApp.style.display = 'block';
            initializeApp();
        } else {
            loginError.textContent = "Hatalı şifre! Lütfen tekrar deneyin.";
        }
    });

    // Şifre alanında enter tuşuna basıldığında
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // Çıkış butonu event listener
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Çıkmak istediğinize emin misiniz?')) {
            mainApp.style.display = 'none';
            passwordScreen.style.display = 'block';
            passwordInput.value = '';
            loginError.textContent = '';
        }
    });
});

// Uygulamayı başlatma fonksiyonu
function initializeApp() {
    // Klasör oluşturma işlemi (Electron veya başka bir yöntemle masaüstünde klasör oluşturulabilir)
    // Bu örnekte sadece tarayıcıda çalışan bir simülasyon yapıyoruz
    
    // Doktor bilgilerini yükle
    loadDoctorInfo();
    
    // İşyerlerini yükle
    loadWorkplaces();
    
    // Aylık işler menüsünü başlat
    initializeMonths();
    
    // Event listener'ları ekle
    setupEventListeners();
}

// Doktor bilgilerini yükle
function loadDoctorInfo() {
    const savedInfo = localStorage.getItem('doctorInfo');
    if (savedInfo) {
        doctorInfo = JSON.parse(savedInfo);
        // Formu doldur
        document.getElementById('doctorName').value = doctorInfo.name || '';
        document.getElementById('diplomaNo').value = doctorInfo.diplomaNo || '';
        document.getElementById('diplomaDate').value = doctorInfo.diplomaDate || '';
        document.getElementById('certificateNo').value = doctorInfo.certificateNo || '';
        document.getElementById('certificateDate').value = doctorInfo.certificateDate || '';
    }
}

// İşyerlerini yükle
function loadWorkplaces() {
    const savedWorkplaces = localStorage.getItem('workplaces');
    if (savedWorkplaces) {
        workplaces = JSON.parse(savedWorkplaces);
        renderWorkplacesList();
    }
}

// Aylık işler menüsünü başlat
function initializeMonths() {
    const monthlyWorksMenu = document.getElementById('monthlyWorksMenu');
    if (!monthlyWorksMenu) {
        console.error("Monthly works menu element not found!");
        return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();
    
    // 15'inden sonra bir sonraki ayı da ekle
    const monthsToShow = currentDay > 15 ? 13 : 12;
    
    monthlyWorksMenu.innerHTML = '';
    
    for (let i = 0; i < monthsToShow; i++) {
        const date = new Date(currentYear, currentMonth + i, 1);
        const monthName = getMonthName(date.getMonth());
        const year = date.getFullYear();
        
        const monthElement = document.createElement('div');
        monthElement.className = 'month-item';
        monthElement.textContent = `${monthName} ${year}`;
        monthElement.dataset.month = date.getMonth();
        monthElement.dataset.year = year;
        
        monthElement.addEventListener('click', function() {
            openMonthlyDocuments(monthName, year);
        });
        
        monthlyWorksMenu.appendChild(monthElement);
    }
}

// Ay ismini al
function getMonthName(monthIndex) {
    const months = [
        'OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN',
        'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'
    ];
    return months[monthIndex];
}

// İşyerlerini listele
function renderWorkplacesList() {
    const workplacesList = document.getElementById('workplacesList');
    workplacesList.innerHTML = '';
    
    workplaces.forEach((workplace, index) => {
        const workplaceElement = document.createElement('div');
        workplaceElement.className = 'workplace-item';
        workplaceElement.textContent = workplace.name;
        workplaceElement.dataset.id = workplace.id;
        
        workplaceElement.addEventListener('dblclick', function() {
            openWorkplace(workplace.id);
        });
        
        // Düzenle ve sil butonları
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'workplace-actions';
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Düzenle';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            editWorkplace(index);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Sil';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteWorkplace(index);
        });
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        workplaceElement.appendChild(actionsDiv);
        
        workplacesList.appendChild(workplaceElement);
    });
}

// İşyeri aç
function openWorkplace(workplaceId) {
    currentWorkplace = workplaces.find(w => w.id === workplaceId);
    if (!currentWorkplace) return;
    
    document.getElementById('workplaceTitle').textContent = currentWorkplace.name;
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('workplaceContent').style.display = 'block';
    document.getElementById('settingsContent').style.display = 'none';
    document.getElementById('monthlyDocumentsContent').style.display = 'none';
    
    // Kişileri yükle
    loadPeople(workplaceId);
}

// Kişileri yükle
function loadPeople(workplaceId) {
    const savedPeople = localStorage.getItem(`people_${workplaceId}`);
    people = savedPeople ? JSON.parse(savedPeople) : [];
    renderPeopleTable();
}

// Kişi tablosunu oluştur
function renderPeopleTable() {
    const tableBody = document.querySelector('#peopleTable tbody');
    tableBody.innerHTML = '';
    
    people.forEach((person, index) => {
        const row = document.createElement('tr');
        
        // S.No
        const snoCell = document.createElement('td');
        snoCell.textContent = index + 1;
        row.appendChild(snoCell);
        
        // TC Kimlik No
        const tcCell = document.createElement('td');
        tcCell.textContent = person.tc;
        row.appendChild(tcCell);
        
        // Ad Soyad
        const nameCell = document.createElement('td');
        nameCell.textContent = person.name;
        row.appendChild(nameCell);
        
        // Mevcut Muayene Tarihi
        const currentDateCell = document.createElement('td');
        currentDateCell.textContent = person.currentExamDate;
        row.appendChild(currentDateCell);
        
        // Sonraki Muayene Tarihi
        const nextDateCell = document.createElement('td');
        nextDateCell.textContent = person.nextExamDate;
        row.appendChild(nextDateCell);
        
        // İşlemler
        const actionsCell = document.createElement('td');
        
        // Ek-2 Butonu
        const ek2Btn = document.createElement('button');
        ek2Btn.textContent = 'Ek-2';
        ek2Btn.className = 'action-btn ek2-btn';
        ek2Btn.addEventListener('click', function() {
            generateEk2Document(person);
        });
        
        // Ek-2 Göster Butonu
        const showEk2Btn = document.createElement('button');
        showEk2Btn.textContent = 'Ek-2 Göster';
        showEk2Btn.className = 'action-btn ek2-btn';
        showEk2Btn.addEventListener('click', function() {
            showEk2Documents(person.tc);
        });
        
        // Düzenle Butonu
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Düzenle';
        editBtn.className = 'action-btn edit-btn';
        editBtn.addEventListener('click', function() {
            editPerson(index);
        });
        
        // Sil Butonu
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Sil';
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.addEventListener('click', function() {
            deletePerson(index);
        });
        
        actionsCell.appendChild(ek2Btn);
        actionsCell.appendChild(showEk2Btn);
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        tableBody.appendChild(row);
    });
}

// Aylık belgeleri aç
function openMonthlyDocuments(monthName, year) {
    document.getElementById('monthlyTitle').textContent = `${monthName} ${year} Belgeleri`;
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('workplaceContent').style.display = 'none';
    document.getElementById('settingsContent').style.display = 'none';
    document.getElementById('monthlyDocumentsContent').style.display = 'block';
    
    const documentsList = document.getElementById('monthlyDocumentsList');
    documentsList.innerHTML = '';
    
    const documents = [
        'Çasmer Mutabakat.docx',
        'Çasmer Puantaj.xlsx',
        'Genel Hijyen ve Saha Denetim Formu.xlsx',
        'Mutfak Hijyen Denetim Formu.xlsx',
        'Tuvalet Hijyen Denetim Formu.xlsx'
    ];
    
    documents.forEach(doc => {
        const docElement = document.createElement('div');
        docElement.className = 'document-card';
        
        const docTitle = document.createElement('h3');
        docTitle.textContent = `${monthName} ${year} ${doc}`;
        docElement.appendChild(docTitle);
        
        const docInfo = document.createElement('p');
        docInfo.textContent = `Son güncelleme: ${new Date().toLocaleDateString()}`;
        docElement.appendChild(docInfo);
        
        docElement.addEventListener('click', function() {
            // Burada belge açma işlemi simüle ediliyor
            alert(`${monthName} ${year} ${doc} belgesi açılıyor...`);
        });
        
        documentsList.appendChild(docElement);
    });
}

// Ek-2 belgesi oluştur
function generateEk2Document(person) {
    // Burada gerçekte ccgisg_ek_2.docx dosyasını açıp düzenlemek gerekir
    // Simülasyon olarak bir uyarı gösteriyoruz
    alert(`Ek-2 belgesi oluşturuluyor:\nTC: ${person.tc}\nAd Soyad: ${person.name}`);
    
    // Masaüstüne kaydetme işlemi (simülasyon)
    const fileName = `Ek2_${person.tc}_${person.name.replace(/\s+/g, '_')}.docx`;
    console.log(`Belge ${fileName} olarak kaydedildi.`);
}

// Ek-2 belgelerini göster
function showEk2Documents(tc) {
    const ek2ListModal = document.getElementById('ek2ListModal');
    const ek2DocumentsList = document.getElementById('ek2DocumentsList');
    
    // Burada gerçekte dosya sisteminden belgeleri okumak gerekir
    // Simülasyon olarak birkaç örnek belge gösteriyoruz
    ek2DocumentsList.innerHTML = '';
    
    for (let i = 1; i <= 3; i++) {
        const docElement = document.createElement('div');
        docElement.className = 'document-card';
        docElement.textContent = `Ek2_${tc}_${i}.docx`;
        
        docElement.addEventListener('dblclick', function() {
            alert(`Belge açılıyor: Ek2_${tc}_${i}.docx`);
        });
        
        ek2DocumentsList.appendChild(docElement);
    }
    
    ek2ListModal.style.display = 'block';
}

// Event listener'ları kur
function setupEventListeners() {
    // Aylık işler butonu
    document.getElementById('monthlyWorksBtn').addEventListener('click', function() {
        const monthlyWorksMenu = document.getElementById('monthlyWorksMenu');
        isMonthlyMenuOpen = !isMonthlyMenuOpen;
        monthlyWorksMenu.style.display = isMonthlyMenuOpen ? 'block' : 'none';
    });
    
    // İşyeri ekle butonu
    document.getElementById('addWorkplaceBtn').addEventListener('click', function() {
        const workplaceName = prompt('İşyeri adını girin:');
        if (workplaceName && workplaceName.trim() !== '') {
            const newWorkplace = {
                id: Date.now().toString(),
                name: workplaceName.trim()
            };
            workplaces.push(newWorkplace);
            saveWorkplaces();
            renderWorkplacesList();
        }
    });
    
    // Geri butonları
    document.getElementById('backToMainBtn').addEventListener('click', function() {
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('workplaceContent').style.display = 'none';
        currentWorkplace = null;
    });
    
    document.getElementById('backFromMonthlyBtn').addEventListener('click', function() {
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('monthlyDocumentsContent').style.display = 'none';
    });
    
    document.getElementById('backFromSettingsBtn').addEventListener('click', function() {
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('settingsContent').style.display = 'none';
    });
    
    // Ayarlar butonu
    document.getElementById('settingsBtn').addEventListener('click', function() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('workplaceContent').style.display = 'none';
        document.getElementById('monthlyDocumentsContent').style.display = 'none';
        document.getElementById('settingsContent').style.display = 'block';
    });
    
    // Doktor bilgileri formu
    document.getElementById('doctorInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        doctorInfo = {
            name: document.getElementById('doctorName').value,
            diplomaNo: document.getElementById('diplomaNo').value,
            diplomaDate: document.getElementById('diplomaDate').value,
            certificateNo: document.getElementById('certificateNo').value,
            certificateDate: document.getElementById('certificateDate').value
        };
        
        localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
        alert('Doktor bilgileri kaydedildi!');
    });
    
    // Kişi ekle butonu
    document.getElementById('addPersonBtn').addEventListener('click', function() {
        if (!currentWorkplace) return;
        
        const personModal = document.getElementById('personModal');
        document.getElementById('personModalTitle').textContent = 'Kişi Ekle';
        document.getElementById('personId').value = '';
        document.getElementById('personTC').value = '';
        document.getElementById('personName').value = '';
        document.getElementById('currentExamDate').value = '';
        document.getElementById('nextExamDate').value = '';
        
        personModal.style.display = 'block';
    });
    
    // Kişi formu
    document.getElementById('personForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const personId = document.getElementById('personId').value;
        const personData = {
            tc: document.getElementById('personTC').value,
            name: document.getElementById('personName').value,
            currentExamDate: document.getElementById('currentExamDate').value,
            nextExamDate: document.getElementById('nextExamDate').value
        };
        
        if (personId) {
            // Düzenleme
            const index = people.findIndex(p => p.id === personId);
            if (index !== -1) {
                people[index] = { ...people[index], ...personData };
            }
        } else {
            // Ekleme
            personData.id = Date.now().toString();
            people.push(personData);
        }
        
        savePeople();
        renderPeopleTable();
        document.getElementById('personModal').style.display = 'none';
    });
    
    // Modal kapatma butonları
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // ESC tuşu ile modal kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    // Excel işlemleri (simülasyon)
    document.getElementById('importExcelBtn').addEventListener('click', function() {
        alert('Excel\'den veri alınacak (simülasyon)');
    });
    
    document.getElementById('exportExcelBtn').addEventListener('click', function() {
        alert('Excel\'e veri aktarılacak (simülasyon)');
    });
    
    // Yedekleme işlemleri (simülasyon)
    document.getElementById('backupBtn').addEventListener('click', function() {
        alert('Yedek alınıyor (simülasyon)');
    });
    
    document.getElementById('restoreBtn').addEventListener('click', function() {
        alert('Yedekten dönülüyor (simülasyon)');
    });
}

// İşyerlerini kaydet
function saveWorkplaces() {
    localStorage.setItem('workplaces', JSON.stringify(workplaces));
}

// Kişileri kaydet
function savePeople() {
    if (!currentWorkplace) return;
    localStorage.setItem(`people_${currentWorkplace.id}`, JSON.stringify(people));
}

// İşyeri düzenle
function editWorkplace(index) {
    const newName = prompt('Yeni işyeri adını girin:', workplaces[index].name);
    if (newName && newName.trim() !== '') {
        workplaces[index].name = newName.trim();
        saveWorkplaces();
        renderWorkplacesList();
    }
}

// İşyeri sil
function deleteWorkplace(index) {
    if (confirm(`"${workplaces[index].name}" işyerini silmek istediğinize emin misiniz?`)) {
        // İlgili kişileri de sil
        localStorage.removeItem(`people_${workplaces[index].id}`);
        workplaces.splice(index, 1);
        saveWorkplaces();
        renderWorkplacesList();
    }
}

// Kişi düzenle
function editPerson(index) {
    const person = people[index];
    const personModal = document.getElementById('personModal');
    
    document.getElementById('personModalTitle').textContent = 'Kişi Düzenle';
    document.getElementById('personId').value = person.id;
    document.getElementById('personTC').value = person.tc;
    document.getElementById('personName').value = person.name;
    document.getElementById('currentExamDate').value = person.currentExamDate;
    document.getElementById('nextExamDate').value = person.nextExamDate;
    
    personModal.style.display = 'block';
}

// Kişi sil
function deletePerson(index) {
    if (confirm(`"${people[index].name}" kişisini silmek istediğinize emin misiniz?`)) {
        people.splice(index, 1);
        savePeople();
        renderPeopleTable();
    }
}
