export interface Participant {
  name: string;
  email: string;
  familyMembers?: Array<string>;
  secretSantaHistory?: Array<string>;
}

export interface ParticipantsFormProps {
  onAddParticipant: (name: string, email: string, familyMembers: Array<string>) => void;
  participants: Array<Participant>;
}

export interface ParticipantTableProps {
  onRemoveParticipant: (index: number) => void;
  participants: Participant[];
}

export interface Assignment {
  giver: string;
  receiver: string;
}