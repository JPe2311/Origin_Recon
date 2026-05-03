import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';

admin.initializeApp();
const db = admin.firestore();

export const cancelAppointment = functions.https.onCall(async (request) => {
  const { appointmentId } = request.data as { appointmentId: string };
  const snap = await db.collection('appointments').doc(appointmentId).get();
  if (!snap.exists) throw new functions.https.HttpsError('not-found', 'Cita no encontrada');

  const appointment = snap.data()!;
  const now = Date.now();
  const start = new Date(appointment.date).getTime();
  const diffHours = (start - now) / 36e5;
  if (diffHours <= 48) throw new functions.https.HttpsError('failed-precondition', 'Solo se permite cancelar con >48h');

  await snap.ref.update({ status: 'cancelled', cancelledAt: admin.firestore.FieldValue.serverTimestamp() });
  return { ok: true };
});

export const markNoShow = functions.scheduler.onSchedule('every 15 minutes', async () => {
  const now = new Date().toISOString();
  const q = await db.collection('appointments').where('status', '==', 'scheduled').where('date', '<', now).get();
  const batch = db.batch();
  q.docs.forEach((d) => batch.update(d.ref, { status: 'no_show' }));
  await batch.commit();
});
