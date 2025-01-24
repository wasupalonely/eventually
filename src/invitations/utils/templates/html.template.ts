import { Event } from 'src/events/entities/event.entity';
import { EventType } from 'src/events/enums/event-type.enum';
import { Guest } from 'src/guests/entities/guest.entity';
import { Invitation } from '../../entities/invitation.entity';
import * as moment from 'moment';

export const generateEmailHtml = (
  guest: Guest,
  event: Event,
  invitation: Invitation,
): string => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background-color: #f9f9f9;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #4caf50;
              margin: 0;
            }
            .content {
              margin-bottom: 20px;
            }
            .qr-code {
              text-align: center;
              margin: 20px 0;
            }
            .qr-code img {
              max-width: 200px;
            }
            .button {
              display: block;
              width: 100%;
              text-align: center;
              margin: 20px 0;
            }
            .button a {
              text-decoration: none;
              background-color: #4caf50;
              color: #fff;
              padding: 12px 20px;
              border-radius: 5px;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Estás Invitado!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${guest.name}</strong>,</p>
              <p>
                Estás invitado al evento <strong>${event.name}</strong>.
              </p>
              ${
                event.type === EventType.IN_PERSON
                  ? `<p>Este será el <strong>${moment(event.startDate).format('D [de] MMMM [de] YYYY')}</strong> en <strong>${event.location}</strong>.</p>`
                  : event.type === EventType.VIRTUAL
                    ? `<p>Este será el <strong>${moment(event.startDate).format('D [de] MMMM [de] YYYY')}</strong> a través de <strong>${event.url}</strong>.</p>`
                    : `<p>Este será el <strong>${moment(event.startDate).format('D [de] MMMM [de] YYYY')}</strong> en <strong>${event.location}</strong> y a través de <strong>${event.url}</strong>.</p>`
              }
              <p>
                Escanea el código QR adjunto para más detalles o confirma tu asistencia
                haciendo clic en el enlace a continuación:
              </p>
            </div>
            <div class="qr-code">
              <img src="${invitation.qrCodeUrl}" alt="Código QR" />
            </div>
            <div class="button">
              <a href="${invitation.confirmationUrl}" target="_blank">Confirmar Asistencia</a>
            </div>
            <div class="footer">
              <p>¡Te esperamos con mucha emoción!</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
