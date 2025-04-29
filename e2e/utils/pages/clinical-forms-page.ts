import { expect, type Page } from '@playwright/test';
import { delay } from './home-page';

export const treatmentInformationAndInstructions = `Condition Diagnosed: Hypertension.\nTake the medication once daily in the morning, preferably at the same time each day to maintain consistency.`;
export const reasonsToContactDoctor = `Persistent headaches, blurred vision, or dizziness that does not improve.`;
export const updatedReasonsToContactDoctor = `Persistent headaches, blurred vision, and dizziness that does not improve.`;
export const dischargeMedications = `Aspirin 81 mg (Antiplatelet).\nDosage: Take 1 tablet by mouth once a day.\nInstructions: Take with food to avoid stomach upset.`;
export const updatedDischargeMedications = `Aspirin 81 mg (Antiplatelet).\nDosage: Take 2 tablets by mouth once a day.\nInstructions: Take with food to avoid stomach upset.`;
export const followUpAppointment = `Date: March 10, 2025.\nTime: 10:30 AM.\nLocation: ABC Medical Center, Room 205.\nProvider: Dr. Allen Hanandez, Cardiologist.`;
export const updatedFollowUpAppointment = `Date: March 14, 2025.\nTime: 11:30 AM.\nLocation: ABC Medical Center, Room 205.\nProvider: Dr. Allen Hanandez, Cardiologist.`;
export const additionalInstructions = `Aim for at least 30 minutes of moderate exercise, such as walking or swimming, 5 days a week.`;
export const updatedAdditionalInstructions = `Aim for at least 25 minutes of moderate exercise, such as walking or swimming, 5 days a week.`;
export const visitNote = `Continue current antihypertensive regimen. Home blood pressure monitoring and follow-up in 2 months.`;
export const updatedVisitNote = `Continue current antihypertensive regimen. Home blood pressure monitoring and follow-up in 1 month.`;
export const procedure = `A sterile spinal needle (20-gauge or appropriate size) was inserted into the L3-L4 interspace, aiming toward the midline, and advanced gently until cerebrospinal fluid (CSF) was obtained.`;
export const indication = `Suspicious skin lesion (possible melanoma).`;
export const consent = `Patient verbally agreed to proceed and understands the procedure, including potential complications (e.g., headache, bleeding, infection).`;
export const updatedConsent = `The procedure was thoroughly explained to the patient, including its purpose, risks, and potential complications (e.g., bleeding, infection, scarring).`;
export const physcian = `Dr. Sarah Hanandez, MD`;
export const complications = `No excessive bleeding, signs of infection, or other complications were noted at the time of the procedure`;
export const updatedComplications = `The patient tolerated the procedure well`;
export const procedureSummary = `The patient was positioned in a reclining chair with the right arm exposed for easy access to the lesion.`;
export const updatedProcedureSummary = `1% lidocaine was injected around the lesion to anesthetize the area, and the patient tolerated this well without any discomfort.`;
export const consultations = `Consultation was requested for evaluation of chest pain. The chest pain was confirmed was non-cardiac in origin and attributed it to a musculoskeletal issue.`;
export const updatedConsultations = `No further cardiology intervention was required.`;
export const hospitalCourse = `The patient was admitted for evaluation of acute chest pain and fever.`;
export const updatedHospitalCourse = `The patient was started on pain management for musculoskeletal chest pain and received supportive care for fever.`;
export const dischargeTo = `The patient is being discharged to home with family support.`;
export const dischargeInstructions = `Rest and avoid heavy physical exertion for the next 7 days.Gradually resume normal activities as tolerated,`;
export const updatedDischargeInstructions = `Resume a regular diet. No special restrictions.`;
export const preOperativeDiagnosis = `Acute appendicitis.`;
export const postOperativeDiagnosis = `Acute suppurative Appendicitis.`;
export const specimens = `Appendix sent for histopathological examination.`;
export const updatedSpecimens = `Appendix sent for histopathological examination, results expected in 2 days.`;
export const postOperativeInstructions = `Pain management with paracetamol and morphine as needed.`;
export const updatedPostOperativeInstructions = `Pain management with paracetamol and morphine as needed. Follow-up after 48 hours for reassessment.`;
export const subjectiveFindings = `Patient reports feeling dizzy and fatigued in the mornings. He mentions that this started after starting a new antihypertensive medication (lisinopril 10mg daily) one week ago.`;
export const updatedSubjectiveFindings = `Patient reports improvement in dizziness and fatigue since the lisinopril dose was reduced. No new symptoms reported.`;
export const objectiveFindings = `Labs: Normal renal function, potassium slightly elevated at 5.2 mmol/L.`;
export const updatedObjectiveFindings = `BP: 112/74 mmHg, potassium level now within normal limits at 4.6 mmol/L.`;
export const assessment = `Dizziness likely secondary to overmedication with lisinopril, possibly compounded by sensitivity to ACE inhibitors.`;
export const updatedAssessment = `Symptoms improved with dose adjustment; patient responding well to lower dose of lisinopril.`;
export const plan = `Follow-up via telehealth in 7 days.`;
export const updatedPlan = `Continue lisinopril 5mg daily. Recheck labs and BP in 2 weeks. Schedule in-person follow-up in 1 month.`;
export const attendingPhysician = `Dr. Emily Tran`;
export const updatedAttendingPhysician = `Dr. Michael Reyes`;
export const admittingDiagnosis = `Community-acquired pneumonia, improving; rule out secondary bacterial infection.`;
export const updatedAdmittingDiagnosis = `Pneumonia resolved; transitioning to oral antibiotics and planning for discharge.`;
export const consults = `Infectious Disease`;
export const updatedConsults = `Pulmonology`;

export class ClinicalFormsPage {
  constructor(readonly page: Page) {}

  readonly formsTable = () => this.page.getByRole('table', { name: /forms/i });

  async navigateToClinicalForms() {
    await this.page.getByRole('button', { name: /clinical forms/i }).click();
    await expect(this.page.getByRole('cell', { name: /discharge instructions/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /discharge summary/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /procedure note/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /visit note/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /surgical operation/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /soap note template/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /ward admission/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /laboratory test results/i, exact: true })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: /visit note/i, exact: true })).toBeVisible();
  }

  async navigateToVisitNoteForm() {
    await this.page.getByText(/Visit Note/).click();
    await expect(this.page.getByText(/Visit Note/)).toBeVisible();
  }

  async navigateToWardAdmissionForm() {
    await this.page.getByText(/Ward Admission/).click();
    await expect(this.page.getByText(/Ward Request/)).toBeVisible();
  }

  async navigateToSurgicalOperationForm() {
    await this.page.getByText(/surgical operation/i).click();
    await expect(this.page.getByText(/surgical operation/i).first()).toBeVisible();
  }

  async navigateToDischargeInstructionsForm() {
    await this.page.getByText(/discharge instructions/i).click();
    await expect(this.page.getByText(/discharge instructions/i)).toBeVisible();
  }

  async navigateToDischargeSummaryForm() {
    await this.page.getByText(/discharge summary/i).click();
    await expect(this.page.getByText(/discharge summary/i)).toBeVisible();
  }

  async navigateToProcedureNoteForm() {
    await this.page.getByText(/procedure note/i).click();
    await expect(this.page.getByText(/procedure note/i)).toBeVisible();
  }

  async navigateToSOAPNoteForm() {
    await this.page.getByText(/soap note template/i).click();
    await expect(this.page.getByText(/soap note template/i)).toBeVisible();
  }

  async navigateToEncounterPage() {
    await this.page.getByRole('tab', { name: /Encounters/, exact: true }).first().click();
  }

  async navigateToNotesPage() {
    await this.page.getByRole('tab', { name: 'Notes', exact: true }).first().click();
  }

  async fillVisitNoteForm() {
    await this.page.locator('#visitNote').fill(visitNote);
  }

  async updateVisitNote() {
    await this.page.getByRole('tab', { name: /Encounters/, exact: true }).first().click();
    await this.page.getByRole('button', { name: /expand current row/i }).click();
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.locator('#visitNote').fill(updatedVisitNote);
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText(/error/i)).not.toBeVisible();
    await expect(this.page.getByText(/record updated/i)).toBeVisible(), delay(2000);
  }

  async deleteEncounter() {
    await this.page.getByRole('button', { name: /danger delete this encounter/i }).click();
    await this.page.getByRole('button', { name: 'danger Delete', exact: true }).click(), delay(2000);
    await expect(this.page.getByText(/the encounter has been deleted successfully/i)).toBeVisible(), delay(2000);
  }

  async fillDischargeInstructionsForm() {
    await this.page.locator('#dischargeInstructionsTIIs').fill(treatmentInformationAndInstructions);
    await this.page.locator('#dischargeInstructionsRCDs').fill(reasonsToContactDoctor);
    await this.page.locator('#dischargeInstructionsDischargeMedications').fill(dischargeMedications);
    await this.page.locator('#dischargeInstructionsFollowUpAppointments').fill(followUpAppointment);
    await this.page.locator('#dischargeInstructionsAdditionalInstructions').fill(additionalInstructions);
  }

  async fillWardAdmissionForm() {
    await this.page.getByRole('group', { name: /inpatient patient disposition/i }).locator('span').nth(2).click();
    await this.page.getByRole('combobox', { name: /admitted to location/i}).click();
    await this.page.getByLabel(/choose an item/i).getByText(/inpatient ward/i).click();
    await this.page.getByRole('combobox', { name: /bed assignment/i }).click();
    await this.page.getByRole('option', { name: /medical surgical/i }).locator('div').click();
    await this.page.locator('#attendingPhysician').fill(attendingPhysician);
    await this.page.locator('#admittingDiagnosis').fill(admittingDiagnosis);
    await this.page.getByRole('combobox', { name: /code status/i }).click();
    await this.page.getByRole('option', { name: /comfort measures/i }).locator('div').click();
    await this.page.getByRole('combobox', { name: /vitals/i }).click();
    await this.page.getByRole('option', { name: /per shift/i }).locator('div').click();
    await this.page.getByRole('combobox', { name: /activity/i }).click();
    await this.page.getByRole('option', { name: /strict bedrest/i }).locator('div').click();
    await this.page.getByRole('combobox', { name: /nursing orders/i }).click();
    await this.page.getByRole('option', { name: /elevate head of bed/i }).locator('div').click();
    await this.page.getByRole('combobox', { name: /diet/i }).click();
    await this.page.getByText(/regular diet/i).click();
    await this.page.getByRole('combobox', { name: /medications/i }).click();
    await this.page.getByRole('option', { name: /perform medication/i }).locator('div').click();
    await this.page.locator('#consults').fill(consults);
  }

  async updateWardRequest() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.getByRole('combobox', { name: /bed assignment/i }).click();
    await this.page.getByRole('option', { name: /intensive care/i }).locator('div').click();
    await this.page.locator('#attendingPhysician').fill(updatedAttendingPhysician);
    await this.page.locator('#admittingDiagnosis').fill(updatedAdmittingDiagnosis);
    await this.page.getByRole('combobox', { name: /code status/i }).click();
    await this.page.getByRole('option', { name: /full code/i }).locator('div').click();
    await this.page.getByRole('combobox', { name: /nursing orders/i }).click();
    await this.page.getByRole('option', { name: /daily weights/i }).locator('div').click();
    await this.page.locator('#consults').fill(updatedConsults);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async updateDischargeInstructions() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.locator('#dischargeInstructionsRCDs').fill(updatedReasonsToContactDoctor);
    await this.page.locator('#dischargeInstructionsDischargeMedications').fill(updatedDischargeMedications);
    await this.page.locator('#dischargeInstructionsFollowUpAppointments').fill(updatedFollowUpAppointment);
    await this.page.locator('#dischargeInstructionsAdditionalInstructions').fill(updatedAdditionalInstructions);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async fillProcedureNoteForm() {
    await this.page.locator('#procedureNoteProcedure').fill(procedure);
    await this.page.locator('#procedureNoteIndication').fill(indication);
    await this.page.getByRole('spinbutton', { name: /month, date/i }).fill('04');
    await this.page.getByRole('spinbutton', { name: /day, date/i }).fill('22');
    await this.page.getByRole('spinbutton', { name: /year, date/i }).fill('2025');
    await this.page.locator('#procedureNotePhysician').fill(physcian);
    await this.page.locator('#procedureNoteConsent').fill(consent);
    await this.page.locator('label').filter({ hasText: /local anesthesia and sedation/i }).locator('span').first().click();
    await this.page.locator('#procedureNoteProcedureSummary').fill(procedureSummary);
    await this.page.locator('#procedureNoteComplications').fill(complications);
  }

  async updateProcedureNote() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.getByRole('spinbutton', { name: /month, date/i }).fill('03');
    await this.page.getByRole('spinbutton', { name: /day, date/i }).fill('24')
    await this.page.locator('#procedureNoteConsent').fill(updatedConsent);
    await this.page.locator('label').filter({ hasText: /monitored anesthesia care/i }).locator('span').first().click();
    await this.page.locator('#procedureNoteProcedureSummary').fill(updatedProcedureSummary);
    await this.page.locator('#procedureNoteComplications').fill(updatedComplications);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async fillSOAPNoteForm() {
    await this.page.locator('#SOAPSubjectiveFindings').fill(subjectiveFindings);
    await this.page.locator('#SOAPObjectiveFindings').fill(objectiveFindings);
    await this.page.locator('#SOAPAssessment').fill(assessment);
    await this.page.locator('#SOAPPlan').fill(plan);
  }

  async updateSOAPNoteForm() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.locator('#SOAPSubjectiveFindings').fill(updatedSubjectiveFindings);
    await this.page.locator('#SOAPObjectiveFindings').fill(updatedObjectiveFindings);
    await this.page.locator('#SOAPAssessment').fill(updatedAssessment);
    await this.page.locator('#SOAPPlan').fill(updatedPlan);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async fillDischargeSummaryForm() {
    await this.page.getByRole('spinbutton', { name: /month, admission date/i }).fill('04');
    await this.page.getByRole('spinbutton', { name: /day, admission date/i }).fill('23');
    await this.page.getByRole('spinbutton', { name: /year, admission date/i }).fill('2025');
    await this.page.getByRole('spinbutton', { name: /month, discharge date/i }).fill('04');
    await this.page.getByRole('spinbutton', { name: /day, discharge date/i }).fill('24');
    await this.page.getByRole('spinbutton', { name: /year, discharge date/i }).fill('2025');
    await this.page.getByRole('combobox', { name: /diagnosis/i }).click();
    await this.page.getByText(/acute cholecystitis/i).click();
    await this.page.locator('#dischargeSummaryProcedures').fill(procedure);
    await this.page.locator('#dischargeSummaryConsultations').fill(consultations);
    await this.page.locator('#dischargeSummaryHospitalCourse').fill(hospitalCourse);
    await this.page.locator('#dischargeSummaryDischargeTo').fill(dischargeTo);
    await this.page.locator('#dischargeSummaryDischargeMedication').fill(dischargeMedications);
    await this.page.locator('#dischargeSummaryDischargeInstructions').fill(dischargeInstructions);
  }

  async updateDischargeSummary() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.getByRole('spinbutton', { name: /month, admission date/i }).fill('03');
    await this.page.getByRole('spinbutton', { name: /day, admission date/i }).fill('22');
    await this.page.getByRole('spinbutton', { name: /day, discharge date/i }).fill('21');
    await this.page.getByRole('combobox', { name: /diagnosis/i }).click();
    await this.page.getByText(/acute peptic ulcer with perforation/i).click();
    await this.page.locator('#dischargeSummaryConsultations').fill(updatedConsultations);
    await this.page.locator('#dischargeSummaryHospitalCourse').fill(updatedHospitalCourse);
    await this.page.locator('#dischargeSummaryDischargeMedication').fill(updatedDischargeMedications);
    await this.page.locator('#dischargeSummaryDischargeInstructions').fill(updatedDischargeInstructions);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async fillSurgicalOperationForm() {
    await this.page.getByRole('textbox', { name: /pre-operative diagnos/i }).fill(preOperativeDiagnosis);
    await this.page.getByRole('textbox', { name: /post-operative diagnosis/i }).fill(postOperativeDiagnosis);
    await this.page.getByRole('textbox', { name: /procedure/i }).fill('Laparoscopic appendectomy');
    await this.page.getByRole('textbox', { name: /assistants/i }).fill('Nurse Alex Johnson');
    await this.page.locator('label').filter({ hasText: /general/i }).locator('span').first().click();
    await this.page.getByRole('spinbutton', { name: /estimated blood loss/i }).fill('2');
    await this.page.getByRole('textbox', { name: /complications/i }).fill('None');
    await this.page.getByRole('textbox', { name: /specimens/i }).fill(specimens);
    await this.page.getByRole('textbox', { name: /surgeon/i }).fill('Dr. Jane Smith');
    await this.page.getByRole('spinbutton', { name: /month, time of procedure/i }).fill('04');
    await this.page.getByRole('spinbutton', { name: /day, time of procedure/i }).fill('23');
    await this.page.getByRole('spinbutton', { name: /year, time of procedure/i }).fill('2025');
    await this.page.getByRole('textbox', { name: /post-operative instructions/i }).fill(postOperativeInstructions);
  }

  async updateSurgicalOperation() {
    await this.page.getByRole('button', { name: /edit this encounter/i }).click();
    await this.page.getByRole('textbox', { name: /assistants/i }).fill('Nurse Alex JohnBosco');
    await this.page.locator('label').filter({ hasText: /monitored anesthesia care/i }).locator('span').first().click();
    await this.page.getByRole('spinbutton', { name: /estimated blood loss/i }).fill('1');
    await this.page.getByRole('textbox', { name: /specimens/i }).fill(updatedSpecimens);
    await this.page.getByRole('textbox', { name: /surgeon/i }).fill('Dr. John Smith');
    await this.page.getByRole('spinbutton', { name: /month, time of procedure/i }).fill('04');
    await this.page.getByRole('spinbutton', { name: /day, time of procedure/i }).fill('24');
    await this.page.getByRole('spinbutton', { name: /year, time of procedure/i }).fill('2025');
    await this.page.getByRole('textbox', { name: /post-operative instructions/i }).fill(updatedPostOperativeInstructions);
    await this.page.getByRole('button', { name: /save/i }).click(), delay(2000);
  }

  async saveForm() {
    await this.page.getByRole('button', { name: /save/i }).click();
    await expect(this.page.getByText(/error/i)).not.toBeVisible();
    await expect(this.page.getByText(/form submitted successfully/i)).toBeVisible(), delay(2000);
  }
}
