import { ParticipantTableProps } from "@/app/interfaces/app-interfaces";

import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import styles from './table.module.css'
import { red } from "@mui/material/colors";

export default function ParticipantsTable({ participants, onRemoveParticipant }: ParticipantTableProps) {
  return (
    <TableContainer component={Paper} className={styles.table}>
      <Table sx={{ minWidth: 650 }} size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>Nombre</TableCell>
            <TableCell align='center'>Email</TableCell>
            <TableCell align='center'>Familiares directos</TableCell>
            <TableCell align='center'>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participants.map((participant, index) => (
            <TableRow
              key={participant.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {participant.name}
              </TableCell>
              <TableCell align='center'>{participant.email}</TableCell>
              <TableCell align='center'>{participant.familyMembers?.join(', ')}</TableCell>
              <TableCell align='center'><Button variant='text' onClick={() => onRemoveParticipant(index)}><DeleteOutline sx={{ color: red[500] }} /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}