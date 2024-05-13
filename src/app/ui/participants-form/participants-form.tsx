import { useState } from 'react';

import { Button, Card, Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { ErrorOutlineOutlined } from '@mui/icons-material';

import { ParticipantsFormProps } from '@/app/interfaces/app-interfaces';
import styles from "./participants-form.module.css";
import { red } from '@mui/material/colors';

export default function ParticipantsForm({ onAddParticipant, participants }: ParticipantsFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [familyMemberNames, setFamilyMemberNames] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * @description Adds new participant to list, validates and updates the registered participants
   */
  function addParticipant(): void {
    if (participants.some((participant) => participant.email === email)) {
      setErrorMessage('El participante ya está registrado.');
      return;
    }

    if (name.trim() !== '' && email.trim() !== '') {
      onAddParticipant(name, email, familyMemberNames);
      setName('');
      setEmail('');
      setFamilyMemberNames([]);
    }

    for (const participant of participants) {
      if (familyMemberNames.includes(participant.name)) {
        if (!participant.familyMembers) {
          participant.familyMembers = [];
        }
        participant.familyMembers.push(name);
      }
    }

    setName('');
    setEmail('');
    setFamilyMemberNames([]);
    setErrorMessage('');
  };

  return (
    <main className={styles.container}>
      <Card className={styles.card}>
        <TextField
          type='text'
          required
          variant='outlined'
          label='Nombre'
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: '250px' }}
        />
        {/* TODO: Arreglar validacion de campo tipo email */}
        <TextField
          type='email'
          required
          variant='outlined'
          label='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: '250px' }}
        />
        <FormControl sx={{ width: '250px' }}>
          <InputLabel id='family-members-selector-label'>
            Familiares directos
          </InputLabel>
          <Select
            labelId='family-members-selector-label'
            id='demo-multiple-checkbox'
            multiple
            disabled={!(participants.length > 0)}
            value={familyMemberNames}
            onChange={(e) => setFamilyMemberNames(e.target.value as Array<string>)}
            renderValue={(selected) => (selected as string[]).join(', ')}
            input={<OutlinedInput label='Familiares directos' />}
          >
            {participants.map((participant, index) => (
              <MenuItem key={index} value={participant.name}>
                <Checkbox
                  checked={familyMemberNames.includes(participant.name)}
                />
                {participant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          disabled={!(name && email)}
          onClick={addParticipant}
          variant='outlined'
          sx={{ width: '250px' }}>
          Añadir Participante
        </Button>
      </Card>
      {errorMessage && <div className={styles.errorMsgContainer}><ErrorOutlineOutlined sx={{ color: red[500] }} /> <p style={{ color: 'red' }}>{errorMessage}</p></div>}
    </main>
  );
}