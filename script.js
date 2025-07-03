// Temel değişkenler
let currentWorkplace = null;
let workplaces = [];
let people = [];
let doctorInfo = {};
let isMonthlyMenuOpen = false;
const DEFAULT_PASSWORD = "1234"; // Basit bir şifre
const APP_FOLDER_NAME = "İşyeriHekimiVeri"; // Masaüstünde oluşacak klasör adı

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
    // Masaüstünde klasör oluştur (simülasyon)
    createAppFolder();
    
    // Doktor bilgilerini yükle
    loadDoctorInfo();
    
    // İşyerlerini yükle
    loadWorkplaces();
    
    // Aylık işler menüsünü başlat
    initializeMonths();
    
    // Tarih inputlarını ayarla
    setupDateInputs();
    
    // Event listener'ları ekle
    setupEventListeners();
}

// Masaüstünde uygulama klasörü oluştur (simülasyon)
function createAppFolder() {
    console.log(`Masaüstünde '${APP_FOLDER_NAME}' klasörü oluşturuldu (simülasyon)`);
    // Gerçek uygulamada burada Electron veya başka bir yöntemle klasör oluşturulacak
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
        
        // Muayene Tarihi
        const examDateCell = document.createElement('td');
        examDateCell.textContent = person.examDate || '';
        row.appendChild(examDateCell);
        
        // Sonraki Muayene Tarihi
        const nextExamDateCell = document.createElement('td');
        nextExamDateCell.textContent = person.nextExamDate || '';
        row.appendChild(nextExamDateCell);
        
        // İşlemler
        const actionsCell = document.createElement('td');
        
        // Ek-2 Butonu
        const ek2Btn = document.createElement('button');
        ek2Btn.textContent = 'Ek-2';
        ek2Btn.className = 'action-btn ek2-btn';
        ek2Btn.addEventListener('click', function() {
            openEk2Document(person);
        });
        
        // Ek-2 Yükle Butonu
        const uploadEk2Btn = document.createElement('button');
        uploadEk2Btn.textContent = 'Ek-2 Yükle';
        uploadEk2Btn.className = 'action-btn ek2-btn';
        uploadEk2Btn.addEventListener('click', function() {
            uploadEk2Document(person.tc);
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
        actionsCell.appendChild(uploadEk2Btn);
        actionsCell.appendChild(showEk2Btn);
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        tableBody.appendChild(row);
    });
}

// Tarih formatlama fonksiyonu
function formatDate(date) {
    if (!date) return '';
    const [day, month, year] = date.split('.');
    return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
}

// Tarih inputlarına otomatik nokta ekleme
function setupDateInputs() {
    document.querySelectorAll('input[placeholder="gg.aa.yyyy"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/[^0-9]/g, '');
            
            if (value.length > 2 && value.length <= 4) {
                value = value.substring(0, 2) + '.' + value.substring(2);
            } else if (value.length > 4) {
                value = value.substring(0, 2) + '.' + value.substring(2, 4) + '.' + value.substring(4, 8);
            }
            
            this.value = value.substring(0, 10);
        });
        
        // Blur olduğunda formatı kontrol et
        input.addEventListener('blur', function() {
            if (this.value && !/^\d{2}\.\d{2}\.\d{4}$/.test(this.value)) {
                alert('Lütfen geçerli bir tarih formatı girin (gg.aa.yyyy)');
                this.focus();
            }
        });
    });
}

// Ek-2 belgesini aç
function openEk2Document(person) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const examDate = `${day}.${month}.${year}`;
    
    // 5 yıl sonrasını hesapla
    const nextExamDate = `${day}.${month}.${year + 5}`;
    
    // Kişiyi güncelle
    person.examDate = examDate;
    person.nextExamDate = nextExamDate;
    savePeople();
    renderPeopleTable();
    
    // Masaüstüne kaydetme işlemi (simülasyon)
    const fileName = `Ek2_${person.tc}_${person.name.replace(/\s+/g, '_')}.docx`;
    console.log(`Belge ${fileName} olarak '${APP_FOLDER_NAME}' klasörüne kaydedildi (simülasyon)`);
    
    alert(`Ek-2 belgesi oluşturuldu:\nTC: ${person.tc}\nAd Soyad: ${person.name}\nMuayene Tarihi: ${examDate}\nSonraki Muayene Tarihi: ${nextExamDate}\n\nBelge '${APP_FOLDER_NAME}' klasörüne kaydedildi.`);
}

// Ek-2 belgesi yükle
function uploadEk2Document(tc) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.docx';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            console.log(`Dosya '${APP_FOLDER_NAME}' klasörüne kaydedildi (simülasyon):`, file.name);
            alert(`${file.name} dosyası '${APP_FOLDER_NAME}' klasörüne yüklendi (TC: ${tc})`);
        }
    });
    
    fileInput.click();
}

// Veritabanı yedekle
function backupDatabase() {
    const backupData = {
        workplaces: workplaces,
        people: {},
        doctorInfo: doctorInfo
    };
    
    // Tüm işyerlerindeki kişileri yedekle
    workplaces.forEach(workplace => {
        const peopleData = localStorage.getItem(`people_${workplace.id}`);
        if (peopleData) {
            backupData.people[workplace.id] = JSON.parse(peopleData);
        }
    });
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isyeri_hekimligi_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    
    console.log(`Yedekleme '${APP_FOLDER_NAME}' klasörüne kaydedildi (simülasyon)`);
    alert(`Veritabanı yedeği '${APP_FOLDER_NAME}' klasörüne kaydedildi.`);
}

// Ek-2 belgelerini göster
function showEk2Documents(tc) {
    const ek2ListModal = document.getElementById('ek2ListModal');
    const ek2DocumentsList = document.getElementById('ek2DocumentsList');
    
    ek2DocumentsList.innerHTML = '';
    
    // Simülasyon: 3 örnek belge göster
    for (let i = 1; i <= 3; i++) {
        const docElement = document.createElement('div');
        docElement.className = 'document-card';
        docElement.textContent = `Ek2_${tc}_${i}.docx`;
        
        docElement.addEventListener('dblclick', function() {
            alert(`Belge açılıyor: ${APP_FOLDER_NAME}/Ek2_${tc}_${i}.docx`);
        });
        
        ek2DocumentsList.appendChild(docElement);
    }
    
    ek2ListModal.style.display = 'block';
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
            alert(`${APP_FOLDER_NAME}/${monthName} ${year} ${doc} belgesi açılıyor...`);
        });
        
        documentsList.appendChild(docElement);
    });
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
        
        personModal.style.display = 'block';
    });
    
    // Kişi formu
    document.getElementById('personForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const personId = document.getElementById('personId').value;
        const personData = {
            tc: document.getElementById('personTC').value,
            name: document.getElementById('personName').value
        };
        
        if (personId) {
            // Düzenleme
            const index = people.findIndex(p => p.id === personId);
            if (index !== -1) {
                // Mevcut tarihleri koru
                personData.examDate = people[index].examDate;
                personData.nextExamDate = people[index].nextExamDate;
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
    
    // Yedekleme işlemleri
    document.getElementById('backupBtn').addEventListener('click', function() {
        backupDatabase();
    });
    
    document.getElementById('restoreBtn').addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const backupData = JSON.parse(e.target.result);
                        workplaces = backupData.workplaces || [];
                        doctorInfo = backupData.doctorInfo || {};
                        
                        // Kişileri geri yükle
                        Object.keys(backupData.people || {}).forEach(workplaceId => {
                            localStorage.setItem(`people_${workplaceId}`, JSON.stringify(backupData.people[workplaceId]));
                        });
                        
                        localStorage.setItem('workplaces', JSON.stringify(workplaces));
                        localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
                        
                        alert('Yedekten başarıyla dönüldü!');
                        renderWorkplacesList();
                    } catch (error) {
                        alert('Yedek dosyası okunurken hata oluştu: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        });
        
        fileInput.click();
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
