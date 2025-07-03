// Temel değişkenler
let currentWorkplace = null;
let workplaces = [];
let people = [];
let doctorInfo = {};
let isMonthlyMenuOpen = false;
const DEFAULT_PASSWORD = "1234";
const APP_FOLDER_NAME = "İşyeriHekimiVeri";

// DOM yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Şifre ekranı işlemleri
    const passwordScreen = document.getElementById('passwordScreen');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const mainApp = document.getElementById('mainApp');

    passwordScreen.style.display = 'block';

    loginBtn.addEventListener('click', function() {
        if (passwordInput.value === DEFAULT_PASSWORD) {
            passwordScreen.style.display = 'none';
            mainApp.style.display = 'block';
            initializeApp();
        } else {
            loginError.textContent = "Hatalı şifre! Lütfen tekrar deneyin.";
        }
    });

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginBtn.click();
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Çıkmak istediğinize emin misiniz?')) {
            mainApp.style.display = 'none';
            passwordScreen.style.display = 'block';
            passwordInput.value = '';
            loginError.textContent = '';
        }
    });
});

function initializeApp() {
    console.log(`Masaüstünde '${APP_FOLDER_NAME}' klasörü oluşturuldu (simülasyon)`);
    loadDoctorInfo();
    loadWorkplaces();
    initializeMonths();
    setupDateInputs();
    setupEventListeners();
}

// ... [loadDoctorInfo, loadWorkplaces, initializeMonths fonksiyonları aynı] ...

// Kişi tablosunu oluştur (GÜNCELLENMİŞ)
function renderPeopleTable() {
    const tableBody = document.querySelector('#peopleTable tbody');
    tableBody.innerHTML = '';
    
    people.forEach((person, index) => {
        const row = document.createElement('tr');
        
        // S.No
        row.appendChild(createTableCell(index + 1));
        
        // TC Kimlik No
        row.appendChild(createTableCell(person.tc));
        
        // Ad Soyad
        row.appendChild(createTableCell(person.name));
        
        // Muayene Tarihi (Ek-2'den sonra dolacak)
        row.appendChild(createTableCell(person.examDate || ''));
        
        // Sonraki Muayene Tarihi (Ek-2'den sonra dolacak)
        row.appendChild(createTableCell(person.nextExamDate || ''));
        
        // İşlemler
        const actionsCell = document.createElement('td');
        
        // Ek-2 Butonu (GÜNCELLENMİŞ)
        const ek2Btn = createActionButton('Ek-2', 'ek2-btn', () => {
            const today = new Date();
            const nextYear = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate());
            
            // Simüle edilmiş Ek-2 açılışı
            const examDate = prompt("Muayene Tarihi (gg.aa.yyyy):", 
                `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth()+1).padStart(2, '0')}.${today.getFullYear()}`);
            
            if (examDate) {
                const nextExamDate = prompt("Sonraki Muayene Tarihi (gg.aa.yyyy):", 
                    `${String(nextYear.getDate()).padStart(2, '0')}.${String(nextYear.getMonth()+1).padStart(2, '0')}.${nextYear.getFullYear()}`);
                
                if (nextExamDate) {
                    // Güncelle ve kaydet
                    person.examDate = examDate;
                    person.nextExamDate = nextExamDate;
                    savePeople();
                    renderPeopleTable();
                    alert(`Ek-2 belgesi oluşturuldu:\nTC: ${person.tc}\nAd: ${person.name}\nTarih: ${examDate}`);
                }
            }
        });
        
        // Ek-2 Yükle Butonu
        const uploadEk2Btn = createActionButton('Ek-2 Yükle', 'ek2-btn', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.docx';
            fileInput.click();
            console.log(`Ek-2 yüklendi (simülasyon): ${APP_FOLDER_NAME}/Ek2_${person.tc}.docx`);
        });
        
        // Diğer butonlar
        actionsCell.appendChild(ek2Btn);
        actionsCell.appendChild(uploadEk2Btn);
        actionsCell.appendChild(createActionButton('Ek-2 Göster', 'ek2-btn', () => showEk2Documents(person.tc)));
        actionsCell.appendChild(createActionButton('Düzenle', 'edit-btn', () => editPerson(index)));
        actionsCell.appendChild(createActionButton('Sil', 'delete-btn', () => deletePerson(index)));
        
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });
}

// Yardımcı fonksiyonlar
function createTableCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

function createActionButton(text, className, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = `action-btn ${className}`;
    btn.addEventListener('click', onClick);
    return btn;
}

// Kişi Ekleme Modalı (GÜNCELLENMİŞ - SADECE TC VE AD)
document.getElementById('personForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const personData = {
        id: Date.now().toString(),
        tc: document.getElementById('personTC').value,
        name: document.getElementById('personName').value
        // examDate ve nextExamDate Ek-2'de doldurulacak
    };
    
    people.push(personData);
    savePeople();
    renderPeopleTable();
    document.getElementById('personModal').style.display = 'none';
});

// Tarih Formatlama (GÜNCELLENMİŞ)
function setupDateInputs() {
    const addAutoDot = (input) => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/[^0-9]/g, '');
            
            if (value.length > 2 && value.length <= 4) {
                value = value.substring(0, 2) + '.' + value.substring(2);
            } else if (value.length > 4) {
                value = value.substring(0, 2) + '.' + value.substring(2, 4) + '.' + value.substring(4, 8);
            }
            
            this.value = value.substring(0, 10);
        });
    };
    
    document.querySelectorAll('input[placeholder="gg.aa.yyyy"]').forEach(addAutoDot);
}

// ... [diğer fonksiyonlar aynı] ...

// Kişi Düzenleme (GÜNCELLENMİŞ - SADECE TC VE AD)
function editPerson(index) {
    const person = people[index];
    const modal = document.getElementById('personModal');
    
    document.getElementById('personModalTitle').textContent = 'Kişi Düzenle';
    document.getElementById('personId').value = person.id;
    document.getElementById('personTC').value = person.tc;
    document.getElementById('personName').value = person.name;
    
    modal.style.display = 'block';
}
