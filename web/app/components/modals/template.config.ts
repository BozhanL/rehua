// TODO:
// Remove and replace with api call at point of use once backend implemented
export interface DocumentTemplate {
  id: number;
  name: string;
}

export type TemplateCategory =
  'longterm' | 'shortterm' | 'palliative' | 'daycare';

const templatesByCategory: Record<TemplateCategory, DocumentTemplate[]> = {
  longterm: [
    { id: 1, name: 'Admission Checklist Form' },
    { id: 2, name: 'Admission Notification Form' },
    { id: 3, name: 'Patient Information Form' },
    { id: 4, name: 'Consent Form (Long Term, CPR Status)' },
    { id: 5, name: 'Initial Assessment Form' },
    { id: 6, name: 'Dietary Form' },
    { id: 7, name: 'Braden Scale' },
    { id: 8, name: 'Pain Assessment' },
    { id: 9, name: '6 Monthly Long Term Care Plan' },
    { id: 10, name: 'Client Satisfaction Questionnaire' },
  ],
  shortterm: [
    { id: 11, name: 'Admission Discharge Form' },
    { id: 12, name: 'Patient Information Form' },
    { id: 13, name: 'Consent Form (Short Term, CPR Status)' },
    { id: 14, name: 'Short Term Stay Assessment' },
    { id: 15, name: 'Short Term Care Plan (Medical Issue)' },
    { id: 16, name: 'Discharge Letter' },
    { id: 17, name: 'Client Satisfaction Questionnaire' },
  ],
  palliative: [
    { id: 18, name: 'Admission Discharge Form' },
    { id: 19, name: 'Patient Information Form' },
    { id: 20, name: 'Consent Form (Palliative, CPR Status)' },
    { id: 21, name: 'Pain Assessment' },
    { id: 22, name: 'Quality of Life (Palliative) Care Plan' },
    { id: 23, name: 'Notice of Death' },
  ],
  daycare: [
    { id: 24, name: 'Day Club Service Agreement Form' },
    { id: 25, name: 'Patient Information Form (Day Club)' },
    { id: 26, name: 'Consent Form (Day Club Clients Only)' },
    { id: 27, name: 'Initial Assessment Form (Community Day Programme)' },
    { id: 28, name: 'Client Satisfaction Questionnaire' },
  ],
};

export default templatesByCategory;
