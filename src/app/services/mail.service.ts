'use server';

import transporter from "@/utils/nodemailerConfig";
import { Participant } from "../interfaces/app-interfaces";

  export async function sendEmail(giver: Participant, receiverName: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.MAILER_EMAIL,
        to: giver.email,
        subject: 'SORTEO SECRET SANTA',
        text: `Hola ${giver.name}, tú serás secret santa de ${receiverName}, felices fiestas!`
      });
    } catch (error) {
      console.error(error);
    }
  }