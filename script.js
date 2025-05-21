// Data storage
const patients = [];
const medications = [];
const diseases = [
  { name: "Diabetes", symptoms: "Increased thirst, frequent urination, fatigue", treatment: "Insulin therapy, diet control" },
  { name: "Hypertension", symptoms: "Headache, dizziness, nosebleeds", treatment: "Lifestyle changes, medication" },
  { name: "Atrial Septal Defect", symptoms: "Fatigue, shortness of breath, heart palpitations, frequent lung infections.", treatment: "Surgical repair or catheter-based closure of the hole." },
  { name: "Asthma", symptoms: "Wheezing, coughing, chest tightness, shortness of breath.", treatment: "Inhalers (bronchodilators/steroids), avoid triggers." },
  { name: "Pneumonia", symptoms: "Fever, chest pain, cough with phlegm, shortness of breath.", treatment: "Antibiotics (if bacterial), antivirals, fluids, oxygen." },
  { name: "Congestive Heart Failure", symptoms: "Swelling in legs, fatigue, shortness of breath, rapid heartbeat.", treatment: "Diuretics, ACE inhibitors, beta-blockers, lifestyle changes." },
  { name: "Myocardial Infarction", symptoms: "Chest pain, arm/jaw pain, sweating, shortness of breath.", treatment: "Clot-busting drugs, angioplasty, stent placement, surgery." },
  { name: "Tuberculosis", symptoms: "Cough lasting more than 3 weeks, fever, night sweats, weight loss.", treatment: "6-month antibiotic regimen (e.g., rifampin, isoniazid)." },
];

// Utility: Update visible section
function showSection(id) {
  document.querySelectorAll("main > section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (id === 'patients') updatePatientsTable();
  else if (id === 'medications') updateMedicationPatientSelect();
  else if (id === 'diseases') renderDiseaseList(diseases);
}

// --- Patients ---
const patientForm = document.getElementById('patientForm');
const patientTableBody = document.querySelector('#patientTable tbody');
const medicationsForPatientDiv = document.getElementById('medicationsForPatient');

patientForm.addEventListener('submit', e => {
  e.preventDefault();
  const newPatient = {
    id: Date.now(),
    name: patientForm.pName.value.trim(),
    age: Number(patientForm.pAge.value),
    condition: patientForm.pCondition.value.trim(),
    room: patientForm.pRoom.value.trim(),
    surgeryStatus: patientForm.pSurgeryStatus.value,
    status: patientForm.pStatus.value.trim(),
  };
  patients.push(newPatient);
  patientForm.reset();
  updatePatientsTable();
  updateDashboardStats();
  updateMedicationPatientSelect();
});

function updatePatientsTable() {
  patientTableBody.innerHTML = "";
  patients.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.age}</td>
      <td>${p.condition}</td>
      <td>${p.room}</td>
      <td>${p.surgeryStatus}</td>
      <td>${p.status}</td>
    `;
    tr.addEventListener('click', () => showMedicationsForPatient(p.id));
    patientTableBody.appendChild(tr);
  });
}

function showMedicationsForPatient(patientId) {
  const patient = patients.find(p => p.id === patientId);
  const meds = medications.filter(m => m.patientId === patientId);
  medicationsForPatientDiv.innerHTML = `
    <h3>Medications for ${patient.name}</h3>
    ${meds.length > 0 ? `<ul>${meds.map(m => `<li>${m.drug} - ${m.dose}</li>`).join('')}</ul>` : '<p>No medications assigned.</p>'}
  `;
}

// --- Medications ---
const medForm = document.getElementById('medForm');
const medList = document.getElementById('medList');
const mPatientSelect = document.getElementById('mPatient');

medForm.addEventListener('submit', e => {
  e.preventDefault();
  const patientId = Number(mPatientSelect.value);
  const newMed = {
    id: Date.now(),
    patientId,
    drug: medForm.mDrug.value.trim(),
    dose: medForm.mDose.value.trim(),
  };
  medications.push(newMed);
  medForm.reset();
  updateMedList();
  updateDashboardStats();
});

function updateMedicationPatientSelect() {
  mPatientSelect.innerHTML = "";
  if (patients.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No patients available';
    option.disabled = true;
    mPatientSelect.appendChild(option);
    return;
  }

  patients.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = p.name;
    mPatientSelect.appendChild(option);
  });
}

function updateMedList() {
  medList.innerHTML = "";
  medications.forEach(m => {
    const patientName = patients.find(p => p.id === m.patientId)?.name || "Unknown";
    const li = document.createElement('li');
    li.textContent = `${m.drug} (${m.dose}) for ${patientName}`;
    medList.appendChild(li);
  });
}

// --- Diseases ---
const diseaseForm = document.getElementById('diseaseForm');
const diseaseResults = document.getElementById('diseaseResults');
const diseaseSearch = document.getElementById('diseaseSearch');

diseaseForm.addEventListener('submit', e => {
  e.preventDefault();
  diseases.push({
    name: diseaseForm.dName.value.trim(),
    symptoms: diseaseForm.dSymptoms.value.trim(),
    treatment: diseaseForm.dTreatment.value.trim(),
  });
  diseaseForm.reset();
  renderDiseaseList(diseases);
});

diseaseSearch.addEventListener('input', () => {
  const searchTerm = diseaseSearch.value.toLowerCase();
  const filtered = diseases.filter(d => d.name.toLowerCase().includes(searchTerm));
  renderDiseaseList(filtered);
});

function renderDiseaseList(list) {
  if (list.length === 0) {
    diseaseResults.innerHTML = '<p>No diseases found.</p>';
    return;
  }
  diseaseResults.innerHTML = list.map(d => `
    <div class="disease">
      <h4>${d.name}</h4>
      <p><strong>Symptoms:</strong> ${d.symptoms}</p>
      <p><strong>Treatment:</strong> ${d.treatment}</p>
    </div>
  `).join('');
}

// --- Dashboard Stats ---
function updateDashboardStats() {
  document.getElementById('totalPatients').textContent = patients.length;
  const ongoingSurgeriesCount = patients.filter(p => p.surgeryStatus === "Ongoing").length;
  document.getElementById('ongoingSurgeries').textContent = ongoingSurgeriesCount;
  document.getElementById('activeMeds').textContent = medications.length;
}

// --- Dark Mode Toggle ---
document.getElementById('toggleDarkMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Initialize
showSection('dashboard');
updateDashboardStats();
updateMedicationPatientSelect();
renderDiseaseList(diseases);
