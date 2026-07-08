const { Resend } = require("resend");

// Inicializa Resend con tu API Key de las variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Genera la plantilla HTML Premium para el correo de la cotización
 */
function generateQuotationHtml(quotation) {
  const {
    quoteNumber,
    contractorName,
    origin,
    destination,
    unitType,
    departureAt,
    returnAt,
    totalPrice,
    expiresAt,
  } = quotation;

  // Formateadores locales simples para el correo electrónico
  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";
  const formatPrice = (price) =>
    price
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(price)
      : "—";

  const mensajeWhatsapp = encodeURIComponent(
    `¡Hola! Me interesa proceder con la cotización Folio: ${quoteNumber}.\n\n` +
      `*Origen:* ${origin}\n` +
      `*Destino:* ${destination}\n` +
      `*Salida:* ${departureAt}\n` +
      `*Costo:* ${totalPrice}`
  );
  const whatsappUrl = `https://wa.me/525652657371?text=${mensajeWhatsapp}`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tu Cotización de Viaje - Experiencias por México</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; padding: 40px 10px;">
        <tr>
          <td align="center">
            <!-- Contenedor Principal Plano -->
            <table role="presentation" width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(1, 82, 140, 0.02);" cellspacing="0" cellpadding="0" border="0">
              
              <!-- Encabezado / Banner Institucional -->
              <tr>
                <td style="background-color: #01528C; padding: 32px; text-align: center;">
                  <!-- Reemplaza esta URL por el enlace real y público de tu logo -->
                  <img src="https://pruebapersonalirving.s3.us-east-2.amazonaws.com/LOGO+EXPERIENCIAS+MEXICO+VECTOR.png" alt="Experiencias por México" style="max-height: 60px; width: auto; display: inline-block; border: none; outline: none;" />
                </td>
              </tr>

              <!-- Cuerpo del Mensaje -->
              <tr>
                <td style="padding: 40px 32px 24px 32px;">
                  <span style="font-size: 12px; font-weight: 700; color: #A3BB13; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">Presupuesto de Servicio</span>
                  <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1E293B;">¡Hola, ${contractorName}!</h1>
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                    Hemos preparado la cotización para tu próximo viaje. En <strong>Experiencias por México</strong> estamos listos para ofrecerte un trayecto cómodo, seguro y de primer nivel.
                  </p>

                  <!-- Detalle de Folio -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; background-color: #F1F5F9; border-radius: 8px; padding: 12px 16px;">
                    <tr>
                      <td style="font-size: 14px; color: #475569; font-weight: 500;">Folio de Cotización:</td>
                      <td align="right" style="font-size: 14px; color: #01528C; font-weight: 700;">${quoteNumber}</td>
                    </tr>
                  </table>

                  <!-- Bloque del Itinerario -->
                  <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #01528C; text-transform: uppercase; letter-spacing: 0.03em;">🗺️ Detalles de tu Itinerario</h3>
                  
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; font-size: 14px; color: #64748B; border-bottom: 1px solid #F1F5F9;">📍 Origen</td>
                      <td align="right" style="padding: 10px 0; font-size: 14px; color: #1E293B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">${origin}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-size: 14px; color: #64748B; border-bottom: 1px solid #F1F5F9;">🏁 Destino</td>
                      <td align="right" style="padding: 10px 0; font-size: 14px; color: #01528C; font-weight: 600; border-bottom: 1px solid #F1F5F9;">${destination}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-size: 14px; color: #64748B; border-bottom: 1px solid #F1F5F9;">🚌 Tipo de Unidad</td>
                      <td align="right" style="padding: 10px 0; font-size: 14px; color: #1E293B; font-weight: 500; border-bottom: 1px solid #F1F5F9;">${
                        unitType?.name ?? "Unidad Especializada"
                      }</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-size: 14px; color: #64748B; border-bottom: 1px solid #F1F5F9;">📅 Fecha de Salida</td>
                      <td align="right" style="padding: 10px 0; font-size: 14px; color: #1E293B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">${formatDate(
                        departureAt
                      )}</td>
                    </tr>
                    ${
                      returnAt
                        ? `
                    <tr>
                      <td style="padding: 10px 0; font-size: 14px; color: #64748B; border-bottom: 1px solid #F1F5F9;">🔄 Fecha de Regreso</td>
                      <td align="right" style="padding: 10px 0; font-size: 14px; color: #1E293B; font-weight: 600; border-bottom: 1px solid #F1F5F9;">${formatDate(
                        returnAt
                      )}</td>
                    </tr>
                    `
                        : ""
                    }
                  </table>

                  <!-- Bloque de Precio Resaltado Estilo Ticket Premium -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(163, 187, 19, 0.04); border: 1px dashed rgba(163, 187, 19, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                    <tr>
                      <td>
                        <span style="font-size: 13px; color: #64748B; font-weight: 500; display: block; margin-bottom: 4px;">Inversión Total Garantizada</span>
                        <span style="font-size: 32px; color: #01528C; font-weight: 800; display: block; letter-spacing: -0.02em;">${formatPrice(
                          totalPrice
                        )}</span>
                        ${
                          expiresAt
                            ? `<span style="font-size: 12px; color: #E11D48; font-weight: 600; display: block; margin-top: 8px;">⏱️ Tarifa vigente hasta el ${formatDate(
                                expiresAt
                              )}</span>`
                            : ""
                        }
                      </td>
                    </tr>
                  </table>

                  <!-- Botón CTA Plano -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 16px;">
                    <tr>
                      <td align="center">
                        <a href="${whatsappUrl}" target="_blank"  style="background-color: #A3BB13; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; display: inline-block; transition: background-color 0.2s ease;">
                          Contactar a un Agente
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Pie de Página (Footer) -->
              <tr>
                <td style="padding: 0 32px 40px 32px; text-align: center; border-top: 1px solid #F1F5F9; pt: 24px;">
                  <p style="margin: 24px 0 0 0; font-size: 12px; color: #94A3B8; line-height: 1.5;">
                    Este es un correo automático de seguimiento. Si tienes dudas, puedes responder directamente a este email o comunicarte vía telefónica al número: +52 5652 6573 71 .
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; font-weight: 600; color: #01528C;">
                    © ${new Date().getFullYear()} Experiencias por México. Todos los derechos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Helper principal encargado de despachar el correo electrónico vía Resend
 */
async function sendQuotationEmail(quotation) {
  try {
    if (!quotation.contractorEmail) {
      console.warn(
        `[Resend] La cotización ${quotation.quoteNumber} no cuenta con correo de destino.`
      );
      return null;
    }

    const htmlContent = generateQuotationHtml(quotation);

    const response = await resend.emails.send({
      from: "Experiencias por México <cotizaciones@experienciaspormexico.com.mx>", // Configura aquí tu dominio verificado de Resend
      to: [quotation.contractorEmail],
      subject: `Tu Cotización de Viaje ${quotation.origin}- ${quotation.destination}  — Folio ${quotation.quoteNumber}`,
      html: htmlContent,
    });

    console.log(
      `[Resend] Correo de cotización enviado exitosamente para el folio: ${quotation.quoteNumber}`
    );
    return response;
  } catch (error) {
    console.error(
      `[Resend Error] No se pudo enviar el correo de la cotización:`,
      error
    );
    // Nota: No lanzamos el error para no romper la respuesta HTTP del usuario si la base de datos se actualizó correctamente
    return null;
  }
}

module.exports = {
  sendQuotationEmail,
};
