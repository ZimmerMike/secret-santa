"use client";

import Image from "next/image";
import { useState } from "react";

import { Participant, Assignment } from "./interfaces/app-interfaces";
import ParticipantsForm from "./ui/participants-form/participants-form";
import ParticipantsTable from "./ui/table/table";
import { sendEmail } from "./services/mail.service";
import styles from "./page.module.css";

import { Button } from "@mui/material";

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  /**
   * @description Adds a new participant to table.
   * @param name Name of participant.
   * @param email Email of participant (This can be used to send emails to every participant and keep the giveaway as secret).
   * @param familyMembers Array with participant's family members (previously registered) to avoid gifts between family.
   */
  function addParticipant(name: string, email: string, familyMembers: Array<string>): void {
    if (name.trim() !== "" && email.trim() !== "") {
      const newParticipant: Participant = {
        name,
        email,
        familyMembers,
        secretSantaHistory: [],
      };

      setParticipants([...participants, newParticipant]);
    }
  }

  /**
   * @description Assigns secret santa to every participant (If some of the constraints unables the application to assign all participants it shows an alert and only assign the rest of participants).
   */
  async function assignSecretSanta(): Promise<void> {
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
    const newAssignments: Assignment[] = [];

    shuffledParticipants.forEach((participant, index) => {
      const familyMembers = participant.familyMembers ?? [];
      let receiverIndex = index;
      let attempts = 0;

      while (true) {
        const isSelf = receiverIndex === shuffledParticipants.indexOf(participant);
        const isFamily = familyMembers.includes(shuffledParticipants[receiverIndex].name);
        const isAlreadyAssigned = newAssignments.some(assignment => assignment.receiverName === shuffledParticipants[receiverIndex].name);
        const isInHistory = shuffledParticipants[receiverIndex].secretSantaHistory?.slice(-3).includes(participant.name);

        if (!isSelf && !isFamily && !isAlreadyAssigned && !isInHistory) {
          break;
        }

        receiverIndex = (receiverIndex + 1) % shuffledParticipants.length;
        attempts++;

        if (attempts >= shuffledParticipants.length) {
          alert('No se pueden hacer asignaciones porque para algunos participantes no se cumple ninguna de las condiciones.');
          return;
        }
      }

      newAssignments.push({
        giver: participant,
        receiverName: shuffledParticipants[receiverIndex].name
      });
    });
    for (const assignment of newAssignments) {
      await sendEmail(assignment.giver, assignment.receiverName);
    }
    setAssignments(newAssignments);
  }

  /**
   * @description Removes a registered participant from the list.
   * @param index Index of participant to be removed.
   */
  function removeParticipant(index: number): void {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>SECRET SANTA</h1>
        <Image
          src="/santa.webp"
          width={200}
          height={200}
          alt="Santa claus"
          priority
        />
      </header>

      <section className={styles.container}>
        <ParticipantsForm
          participants={participants}
          onAddParticipant={addParticipant}
        />
      </section>

      <section className={styles.container}>
        {participants.length > 0 ? (
          <ParticipantsTable
            participants={participants}
            onRemoveParticipant={removeParticipant}
          />
        ) : null}
      </section>

      <Button
        className={styles.startBtn}
        onClick={assignSecretSanta}
        variant="contained"
        disabled={participants.length < 4}>
        Comenzar rifa
      </Button>
      {/* Tabla para mostrar las asignaciones de Secret Santa (solo puesta para ver los resultados al momento) */}
      {assignments.length > 0 && (
        <div>
          <h3>Assignments:</h3>
          <table>
            <thead>
              <tr>
                <th>Giver</th>
                <th>Receiver</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr key={index}>
                  <td>{assignment.giver.name}</td>
                  <td>{assignment.receiverName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
