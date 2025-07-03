// Temel veri yapıları
let data = {
    doctor: {
        name: "",
        diplomaNo: "",
        diplomaDate: "",
        certificateNo: "",
        certificateDate: ""
    },
    workplaces: [],
    monthlyDocuments: {},
    currentWorkplace: null,
    currentMonth: null
};

// DOM Elementleri
const loginScreen = document.getElementById('loginScreen');
const mainPage = document.getElementById('mainPage');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');
const logoutButton = document.getElementById('logoutButton');
const settingsBtn = document.getElementById('settingsBtn');
const monthlyWorksBtn = document.getElementById('monthlyWorksBtn');
const monthlyWorksMenu = document.getElementById('monthlyWorksMenu');
const workplacesList = document.getElementById('workplacesList');
const addWorkplaceBtn = document.getElementById('addWorkplaceBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const workplaceDetail = document.getElementById('workplaceDetail');
const workplaceTitle = document.getElementById('workplaceTitle');
const backToMainBtn = document.getElementById('backToMainBtn');
const personsTable = document.getElementById('personsTable').getElementsByTagName('tbody')[0];
const addPersonBtn = document.getElementById('addPersonBtn');
const importExcelBtn = document.getElementById('importExcelBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const monthlyWorksDetail = document.getElementById('monthlyWorksDetail');
const monthlyTitle = document.getElementById('monthlyTitle');
const backFromMonthlyBtn = document.getElementById('backFromMonthlyBtn');
const documentsList = document.querySelector('.documents-list');
const settingsPage = document.getElementById('settingsPage');
const backFromSettingsBtn = document.getElementById('backFromSettingsBtn');
const doctorSettingsForm = document.getElementById('doctorSettingsForm');
const doctorNameInput = document.getElementById('doctorName');
const diplomaNoInput = document.getElementById('diplomaNo');
const diplomaDateInput = document.getElementById('diplomaDate');
const certificateNoInput = document.getElementById('certificateNo');
const certificateDateInput = document.getElementById('certificateDate');
const personModal = document.getElementById('personModal');
const personModalTitle = document.getElementById('personModalTitle');
const personForm = document.getElementById('personForm');
const personIdInput = document.getElementById('personId');
const personTCInput = document.getElementById('personTC');
const personNameInput = document.getElementById('personName');
const currentExamInput = document.getElementById('currentExam');
const nextExamInput = document.getElementById('nextExam');
const uploadModal = document.getElementById('uploadModal');
const uploadForm = document.getElementById('uploadForm');
const uploadPersonIdInput = document.getElementById('uploadPersonId');
const fileInput = document.getElementById('fileInput');
const ek2ListModal = document.getElementById('ek2ListModal');
const ek2List = document.getElementById('ek2List');
const workplaceModal = document.getElementById('workplaceModal');
const workplaceModalTitle = document.getElementById('workplaceModalTitle');
const workplaceForm = document.getElementById('workplaceForm');
const workplaceIdInput = document.getElementById('workplaceId');
const workplaceNameInput = document.getElementById('workplaceName');

// Modal kapatma butonları
const closeModalButtons = document.querySelectorAll('.close-modal');
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.classList.add('hidden');
    });
});

// ESC tuşu ile modal kapatma
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            if (modal.id !== 'loginScreen') {
                modal.classList.add('hidden');
            }
        });
    }
});

// Şifre kontrolü (basit şifre: "1234")
const PASSWORD = "1234";

// Giriş işlemi
loginButton.addEventListener('click', () => {
    if (passwordInput.value === PASSWORD) {
        loginError.textContent = "";
        loginScreen.classList.add('hidden');
        mainPage.classList.remove('hidden');
        loadData();
        initializeMonths();
        renderWorkplaces();
    } else {
        loginError.textContent = "Hatalı şifre! Lütfen tekrar deneyin.";
    }
});

// Çıkış işlemi
logoutButton.addEventListener('click', () => {
    mainPage.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    passwordInput.value = "";
});

// Ayarlar sayfasına git
settingsBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    workplaceDetail.classList.add('hidden');
    monthlyWorksDetail.classList.add('hidden');
    settingsPage.classList.remove('hidden');
    
    // Doktor bilgilerini formda göster
    doctorNameInput.value = data.doctor.name;
    diplomaNoInput.value = data.doctor.diplomaNo;
    diplomaDateInput.value = data.doctor.diplomaDate;
    certificateNoInput.value = data.doctor.certificateNo;
    certificateDateInput.value = data.doctor.certificateDate;
});

// Doktor bilgilerini kaydet
doctorSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Tarih formatını kontrol et
    if (!isValidDate(diplomaDateInput.value) {
        alert("Geçersiz diploma tarihi formatı! gg.aa.yyyy şeklinde girin.");
        return;
    }
    
    if (!isValidDate(certificateDateInput.value)) {
        alert("Geçersiz belge tarihi formatı! gg.aa.yyyy şeklinde girin.");
        return;
    }
    
    data.doctor = {
        name: doctorNameInput.value,
        diplomaNo: diplomaNoInput.value,
        diplomaDate: diplomaDateInput.value,
        certificateNo: certificateNoInput.value,
        certificateDate: certificateDateInput.value
    };
    
    saveData();
    alert("Doktor bilgileri kaydedildi!");
});

// Aylık işler menüsünü aç/kapat
monthlyWorksBtn.addEventListener('click', () => {
    monthlyWorksMenu.classList.toggle('hidden');
});

// İşyeri ekle butonu
addWorkplaceBtn.addEventListener('click', () => {
    workplaceModalTitle.textContent = "İşyeri Ekle";
    workplaceIdInput.value = "";
    workplaceNameInput.value = "";
    workplaceModal.classList.remove('hidden');
});

// İşyeri formu
workplaceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const workplaceName = workplaceNameInput.value.trim();
    if (!workplaceName) {
        alert("İşyeri adı boş olamaz!");
        return;
    }
    
    const workplaceId = workplaceIdInput.value || Date.now().toString();
    
    if (workplaceIdInput.value) {
        // Düzenleme
        const index = data.workplaces.findIndex(w => w.id === workplaceId);
        if (index !== -1) {
            data.workplaces[index].name = workplaceName;
        }
    } else {
        // Ekleme
        data.workplaces.push({
            id: workplaceId,
            name: workplaceName,
            persons: []
        });
    }
    
    saveData();
    renderWorkplaces();
    workplaceModal.classList.add('hidden');
});

// İşyerlerini listele
function renderWorkplaces() {
    workplacesList.innerHTML = "";
    
    data.workplaces.forEach(workplace => {
        const workplaceItem = document.createElement('div');
        workplaceItem.className = 'workplace-item';
        workplaceItem.textContent = workplace.name;
        workplaceItem.dataset.id = workplace.id;
        
        workplaceItem.addEventListener('dblclick', () => {
            openWorkplace(workplace.id);
        });
        
        // Sağ tık menüsü (düzenle/sil)
        workplaceItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            const menu = document.createElement('div');
            menu.style.position = 'absolute';
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;
            menu.style.backgroundColor = 'white';
            menu.style.border = '1px solid #ddd';
            menu.style.borderRadius = '4px';
            menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            menu.style.zIndex = '1000';
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Düzenle';
            editBtn.style.display = 'block';
            editBtn.style.width = '100%';
            editBtn.style.padding = '8px';
            editBtn.style.textAlign = 'left';
            editBtn.style.border = 'none';
            editBtn.style.background = 'none';
            editBtn.style.cursor = 'pointer';
            
            editBtn.addEventListener('click', () => {
                const workplace = data.workplaces.find(w => w.id === workplaceItem.dataset.id);
                if (workplace) {
                    workplaceModalTitle.textContent = "İşyeri Düzenle";
                    workplaceIdInput.value = workplace.id;
                    workplaceNameInput.value = workplace.name;
                    workplaceModal.classList.remove('hidden');
                }
                document.body.removeChild(menu);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Sil';
            deleteBtn.style.display = 'block';
            deleteBtn.style.width = '100%';
            deleteBtn.style.padding = '8px';
            deleteBtn.style.textAlign = 'left';
            deleteBtn.style.border = 'none';
            deleteBtn.style.background = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.color = 'red';
            
            deleteBtn.addEventListener('click', () => {
                if (confirm(`${workplace.name} işyerini silmek istediğinize emin misiniz?`)) {
                    data.workplaces = data.workplaces.filter(w => w.id !== workplaceItem.dataset.id);
                    saveData();
                    renderWorkplaces();
                    
                    // Eğer silinen işyeri açıksa, ana sayfaya dön
                    if (currentWorkplace === workplaceItem.dataset.id) {
                        workplaceDetail.classList.add('hidden');
                        welcomeScreen.classList.remove('hidden');
                        currentWorkplace = null;
                    }
                }
                document.body.removeChild(menu);
            });
            
            menu.appendChild(editBtn);
            menu.appendChild(deleteBtn);
            document.body.appendChild(menu);
            
            // Menü dışına tıklandığında menüyü kaldır
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    document.body.removeChild(menu);
                    document.removeEventListener('click', closeMenu);
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 0);
        });
        
        workplacesList.appendChild(workplaceItem);
    });
}

// İşyeri aç
function openWorkplace(workplaceId) {
    const workplace = data.workplaces.find(w => w.id === workplaceId);
    if (!workplace) return;
    
    currentWorkplace = workplaceId;
    workplaceTitle.textContent = workplace.name;
    
    welcomeScreen.classList.add('hidden');
    workplaceDetail.classList.remove('hidden');
    
    renderPersonsTable();
}

// Geri butonu (işyeri detayından ana sayfaya)
backToMainBtn.addEventListener('click', () => {
    workplaceDetail.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    currentWorkplace = null;
});

// Kişi listesini render et
function renderPersonsTable() {
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    personsTable.innerHTML = "";
    
    workplace.persons.forEach((person, index) => {
        const row = personsTable.insertRow();
        
        // S.No
        const cellNo = row.insertCell();
        cellNo.textContent = index + 1;
        
        // TC Kimlik No
        const cellTC = row.insertCell();
        cellTC.textContent = person.tc;
        
        // Ad Soyad
        const cellName = row.insertCell();
        cellName.textContent = person.name;
        
        // Mevcut Muayene
        const cellCurrentExam = row.insertCell();
        cellCurrentExam.textContent = person.currentExam;
        
        // Sonraki Muayene
        const cellNextExam = row.insertCell();
        cellNextExam.textContent = person.nextExam;
        
        // Ek-2 Butonu
        const cellEk2 = row.insertCell();
        const ek2Btn = document.createElement('button');
        ek2Btn.textContent = 'Ek-2';
        ek2Btn.className = 'action-btn ek2-btn';
        ek2Btn.addEventListener('click', () => generateEk2(person));
        cellEk2.appendChild(ek2Btn);
        
        // Ek-2 Yükle Butonu
        const cellUpload = row.insertCell();
        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = 'Yükle';
        uploadBtn.className = 'action-btn ek2-btn';
        uploadBtn.addEventListener('click', () => {
            uploadPersonIdInput.value = person.id;
            uploadModal.classList.remove('hidden');
        });
        cellUpload.appendChild(uploadBtn);
        
        // Ek-2 Göster Butonu
        const cellShow = row.insertCell();
        const showBtn = document.createElement('button');
        showBtn.textContent = 'Göster';
        showBtn.className = 'action-btn ek2-btn';
        showBtn.addEventListener('click', () => showEk2List(person.id));
        cellShow.appendChild(showBtn);
        
        // Düzenle Butonu
        const cellEdit = row.insertCell();
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Düzenle';
        editBtn.className = 'action-btn edit-btn';
        editBtn.addEventListener('click', () => editPerson(person.id));
        cellEdit.appendChild(editBtn);
        
        // Sil Butonu
        const cellDelete = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Sil';
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.addEventListener('click', () => deletePerson(person.id));
        cellDelete.appendChild(deleteBtn);
    });
}

// Kişi ekle butonu
addPersonBtn.addEventListener('click', () => {
    personModalTitle.textContent = "Kişi Ekle";
    personIdInput.value = "";
    personTCInput.value = "";
    personNameInput.value = "";
    currentExamInput.value = "";
    nextExamInput.value = "";
    personModal.classList.remove('hidden');
});

// Kişi formu
personForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    const tc = personTCInput.value.trim();
    const name = personNameInput.value.trim();
    const currentExam = currentExamInput.value.trim();
    const nextExam = nextExamInput.value.trim();
    
    if (!tc || !name || !currentExam || !nextExam) {
        alert("Tüm alanları doldurunuz!");
        return;
    }
    
    if (!isValidDate(currentExam)) {
        alert("Geçersiz mevcut muayene tarihi formatı! gg.aa.yyyy şeklinde girin.");
        return;
    }
    
    if (!isValidDate(nextExam)) {
        alert("Geçersiz sonraki muayene tarihi formatı! gg.aa.yyyy şeklinde girin.");
        return;
    }
    
    const personId = personIdInput.value || Date.now().toString();
    
    if (personIdInput.value) {
        // Düzenleme
        const index = workplace.persons.findIndex(p => p.id === personId);
        if (index !== -1) {
            workplace.persons[index] = {
                id: personId,
                tc,
                name,
                currentExam,
                nextExam,
                ek2Files: workplace.persons[index].ek2Files || []
            };
        }
    } else {
        // Ekleme
        workplace.persons.push({
            id: personId,
            tc,
            name,
            currentExam,
            nextExam,
            ek2Files: []
        });
    }
    
    saveData();
    renderPersonsTable();
    personModal.classList.add('hidden');
});

// Kişi düzenle
function editPerson(personId) {
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    const person = workplace.persons.find(p => p.id === personId);
    if (!person) return;
    
    personModalTitle.textContent = "Kişi Düzenle";
    personIdInput.value = person.id;
    personTCInput.value = person.tc;
    personNameInput.value = person.name;
    currentExamInput.value = person.currentExam;
    nextExamInput.value = person.nextExam;
    personModal.classList.remove('hidden');
}

// Kişi sil
function deletePerson(personId) {
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    const person = workplace.persons.find(p => p.id === personId);
    if (!person) return;
    
    if (confirm(`${person.name} isimli kişiyi silmek istediğinize emin misiniz?`)) {
        workplace.persons = workplace.persons.filter(p => p.id !== personId);
        saveData();
        renderPersonsTable();
    }
}

// Ek-2 yükle formu
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    const person = workplace.persons.find(p => p.id === uploadPersonIdInput.value);
    if (!person) return;
    
    const file = fileInput.files[0];
    if (!file) {
        alert("Lütfen bir dosya seçin!");
        return;
    }
    
    if (!file.name.endsWith('.docx')) {
        alert("Sadece .docx uzantılı dosyalar yüklenebilir!");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileData = e.target.result;
        
        if (!person.ek2Files) {
            person.ek2Files = [];
        }
        
        person.ek2Files.push({
            name: file.name,
            data: fileData,
            date: formatDate(new Date())
        });
        
        saveData();
        alert("Ek-2 başarıyla yüklendi!");
        uploadModal.classList.add('hidden');
        fileInput.value = "";
    };
    
    reader.readAsDataURL(file);
});

// Ek-2 listesini göster
function showEk2List(personId) {
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    const person = workplace.persons.find(p => p.id === personId);
    if (!person) return;
    
    ek2List.innerHTML = "";
    
    if (!person.ek2Files || person.ek2Files.length === 0) {
        ek2List.innerHTML = "<p>Bu kişi için yüklenmiş Ek-2 bulunmamaktadır.</p>";
    } else {
        person.ek2Files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'document-item';
            fileItem.textContent = `${index + 1}. ${file.name} (${file.date})`;
            
            fileItem.addEventListener('dblclick', () => {
                // Burada dosyayı görüntüleme işlemi yapılabilir
                // Basit bir örnek olarak yeni pencerede açalım
                const blob = dataURLtoBlob(file.data);
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            });
            
            ek2List.appendChild(fileItem);
        });
    }
    
    ek2ListModal.classList.remove('hidden');
}

// Ek-2 oluştur
function generateEk2(person) {
    // Burada gerçek bir .docx oluşturma işlemi yapılmalı
    // Örnek olarak bir blob oluşturup indirme bağlantısı sağlıyoruz
    
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    // Basit bir örnek - gerçekte docx oluşturmak için bir kütüphane kullanılmalı
    const content = `
        İŞYERİNİN
        Ünvanı: ${workplace.name}
        
        ÇALIŞANIN
        Adı ve soyadı: ${person.name}
        T.C.Kimlik No: ${person.tc}
        
        ... (ccgisg_ek_2.docx içeriği buraya gelecek)
    `;
    
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ek-2_${person.name.replace(/\s+/g, '_')}_${person.tc}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Excel'den al
importExcelBtn.addEventListener('click', () => {
    alert("Excel'den veri alma işlemi bu örnekte simüle edilmiştir. Gerçek uygulamada bir Excel parser kullanılmalıdır.");
    
    // Örnek veri
    const exampleData = [
        { tc: "12345678901", name: "Örnek Kişi 1", currentExam: "01.01.2025", nextExam: "01.07.2025" },
        { tc: "98765432109", name: "Örnek Kişi 2", currentExam: "15.01.2025", nextExam: "15.07.2025" }
    ];
    
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    workplace.persons = exampleData.map(person => ({
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        tc: person.tc,
        name: person.name,
        currentExam: person.currentExam,
        nextExam: person.nextExam,
        ek2Files: []
    }));
    
    saveData();
    renderPersonsTable();
    alert("Örnek veri başarıyla yüklendi!");
});

// Excel'e ver
exportExcelBtn.addEventListener('click', () => {
    const workplace = data.workplaces.find(w => w.id === currentWorkplace);
    if (!workplace) return;
    
    // CSV formatında basit bir örnek oluşturuyoruz
    let csvContent = "S.No,TC Kimlik No,Ad Soyad,Mevcut Muayene,Sonraki Muayene\n";
    
    workplace.persons.forEach((person, index) => {
        csvContent += `${index + 1},${person.tc},"${person.name}",${person.currentExam},${person.nextExam}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workplace.name.replace(/\s+/g, '_')}_Personel_Listesi.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Yedek al
backupBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `isyeri_hekimligi_yedek_${formatDate(new Date(), true)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Yedekten dön
restoreBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const backupData = JSON.parse(event.target.result);
                data = backupData;
                saveData();
                
                // UI'ı güncelle
                if (currentWorkplace) {
                    renderPersonsTable();
                }
                
                renderWorkplaces();
                alert("Yedek başarıyla yüklendi!");
            } catch (error) {
                alert("Yedek dosyası geçersiz: " + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
});

// Ayları başlat
function initializeMonths() {
    // DOM elementinin yüklendiğinden emin ol
    if (!monthlyWorksMenu) {
        setTimeout(initializeMonths, 100);
        return;
    }
    
    monthlyWorksMenu.innerHTML = "";
    
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    
    // Eğer ayın 15'inden sonraysa bir sonraki ayı da ekle
    if (now.getDate() > 15) {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
    }
    
    // 12 ay ekle (geçmiş ve gelecek aylar)
    for (let i = 0; i < 12; i++) {
        const date = new Date(year, month - 6 + i, 1);
        const monthName = getMonthName(date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const monthBtn = document.createElement('button');
        monthBtn.textContent = monthName;
        monthBtn.dataset.monthKey = monthKey;
        
        monthBtn.addEventListener('click', () => {
            openMonthlyWorks(monthKey, monthName);
        });
        
        monthlyWorksMenu.appendChild(monthBtn);
        
        // Eğer bu ay için dokümanlar yoksa, başlangıç dokümanlarını oluştur
        if (!data.monthlyDocuments[monthKey]) {
            data.monthlyDocuments[monthKey] = [
                { name: "Çasmer Mutabakat.docx", data: "" },
                { name: "Çasmer Puantaj.xlsx", data: "" },
                { name: "Genel Hijyen ve Saha Denetim Formu.xlsx", data: "" },
                { name: "Mutfak Hijyen Denetim Formu.xlsx", data: "" },
                { name: "Tuvalet Hijyen Denetim Formu.xlsx", data: "" }
            ];
        }
    }
    
    saveData();
}

// Aylık işleri aç
function openMonthlyWorks(monthKey, monthName) {
    currentMonth = monthKey;
    monthlyTitle.textContent = monthName;
    
    welcomeScreen.classList.add('hidden');
    monthlyWorksDetail.classList.remove('hidden');
    
    renderMonthlyDocuments();
}

// Aylık dokümanları render et
function renderMonthlyDocuments() {
    documentsList.innerHTML = "";
    
    const documents = data.monthlyDocuments[currentMonth] || [];
    
    documents.forEach(doc => {
        const docItem = document.createElement('div');
        docItem.className = 'document-item';
        docItem.textContent = doc.name;
        
        docItem.addEventListener('click', () => {
            // Burada dokümanı açma işlemi yapılabilir
            alert(`"${doc.name}" dokümanı açılıyor (simüle edildi)`);
        });
        
        documentsList.appendChild(docItem);
    });
}

// Geri butonu (aylık işlerden ana sayfaya)
backFromMonthlyBtn.addEventListener('click', () => {
    monthlyWorksDetail.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    currentMonth = null;
});

// Ayarlardan ana sayfaya dön
backFromSettingsBtn.addEventListener('click', () => {
    settingsPage.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
});

// Yardımcı fonksiyonlar
function isValidDate(dateString) {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const parts = dateString.split('.');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    
    return true;
}

function formatDate(date, forFileName = false) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    if (forFileName) {
        return `${day}-${month}-${year}`;
    }
    
    return `${day}.${month}.${year}`;
}

function getMonthName(date) {
    const months = [
        "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN",
        "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
}

// Veriyi localStorage'a kaydet
function saveData() {
    localStorage.setItem('isyeriHekimligiData', JSON.stringify(data));
}

// Veriyi localStorage'dan yükle
function loadData() {
    const savedData = localStorage.getItem('isyeriHekimligiData');
    if (savedData) {
        data = JSON.parse(savedData);
    }
}

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', () => {
    // Şifre ekranını göster
    loginScreen.classList.remove('hidden');
    mainPage.classList.add('hidden');
    
    // Tarih inputlarına otomatik nokta ekleme
    const dateInputs = document.querySelectorAll('input[placeholder="gg.aa.yyyy"]');
    dateInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 2 && value.length <= 4) {
                value = value.substring(0, 2) + '.' + value.substring(2);
            } else if (value.length > 4) {
                value = value.substring(0, 2) + '.' + value.substring(2, 4) + '.' + value.substring(4, 8);
            }
            
            this.value = value;
        });
    });
});
