"use client";

import { useState } from "react";

import styles from "./page.module.css";
import ParticipantsForm from "./ui/participants-form/participants-form";
import ParticipantsTable from "./ui/table/table";
import { Participant, Assignment } from "./interfaces/app-interfaces";
import { Button } from "@mui/material";
import Image from "next/image";

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const available = participants.slice();

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
  function assignSecretSanta(): void {
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
    const newAssignments: Assignment[] = [];

    shuffledParticipants.forEach((participant, index) => {
      const familyMembers = participant.familyMembers ?? [];
      let receiverIndex = index;
      let attempts = 0;

      while (
        receiverIndex === shuffledParticipants.indexOf(participant) ||
        shuffledParticipants[receiverIndex].secretSantaHistory?.includes(participant.name) ||
        familyMembers?.includes(shuffledParticipants[receiverIndex].name) ||
        newAssignments.some(assignment => assignment.receiver === shuffledParticipants[receiverIndex].name)
      ) {
        receiverIndex = (receiverIndex + 1) % shuffledParticipants.length;
        attempts++;

        if (attempts >= shuffledParticipants.length) {
          alert('No se pueden hacer asignaciones válidas.');

          return;
        }
      }

      newAssignments.push({
        giver: participant.name,
        receiver: shuffledParticipants[receiverIndex].name
      });
    });

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
      >
        Comenzar rifa
      </Button>
      {/* Tabla para mostrar las asignaciones de Secret Santa */}
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
                  <td>{assignment.giver}</td>
                  <td>{assignment.receiver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
