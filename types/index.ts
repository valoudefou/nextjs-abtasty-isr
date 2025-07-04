export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export interface FormProps {
  data: FormData;
  onUpdate: (field: keyof FormData, value: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  flagBirthField: boolean;
  onToggleFlag: () => void;
  pageTemplate: string;   // Add this line
}
