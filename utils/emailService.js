import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Nodemailer Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || 'jodhpurvoyageinde@gmail.com';
  const pass = process.env.SMTP_PASS || '';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send Booking / Quote Request Email Notification
 */
export const sendBookingNotificationEmail = async (bookingData) => {
  try {
    const senderEmail = process.env.SMTP_USER || 'jodhpurvoyageinde@gmail.com';
    const receiverEmail = process.env.EMAIL_TO || 'Info@jodhpurvoyage.com';

    const subject = `[Demande de Devis] ${bookingData.fullName} - ${bookingData.tourTitle || 'Voyage sur Mesure'}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
          .email-container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px 30px; color: #ffffff; text-align: center; border-bottom: 4px solid #d97706; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; color: #f59e0b; }
          .header p { margin: 6px 0 0; font-size: 14px; color: #cbd5e1; }
          .content { padding: 30px; }
          .badge { display: inline-block; padding: 4px 12px; background: #fef3c7; color: #b45309; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .info-table th, .info-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: left; font-size: 14px; }
          .info-table th { background-color: #f8fafc; color: #475569; font-weight: 600; width: 35%; }
          .info-table td { color: #0f172a; font-weight: 500; }
          .notes-box { background: #fffbebf5; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px; border-radius: 4px; font-style: italic; color: #78350f; font-size: 14px; }
          .footer { background: #f8fafc; padding: 18px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🕌 JODHPUR VOYAGE</h1>
            <p>Nouvelle Demande de Voyage Reçue</p>
          </div>
          <div class="content">
            <span class="badge">✈️ Devis / Réservation</span>
            <h2 style="margin-top:0; color:#0f172a; font-size:18px;">Détails de la demande de ${bookingData.fullName}</h2>
            
            <table class="info-table">
              <tr>
                <th>Nom Complet</th>
                <td>${bookingData.fullName}</td>
              </tr>
              <tr>
                <th>Email Client</th>
                <td><a href="mailto:${bookingData.email}">${bookingData.email}</a></td>
              </tr>
              <tr>
                <th>Téléphone</th>
                <td><a href="tel:${bookingData.phone}">${bookingData.phone}</a></td>
              </tr>
              <tr>
                <th>Pays</th>
                <td>${bookingData.country || 'Non spécifié'}</td>
              </tr>
              <tr>
                <th>Mode de Contact</th>
                <td>${bookingData.preferredContact || 'Email'}</td>
              </tr>
              <tr>
                <th>Circuit / Titre</th>
                <td><strong>${bookingData.tourTitle || 'Voyage Sur Mesure'}</strong></td>
              </tr>
              ${bookingData.destinations && bookingData.destinations.length > 0 ? `
              <tr>
                <th>Destinations</th>
                <td>${Array.isArray(bookingData.destinations) ? bookingData.destinations.join(', ') : bookingData.destinations}</td>
              </tr>` : ''}
              <tr>
                <th>Date de Départ</th>
                <td>${bookingData.departureDate || 'À définir'}</td>
              </tr>
              <tr>
                <th>Durée</th>
                <td>${bookingData.durationDays || 'À définir'}</td>
              </tr>
              <tr>
                <th>Nombre de Voyageurs</th>
                <td>${bookingData.adultsCount || 1} Adulte(s)${bookingData.childrenCount ? `, ${bookingData.childrenCount} Enfant(s)` : ''}</td>
              </tr>
              <tr>
                <th>Hébergement</th>
                <td>${bookingData.accommodationType || 'Hôtel de Charme / Haveli'}</td>
              </tr>
              ${bookingData.budgetPerPerson ? `
              <tr>
                <th>Budget / Pers.</th>
                <td>${bookingData.budgetPerPerson}</td>
              </tr>` : ''}
              ${bookingData.interests && bookingData.interests.length > 0 ? `
              <tr>
                <th>Centres d'intérêt</th>
                <td>${Array.isArray(bookingData.interests) ? bookingData.interests.join(', ') : bookingData.interests}</td>
              </tr>` : ''}
            </table>

            ${bookingData.notes ? `
            <div class="notes-box">
              <strong>Message / Remarques du client :</strong><br/>
              "${bookingData.notes}"
            </div>` : ''}
          </div>
          <div class="footer">
            Cet email a été envoyé automatiquement depuis le site web <strong>Jodhpur Voyage</strong>.<br/>
            Expéditeur: ${senderEmail} | Destinataire: ${receiverEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = createTransporter();
    const mailOptions = {
      from: `"Jodhpur Voyage Website" <${senderEmail}>`,
      to: receiverEmail,
      replyTo: bookingData.email,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email notification booking envoyé à ${receiverEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('⚠️ Erreur lors de l’envoi de l’email de réservation:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Contact Form Email Notification
 */
export const sendContactNotificationEmail = async (contactData) => {
  try {
    const senderEmail = process.env.SMTP_USER || 'jodhpurvoyageinde@gmail.com';
    const receiverEmail = process.env.EMAIL_TO || 'Info@jodhpurvoyage.com';

    const subject = `[Nouveau Message Contact] ${contactData.fullName} : ${contactData.subject || 'Demande d\'information'}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
          .email-container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px 30px; color: #ffffff; text-align: center; border-bottom: 4px solid #0284c7; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; color: #38bdf8; }
          .header p { margin: 6px 0 0; font-size: 14px; color: #cbd5e1; }
          .content { padding: 30px; }
          .badge { display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0369a1; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .info-table th, .info-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: left; font-size: 14px; }
          .info-table th { background-color: #f8fafc; color: #475569; font-weight: 600; width: 35%; }
          .info-table td { color: #0f172a; font-weight: 500; }
          .message-box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin-top: 20px; border-radius: 4px; color: #0c4a6e; font-size: 14px; line-height: 1.6; }
          .footer { background: #f8fafc; padding: 18px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🕌 JODHPUR VOYAGE</h1>
            <p>Nouveau Message Depuis le Formulaire de Contact</p>
          </div>
          <div class="content">
            <span class="badge">💬 Message de Contact</span>
            <h2 style="margin-top:0; color:#0f172a; font-size:18px;">Message transmis par ${contactData.fullName}</h2>
            
            <table class="info-table">
              <tr>
                <th>Nom Complet</th>
                <td>${contactData.fullName}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td><a href="mailto:${contactData.email}">${contactData.email}</a></td>
              </tr>
              <tr>
                <th>Téléphone</th>
                <td><a href="tel:${contactData.phone || ''}">${contactData.phone || 'Non renseigné'}</a></td>
              </tr>
              <tr>
                <th>Sujet</th>
                <td><strong>${contactData.subject || 'Demande générale'}</strong></td>
              </tr>
            </table>

            <div class="message-box">
              <strong>Message du visiteur :</strong><br/><br/>
              ${(contactData.message || '').replace(/\n/g, '<br/>')}
            </div>
          </div>
          <div class="footer">
            Cet email a été envoyé automatiquement depuis le formulaire de contact du site web <strong>Jodhpur Voyage</strong>.<br/>
            Expéditeur: ${senderEmail} | Destinataire: ${receiverEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = createTransporter();
    const mailOptions = {
      from: `"Jodhpur Voyage Contact" <${senderEmail}>`,
      to: receiverEmail,
      replyTo: contactData.email,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email notification contact envoyé à ${receiverEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('⚠️ Erreur lors de l’envoi de l’email de contact:', error.message);
    return { success: false, error: error.message };
  }
};
